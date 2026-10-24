import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import test from "node:test"
import { checkMeasurements, effectiveRadius } from "./geometry-check.mjs"

const pair = (patch = {}) => ({ kind: "concentric", id: "card-media-light-320",
  outer: { radius: 24, width: 280, height: 400 },
  inner: { radius: 20, width: 272, height: 153 }, inset: { x: 4, y: 4 }, ...patch })

test("card, canvas and zero-radius insets retain their measured centers", () => {
  const results = checkMeasurements([pair(), pair({ id: "wash", inner: { radius: 12, width: 256, height: 300 }, inset: { x: 12, y: 12 } }),
    pair({ id: "screen", inner: { radius: 0, width: 224, height: 300 }, inset: { x: 28, y: 28 } })])
  assert.ok(results.every((result) => result.pass))
  assert.deepEqual(results.map(({ expected }) => expected), [20, 12, 0])
  assert.equal(checkMeasurements([pair({ inner: { radius: 24, width: 272, height: 153 } })])[0].pass, false)
})

test("CSS height limits apply to both sides before comparing a small nested field", () => {
  const result = checkMeasurements([pair({ outer: { radius: 24, width: 100, height: 40 },
    inner: { radius: 19, width: 90, height: 30 }, inset: { x: 5, y: 5 } })])[0]
  assert.equal(result.outerRadius, 20)
  assert.equal(result.actual, 15)
  assert.equal(result.expected, 15)
  assert.equal(result.pass, true)
  assert.equal(effectiveRadius({ radius: 9999, width: 32, height: 32 }), 16)
})

test("pill controls follow their shorter dimension without making large boxes round", () => {
  const results = checkMeasurements([32, 40, 48].map((height) => ({ kind: "pill", id: `button-${height}`, outer: { radius: 9999, width: 120, height } })))
  assert.ok(results.every((result) => result.pass))
  assert.deepEqual(results.map(({ actual }) => actual), [16, 20, 24])
  assert.equal(checkMeasurements([{ kind: "pill", id: "too-square", outer: { radius: 12, width: 100, height: 40 } }])[0].pass, false)
})

test("malformed, hidden and ambiguous measurements fail instead of disappearing", () => {
  for (const invalid of [null, {}, [], "[]"]) assert.throws(() => checkMeasurements(invalid))
  for (const patch of [{ outer: { radius: "24px", width: 280, height: 400 } }, { outer: { radius: NaN, width: 280, height: 400 } },
    { outer: { radius: 24, width: 0, height: 400 } }, { outer: { radius: -1, width: 280, height: 400 } },
    { inset: { x: -1, y: -1 } }, { inset: { x: 4, y: 5 } }, { inset: { x: 999, y: 999 } }, { kind: "box" }, { id: "" },
    { inner: { radius: 20, width: 300, height: 153 } }]) assert.equal(checkMeasurements([pair(patch)])[0].pass, false)
  assert.equal(checkMeasurements([pair(), pair()])[1].pass, false)
  assert.equal(checkMeasurements([pair({ inner: { radius: 20.5, width: 272, height: 153 } })])[0].pass, true)
  assert.equal(checkMeasurements([pair({ inner: { radius: 20.501, width: 272, height: 153 } })])[0].pass, false)
})

test("CLI requires actual input and reports invalid JSON and failed geometry with nonzero status", () => {
  const script = new URL("./geometry-check.mjs", import.meta.url)
  const run = (...args) => spawnSync(process.execPath, [fileURLToPath(script), ...args], { encoding: "utf8" })
  assert.equal(run().status, 2)
  assert.match(run().stderr, /측정/u)
  const dir = mkdtempSync(join(tmpdir(), "pyospect-geometry-test-"))
  try {
    const file = join(dir, "measurements.json")
    writeFileSync(file, "{broken")
    assert.equal(run(file).status, 2)
    writeFileSync(file, JSON.stringify([pair()]).replace('"radius":24', '"radius":1e400'))
    assert.equal(run(file).status, 1)
    writeFileSync(file, JSON.stringify([pair()]))
    assert.equal(run(file).status, 0)
    writeFileSync(file, JSON.stringify([pair({ inner: { radius: 24, width: 272, height: 153 } })]))
    assert.equal(run(file).status, 1)
  } finally { rmSync(dir, { recursive: true, force: true }) }
})
