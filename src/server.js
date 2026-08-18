'use strict'

const Hapi = require('@hapi/hapi')
const Path = require('path')
const Logger = require('@mojaloop/central-services-logger')
const OpenapiBackend = require('@mojaloop/central-services-shared').Util.OpenapiBackend
const Handlers = require('./handlers')

module.exports.stopServer = async function (server) {
  try {
    await server.stop()
    Logger.info('Server stopped')
  } catch (error) {
    Logger.error('Error stopping server:', error)
  }
}

/**
 * Dispatches a hapi request through OpenapiBackend (validation + operationId
 * routing). FSPIOPErrors thrown by handlers or validationFail are shaped into
 * the FSPIOP error body with their HTTP status instead of a generic 500.
 */
const handleRequest = async (api, req, h) => {
  try {
    return await api.handleRequest(
      {
        method: req.method,
        path: req.path,
        body: req.payload,
        query: req.query,
        headers: req.headers
      }, req, h)
  } catch (err) {
    if (err.httpStatusCode && typeof err.toApiErrorObject === 'function') {
      return h.response(err.toApiErrorObject()).code(err.httpStatusCode)
    }
    throw err
  }
}

module.exports.createServer = async function ({ config, centralLedgerDb, pathfinder }) {
  try {
    const server = new Hapi.Server(config.server)
    const api = await OpenapiBackend.initialise(Path.resolve(__dirname, './swagger.json'), Handlers)
    await server.register([
      {
        plugin: require('./utils/logger-plugin')
      }
    ])

    server.ext([
      {
        type: 'onPreHandler',
        method: (request, h) => {
          server.log('request', request)
          return h.continue
        }
      },
      {
        type: 'onPreResponse',
        method: (request, h) => {
          if (!request.response.isBoom) {
            server.log('response', request.response)
          } else {
            const error = request.response
            const errorMessage = {
              errorInformation: {
                errorCode: error.statusCode,
                errorDescription: error.message
              }
            }
            error.message = errorMessage
            error.reformat()
          }
          return h.continue
        }
      }
    ])

    // Create database, pathfinder and append them to server.app
    await pathfinder.connect()
    server.app.db = centralLedgerDb
    server.app.pf = pathfinder

    // add a health-check endpoint on /
    server.app.healthCheck = async () => {
      // Check pathfinder, database connectivity is ok
      try {
        await server.app.pf.query('')
      } catch (err) {
        return { message: `Pathfinder module error: ${err.message}` }
      }
      if (!(await server.app.db.isConnected())) {
        return { message: 'Database not connected' }
      }
    }
    server.route({
      method: 'GET',
      path: '/',
      handler: async (req, h) => {
        const res = await req.server.app.healthCheck()
        if (res) {
          return h.response({ ...res, statusCode: 500, error: 'Internal Server Error' }).code(500)
        }
        return h.response().code(200) // 200 expected by k8s, should be 204
      }
    })
    server.route({
      method: ['GET', 'POST', 'PUT', 'DELETE'],
      path: '/{path*}',
      handler: (req, h) => handleRequest(api, req, h)
    })

    await server.start()
    return server
  } catch (e) {
    Logger.error(e)
  }
}
