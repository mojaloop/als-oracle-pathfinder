'use strict'

const Test = require('tapes')(require('tape'))
// const Hapi = require('hapi')
// const HapiOpenAPI = require('hapi-openapi')
// const Path = require('path')
const InitServer = require('./../../../src/setup').initialize
const Mockgen = require('../../../src/models/mockgen.js')
const responseCodes = [201, 400, 401, 403, 404, 405, 406, 501, 503]

/**
 * Test for /participants 
 */
Test('/participants', async function (participantTests) {
  let server
  participantTests.beforeEach(async t => {
    try {
      server = await InitServer()
      t.end()
    } catch (e) {
      console.error(e)
    }
  })

  participantTests.afterEach(async t => {
    try {
      await server.stop()
      t.end()
    } catch (e) {
      console.error(e)
    }
  })

  /**
   * summary: Batch create participant information
   * description: The HTTP request POST /participants is used to create information in the server regarding the provided list of identities. This request should be used for bulk creation of FSP information for more than one Party. The optional currency parameter should indicate that each provided Party supports the currency
   * parameters: accept, content-type, date, fspiop-source, body, content-length, x-forwarded-for, fspiop-destination, fspiop-encryption, fspiop-signature, fspiop-uri, fspiop-http-method
   * produces: application/json
   * responses: 201, 400, 401, 403, 404, 405, 406, 501, 503
   */
  await participantTests.test('test ParticipantsPost post operation', async function (t) {
    try {
      const requests = new Promise((resolve, reject) => {
        Mockgen().requests({
          path: '/participants',
          operation: 'post'
        }, function (error, mock) {
          let newRequest = Object.assign({}, mock.request, { headers: { 'fspiop-source': 'source', 'date': 'date', 'Content-Type': 'application/json', 'accept': 'application/json' } })
          newRequest.body.partyList = [newRequest.body.partyList[0]]
          mock.request = newRequest

          return error ? reject(error) : resolve(mock)
        })
      })

      const mock = await requests

      t.ok(mock)
      t.ok(mock.request)
      // Get the resolved path from mock request
      // Mock request Path templates({}) are resolved using path parameters
      const options = {
        method: 'post',
        url: '' + mock.request.path
      }
      if (mock.request.body) {
        // Send the request body
        options.payload = mock.request.body
      } else if (mock.request.formData) {
        // Send the request form data
        options.payload = mock.request.formData
        // Set the Content-Type as application/x-www-form-urlencoded
        options.headers = options.headers || {}
        options.headers['Content-Type'] = 'application/x-www-form-urlencoded'
        options.headers['fspiop-source'] = 'source'
      }
      // If headers are present, set the headers.
      if (mock.request.headers) {
        options.headers = mock.request.headers
      }
      for (let responseCode of responseCodes) {
        server.app.responseCode = responseCode
        const response = await server.inject(options)
        t.equal(response.statusCode, responseCode, 'Ok response status')
      }
      t.end()
    } catch (e) {
      console.log(e)
      t.fail()
    }
  })
  await participantTests.end()
})
