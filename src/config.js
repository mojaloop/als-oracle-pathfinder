'use strict';

// Duplicate the .template.env file from the root directory to .env. Now change values as required
// for your environment. The functionality in this module will read values from that .env file.

const path = require('path');
const fs = require('fs');
const promisify = require('util').promisify;

const rootDir = path.resolve(__dirname, '../');
require('dotenv').config({ path: path.resolve(__dirname, `${rootDir}/.env`) });

const defaultConf = {
    server: {
        port: process.env.SERVER_PORT
    },
    alsDb: {
        host: process.env.DB_HOST,
        database: process.env.DB_NAME_ACCOUNT_LOOKUP,
        user: process.env.DB_USER,
        port: process.env.DB_PORT,
        password: process.env.DB_PASSWORD
    },
    db: {
        host: process.env.DB_HOST,
        database: process.env.DB_NAME_CENTRAL_LEDGER,
        user: process.env.DB_USER,
        port: process.env.DB_PORT,
        password: process.env.DB_PASSWORD
    },
    pathfinder: {
        tls: {
            host: process.env.PATHFINDER_TLS_HOST,
            port: process.env.PATHFINDER_TLS_PORT,
            rejectUnauthorized: process.env.PATHFINDER_REJECT_UNAUTHORIZED.toLowerCase() !== 'false'
        },
        // The timeout for a query issued to the pathfinder module. This is *not* a timeout on a
        // query to the third-party pathfinder service.
        queryTimeoutMs: process.env.PATHFINDER_QUERY_TIMEOUT_MS,
        // Maximum rate we'll supply queries to pathfinder
        maxQueriesPerSecond: process.env.PATHFINDER_MAX_QUERIES_PER_SECOND,
        // Frequency of dummy keepalive messages to pathfinder.
        keepAliveIntervalMs: process.env.PATHFINDER_KEEPALIVE_INTERVAL_MS,
        // The timeout for a query issued to the pathfinder service.
        pathfinderTimeoutMs: process.env.PATHFINDER_TIMEOUT_MS
    },
    secrets: {
        // Our secret key
        key: process.env.PATHFINDER_CLIENT_KEY_FILEPATH, // "../secrets/clientkey.pem",
        // The cert we'll use to identify ourselves to the pathfinder service
        cert: process.env.PATHFINDER_CLIENT_CERT_FILEPATH, // "../secrets/clientcert.pem",
        // Pathfinder's cert, we'll use this to authenticate pathfinder.
        ca: process.env.PATHFINDER_CERT_FILEPATH, // "../secrets/pathfindercert.pem"
        // Pathfinder's certificate chain, including intermediate certificates
        chain: process.env.PATHFINDER_INTERMEDIATE_CHAIN
    },
    serviceName: process.env.ALS_SERVICE_NAME
};

async function init(conf = defaultConf) {
    const readFile = promisify(fs.readFile);
    const readDecode = async fname => (new Buffer(await readFile(fname, 'ascii'), 'ascii'));
    // If the intermediate cert chain env var is falsey we'll not read it
    const toDecode = Object.values(conf.secrets).filter(s => s).map(s => path.resolve(rootDir, s));
    let ca, intermediates;
    // TODO: this assumes the secrets will be ordered and that Object.values (used earlier) will
    // return values ordered as they were defined. We should rework this to remove these
    // assumptions.
    [conf.pathfinder.tls.key, conf.pathfinder.tls.cert, ca, intermediates] =
        await Promise.all(toDecode.map(readDecode));
    conf.pathfinder.tls.ca = [ca, intermediates];
    return conf;
}

module.exports = {
    init,
    defaultConf
};
