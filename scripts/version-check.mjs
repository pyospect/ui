import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { join } from "node:path"
import { VERSION, REGISTRY_BASE } from "../packages/pyospectui/theme/version.mjs"

const root = fileURLToPath(new URL("../", import.meta.url))
for (const path of ["package.json", "package-lock.json", "packages/pyospectui/package.json"]) {
  const manifest = JSON.parse(readFileSync(join(root, path), "utf8"))
  if (manifest.version !== VERSION) throw new Error(`${path} version ${manifest.version} must equal release ${VERSION}`)
  if (path === "package-lock.json" && manifest.packages?.[""]?.version !== VERSION) {
    throw new Error(`package-lock.json root package must equal release ${VERSION}`)
  }
}
console.log(`version: ${VERSION}; registry: ${REGISTRY_BASE}`)
