import test from 'ava'
import {getCollectionIdsByOwner} from './selectors'

test('getCollectionIdsByOwner', (t) => {
  const collection = 'users'
  const ownerId = '666'
  const state = {
    lookupTable: {
      '123': {id: '123', name: 'John'},
      '456': {id: '456', name: 'Alice'},
      '666': {id: '666', name: 'Team A'},
    },
    collections: {
      '666': {users: ['123', '456']},
    },
  }

  const result = getCollectionIdsByOwner(collection, ownerId, state)

  const expected = ['123', '456']

  t.deepEqual(result, expected)
})

test('getCollectionIdsByOwner', (t) => {
  const collection = 'users'
  const ownerId = null
  const state = {
    lookupTable: {
      '123': {id: '123', name: 'John'},
      '456': {id: '456', name: 'Alice'},
      '666': {id: '666', name: 'Team A'},
    },
    collections: {
      users: ['123'],
      '666': {users: ['456']},
    },
  }

  const result = getCollectionIdsByOwner(collection, ownerId, state)

  const expected = ['123']

  t.deepEqual(result, expected)
})
