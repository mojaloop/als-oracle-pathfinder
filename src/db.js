
'use strict';

const Knex = require('knex');

const tableCreateStmt = `
CREATE TABLE IF NOT EXISTS participantMno (
    \`participantMnoId\` int(10) unsigned NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT 'Surrogate PK',
    \`mobileCountryCode\` SMALLINT unsigned NOT NULL COMMENT 'The three digit code representing the MCC returned by Pathfinder',
    \`mobileNetworkCode\` SMALLINT unsigned NOT NULL COMMENT 'The three digit code representing the MNC returned by Pathfinder',
    \`participantId\` int(10) unsigned NOT NULL UNIQUE,
    CONSTRAINT participantmno_participantid_foreign FOREIGN KEY (participantId)
        REFERENCES participant (participantId),
    CONSTRAINT participantmno_participantid_mcc_mnc_unique_key
        UNIQUE INDEX (participantId, mobileCountryCode, mobileNetworkCode),
    CONSTRAINT participantmno_mobilecountrycode_mobilenetworkcode_unique
        UNIQUE (mobileCountryCode, mobileNetworkCode)
);`

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

    // Initialise the database by running the table create statement
    async init() {
        await this.client.raw(tableCreateStmt);
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

    /**
     * Gets the name of the participant specified by mobile country code and mobile network code
     *
     * @returns {promise} - name of the participant
     */
    async getParticipantNameFromMccMnc(mobileCountryCode, mobileNetworkCode) {
        const rows = await this.client('participantMno')
            .innerJoin('participant', 'participant.participantId', 'participantMno.participantId')
            .where({ mobileCountryCode, mobileNetworkCode })
            .select('participant.name');
        if ((!rows) || rows.length < 1) {
            // no mapping from mnc,mcc to participant in the db
            return undefined;
        }
        return rows[0].name;
    }
}

module.exports = Database;
