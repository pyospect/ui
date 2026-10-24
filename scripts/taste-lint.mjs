// npm run lint:taste. TASTE rules that can be read off the source, over registry/ and src/ (.tsx).
// errors fail the run. a line carrying `taste-lint-ignore <rule>` in a comment (// or {/* */}) is skipped for that rule.
// usage: node scripts/taste-lint.mjs [dir ...]   (default: registry src)
import { readFileSync, readdirSync, lstatSync } from "node:fs"
import { join, relative } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = fileURLToPath(new URL("../", import.meta.url))
const DIRS = process.argv.slice(2).length ? process.argv.slice(2) : ["registry", "src"]
// lstat: src/components is a symlink to registry, so it is not walked twice
const walk = (d) => readdirSync(d).flatMap((f) => {
  const p = join(d, f), s = lstatSync(p)
  return s.isSymbolicLink() ? [] : s.isDirectory() ? walk(p) : p.endsWith(".tsx") ? [p] : []
})
const files = DIRS.flatMap((d) => walk(join(ROOT, d)))

const PALETTE = "slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|mauve|olive|mist|taupe"
const COLOR_UTIL = "bg|text|border(?:-[xytrblse])?|ring|ring-offset|outline|fill|stroke|decoration|divide|accent|caret|from|via|to|shadow|inset-shadow|placeholder"
const RE = {
  palette: new RegExp(`^(${COLOR_UTIL})-((${PALETTE})-\\d{2,3}|black|white)(/\\d+)?$`),
  half: /^(p[xytrblse]?|m[xytrblse]?|gap(?:-[xy])?|space-[xy]|inset(?:-[xy])?|top|right|bottom|left|start|end|w|h|size|min-[wh]|max-[wh]|translate-[xy]|scroll-[mp][xytrblse]?|indent|basis)-(\d+\.5)$/,
  weight: /^font-(normal|semibold|bold|extrabold|black|thin|extralight|light)$/,
  radius: /^rounded(-[trblse]{1,2})?(-(xs|xl|2xl|3xl|4xl))?$/,
  shadow: /^(shadow|drop-shadow)(-(2xs|xs|sm|md|lg|xl|2xl|overlay|\[.*\]))?$/,
  duration: /^duration-(\[.*\]|\d+)$/,
  stepClass: /(^|-)brand-(50|[1-9]00|950)(\/\d+)?$/,
  arbRadius: /^rounded(-[trblse]{1,2})?-\[(.+)\]$/,
}
// an arbitrary radius resolved in px (all common radius aliases are 24px), or null when it is not plain arithmetic
function radiusPx(expr) {
  const v = expr.replace(/var\(--radius(-(sm|md|lg|xl))?\)/g, (_, _s, t) => String({ sm: 24, md: 24, lg: 24, xl: 24 }[t] ?? 24))
    .replace(/calc\((.*)\)/, "$1").replace(/_/g, " ").replace(/px/g, "")
  return /^[\d.\s+-]+$/.test(v) ? v.match(/[+-]?\s*[\d.]+/g).reduce((a, x) => a + +x.replace(/\s/g, ""), 0) : null
}
// A concentric media or row may use outer radius minus its actual inset. The max
// clamps small custom radii to zero; this does not permit arbitrary literal tiers.
const INSET_RADIUS = /^max\(0px,\s*calc\(var\(--radius(?:-(?:sm|md|lg|xl))?\)\s*-\s*(?:\d+(?:\.\d+)?px|var\(--pyo-card-padding\))\)\)$/
const insetRadius = (expr) => INSET_RADIUS.test(expr.replace(/_/g, " "))
const knownRadiusVar = (expr) => /^var\(--(?:radius(?:-(?:sm|md|lg|xl))?|pyo-bubble-radius)\)$/.test(expr)
const TIERS = new Set([0, 22, 24, 9999])
const HEX = /(?<![\w&/-])#(?:[0-9A-Fa-f]{8}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{3,4})\b/
const RAW_COLOR = /\b(rgba?|hsla?|oklch|oklab|color-mix)\(/
const OVERLAY = /(dialog|popover|sheet|drawer|dropdown|menu|tooltip|toast|command)\.tsx$/
const HANGUL = /[가-힣]/
const DOTS = /[—·ㆍ・]/
const HEADER_KEYS = ["Naming", "Variant", "Token", "Structure", "Usage Rule"]
// single words that are Tailwind utilities, so a class string is told apart from prose
const BARE = new Set(["flex", "grid", "block", "inline", "hidden", "contents", "relative", "absolute", "fixed", "sticky", "static", "truncate", "underline", "italic", "uppercase", "lowercase", "capitalize", "sr-only", "rounded", "shadow", "border", "transition", "grow", "shrink", "isolate", "tabular", "one-line", "glow", "antialiased", "peer", "group", "container"])

const findings = []
const hit = (rule, sev, file, line, tok, why) => findings.push({ rule, sev, file: relative(ROOT, file), line, tok, why })

// last segment after top-level ":" (variants), minus "!" and a leading "-"
function utility(tok) {
  let d = 0, cut = -1
  for (let i = 0; i < tok.length; i++) {
    const c = tok[i]
    if (c === "[" || c === "(") d++
    else if (c === "]" || c === ")") d--
    else if (c === ":" && d === 0) cut = i
  }
  return tok.slice(cut + 1).replace(/^!|!$/g, "").replace(/^-/, "")
}
const looksLikeClasses = (s) => {
  const toks = s.split(/\s+/).filter(Boolean)
  if (!toks.length || HANGUL.test(s)) return false
  const util = toks.filter((t) => /[-:[]/.test(t) || BARE.has(t)).length
  return util / toks.length >= 0.6
}

for (const f of files) {
  const src = readFileSync(f, "utf8")
  const inRegistry = relative(ROOT, f).startsWith("registry")
  const overlay = OVERLAY.test(f)
  const lines = src.split("\n")

  // five-line header on every component
  if (inRegistry) {
    const hdr = src.match(/^\/\*\*([\s\S]*?)\*\//)
    if (!hdr) hit("doc/header", "error", f, 1, "", "no five-line header (Naming, Variant, Token, Structure, Usage Rule)")
    else {
      let last = -1
      for (const k of HEADER_KEYS) {
        const i = hdr[1].search(new RegExp(`\\n \\* ${k} `))
        if (i < 0) hit("doc/header", "error", f, 1, k, "header key missing")
        else if (i < last) hit("doc/header", "error", f, 1, k, "header keys out of order")
        else last = i
      }
      if (HEX.test(hdr[1])) hit("doc/header", "error", f, 1, hdr[1].match(HEX)[0], "hex in the header; name the token")
    }
  }

  let block = false
  lines.forEach((raw, i) => {
    const n = i + 1
    let ln = raw
    // drop comments: block comments (incl. JSX {/* */}) and whole-line // comments
    if (block) { const e = ln.indexOf("*/"); if (e < 0) return; ln = ln.slice(e + 2); block = false }
    ln = ln.replace(/\{?\/\*.*?\*\/\}?/g, "")
    const s = ln.indexOf("/*")
    if (s >= 0) { ln = ln.slice(0, s); block = true }
    if (/^\s*\/\//.test(ln)) return
    const ignored = (raw.match(/taste-lint-ignore\s+([\w/,-]+)/) ?? [])[1]?.split(",") ?? []
    const H = (rule, ...rest) => { if (!ignored.includes(rule)) hit(rule, ...rest) }

    // copy: Korean UI strings (string literals and JSX text)
    const texts = [...ln.matchAll(/"([^"]*)"|'([^']*)'|`([^`]*)`|>([^<>{}]+)</g)].map((m) => m[1] ?? m[2] ?? m[3] ?? m[4])
    for (const t of texts) {
      if (HANGUL.test(t) && DOTS.test(t)) H("copy/punctuation", "error", f, n, t.match(DOTS)[0] + " " + t.trim().slice(0, 40), "no em dash (—) or middle dot (·) in Korean copy")
      if (/^\s*(확인|취소)\s*$/.test(t)) H("copy/ok-cancel", "error", f, n, t.trim(), "button labels are verbs that say what happens, not 확인/취소")
    }

    // raw color values: anywhere in registry (checked after the class strings); in src only in style objects and svg paint
    if (!inRegistry) {
      const style = ln.match(/style=\{\{(.*?)\}\}/)
      if (style && (HEX.test(style[1]) || /\b(rgba?|hsla?)\(/.test(style[1]))) H("token/raw-color", "error", f, n, (style[1].match(HEX) ?? style[1].match(/\b(rgba?|hsla?)\(/))[0], "raw color in a style prop")
      const paint = ln.match(/\b(fill|stroke|stopColor|color)=["'](#[0-9A-Fa-f]{3,8})["']/)
      if (paint) H("token/raw-color", "error", f, n, paint[2], "raw color on an svg/html attribute")
    }
    if (inRegistry && /\bbrand-(50|[1-9]00|950)\b/.test(ln)) H("token/brand-step", "error", f, n, ln.match(/brand-(50|[1-9]00|950)/)[0], "components use roles (brand, brand-ink, brand-tint...), never scale steps")

    // class strings
    for (const m of ln.matchAll(/"([^"]*)"|'([^']*)'|`([^`]*)`/g)) {
      const str = m[1] ?? m[2] ?? m[3]
      if (!looksLikeClasses(str)) continue
      for (const tok of str.split(/\s+/).filter(Boolean)) {
        const u = utility(tok)
        if (/\[(#|rgba?\(|hsla?\(|oklch\(|color-mix\()/.test(u)) { H("token/raw-color", "error", f, n, tok, "raw color math in a class; use a role token"); continue }
        if (RE.palette.test(u)) { H(u.startsWith("text-white") ? "token/text-white" : "token/palette", "error", f, n, tok, u.startsWith("text-white") ? "text-white: use the X-text token of the fill (brand-text, *-fill-text)" : "Tailwind palette color; use a role token"); continue }
        if (RE.stepClass.test(u) && inRegistry) continue // reported above
        const half = u.match(RE.half)
        if (half && !(half[2] === "0.5" && /^(h|w)$/.test(half[1]))) { H("grid/half", "error", f, n, tok, "off the 4px grid (0.5 only as h-0.5 / w-0.5 for 2px lines)"); continue }
        if (RE.weight.test(u)) { H("type/weight", "error", f, n, tok, "weight is 500 (font-medium)"); continue }
        if (RE.radius.test(u)) { H("radius/tier", "error", f, n, tok, "radius tiers are full / lg / md / sm (rounded-xl is a shadcn compat alias only)"); continue }
        const arb = u.match(RE.arbRadius), px = arb && radiusPx(arb[2])
        if (arb && !insetRadius(arb[2]) && (px != null ? !TIERS.has(px) : !knownRadiusVar(arb[2]))) { H("radius/tier", "error", f, n, tok, px != null ? `resolves to ${px}px; use a base tier or max(0px, calc(var(--radius) - inset)) for concentric geometry` : "use a base radius token or max(0px, calc(var(--radius) - inset))"); continue }
        if (RE.shadow.test(u) && !/^shadow-\[inset/.test(u) && !overlay) { H("elevation/shadow", "error", f, n, tok, "shadows only on overlays; lines are inset shadows, depth is surfaces"); continue }
        if (RE.duration.test(u)) { H("motion/duration", "error", f, n, tok, "motion is the default 120ms token; drop the duration class"); continue }
      }
      // tinted grounds carry their own text tokens: only brand-tint-2-text on brand-tint-2, never text-3 on brand-tint
      const us = str.split(/\s+/).filter(Boolean).map((t) => [t, utility(t)])
      const onTint2 = us.some(([t, u]) => u === "bg-brand-tint-2" && !/(^|:)(hover|focus|active|aria-[\w[\]=-]+|data-[\w[\]=-]+):/.test(t))
      const onTint = us.some(([t, u]) => u === "bg-brand-tint" && !/(^|:)(hover|focus|active):/.test(t))
      for (const [t, u] of us) {
        if (onTint2 && /^text-(text|text-2|text-3|brand-ink|brand)$/.test(u)) H("color/on-tint", "error", f, n, t, "on brand-tint-2 the text is brand-tint-2-text (4.5:1 is only guaranteed for that pair)")
        else if (onTint && u === "text-text-3") H("color/on-tint", "error", f, n, t, "text-3 is never placed on a brand tint; use brand-ink")
      }
    }
    const seen = findings.some((x) => x.rule === "token/raw-color" && x.file === relative(ROOT, f) && x.line === n)
    if (inRegistry && !seen && (HEX.test(ln) || RAW_COLOR.test(ln))) H("token/raw-color", "error", f, n, (ln.match(HEX) ?? ln.match(RAW_COLOR))[0], "raw color in a component; use a role token")
  })
}

const sev = { error: 0, warn: 0 }
for (const r of findings) sev[r.sev]++
const by = {}
for (const r of findings) (by[r.rule] ??= []).push(r)
console.log(`taste-lint: ${files.length} files, ${sev.error} error${sev.error === 1 ? "" : "s"}, ${sev.warn} warning${sev.warn === 1 ? "" : "s"}`)
for (const [k, v] of Object.entries(by).sort((a, b) => b[1].length - a[1].length)) {
  console.log(`\n${k} x${v.length} [${v[0].sev}] ${v[0].why}`)
  for (const r of v) console.log(`  ${r.file}:${r.line}  ${r.tok}${r.why !== v[0].why ? `  (${r.why})` : ""}`)
}
process.exitCode = sev.error ? 1 : 0
