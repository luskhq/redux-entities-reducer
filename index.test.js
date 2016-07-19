import test from 'tape'
import {createLookupTable} from './index'
import {pluckIds} from './index'
import {transformReplaceEntities} from './index'
import {transformInsertEntity} from './index'

test('createLookupTable', (t) => {

  const actual = createLookupTable([
    {_id: '123', name: 'John'},
    {_id: '456', name: 'Anna'},
  ])
  const expected = {
    '123': {_id: '123', name: 'John'},
    '456': {_id: '456', name: 'Anna'},
  }

  t.deepEqual(actual, expected)
  t.end()
})

test('pluckIds', (t) => {

  const actual = pluckIds([
    {_id: '123', name: 'John'},
    {_id: '456', name: 'Anna'},
  ])
  const expected = ['123', '456']

  t.deepEqual(actual, expected)
  t.end()
})

test('transformReplaceEntities | Should replace entities in the root if no owner is specified', (t) => {
  const collection = 'users'
  const ownerId = null
  const entities = [{_id: '123', name: 'John'}, {_id: '456', name: 'Anna'}]
  const state = {lookupTable: {}}

  const result = transformReplaceEntities(collection, ownerId, entities, state)

  const expected = {
    lookupTable: {
      '123': {_id: '123', name: 'John'},
      '456': {_id: '456', name: 'Anna'},
    },
    users: ['123', '456'],
  }

  t.deepEqual(result, expected)
  t.end()
})

test('transformReplaceEntities | Should replace entities at owner', (t) => {
  const collection = 'users'
  const ownerId = '666'
  const entities = [{_id: '123', name: 'John'}, {_id: '456', name: 'Anna'}]
  const state = {
    lookupTable: {
      '666': {_id: '666', name: 'Team A', users: []},
    },
  }

  const result = transformReplaceEntities(collection, ownerId, entities, state)

  const expected = {
    lookupTable: {
      '666': {_id: '666', name: 'Team A', users: ['123', '456']},
      '123': {_id: '123', name: 'John'},
      '456': {_id: '456', name: 'Anna'},
    },
  }

  t.deepEqual(result, expected)
  t.end()
})

test('transformInsertEntity | Returns state w/ single entity added to lookup table', (t) => {
  const entity = {_id: '666', name: 'Team A', users: []}
  const state = {
    lookupTable: {
      '123': {_id: '123', name: 'John'},
    },
  }

  const result = transformInsertEntity(entity, state)

  const expected = {
    lookupTable: {
      '123': {_id: '123', name: 'John'},
      '666': {_id: '666', name: 'Team A', users: []},
    },
  }

  t.deepEqual(result, expected)
  t.end()
})
