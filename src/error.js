
'use strict';

const Boom = require('@hapi/boom');

const responses = {
    E164_INVALID: () => Boom.badRequest('ID is not valid E164 number'),
    FSP_NOT_FOUND: () => Boom.notFound('FSP not found'),
    PARTY_NOT_FOUND: () => Boom.notFound('Party not found')
};

// const errors = Object.assign({}, ...Object.entries(results).map(([name, error]) => ({ [name]: () => new Boom(error()) })));

module.exports = responses;
