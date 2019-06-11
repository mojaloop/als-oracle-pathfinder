'use strict';

const path = require('path');
const test = require('ava');

const root = path.resolve(__dirname, '..');
const { createServer } = require(path.resolve(root, 'src/server'));
const config = require(path.resolve(root, 'src/config'));


// *** Some setup ***

// Shut the logger up
const Logger = require('@mojaloop/central-services-shared').Logger;
Logger.transports.forEach(t => t.silent = true);

const headers = {
    'content-type': 'application/json',
    'date': 'test',
    'fspiop-source': 'test',
    'accept': 'application/json'
};

const nullInitObj = () => ({ init: () => {} });
const pathfinder = () => ({
    connect: () => {},
});

test.beforeEach(async t => {
    t.context = {
        server: await createServer({
            config,
            alsDb: nullInitObj(),
            centralLedgerDb: nullInitObj(),
            pathfinder: pathfinder()
        }),
    };
});


// *** Tests ***

test('health-check succeeds if db is connected, pf queries are ok', async t => {
    t.context.server.app.db.isConnected = () => true;
    t.context.server.app.pf.query = () => ({});
    const response = await t.context.server.inject({
        method: 'get',
        url: '/'
    });
    t.is(response.statusCode, 200);
});

test('health-check fails if pathfinder query fails', async t => {
    t.context.server.app.db.isConnected = () => true;
    t.context.server.app.pf.query = () => { throw new Error('whatever'); };
    const response = await t.context.server.inject({
        method: 'get',
        url: '/'
    });
    t.is(response.statusCode, 500);
});

test('health-check fails if db is not connected', async t => {
    t.context.server.app.db.isConnected = () => false;
    t.context.server.app.pf.query = () => ({});
    const response = await t.context.server.inject({
        method: 'get',
        url: '/'
    });
    t.is(response.statusCode, 500);
});

test('test get participants by type and id, invalid E164', async t => {
    const expectedResult = [{ fspId: 'test', currency: 'TEST' }];
    t.context.server.app.db.getPartyParticipant = () => expectedResult;
    const response = await t.context.server.inject({
        method: 'get',
        headers,
        url: '/participants/MSISDN/blah'
    });
    t.is(response.statusCode, 400);
    console.log(response.payload);
    t.deepEqual(JSON.parse(response.payload), {
        statusCode: 400,
        error: 'Bad Request',
        message: { errorInformation: { errorDescription: 'ID is not valid E164 number' }}
    });
});

test('test get parties by type and id, no currency', async t => {
    const expectedResult = [{ fspId: 'test', currency: 'TEST' }];
    const msisdn = '1230456';
    const pfResult = { mcc: '123', mnc: '456' };
    t.context.server.app.pf.query = (msisdnPf) => {
        t.deepEqual(msisdnPf, msisdn);
        return pfResult;
    };
    t.context.server.app.db.getParticipantInfoFromMccMnc = (mcc, mnc) => {
        t.deepEqual(pfResult, { mcc, mnc });
        return expectedResult;
    };
    const response = await t.context.server.inject({
        method: 'get',
        headers,
        url: `/participants/MSISDN/${msisdn}`
    });
    t.is(response.statusCode, 200);
    t.deepEqual(JSON.parse(response.payload), expectedResult);
});

test('test get parties by type and id, currency query param positive response', async t => {
    const expectedResult = [{ fspId: 'test', currency: 'TEST' }];
    const msisdn = '1230456';
    const pfResult = { mcc: '123', mnc: '456' };
    t.context.server.app.pf.query = (msisdnPf) => {
        t.deepEqual(msisdnPf, msisdn);
        return pfResult;
    };
    t.context.server.app.db.getParticipantInfoFromMccMnc = (mcc, mnc) => {
        t.deepEqual(pfResult, { mcc, mnc });
        return [
            ...expectedResult,
            { fspId: 'blah', currency: 'TESTWHATEVER' }
        ];
    };
    const response = await t.context.server.inject({
        method: 'get',
        headers,
        url: `/participants/MSISDN/${msisdn}?currency=TEST`
    });
    t.is(response.statusCode, 200);
    t.deepEqual(JSON.parse(response.payload), expectedResult);
});

test('test get parties by type and id, currency query param negative response', async t => {
    const expectedResult = {
        statusCode: 404,
        error: 'Not Found',
        message: { errorInformation: { errorDescription: 'FSP not found' } }
    };
    const msisdn = '1230456';
    const pfResult = { mcc: '123', mnc: '456' };
    t.context.server.app.pf.query = (msisdnPf) => {
        t.deepEqual(msisdnPf, msisdn);
        return pfResult;
    };
    t.context.server.app.db.getParticipantInfoFromMccMnc = (mcc, mnc) => {
        t.deepEqual(pfResult, { mcc, mnc });
        return [];
    };
    const response = await t.context.server.inject({
        method: 'get',
        headers,
        url: `/participants/MSISDN/${msisdn}?currency=BLAH`
    });
    t.is(response.statusCode, 404);
    t.deepEqual(JSON.parse(response.payload), expectedResult);
});

test('test get parties by type and id, mcc, mnc invalid', async t => {
    const expectedResult = {
        statusCode: 404,
        error: 'Not Found',
        message: { errorInformation: { errorDescription: 'Party not found' } }
    };
    const msisdn = '1230456';
    const pfResult = { mcc: '123', mnc: '456' };
    t.context.server.app.pf.query = () => ({});
    t.context.server.app.db.getParticipantInfoFromMccMnc = (mcc, mnc) => {
        t.deepEqual(pfResult, { mcc, mnc });
        return [];
    };
    const response = await t.context.server.inject({
        method: 'get',
        headers,
        url: `/participants/MSISDN/${msisdn}?currency=BLAH`
    });
    t.is(response.statusCode, 404);
    t.deepEqual(JSON.parse(response.payload), expectedResult);
});
