#!/usr/bin/env node
// npx pyospectui            -> installs the whole system (theme + 20 components)
// npx pyospectui button card -> installs only those
// extra flags pass through to shadcn (for example --overwrite)
import { spawn } from "node:child_process"

const REGISTRY = "https://ui.pyospect.com/r/"
const args = process.argv.slice(2)
const names = args.filter((a) => !a.startsWith("-"))
const flags = args.filter((a) => a.startsWith("-"))
const items = names.length ? names.map((n) => `${REGISTRY}${n}.json`) : [`${REGISTRY}pyospect.json`]

console.log(names.length ? `pyospectui: ${names.join(", ")} 받아요` : "pyospectui: 테마와 컴포넌트 전부 받아요")
console.log("규칙은 https://ui.pyospect.com/TASTE.md, AI용 요약은 https://ui.pyospect.com/llms.txt 예요.\n")

const npx = process.platform === "win32" ? "npx.cmd" : "npx"
const child = spawn(npx, ["--yes", "shadcn@latest", "add", ...items, "--yes", ...flags], { stdio: "inherit" })
child.on("exit", (code) => process.exit(code ?? 1))
