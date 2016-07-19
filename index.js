import r from 'ramda'

// Actions
// =======

export const replaceEntities = r.curry((collection, ownerId, entities) => ({
  type: 'entities/replaceEntities',
  payload: {
    entities,
    collection,
    ownerId,
  },
}))

export const insertEntity = (entity) => ({
  type: 'entities/insertEntity',
  payload: {entity},
})

// Selectors
// =========

export const getLookupTable = r.propOr({}, 'lookupTable')

export const getCollectionIds = r.propOr([])

export const getEntity = r.curry((id, state) => {
  return r.propOr({notFound: true}, id, getLookupTable(state))
})

export const getEntities = r.curry((collectionName, state) => {
  return r.map(
    getEntity(r.__, state),
    getCollectionIds(collectionName, state),
  )
})

// Transforms
// ==========

export const pluckIds = r.pluck('_id')

export const createLookupTable = r.indexBy(r.prop('_id'))

export const mergeInto = r.flip(r.merge)

export const transformReplaceEntities = (collection, ownerId, entities, state) => {

  const transform = r.compose(
    r.over(r.lensProp('lookupTable'),
      mergeInto(createLookupTable(entities))),
    r.set((ownerId)
      ? r.lensPath(['lookupTable', ownerId, collection])
      : r.lensProp(collection),
      pluckIds(entities)),
  )

  return transform(state)
}

export const transformInsertEntity = (entity, state) => {
  const transform = r.set(
    r.lensPath(['lookupTable', entity._id]),
    entity,
  )

  return transform(state)
}

// Reducer
// =======

const reduceEntities = (state = {lookupTable: {}}, action) => {

  switch (action.type) {
    case 'entities/replaceEntities':
      const {collection, ownerId, entities} = action.payload
      return transformReplaceEntities(collection, ownerId, entities, state)

    case 'entities/insertEntity':
      const {entity} = action.payload
      return transformInsertEntity(entity, state)

    default:
      return state
  }
}

export default reduceEntities
