'use strict'

const path = require('path')
const test = require('ava')

const root = path.resolve(__dirname, '../..')
const { createServer } = require(path.resolve(root, 'src/server'))
const config = require(path.resolve(root, 'src/config'))

// *** Some setup ***

// Shut the logger up
const Logger = require('@mojaloop/central-services-logger')
Logger.transports.forEach(t => { t.silent = true })

const headers = {
  'content-type': 'application/json',
  date: 'test',
  'fspiop-source': 'test',
  accept: 'application/json'
}

const nullInitObj = () => ({ init: () => {} })
const pathfinder = () => ({
  connect: () => {}
})

test.beforeEach(async t => {
  t.context = {
    server: await createServer({
      config,
      alsDb: nullInitObj(),
      centralLedgerDb: nullInitObj(),
      pathfinder: pathfinder()
    })
  }
})

// *** Tests ***

test('health-check succeeds if db is connected, pf queries are ok', async t => {
  t.context.server.app.db.isConnected = () => true
  t.context.server.app.pf.query = () => ({})
  const response = await t.context.server.inject({
    method: 'get',
    url: '/'
  })
  t.is(response.statusCode, 200)
})

test('health-check fails if pathfinder query fails', async t => {
  t.context.server.app.db.isConnected = () => true
  t.context.server.app.pf.query = () => { throw new Error('whatever') }
  const response = await t.context.server.inject({
    method: 'get',
    url: '/'
  })
  t.is(response.statusCode, 500)
})

test('health-check fails if db is not connected', async t => {
  t.context.server.app.db.isConnected = () => false
  t.context.server.app.pf.query = () => ({})
  const response = await t.context.server.inject({
    method: 'get',
    url: '/'
  })
  t.is(response.statusCode, 500)
})

test('test get participants by type and id, invalid E164', async t => {
  const expectedResult = [{ fspId: 'test', currency: 'TEST' }]
  t.context.server.app.db.getPartyParticipant = () => expectedResult
  const response = await t.context.server.inject({
    method: 'get',
    headers,
    url: '/participants/MSISDN/blah'
  })
  t.is(response.statusCode, 400)
  t.deepEqual(JSON.parse(response.payload), {
    statusCode: 400,
    error: 'Bad Request',
    message: { errorInformation: { errorDescription: 'ID is not valid E164 number' } }
  })
})

test('test get participants by type and id, no currency', async t => {
  const expectedResult = { partyList: [{ fspId: 'test', currency: 'TEST' }] }
  const msisdn = '1230456'
  const pfResult = { mcc: '123', mnc: '456' }
  t.context.server.app.pf.query = (msisdnPf) => {
    t.deepEqual(msisdnPf, msisdn)
    return pfResult
  }
  t.context.server.app.db.getParticipantInfoFromMccMnc = (mcc, mnc) => {
    t.deepEqual(pfResult, { mcc, mnc })
    return expectedResult.partyList
  }
  const response = await t.context.server.inject({
    method: 'get',
    headers,
    url: `/participants/MSISDN/${msisdn}`
  })
  t.is(response.statusCode, 200)
  t.deepEqual(JSON.parse(response.payload), expectedResult)
})

test('test get participants by type and id, currency query param positive response', async t => {
  const expectedResult = { partyList: [{ fspId: 'test', currency: 'TEST' }] }
  const msisdn = '1230456'
  const pfResult = { mcc: '123', mnc: '456' }
  t.context.server.app.pf.query = (msisdnPf) => {
    t.deepEqual(msisdnPf, msisdn)
    return pfResult
  }
  t.context.server.app.db.getParticipantInfoFromMccMnc = (mcc, mnc) => {
    t.deepEqual(pfResult, { mcc, mnc })
    return [
      ...expectedResult.partyList,
      { fspId: 'blah', currency: 'TESTWHATEVER' }
    ]
  }
  const response = await t.context.server.inject({
    method: 'get',
    headers,
    url: `/participants/MSISDN/${msisdn}?currency=TEST`
  })
  t.is(response.statusCode, 200)
  t.deepEqual(JSON.parse(response.payload), expectedResult)
})

test('test get participants by type and id, currency query param negative response', async t => {
  const expectedResult = {
    statusCode: 404,
    error: 'Not Found',
    message: { errorInformation: { errorDescription: 'FSP not found' } }
  }
  const msisdn = '1230456'
  const pfResult = { mcc: '123', mnc: '456' }
  t.context.server.app.pf.query = (msisdnPf) => {
    t.deepEqual(msisdnPf, msisdn)
    return pfResult
  }
  t.context.server.app.db.getParticipantInfoFromMccMnc = (mcc, mnc) => {
    t.deepEqual(pfResult, { mcc, mnc })
    return null
  }
  const response = await t.context.server.inject({
    method: 'get',
    headers,
    url: `/participants/MSISDN/${msisdn}?currency=BLAH`
  })
  t.is(response.statusCode, 404)
  t.deepEqual(JSON.parse(response.payload), expectedResult)
})

test('test get participants by type and id, mcc, mnc invalid', async t => {
  const expectedResult = {
    partyList: []
  }
  const msisdn = '1230456'
  const pfResult = { mcc: '123', mnc: '456' }
  t.context.server.app.pf.query = () => ({})
  t.context.server.app.db.getParticipantInfoFromMccMnc = (mcc, mnc) => {
    t.deepEqual(pfResult, { mcc, mnc })
    return null
  }
  const response = await t.context.server.inject({
    method: 'get',
    headers,
    url: `/participants/MSISDN/${msisdn}?currency=BLAH`
  })
  t.is(response.statusCode, 200)
  t.deepEqual(JSON.parse(response.payload), expectedResult)
})

test('test put participants by type and id', async t => {
  const msisdn = '1230456'
  const pfResult = { mcc: '123', mnc: '456' }
  const payload = { fspId: 'blah', currency: 'blah' }
  t.context.server.app.pf.query = () => (pfResult)
  t.context.server.app.db.putParticipantInfo = (fspId, mcc, mnc) => {
    t.deepEqual(fspId, payload.fspId)
    t.deepEqual(pfResult, { mcc, mnc })
  }
  const response = await t.context.server.inject({
    method: 'put',
    headers,
    url: `/participants/MSISDN/${msisdn}`,
    payload
  })
  t.is(response.statusCode, 200)
  t.assert(response.headers['content-length'] === 0)
})

test('test put participants by type and id with non-msisdn Type receives HTTP 501', async t => {
  const payload = { fspId: 'blah', currency: 'blah' }
  const response = await t.context.server.inject({
    method: 'put',
    headers,
    url: '/participants/BUSINESS/blah',
    payload
  })
  t.assert(JSON.parse(response.payload).message.errorInformation.errorDescription.match(/MSISDN/))
  t.is(response.statusCode, 501)
})

test('test put participants by type and id with partySubIdOrType in payload receives HTTP 501', async t => {
  const payload = { fspId: 'blah', currency: 'blah', partySubIdOrType: 'haha' }
  const response = await t.context.server.inject({
    method: 'put',
    headers,
    url: '/participants/MSISDN/12345',
    payload
  })
  t.assert(JSON.parse(response.payload).message.errorInformation.errorDescription.match(/partySubIdOrType/))
  t.is(response.statusCode, 501)
})

test('test put participants by invalid MSISDN receives error response', async t => {
  const payload = { fspId: 'blah', currency: 'blah' }
  const response = await t.context.server.inject({
    method: 'put',
    headers,
    url: '/participants/MSISDN/blah',
    payload
  })
  t.deepEqual(JSON.parse(response.payload), {
    statusCode: 400,
    error: 'Bad Request',
    message: { errorInformation: { errorDescription: 'ID is not valid E164 number' } }
  })
  t.is(response.statusCode, 400)
})

test('test put participants by type and id with MSISDN not resolved by pathfinder', async t => {
  t.context.server.app.pf.query = () => ({})
  t.context.server.app.db.putParticipantInfo = () => {
    throw new Error('DB should not be called')
  }
  const response = await t.context.server.inject({
    method: 'put',
    headers,
    url: '/participants/MSISDN/123456',
    payload: { fspId: 'blah', currency: 'blah' }
  })
  t.is(response.statusCode, 404)
  t.assert(JSON.parse(response.payload).message.errorInformation.errorDescription.match(/Party not found/))
})

test('test put participants by type and id with fspId not available in DB', async t => {
  const pfResult = { mcc: '123', mnc: '456' }
  t.context.server.app.pf.query = () => (pfResult)
  t.context.server.app.db = {
    putParticipantInfo: () => {
    // eslint-disable-next-line no-throw-literal
      throw { code: 'PARTICIPANT_NOT_FOUND' }
    },
    verifyErrorType: () => true,
    ErrorCodes: {}
  }
  const response = await t.context.server.inject({
    method: 'put',
    headers,
    url: '/participants/MSISDN/123456',
    payload: { fspId: 'blah', currency: 'blah' }
  })
  t.is(response.statusCode, 404)
  t.assert(JSON.parse(response.payload).message.errorInformation.errorDescription.match(/FSP not found/))
})

test('test post participants', async t => {
  const response = await t.context.server.inject({
    method: 'post',
    headers,
    url: '/participants',
    payload: { requestId: 'blah', partyList: [{
      partyIdType: 'blah',
      partyIdentifier: 'blah'
    }]}
  })
  t.is(response.statusCode, 501)
  t.assert(JSON.parse(response.payload).message.errorInformation.errorDescription.match(/Not Implemented/))
})

test('test post participants by type and id', async t => {
  const response = await t.context.server.inject({
    method: 'post',
    headers,
    url: '/participants/MSISDN/123456',
    payload: { fspId: 'blah', currency: 'blah' }
  })
  t.is(response.statusCode, 501)
  t.assert(JSON.parse(response.payload).message.errorInformation.errorDescription.match(/Not Implemented/))
})

test('test delete participants by type and id', async t => {
  const response = await t.context.server.inject({
    method: 'delete',
    headers,
    url: '/participants/MSISDN/123456'
  })
  t.is(response.statusCode, 501)
  t.assert(JSON.parse(response.payload).message.errorInformation.errorDescription.match(/Not Implemented/))
})
