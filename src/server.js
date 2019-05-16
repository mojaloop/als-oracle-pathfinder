'use strict';

const Hapi = require('@hapi/hapi');
const HapiOpenAPI = require('hapi-openapi');
const Path = require('path');
const Config = require('../config/default');
const Logger = require('@mojaloop/central-services-shared').Logger;
const Database = require('./db');
const Pathfinder = require('@lib/pathfinder');

const openAPIOptions = {
    api: Path.resolve(__dirname, './swagger.json'),
    handlers: Path.resolve(__dirname, './handlers')
};

const createServer = async function (config, openAPIPluginOptions) {
    try {
        const server = new Hapi.Server(config.server);
        await server.register([
            {
                plugin: HapiOpenAPI,
                options: openAPIPluginOptions
            },
            {
                plugin: require('./utils/logger-plugin')
            }
        ]);

        server.ext([
            {
                type: 'onPreHandler',
                method: (request, h) => {
                    server.log('request', request);
                    return h.continue;
                }
            },
            {
                type: 'onPreResponse',
                method: (request, h) => {
                    if (!request.response.isBoom) {
                        server.log('response', request.response);
                    } else {
                        const error = request.response;
                        let errorMessage = {
                            errorInformation: {
                                errorCode: error.statusCode,
                                errorDescription: error.message
                            }
                        };
                        error.message = errorMessage;
                        error.reformat();
                    }
                    return h.continue;
                }
            }
        ]);

        // Create database, pathfinder and append them to server.app
        const db = new Database(config.db);
        const pf = new Pathfinder(config.pathfinder);
        await pf.connect();
        server.app.db = db;
        server.app.pf = pf;

        // add a health-check endpoint on /
        server.app.healthCheck = async () => {
            // Check pathfinder, database connectivity is ok
            try {
                await server.app.pf.query('');
            } catch(err) {
                return { message: `Pathfinder module error: ${err.message}` };
            }
            if (!(await server.app.db.isConnected())) {
                return { message: 'Database not connected' };
            }
            return;
        };
        server.route({
            method: 'GET',
            path: '/',
            handler: async (req, h) => {
                const res = await req.server.app.healthCheck();
                if (res) {
                    return h.response({ ...res, statusCode: 500, error: 'Internal Server Error' }).code(500);
                }
                return h.response().code(200);
            }
        });

        await server.start();
        return server;
    } catch (e) {
        Logger.error(e);
    }
};

const initialize = async () => {
    const config = await Config.init();
    const server = await createServer(config, openAPIOptions);

    // Perform initial healthcheck
    const unhealthy = await server.app.healthCheck();
    if (unhealthy) {
        throw new Error(unhealthy.message);
    }

    if (server) {
        try {
            server.plugins.openapi.setHost(server.info.host + ':' + server.info.port);
            server.log('info', `Server running on ${server.info.host}:${server.info.port}`);
            return server;
        } catch (e) {
            server.log('error', e);
            throw e;
        }
    }
};

try {
    initialize();
} catch (e) {
    Logger.error(e);
}
