'use strict';

const Hapi = require('@hapi/hapi');
const HapiOpenAPI = require('hapi-openapi');
const Path = require('path');
// const Db = require('./models')
// const Enums = require('./models/lib/enums')
const Config = require('../config/default.json');
const Logger = require('@@mojaloop/central-services-shared').Logger;

const openAPIOptions = {
    api: Path.resolve(__dirname, './interface/swagger.json'),
    handlers: Path.resolve(__dirname, './handlers')
};

const defaultConfig = {
    port: Config.PORT,
    // cache: [
    //   {
    //     name: 'memCache',
    //     engine: require('catbox-memory'),
    //     partition: 'cache'
    //   }
    // ] // ,
    debug: {
        request: ['error'],
        log: ['error']
    }
};

// async function connectDatabase () {
//   try {
//     let db = await Db.connect(Config.DATABASE_URI)
//     return db
//   } catch (e) {
//     throw e
//   }
// }

const createServer = async function (config, openAPIPluginOptions) {
    try {
        const server = new Hapi.Server(config);
        // await connectDatabase()
        await server.register([{
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

        await server.start();
        return server;
    } catch (e) {
        Logger(e);
    }
};

const initialize = async (config = defaultConfig, openAPIPluginOptions = openAPIOptions) => {
    const server = await createServer(config, openAPIPluginOptions);
    if (server) {
        try {
            server.plugins.openapi.setHost(server.info.host + ':' + server.info.port);
            server.log('info', `Server running on ${server.info.host}:${server.info.port}`);
            return server;
        } catch (e) {
            server.log('error', e.message);
        }
    }
};

module.exports = {
    initialize
};
