// the CLI's own theme code (packages/pyospectui/theme), typed for the site. presets are the files in presets/, no list here
import type { CSSProperties } from "react"
import { generate, toThemeItem, SeedError, type Generated, type ThemeItem, type CssVars } from "../../packages/pyospectui/theme/generate.mjs"
import { itemEnv, contractOf, resolveItem, modeLabel, SITE } from "../../packages/pyospectui/theme/item.mjs"
import baseJson from "../../packages/pyospectui/theme/base.json"

export type Preset = { name: string; label: string; brand: string; order: number }
export type { Generated, CssVars }

const files = import.meta.glob<Preset>("../../packages/pyospectui/presets/*.json", { eager: true, import: "default" })
export const PRESETS = Object.values(files).sort((a, b) => a.order - b.order)
export const DEFAULT_BRAND = "pyospect"
export { modeLabel, SITE }

const base = baseJson as { cssVars: { theme: CssVars; light: CssVars; dark: CssVars }; css: Record<string, unknown> }

export type Theme = {
  seed: string
  preset?: Preset
  gen: Generated
  item: ThemeItem
  /** flat light and dark environments: every variable src/index.css defines, with this brand's values */
  vars: { light: CssVars; dark: CssVars }
  contract: ReturnType<typeof contractOf>
  resolve: (keys: string[]) => ReturnType<typeof resolveItem>
}

// generate() once per seed; the item, environments and contract are built on first use
const cache = new Map<string, Theme>()
function themeFor(seed: string, preset?: Preset): Theme {
  const hit = cache.get(seed)
  if (hit) return hit
  const gen = generate(seed, { report: false })
  let item: ThemeItem | undefined, vars: Theme["vars"] | undefined, contract: Theme["contract"] | undefined
  const t: Theme = {
    seed: gen.seed, preset, gen,
    get item() { return (item ??= toThemeItem(gen, base)) },
    get vars() { return (vars ??= itemEnv(t.item)) },
    get contract() { return (contract ??= contractOf(t.item)) },
    resolve: (keys) => resolveItem(t.item, keys),
  }
  if (cache.size > 48) cache.delete(cache.keys().next().value!)
  cache.set(seed, t)
  return t
}

const HEX = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i
export const toHex = (s: string) => {
  const h = s.trim().replace(/^#/, "").toUpperCase()
  return "#" + (h.length === 3 ? [...h].map((c) => c + c).join("") : h)
}
export const isHex = (s: string) => HEX.test(s.trim())

export type Resolved = { ok: true; key: string; theme: Theme } | { ok: false; message: string }

// "blue" | "#3366FF" | "3366ff" -> a theme. a hex that is a preset's seed becomes that preset
export function resolveBrand(raw: string): Resolved {
  const s = raw.trim()
  const byName = PRESETS.find((p) => p.name === s.toLowerCase())
  if (byName) return { ok: true, key: byName.name, theme: themeFor(toHex(byName.brand), byName) }
  if (!isHex(s)) return { ok: false, message: "#3366FF처럼 # 뒤에 여섯 자리 hex로 적어 주세요." }
  const seed = toHex(s)
  const bySeed = PRESETS.find((p) => toHex(p.brand) === seed)
  if (bySeed) return { ok: true, key: bySeed.name, theme: themeFor(seed, bySeed) }
  try {
    return { ok: true, key: seed, theme: themeFor(seed) }
  } catch (e) {
    return { ok: false, message: e instanceof SeedError ? e.message : "이 색으로는 테마를 만들 수 없어요. 다른 색을 골라 주세요." }
  }
}

// custom properties for a style prop or a <style> block
export const varStyle = (vars: CssVars) => Object.fromEntries(Object.entries(vars).map(([k, v]) => [`--${k}`, v])) as CSSProperties
export const varDecl = (vars: CssVars) => Object.entries(vars).map(([k, v]) => `--${k}: ${v};`).join(" ")
