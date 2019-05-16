
'use strict';

const knex = require('knex');

const tableCreateStmt = `
CREATE TABLE IF NOT EXISTS pathfinderOracleCache (
    \`pathfinderOracleCacheId\` int(10) unsigned NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT 'Surrogate PK',
    \`pathfinderOracleCachePartyType\` TEXT NOT NULL COMMENT 'E.g. MSISDN or MERCH_ID',
    \`pathfinderOracleCachePartyId\` TEXT NOT NULL COMMENT 'E.g. 2234567890 (MSISDN)',
    \`participantId\` int(10) unsigned NOT NULL UNIQUE,
    CONSTRAINT partyinfocache_participantid_foreign FOREIGN KEY (participantId)
        REFERENCES participant (participantId),
    CONSTRAINT partyinfocache_partyinfotypekeyidkey_unique_key
        UNIQUE INDEX (pathfinderOracleCachePartyType, pathfinderOracleCachePartyId)
)`;

class Database {
    // Config should contain:
    // { host, user, password {, port } }
    constructor(config) {
        this.client = knex({
            client: 'mysql2',
            connection: {
                database: 'central_ledger',
                ...config
            }
        });
        this.client.raw(tableCreateStmt);
    }

    /**
     * Check whether the database connection has basic functionality
     *
     * @returns {boolean}
     */
    async isConnected() {
        try {
            const result = await this.client.raw('SELECT 1 + 1 AS result');
            if (result) {
                return true;
            }
            return false;
        } catch(err) {
            return false;
        }
    }

    async getPartyInfo(type, id) {
        return this.client
            .select()
            .from('pathfinderOracleCache')
            .where({ type, id });
    }

    async setPartyInfo(type, id, participantId) {
        return this.client('pathfinderOracleCache')
            .insert({
                pathfinderOracleCachePartyType: type,
                pathfinderOracleCachePartyId: id,
                participantId
            });
    }
}

module.exports = Database;
