import * as actions from "./actions"
import * as selectors from "./selectors"
import * as transforms from "./transforms"

export {
  actions,
  selectors,
}

const initialState = {lookupTable: {}, collections: {}}

const reduceEntities = (state = initialState, {type, payload}) => {

  switch (type) {
    case "entities/clearEntities":
      return initialState

    case "entities/replaceEntity":
      return transforms.replaceEntity(payload.entity, state)

    case "entities/replaceEntities":
      return transforms.replaceEntities(payload.collection, payload.ownerId, payload.entities, state)

    case "entities/insertEntity":
      return transforms.insertEntity(payload.collection, payload.ownerId, payload.entity, state)

    case "entities/removeEntity":
      return transforms.removeEntity(payload.collection, payload.ownerId, payload.entityId, state)

    default:
      return state
  }
}

export default reduceEntities
