'use strict';

const Boom = require('boom');
const dataAccess = require('../models/participants')
/**
 * Operations on /participants
 */
module.exports = {
  /**
   * summary: Batch create participant information
   * description: The HTTP request POST /participants is used to create information in the server regarding the provided list of identities. This request should be used for bulk creation of FSP information for more than one Party. The optional currency parameter should indicate that each provided Party supports the currency
   * parameters: accept, content-type, date, fspiop-source, body, content-length, x-forwarded-for, fspiop-destination, fspiop-encryption, fspiop-signature, fspiop-uri, fspiop-http-method
   * produces: application/json
   * responses: 201, 400, 401, 403, 404, 405, 406, 501, 503
   */
  post: async function ParticipantsPost (request, h) {
    const getData = new Promise((resolve, reject) => {
      switch (request.server.app.responseCode) {
        case 201:
        case 400:
        case 401:
        case 404:
        case 403:
        case 405:
        case 406:
        case 501:
        case 503:
          dataAccess.post[`${request.server.app.responseCode}`](request, h, (error, mock) => {
            if (error) reject(error)
            else if (!mock.responses) resolve()
            else if (mock.responses && mock.responses.code) resolve(Boom.boomify(new Error(mock.responses.message), { statusCode: mock.responses.code }))
            else resolve(mock.responses)
          })
          break
        default:
          dataAccess.post[`default`](request, h, (error, mock) => {
            if (error) reject(error)
            else if (!mock.responses) resolve()
            else if (mock.responses && mock.responses.code) resolve(Boom.boomify(new Error(mock.responses.message), { statusCode: mock.responses.code }))
            else resolve(mock.responses)
          })
      }
    })
    try {
      const response = await getData
      return h.response(response).code(request.server.app.responseCode)
    } catch (e) {
      console.log(e)
    }
  }
}
