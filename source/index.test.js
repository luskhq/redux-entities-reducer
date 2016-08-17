import test from 'ava'
import {createLookupTable} from './index'
import {pluckIds} from './index'
import {getCollectionIdsByOwner} from './index'
import {transformReplaceEntities} from './index'
import {transformInsertEntity} from './index'
import {transformRemoveEntity} from './index'

test('createLookupTable', (t) => {

  const actual = createLookupTable(
    ['123', '456'],
    [{id: '123', name: 'John'}, {id: '456', name: 'Anna'}]
  )
  const expected = {
    '123': {id: '123', name: 'John'},
    '456': {id: '456', name: 'Anna'},
  }

  t.deepEqual(actual, expected)
})

test('pluckIds', (t) => {

  const actual = pluckIds([
    {id: '123', name: 'John'},
    {id: '456', name: 'Anna'},
  ])
  const expected = ['123', '456']

  t.deepEqual(actual, expected)
})

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

test('transformReplaceEntities | Should replace entities in the root if no owner is specified', (t) => {
  const collection = 'users'
  const ownerId = null
  const entities = [{id: '123', name: 'John'}, {id: '456', name: 'Anna'}]
  const state = {lookupTable: {}}

  const result = transformReplaceEntities(collection, ownerId, entities, state)

  const expected = {
    lookupTable: {
      '123': {id: '123', name: 'John'},
      '456': {id: '456', name: 'Anna'},
    },
    collections: {
      users: ['123', '456'],
    },
  }

  t.deepEqual(result, expected)
})

test('transformReplaceEntities | Should replace entities at owner', (t) => {
  const collection = 'users'
  const ownerId = '666'
  const entities = [{id: '123', name: 'John'}, {id: '456', name: 'Anna'}]
  const state = {
    lookupTable: {
      '666': {id: '666', name: 'Team A'},
    },
  }

  const result = transformReplaceEntities(collection, ownerId, entities, state)

  const expected = {
    lookupTable: {
      '123': {id: '123', name: 'John'},
      '456': {id: '456', name: 'Anna'},
      '666': {id: '666', name: 'Team A'},
    },
    collections: {
      '666': {users: ['123', '456']},
    },
  }

  t.deepEqual(result, expected)
})

test('transformInsertEntity | Returns state w/ single entity added to collection', (t) => {
  const collection = 'teams'
  const ownerId = null
  const entity = {id: '666', name: 'Team A'}
  const state = {
    lookupTable: {
      '123': {id: '123', name: 'John'},
    },
  }

  const result = transformInsertEntity(collection, ownerId, entity, state)

  const expected = {
    lookupTable: {
      '123': {id: '123', name: 'John'},
      '666': {id: '666', name: 'Team A'},
    },
    collections: {
      teams: ['666'],
    },
  }

  t.deepEqual(result, expected)
})

test('transformInsertEntity | Returns state w/ single entity added to owner collection', (t) => {
  const collection = 'users'
  const ownerId = '666'
  const entity = {id: '456', name: 'Alice'}
  const state = {
    lookupTable: {
      '123': {id: '123', name: 'John'},
      '666': {id: '666', name: 'Team A'},
    },
    collections: {
      teams: ['666'],
    },
  }

  const result = transformInsertEntity(collection, ownerId, entity, state)

  const expected = {
    lookupTable: {
      '123': {id: '123', name: 'John'},
      '456': {id: '456', name: 'Alice'},
      '666': {id: '666', name: 'Team A'},
    },
    collections: {
      teams: ['666'],
      '666': {users: ['456']},
    },
  }

  t.deepEqual(result, expected)
})

test('transformRemoveEntity | Returns state w/ single entity is removed from lookup table and collection', (t) => {
  const collection = 'users'
  const ownerId = null
  const id = '123'
  const state = {
    lookupTable: {
      '123': {id: '123', name: 'John'},
      '456': {id: '456', name: 'Alice'},
      '666': {id: '666', name: 'Team A'},
    },
    collections: {
      users: ['123', '456'],
    },
  }

  const result = transformRemoveEntity(collection, ownerId, id, state)

  const expected = {
    lookupTable: {
      '456': {id: '456', name: 'Alice'},
      '666': {id: '666', name: 'Team A'},
    },
    collections: {
      users: ['456'],
    },
  }

  t.deepEqual(result, expected)
})

test('transformRemoveEntity | Returns state w/ single entity is removed from lookup table and owner collection', (t) => {
  const collection = 'users'
  const ownerId = '666'
  const entityId = '123'
  const state = {
    lookupTable: {
      '123': {id: '123', name: 'John'},
      '456': {id: '456', name: 'Alice'},
      '666': {id: '666', name: 'Team A'},
    },
    collections: {
      users: ['456'],
      '666': {users: ['123']},
    },
  }

  const result = transformRemoveEntity(collection, ownerId, entityId, state)

  const expected = {
    lookupTable: {
      '456': {id: '456', name: 'Alice'},
      '666': {id: '666', name: 'Team A'},
    },
    collections: {
      users: ['456'],
      '666': {users: []},
    },
  }

  t.deepEqual(result, expected)
})
