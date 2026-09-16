// Builds the "theme" registry item from src/index.css so tokens have one source of truth.
// cssVars.theme  -> @theme inline block   (Tailwind utilities)
// cssVars.light  -> :root block
// cssVars.dark   -> .dark block
// css            -> base layer + utilities
import { readFileSync, writeFileSync, mkdirSync } from "node:fs"

const css = readFileSync("src/index.css", "utf8")
const block = (open) => {
  const start = css.indexOf("\n" + open + " {")
  if (start < 0) throw new Error("missing " + open)
  let depth = 0, i = css.indexOf("{", start)
  const bodyStart = i + 1
  for (; i < css.length; i++) { if (css[i] === "{") depth++; else if (css[i] === "}" && --depth === 0) break }
  return css.slice(bodyStart, i)
}
const vars = (body) => {
  const out = {}
  // shadcn cssVars keys carry no "--" prefix ("background", "color-surface-2"); the CLI adds it back
  for (const m of body.matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) out[m[1]] = m[2].trim()
  return out
}
const theme = vars(block("@theme inline"))
const light = vars(block(":root"))
const dark = vars(block(".dark"))
if (dark["bg"] === light["bg"]) throw new Error("dark block parsed as light")

const registry = JSON.parse(readFileSync("registry.json", "utf8"))
const item = registry.items.find((i) => i.name === "theme")
item.type = "registry:theme"
delete item.files
item.cssVars = { theme, light, dark }
item.css = {
  "@layer base": {
    "*": { "min-width": "0", "border-color": "var(--border)" },
    "body": { "font-family": "var(--font-sans)", "font-weight": "400", "word-break": "keep-all", "overflow-wrap": "break-word", "-webkit-font-smoothing": "antialiased" },
    ":focus-visible": { "outline": "2px solid var(--ring)", "outline-offset": "2px" }
  },
  "@utility one-line": { "white-space": "nowrap", "overflow": "hidden", "text-overflow": "ellipsis", "min-width": "0" },
  "@utility glow": { "box-shadow": "0 0 0 1px var(--glow)" },
  "@utility tabular": { "font-variant-numeric": "tabular-nums" }
}
writeFileSync("registry.json", JSON.stringify(registry, null, 2) + "\n")
// shadcn build skips items without files, so the theme item is written to the output directly
mkdirSync("public/r", { recursive: true })
writeFileSync("public/r/theme.json", JSON.stringify({ $schema: "https://ui.shadcn.com/schema/registry-item.json", ...item }, null, 2) + "\n")
// the "pyospect" bundle has no files either; it pulls everything through registryDependencies
const bundle = registry.items.find((i) => i.name === "pyospect")
writeFileSync("public/r/pyospect.json", JSON.stringify({ $schema: "https://ui.shadcn.com/schema/registry-item.json", ...bundle }, null, 2) + "\n")
console.log(`theme item: ${Object.keys(theme).length} theme vars, ${Object.keys(light).length} light, ${Object.keys(dark).length} dark`)
