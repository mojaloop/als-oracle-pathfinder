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
}

module.exports = {
    CentralLedgerDatabase,
};
