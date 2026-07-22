import assert from "node:assert/strict"
import test from "node:test"
import stores, { getAllGenres, getCities } from "../src/data/stores.js"

test("the curated catalog keeps its launch claims honest", () => {
  assert.equal(stores.length, 37)
  assert.equal(getCities().length, 19)
  assert.equal(new Set(stores.map((store) => store.id)).size, stores.length)
  assert.ok(getAllGenres().includes("Techno"))
})

test("the signature Berlin path resolves to a real action", () => {
  const hardWax = stores.find((store) => store.name === "Hard Wax")

  assert.ok(hardWax)
  assert.ok(hardWax.genres.includes("Techno"))
  assert.equal(hardWax.city, "Berlin")
  assert.match(hardWax.website, /^https:\/\//)
})

test("every shop has enough verified editorial data to render", () => {
  for (const store of stores) {
    assert.ok(store.name)
    assert.ok(Number.isFinite(store.lat))
    assert.ok(Number.isFinite(store.lng))
    assert.ok(store.address)
    assert.ok(store.vibe)
    assert.ok(store.genres.length > 0)
  }
})
