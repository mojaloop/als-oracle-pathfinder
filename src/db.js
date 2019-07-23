
'use strict';

const Knex = require('knex');


const centralLedgerTableCreateStmts = client => client.raw(`
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
);`);


const partyIdTypeName = 'MSISDN';
const partyIdTypeDesc = 'A MSISDN (Mobile Station International Subscriber Directory Number, that is, the phone number) is used as reference to a participant. The MSISDN identifier should be in international format according to the ITU-T E.164 standard. Optionally, the MSISDN may be prefixed by a single plus sign, indicating the international prefix.';
const createdBy = 'ALS Pathfinder Oracle';
const appendHttpToServiceName = serviceName =>
    serviceName.startsWith('http://') || serviceName.startsWith('https://')
        ? serviceName
        : `http://${serviceName}`;
const alsInitStatements = (serviceName, client) => [
    // 1) Upsert the party id type
    client.raw(`
        INSERT IGNORE INTO partyIdType(name, description)
        VALUES ('${partyIdTypeName}', '${partyIdTypeDesc}')
        `),
    // 2) Inside a transaction
    client.transaction(trx => [
        // 2.1 disable old endpoints created by this service
        trx.raw(`UPDATE oracleEndpoint oe SET oe.isActive=0, oe.isDefault=0 WHERE oe.createdBy='${createdBy}'`),
        // 2.2 and create and enable this service
        trx.raw(`
            INSERT INTO oracleEndpoint(partyIdTypeId, endpointTypeId, value, createdBy, isDefault)
            VALUES (
                (SELECT partyIdTypeId FROM partyIdType WHERE name = '${partyIdTypeName}'),
                (SELECT endpointTypeId FROM endpointType WHERE type = 'URL'),
                ?,
                '${createdBy}',
                1
            )
            ON DUPLICATE KEY UPDATE value = ?;
        `, [appendHttpToServiceName(serviceName), appendHttpToServiceName(serviceName)])
    ].reduce((p, fn) => p.then(fn), Promise.resolve()))
].reduce((p, fn) => p.then(fn), Promise.resolve());


class Database {
    // Config should contain:
    // { host, user, password, database {, port } }
    constructor(config, initStatements) {
        this.client = Knex({
            client: 'mysql2',
            connection: {
                ...config
            }
        });
        this.initStatements = initStatements;
    }


    /**
     * Initialise the database by running the table init statements
     *
     * @returns {undefined}
     */
    async init() {
        // TODO: should these be in a transaction? Can CREATE TABLE be in a transaction in MySQL?
        if (this.initStatements) {
            await this.initStatements(this.client);
        }
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


// We _only_ want to run the init statements
class ALSDatabase extends Database {
    constructor(config, alsServiceName) {
        super(config, alsInitStatements.bind(null, alsServiceName));
    }
}


class CentralLedgerDatabase extends Database {
    constructor (config) {
        super(config, centralLedgerTableCreateStmts);
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
    ALSDatabase
};
