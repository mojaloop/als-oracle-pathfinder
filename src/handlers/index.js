'use strict'

const OpenapiBackend = require('@mojaloop/central-services-shared').Util.OpenapiBackend
const Participants = require('./participants')
const ParticipantsByTypeAndID = require('./participants/{Type}/{ID}')

/**
 * Adapts a legacy hapi-openapi handler (request, h) to the OpenapiBackend
 * signature (context, request, h). The server routes everything through a
 * single /{path*} catch-all, so the path params parsed by OpenapiBackend
 * (context.request.params) are grafted onto the hapi request the handlers
 * were written against.
 */
const adapt = (handler) => (context, request, h) => {
  request.params = { ...request.params, ...context.request.params }
  return handler(request, h)
}

/**
 * Map of OpenAPI operationIds to handler functions, used by OpenapiBackend to
 * route validated requests.
 */
module.exports = {
  ParticipantsPost: adapt(Participants.post),
  ParticipantsByTypeAndIDGet: adapt((req, h) => ParticipantsByTypeAndID.get(req, h)),
  ParticipantsByTypeAndIDPut: adapt((req, h) => ParticipantsByTypeAndID.put(req, h)),
  ParticipantsByTypeAndIDPost: adapt(ParticipantsByTypeAndID.post),
  ParticipantsByTypeAndIDDelete: adapt(ParticipantsByTypeAndID.delete),
  validationFail: OpenapiBackend.validationFail,
  notFound: OpenapiBackend.notFound,
  methodNotAllowed: OpenapiBackend.methodNotAllowed
}
