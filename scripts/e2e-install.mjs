// helpers for scripts/e2e-install.sh
//   serve <dir> <port>               static server for the locally built registry
//   expect <app> <assertion>...      light.brand=#118846, dark.brand-text=#111111, light.radius-md=12px, light.brand-graphic!=light.brand
//   hash <app>                       one hash over src/components and src/lib
// values resolve through var() and color-mix in the app's Tailwind CSS (components.json tailwind.css)
import { createServer } from "node:http"
import { createHash } from "node:crypto"
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs"
import { join, resolve, extname, relative } from "node:path"
import { parseCssVars, resolver } from "../packages/pyospectui/theme/contract.mjs"

const [cmd, ...args] = process.argv.slice(2)

if (cmd === "serve") {
  const [dir, port] = args
  const types = { ".json": "application/json", ".md": "text/markdown; charset=utf-8", ".txt": "text/plain; charset=utf-8" }
  createServer((req, res) => {
    const file = join(resolve(dir), decodeURIComponent(new URL(req.url, "http://x").pathname))
    if (!file.startsWith(resolve(dir)) || !existsSync(file) || statSync(file).isDirectory()) { res.writeHead(404).end(); return }
    res.writeHead(200, { "content-type": types[extname(file)] ?? "application/octet-stream" }).end(readFileSync(file))
  }).listen(+port, "127.0.0.1", () => console.log(`serving ${dir} on http://localhost:${port}/`))
} else if (cmd === "expect") {
  const [app, ...checks] = args
  const cssFile = JSON.parse(readFileSync(join(app, "components.json"), "utf8")).tailwind.css
  const { theme, light, dark } = parseCssVars(readFileSync(join(app, cssFile), "utf8"))
  const env = { light: { ...light }, dark: { ...light, ...dark } }
  const R = { light: resolver(env.light), dark: resolver(env.dark) }
  // colors resolve to 8-bit hex; anything else is var()-substituted text (radius-md -> 12px)
  const text = (map, k, seen = []) => map[k] == null || seen.includes(k) ? null
    : map[k].replace(/var\(--([\w-]+)\)/g, (m, n) => text(map, n, [...seen, k]) ?? m)
  const value = (ref) => {
    const [mode, k] = ref.split(/\.(.*)/s)
    return R[mode](k)?.hex ?? text({ ...theme, ...env[mode] }, k) ?? "(missing)"
  }
  let bad = 0
  for (const c of checks) {
    const m = c.match(/^(\w+\.[\w-]+)(!?=)(.+)$/)
    if (!m) { console.error(`bad assertion ${c}`); process.exit(2) }
    const got = value(m[1])
    const want = /^(light|dark)\./.test(m[3]) ? value(m[3]) : m[3]
    const ok = m[2] === "=" ? got.toUpperCase() === want.toUpperCase() : got.toUpperCase() !== want.toUpperCase()
    console.log(`  ${ok ? "ok  " : "FAIL"} ${m[1]} = ${got}${m[2] === "=" ? `, expected ${want}` : `, must differ from ${m[3]} (${want})`}`)
    if (!ok) bad++
  }
  process.exit(bad ? 1 : 0)
} else if (cmd === "hash") {
  const [app] = args
  const h = createHash("sha256")
  const walk = (d) => readdirSync(d).sort().flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]))
  for (const f of ["src/components", "src/lib"].flatMap((d) => (existsSync(join(app, d)) ? walk(join(app, d)) : []))) {
    h.update(relative(app, f)).update(readFileSync(f))
  }
  console.log(h.digest("hex"))
} else {
  console.error("usage: e2e-install.mjs serve <dir> <port> | expect <app> <assertion>... | hash <app>")
  process.exit(2)
}
