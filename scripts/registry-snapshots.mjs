import { createHash } from "node:crypto"
import { copyFileSync, mkdirSync, readFileSync, readdirSync } from "node:fs"
import { join } from "node:path"

export const artifactHashes = (directory) => Object.fromEntries(readdirSync(directory)
  .filter((name) => name.endsWith(".json") && name !== "provenance.json")
  .sort().map((name) => [name, createHash("sha256").update(readFileSync(join(directory, name))).digest("hex")]))

export function readSnapshot(directory) {
  const manifest = JSON.parse(readFileSync(join(directory, "provenance.json"), "utf8"))
  if (!manifest.files || typeof manifest.files !== "object" || !Object.keys(manifest.files).length) {
    throw new Error(`empty registry snapshot: ${directory}`)
  }
  for (const [name, hash] of Object.entries(manifest.files)) {
    if (!/^[a-z0-9][a-z0-9-]*\.json$/i.test(name) || !/^[a-f0-9]{64}$/.test(hash)) {
      throw new Error(`invalid snapshot artifact: ${name}`)
    }
  }
  const actual = artifactHashes(directory)
  if (JSON.stringify(actual) !== JSON.stringify(Object.fromEntries(Object.entries(manifest.files).sort()))) {
    throw new Error(`registry snapshot hashes changed: ${directory}`)
  }
  return manifest
}

export function copySnapshot(directory, destination) {
  const manifest = readSnapshot(directory)
  mkdirSync(destination, { recursive: true })
  for (const name of Object.keys(manifest.files)) copyFileSync(join(directory, name), join(destination, name))
  return manifest
}

export function assertSnapshotMatch(directory, frozen) {
  const manifest = readSnapshot(frozen)
  if (JSON.stringify(artifactHashes(directory)) !== JSON.stringify(Object.fromEntries(Object.entries(manifest.files).sort()))) {
    throw new Error(`release ${manifest.packageVersion} is frozen; bump the version instead of replacing its registry`)
  }
}
