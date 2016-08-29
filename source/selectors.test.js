import test from "ava"
import {getLookupTable} from "./selectors"
import {getCollectionIds} from "./selectors"
import {getEntity} from "./selectors"
import {getEntities} from "./selectors"

const getState = () => ({
  lookupTable: {
    "123": {id: "123", name: "John"},
    "456": {id: "456", name: "Alice"},
    "666": {id: "666", name: "Team A"},
  },
  collections: {
    "root": {teams: ["666"]},
    "666": {users: ["123", "456", "???"]},
  },
})

test("getCollectionIds", (t) => {
  const result1 = getCollectionIds("users", "666", getState())
  const expected1 = ["123", "456", "???"]
  t.deepEqual(result1, expected1, "Returns correct list of ids")

  const result2 = getCollectionIds("users", "???", getState())
  const expected2 = []
  t.deepEqual(result2, expected2, "Returns empty array when owner not found")

  const result3 = getCollectionIds("???", "666", getState())
  const expected3 = []
  t.deepEqual(result3, expected3, "Returns empty array when collection not found")
})

test("getLookupTable", (t) => {
  const result = getLookupTable(getState())
  const expected = {
    "123": {id: "123", name: "John"},
    "456": {id: "456", name: "Alice"},
    "666": {id: "666", name: "Team A"},
  }
  t.deepEqual(result, expected, "Returns the lookupTable")
})

test("getEntity", (t) => {
  const result1 = getEntity("456", getState())
  const expected1 = {id: "456", name: "Alice"}
  t.deepEqual(result1, expected1, "Returns correct entity")

  const result2 = getEntity("???", getState())
  const expected2 = {notFound: true}
  t.deepEqual(result2, expected2, "Returns notFound object when entity not found")
})

test("getEntities", (t) => {
  const result1 = getEntities("users", "666", getState())
  const expected1 = [{id: "123", name: "John"}, {id: "456", name: "Alice"}]
  t.deepEqual(result1, expected1, "Return correct list of entities without those not found")

  const result2 = getEntities("???", "666", getState())
  const expected2 = []
  t.deepEqual(result2, expected2, "Returns empty array when collection not found")

  const result3 = getEntities("users", "???", getState())
  const expected3 = []
  t.deepEqual(result3, expected3, "Returns empty array when owner not found")

})
