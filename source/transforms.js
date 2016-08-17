import r from 'ramda'

export const pluckIds = r.pluck('id')

export const mergeInto = r.flip(r.merge)

export const replaceEntity = (entity, state) => {
  const transform = r.over(
    r.lensProp('lookupTable'),
    mergeInto({[entity.id]: entity})
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
      mergeInto(r.zipObj(ids, entities))
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
    r.over(
      (ownerId)
        ? r.lensPath(['collections', ownerId, collection])
        : r.lensPath(['collections', collection]),
      r.compose(
        r.uniq,
        r.append(entity.id)
      )
    )
  )

  return transform(state)
}

export const removeEntity = (collection, ownerId, entityId, state) => {
  const transform = r.compose(
    r.over(
      r.lensProp('lookupTable'),
      r.omit(entityId)
    ),
    r.over(
      (ownerId)
        ? r.lensPath(['collections', ownerId, collection])
        : r.lensPath(['collections', collection]),
      r.reject(r.equals(entityId))
    ),
  )

  return transform(state)
}
