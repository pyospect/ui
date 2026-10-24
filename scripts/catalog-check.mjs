// Keep lightweight homepage links in sync without importing every demo and raw source.
import { readFileSync } from "node:fs"
const root = new URL("../", import.meta.url)
const source = readFileSync(new URL("src/docs/demos.tsx", root), "utf8")
const expected = [...source.matchAll(/slug:\s*"([\w-]+)",\s*title:\s*"([^"]+)",\s*group:\s*"([^"]+)"/g)].map((m) => ({ slug: m[1], title: m[2], group: m[3] }))
const actual = JSON.parse(readFileSync(new URL("src/docs/catalog.json", root), "utf8"))
if (!expected.length || JSON.stringify(actual) !== JSON.stringify(expected)) {
  console.error("catalog-check: navigation metadata differs from demos.tsx; update src/docs/catalog.json")
  process.exit(1)
}
console.log(`catalog-check: ${actual.length} documentation links match`)
