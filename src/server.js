'use strict'

const Hapi = require('@hapi/hapi')
const HapiOpenAPI = require('hapi-openapi')
const Path = require('path')
const Logger = require('@mojaloop/central-services-logger')

module.exports.createServer = async function ({ config, centralLedgerDb, pathfinder }) {
  try {
    const server = new Hapi.Server(config.server)
    await server.register([
      {
        plugin: HapiOpenAPI,
        options: {
          api: Path.resolve(__dirname, './swagger.json'),
          handlers: Path.resolve(__dirname, './handlers')
        }
      },
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

    await server.start()
    return server
  } catch (e) {
    Logger.error(e)
  }
}
