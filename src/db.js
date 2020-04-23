'use strict';

const Knex = require('knex');

class Database {
    // Config should contain:
    // { host, user, password, database {, port } }
    constructor(config, clientConstructor = Knex) {
        this.client = clientConstructor({
            client: 'mysql2',
            connection: {
                ...config
            }
        });
    }

    /**
     * Check whether the database connection has basic functionality
     *
     * @returns {boolean}
     */
    async isConnected() {
        try {
            const result = await this.client.raw('SELECT 1 + 1 AS result');
            return (result) ? true : false;
        } catch(err) {
            return false;
        }
    }
}

class CentralLedgerDbError extends Error {
    constructor(code, message) {
        super(message);
        this.code = code;
    }
}

const ErrorCodes = Object.freeze({
    PARTICIPANT_NOT_FOUND: 'PARTICIPANT_NOT_FOUND',
});

const Errors = {
    participantNotFound: (fspId) => new CentralLedgerDbError(ErrorCodes.PARTICIPANT_NOT_FOUND, `${fspId} not found`),
};

class CentralLedgerDatabase extends Database {
    constructor (config, clientConstructor = Knex) {
        super(config, clientConstructor);

        /**
         * Error types for this class. Note that we do not use symbols, or "instanceof" because if
         * different versions of this code are used in different places, for example by transitive
         * dependency, the symbols or instance types will not be the same.
         */
        this.ErrorCodes = ErrorCodes;
    }

    /**
     * Verifies an error type
     *
     * Note that we do not use symbols, or "instanceof" because if different versions of this code
     * are used in different places, for example by transitive dependency, the symbols or instance
     * types will not be the same.
     *
     * @returns boolean - error is of the type supplied
     */
    verifyErrorType(err, code) {
        return code in this.ErrorCodes && err.code === code;
    }

    /**
     * Gets the name of the participant specified by mobile country code and mobile network code
     *
     * @returns {promise} - name of the participant
     */
    async getParticipantInfoFromMccMnc(mobileCountryCode, mobileNetworkCode) {
        const rows = await this.client('participantMno')
            .innerJoin('participant AS p', 'p.participantId', 'participantMno.participantId')
            .innerJoin('participantCurrency AS pc', 'pc.participantId', 'p.participantId')
            .innerJoin('ledgerAccountType AS lat', 'pc.ledgerAccountTypeId', 'lat.ledgerAccountTypeId')
            .where({ mobileCountryCode, mobileNetworkCode, 'lat.name': 'POSITION' })
            .select(['p.name AS fspId', 'pc.currencyId AS currency']);

        if ((!rows) || rows.length < 1) {
            // no mapping from mnc,mcc to participant in the db
            return null;
        }

        return rows;
    }

    /**
     * Upserts a participant and associated mobile country code and mobile network code
     *
     * @returns {promise} - name of the participant
     */
    async putParticipantInfo(fspId, mobileCountryCode, mobileNetworkCode) {
        // knex has no merge/upsert. In this function we simulate a merge/upsert by inserting,
        // and if there is an error, updating.
        // it appears to be incoming (who knows when it'll land):
        // https://github.com/knex/knex/issues/3186
        // https://github.com/knex/knex/pull/3763
        const res = await this.client('participant')
            .select('participantId')
            .where({ name: fspId });
        if (res.length === 0) {
            throw Errors.participantNotFound(fspId);
        }
        const { participantId } = res[0];
        const rowData = { participantId, mobileCountryCode, mobileNetworkCode };
        try {
            await this.client('participantMno').insert(rowData);
        } catch (err) {
            // Last write wins- that's fine
            await this.client('participantMno')
                .where({ mobileCountryCode, mobileNetworkCode })
                .update({ participantId });
        }
    }
}

module.exports = {
    CentralLedgerDatabase,
};
