'use strict'

const Boom = require('@hapi/boom')

const responses = {
  E164_INVALID: () => Boom.badRequest('ID is not valid E164 number'),
  FSP_NOT_FOUND: () => Boom.notFound('FSP not found'),
  PARTY_NOT_FOUND: () => Boom.notFound('Party not found'),
  ID_TYPE_NOT_SUPPORTED: () => Boom.notImplemented('This service supports only MSISDN ID types'),
  SUB_ID_OR_TYPE_NOT_SUPPORTED: () => Boom.notImplemented('partySubIdOrType not supported')
}

module.exports = responses
