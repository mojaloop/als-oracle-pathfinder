'use strict';
var Mockgen = require('./mockgen.js');
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
   * operationId: ParticipantsPost
   */
    post: {
        201: function (req, res, callback) {
            /**
       * Using mock data generator module.
       * Replace this by actual data for the api.
       */
            Mockgen().responses({
                path: '/participants',
                operation: 'post',
                response: '201'
            }, callback);
        },
        400: function (req, res, callback) {
            /**
       * Using mock data generator module.
       * Replace this by actual data for the api.
       */
            Mockgen().responses({
                path: '/participants',
                operation: 'post',
                response: '400'
            }, callback);
        },
        401: function (req, res, callback) {
            /**
       * Using mock data generator module.
       * Replace this by actual data for the api.
       */
            Mockgen().responses({
                path: '/participants',
                operation: 'post',
                response: '401'
            }, callback);
        },
        403: function (req, res, callback) {
            /**
       * Using mock data generator module.
       * Replace this by actual data for the api.
       */
            Mockgen().responses({
                path: '/participants',
                operation: 'post',
                response: '403'
            }, callback);
        },
        404: function (req, res, callback) {
            /**
       * Using mock data generator module.
       * Replace this by actual data for the api.
       */
            Mockgen().responses({
                path: '/participants',
                operation: 'post',
                response: '404'
            }, callback);
        },
        405: function (req, res, callback) {
            /**
       * Using mock data generator module.
       * Replace this by actual data for the api.
       */
            Mockgen().responses({
                path: '/participants',
                operation: 'post',
                response: '405'
            }, callback);
        },
        406: function (req, res, callback) {
            /**
       * Using mock data generator module.
       * Replace this by actual data for the api.
       */
            Mockgen().responses({
                path: '/participants',
                operation: 'post',
                response: '406'
            }, callback);
        },
        501: function (req, res, callback) {
            /**
       * Using mock data generator module.
       * Replace this by actual data for the api.
       */
            Mockgen().responses({
                path: '/participants',
                operation: 'post',
                response: '501'
            }, callback);
        },
        503: function (req, res, callback) {
            /**
       * Using mock data generator module.
       * Replace this by actual data for the api.
       */
            Mockgen().responses({
                path: '/participants',
                operation: 'post',
                response: '503'
            }, callback);
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
            }, callback);
        }
    }
};
