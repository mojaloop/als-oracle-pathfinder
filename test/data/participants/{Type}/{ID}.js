'use strict'
var Mockgen = require('../../mockgen.js')
/**
 * Operations on /participants/{Type}/{ID}
 */
module.exports = {
  /**
   * summary: Look up participant information
   * description: The HTTP request GET /participants/{Type}/{ID} is used to find out in which FSP the requested Party, defined by {Type} and {ID} is located (for example, GET /participants/MSISDN/123456789). This HTTP request should support a query string to filter FSP information regarding a specific currency only (This similarly applies to the SubId). To query a specific currency only, the HTTP request GET /participants/{Type}/{ID}?currency=XYZ should be used, where XYZ is the requested currency. Note - Both the currency and the SubId can be used mutually inclusive or exclusive
   * parameters: accept, Type, ID, Currency, SubId, content-type, date, fspiop-source, x-forwarded-for, fspiop-destination, fspiop-encryption, fspiop-signature, fspiop-uri, fspiop-http-method
   * produces: application/json
   * responses: 200, 400, 401, 403, 404, 405, 406, 501, 503
   * operationId: ParticipantsByTypeAndIDGet
   */
  get: {
    200: function (req, res, callback) {
      /**
       * Using mock data generator module.
       * Replace this by actual data for the api.
       */
      Mockgen().responses({
        path: '/participants/{Type}/{ID}',
        operation: 'get',
        response: '200'
      }, callback)
    },
    400: function (req, res, callback) {
      /**
       * Using mock data generator module.
       * Replace this by actual data for the api.
       */
      Mockgen().responses({
        path: '/participants/{Type}/{ID}',
        operation: 'get',
        response: '400'
      }, callback)
    },
    401: function (req, res, callback) {
      /**
       * Using mock data generator module.
       * Replace this by actual data for the api.
       */
      Mockgen().responses({
        path: '/participants/{Type}/{ID}',
        operation: 'get',
        response: '401'
      }, callback)
    },
    403: function (req, res, callback) {
      /**
       * Using mock data generator module.
       * Replace this by actual data for the api.
       */
      Mockgen().responses({
        path: '/participants/{Type}/{ID}',
        operation: 'get',
        response: '403'
      }, callback)
    },
    404: function (req, res, callback) {
      /**
       * Using mock data generator module.
       * Replace this by actual data for the api.
       */
      Mockgen().responses({
        path: '/participants/{Type}/{ID}',
        operation: 'get',
        response: '404'
      }, callback)
    },
    405: function (req, res, callback) {
      /**
       * Using mock data generator module.
       * Replace this by actual data for the api.
       */
      Mockgen().responses({
        path: '/participants/{Type}/{ID}',
        operation: 'get',
        response: '405'
      }, callback)
    },
    406: function (req, res, callback) {
      /**
       * Using mock data generator module.
       * Replace this by actual data for the api.
       */
      Mockgen().responses({
        path: '/participants/{Type}/{ID}',
        operation: 'get',
        response: '406'
      }, callback)
    },
    501: function (req, res, callback) {
      /**
       * Using mock data generator module.
       * Replace this by actual data for the api.
       */
      Mockgen().responses({
        path: '/participants/{Type}/{ID}',
        operation: 'get',
        response: '501'
      }, callback)
    },
    503: function (req, res, callback) {
      /**
       * Using mock data generator module.
       * Replace this by actual data for the api.
       */
      Mockgen().responses({
        path: '/participants/{Type}/{ID}',
        operation: 'get',
        response: '503'
      }, callback)
    }
  },
  /**
   * summary: Return participant information
   * description: The PUT /participants/{Type}/{ID} is used to update information in the server regarding the provided identity, defined by {Type} and {ID} (for example, PUT /participants/MSISDN/123456789).
   * parameters: Type, ID, content-type, date, fspiop-source, body, accept, x-forwarded-for, fspiop-destination, fspiop-encryption, fspiop-signature, fspiop-uri, fspiop-http-method, content-length
   * produces: application/json
   * responses: 200, 400, 401, 403, 404, 405, 406, 501, 503
   * operationId: ParticipantsByTypeAndIDPut
   */
  put: {
    200: function (req, res, callback) {
      /**
       * Using mock data generator module.
       * Replace this by actual data for the api.
       */
      Mockgen().responses({
        path: '/participants/{Type}/{ID}',
        operation: 'put',
        response: '200'
      }, callback)
    },
    400: function (req, res, callback) {
      /**
       * Using mock data generator module.
       * Replace this by actual data for the api.
       */
      Mockgen().responses({
        path: '/participants/{Type}/{ID}',
        operation: 'put',
        response: '400'
      }, callback)
    },
    401: function (req, res, callback) {
      /**
       * Using mock data generator module.
       * Replace this by actual data for the api.
       */
      Mockgen().responses({
        path: '/participants/{Type}/{ID}',
        operation: 'put',
        response: '401'
      }, callback)
    },
    403: function (req, res, callback) {
      /**
       * Using mock data generator module.
       * Replace this by actual data for the api.
       */
      Mockgen().responses({
        path: '/participants/{Type}/{ID}',
        operation: 'put',
        response: '403'
      }, callback)
    },
    404: function (req, res, callback) {
      /**
       * Using mock data generator module.
       * Replace this by actual data for the api.
       */
      Mockgen().responses({
        path: '/participants/{Type}/{ID}',
        operation: 'put',
        response: '404'
      }, callback)
    },
    405: function (req, res, callback) {
      /**
       * Using mock data generator module.
       * Replace this by actual data for the api.
       */
      Mockgen().responses({
        path: '/participants/{Type}/{ID}',
        operation: 'put',
        response: '405'
      }, callback)
    },
    406: function (req, res, callback) {
      /**
       * Using mock data generator module.
       * Replace this by actual data for the api.
       */
      Mockgen().responses({
        path: '/participants/{Type}/{ID}',
        operation: 'put',
        response: '406'
      }, callback)
    },
    501: function (req, res, callback) {
      /**
       * Using mock data generator module.
       * Replace this by actual data for the api.
       */
      Mockgen().responses({
        path: '/participants/{Type}/{ID}',
        operation: 'put',
        response: '501'
      }, callback)
    },
    503: function (req, res, callback) {
      /**
       * Using mock data generator module.
       * Replace this by actual data for the api.
       */
      Mockgen().responses({
        path: '/participants/{Type}/{ID}',
        operation: 'put',
        response: '503'
      }, callback)
    }
  },
  /**
   * summary: Create participant information
   * description: The HTTP request POST /participants/{Type}/{ID} is used to create information in the server regarding the provided identity, defined by {Type} and {ID} (for example, POST /participants/MSISDN/123456789).
   * parameters: accept, Type, ID, content-type, date, fspiop-source, body, x-forwarded-for, fspiop-destination, fspiop-encryption, fspiop-signature, fspiop-uri, fspiop-http-method, content-length
   * produces: application/json
   * responses: 201, 400, 401, 403, 404, 405, 406, 501, 503
   * operationId: ParticipantsByTypeAndIDPost
   */
  post: {
    201: function (req, res, callback) {
      /**
       * Using mock data generator module.
       * Replace this by actual data for the api.
       */
      Mockgen().responses({
        path: '/participants/{Type}/{ID}',
        operation: 'post',
        response: '201'
      }, callback)
    },
    400: function (req, res, callback) {
      /**
       * Using mock data generator module.
       * Replace this by actual data for the api.
       */
      Mockgen().responses({
        path: '/participants/{Type}/{ID}',
        operation: 'post',
        response: '400'
      }, callback)
    },
    401: function (req, res, callback) {
      /**
       * Using mock data generator module.
       * Replace this by actual data for the api.
       */
      Mockgen().responses({
        path: '/participants/{Type}/{ID}',
        operation: 'post',
        response: '401'
      }, callback)
    },
    403: function (req, res, callback) {
      /**
       * Using mock data generator module.
       * Replace this by actual data for the api.
       */
      Mockgen().responses({
        path: '/participants/{Type}/{ID}',
        operation: 'post',
        response: '403'
      }, callback)
    },
    404: function (req, res, callback) {
      /**
       * Using mock data generator module.
       * Replace this by actual data for the api.
       */
      Mockgen().responses({
        path: '/participants/{Type}/{ID}',
        operation: 'post',
        response: '404'
      }, callback)
    },
    405: function (req, res, callback) {
      /**
       * Using mock data generator module.
       * Replace this by actual data for the api.
       */
      Mockgen().responses({
        path: '/participants/{Type}/{ID}',
        operation: 'post',
        response: '405'
      }, callback)
    },
    406: function (req, res, callback) {
      /**
       * Using mock data generator module.
       * Replace this by actual data for the api.
       */
      Mockgen().responses({
        path: '/participants/{Type}/{ID}',
        operation: 'post',
        response: '406'
      }, callback)
    },
    501: function (req, res, callback) {
      /**
       * Using mock data generator module.
       * Replace this by actual data for the api.
       */
      Mockgen().responses({
        path: '/participants/{Type}/{ID}',
        operation: 'post',
        response: '501'
      }, callback)
    },
    503: function (req, res, callback) {
      /**
       * Using mock data generator module.
       * Replace this by actual data for the api.
       */
      Mockgen().responses({
        path: '/participants/{Type}/{ID}',
        operation: 'post',
        response: '503'
      }, callback)
    },
    default: function (req, res, callback) {
      /**
       * Using mock data generator module.
       * Replace this by actual data for the api.
       */
      Mockgen().responses({
        path: '/participants',
        operation: 'post',
        response: 'default'
      }, callback)
    }
  },
  /**
   * summary: Delete participant information
   * description: The HTTP request DELETE /participants/{Type}/{ID} is used to delete information in the server regarding the provided identity, defined by {Type} and {ID}) (for example, DELETE /participants/MSISDN/123456789). This HTTP request should support a query string to delete FSP information regarding a specific currency only (This similarly applies to the SubId). To delete a specific currency only, the HTTP request DELETE /participants/{Type}/{ID}?currency=XYZ should be used, where XYZ is the requested currency. Note - Both the currency and the SubId can be used mutually inclusive or exclusive
   * parameters: accept, Type, ID, Currency, SubId, content-type, date, fspiop-source, x-forwarded-for, fspiop-destination, fspiop-encryption, fspiop-signature, fspiop-uri, fspiop-http-method
   * produces: application/json
   * responses: 204, 400, 401, 403, 404, 405, 406, 501, 503
   * operationId: ParticipantsByTypeAndIDDelete
   */
  delete: {
    204: function (req, res, callback) {
      /**
       * Using mock data generator module.
       * Replace this by actual data for the api.
       */
      Mockgen().responses({
        path: '/participants/{Type}/{ID}',
        operation: 'delete',
        response: '204'
      }, callback)
    },
    400: function (req, res, callback) {
      /**
       * Using mock data generator module.
       * Replace this by actual data for the api.
       */
      Mockgen().responses({
        path: '/participants/{Type}/{ID}',
        operation: 'delete',
        response: '400'
      }, callback)
    },
    401: function (req, res, callback) {
      /**
       * Using mock data generator module.
       * Replace this by actual data for the api.
       */
      Mockgen().responses({
        path: '/participants/{Type}/{ID}',
        operation: 'delete',
        response: '401'
      }, callback)
    },
    403: function (req, res, callback) {
      /**
       * Using mock data generator module.
       * Replace this by actual data for the api.
       */
      Mockgen().responses({
        path: '/participants/{Type}/{ID}',
        operation: 'delete',
        response: '403'
      }, callback)
    },
    404: function (req, res, callback) {
      /**
       * Using mock data generator module.
       * Replace this by actual data for the api.
       */
      Mockgen().responses({
        path: '/participants/{Type}/{ID}',
        operation: 'delete',
        response: '404'
      }, callback)
    },
    405: function (req, res, callback) {
      /**
       * Using mock data generator module.
       * Replace this by actual data for the api.
       */
      Mockgen().responses({
        path: '/participants/{Type}/{ID}',
        operation: 'delete',
        response: '405'
      }, callback)
    },
    406: function (req, res, callback) {
      /**
       * Using mock data generator module.
       * Replace this by actual data for the api.
       */
      Mockgen().responses({
        path: '/participants/{Type}/{ID}',
        operation: 'delete',
        response: '406'
      }, callback)
    },
    501: function (req, res, callback) {
      /**
       * Using mock data generator module.
       * Replace this by actual data for the api.
       */
      Mockgen().responses({
        path: '/participants/{Type}/{ID}',
        operation: 'delete',
        response: '501'
      }, callback)
    },
    503: function (req, res, callback) {
      /**
       * Using mock data generator module.
       * Replace this by actual data for the api.
       */
      Mockgen().responses({
        path: '/participants/{Type}/{ID}',
        operation: 'delete',
        response: '503'
      }, callback)
    },
    default: function (req, res, callback) {
      /**
       * Using mock data generator module.
       * Replace this by actual data for the api.
       */
      Mockgen().responses({
        path: '/participants/{Type}/{ID}',
        operation: 'delete',
        response: 'default'
      }, callback)
    }

  }
}
