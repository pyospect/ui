import { Component, Suspense, lazy, useEffect, useState, type ReactNode } from "react"
import { useRoute, href } from "@/lib/router"
import { BrandMenu } from "@/site/brand-menu"
import { Home } from "@/pages/Home"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { version } from "../package.json"

const Docs = lazy(() => import("@/pages/Docs").then((module) => ({ default: module.Docs })))
const Themes = lazy(() => import("@/pages/Themes").then((module) => ({ default: module.Themes })))
const Lab = lazy(() => import("@/pages/Lab").then((module) => ({ default: module.Lab })))

class RouteBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    if (this.state.failed) return <main className="mx-auto grid max-w-[1160px] gap-6 px-6 py-14"><h1 className="brand-heading">화면을 불러오지 못했어요</h1><p className="brand-body text-text-2">연결 상태를 확인하고 다시 시도해 주세요.</p><button type="button" className="w-fit rounded-full bg-brand px-6 py-3 text-sm font-medium text-brand-text" onClick={() => window.location.reload()}>다시 불러오기</button></main>
    return this.props.children
  }
}

const NAV: [string, string][] = [["시작하기", "#/install"], ["문서", "#/docs/button"], ["테마", "#/themes"], ["실험실", "#/lab"], ["규칙", "#/rules"], ["GitHub", "https://github.com/pyospect/ui"]]
const FOOTER: [string, string][] = [["GitHub", "https://github.com/pyospect/ui"], ["npm", "https://www.npmjs.com/package/pyospectui"], ["DESIGN.md", `${import.meta.env.BASE_URL}DESIGN.md`], ["TASTE.md", `${import.meta.env.BASE_URL}TASTE.md`], ["llms.txt", `${import.meta.env.BASE_URL}llms.txt`], ["pyospect.com", "https://pyospect.com"]]

export default function App() {
  const [mode, setMode] = useState<"light" | "dark" | "system">(() => {
    try { const saved = localStorage.getItem("pyo-theme"); return saved === "dark" || saved === "system" ? saved : "light" } catch { return "light" }
  })
  const [systemDark, setSystemDark] = useState(() => window.matchMedia("(prefers-color-scheme: dark)").matches)
  const dark = mode === "dark" || (mode === "system" && systemDark)
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const update = () => setSystemDark(media.matches)
    update()
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [])
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark)
    document.documentElement.style.colorScheme = dark ? "dark" : "light"
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? "#0a0a0a" : "#fafafa")
    try { localStorage.setItem("pyo-theme", mode) } catch {}
  }, [dark, mode])
  useEffect(() => {
    const update = (event: StorageEvent) => {
      if (event.key !== "pyo-theme") return
      setMode(event.newValue === "dark" || event.newValue === "system" ? event.newValue : "light")
    }
    window.addEventListener("storage", update)
    return () => window.removeEventListener("storage", update)
  }, [])
  const path = useRoute()
  const docs = path === "/docs" || path.startsWith("/docs/")
  const docSlug = docs ? path.slice("/docs".length).replace(/^\/|\/$/g, "") || "button" : ""
  // #/themes is a full-width app shell, one viewport tall from 1024 up: the nav spans it and the footer steps aside
  const shell = path === "/themes"
  // the nav entry that holds this page: #/docs/<any> is 문서
  const section = docs ? "/docs/button" : path
  // "/install", "/rules" and friends are home sections: render Home, then scroll to the section
  useEffect(() => {
    const id = path.match(/^\/(install|components|ai|rules)$/)?.[1]
    if (id) requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: "start" }))
  }, [path])

  return (
    <div className="min-h-dvh">
      <nav className="sticky top-0 z-40 bg-bg/90 backdrop-blur">
        <div className={cn("relative mx-auto flex max-w-[1160px] flex-wrap items-center gap-x-2 gap-y-1 px-4 py-2 sm:h-16 sm:flex-nowrap sm:gap-6 sm:px-6 sm:py-0", shell && "lg:max-w-none")}>
          <a href={href("/")} className="order-1 flex min-w-0 flex-1 items-center gap-2 text-sm font-medium leading-6 tracking-normal text-text sm:flex-none sm:text-base">
            <span className="hidden size-4 rounded-full bg-brand-graphic sm:inline-block" aria-hidden />pyospectui
          </a>
          <div className="order-4 flex min-w-0 basis-full items-center gap-1 overflow-x-auto text-sm font-medium leading-5 text-text-2 [scrollbar-width:none] sm:order-2 sm:flex-1 sm:basis-0">
            {NAV.map(([label, to]) => (
              <a
                key={to}
                href={to}
                target={to.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                aria-current={to === `#${section}` ? "page" : undefined}
                className="shrink-0 rounded-full px-3 py-2 transition-colors hover:bg-surface-2 hover:text-text aria-[current=page]:text-text"
              >
                {label}
              </a>
            ))}
          </div>
          <div className="order-2 shrink-0 sm:order-3"><BrandMenu /></div>
          <span className="order-3 w-32 shrink-0 sm:order-4">
            <Select value={mode} onValueChange={(value) => setMode(value as "light" | "dark" | "system")}>
              <SelectTrigger aria-label="화면 테마" className="h-10 rounded-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="light">밝게</SelectItem>
                <SelectItem value="dark">어둡게</SelectItem>
                <SelectItem value="system">시스템 설정</SelectItem>
              </SelectContent>
            </Select>
          </span>
        </div>
      </nav>

      <RouteBoundary key={path}>
        <Suspense fallback={<main role="status" className="brand-body mx-auto min-h-[50dvh] max-w-[1160px] px-6 py-14 text-text-2">화면을 불러오고 있어요.</main>}>
          {docs ? <Docs slug={docSlug} /> : path === "/themes" ? <Themes /> : path === "/lab" ? <Lab /> : <Home />}
        </Suspense>
      </RouteBoundary>

      <footer className={cn("bg-surface", shell && "lg:hidden")}>
        <div className="mx-auto grid max-w-[1160px] gap-8 px-4 py-12 sm:grid-cols-[1fr_auto] sm:px-6">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 text-base font-medium leading-6 tracking-normal text-text"><span className="size-4 rounded-full bg-brand-graphic" aria-hidden />pyospectui</div>
            <p className="text-sm leading-5 text-text-2 text-pretty">생각한 것을 직접 만들어요. 쓰는 사람이 이해하고 결정하기 쉽게 다듬어요.</p>
            <p className="text-xs leading-4 text-text-3">고경표 Kyoungpyo Koh, Product Designer. MIT License. v{version}</p>
          </div>
          <div className="grid content-start gap-1 text-sm font-medium leading-5 text-text-2">
            {FOOTER.map(([label, to]) => (
              <a key={to} href={to} target="_blank" rel="noreferrer" className="rounded-sm py-1 transition-colors hover:text-text">{label}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
