import r from "ramda"

export const clearState = () => ({
  type: "entities/clearEntities",
})

export const replaceEntities = r.curry((collection, ownerId, entities) => ({
  type: "entities/replaceEntities",
  payload: {collection, ownerId, entities},
}))

export const replaceEntity = (entity) => ({
  type: "entities/replaceEntity",
  payload: {entity},
})

export const insertEntity = r.curry((collection, ownerId, entity) => ({
  type: "entities/insertEntity",
  payload: {collection, ownerId, entity},
}))

export const removeEntity = r.curry((collection, ownerId, entity) => ({
  type: "entities/removeEntity",
  payload: {collection, ownerId, entity},
}))
