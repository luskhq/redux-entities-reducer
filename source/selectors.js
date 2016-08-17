import r from 'ramda'

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
