import r from 'ramda'
import {getCollectionIdsByOwner} from './selectors'
import {getLookupTable} from './selectors'

export const pluckIds = r.pluck('id')

export const createLookupTable = r.zipObj

export const mergeInto = r.flip(r.merge)

export const replaceEntity = (entity, state) => {
  const transform = r.compose(
    r.over(
      r.lensProp('lookupTable'),
      mergeInto({[entity.id]: entity})
    ),
  )

  return transform(state)
}

export const replaceEntities = (collection, ownerId, entities, state) => {
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

export const insertEntity = (collection, ownerId, entity, state) => {
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

export const removeEntity = (collection, ownerId, entityId, state) => {
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
