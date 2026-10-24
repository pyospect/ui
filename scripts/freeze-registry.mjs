// Run after the release candidate is committed and reviewed, before publication.
import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync } from "node:fs"
import { execFileSync } from "node:child_process"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import { VERSION, REGISTRY_BASE } from "../packages/pyospectui/theme/version.mjs"
import { artifactHashes, assertSnapshotMatch } from "./registry-snapshots.mjs"
import "./version-check.mjs"

const root = fileURLToPath(new URL("../", import.meta.url))
const source = join(root, "public/r", `v${VERSION}`)
const target = join(root, "registry-releases", `v${VERSION}`)
const assertClean = () => {
  const dirty = execFileSync("git", ["status", "--porcelain"], { cwd: root, encoding: "utf8" }).trim()
  if (dirty) throw new Error("commit and review the release candidate before freezing its registry")
}
assertClean()
// Never freeze ignored artifacts left over from a different source revision.
execFileSync(process.execPath, [join(root, "scripts/build-registry.mjs")], { cwd: root, stdio: "inherit" })
assertClean()
if (!existsSync(join(source, "registry.json"))) throw new Error("run npm run registry:build before freezing")
if (existsSync(target)) {
  assertSnapshotMatch(source, target)
  console.log(`registry v${VERSION} is already frozen and unchanged`)
} else {
  const sourceCommit = execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim()
  const files = artifactHashes(source)
  const registry = JSON.parse(readFileSync(join(source, "registry.json"), "utf8"))
  if (!registry.items?.length) throw new Error("the current registry is empty")
  mkdirSync(target, { recursive: true })
  for (const name of Object.keys(files)) copyFileSync(join(source, name), join(target, name))
  writeFileSync(join(target, "provenance.json"), JSON.stringify({
    packageVersion: VERSION, registryBase: REGISTRY_BASE, sourceCommit,
    frozenAt: new Date().toISOString(), files,
  }, null, 2) + "\n")
  console.log(`froze ${Object.keys(files).length} artifacts for v${VERSION}; commit registry-releases/v${VERSION}`)
}
