#!/usr/bin/env node
// npx pyospectui                      -> theme + every component
// npx pyospectui button card          -> those components; the theme first when the project CSS has no v0.3 theme (--pyo-seed)
// npx pyospectui --brand "#3366FF"    -> a theme generated from that color, + every component in a new project
// npx pyospectui --preset blue        -> a preset theme (theme only once pyospect is installed)
// npx pyospectui theme [--brand ...]  -> theme only; without --brand it regenerates from the recorded --pyo-seed
// npx pyospectui presets              -> the preset catalog
// --cwd goes to shadcn as well; other flags and everything after -- pass through to shadcn add.
// PYOSPECTUI_REGISTRY overrides the versioned default from theme/version.mjs
import { spawn } from "node:child_process"
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join, relative, resolve } from "node:path"
import { SeedError } from "./theme/generate.mjs"
import { themeItem, contractOf, summaryRows, modeLabel, SITE, REGISTRY_BASE } from "./theme/item.mjs"
import { isPyospect } from "./theme/component-identity.mjs"

const REGISTRY = (process.env.PYOSPECTUI_REGISTRY || REGISTRY_BASE).replace(/\/?$/, "/")
const SHADCN = "shadcn@~4.21"
const PRETENDARD = '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" />'
const here = (p) => new URL(p, import.meta.url)
const base = JSON.parse(readFileSync(here("./theme/base.json"), "utf8"))
const presets = readdirSync(here("./presets/")).filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(readFileSync(here(`./presets/${f}`), "utf8")))
  .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
const DEFAULT_SEED = presets.find((p) => p.name === "pyospect")?.brand

class UsageError extends Error {}
const say = (s = "") => console.log(s)
const stop = (msg) => { console.error(`pyospectui: ${msg}`); process.exit(1) }

// ---- arguments ----
const PASS_VALUE = new Set(["-p", "--path"]) // shadcn add options that take a value
const PASS_PATH = new Set(["--diff", "--view"]) // shadcn add options whose value is optional: taken when it looks like a path
const looksLikePath = (v) => v != null && !v.startsWith("-") && (/[\\/]/.test(v) || /\.\w+$/.test(v))
function parse(argv) {
  const o = { names: [], pass: [], brand: null, preset: null, cwd: null, help: false, version: false }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === "--") { o.pass.push(...argv.slice(i + 1)); break }
    const eq = a.startsWith("--") ? a.indexOf("=") : -1
    const flag = eq > 0 ? a.slice(0, eq) : a
    // an empty value ("--brand=" or --brand "$UNSET") is an error, never a silent default
    const value = () => {
      const v = eq > 0 ? a.slice(eq + 1) : argv[++i]
      if (v == null || !v.trim() || (eq < 0 && v.startsWith("-"))) throw new UsageError(`${flag} 뒤에 값을 적어 주세요.`)
      return v
    }
    if (flag === "--brand") o.brand = value()
    else if (flag === "--preset") o.preset = value()
    else if (flag === "--cwd" || flag === "-c") o.cwd = value()
    else if (flag === "-h" || flag === "--help") o.help = true
    else if (flag === "-v" || flag === "--version") o.version = true
    else if (PASS_VALUE.has(flag)) { o.pass.push(a); if (eq < 0 && argv[i + 1] != null) o.pass.push(argv[++i]) }
    else if (PASS_PATH.has(flag)) { o.pass.push(a); if (eq < 0 && looksLikePath(argv[i + 1])) o.pass.push(argv[++i]) }
    else if (a.startsWith("-")) o.pass.push(a)
    else o.names.push(a)
  }
  return o
}

const HELP = `npx pyospectui [컴포넌트...] [옵션]

  npx pyospectui                        테마와 컴포넌트를 전부 받아요
  npx pyospectui button card            고른 컴포넌트만 받아요. 테마가 없는 프로젝트면 테마도 같이 받아요
  npx pyospectui --brand "#3366FF"      브랜드 색 하나로 테마를 만들어서 받아요
  npx pyospectui --preset blue          미리 만든 프리셋 테마를 받아요. 한국어 이름(파랑)도 돼요
  npx pyospectui theme                  테마만 다시 받아요. 기록된 브랜드 색(--pyo-seed)으로 만들어요
  npx pyospectui presets                프리셋 목록을 보여 줘요

  --cwd <폴더>        다른 폴더의 프로젝트에 설치해요
  --overwrite         이미 있는 같은 이름의 파일(shadcn init이 만든 button 등)을 pyospect 것으로 바꿔요
  --view=<경로>       shadcn add의 --diff, --view에 경로를 줄 때는 =로 붙여요
  그 밖의 옵션과 -- 뒤의 인자는 shadcn add에 그대로 넘겨요.
  레지스트리 주소는 PYOSPECTUI_REGISTRY로 바꿀 수 있어요. 지금: ${REGISTRY}

규칙은 ${SITE}/TASTE.md, AI용 요약은 ${SITE}/llms.txt 에 있어요.`

// ---- the project ----
function projectCss(cwd) {
  try {
    const file = JSON.parse(readFileSync(join(cwd, "components.json"), "utf8"))?.tailwind?.css
    return file ? readFileSync(resolve(cwd, file), "utf8") : ""
  } catch { return "" }
}
const seedOf = (css) => css.match(/--pyo-seed\s*:\s*(#[0-9a-fA-F]{3,6})\b/)?.[1]?.toUpperCase() ?? null

// where shadcn puts registry:ui files: components.json aliases.ui ("@/components/ui"), under src/ when there is one
function uiDir(cwd) {
  try {
    const a = JSON.parse(readFileSync(join(cwd, "components.json"), "utf8")).aliases ?? {}
    const rel = (a.ui ?? `${a.components ?? "@/components"}/ui`).replace(/^[@~#]\/?/, "")
    return [join(cwd, "src", rel), join(cwd, rel)].find((d) => existsSync(d)) ?? null
  } catch { return null }
}
// the component names an install writes: the requested registry items and their pyospect dependencies. null when offline
async function componentNames(items) {
  const seen = new Set(), names = new Set()
  let level = items.filter((u) => u.startsWith(REGISTRY))
  try {
    while (level.length) {
      level = [...new Set(level)].filter((u) => !seen.has(u))
      level.forEach((u) => seen.add(u))
      const got = await Promise.all(level.map(async (u) => {
        const r = await fetch(u, { signal: AbortSignal.timeout(10000) })
        if (!r.ok) throw new Error(`${r.status} ${u}`)
        return r.json()
      }))
      level = got.flatMap((it) => {
        if (it.type === "registry:ui" && it.files?.length) names.add(it.name)
        return (it.registryDependencies ?? []).filter((d) => typeof d === "string" && d.startsWith(REGISTRY))
      })
    }
  } catch { return null }
  return names
}

// ---- output ----
// Hangul and other wide characters take two columns
const width = (s) => [...String(s)].reduce((n, c) => n + (c.codePointAt(0) > 0x1100 ? 2 : 1), 0)
const pad = (s, n) => String(s) + " ".repeat(Math.max(0, n - width(s)))
function table(rows) {
  const w = rows[0].map((_, i) => Math.max(...rows.map((r) => width(r[i]))))
  rows.forEach((r) => say("  " + r.map((c, i) => pad(c, w[i])).join("  ").trimEnd()))
}
function describe(item, gen, title) {
  say(`pyospectui: ${title}`)
  say(`  모드: ${modeLabel(gen.mode)} (채움 위 글자 ${gen.mode === "white" ? "#FFFFFF" : "#111111"})`)
  say(`  채움: ${gen.fill} (brand-${gen.fillStep})${gen.fill === gen.seed ? ", 넣은 색 그대로예요" : ""}`)
  const report = contractOf(item)
  say("")
  const f = (x) => (x == null ? "-" : x.toFixed(2))
  table([["대비", "라이트", "다크", "기준", ""], ...summaryRows(report).map((r) => [r.pair, f(r.light), f(r.dark), r.min, r.pass ? "통과" : "미달"])])
  say(`  대비 검사 ${report.n}개 중 ${report.n - report.fails.length - report.warnings.length}개 통과, 경고 ${report.warnings.length}개, 미달 ${report.fails.length}개예요.`)
  if (gen.warnings.length) { say(""); gen.warnings.forEach((w) => say(`  - ${w}`)) }
  say("")
  if (report.fails.length) {
    report.fails.forEach((r) => console.error(`  ${r.mode} ${r.pair}: ${r.ratio.toFixed(2)} (기준 ${r.min})`))
    stop("이 색으로 만든 테마가 대비 기준을 넘지 못해서 설치하지 않았어요. https://github.com/pyospect/ui/issues 로 알려 주세요.")
  }
}

// a generated theme goes to a private temp folder (mkdtemp, not a guessable name) that is removed on exit
let scratch = null
process.on("exit", () => { if (scratch) rmSync(scratch, { recursive: true, force: true }) })
function generated(seed, title) {
  const { item, gen } = themeItem(seed, base)
  describe(item, gen, title(gen))
  try {
    scratch ??= mkdtempSync(join(tmpdir(), "pyospectui-"))
    const file = join(scratch, `theme-${gen.seed.slice(1).toLowerCase()}.json`)
    writeFileSync(file, JSON.stringify(item, null, 2) + "\n", { flag: "wx" })
    return { ref: file, seed: gen.seed }
  } catch (e) {
    return stop(`임시 폴더(${tmpdir()})에 테마 파일을 만들지 못했어요(${e.code ?? e.message}). TMPDIR을 쓸 수 있는 폴더로 바꾸고 다시 실행해 주세요.`)
  }
}
function listPresets() {
  say(`pyospectui 프리셋 ${presets.length}개예요. npx pyospectui --preset <프리셋>으로 골라요. 한국어 이름으로 골라도 돼요.\n`)
  const rows = presets.map((p) => {
    const { gen } = themeItem(p.brand, base)
    const gap = Object.values(gen.status).filter((s) => !s.gapOk).length
    return [p.name, p.label, p.brand, modeLabel(gen.mode), gap ? "상태색과 가까워서 라벨로 구분해요" : ""]
  })
  table([["프리셋", "이름", "브랜드 색", "채움 위 글자", ""], ...rows])
  say(`\n값과 대비표는 ${SITE}/themes/<프리셋>.md, 미리보기는 ${SITE}/#/themes 에 있어요.`)
}

// ---- main ----
let o
try { o = parse(process.argv.slice(2)) } catch (e) { if (e instanceof UsageError) stop(e.message); throw e }
if (o.help) { say(HELP); process.exit(0) }
if (o.version) { say(JSON.parse(readFileSync(here("./package.json"), "utf8")).version); process.exit(0) }
const sub = ["theme", "presets"].includes(o.names[0]) ? o.names.shift() : null
if (sub === "presets") { listPresets(); process.exit(0) }
if (o.brand != null && o.preset != null) stop("--brand와 --preset 중 하나만 골라 주세요.")
if (sub === "theme" && o.names.length) stop(`theme 명령은 테마만 받아요. 컴포넌트도 받으려면 theme을 빼고 실행해 주세요: npx pyospectui ${o.names.join(" ")}`)

const cwd = resolve(o.cwd ?? ".")
const css = projectCss(cwd)
// a v0.3 theme records its brand color. --brand without it is an older pyospect theme (or the app's own variable),
// which lacks the roles v0.3 components use (brand-graphic, brand-tint-2-text, *-fill-text...)
const installed = seedOf(css) != null
const legacy = !installed && /--brand\s*:/.test(css)
const url = (n) => (/^https?:\/\//.test(n) || n.endsWith(".json") ? n : `${REGISTRY}${n}.json`)
const names = o.names.map(url)
const list = o.names.join(", ")

let theme = null // { ref, seed }
try {
  if (o.brand != null) theme = generated(o.brand, (g) => `브랜드 색(${g.seed})으로 테마를 만들었어요.`)
  else if (o.preset != null) {
    const v = o.preset.trim()
    const p = presets.find((x) => x.name === v.toLowerCase() || x.label === v)
    if (!p) stop(`${v} 프리셋은 없어요. 있는 프리셋: ${presets.map((x) => `${x.name}(${x.label})`).join(", ")}`)
    const { item, gen } = themeItem(p.brand, base)
    describe(item, gen, `${p.label}(${p.name}) 프리셋 테마를 받아요. 브랜드 색(${p.brand})에서 만들었어요.`)
    theme = { ref: url(`theme-${p.name}`), seed: p.brand }
  } else if (sub === "theme" || (!names.length && installed)) {
    // keep the brand this project already recorded instead of falling back to the neutral default
    const seed = seedOf(css)
    if (seed) theme = generated(seed, (g) => `기록된 브랜드 색(${g.seed})으로 테마를 다시 만들었어요.`)
    else if (sub === "theme") theme = { ref: url("theme"), seed: DEFAULT_SEED }
  }
} catch (e) {
  if (e instanceof SeedError) stop(e.message)
  throw e
}

const LEGACY = "프로젝트 CSS에 --brand는 있지만 v0.3 테마가 기록하는 --pyo-seed가 없어요. 예전 pyospect 테마라서 테마도 같이 받아요. 앱이 직접 정한 --brand였다면 pyospect 값으로 바뀌어요."
let items, expectSeed = theme?.seed ?? null
if (sub === "theme") {
  items = [theme.ref]
  say("pyospectui: 컴포넌트는 그대로 두고 테마만 받아요.")
} else if (theme && !names.length && installed) {
  items = [theme.ref]
  say("pyospectui: 이미 pyospect가 있는 프로젝트라서 컴포넌트는 그대로 두고 테마만 바꿔요.")
} else if (theme) {
  items = [theme.ref, ...(names.length ? names : [url("pyospect-components")])]
  say(names.length ? `pyospectui: 테마와 컴포넌트를 받아요: ${list}` : "pyospectui: 테마와 컴포넌트를 전부 받아요.")
} else if (names.length && installed) {
  items = names
  say(`pyospectui: 컴포넌트를 받아요: ${list}`)
} else if (names.length) {
  items = [url("theme"), ...names]
  expectSeed = DEFAULT_SEED
  say(legacy ? `pyospectui: ${LEGACY}` : "pyospectui: 프로젝트 CSS에 pyospect 테마가 없어요.")
  say(`pyospectui: 테마(theme.json)와 컴포넌트를 같이 받아요: ${list}`)
} else {
  items = [url("pyospect")]
  expectSeed = DEFAULT_SEED
  say("pyospectui: 테마와 컴포넌트를 전부 받아요.")
}
say(`규칙은 ${SITE}/TASTE.md, AI용 요약은 ${SITE}/llms.txt 예요.\n`)

// shadcn stops at "already exists. Would you like to overwrite?" for a file that is not pyospect's (the button shadcn init
// makes). without a terminal that ends the run with nothing installed; answered no, the stock file stays and pyospect's
// components no longer type-check. say so before starting
const passed = (...f) => o.pass.some((a) => f.includes(a.split("=")[0]))
const writes = !passed("--dry-run", "--diff", "--view")
if (writes && !passed("-o", "--overwrite") && !passed("-p", "--path")) {
  const dir = uiDir(cwd), wanted = dir && (await componentNames(items))
  const foreign = wanted ? [...wanted].map((n) => join(dir, `${n}.tsx`)).filter((f) => existsSync(f) && !isPyospect(readFileSync(f, "utf8"))) : []
  if (foreign.length) {
    const again = ["npx pyospectui", ...process.argv.slice(2).map((a) => (/[\s"'$&|<>]/.test(a) ? JSON.stringify(a) : a)), "--overwrite"].join(" ")
    stop([
      `pyospect 파일이 아닌 같은 이름의 파일이 이미 있어요: ${foreign.map((f) => relative(cwd, f)).join(", ")}`,
      "  이대로 받으면 shadcn이 덮어쓸지 묻다가 멈추거나, 기존 파일이 남아서 pyospect 컴포넌트와 맞지 않아요.",
      `  pyospect 것으로 바꾸려면 --overwrite를 붙여서 다시 실행해 주세요: ${again}`,
    ].join("\n"))
  }
}

const args = ["--yes", SHADCN, "add", ...items, "--yes", ...(o.cwd ? ["--cwd", o.cwd] : []), ...o.pass]
const win = process.platform === "win32"
// with shell: true Node joins the arguments unquoted, and cmd.exe splits them on spaces: quote each one there
const quote = (a) => (/^[\w@~+=:,./\\-]+$/.test(a) ? a : `"${a.replace(/"/g, '""')}"`)
const child = spawn(win ? "npx.cmd" : "npx", win ? args.map(quote) : args, { stdio: "inherit", shell: win })
child.on("exit", (code) => {
  if (code !== 0) process.exit(code ?? 1)
  if (!writes) process.exit(0)
  // shadcn can end with 0 and write nothing (a prompt it could not ask): check that the theme is really there
  const now = seedOf(projectCss(cwd))
  if (expectSeed && now !== expectSeed.toUpperCase()) {
    stop(`shadcn은 끝났지만 프로젝트 CSS에 테마(--pyo-seed: ${expectSeed})가 들어가지 않았어요${now ? `(지금 ${now})` : ""}. 위의 shadcn 메시지를 확인하고, 덮어쓸지 묻는 곳에서 멈췄다면 --overwrite를 붙여서 다시 실행해 주세요.`)
  }
  const html = join(cwd, "index.html")
  if (existsSync(html) && !/pretendard/i.test(readFileSync(html, "utf8"))) {
    say(`\npyospectui: 서체는 Pretendard예요. index.html의 <head>에 이 줄을 넣어 주세요.\n  ${PRETENDARD}`)
  }
  process.exit(0)
})
