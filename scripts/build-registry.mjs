// npm run registry:build. src/index.css + packages/pyospectui/presets -> registry.json, public/r, base.json, public/themes.
// base.json   index.css parsed (@theme inline, :root, .dark, @layer base, @utility) minus the generated tokens
// theme*.json generate(seed) over base.json, the same code path as `npx pyospectui --brand`; theme.json = the pyospect preset
// tokens.json pyospect-only names, fixed neutral values and utilities, no brand values (a component install never re-colors)
// REGISTRY_BASE (default /r/v<VERSION>/) sets URLs inside the built items; registry.json keeps the release default.
// REGISTRY_OUT is an isolated output path for the install e2e. With REGISTRY_OUT set
// nothing tracked in the repo is written (registry.json, base.json, public/themes, public/TASTE.md): only the items.
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, readdirSync, rmSync, copyFileSync, existsSync, cpSync } from "node:fs"
import { spawnSync } from "node:child_process"
import { tmpdir } from "node:os"
import { join, resolve as resolvePath } from "node:path"
import { fileURLToPath } from "node:url"
import { parseCssVars, envFromCss, resolver } from "../packages/pyospectui/theme/contract.mjs"
import { generate } from "../packages/pyospectui/theme/generate.mjs"
import { themeItem, itemEnv, contractOf, resolveItem, modeLabel, SITE } from "../packages/pyospectui/theme/item.mjs"
import { VERSION, REGISTRY_BASE, LEGACY_REGISTRY_BASE } from "../packages/pyospectui/theme/version.mjs"
import { copySnapshot, assertSnapshotMatch } from "./registry-snapshots.mjs"
import "./version-check.mjs"

const root = fileURLToPath(new URL("../", import.meta.url))
const at = (p) => join(root, p)
const DEFAULT_BASE = REGISTRY_BASE
const BASE = (process.env.REGISTRY_BASE || DEFAULT_BASE).replace(/\/?$/, "/")
const SCHEMA = "https://ui.shadcn.com/schema/registry-item.json"
const json = (x) => JSON.stringify(x, null, 2) + "\n"
const fail = (msg) => { console.error(`registry:build: ${msg}`); process.exit(1) }
const REPO = !process.env.REGISTRY_OUT
const write = (p, data) => { if (REPO) writeFileSync(at(p), data) }

// ---- parse src/index.css ----
const css = readFileSync(at("src/index.css"), "utf8")
const src = css.replace(/\/\*[\s\S]*?\*\//g, "")
const close = (s, open) => { let d = 1, i = open + 1; for (; i < s.length && d; i++) d += s[i] === "{" ? 1 : s[i] === "}" ? -1 : 0; return i }
// a rule body -> shadcn's css object: declarations as strings, nested rules as objects, "@apply x" as a key with {}
function rules(body) {
  const out = {}
  const decl = (s) => {
    s = s.trim().replace(/\s+/g, " ")
    if (!s) return
    if (s.startsWith("@apply ")) out[s] = {}
    else { const c = s.indexOf(":"); out[s.slice(0, c).trim()] = s.slice(c + 1).trim() }
  }
  let i = 0
  while (i < body.length) {
    let j = i
    while (j < body.length && body[j] !== ";" && body[j] !== "{") j++
    if (body[j] !== "{") { decl(body.slice(i, j)); i = j + 1; continue }
    const end = close(body, j)
    out[body.slice(i, j).trim().replace(/\s+/g, " ")] = rules(body.slice(j + 1, end - 1))
    i = end
  }
  return out
}
// top-level blocks; statements such as @import and @custom-variant are skipped
const top = []
for (let i = 0; i < src.length;) {
  const open = src.indexOf("{", i), semi = src.indexOf(";", i)
  if (open < 0) break
  if (semi >= 0 && semi < open) { i = semi + 1; continue }
  const end = close(src, open)
  top.push({ head: src.slice(i, open).trim().replace(/\s+/g, " "), body: src.slice(open + 1, end - 1) })
  i = end
}
const cssRules = {}
for (const b of top) if (b.head === "@layer base" || b.head.startsWith("@utility ")) cssRules[b.head] = rules(b.body)
if (!cssRules["@layer base"]?.body) fail("no body rule in @layer base")
const vars = parseCssVars(css)
if (vars.dark.bg === vars.light.bg) fail(".dark parsed as :root")

// ---- presets ----
const presetDir = at("packages/pyospectui/presets")
const presets = readdirSync(presetDir).filter((f) => f.endsWith(".json"))
  .map((f) => ({ file: f, ...JSON.parse(readFileSync(join(presetDir, f), "utf8")) }))
  .sort((a, b) => (a.order ?? 99) - (b.order ?? 99) || a.name.localeCompare(b.name))
for (const p of presets) {
  if (`${p.name}.json` !== p.file || !/^[a-z][a-z0-9-]*$/.test(p.name)) fail(`preset ${p.file}: name must match the file name`)
  if (!p.label || !/^#[0-9A-F]{6}$/.test(p.brand)) fail(`preset ${p.file}: needs "label" and an uppercase "#RRGGBB" brand`)
}
const pyospect = presets.find((p) => p.name === "pyospect") ?? fail("missing presets/pyospect.json")
if (vars.light["pyo-seed"]?.toUpperCase() !== pyospect.brand) fail(`src/index.css --pyo-seed ${vars.light["pyo-seed"]} is not the pyospect preset ${pyospect.brand}`)

// ---- base.json: everything index.css defines except what generate() writes ----
const g0 = generate(pyospect.brand, { report: false })
const generated = new Set([...Object.keys(g0.light), ...Object.keys(g0.dark)])
const drop = (m) => Object.fromEntries(Object.entries(m).filter(([k]) => !generated.has(k)))
const DOCS = [
  "- 색은 토큰으로만 써요. hex나 bg-green-500 같은 팔레트 색, brand-600 같은 스텝은 컴포넌트에 쓰지 않아요.",
  "- X-text는 X 위에서 4.5:1을 넘어요. 채움 위 글자는 brand-text, 표면 위 브랜드 글자는 brand-ink, 점과 트랙은 brand-graphic이에요.",
  "- 표면은 선 대신 bg, surface, surface-2로 나눠요. 그림자는 Dialog에만 있어요.",
  "- 버튼 라벨은 동사로 끝나요(저장하기). 문장은 해요체예요.",
  "- 서체는 Pretendard예요. index.html의 <head>에 넣어 주세요: <link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css\" />",
  "- 브랜드 색을 바꾸려면 npx pyospectui --brand \"#RRGGBB\", 프리셋 목록은 npx pyospectui presets 예요.",
  `디자인 기준은 ${SITE}/DESIGN.md, 사용 규칙은 ${SITE}/TASTE.md, AI용 요약은 ${SITE}/llms.txt 에 있어요.`,
].join("\n")
const base = {
  $comment: "generated by scripts/build-registry.mjs from src/index.css: the fixed part of every pyospect theme. generate.mjs fills in the brand, status and chart tokens.",
  cssVars: { theme: vars.theme, light: drop(vars.light), dark: drop(vars.dark) },
  css: cssRules,
  docs: DOCS,
}
write("packages/pyospectui/theme/base.json", json(base))

// ---- theme items ----
const cssEnv = envFromCss(css)
const themes = presets.map((p) => ({ preset: p, ...themeItem(p.brand, base, { name: `theme-${p.name}`, label: p.label, slug: p.name }) }))
const main = themeItem(pyospect.brand, base, { name: "theme", label: pyospect.label, slug: "pyospect" }).item
main.title = "pyospect theme"
// theme.json must reproduce index.css exactly (resolved, every variable, both themes)
{
  const env = itemEnv(main), diffs = []
  for (const mode of ["light", "dark"]) {
    const a = resolver(cssEnv[mode]), b = resolver(env[mode])
    for (const k of new Set([...Object.keys(cssEnv[mode]), ...Object.keys(env[mode])])) {
      const x = a(k)?.hex ?? cssEnv[mode][k], y = b(k)?.hex ?? env[mode][k]
      if (x !== y) diffs.push(`${mode} --${k}: index.css ${x}, theme.json ${y}`)
    }
  }
  if (diffs.length) fail(`theme.json differs from src/index.css:\n  ${diffs.join("\n  ")}\n(run npm run theme:check)`)
}
for (const t of themes) {
  const r = contractOf(t.item)
  if (r.fails.length) fail(`theme-${t.preset.name}: ${r.fails.length} contract failures (run npm run theme:check)`)
  t.report = r
}

// ---- tokens.json: names and fixed values only. registry:theme items sort first and later items win the cssVars merge,
// so any brand value here would undo a generated theme installed together with components ----
const SHADCN = /^(background|foreground|card|popover|primary|secondary|muted|accent|destructive|border|input|ring|chart-\d|sidebar|radius)(-|$)/
const pyoOnly = (k) => !SHADCN.test(k) && !generated.has(k) && !k.startsWith("pyo-font")
const ownTheme = Object.fromEntries(Object.entries(vars.theme).filter(([k]) =>
  /^color-/.test(k) ? !SHADCN.test(k.slice(6)) : /^(shadow-overlay|default-transition)/.test(k)))
const tokens = {
  name: "tokens",
  type: "registry:item",
  title: "pyospect tokens",
  description: "pyospect 토큰 이름(bg-surface-2, text-brand-ink...)과 고정 뉴트럴 값, one-line, glow, tabular 유틸리티예요. 브랜드와 상태색 값은 없어서, 테마를 넣기 전에는 brand, ok-fill 같은 색이 비어 있어요. 테마는 npx pyospectui나 @pyospect/theme으로 넣어요.",
  cssVars: {
    theme: ownTheme,
    light: Object.fromEntries(Object.entries(base.cssVars.light).filter(([k]) => pyoOnly(k))),
    dark: Object.fromEntries(Object.entries(base.cssVars.dark).filter(([k]) => pyoOnly(k))),
  },
  css: Object.fromEntries(Object.entries(cssRules).filter(([k]) => k.startsWith("@utility "))),
}

// ---- registry.json ----
const registry = JSON.parse(readFileSync(at("registry.json"), "utf8"))
const isGenerated = (n) => n === "theme" || n.startsWith("theme-") || n === "tokens" || n === "pyospect" || n === "pyospect-components"
const hand = registry.items.filter((i) => !isGenerated(i.name))
// Own dependencies follow this release; external registries and shadcn's "utils" stay intact.
for (const item of hand) if (item.registryDependencies) {
  item.registryDependencies = item.registryDependencies.map((dependency) =>
    typeof dependency === "string" && dependency.startsWith(LEGACY_REGISTRY_BASE)
      ? DEFAULT_BASE + dependency.slice(LEGACY_REGISTRY_BASE.length).replace(/^v\d+\.\d+\.\d+(?:-[\w.-]+)?\//, "")
      : dependency)
}
const url = (n) => `${DEFAULT_BASE}${n}.json`
const components = hand.filter((i) => i.type === "registry:ui")
// cn comes from shadcn's own "utils" for the project's style: a stock project already has that exact file, so an add
// never stops at an overwrite prompt. utils.json stays published for older installs
for (const c of components) {
  const rest = (c.registryDependencies ?? []).filter((d) => ![url("tokens"), url("utils"), "utils"].includes(d))
  c.registryDependencies = ["utils", url("tokens"), ...rest]
}
// bundles stay registry:ui: a file-less registry:item counts as "universal" in shadcn 4.x and skips the project checks
const bundle = (name, title, description, deps) => ({ name, type: "registry:ui", title, description, registryDependencies: deps })
const strip = ({ $schema, ...rest }) => rest
registry.items = [
  strip(main),
  ...themes.map((t) => strip(t.item)),
  tokens,
  ...hand,
  bundle("pyospect-components", "pyospectui 컴포넌트", `테마 없이 ${components.length}개 컴포넌트만 받아요. 브랜드 색을 따로 정한 프로젝트에 써요.`, components.map((c) => url(c.name))),
  // shadcn 4.21 overwrites existing CSS variables only when a REQUESTED item is a theme (not one found in the tree),
  // so the everything-bundle is the theme itself plus every component
  { ...strip(main), name: "pyospect", title: "pyospectui (전체)", description: `테마와 ${components.length}개 컴포넌트를 한 번에 받아요. npx shadcn add ${url("pyospect")}`, registryDependencies: components.map((c) => url(c.name)) },
]
write("registry.json", json(registry))

// ---- shadcn build (4.x writes every item, with or without files, and registry.json) ----
// Validate in a temporary directory before replacing the published tree.
const buildScratch = REPO ? mkdtempSync(join(tmpdir(), "pyospect-registry-build-")) : null
const out = REPO ? join(buildScratch, "items") : resolvePath(process.env.REGISTRY_OUT)
rmSync(out, { recursive: true, force: true })
let input = at("registry.json"), scratch = null
if (BASE !== DEFAULT_BASE || !REPO) {
  scratch = mkdtempSync(join(tmpdir(), "pyospect-registry-"))
  input = join(scratch, "registry.json")
  writeFileSync(input, JSON.stringify(registry).replaceAll(DEFAULT_BASE, BASE))
}
const bin = at(`node_modules/.bin/shadcn${process.platform === "win32" ? ".cmd" : ""}`)
const res = spawnSync(bin, ["build", input, "--output", out, "--cwd", root], { stdio: ["ignore", "ignore", "inherit"] })
if (scratch) rmSync(scratch, { recursive: true, force: true })
if (res.status !== 0) fail(`shadcn build exited ${res.status}`)

// every item must be emitted and must survive the CLI's own schema
const { registryItemSchema, registrySchema } = await import("shadcn/schema")
const built = JSON.parse(readFileSync(join(out, "registry.json"), "utf8"))
if (!registrySchema.safeParse(built).success) fail("public/r/registry.json does not match the shadcn registry schema")
for (const it of registry.items) {
  const file = join(out, `${it.name}.json`)
  let item
  try { item = JSON.parse(readFileSync(file, "utf8")) } catch { fail(`shadcn build did not write ${it.name}.json`) }
  const r = registryItemSchema.safeParse(item)
  if (!r.success) fail(`${it.name}.json: ${r.error.issues.map((x) => `${x.path.join(".")} ${x.message}`).join("; ")}`)
  const lost = Object.keys(item).filter((k) => !(k in r.data))
  if (lost.length) fail(`${it.name}.json: the shadcn schema drops ${lost.join(", ")}`)
  if (BASE !== DEFAULT_BASE && JSON.stringify(item).includes(DEFAULT_BASE)) fail(`${it.name}.json still points at ${DEFAULT_BASE}`)
}
if (REPO) {
  const releases = at("registry-releases")
  const frozen = join(releases, `v${VERSION}`)
  if (existsSync(frozen)) assertSnapshotMatch(out, frozen)
  // Validate every archived release before touching public/r.
  const archives = existsSync(releases) ? readdirSync(releases).filter((name) => /^v\d+\.\d+\.\d+(?:-[\w.-]+)?$/.test(name)) : []
  const publish = join(buildScratch, "publish")
  copySnapshot(at("legacy-registry/v0.2.0"), publish)
  for (const name of archives) copySnapshot(join(releases, name), join(publish, name))
  cpSync(out, join(publish, `v${VERSION}`), { recursive: true })
  rmSync(at("public/r"), { recursive: true, force: true })
  cpSync(publish, at("public/r"), { recursive: true })
  rmSync(buildScratch, { recursive: true, force: true })
}

// ---- public/themes/<preset>.md ----
const fmt = (x, kind) => (x == null ? "" : kind === "dE" || kind === "chroma" ? x.toFixed(4) : x.toFixed(2))
const KIND = { contrast: "WCAG", apca: "APCA Lc", dE: "ΔE OK", deg: "hue 간격", chroma: "채도" }
function themeDoc({ preset: p, item, gen, report }) {
  const keys = [...new Set([...Object.keys(gen.light), ...Object.keys(gen.dark)])].filter((k) => k !== "pyo-seed" && !/^brand-\d+$/.test(k))
  const rows = resolveItem(item, keys)
  const fails = report.results.filter((r) => !r.pass)
  const status = Object.entries(gen.status).map(([n, s]) => `${n} ${s.h}°${s.moved ? ` (${s.moved > 0 ? "+" : ""}${s.moved}° 옮김)` : ""}`).join(", ")
  return [
    `# ${p.label} 테마 (${p.name})`,
    "",
    `scripts/build-registry.mjs가 만든 파일이에요. 규칙은 ${SITE}/TASTE.md 의 §20에 있고, 여기에는 그 규칙이 이 브랜드 색에서 만든 값과 대비 검사 결과가 있어요.`,
    "",
    `- 시드: \`${gen.seed}\``,
    `- 모드: ${modeLabel(gen.mode)} (채움 위 글자 \`${gen.mode === "white" ? "#FFFFFF" : "#111111"}\`)`,
    `- 채움: \`${gen.fill}\` (brand-${gen.fillStep})${gen.fill === gen.seed ? ", 시드 그대로예요" : ""}`,
    `- 상태색 hue: ${status}`,
    `- 설치: \`npx pyospectui --preset ${p.name}\` 또는 \`npx shadcn add ${DEFAULT_BASE}theme-${p.name}.json\``,
    "",
    "## 알려 드릴 점",
    "",
    ...(gen.warnings.length ? gen.warnings.map((w) => `- ${w}`) : ["- 없어요. 상태색이 브랜드와 30° 넘게 떨어져 있고, 모든 조합이 기준을 넘어요."]),
    "",
    "## 브랜드 스케일",
    "",
    "| step | hex |",
    "|---|---|",
    ...Object.entries(gen.scale).map(([s, h]) => `| brand-${s} | \`${h}\`${h === gen.fill ? " 채움" : h === gen.seed ? " 시드" : ""} |`),
    "",
    "## 토큰",
    "",
    "| 토큰 | 라이트 | 다크 |",
    "|---|---|---|",
    ...rows.map((r) => `| ${r.token} | \`${r.light}\` | \`${r.dark}\` |`),
    "",
    "## 대비 검사",
    "",
    `${report.n}개 조합 중 ${report.n - fails.length}개가 기준을 넘어요.${report.warnings.length ? ` 기준에 못 미친 ${report.warnings.length}개는 경고(hue 간격)예요. 라벨로 구분해 주세요.` : ""} 8비트 값과 반올림 전 값 중 나쁜 쪽으로 쟀어요.`,
    "",
    "| 테마 | 조합 | 종류 | 값 | 기준 | 결과 |",
    "|---|---|---|---|---|---|",
    ...report.results.map((r) => `| ${r.mode === "light" ? "라이트" : "다크"} | ${r.pair} | ${KIND[r.kind]} | ${fmt(r.ratio, r.kind)} | ${r.kind === "chroma" ? `≤ ${r.min}` : r.min} | ${r.pass ? "통과" : r.severity === "warn" ? "경고" : "미달"} |`),
    "",
  ].join("\n")
}
if (REPO) {
  rmSync(at("public/themes"), { recursive: true, force: true })
  mkdirSync(at("public/themes"), { recursive: true })
}
for (const t of themes) write(`public/themes/${t.preset.name}.md`, themeDoc(t))
// the catalog: docs link here (or to `npx pyospectui presets`) instead of listing presets by hand
write("public/themes/index.md", [
  "# pyospectui 프리셋",
  "",
  `scripts/build-registry.mjs가 packages/pyospectui/presets 폴더에서 만든 목록이에요. 프리셋 ${themes.length}개가 모두 같은 규칙(${SITE}/TASTE.md §20)으로 만들어졌고, 하나가 테마 하나예요. pyospect가 이미 있는 프로젝트에서 프리셋을 바꾸면 CSS 변수만 바뀌고 컴포넌트는 그대로예요.`,
  "",
  "| 프리셋 | 이름 | 브랜드 색 | 채움 | 채움 위 글자 | 알려 드릴 점 | 바꾸는 명령 |",
  "|---|---|---|---|---|---|---|",
  ...themes.map(({ preset: p, gen }) => `| [${p.name}](${SITE}/themes/${p.name}.md) | ${p.label} | \`${p.brand}\` | \`${gen.fill}\` | ${modeLabel(gen.mode)} | ${gen.warnings.length}개 | \`npx pyospectui --preset ${p.name}\` |`),
  "",
  `shadcn 명령으로는 \`npx shadcn add ${DEFAULT_BASE}theme-<프리셋>.json\`이에요. 목록에 없는 색은 \`npx pyospectui --brand "#RRGGBB"\`로 만들어요.`,
  "",
].join("\n"))
if (REPO) {
  copyFileSync(at("docs/TASTE.md"), at("public/TASTE.md"))
  copyFileSync(at("DESIGN.md"), at("public/DESIGN.md"))
  copyFileSync(at("DESIGN.md"), at("packages/pyospectui/DESIGN.md"))
}

console.log(`registry:build: ${registry.items.length} items -> ${REPO ? `public/r/v${VERSION} (legacy /r/ preserved)` : out} (base ${BASE})`)
console.log(`  theme.json + ${themes.length} presets: ${themes.map((t) => `${t.preset.name} ${t.gen.fill} ${t.gen.mode}`).join(", ")}`)
console.log(`  tokens.json: ${Object.keys(tokens.cssVars.theme).length} theme, ${Object.keys(tokens.cssVars.light).length} light, ${Object.keys(tokens.cssVars.dark).length} dark vars; ${components.length} components depend on it`)
console.log(REPO
  ? `  base.json: ${Object.keys(base.cssVars.light).length} light, ${Object.keys(base.cssVars.dark).length} dark, ${Object.keys(cssRules).length} css blocks; public/themes: ${themes.length} presets + index.md`
  : "  REGISTRY_OUT set: registry.json, base.json, public/themes and public/TASTE.md left as they are")
