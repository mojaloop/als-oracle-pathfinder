
const path = require('path');
const test = require('ava');
const sinon = require ('sinon');

const root = path.resolve(__dirname, '..');
const { CentralLedgerDatabase } = require(path.resolve(root, 'src/db'));

// Shut the logger up
const Logger = require('@mojaloop/central-services-logger');
Logger.transports.forEach(t => t.silent = true);

//
// Some mocks and utilities
//

const fakeConfig = {
    host: 'iouwerioj',
    database: 'dfjdsak',
    user: '90knvbzl',
    port: 'fusiaodvj',
};

class MockKnexQuery extends Promise {
    constructor(executor) {
        super((resolve, reject) => {
            return executor(resolve, reject);
        });
    }

    then(onFulfilled, onRejected) {
        const returnValue = super.then(onFulfilled, onRejected);
        return returnValue;
    }

    select = sinon.fake.returns(this);
    innerJoin = sinon.fake.returns(this);
    where = sinon.fake.returns(this);
    from = sinon.fake.returns(this);
    insert = sinon.fake.returns(this);
    update = sinon.fake.returns(this);
}

const fakeKnex = ({
    queryResult,
    query = new MockKnexQuery((resolve) => resolve(queryResult)),
    client = sinon.fake.returns(query)
} = {}) => ({
    client,
    query,
});

test.beforeEach(async t => {
    const client = sinon.fake();
    const clientConstructor = sinon.fake.returns(client);
    const db = new CentralLedgerDatabase(fakeConfig, clientConstructor);
    t.context = {
        client,
        clientConstructor,
        db,
    };
});

//
// Tests
//

test('Constructor gonna construct', t => {
    t.assert(t.context.clientConstructor.calledOnce);
    t.deepEqual(t.context.clientConstructor.firstCall.args[0], {
        client: 'mysql2', connection: { ...fakeConfig }
    });
});

test('isConnected runs inane query', async t => {
    const { db, client } = t.context;
    client.raw = sinon.fake.returns(['2']);
    await db.isConnected();
    t.assert(client.raw.calledOnce);
    t.is(client.raw.firstCall.args[0], 'SELECT 1 + 1 AS result');
});

test('putParticipantInfo throws when the relevant FSP is not present', async t => {
    const { db } = t.context;
    db.client = fakeKnex({ queryResult: [] }).client;
    const err = await t.throwsAsync(db.putParticipantInfo('blah'));
    t.assert(db.verifyErrorType(err, db.ErrorCodes.PARTICIPANT_NOT_FOUND));
});

test('putParticipantInfo throws when the db throws', async t => {
    const { db } = t.context;
    db.client = sinon.fake.throws(new Error('blah'));
    await t.throwsAsync(db.putParticipantInfo('blah'));
});

test('putParticipantInfo inserts correct data to db', async t => {
    const { db } = t.context;
    const expectedInsertData = {
        participantId: 1,
        mobileCountryCode: 123,
        mobileNetworkCode: 456
    };
    const { client, query } = fakeKnex({
        queryResult: [{participantId: expectedInsertData.participantId}]
    });
    db.client = client;
    await db.putParticipantInfo('blah', 123, 456);
    t.assert(query.insert.calledOnce);
    t.deepEqual(query.insert.firstCall.args[0], expectedInsertData);
});

test('putParticipantInfo correctly updates when row is already present', async t => {
    const { db } = t.context;
    const participantId = 1;
    const mobileCountryCode = 123;
    const mobileNetworkCode = 456;
    const expectedInsertData = {
        participantId,
        mobileCountryCode,
        mobileNetworkCode,
    };
    const queryEngine = new MockKnexQuery((resolve) => resolve([{ participantId }]));
    queryEngine.insert = sinon.fake.throws(new Error());
    const { client } = fakeKnex({
        query: queryEngine,
        queryResult: [{ participantId }]
    });
    db.client = client;
    await db.putParticipantInfo('blah', 123, 456);
    t.assert(queryEngine.insert.calledOnce);
    t.deepEqual(queryEngine.insert.firstCall.args[0], expectedInsertData);
    t.is(queryEngine.where.callCount, 2);
    t.assert(queryEngine.update.calledOnce);
    t.deepEqual(queryEngine.where.secondCall.args[0], { mobileCountryCode, mobileNetworkCode, });
    t.deepEqual(queryEngine.update.firstCall.args[0], { participantId });
});

test('getParticipantInfoFromMccMnc throws when the db throws', async t => {
    const { db } = t.context;
    db.client = sinon.fake.throws(new Error('blah'));
    await t.throwsAsync(db.getParticipantInfoFromMccMnc(123, 456));
});

test('getParticipantInfoFromMccMnc returns results', async t => {
    const { db } = t.context;
    const queryResult = [123];
    db.client = fakeKnex({ queryResult }).client;
    const result = await db.getParticipantInfoFromMccMnc(123, 456);
    t.deepEqual(result, queryResult);
});

test('getParticipantInfoFromMccMnc returns null when no results are returned', async t => {
    const { db } = t.context;
    db.client = fakeKnex([]).client;
    const result = await db.getParticipantInfoFromMccMnc(123, 456);
    t.is(null, result);
});
