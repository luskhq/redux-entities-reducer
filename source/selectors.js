import r from "ramda"

export const getLookupTable = r.propOr({}, "lookupTable")

export const getCollectionIds = r.curry((collection, owner, state) =>
  r.pathOr([], ["collections", owner, collection], state)
)

export const getEntity = r.curry((entityId, state) =>
  r.propOr({notFound: true}, entityId, getLookupTable(state))
)

export const getEntities = r.curry((collection, ownerId, state) => r.map(
  getEntity(r.__, state),
  getCollectionIds(collection, ownerId, state),
))
