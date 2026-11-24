// Browser evidence for the first-screen redesign. Uses an isolated headless profile.
// Supply PLAYWRIGHT_MODULE if Playwright is installed outside this repository.
import assert from "node:assert/strict"
import { mkdir, writeFile } from "node:fs/promises"
import { resolve } from "node:path"

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright")
const output = resolve(process.env.REVIEW_OUTPUT || "docs/review/2026-11-24")
const url = process.env.REVIEW_URL || "http://127.0.0.1:5174/ui/"
await mkdir(output, { recursive: true })
const browser = await chromium.launch({ headless: true, ...(process.env.CHROMIUM_EXECUTABLE ? { executablePath: process.env.CHROMIUM_EXECUTABLE } : {}) })
const context = await browser.newContext({ viewport: { width: 1440, height: 1100 }, reducedMotion: "reduce" })
const page = await context.newPage()
const report = { url, checks: [], layouts: [], contrast: [], geometry: [], errors: [] }
page.on("pageerror", (error) => report.errors.push(error.message))
page.on("console", (message) => { if (message.type() === "error") report.errors.push(message.text()) })

async function capture(name, fullPage = true) {
  if (fullPage) {
    await page.evaluate(() => { window.scrollTo(0, 0); return new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done))) })
  }
  await page.screenshot({ path: `${output}/${name}.png`, fullPage })
}

async function check(name, work) {
  try { await work(); report.checks.push({ name, pass: true }); console.log(`PASS ${name}`) }
  catch (error) { report.checks.push({ name, pass: false, error: error.message }); throw error }
}

async function colors() {
  return page.locator("[data-preview-mode]").evaluateAll((roots) => roots.map((root) => {
    const button = root.querySelector('button[type="submit"]')
    return { mode: root.dataset.previewMode, background: getComputedStyle(root).backgroundColor, fill: getComputedStyle(button).backgroundColor, text: getComputedStyle(button).color }
  }))
}

async function measureContrast(label) {
  const rows = await page.locator("[data-preview-mode]").evaluateAll((roots) => {
    const canvas = document.createElement("canvas")
    canvas.width = canvas.height = 1
    const context = canvas.getContext("2d", { willReadFrequently: true })
    const rgba = (color) => { context.clearRect(0, 0, 1, 1); context.fillStyle = color; context.fillRect(0, 0, 1, 1); return [...context.getImageData(0, 0, 1, 1).data] }
    const luminance = (color) => color.slice(0, 3).map((v) => { const n = v / 255; return n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4 }).reduce((sum, value, i) => sum + value * [0.2126, 0.7152, 0.0722][i], 0)
    const bg = (element) => { for (let current = element; current; current = current.parentElement) { const value = rgba(getComputedStyle(current).backgroundColor); if (value[3] === 255) return value } return [255, 255, 255, 255] }
    return roots.flatMap((root) => [...root.querySelectorAll('h3, label, input:not([type="checkbox"]), p, button[type="submit"], [aria-label$="버튼 글자 대비"]')].filter((element) => element.textContent.trim() || element.tagName === "INPUT").map((element) => {
      const foreground = rgba(getComputedStyle(element).color)
      const background = bg(element)
      const l = [luminance(foreground), luminance(background)].sort((a, b) => b - a)
      return { mode: root.dataset.previewMode, element: element.tagName, text: (element.textContent.trim() || element.value).slice(0, 60), ratio: (l[0] + 0.05) / (l[1] + 0.05), foreground, background }
    }))
  })
  report.contrast.push({ label, rows })
  assert(rows.length > 10)
  assert(rows.every((row) => row.ratio >= 4.49), JSON.stringify(rows.filter((row) => row.ratio < 4.49)))
}

async function measureLayout(width, height, siteMode) {
  await page.setViewportSize({ width, height })
  const value = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth, previews: [...document.querySelectorAll("[data-preview-mode]")].map((root) => ({ mode: root.dataset.previewMode, width: root.getBoundingClientRect().width, content: root.scrollWidth })), outside: [...document.querySelectorAll("main input, main button, main [role=combobox]")].filter((element) => { const rect = element.getBoundingClientRect(); return rect.width && (rect.left < 0 || rect.right > innerWidth) }).map((element) => element.outerHTML.slice(0, 150)) }))
  report.layouts.push({ width, height, siteMode, ...value })
  assert(value.document <= width, `Page overflow at ${width}px: ${value.document}`)
  assert.equal(value.outside.length, 0, JSON.stringify(value.outside))
  for (const preview of value.previews) assert(preview.content <= preview.width + 1)
}

try {
  await check("first screen renders two independent theme surfaces", async () => {
    const response = await page.goto(url)
    assert.equal(response.status(), 200)
    await page.getByRole("heading", { name: /한국어 화면을/ }).waitFor()
    assert.equal(await page.locator("[data-preview-mode]").count(), 2)
    const pair = await colors()
    assert.equal(pair[0].background, "rgb(255, 255, 255)")
    assert.equal(pair[1].background, "rgb(23, 23, 23)")
    await measureContrast("neutral")
    await capture("desktop-neutral")
    report.font = await page.evaluate(() => ({ family: getComputedStyle(document.body).fontFamily, weight: getComputedStyle(document.body).fontWeight, koreanFontLoaded: document.fonts.check('500 16px "Pretendard Variable"', "한글") }))
  })
  const light = page.getByRole("form", { name: "라이트 워크스페이스 설정", exact: true })
  const dark = page.getByRole("form", { name: "다크 워크스페이스 설정", exact: true })
  await check("brand changes both previews and preserves the page theme", async () => {
    const pageColor = await page.locator("body").evaluate((element) => getComputedStyle(element).backgroundColor)
    await page.getByRole("button", { name: "파랑 색 적용하기", exact: true }).click()
    let pair = await colors()
    assert(pair.every((item) => item.text === "rgb(255, 255, 255)"))
    assert.equal(pair[0].fill, pair[1].fill)
    await measureContrast("blue")
    for (const mode of ["light", "dark"]) {
      await page.locator(`[data-preview-mode="${mode}"] button[type="submit"]`).hover()
      await measureContrast(`blue-hover-${mode}`)
    }
    await capture("desktop-blue")
    await page.locator("#demo").screenshot({ path: `${output}/demo-blue.png` })
    await page.getByRole("button", { name: "라임 색 적용하기", exact: true }).click()
    pair = await colors()
    assert(pair.every((item) => item.text === "rgb(17, 17, 17)"))
    assert.equal(pair[0].fill, pair[1].fill)
    assert.equal(await page.locator("body").evaluate((element) => getComputedStyle(element).backgroundColor), pageColor)
    await measureContrast("lime")
    await capture("desktop-lime")
  })
  await check("custom hex applies; invalid and low-chroma values preserve the last valid theme", async () => {
    await page.getByLabel("직접 입력하기", { exact: true }).fill("#3366FF")
    await page.getByRole("button", { name: "적용하기", exact: true }).click()
    const previous = await colors()
    await measureContrast("custom-3366ff")
    for (const invalid of ["wrong", "#777777"]) {
      await page.getByLabel("직접 입력하기", { exact: true }).fill(invalid)
      await page.getByRole("button", { name: "적용하기", exact: true }).click()
      assert.equal(await page.getByLabel("직접 입력하기", { exact: true }).getAttribute("aria-invalid"), "true")
      assert((await page.getByRole("alert").textContent()).length > 10)
      assert.deepEqual(await colors(), previous)
    }
    await page.getByRole("button", { name: "파랑 색 적용하기", exact: true }).click()
  })
  await check("form edits, checkbox, save, reset and error focus are shared", async () => {
    await light.getByLabel("워크스페이스 이름", { exact: true }).fill("제품 디자인팀")
    assert.equal(await dark.getByLabel("워크스페이스 이름", { exact: true }).inputValue(), "제품 디자인팀")
    await light.getByRole("checkbox").uncheck()
    assert.equal(await dark.getByRole("checkbox").isChecked(), false)
    await dark.getByRole("button", { name: "저장하기", exact: true }).click()
    assert((await page.getByRole("status").textContent()).includes("저장했어요"))
    assert.equal(await light.getByRole("button", { name: "되돌리기", exact: true }).isDisabled(), true)
    await light.getByLabel("워크스페이스 이름", { exact: true }).fill("임시 변경")
    await dark.getByRole("button", { name: "되돌리기", exact: true }).click()
    assert.equal(await light.getByLabel("워크스페이스 이름", { exact: true }).inputValue(), "제품 디자인팀")
    await dark.getByLabel("팀 이메일", { exact: true }).fill("bad-address")
    await dark.getByRole("button", { name: "저장하기", exact: true }).click()
    assert.equal(await dark.getByLabel("팀 이메일", { exact: true }).getAttribute("aria-invalid"), "true")
    assert.equal(await dark.getByLabel("팀 이메일", { exact: true }).evaluate((element) => document.activeElement === element), true)
    await capture("validation-error")
    await dark.getByLabel("팀 이메일", { exact: true }).fill("design@haebit.example")
    await dark.getByRole("button", { name: "저장하기", exact: true }).click()
    await light.getByLabel("워크스페이스 이름", { exact: true }).fill("")
    await light.getByRole("button", { name: "저장하기", exact: true }).click()
    assert.equal(await light.getByLabel("워크스페이스 이름", { exact: true }).evaluate((element) => document.activeElement === element), true)
    await light.getByRole("button", { name: "되돌리기", exact: true }).click()
  })
  await check("Select supports arrows, Enter, disabled items, Escape and focus return in its own theme", async () => {
    for (const form of [light, dark]) {
      const trigger = form.getByRole("combobox", { name: "기본 언어", exact: true })
      await trigger.focus(); await page.keyboard.press("Enter")
      const list = page.getByRole("listbox")
      await list.waitFor()
      assert.equal(await list.evaluate((element) => element.closest("[data-preview-mode]")?.dataset.previewMode), form === light ? "light" : "dark")
      assert.equal(await page.getByRole("option", { name: "日本語 (준비 중)" }).getAttribute("aria-disabled"), "true")
      await page.keyboard.press("Home")
      await page.waitForFunction(() => document.activeElement?.getAttribute("role") === "option" && document.activeElement.textContent.includes("한국어"))
      await page.keyboard.press("ArrowDown")
      await page.waitForFunction(() => document.activeElement?.getAttribute("role") === "option" && document.activeElement.textContent.includes("English"))
      await page.keyboard.press("Enter")
      assert((await light.getByRole("combobox", { name: "기본 언어", exact: true }).textContent()).includes("English"))
      await trigger.focus(); await page.keyboard.press("Enter"); await page.keyboard.press("Escape")
      assert.equal(await trigger.evaluate((element) => document.activeElement === element), true)
    }
  })
  await check("keyboard skip, focus, checkbox and reduced motion work", async () => {
    for (let i = 0; i < 2; i++) {
      await page.getByRole("link", { name: "본문으로 건너뛰기" }).focus()
      await page.keyboard.press("Enter")
      assert.equal(await page.locator("main").evaluate((element) => document.activeElement === element), true)
      await page.keyboard.press("Tab")
      assert.equal(await page.evaluate(() => !!document.activeElement.closest("main")), true)
    }
    await light.getByRole("button", { name: "저장하기", exact: true }).click()
    const input = light.getByLabel("워크스페이스 이름", { exact: true })
    await input.focus()
    assert((await input.evaluate((element) => getComputedStyle(element).boxShadow)).includes("2px"))
    for (const next of [light.getByLabel("팀 이메일", { exact: true }), light.getByRole("combobox", { name: "기본 언어", exact: true }), light.getByRole("combobox", { name: "시간대", exact: true }), light.getByRole("checkbox"), light.getByRole("button", { name: "저장하기", exact: true })]) {
      await page.keyboard.press("Tab")
      assert.equal(await next.evaluate((element) => document.activeElement === element), true)
    }
    const checkbox = light.getByRole("checkbox")
    await checkbox.focus(); const wasChecked = await checkbox.isChecked(); await page.keyboard.press("Space")
    assert.equal(await checkbox.isChecked(), !wasChecked)
    const submit = light.getByRole("button", { name: "저장하기", exact: true })
    await submit.focus()
    const focus = await submit.evaluate((element) => ({ width: getComputedStyle(element).outlineWidth, offset: getComputedStyle(element).outlineOffset, transition: getComputedStyle(element).transitionDuration }))
    assert.equal(focus.width, "2px"); assert.equal(focus.offset, "2px"); assert.equal(focus.transition, "0s")
  })
  await check("320, 390, 768 and desktop widths in light and dark have no page or control overflow", async () => {
    for (const siteMode of ["light", "dark"]) {
      const trigger = page.getByRole("combobox", { name: "화면 테마", exact: true })
      await trigger.click(); await page.getByRole("option", { name: siteMode === "light" ? "밝게" : "어둡게", exact: true }).click()
      for (const [width, height] of [[320, 568], [390, 844], [768, 800], [1024, 640], [1440, 1100]]) {
        await measureLayout(width, height, siteMode)
        if (width === 390 || width === 320) {
          await capture(`mobile-${width}-${siteMode}`)
        }
      }
      const pair = await colors()
      assert.equal(pair[0].background, "rgb(255, 255, 255)")
      assert.equal(pair[1].background, "rgb(23, 23, 23)")
    }
    await measureContrast("blue-with-dark-page")
  })
  await check("short mobile viewport keeps a dark Select inside the viewport with measured concentric corners", async () => {
    await page.setViewportSize({ width: 320, height: 568 })
    const trigger = dark.getByRole("combobox", { name: "시간대", exact: true })
    await trigger.click()
    const list = page.getByRole("listbox")
    const geometry = await list.evaluate((element) => {
      const outer = element.getBoundingClientRect()
      const first = element.querySelector('[role="option"]')
      const inner = first.getBoundingClientRect()
      return { kind: "concentric", id: "dark-select-mobile-320", outer: { radius: parseFloat(getComputedStyle(element).borderTopLeftRadius), width: outer.width, height: outer.height }, inner: { radius: parseFloat(getComputedStyle(first).borderTopLeftRadius), width: inner.width, height: inner.height }, inset: { x: inner.x - outer.x, y: inner.y - outer.y }, bounds: { left: outer.left, right: outer.right, top: outer.top, bottom: outer.bottom } }
    })
    assert(geometry.bounds.left >= 0 && geometry.bounds.right <= 320 && geometry.bounds.top >= 0 && geometry.bounds.bottom <= 568)
    report.geometry.push(geometry)
    await capture("mobile-dark-select", false)
    await page.keyboard.press("Escape")
    const pills = await page.locator('[data-preview-mode] button[type="submit"]').evaluateAll((buttons) => buttons.map((button, i) => { const box = button.getBoundingClientRect(); return { kind: "pill", id: `save-button-mobile-320-${i}`, outer: { radius: parseFloat(getComputedStyle(button).borderTopLeftRadius), width: box.width, height: box.height } } }))
    report.geometry.push(...pills)
    assert(pills.every((pill) => pill.outer.height >= 44))
  })
  await check("demo anchor and theme handoff retain the selected seed", async () => {
    await page.setViewportSize({ width: 1440, height: 1100 })
    await page.getByRole("link", { name: "화면에서 직접 써보기" }).click()
    assert(page.url().includes("#/demo"))
    await page.getByRole("link", { name: "테마 자세히 살펴보기" }).click()
    await page.getByRole("heading", { name: "테마 만들기", exact: true }).waitFor()
    assert(page.url().includes("brand=blue"))
    await page.getByRole("link", { name: "문서", exact: true }).click()
    await page.getByRole("heading", { name: "Button", exact: true }).waitFor()
    await page.getByRole("link", { name: "pyospectui", exact: true }).first().click()
    await page.getByRole("heading", { name: /한국어 화면을/ }).waitFor()
  })
  assert.deepEqual(report.errors, [])
} finally {
  await writeFile(`${output}/browser-results.json`, JSON.stringify(report, null, 2) + "\n")
  await writeFile(`${output}/geometry.json`, JSON.stringify(report.geometry.map(({ bounds, ...row }) => row), null, 2) + "\n")
  await browser.close()
}
