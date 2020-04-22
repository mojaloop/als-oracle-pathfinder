'use strict';

const Knex = require('knex');

class Database {
    // Config should contain:
    // { host, user, password, database {, port } }
    constructor(config) {
        this.client = Knex({
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

class CentralLedgerDatabase extends Database {
    constructor (config) {
        super(config);
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
        const participantId = await this.client('participant')
            .select('participantId')
            .where({ name: fspId });
        const rowData = { participantId, mobileCountryCode, mobileNetworkCode };
        try {
            await this.client('participantMno').insert(rowData)
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
