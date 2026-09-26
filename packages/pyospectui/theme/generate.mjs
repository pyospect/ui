// seed color -> pyospect brand, status and chart tokens (spec rules R1-R10).
// Output maps use shadcn cssVars keys (no "--") and the same expression style as src/index.css,
// so they drop straight into a registry:theme item. Browser-safe: no node imports.
import {
  hexToOklch, oklchToHex, contrast, apca, deltaEOK, mixSrgb, mixRgb, hueDist, hueDelta,
} from "./color.mjs"
import { resolver, checkContract } from "./contract.mjs"

export const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
// green's scale, reverse-engineered: every step is oklch(L[i], C[i], 152) at 8 bits
export const TEMPLATE = {
  L: [0.97, 0.94, 0.89, 0.82, 0.75, 0.67, 0.59, 0.51, 0.43, 0.36, 0.27],
  C: [0.03, 0.06, 0.09, 0.12, 0.145, 0.15, 0.14, 0.12, 0.1, 0.08, 0.06],
}
// FIXED neutrals the rules solve against (src/index.css holds the same values)
export const NEUTRAL = {
  light: { bg: "#FAFAFA", surface: "#FFFFFF", "surface-2": "#F2F2F3", "surface-3": "#E6E6E8", text: "#111111", "text-2": "#5C5C5F", "text-3": "#6D6D71", line: "#767676" },
  dark: { bg: "#0C0C0C", surface: "#161616", "surface-2": "#1F1F1F", "surface-3": "#2A2A2A", text: "#F5F5F5", "text-2": "#A3A3A6", "text-3": "#8E8E92", line: "#7A7A7E" },
}
// status defaults: fill = white-AA boundary at (C, h); dark = dark-theme text; tint = light mix % of the fill
export const STATUS = {
  ok: { label: "ok(성공)", fill: "#1E8843", dark: "#67D283", h: 150, C: 0.14, band: [135, 195], tint: 10 },
  warn: { label: "warn(주의)", fill: "#AC6600", dark: "#F4A437", h: 65, C: 0.13, band: [45, 95], tint: 12 },
  danger: { label: "danger(위험)", fill: "#CE4846", dark: "#FF8079", h: 25, C: 0.17, band: [10, 40], tint: 10 },
}
export const RULES = {
  minC: 0.04, darkTextDL: 0.12, aa: 4.5, statusText: 4.6, apcaInk: 60, graphic: 3,
  tintDE: 0.0184, tintStart: { light: 12, dark: 14 }, tintRaise: 12, gap: 30, chartC: 0.14, chartStep: 72,
}
export const WHITE = "#FFFFFF"
export const DARK_TEXT = "#111111"
const CHART_GROUNDS = ["#FFFFFF", "#161616"]

// worst WCAG ratio over the 8-bit and the unrounded value of each side
const worst = (a, b) => Math.min(...[a.hex ?? a, a.rgb ?? a].flatMap((x) => [b.hex ?? b, b.rgb ?? b].map((y) => contrast(x, y))))
const mixBoth = (c, p, base) => ({ hex: mixSrgb(c, p, base), rgb: mixRgb(c, p, base) })
const pct = (p) => `${+p.toFixed(1)}%`

// lightest L at (C, h) whose 8-bit hex still carries `text` at >= min
export function lightestPassing(C, h, text = WHITE, min = RULES.aa, lo = 0.2, hi = 0.95) {
  if (contrast(oklchToHex(lo, C, h).hex, text) < min) return null
  for (let i = 0; i < 50; i++) {
    const m = (lo + hi) / 2
    if (contrast(oklchToHex(m, C, h).hex, text) >= min) lo = m
    else hi = m
  }
  return { L: lo, ...oklchToHex(lo, C, h) }
}

// R2: template L, chroma k * template C clamped into sRGB at constant L and h
export function scaleFor(h, k = 1) {
  return STEPS.map((step, i) => ({ step, L: TEMPLATE.L[i], ...oklchToHex(TEMPLATE.L[i], k * TEMPLATE.C[i], h) }))
}

const nearestStep = (L, allow = () => true) =>
  TEMPLATE.L.reduce((best, t, i) => (allow(i) && (best < 0 || Math.abs(t - L) < Math.abs(TEMPLATE.L[best] - L)) ? i : best), -1)

// R9: smallest move inside the band that clears the brand by `gap` and keeps `gap` from the other statuses.
// when nothing clears the brand, keep the hue farthest from it and report ok=false
function placeStatus(name, brandH, others) {
  const s = STATUS[name], gap = RULES.gap
  const d0 = hueDist(s.h, brandH)
  if (d0 >= gap + 0.5) return { h: s.h, moved: 0, dist: d0, ok: true }
  const cands = []
  for (let h = s.band[0]; h <= s.band[1]; h++) {
    if (others.some((o) => hueDist(h, o) < gap)) continue
    cands.push({ h, dist: hueDist(h, brandH), move: hueDist(h, s.h) })
  }
  if (!cands.length) return { h: s.h, moved: 0, dist: d0, ok: false }
  const clear = cands.filter((c) => c.dist >= gap + 1).sort((p, q) => p.move - q.move)
  const best = clear[0] ?? cands.sort((p, q) => q.dist - p.dist || p.move - q.move)[0]
  return { h: best.h, moved: hueDelta(s.h, best.h), dist: best.dist, ok: best.dist >= gap }
}

function statusTokens(name, h, moved) {
  const s = STATUS[name], L = NEUTRAL.light, D = NEUTRAL.dark
  let fill = s.fill, dark = s.dark
  if (moved) {
    fill = lightestPassing(s.C, h).hex
    // dark text keeps its L and C at the new hue (clamped into sRGB)
    const [Ld, Cd] = hexToOklch(s.dark)
    let l = Ld
    dark = oklchToHex(l, Cd, h).hex
    while (worst(dark, mixBoth(dark, 14, D.surface)) < RULES.aa && l < 0.95) dark = oklchToHex((l += 0.005), Cd, h).hex
  }
  // light text: lightest L reaching 4.6 on bg, surface-2 and its own tint, the 8-bit and the unrounded mix (browsers do not round color-mix)
  const tint = mixBoth(fill, s.tint, L.surface)
  const passAt = (l) => { const t = oklchToHex(l, s.C, h).hex; return [L.bg, L["surface-2"], tint].every((b) => worst(t, b) >= RULES.statusText) }
  let lo = 0.2, hi = 0.8
  for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (passAt(m)) lo = m; else hi = m }
  return { fill, dark, text: oklchToHex(lo, s.C, h).hex }
}

// R10 helper: move L until a chart color is >= 3:1 on both grounds (the boundary tone normally already is)
function chartColor(h) {
  let { L, hex } = lightestPassing(RULES.chartC, h)
  const ok = (x) => CHART_GROUNDS.every((g) => contrast(x, g) >= RULES.graphic)
  for (let i = 0; !ok(hex) && i < 60; i++) {
    L += contrast(hex, CHART_GROUNDS[0]) < RULES.graphic ? -0.005 : 0.005
    hex = oklchToHex(L, RULES.chartC, h).hex
  }
  if (!ok(hex)) throw new Error(`chart hue ${h.toFixed(0)} cannot reach 3:1 on white and #161616`)
  return hex
}

export class SeedError extends Error {}

/**
 * generate(seed) -> { seed, mode, scale, light, dark, warnings, report, ... }
 * seed: "#RRGGBB". mode: "white" | "dark" (the text on the fill, R3). light/dark: cssVars maps (keys without "--");
 * dark holds what differs by theme, plus the fills and charts a stock shadcn .dark would otherwise keep.
 * warnings: Korean sentences for the CLI and the themes page. report: [{ pair, ratio, min, pass }].
 */
export function generate(seed, opts = {}) {
  const { report: wantReport = true } = opts
  if (typeof seed !== "string" || !/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.test(seed.trim())) throw new SeedError(`브랜드 색은 #RRGGBB 형식으로 적어 주세요. 받은 값: ${seed}`)
  let hex = seed.trim().replace(/^#?/, "#").toUpperCase()
  if (hex.length === 4) hex = "#" + [...hex.slice(1)].map((c) => c + c).join("")
  const [sL, sC, rawH] = hexToOklch(hex)
  // R1
  if (sC < RULES.minC) throw new SeedError(`이 색(${hex})은 채도가 너무 낮아서(OKLCH C ${sC.toFixed(3)}) 브랜드 색으로 쓸 수 없어요. 채도가 ${RULES.minC} 이상인 색을 골라 주세요.`)
  const h = Math.round(rawH * 2) / 2
  const L = NEUTRAL.light, D = NEUTRAL.dark
  const warnings = []

  // R2, R3: k scales the template chroma; L_AA is the white-AA boundary at (k * .14, h)
  const k = Math.min(sC / 0.14, 1.5)
  const i600 = STEPS.indexOf(600)
  const aa = lightestPassing(k * TEMPLATE.C[i600], h)
  const mode = aa && sL - aa.L <= RULES.darkTextDL ? "white" : "dark"
  const scale = scaleFor(h, k)
  let fillIdx, fill, text
  if (mode === "white") {
    fillIdx = i600
    // a seed within dE .005 of the boundary color is kept byte for byte (#118846 stays)
    fill = contrast(hex, WHITE) >= RULES.aa && deltaEOK(hex, aa.hex) <= 0.005 ? hex : aa.hex
    text = WHITE
  } else {
    // dark text: the seed is the fill, raised at its own chroma until #111111 reaches AA
    let l = sL
    fill = hex
    while (contrast(fill, DARK_TEXT) < RULES.aa && l < 0.99) fill = oklchToHex((l += 0.005), sC, h).hex
    fillIdx = nearestStep(hexToOklch(fill)[0])
    text = DARK_TEXT
    warnings.push(`밝은 브랜드 색이라 채움 위 글자를 흰색 대신 검은색(${DARK_TEXT})으로 써요. 대비는 ${contrast(fill, DARK_TEXT).toFixed(2)}:1이에요.`)
    if (fill !== hex) warnings.push(`검은 글자가 4.5:1을 넘도록 채움 색을 조금 밝혔어요(${fill}).`)
  }
  scale[fillIdx] = { ...scale[fillIdx], hex: fill, pinned: "fill" }
  // R4: a seed that is not the fill takes its nearest-L step on its side of the fill, so the scale stays in order
  const fillL = hexToOklch(fill)[0]
  const i = fill === hex ? -1 : nearestStep(sL, (j) => (sL > fillL ? j < fillIdx : j > fillIdx))
  if (i >= 0) {
    scale[i] = { ...scale[i], hex, pinned: "seed" }
    const onWhite = contrast(hex, WHITE)
    if (mode === "white" && onWhite < RULES.aa) warnings.push(`브랜드 색(${hex}) 위의 흰 글자는 ${onWhite.toFixed(2)}:1이라 4.5:1에 못 미쳐요. 규칙대로 채움 색(${fill})을 새로 정했어요. 원래 색은 brand-${STEPS[i]}에 있어요.`)
    else if (mode === "white") warnings.push(`규칙대로 흰 글자가 4.5:1을 넘는 가장 밝은 색(${fill})을 채움 색으로 정했어요. 원래 색(${hex})은 brand-${STEPS[i]}에 있어요.`)
  }
  const at = (step) => scale[STEPS.indexOf(step)].hex
  const byStep = Object.fromEntries(scale.map((s) => [s.step, s.hex]))
  const v = (step) => `var(--brand-${step})`

  // R5 hover
  let hoverL, hoverD
  if (mode === "white") {
    const d = scale.slice(fillIdx + 1).find((s) => contrast(s.hex, text) >= RULES.aa) ?? scale[fillIdx]
    hoverL = hoverD = { expr: v(d.step), hex: d.hex, step: d.step }
  } else {
    const dn = oklchToHex(fillL - 0.04, sC, h).hex, up = oklchToHex(Math.min(0.99, fillL + 0.04), sC, h).hex
    const hx = contrast(dn, text) >= RULES.aa ? dn : contrast(up, text) >= RULES.aa ? up : fill
    hoverL = hoverD = { expr: hx, hex: hx }
  }

  // R7 tints: raise p (0.5 steps, max +12) until dE-OK(tint, surface-2) >= .0184 in 8-bit and unrounded form
  const tintFor = (theme, step) => {
    const N = NEUTRAL[theme], start = RULES.tintStart[theme]
    let p = start
    const far = (q) => { const t = mixBoth(at(step), q, N.surface); return Math.min(deltaEOK(t.hex, N["surface-2"]), deltaEOK(t.rgb, N["surface-2"])) >= RULES.tintDE }
    while (!far(p) && p < start + RULES.tintRaise) p += 0.5
    if (!far(p)) warnings.push(`${theme === "light" ? "밝은" : "어두운"} 테마의 brand-tint가 surface-2와 잘 구분되지 않아요.`)
    return { step, p, tint: mixBoth(at(step), p, N.surface), tint2: mixBoth(at(step), p + 10, N.surface), hover: mixBoth(at(step), p + 20, N.surface) }
  }
  const tL = tintFor("light", 500), tD = tintFor("dark", 400)

  // R6 ink: WCAG 4.5 and APCA 60 on every ground it sits on. light = lightest such step, dark = darkest
  const inkOk = (ink, bg) => worst(ink, bg) >= RULES.aa && Math.abs(apca(ink, bg.hex ?? bg)) >= RULES.apcaInk && Math.abs(apca(ink, bg.rgb ?? bg)) >= RULES.apcaInk
  const groundsL = [L.surface, L.bg, L["surface-2"], tL.tint], groundsD = [D.surface, D.bg, D["surface-2"], tD.tint]
  const inkL = scale.find((s) => groundsL.every((b) => inkOk(s.hex, b)))
  const inkD = [...scale].reverse().find((s) => groundsD.every((b) => inkOk(s.hex, b)))
  if (!inkL || !inkD) throw new Error(`no ink step for ${hex}`)
  // brand-tint-2-text: >= 4.5 on tint-2 and tint-2-hover, starting from the ink step
  const t2L = scale.slice(scale.indexOf(inkL)).find((s) => [tL.tint2, tL.hover].every((b) => worst(s.hex, b) >= RULES.aa))
  const t2D = scale.slice(0, scale.indexOf(inkD) + 1).reverse().find((s) => [tD.tint2, tD.hover].every((b) => worst(s.hex, b) >= RULES.aa))
  if (!t2L || !t2D) throw new Error(`no tint-2 text step for ${hex}`)

  // R8 graphic: the fill when it reaches 3:1 on surface and bg, otherwise ink
  const graphic = (N, ink) => {
    if ([N.surface, N.bg].every((b) => contrast(fill, b) >= RULES.graphic)) return { expr: "var(--brand)", hex: fill, text: "var(--brand-text)" }
    const t = contrast(ink.hex, WHITE) >= contrast(ink.hex, DARK_TEXT) ? WHITE : DARK_TEXT
    return { expr: "var(--brand-ink)", hex: ink.hex, text: t }
  }
  const gL = graphic(L, inkL), gD = graphic(D, inkD)
  if (mode === "dark" && gL.hex !== fill) warnings.push(`채움 색은 흰 바탕에서 ${contrast(fill, WHITE).toFixed(2)}:1이라 스위치와 점 같은 그래픽에는 brand-graphic(${gL.hex})을 써요.`)

  // R9 status, measured against the fill as it renders
  const [, , fh] = hexToOklch(fill)
  const hues = Object.fromEntries(Object.entries(STATUS).map(([n, s]) => [n, s.h]))
  const status = {}
  for (const name of ["danger", "warn", "ok"]) {
    const others = Object.entries(hues).filter(([n]) => n !== name).map(([, x]) => x)
    const pos = placeStatus(name, fh, others)
    hues[name] = pos.h
    status[name] = { ...statusTokens(name, pos.h, pos.moved), h: pos.h, moved: pos.moved, dist: pos.dist, gapOk: pos.ok }
    const lbl = STATUS[name].label
    if (pos.moved) warnings.push(`${lbl} 색이 브랜드와 가까워서 hue ${STATUS[name].h}°에서 ${pos.h}°로 옮겼어요(채움 ${status[name].fill}).`)
    if (!pos.ok) warnings.push(`${lbl} 색이 브랜드와 ${pos.dist.toFixed(0)}°밖에 떨어지지 않아요. 색만으로는 구분되지 않으니 라벨로 구분해 주세요.`)
  }

  // R10 chart
  const charts = [1, 2, 3, 4].map((n) => chartColor((h + RULES.chartStep * n) % 360))

  const light = { "pyo-seed": hex }
  for (const s of scale) light[`brand-${s.step}`] = s.hex
  const brandExpr = v(STEPS[fillIdx])
  const roles = (t, hover, ink, t2, g) => ({
    brand: brandExpr,
    "brand-text": text,
    "brand-hover": hover.expr,
    "brand-ink": v(ink.step),
    "brand-tint": `color-mix(in srgb, ${v(t.step)} ${pct(t.p)}, var(--surface))`,
    "brand-tint-2": `color-mix(in srgb, ${v(t.step)} ${pct(t.p + 10)}, var(--surface))`,
    "brand-tint-2-hover": `color-mix(in srgb, ${v(t.step)} ${pct(t.p + 20)}, var(--surface))`,
    "brand-tint-2-text": v(t2.step),
    "brand-graphic": g.expr,
    "brand-graphic-text": g.text,
  })
  Object.assign(light, roles(tL, hoverL, inkL, t2L, gL))
  const dark = roles(tD, hoverD, inkD, t2D, gD)
  for (const n of ["ok", "warn", "danger"]) { light[n] = status[n].text; dark[n] = status[n].dark }
  for (const n of ["ok", "warn", "danger"]) light[`${n}-fill`] = dark[`${n}-fill`] = status[n].fill
  for (const n of ["ok", "warn", "danger"]) light[`${n}-fill-text`] = dark[`${n}-fill-text`] = WHITE
  for (const n of ["ok", "warn", "danger"]) {
    light[`${n}-tint`] = `color-mix(in srgb, var(--${n}-fill) ${STATUS[n].tint}%, var(--surface))`
    dark[`${n}-tint`] = `color-mix(in srgb, var(--${n}) 14%, var(--surface))`
  }
  // charts repeat in .dark on purpose: a stock shadcn project already has --chart-N there, and a theme only overwrites keys it names
  light["chart-1"] = gL.hex === fill ? "var(--brand)" : "var(--brand-graphic)"
  dark["chart-1"] = gD.hex === fill ? "var(--brand)" : "var(--brand-graphic)"
  charts.forEach((c, i) => { light[`chart-${i + 2}`] = dark[`chart-${i + 2}`] = c })

  const out = {
    seed: hex, mode, scale: byStep, light, dark, warnings, report: [],
    fill, fillStep: STEPS[fillIdx], k, hue: h, tintPct: { light: tL.p, dark: tD.p }, status,
  }
  if (wantReport) out.report = selfReport(out)
  return out
}

// the generator's own pairs, evaluated on the FIXED neutrals by the same contract that checks shipped CSS
export function selfReport(gen) {
  const base = { light: { ...NEUTRAL.light }, dark: { ...NEUTRAL.dark } }
  const r = checkContract(themeEnv(gen, base), { only: new Set([...Object.keys(gen.light), ...Object.keys(gen.dark)]) })
  return r.results.map(({ mode, pair, ratio, min, pass, kind }) => ({ pair: `${mode} ${pair}`, ratio: +ratio.toFixed(kind === "dE" ? 4 : 2), min, pass }))
}

// generated maps over a base { light, dark } -> flat light/dark environments for the resolver.
// generated keys always beat the base, in both themes (the scale and the seed live in light only)
export function themeEnv(gen, base) {
  const light = { ...base.light, ...gen.light }
  return { light, dark: { ...base.light, ...base.dark, ...gen.light, ...gen.dark } }
}

const without = (map, drop) => Object.fromEntries(Object.entries(map).filter(([k]) => !(k in drop)))
// keys of the generated maps that are colors (everything but the seed record)
const colorKeys = (gen) => [...new Set([...Object.keys(gen.light), ...Object.keys(gen.dark)])].filter((k) => k !== "pyo-seed")

/**
 * toThemeItem(gen, base, meta) -> registry:theme item.
 * base: { theme, light, dark } cssVars (or { cssVars, css }) holding everything src/index.css defines;
 * generated brand/status/chart vars replace their base entries, and missing @theme registrations are added.
 * every var()-valued light entry (the shadcn adapters) is repeated in dark: shadcn init writes its own
 * .dark --background, --primary, --chart-N..., and a theme install only overwrites the keys it names.
 */
export function toThemeItem(gen, base, meta = {}) {
  const vars = base.cssVars ?? base
  const theme = { ...(vars.theme ?? {}) }
  for (const k of colorKeys(gen)) if (!(`color-${k}` in theme)) theme[`color-${k}`] = `var(--${k})`
  const light = { ...(vars.light ?? {}), ...gen.light }
  const dark = { ...without(vars.dark ?? {}, gen.light), ...gen.dark }
  for (const [k, v] of Object.entries(light)) if (!(k in dark) && /var\(/.test(v)) dark[k] = v
  const item = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: meta.name ?? "theme",
    type: "registry:theme",
    ...meta,
    cssVars: { theme, light, dark },
  }
  if (base.css && !item.css) item.css = base.css
  return item
}

// resolved hex per token and theme, for tables and the golden test
export function resolveTheme(gen, base = NEUTRAL) {
  const env = themeEnv(gen, base)
  const out = { light: {}, dark: {} }
  for (const theme of ["light", "dark"]) {
    const r = resolver(env[theme])
    for (const k of colorKeys(gen)) out[theme][k] = r(k)?.hex ?? null
  }
  return out
}
