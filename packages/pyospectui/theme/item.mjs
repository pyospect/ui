// seed -> registry:theme item, shared by scripts/build-registry.mjs (presets) and cli.mjs (--brand).
// Same base.json and the same generate(), so a preset item and `--brand <its hex>` come out identical.
// Browser-safe: base is passed in, no node imports.
import { generate, toThemeItem } from "./generate.mjs"
import { resolver, checkContract } from "./contract.mjs"
import { SITE } from "./version.mjs"

export { SITE, VERSION, REGISTRY_PATH, REGISTRY_BASE } from "./version.mjs"
export const modeLabel = (mode) => (mode === "white" ? "흰 글자" : "검은 글자")

/**
 * themeItem(seed, base, opts) -> { item, gen }
 * base: packages/pyospectui/theme/base.json ({ cssVars, css, docs }).
 * opts: { name = "theme", label, slug } (slug links the preset's /themes/<slug>.md).
 */
export function themeItem(seed, base, { name = "theme", label, slug } = {}) {
  const gen = generate(seed)
  const who = label ? `${label}(${gen.seed})` : gen.seed
  const lines = [
    `pyospect 테마를 넣었어요. 브랜드 색 ${who}에서 규칙이 나머지 색을 만들었어요(${modeLabel(gen.mode)}, 채움 ${gen.fill}).`,
    ...gen.warnings.map((w) => `- ${w}`),
    base.docs,
    slug ? `이 테마의 값과 대비표: ${SITE}/themes/${slug}.md` : `같은 테마를 다시 만들려면: npx pyospectui theme --brand "${gen.seed}"`,
  ]
  const item = toThemeItem(gen, base, {
    name,
    title: label ? `pyospect theme: ${label}` : `pyospect theme ${gen.seed}`,
    description: `${who} 브랜드 색으로 만든 테마예요. ${modeLabel(gen.mode)}, 채움 ${gen.fill}. shadcn 표준 변수와 pyospect 토큰을 모두 정의해요.`,
    docs: lines.join("\n"),
  })
  return { item, gen }
}

// flat light/dark environments of an item (.dark sits on the same element as :root)
export function itemEnv(item) {
  const { light, dark } = item.cssVars
  return { light: { ...light }, dark: { ...light, ...dark } }
}

export const contractOf = (item) => checkContract(itemEnv(item))

// resolved hex per token, both themes
export function resolveItem(item, keys) {
  const env = itemEnv(item)
  const R = { light: resolver(env.light), dark: resolver(env.dark) }
  return keys.map((k) => ({ token: k, light: R.light(k)?.hex ?? null, dark: R.dark(k)?.hex ?? null }))
}

// the pairs a person asks about first; the full report is in /themes/<slug>.md and `npm run theme:check`
export const SUMMARY_PAIRS = [
  "brand-text on brand", "brand-text on brand-hover", "brand-ink on surface", "brand-ink on brand-tint",
  "brand-tint-2-text on brand-tint-2", "brand-tint-2-text on brand-tint-2-hover", "brand-graphic on surface", "brand-graphic on bg",
  "ok on surface-2", "warn on surface-2", "danger on surface-2", "ok-fill-text on ok-fill", "warn-fill-text on warn-fill", "danger-fill-text on danger-fill",
]

// [{ pair, light, dark, min, pass }] for SUMMARY_PAIRS, contrast rows only
export function summaryRows(report) {
  return SUMMARY_PAIRS.map((pair) => {
    const rows = report.results.filter((r) => r.kind === "contrast" && r.pair === pair)
    const at = (mode) => rows.find((r) => r.mode === mode)
    const l = at("light"), d = at("dark")
    if (!l && !d) return null
    return { pair, light: l?.ratio, dark: d?.ratio, min: (l ?? d).min, pass: rows.every((r) => r.pass) }
  }).filter(Boolean)
}
