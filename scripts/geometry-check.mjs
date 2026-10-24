#!/usr/bin/env node
// Validate actual browser measurements. This command does not capture or inspect a page.
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"

export const GEOMETRY_TOLERANCE = 0.5

const record = (value, name) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`${name}은 객체여야 해요.`)
  return value
}

const number = (value, name, positive = false) => {
  if (typeof value !== "number" || !Number.isFinite(value) || (positive ? value <= 0 : value < 0)) {
    throw new Error(`${name}은 ${positive ? "0보다 큰" : "0 이상의"} 유한한 숫자여야 해요.`)
  }
  return value
}

function box(value, name) {
  const input = record(value, name)
  return {
    radius: number(input.radius, `${name}.radius`),
    width: number(input.width, `${name}.width`, true),
    height: number(input.height, `${name}.height`, true),
  }
}

/** Uniform circular corners only: CSS limits a radius to half the shorter box dimension. */
export function effectiveRadius(value) {
  const input = box(value, "box")
  return Math.min(input.radius, input.width / 2, input.height / 2)
}

const px = (value) => `${Number(value.toFixed(3))}px`

/** Return a result for each measurement; malformed data also fails rather than being skipped. */
export function checkMeasurements(value) {
  if (!Array.isArray(value) || value.length === 0) throw new Error("실제 측정값이 한 개 이상 들어 있는 JSON 배열이 필요해요.")
  const ids = new Set()
  return value.map((entry, index) => {
    let id = `측정 ${index + 1}`
    try {
      const input = record(entry, id)
      if (typeof input.id !== "string" || !input.id.trim() || /[\u0000-\u001f\u007f]/u.test(input.id)) {
        throw new Error("id는 비어 있지 않은 한 줄 문자열이어야 해요.")
      }
      id = input.id.trim()
      if (ids.has(id)) throw new Error("중복 id예요. 화면·테마·크기별로 구분해 주세요.")
      ids.add(id)
      const outer = box(input.outer, "outer")
      const outerRadius = effectiveRadius(outer)

      if (input.kind === "pill") {
        const expected = Math.min(outer.width, outer.height) / 2
        const pass = Math.abs(outerRadius - expected) <= GEOMETRY_TOLERANCE
        return { id, kind: input.kind, pass, expected, actual: outerRadius,
          message: `pill 반경 ${px(outerRadius)}, 짧은 변의 절반 ${px(expected)}` }
      }

      if (input.kind !== "concentric") throw new Error("kind는 concentric 또는 pill이어야 해요.")
      const inner = box(input.inner, "inner")
      if (inner.width > outer.width + GEOMETRY_TOLERANCE || inner.height > outer.height + GEOMETRY_TOLERANCE) {
        throw new Error("안쪽 면이 바깥 면보다 커요. 같은 단위의 맞물리는 두 면인지 확인해 주세요.")
      }
      const inset = record(input.inset, "inset")
      const x = number(inset.x, "inset.x"), y = number(inset.y, "inset.y")
      if (x + inner.width > outer.width + GEOMETRY_TOLERANCE || y + inner.height > outer.height + GEOMETRY_TOLERANCE) {
        throw new Error("간격과 안쪽 크기를 합하면 바깥 면을 벗어나요. 실제로 안에 놓인 대응 모서리를 측정해 주세요.")
      }
      if (Math.abs(x - y) > GEOMETRY_TOLERANCE) {
        throw new Error(`좌우·상하 간격이 달라요 (${px(x)} / ${px(y)}). 균일한 원형 코너 검수에 맞는 쌍인지 확인해 주세요.`)
      }
      const gap = (x + y) / 2
      const expected = Math.max(0, outerRadius - gap)
      const actual = effectiveRadius(inner)
      const pass = Math.abs(actual - expected) <= GEOMETRY_TOLERANCE
      return { id, kind: input.kind, pass, expected, actual, outerRadius, gap,
        message: `바깥 ${px(outerRadius)} − 간격 ${px(gap)} → 안쪽 ${px(actual)} (기대 ${px(expected)})` }
    } catch (error) {
      return { id, pass: false, message: error instanceof Error ? error.message : "측정값을 확인해 주세요." }
    }
  })
}

const USAGE = "사용법: npm run check:geometry -- /absolute/path/measurements.json\n브라우저 실측값 형식과 수동 검수 항목은 docs/QA.md를 확인하세요."

export function run(argv) {
  if (argv.length === 1 && ["--help", "-h"].includes(argv[0])) {
    console.log(USAGE)
    return 0
  }
  if (argv.length !== 1 || argv[0].startsWith("-")) {
    console.error(`geometry-check: 측정 파일 경로가 하나 필요해요.\n${USAGE}`)
    return 2
  }
  let raw
  try { raw = readFileSync(resolve(argv[0]), "utf8") } catch (error) {
    console.error(`geometry-check: 측정 파일을 읽지 못했어요 (${error?.code ?? "read error"}).`)
    return 2
  }
  let value
  try { value = JSON.parse(raw) } catch {
    console.error("geometry-check: 측정 파일의 JSON 문법을 확인해 주세요.")
    return 2
  }
  let results
  try { results = checkMeasurements(value) } catch (error) {
    console.error(`geometry-check: ${error.message}`)
    return 2
  }
  for (const result of results) console.log(`${result.pass ? "PASS" : "FAIL"} ${result.id}: ${result.message}`)
  const failures = results.filter((result) => !result.pass).length
  console.log(`geometry-check: ${results.length}개 측정, 통과 ${results.length - failures}, 실패 ${failures}; 허용 오차 ${GEOMETRY_TOLERANCE}px`)
  return failures ? 1 : 0
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exitCode = run(process.argv.slice(2))
