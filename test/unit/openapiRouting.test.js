'use strict'

const test = require('ava').default
const { assertHandlersRegistered } = require('../../src/server')

const operation = (method, path, operationId) => ({ method, path, operationId })

test('assertHandlersRegistered accepts a fully wired api', (t) => {
  const api = {
    getOperations: () => [operation('get', '/participants/{Type}/{ID}', 'ParticipantsByTypeAndIDGet')],
    handlers: { ParticipantsByTypeAndIDGet: () => {} }
  }
  t.notThrows(() => assertHandlersRegistered(api), 'no error is thrown')
})

test('assertHandlersRegistered throws naming operations with no handler', (t) => {
  const api = {
    getOperations: () => [
      operation('get', '/participants/{Type}/{ID}', 'ParticipantsByTypeAndIDGet'),
      operation('post', '/participants', 'ParticipantsPost'),
      operation('get', '/unnamed', undefined)
    ],
    handlers: { ParticipantsByTypeAndIDGet: () => {} }
  }

  const error = t.throws(() => assertHandlersRegistered(api))
  t.regex(error.message, /POST \/participants \(operationId: ParticipantsPost\)/, 'the unhandled operation is named')
  t.regex(error.message, /GET \/unnamed \(operationId: undefined\)/, 'an operation with no operationId is reported')
  t.false(error.message.includes('/participants/{Type}/{ID}'), 'the handled operation is not reported')
})
