import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CopyCommand } from "@/components/ui/copy-command"
import { CodeBlock } from "@/components/ui/code-block"
import { DEMOS } from "@/docs/demos"
import { parseDoc } from "@/docs/parseDoc"
import { href } from "@/lib/router"

const GROUPS = ["기본", "AI 협업 패턴"] as const
const DOC_KEYS = ["Naming", "Variant", "Token", "Structure", "Usage Rule"]

export function Docs({ slug }: { slug: string }) {
  const demo = DEMOS.find((d) => d.slug === slug) ?? DEMOS[0]
  const doc = parseDoc(demo.source)
  const [showCode, setShowCode] = useState(false)
  const idx = DEMOS.indexOf(demo)
  const prev = DEMOS[idx - 1]
  const next = DEMOS[idx + 1]

  return (
    <div className="mx-auto grid max-w-[1040px] gap-8 px-6 py-8 pb-24 lg:grid-cols-[200px_1fr] lg:gap-12">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <nav aria-label="컴포넌트" className="flex gap-1 overflow-x-auto [scrollbar-width:none] lg:grid lg:gap-6 lg:overflow-visible">
          {GROUPS.map((g) => (
            <div key={g} className="flex shrink-0 gap-1 lg:grid lg:gap-0">
              <div className="hidden px-3 pb-2 text-xs font-medium leading-4 text-text-3 lg:block">{g}</div>
              {DEMOS.filter((d) => d.group === g).map((d) => (
                <a
                  key={d.slug}
                  href={href(`/docs/${d.slug}`)}
                  aria-current={d.slug === demo.slug ? "page" : undefined}
                  className={
                    "one-line shrink-0 rounded-full px-3 py-2 text-sm leading-5 transition-colors duration-[120ms] lg:rounded-sm " +
                    (d.slug === demo.slug ? "bg-brand-tint font-medium text-brand-ink" : "text-text-2 hover:bg-surface-2 hover:text-text")
                  }
                >
                  {d.title}
                </a>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      <article className="grid min-w-0 gap-8">
        <header className="grid gap-3">
          <div className="text-xs font-medium leading-4 text-text-3">{demo.group}</div>
          <h1 className="text-[28px] font-semibold leading-9 tracking-tight">{demo.title}</h1>
          <p className="text-sm leading-5 text-text-2 text-pretty">{demo.summary}</p>
        </header>

        <section className="grid gap-3">
          <h2 className="text-sm font-semibold leading-5">설치</h2>
          <CopyCommand command={`npx pyospectui ${demo.slug}`} />
        </section>

        <section className="grid gap-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold leading-5">미리보기</h2>
            <Button hierarchy={showCode ? "tint" : "secondary"} size="sm" onClick={() => setShowCode((v) => !v)} aria-pressed={showCode}>
              {showCode ? "코드 닫기" : "코드 보기"}
            </Button>
          </div>
          <div data-level="surface" className="rounded-md bg-surface p-6 glow">{demo.demo}</div>
          {showCode && <CodeBlock code={demo.code} />}
        </section>

        <section className="grid gap-3">
          <h2 className="text-sm font-semibold leading-5">다섯 줄 문서</h2>
          <p className="text-sm leading-5 text-text-2">컴포넌트 파일 맨 위 주석을 그대로 읽어온 거예요. 그래서 문서와 코드가 어긋나지 않아요.</p>
          <dl className="grid">
            {DOC_KEYS.map((k) => (
              <div key={k} className="grid grid-cols-[96px_1fr] gap-4 py-3 text-sm leading-5">
                <dt className="font-medium text-text">{k}</dt>
                <dd className="m-0 text-text-2 text-pretty">{doc.lines[k] ?? ""}</dd>
              </div>
            ))}
          </dl>
        </section>

        <nav className="flex justify-between gap-3 pt-4" aria-label="이전 다음">
          {prev ? <Button hierarchy="ghost" size="sm" onClick={() => (location.hash = `/docs/${prev.slug}`)}>{prev.title}</Button> : <span />}
          {next ? <Button hierarchy="ghost" size="sm" onClick={() => (location.hash = `/docs/${next.slug}`)}>{next.title}</Button> : <span />}
        </nav>
      </article>
    </div>
  )
}
