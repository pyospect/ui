// reads the five-line header every component file starts with:
//   Naming / Variant / Token / Structure / Usage Rule
export type Doc = { name: string; lines: Record<string, string> }

const KEYS = ["Naming", "Variant", "Token", "Structure", "Usage Rule"]

export function parseDoc(source: string): Doc {
  const m = source.match(/\/\*\*([\s\S]*?)\*\//)
  const body = (m?.[1] ?? "").split("\n").map((l) => l.replace(/^\s*\*\s?/, "").replace(/\s+$/, ""))
  const name = body.find((l) => l.trim().length)?.trim() ?? ""
  const lines: Record<string, string> = {}
  let cur = ""
  for (const l of body) {
    const key = KEYS.find((k) => l.startsWith(k + " "))
    if (key) { cur = key; lines[cur] = l.slice(key.length).trim() }
    else if (cur && l.trim() && !/^\S/.test(l)) lines[cur] += " " + l.trim()
  }
  return { name, lines }
}
