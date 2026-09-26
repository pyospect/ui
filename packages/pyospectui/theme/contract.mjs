// The naming contract, checked on resolved CSS variables. Pairs come from token NAMES
// (X-text on X and X-hover, *-foreground on *), so a new token is checked without editing this file.
// Includes a small resolver for var() and color-mix(in srgb) that tracks 8-bit and unrounded values;
// every ratio reported is the worse of the two. Browser-safe: no node imports.
import { contrast, apca, deltaEOK, hexToOklch, oklchToRgb, rgbToHex, clamp01, hueDist } from "./color.mjs"

// ---- CSS parsing ----
const stripComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "")
function block(css, head) {
  const m = new RegExp(`(?:^|[\\n}])\\s*${head}\\s*\\{`).exec(css)
  if (!m) return ""
  let i = m.index + m[0].length, d = 1
  const start = i
  for (; i < css.length && d; i++) { if (css[i] === "{") d++; else if (css[i] === "}") d-- }
  return css.slice(start, i - 1)
}
const vars = (body) => Object.fromEntries([...body.matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]))

// { theme, light, dark } from the @theme inline, :root and .dark blocks (keys without "--")
export function parseCssVars(css) {
  const src = stripComments(css)
  return { theme: vars(block(src, "@theme\\s+inline")), light: vars(block(src, ":root")), dark: vars(block(src, "\\.dark")) }
}
// flat environments: .dark sits on the same element as :root (documentElement), so dark = light + overrides
export function envFromCss(css) {
  const { light, dark } = parseCssVars(css)
  return { light, dark: { ...light, ...dark } }
}

// ---- value resolution ----
const NAMED = { white: [1, 1, 1], black: [0, 0, 0] }
const q8 = (rgb) => rgb.map((v) => Math.round(clamp01(v) * 255) / 255)
const num = (s, scale = 1) => (s.endsWith("%") ? (parseFloat(s) / 100) * scale : parseFloat(s))

// an opaque color literal -> [r, g, b] in 0..1, else null (transparent and alpha < 1 are not grounds)
export function parseColor(str) {
  const s = str.trim().toLowerCase()
  let m
  if ((m = s.match(/^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/))) {
    let h = m[1]
    if (h.length <= 4) h = [...h].map((c) => c + c).join("")
    if (h.length === 8 && h.slice(6) !== "ff") return null
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
  }
  if (NAMED[s]) return NAMED[s]
  if ((m = s.match(/^rgba?\((.+)\)$/))) {
    const p = m[1].split(/[\s,/]+/).filter(Boolean)
    if (p.length > 3 && num(p[3]) < 1) return null
    return p.slice(0, 3).map((x) => (x.endsWith("%") ? num(x) : parseFloat(x) / 255))
  }
  if ((m = s.match(/^oklch\((.+)\)$/))) {
    const p = m[1].split(/[\s/]+/).filter(Boolean)
    if (p.length > 3 && num(p[3]) < 1) return null
    return oklchToRgb([num(p[0]), num(p[1], 0.4), parseFloat(p[2])]).map(clamp01)
  }
  return null
}

function splitTop(s) {
  const out = []
  let d = 0, cur = ""
  for (const ch of s) {
    if (ch === "(") d++
    else if (ch === ")") d--
    if (ch === "," && d === 0) { out.push(cur); cur = "" } else cur += ch
  }
  out.push(cur)
  return out.map((x) => x.trim())
}
const mixPart = (s) => {
  let m
  if ((m = s.match(/^(.*\S)\s+(\d*\.?\d+)%$/s))) return { c: m[1], p: +m[2] }
  if ((m = s.match(/^(\d*\.?\d+)%\s+(.*)$/s))) return { c: m[2], p: +m[1] }
  return { c: s, p: undefined }
}

// resolver(env)(name) -> { hex, rgb } | null. hex is the 8-bit chain (each mix rounded), rgb the unrounded one
export function resolver(env) {
  const memo = new Map()
  const get = (name, stack) => {
    if (memo.has(name)) return memo.get(name)
    if (stack.includes(name) || env[name] == null) return null
    const r = evalExpr(String(env[name]), [...stack, name])
    memo.set(name, r)
    return r
  }
  const evalExpr = (e, stack) => {
    e = e.trim()
    let m
    if ((m = e.match(/^var\(\s*--([\w-]+)\s*(?:,(.*))?\)$/s))) return get(m[1], stack) ?? (m[2] != null ? evalExpr(m[2], stack) : null)
    if ((m = e.match(/^color-mix\(\s*in\s+srgb\s*,(.*)\)$/is))) {
      const parts = splitTop(m[1])
      if (parts.length !== 2) return null
      const [a, b] = parts.map(mixPart)
      let pa = a.p, pb = b.p
      if (pa == null && pb == null) pa = pb = 50
      else if (pa == null) pa = 100 - pb
      else if (pb == null) pb = 100 - pa
      if (pa + pb < 100 - 1e-9) return null // the result would be translucent
      const x = evalExpr(a.c, stack), y = evalExpr(b.c, stack)
      if (!x || !y) return null
      const t = pa / (pa + pb)
      const mix = (u, v) => u.map((c, i) => c * t + v[i] * (1 - t))
      const r8 = q8(mix(x.r8, y.r8))
      return { hex: rgbToHex(r8), rgb: mix(x.rgb, y.rgb), r8 }
    }
    const c = parseColor(e)
    return c ? { hex: rgbToHex(c), rgb: c, r8: q8(c) } : null
  }
  const fn = (name) => get(name, [])
  fn.expr = (e) => evalExpr(e, [])
  return fn
}

// ---- the contract ----
const LEVELS = ["bg", "surface", "surface-2"]
const NEUTRALS = ["bg", "surface", "surface-2", "surface-3", "text", "text-2", "text-3", "line"]
const STATUSES = ["ok", "warn", "danger"]
// statusText: light status text on bg, surface-2 and its own tint (R9: 4.6, measured on the 8-bit and the unrounded mix)
export const LIMITS = { text: 4.5, statusText: 4.6, graphic: 3, apcaInk: 60, tintDE: 0.0184, ladderDE: 0.01, neutralC: 0.008, statusGap: 30 }

function pairsFor(names, mode) {
  const has = (k) => names.has(k)
  const P = [] // [fg, bg, min, why, apcaMin]
  for (const k of names) {
    const m = k.match(/^(.+)-(text|foreground)$/)
    if (!m || !has(m[1])) continue
    P.push([k, m[1], LIMITS.text, "on-color"])
    if (has(`${m[1]}-hover`)) P.push([k, `${m[1]}-hover`, LIMITS.text, "on-color hover"])
  }
  P.push(["foreground", "background", LIMITS.text, "on-color"])
  for (const t of ["text", "text-2", "text-3", "brand-ink"]) for (const b of LEVELS) P.push([t, b, LIMITS.text, "text on level", t === "brand-ink" ? LIMITS.apcaInk : 0])
  // text-3 is never placed on a brand tint (selected rows switch to brand-ink)
  for (const t of ["text", "text-2", "brand-ink"]) P.push([t, "brand-tint", LIMITS.text, "text on brand-tint", t === "brand-ink" ? LIMITS.apcaInk : 0])
  for (const s of STATUSES) for (const b of [...LEVELS, `${s}-tint`]) P.push([s, b, mode === "light" ? LIMITS.statusText : LIMITS.text, "status text"])
  for (const b of ["surface", "bg"]) P.push(["brand-graphic", b, LIMITS.graphic, "graphic"])
  for (const b of LEVELS) P.push(["line", b, LIMITS.graphic, "line"])
  for (const b of ["surface", "bg"]) P.push(["ring", b, LIMITS.graphic, "focus ring"])
  for (const k of names) if (/^chart-\d+$/.test(k)) for (const b of ["surface", "bg"]) P.push([k, b, LIMITS.graphic, "chart"])
  return P.filter(([fg, bg]) => has(fg) && has(bg))
}

/**
 * checkContract({ light, dark }, { only }) -> { n, results, fails, warnings, edges }
 * light/dark: flat maps of custom properties (dark already merged over light).
 * only: a Set of token names; when given, only checks touching one of them run.
 */
export function checkContract(env, { only } = {}) {
  const results = []
  const touches = (...ks) => !only || ks.some((k) => only.has(k))
  for (const mode of ["light", "dark"]) {
    const map = env[mode]
    const R = resolver(map)
    const names = new Set(Object.keys(map).filter((k) => R(k)))
    const push = (r) => results.push({ mode, ...r, pass: r.ratio >= r.min - 1e-9 })
    for (const [fg, bg, min, why, apcaMin] of pairsFor(names, mode)) {
      if (!touches(fg, bg)) continue
      const a = R(fg), b = R(bg)
      const ratio = Math.min(...[a.hex, a.rgb].flatMap((x) => [b.hex, b.rgb].map((y) => contrast(x, y))))
      push({ kind: "contrast", severity: "fail", why, pair: `${fg} on ${bg}`, fg, bg, fgHex: a.hex, bgHex: b.hex, ratio, min })
      if (apcaMin) {
        const lc = Math.min(...[a.hex, a.rgb].flatMap((x) => [b.hex, b.rgb].map((y) => Math.abs(apca(x, y)))))
        push({ kind: "apca", severity: "fail", why, pair: `${fg} on ${bg} (APCA)`, fg, bg, fgHex: a.hex, bgHex: b.hex, ratio: lc, min: apcaMin })
      }
    }
    const dist = (a, b, min, why, severity = "fail") => {
      if (!names.has(a) || !names.has(b) || !touches(a, b)) return
      const x = R(a), y = R(b)
      const ratio = Math.min(deltaEOK(x.hex, y.hex), deltaEOK(x.rgb, y.rgb))
      push({ kind: "dE", severity, why, pair: `${a} vs ${b} (dE-OK)`, fg: a, bg: b, fgHex: x.hex, bgHex: y.hex, ratio, min })
    }
    dist("brand-tint", "surface-2", LIMITS.tintDE, "tint visible")
    for (const [a, b] of [["bg", "surface"], ["surface", "surface-2"], ["surface-2", "surface-3"]]) dist(a, b, LIMITS.ladderDE, "surface ladder")
    // hue gap brand/status: meaning must not rest on color alone, but a miss is a warning (labels carry it)
    for (const s of STATUSES) {
      const f = `${s}-fill`
      if (!names.has("brand") || !names.has(f) || !touches("brand", f)) continue
      const x = R("brand"), y = R(f)
      const [, cx, hx] = hexToOklch(x.hex), [, cy, hy] = hexToOklch(y.hex)
      const ratio = cx < 0.04 || cy < 0.04 ? 180 : hueDist(hx, hy)
      push({ kind: "deg", severity: "warn", why: "status hue gap", pair: `brand vs ${f} (hue gap)`, fg: "brand", bg: f, fgHex: x.hex, bgHex: y.hex, ratio, min: LIMITS.statusGap - 0.5 })
    }
    for (const k of NEUTRALS) {
      if (!names.has(k) || !touches(k)) continue
      const C = hexToOklch(R(k).hex)[1]
      results.push({ mode, kind: "chroma", severity: "fail", why: "neutral purity", pair: `${k} chroma`, fg: k, fgHex: R(k).hex, ratio: C, min: LIMITS.neutralC, pass: C <= LIMITS.neutralC })
    }
  }
  const failed = (r) => !r.pass
  return {
    n: results.length,
    results,
    fails: results.filter((r) => failed(r) && r.severity === "fail"),
    warnings: results.filter((r) => failed(r) && r.severity === "warn"),
    edges: results.filter((r) => r.pass && r.kind === "contrast" && r.ratio < r.min + 0.05),
  }
}

export const formatResult = (r) =>
  `${r.mode} ${r.pair}: ${r.fgHex}${r.bgHex ? ` / ${r.bgHex}` : ""} = ${r.ratio.toFixed(r.kind === "dE" || r.kind === "chroma" ? 4 : 2)} (min ${r.min})`
