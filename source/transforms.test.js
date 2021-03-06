import test from "ava"
import {appendEntities} from "./transforms"
import {replaceEntities} from "./transforms"
import {insertEntity} from "./transforms"
import {removeEntity} from "./transforms"

test("replaceEntities", (t) => {
  const collection = "users"
  const ownerId = "666"
  const entities = [{id: "123", name: "John"}, {id: "456", name: "Anna"}]
  const state = {
    lookupTable: {
      "666": {id: "666", name: "Team A"},
    },
  }

  const result = replaceEntities(collection, ownerId, entities, state)

  const expected = {
    lookupTable: {
      "123": {id: "123", name: "John"},
      "456": {id: "456", name: "Anna"},
      "666": {id: "666", name: "Team A"},
    },
    collections: {
      "666": {users: ["123", "456"]},
    },
  }

  t.deepEqual(result, expected, "Replaces entities at owner")
})

test("appendEntities", (t) => {
  const collection = "users"
  const ownerId = "666"
  const entities = [{id: "456", name: "Anna"}]
  const state = {
    lookupTable: {
      "123": {id: "123", name: "John"},
      "666": {id: "666", name: "Team A"},
    },
    collections: {
      "666": {users: ["123"]},
    },
  }

  const result = appendEntities(collection, ownerId, entities, state)

  const expected = {
    lookupTable: {
      "123": {id: "123", name: "John"},
      "456": {id: "456", name: "Anna"},
      "666": {id: "666", name: "Team A"},
    },
    collections: {
      "666": {users: ["123", "456"]},
    },
  }

  t.deepEqual(result, expected, "Appends entities at owner")
})

test("insertEntity", (t) => {
  const collection = "users"
  const ownerId = "666"
  const entity = {id: "456", name: "Alice"}
  const state = {
    lookupTable: {
      "123": {id: "123", name: "John"},
      "666": {id: "666", name: "Team A"},
    },
    collections: {
      root: {teams: ["666"]},
    },
  }

  const result = insertEntity(collection, ownerId, entity, state)

  const expected = {
    lookupTable: {
      "123": {id: "123", name: "John"},
      "456": {id: "456", name: "Alice"},
      "666": {id: "666", name: "Team A"},
    },
    collections: {
      root: {teams: ["666"]},
      "666": {users: ["456"]},
    },
  }

  t.deepEqual(result, expected, "Adds entity to owner's collection")
})

test("removeEntity", (t) => {
  const collection = "users"
  const ownerId = "666"
  const entity = {id: "123"}
  const state = {
    lookupTable: {
      "123": {id: "123", name: "John"},
      "456": {id: "456", name: "Alice"},
      "666": {id: "666", name: "Team A"},
    },
    collections: {
      root: {teams: ["666"]},
      "666": {users: ["123"]},
    },
  }

  const result = removeEntity(collection, ownerId, entity, state)

  const expected = {
    lookupTable: {
      "456": {id: "456", name: "Alice"},
      "666": {id: "666", name: "Team A"},
    },
    collections: {
      root: {teams: ["666"]},
      "666": {users: []},
    },
  }

  t.deepEqual(result, expected, "Removes entity from lookup table and owner's collection")

  const result2 = removeEntity(collection, ownerId, {id: "???"}, state)
  const expected2 = state

  t.deepEqual(result2, expected2, "Removing an entity that has not been found should be a no op")

  const result3 = removeEntity(collection, "???", {id: "123"}, state)
  const expected3 = {
    lookupTable: {
      "456": {id: "456", name: "Alice"},
      "666": {id: "666", name: "Team A"},
    },
    collections: {
      root: {teams: ["666"]},
      "666": {users: ["123"]},
    },
  }

  t.deepEqual(result3, expected3, "Removing an entity at unknown owner should still remove it from lookupTable")
})
