'use strict'

const util = require('util')
const Logger = require('@mojaloop/central-services-logger')
const Pathfinder = require('@lib/pathfinder')
const Config = require('./config')
const { CentralLedgerDatabase } = require('./db')
const { createServer } = require('./server')

// Wrap logger methods for pathfinder lib
const pfLogger = {
  debug: (...args) => Logger.debug(util.format(...args)),
  info: (...args) => Logger.info(util.format(...args)),
  warn: (...args) => Logger.warn(util.format(...args)),
  error: (...args) => Logger.error(util.format(...args))
}

const initialize = async () => {
  pfLogger.info('Configuration:\n', Config.defaultConf)
  const config = await Config.init()

  // Set log level to info
  Logger.transports.forEach(t => { t.level = config.logLevel })

  const centralLedgerDb = new CentralLedgerDatabase(config.db)
  const pathfinder = new Pathfinder(config.pathfinder)

  const server = await createServer({ config, centralLedgerDb, pathfinder })

  if (server) {
    try {
      // Perform initial healthcheck
      const unhealthy = await server.app.healthCheck()
      if (unhealthy) {
        throw new Error(unhealthy.message)
      }

      server.plugins.openapi.setHost(server.info.host + ':' + server.info.port)
      server.log('info', `Server running on ${server.info.host}:${server.info.port}`)
      return server
    } catch (e) {
      server.log('error', util.format(e))
      throw e
    }
  }
}

try {
  initialize()
} catch (e) {
  Logger.error(e)
}
