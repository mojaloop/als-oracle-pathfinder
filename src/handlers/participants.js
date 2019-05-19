'use strict';

const Boom = require('@hapi/boom');

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
    post: function ParticipantsPost(request, h) {
        return Boom.notImplemented();
    }
};
