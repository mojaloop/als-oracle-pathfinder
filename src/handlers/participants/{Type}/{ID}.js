'use strict';

const Boom = require('@hapi/boom');
const dataAccess = require('../../../models/participants/{Type}/{ID}');
const Logger = require('@@mojaloop/central-services-shared').Logger;

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
   */
    get: async function ParticipantsByTypeAndIDGet (request, h) {
        const getData = new Promise((resolve, reject) => {
            switch (request.server.app.responseCode) {
            case 200:
            case 400:
            case 401:
            case 404:
            case 403:
            case 405:
            case 406:
            case 501:
            case 503:
                dataAccess.get[`${request.server.app.responseCode}`](request, h, (error, mock) => {
                    if (error) reject(error);
                    else if (!mock.responses) resolve();
                    else if (mock.responses && mock.responses.code) resolve(Boom.boomify(new Error(mock.responses.message), { statusCode: mock.responses.code }));
                    else resolve(mock.responses);
                });
                break;
            default:
                dataAccess.get['default'](request, h, (error, mock) => {
                    if (error) reject(error);
                    else if (!mock.responses) resolve();
                    else if (mock.responses && mock.responses.code) resolve(Boom.boomify(new Error(mock.responses.message), { statusCode: mock.responses.code }));
                    else resolve(mock.responses);
                });
            }
        });
        try {
            const response = await getData;
            return h.response(response).code(request.server.app.responseCode);
        } catch (e) {
            Logger(e);
        }
    },
    /**
   * summary: Return participant information
   * description: The PUT /participants/{Type}/{ID} is used to update information in the server regarding the provided identity, defined by {Type} and {ID} (for example, PUT /participants/MSISDN/123456789).
   * parameters: Type, ID, content-type, date, fspiop-source, body, accept, x-forwarded-for, fspiop-destination, fspiop-encryption, fspiop-signature, fspiop-uri, fspiop-http-method, content-length
   * produces: application/json
   * responses: 200, 400, 401, 403, 404, 405, 406, 501, 503
   */
    put: async function ParticipantsByTypeAndIDPut (request, h) {
        const getData = new Promise((resolve, reject) => {
            switch (request.server.app.responseCode) {
            case 200:
            case 400:
            case 401:
            case 404:
            case 403:
            case 405:
            case 406:
            case 501:
            case 503:
                dataAccess.put[`${request.server.app.responseCode}`](request, h, (error, mock) => {
                    if (error) reject(error);
                    else if (!mock.responses) resolve();
                    else if (mock.responses && mock.responses.code) resolve(Boom.boomify(new Error(mock.responses.message), { statusCode: mock.responses.code }));
                    else resolve(mock.responses);
                });
                break;
            default:
                dataAccess.put['default'](request, h, (error, mock) => {
                    if (error) reject(error);
                    else if (!mock.responses) resolve();
                    else if (mock.responses && mock.responses.code) resolve(Boom.boomify(new Error(mock.responses.message), { statusCode: mock.responses.code }));
                    else resolve(mock.responses);
                });
            }
        });
        try {
            const response = await getData;
            return h.response(response).code(request.server.app.responseCode);
        } catch (e) {
            Logger(e);
        }
    },
    /**
   * summary: Create participant information
   * description: The HTTP request POST /participants/{Type}/{ID} is used to create information in the server regarding the provided identity, defined by {Type} and {ID} (for example, POST /participants/MSISDN/123456789).
   * parameters: accept, Type, ID, content-type, date, fspiop-source, body, x-forwarded-for, fspiop-destination, fspiop-encryption, fspiop-signature, fspiop-uri, fspiop-http-method, content-length
   * produces: application/json
   * responses: 201, 400, 401, 403, 404, 405, 406, 501, 503
   */
    post: async function ParticipantsByTypeAndIDPost (request, h) {
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
                    if (error) reject(error);
                    else if (!mock.responses) resolve();
                    else if (mock.responses && mock.responses.code) resolve(Boom.boomify(new Error(mock.responses.message), { statusCode: mock.responses.code }));
                    else resolve(mock.responses);
                });
                break;
            default:
                dataAccess.post['default'](request, h, (error, mock) => {
                    if (error) reject(error);
                    else if (!mock.responses) resolve();
                    else if (mock.responses && mock.responses.code) resolve(Boom.boomify(new Error(mock.responses.message), { statusCode: mock.responses.code }));
                    else resolve(mock.responses);
                });
            }
        });
        try {
            const response = await getData;
            return h.response(response).code(request.server.app.responseCode);
        } catch (e) {
            Logger(e);
        }
    },
    /**
   * summary: Delete participant information
   * description: The HTTP request DELETE /participants/{Type}/{ID} is used to delete information in the server regarding the provided identity, defined by {Type} and {ID}) (for example, DELETE /participants/MSISDN/123456789). This HTTP request should support a query string to delete FSP information regarding a specific currency only (This similarly applies to the SubId). To delete a specific currency only, the HTTP request DELETE /participants/{Type}/{ID}?currency=XYZ should be used, where XYZ is the requested currency. Note - Both the currency and the SubId can be used mutually inclusive or exclusive
   * parameters: accept, Type, ID, Currency, SubId, content-type, date, fspiop-source, x-forwarded-for, fspiop-destination, fspiop-encryption, fspiop-signature, fspiop-uri, fspiop-http-method
   * produces: application/json
   * responses: 204, 400, 401, 403, 404, 405, 406, 501, 503
   */
    delete: async function ParticipantsByTypeAndIDDelete (request, h) {
        const getData = new Promise((resolve, reject) => {
            switch (request.server.app.responseCode) {
            case 204:
            case 400:
            case 401:
            case 404:
            case 403:
            case 405:
            case 406:
            case 501:
            case 503:
                dataAccess.delete[`${request.server.app.responseCode}`](request, h, (error, mock) => {
                    if (error) reject(error);
                    else if (!mock.responses) resolve();
                    else if (mock.responses && mock.responses.code) resolve(Boom.boomify(new Error(mock.responses.message), { statusCode: mock.responses.code }));
                    else resolve(mock.responses);
                });
                break;
            default:
                dataAccess.delete['default'](request, h, (error, mock) => {
                    if (error) reject(error);
                    else if (!mock.responses) resolve();
                    else if (mock.responses && mock.responses.code) resolve(Boom.boomify(new Error(mock.responses.message), { statusCode: mock.responses.code }));
                    else resolve(mock.responses);
                });
            }
        });
        try {
            const response = await getData;
            return h.response(response).code(request.server.app.responseCode);
        } catch (e) {
            Logger(e);
        }
    }
};
