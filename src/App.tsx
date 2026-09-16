import { useEffect, useState } from "react"
import { Switch, Control } from "@/components/ui/switch"
import { Label } from "@/components/ui/input"
import { useRoute, href } from "@/lib/router"
import { Home } from "@/pages/Home"
import { Docs } from "@/pages/Docs"

const NAV: [string, string][] = [["시작하기", "#/install"], ["문서", "#/docs/button"], ["규칙", "#/rules"], ["GitHub", "https://github.com/pyospect/ui"]]
const FOOTER: [string, string][] = [["GitHub", "https://github.com/pyospect/ui"], ["npm", "https://www.npmjs.com/package/pyospectui"], ["TASTE.md", "https://ui.pyospect.com/TASTE.md"], ["llms.txt", "https://ui.pyospect.com/llms.txt"], ["pyospect.com", "https://pyospect.com"]]

export default function App() {
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem("pyo-theme") === "dark" } catch { return false }
  })
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark)
    try { localStorage.setItem("pyo-theme", dark ? "dark" : "light") } catch {}
  }, [dark])
  const path = useRoute()
  const docs = path.match(/^\/docs\/?([\w-]*)/)
  // "/install", "/rules" and friends are home sections: render Home, then scroll to the section
  useEffect(() => {
    const id = path.match(/^\/(install|components|ai|rules)$/)?.[1]
    if (id) requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: "start" }))
  }, [path])

  return (
    <div className="min-h-dvh">
      <nav className="sticky top-0 z-40 bg-bg/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1040px] items-center gap-6 px-6">
          <a href={href("/")} className="flex shrink-0 items-center gap-2 text-base font-semibold leading-6 text-text">
            <span className="size-4 rounded-full bg-brand" aria-hidden />pyospectui
          </a>
          <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto text-sm font-medium leading-5 text-text-2 [scrollbar-width:none]">
            {NAV.map(([label, to]) => (
              <a key={to} href={to} target={to.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="shrink-0 rounded-full px-3 py-2 transition-colors duration-[120ms] hover:bg-surface-2 hover:text-text">{label}</a>
            ))}
          </div>
          <Control className="shrink-0">
            <Label htmlFor="theme" className="hidden sm:block">다크 모드</Label>
            <Switch id="theme" checked={dark} onCheckedChange={setDark} aria-label="다크 모드" />
          </Control>
        </div>
      </nav>

      {docs ? <Docs slug={docs[1] || "button"} /> : <Home />}

      <footer className="bg-surface">
        <div className="mx-auto grid max-w-[1040px] gap-8 px-6 py-12 sm:grid-cols-[1fr_auto]">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 text-base font-semibold leading-6 text-text"><span className="size-4 rounded-full bg-brand" aria-hidden />pyospectui</div>
            <p className="text-sm leading-5 text-text-2 text-pretty">생각한 것을 직접 만들어요. 쓰는 사람이 이해하고 결정하기 쉽게 다듬어요.</p>
            <p className="text-xs leading-4 text-text-3">고경표 Kyoungpyo Koh, Product Designer. MIT License.</p>
          </div>
          <div className="grid content-start gap-1 text-sm font-medium leading-5 text-text-2">
            {FOOTER.map(([label, to]) => (
              <a key={to} href={to} target="_blank" rel="noreferrer" className="rounded-sm py-1 transition-colors duration-[120ms] hover:text-text">{label}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
