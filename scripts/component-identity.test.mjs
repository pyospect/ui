import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { isPyospect } from "../packages/pyospectui/theme/component-identity.mjs"

test("installed Select remains identifiable after shadcn removes its header", () => {
  const source = readFileSync(new URL("../registry/ui/select.tsx", import.meta.url), "utf8")
  assert.equal(isPyospect(source.replace(/^\/\*\*[\s\S]*?\*\//, "")), true)
})

test("legacy tokens identify owned components without accepting generic shadcn roles", () => {
  assert.equal(isPyospect('className="bg-surface text-text-2"'), true)
  assert.equal(isPyospect('className="bg-popover text-popover-foreground hover:bg-accent"'), false)
  assert.equal(isPyospect('className="bg-primary text-muted-foreground"'), false)
})
