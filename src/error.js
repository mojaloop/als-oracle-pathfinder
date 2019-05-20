
'use strict';

const Boom = require('@hapi/boom');

const responses = {
    E164_INVALID: () => Boom.badRequest('ID is not valid E164 number'),
    FSP_NOT_FOUND: () => Boom.notFound('FSP not found'),
    PARTY_NOT_FOUND: () => Boom.notFound('Party not found')
};

module.exports = responses;
