import r from 'ramda'

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

// Selectors
// =========

export const getLookupTable = r.propOr({}, 'lookupTable')

export const getCollectionIds = r.propOr([])

export const getCollectionIdsByOwner = r.curry((collection, ownerId, state) => {
  return (ownerId)
    ? getCollectionIds(collection, r.view(r.lensPath(['collections', ownerId]), state))
    : getCollectionIds(collection, r.view(r.lensProp('collections'), state))
})

export const getEntity = r.curry((entityId, state) => {
  return r.propOr({notFound: true}, entityId, getLookupTable(state))
})

export const getEntities = r.curry((collection, ownerId, state) => {
  return r.map(
    getEntity(r.__, state),
    getCollectionIdsByOwner(collection, ownerId, state),
  )
})

// Transforms
// ==========

export const pluckIds = r.pluck('id')

export const createLookupTable = r.zipObj

export const mergeInto = r.flip(r.merge)

export const transformReplaceEntity = (entity, state) => {
  const transform = r.compose(
    r.over(
      r.lensProp('lookupTable'),
      mergeInto({[entity.id]: entity})
    ),
  )

  return transform(state)
}

export const transformReplaceEntities = (collection, ownerId, entities, state) => {
  const ids = pluckIds(entities)

  const transform = r.compose(
    r.set(
      (ownerId)
        ? r.lensPath(['collections', ownerId, collection])
        : r.lensPath(['collections', collection]),
      ids
    ),
    r.over(
      r.lensProp('lookupTable'),
      mergeInto(createLookupTable(ids, entities))
    ),
  )

  return transform(state)
}

export const transformInsertEntity = (collection, ownerId, entity, state) => {
  const transform = r.compose(
    r.set(
      r.lensPath(['lookupTable', entity.id]),
      entity
    ),
    r.set(
      (ownerId)
        ? r.lensPath(['collections', ownerId, collection])
        : r.lensPath(['collections', collection]),
      r.uniq(r.concat(pluckIds([entity]), getCollectionIdsByOwner(collection, ownerId, state)))
    ),
  )

  return transform(state)
}

export const transformInsertEntityNormalize = (collection, ownerId, normalize, entity, state) => {
  const transform = r.compose(
    r.set(
      r.lensPath(['lookupTable', entity.id]),
      entity
    ),
    r.set(
      (ownerId)
        ? r.lensPath(['collections', ownerId, collection])
        : r.lensPath(['collections', collection]),
      r.uniq(r.concat(pluckIds([entity]), getCollectionIdsByOwner(collection, ownerId, state)))
    ),
  )

  return transform(state)
}

export const transformRemoveEntity = (collection, ownerId, entityId, state) => {
  const transform = r.compose(
    r.set(
      (ownerId)
        ? r.lensPath(['collections', ownerId, collection])
        : r.lensPath(['collections', collection]),
      r.reject(r.equals(entityId), getCollectionIdsByOwner(collection, ownerId, state))
    ),
    r.set(
      r.lensProp('lookupTable'),
      r.omit(entityId, getLookupTable(state))
    ),
  )

  return transform(state)
}

// Reducer
// =======

const initialState = {lookupTable: {}}

const reduceEntities = (state = initialState, {type, payload}) => {

  switch (type) {
    case 'entities/clearEntities':
      return initialState

    case 'entities/replaceEntity':
      return transformReplaceEntity(payload.entity, state)

    case 'entities/replaceEntities':
      return transformReplaceEntities(payload.collection, payload.ownerId, payload.entities, state)

    case 'entities/insertEntity':
      return transformInsertEntity(payload.collection, payload.ownerId, payload.entity, state)

    case 'entities/removeEntity':
      return transformRemoveEntity(payload.collection, payload.ownerId, payload.entityId, state)

    default:
      return state
  }
}

export default reduceEntities
