
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
        this.calls = {
            select: [],
            innerJoin: [],
            where: [],
            from: [],
            insert: [],
            update: [],
        }
    }

    then(onFulfilled, onRejected) {
        const returnValue = super.then(onFulfilled, onRejected);
        return returnValue;
    }

    select(...args) {
        this.calls.select.push({ args });
        return this;
    }

    innerJoin(...args) {
        this.calls.innerJoin.push({ args });
        return this;
    }

    where(...args) {
        this.calls.where.push({ args });
        return this;
    }

    from(...args) {
        this.calls.from.push({ args });
        return this;
    }

    insert(...args) {
        this.calls.insert.push({ args });
        return this;
    }

    update(...args) {
        this.calls.update.push({ args });
        return this;
    }
}

const fakeKnex = ({
    queryResult,
    query = new MockKnexQuery((res, rej) => res(queryResult)),
    client = sinon.fake.returns(query)
} = {}) => ({
    client,
    query,
})

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
    t.assert(db.errorIs(err, db.ErrorCodes.PARTICIPANT_NOT_FOUND));
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
    t.is(query.calls.insert.length, 1);
    t.deepEqual(query.calls.insert[0].args[0], expectedInsertData);
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
    t.is(queryEngine.calls.where.length, 2);
    t.is(queryEngine.calls.update.length, 1);
    t.deepEqual(queryEngine.calls.where[1].args[0], { mobileCountryCode, mobileNetworkCode, });
    t.deepEqual(queryEngine.calls.update[0].args[0], { participantId })
});

test('getParticipantInfoFromMccMnc throws when the db throws', async t => {
    const { db } = t.context;
    db.client = sinon.fake.throws(new Error('blah'));
    await t.throwsAsync(db.getParticipantInfoFromMccMnc(123, 456));
});

test('getParticipantInfoFromMccMnc returns results', async t => {
    const { db } = t.context;
    const queryResult = [123]
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
