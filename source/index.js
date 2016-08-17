import r from 'ramda'
import * as transforms from './transforms'

// Actions
// =======

export const clearState = () => ({
  type: 'entities/clearEntities',
})

export const replaceEntities = r.curry((collection, ownerId, entities) => ({
  type: 'entities/replaceEntities',
  payload: {
    entities,
    collection,
    ownerId,
  },
}))

export const replaceEntity = (entity) => ({
  type: 'entities/replaceEntity',
  payload: {entity},
})

export const insertEntity = r.curry((collection, ownerId, entity) => ({
  type: 'entities/insertEntity',
  payload: {collection, ownerId, entity},
}))

export const removeEntity = r.curry((collection, ownerId, entityId) => ({
  type: 'entities/removeEntity',
  payload: {collection, ownerId, entityId},
}))

// Reducer
// =======

const initialState = {lookupTable: {}}

const reduceEntities = (state = initialState, {type, payload}) => {

  switch (type) {
    case 'entities/clearEntities':
      return initialState

    case 'entities/replaceEntity':
      return transforms.replaceEntity(payload.entity, state)

    case 'entities/replaceEntities':
      return transforms.replaceEntities(payload.collection, payload.ownerId, payload.entities, state)

    case 'entities/insertEntity':
      return transforms.insertEntity(payload.collection, payload.ownerId, payload.entity, state)

    case 'entities/removeEntity':
      return transforms.removeEntity(payload.collection, payload.ownerId, payload.entityId, state)

    default:
      return state
  }
}

export default reduceEntities
