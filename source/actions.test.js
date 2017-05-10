import test from "ava"
import {clearState} from "./actions"
import {replaceEntities} from "./actions"
import {replaceEntity} from "./actions"
import {insertEntity} from "./actions"
import {insertEntities} from "./actions"
import {removeEntity} from "./actions"

test("clearState", (t) => {
  const result = clearState()
  const expected = {type: "entities/clearEntities"}
  t.deepEqual(result, expected, "Returns correct action")
})

test("replaceEntities", (t) => {
  const result = replaceEntities("users", "666", [{id: "123", name: "John"}])
  const expected = {
    type: "entities/replaceEntities",
    payload: {
      collection: "users",
      ownerId: "666",
      entities: [{id: "123", name: "John"}],
    },
  }
  t.deepEqual(result, expected, "Returns correct action object")

  const result2 = replaceEntities("users")("666")([{id: "123", name: "John"}])
  t.deepEqual(result2, expected, "Is curried")
})

test("replaceEntity", (t) => {
  const result = replaceEntity({id: "123", name: "John"})
  const expected = {
    type: "entities/replaceEntity",
    payload: {entity: {id: "123", name: "John"}},
  }
  t.deepEqual(result, expected, "Returns correct action object")
})

test("insertEntity", (t) => {
  const result = insertEntity("users", "666", {id: "123", name: "John"})
  const expected = {
    type: "entities/insertEntity",
    payload: {
      collection: "users",
      ownerId: "666",
      entity: {id: "123", name: "John"},
    },
  }
  t.deepEqual(result, expected, "Returns correct action object")

  const result2 = insertEntity("users")("666")({id: "123", name: "John"})
  t.deepEqual(result2, expected, "Is curried")
})

test("insertEntities", (t) => {
  const result = insertEntities("users", "666", [{id: "123", name: "John"}])
  const expected = {
    type: "entities/insertEntities",
    payload: {
      collection: "users",
      ownerId: "666",
      entities: [{id: "123", name: "John"}],
    },
  }
  t.deepEqual(result, expected, "Returns correct action object")

  const result2 = insertEntities("users")("666")([{id: "123", name: "John"}])
  t.deepEqual(result2, expected, "Is curried")
})

test("removeEntity", (t) => {
  const result = removeEntity("users", "666", {id: "123"})
  const expected = {
    type: "entities/removeEntity",
    payload: {
      collection: "users",
      ownerId: "666",
      entity: {id: "123"},
    },
  }
  t.deepEqual(result, expected, "Returns correct action object")

  const result2 = removeEntity("users")("666")({id: "123"})
  t.deepEqual(result2, expected, "Is curried")
})
