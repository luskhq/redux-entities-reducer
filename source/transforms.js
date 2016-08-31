import r from "ramda"

export const id = r.prop("id")

export const ids = r.pluck("id")

export const indexById = r.indexBy(r.prop("id"))

export const mergeInto = r.flip(r.merge)

export const replaceEntity = (entity, state) => {
  const transform = r.over(
    r.lensProp("lookupTable"),
    mergeInto({[id(entity)]: entity})
  )

  return transform(state)
}

export const replaceEntities = (collection, ownerId, entities, state) => {
  const transform = r.compose(
    r.set(r.lensPath(["collections", ownerId, collection]), ids(entities)),
    r.over(r.lensProp("lookupTable"), mergeInto(indexById(entities)))
  )

  return transform(state)
}

export const insertEntity = (collection, ownerId, entity, state) => {
  const transform = r.compose(
    r.set(r.lensPath(["lookupTable", id(entity)]), entity),
    r.over(r.lensPath(["collections", ownerId, collection]), r.compose(
      r.uniq, r.append(id(entity))
    ))
  )

  return transform(state)
}

export const removeEntity = (collection, ownerId, entity, state) => {
  const transform = r.compose(
    r.over(r.lensProp("lookupTable"), r.omit(id(entity))),
    r.when(
      r.path(["collections", ownerId, collection]),
      r.over(
        r.lensPath(["collections", ownerId, collection]),
        r.reject(r.equals(id(entity)))
      )
    ),
  )

  return transform(state)
}
