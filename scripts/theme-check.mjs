// npm run theme:check. The color rules as checks, over the shipped CSS and the generator.
// 0 copies: src/index.css holds the FIXED values; generate.mjs NEUTRAL (what the rules solve against) and the shipped
//   packages/pyospectui/theme/base.json (what the CLI builds themes on) must equal it. run registry:build after editing index.css
// 1 golden: generate(pyospect preset) resolves to the same hex as src/index.css for every generated token, both themes
// 2 contract: src/index.css as shipped, and every preset as a registry:theme over the same base
// 3 sweep: 28 hues x {white-mode seed, light seed}, presets, 300 seeded random seeds.
//   any contrast failure fails; hue-gap misses are listed as warnings
// flags: --verbose (full golden table), --only golden|contract|sweep, --css <file> (check another stylesheet)
import { readFileSync, readdirSync } from "node:fs"
import { resolve, relative } from "node:path"
import { fileURLToPath } from "node:url"
import { generate, toThemeItem, themeEnv, lightestPassing, SeedError, RULES, NEUTRAL } from "../packages/pyospectui/theme/generate.mjs"
import { parseCssVars, envFromCss, resolver, checkContract, formatResult } from "../packages/pyospectui/theme/contract.mjs"
import { oklchToHex, hexToOklch, rgbToHex } from "../packages/pyospectui/theme/color.mjs"

const root = new URL("../", import.meta.url)
const args = process.argv.slice(2)
const verbose = args.includes("--verbose")
const only = args.includes("--only") ? args[args.indexOf("--only") + 1] : null
const run = (part) => !only || only === part

const ownCss = !args.includes("--css")
const cssPath = ownCss ? fileURLToPath(new URL("src/index.css", root)) : resolve(args[args.indexOf("--css") + 1])
const css = readFileSync(cssPath, "utf8")
const cssName = relative(fileURLToPath(root), cssPath).startsWith("..") ? cssPath : relative(fileURLToPath(root), cssPath)
const base = parseCssVars(css)
const presetDir = new URL("packages/pyospectui/presets/", root)
const presets = readdirSync(presetDir).filter((f) => f.endsWith(".json")).sort()
  .map((f) => JSON.parse(readFileSync(new URL(f, presetDir), "utf8")))
const pyospect = presets.find((p) => p.name === "pyospect")
let failed = 0

const table = (rows, cols) => {
  const w = cols.map((c, i) => Math.max(c.length, ...rows.map((r) => String(r[i]).length)))
  const line = (r) => "  " + r.map((x, i) => String(x).padEnd(w[i])).join("  ").trimEnd()
  console.log(line(cols))
  rows.forEach((r) => console.log(line(r)))
}
const envOf = (gen) => {
  const item = toThemeItem(gen, base)
  const light = item.cssVars.light
  return { light, dark: { ...light, ...item.cssVars.dark } }
}

// ---- 0 copies ----
if (run("golden") && ownCss) {
  console.log(`0. copies of ${cssName}: generate.mjs NEUTRAL, packages/pyospectui/theme/base.json`)
  const bad = [], env = envFromCss(css)
  for (const mode of ["light", "dark"]) {
    for (const [k, v] of Object.entries(NEUTRAL[mode])) if (env[mode][k]?.toUpperCase() !== v.toUpperCase()) bad.push(`${mode} --${k}: ${cssName} ${env[mode][k] ?? "(missing)"}, generate.mjs NEUTRAL ${v}`)
  }
  const shipped = JSON.parse(readFileSync(new URL("packages/pyospectui/theme/base.json", root), "utf8")).cssVars
  const g = generate(pyospect.brand, { report: false }), generated = new Set([...Object.keys(g.light), ...Object.keys(g.dark)])
  for (const part of ["theme", "light", "dark"]) {
    const want = Object.fromEntries(Object.entries(base[part]).filter(([k]) => part === "theme" || !generated.has(k)))
    for (const k of new Set([...Object.keys(want), ...Object.keys(shipped[part] ?? {})])) {
      if (want[k] !== shipped[part]?.[k]) bad.push(`base.json cssVars.${part} --${k}: ${shipped[part]?.[k] ?? "(missing)"}, ${cssName} ${want[k] ?? "(missing)"}`)
    }
  }
  bad.forEach((b) => console.log("    FAIL " + b))
  console.log(bad.length ? `  ${bad.length} stale ${bad.length === 1 ? "copy" : "copies"} (NEUTRAL: edit generate.mjs; base.json: npm run registry:build)\n` : "  in sync\n")
  failed += bad.length
}

// ---- 1 golden ----
if (run("golden")) {
  console.log(`1. golden: generate(${pyospect.brand}) vs ${cssName}`)
  const gen = generate(pyospect.brand)
  const cssEnv = envFromCss(css), genEnv = themeEnv(gen, base)
  const rows = []
  let bad = 0, same = 0, exprDiff = 0
  for (const mode of ["light", "dark"]) {
    const Rc = resolver(cssEnv[mode]), Rg = resolver(genEnv[mode])
    const keys = mode === "light" ? Object.keys(gen.light) : [...new Set([...Object.keys(gen.light), ...Object.keys(gen.dark)])]
    for (const k of keys) {
      const ce = cssEnv[mode][k], ge = genEnv[mode][k]
      let ch, gh
      if (k === "pyo-seed") { ch = ce?.toUpperCase() ?? "(missing)"; gh = ge }
      else { ch = Rc(k)?.hex ?? "(missing)"; gh = Rg(k)?.hex ?? "(unresolved)" }
      const ok = ch === gh
      if (ok) same++; else bad++
      if (ok && ce !== ge) exprDiff++
      if (!ok || verbose) rows.push([mode, k, ce ?? "(missing)", ch, ge, gh, ok ? (ce === ge ? "ok" : "ok (expr)") : "MISMATCH"])
    }
  }
  if (rows.length) table(rows, ["mode", "token", cssName, "hex", "generated", "hex", ""])
  console.log(`  ${same} match, ${bad} mismatch${exprDiff ? `, ${exprDiff} match by value with a different expression` : ""}`)
  failed += bad
}

// ---- 2 contract ----
const report = (label, r) => {
  console.log(`  ${label}: ${r.n - r.fails.length - r.warnings.length}/${r.n} pass, ${r.fails.length} fail, ${r.warnings.length} warn, ${r.edges.length} within 0.05 of the minimum`)
  r.fails.forEach((x) => console.log("    FAIL " + formatResult(x)))
  r.warnings.forEach((x) => console.log("    warn " + formatResult(x)))
  if (verbose) r.edges.forEach((x) => console.log("    edge " + formatResult(x)))
  return r.fails.length
}
if (run("contract")) {
  console.log("\n2. contract")
  failed += report(cssName, checkContract(envFromCss(css)))
  for (const p of presets) {
    const gen = generate(p.brand)
    failed += report(`preset ${p.name} ${p.brand} (${gen.mode}, fill ${gen.fill})`, checkContract(envOf(gen)))
    gen.warnings.forEach((w) => console.log("    - " + w))
  }
}

// ---- 3 sweep ----
if (run("sweep")) {
  console.log("\n3. sweep")
  const HUES = [...new Set([...Array.from({ length: 24 }, (_, i) => i * 15), 25, 110, 152, 250])].sort((a, b) => a - b)
  // mulberry32: deterministic, so a failure reproduces
  let s = 0x5eed
  const rnd = () => { s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }
  const seeds = [
    ...HUES.map((h) => ({ hex: lightestPassing(0.14, h).hex, set: "white", h, expect: "white" })),
    ...HUES.map((h) => ({ hex: oklchToHex(0.86, 0.15, h).hex, set: "light", h, expect: "dark" })),
    ...presets.map((p) => ({ hex: p.brand, set: "preset" })),
    ...Array.from({ length: 300 }, () => ({ hex: rgbToHex([rnd(), rnd(), rnd()]), set: "random" })),
  ]
  const fails = [], gaps = {}, modes = { white: 0, dark: 0 }, lifted = [], sets = {}
  let refused = 0, checks = 0
  const tight = {}
  for (const seed of seeds) {
    const C = hexToOklch(seed.hex)[1]
    sets[seed.set] = (sets[seed.set] ?? 0) + 1
    let gen
    try { gen = generate(seed.hex, { report: false }) } catch (e) {
      if (e instanceof SeedError && C < RULES.minC) { refused++; continue }
      fails.push(`${seed.hex} (${seed.set}) threw: ${e.message}`); continue
    }
    if (C < RULES.minC && gen.seed !== "#171717") fails.push(`${seed.hex} C ${C.toFixed(3)} should be refused`)
    modes[gen.mode]++
    if (seed.expect && gen.mode !== seed.expect) fails.push(`${seed.hex} (${seed.set} h${seed.h}) mode ${gen.mode}, expected ${seed.expect}`)
    if (gen.fill !== gen.seed) lifted.push(seed.hex)
    const Ls = Object.values(gen.scale).map((x) => hexToOklch(x)[0])
    if (Ls.some((l, i) => i && l >= Ls[i - 1])) fails.push(`${seed.hex} (${seed.set}) scale out of order: ${Object.values(gen.scale).join(" ")}`)
    const keys = new Set([...Object.keys(gen.light), ...Object.keys(gen.dark)])
    const r = checkContract(envOf(gen), { only: keys })
    checks += r.n
    r.fails.forEach((x) => fails.push(`${seed.hex} (${seed.set}) ${formatResult(x)}`))
    for (const x of r.results) if (x.kind === "contrast" && x.pass) {
      const key = `${x.mode} ${x.pair}`
      if (!tight[key] || x.ratio - x.min < tight[key].ratio - tight[key].min) tight[key] = { ratio: x.ratio, min: x.min, hex: seed.hex }
    }
    for (const [n, st] of Object.entries(gen.status)) if (!st.gapOk) (gaps[n] ??= []).push(`${seed.hex}${seed.h != null ? ` (h${seed.h})` : ""} ${st.dist.toFixed(0)}°`)
  }
  console.log(`  ${seeds.length} seeds (${Object.entries(sets).map(([k, v]) => `${k} ${v}`).join(", ")}): white mode ${modes.white}, dark-text mode ${modes.dark}, refused (C < ${RULES.minC}) ${refused}; fill differs from seed ${lifted.length}`)
  console.log(`  ${checks} contract checks on generated tokens, ${fails.length} fail`)
  fails.slice(0, 40).forEach((f) => console.log("    FAIL " + f))
  if (fails.length > 40) console.log(`    ... +${fails.length - 40}`)
  const closest = Object.entries(tight).sort((a, b) => a[1].ratio - a[1].min - (b[1].ratio - b[1].min)).slice(0, verbose ? 20 : 6)
  console.log("  tightest passing pairs: " + closest.map(([k, v]) => `${k} ${v.ratio.toFixed(3)}/${v.min} (${v.hex})`).join("; "))
  const gapN = Object.values(gaps).reduce((a, g) => a + g.length, 0)
  console.log(`  hue-gap warnings (status cannot clear 30° from the brand inside its band; labels carry the meaning): ${gapN}`)
  for (const [n, list] of Object.entries(gaps)) console.log(`    ${n} x${list.length}: ${list.slice(0, verbose ? list.length : 10).join(", ")}${!verbose && list.length > 10 ? ", ..." : ""}`)
  failed += fails.length
}

console.log(failed ? `\ntheme:check failed (${failed})` : "\ntheme:check passed")
process.exitCode = failed ? 1 : 0
