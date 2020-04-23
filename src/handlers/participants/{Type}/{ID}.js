'use strict';

const Boom = require('@hapi/boom');
const responses = require('../../../error');
const e164 = require('../../../utils/e164');

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
    get: async function ParticipantsByTypeAndIDGet(req, h) {
        if (req.params.Type != 'MSISDN') {
            // TODO: is this appropriate? Should we return a more descriptive error?
            return Boom.notImplemented();
        }
        if (!e164(req.params.ID)) {
            // TODO: validate e164 in the swagger
            return responses.E164_INVALID();
        }

        // Function to filter the result by the currency
        const filterF =
            req.query.currency === undefined ? () => true : e => e.currency === req.query.currency;

        // Mobile country code (mcc), mobile network code (mnc) together uniquely identify an mno
        const { mcc, mnc } = await req.server.app.pf.query(req.params.ID);
        if (mcc === undefined || mnc === undefined) {
            return h.response({ partyList: [] }).code(200);
        }
        req.server.log(['info'], `[ mcc, mnc ] = [ ${mcc}, ${mnc} ]`);

        // Get the participant info from the db
        const parties = await req.server.app.db.getParticipantInfoFromMccMnc(mcc, mnc);
        if (parties === null) {
            return responses.FSP_NOT_FOUND();
        }

        return h.response({ partyList: parties.filter(filterF) }).code(200);
    },

    /**
     * summary: Upsert participant information
     * description: The PUT /participants/{Type}/{ID} is used to update information in the server regarding the provided identity, defined by {Type} and {ID} (for example, PUT /participants/MSISDN/123456789).
     * parameters: Type, ID, content-type, date, fspiop-source, body, accept, x-forwarded-for, fspiop-destination, fspiop-encryption, fspiop-signature, fspiop-uri, fspiop-http-method, content-length
     * produces: application/json
     * responses: 200, 400, 401, 403, 404, 405, 406, 501, 503
     */
    put: async function ParticipantsByTypeAndIDPut(req, h) {
        const { Type, ID } = req.params;
        const { db, pf } = req.server.app;
        if (Type !== 'MSISDN') {
            // TODO: is this appropriate? Should we return a more descriptive error?
            return responses.ID_TYPE_NOT_SUPPORTED();
        }
        if (!e164(ID)) {
            // TODO: validate e164 in the swagger
            return responses.E164_INVALID();
        }
        // Payload looks like { fspId, currency[, partySubIdOrType] }. We ignore `currency` as
        // that's (1) required but (2) defined by the accounts the fsp holds. We reject requests
        // containing `partySubIdOrType` as there's no implementation of that here.
        if (req.payload.partySubIdOrType) {
            // TODO: is this appropriate? Should we return a more descriptive error?
            return responses.SUB_ID_OR_TYPE_NOT_SUPPORTED();
        }

        const { mcc, mnc } = await pf.query(ID);
        req.server.log(['info'], `PUT /participants/${Type}/${ID} [ mcc, mnc ] = [ ${mcc}, ${mnc} ]`);
        if (mcc === undefined || mnc === undefined) {
            return responses.PARTY_NOT_FOUND();
        }

        try {
            await db.putParticipantInfo(req.payload.fspId, mcc, mnc);
        } catch (err) {
            if (db.errorIs(err, db.ErrorCodes.PARTICIPANT_NOT_FOUND)) {
                return responses.FSP_NOT_FOUND();
            }
            throw err;
        }
        return h.response().code(200);
    },
    /**
     * summary: Create participant information
     * description: The HTTP request POST /participants/{Type}/{ID} is used to create information in the server regarding the provided identity, defined by {Type} and {ID} (for example, POST /participants/MSISDN/123456789).
     * parameters: accept, Type, ID, content-type, date, fspiop-source, body, x-forwarded-for, fspiop-destination, fspiop-encryption, fspiop-signature, fspiop-uri, fspiop-http-method, content-length
     * produces: application/json
     * responses: 201, 400, 401, 403, 404, 405, 406, 501, 503
     */
    post: function ParticipantsByTypeAndIDPost() {
        return Boom.notImplemented();
    },
    /**
     * summary: Delete participant information
     * description: The HTTP request DELETE /participants/{Type}/{ID} is used to delete information in the server regarding the provided identity, defined by {Type} and {ID}) (for example, DELETE /participants/MSISDN/123456789). This HTTP request should support a query string to delete FSP information regarding a specific currency only (This similarly applies to the SubId). To delete a specific currency only, the HTTP request DELETE /participants/{Type}/{ID}?currency=XYZ should be used, where XYZ is the requested currency. Note - Both the currency and the SubId can be used mutually inclusive or exclusive
     * parameters: accept, Type, ID, Currency, SubId, content-type, date, fspiop-source, x-forwarded-for, fspiop-destination, fspiop-encryption, fspiop-signature, fspiop-uri, fspiop-http-method
     * produces: application/json
     * responses: 204, 400, 401, 403, 404, 405, 406, 501, 503
     */
    delete: function ParticipantsByTypeAndIDDelete() {
        return Boom.notImplemented();
    }
};
