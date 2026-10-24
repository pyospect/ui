import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CopyCommand } from "@/components/ui/copy-command"
import { CodeBlock } from "@/components/ui/code-block"
import { DEMOS, type Demo } from "@/docs/demos"
import { parseDoc } from "@/docs/parseDoc"
import { href } from "@/lib/router"
import styles from "./Docs.module.css"

const GROUPS = ["기본", "AI 협업 패턴"] as const
const DOC_KEYS = ["Naming", "Variant", "Token", "Structure", "Usage Rule"]

export function Docs({ slug }: { slug: string }) {
  const demo = DEMOS.find((d) => d.slug === slug)

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <nav aria-label="컴포넌트" className={styles.sidebarNav}>
          {GROUPS.map((g) => (
            <div key={g} className={styles.sidebarGroup}>
              <div className={styles.sidebarGroupTitle}>{g}</div>
              {DEMOS.filter((d) => d.group === g).map((d) => (
                <a
                  key={d.slug}
                  href={href(`/docs/${d.slug}`)}
                  aria-current={d.slug === demo?.slug ? "page" : undefined}
                  className={styles.sidebarLink}
                >
                  {d.title}
                </a>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      {demo ? <DocArticle key={demo.slug} demo={demo} /> : <article className={styles.article}>
        <header className={styles.pageHeading}>
          <p className="text-xs leading-4 text-text-3">컴포넌트 문서</p>
          <h1 className="brand-heading">문서를 찾을 수 없어요</h1>
          <p className="brand-body text-text-2">주소를 확인하거나 컴포넌트 목록에서 보고 싶은 문서를 골라 주세요.</p>
        </header>
        <a href={href("/docs/button")} className={styles.returnLink}>첫 컴포넌트 문서 보기</a>
      </article>}
    </div>
  )
}

function DocArticle({ demo }: { demo: Demo }) {
  const doc = parseDoc(demo.source)
  const [showCode, setShowCode] = useState(false)
  const idx = DEMOS.indexOf(demo)
  const prev = DEMOS[idx - 1]
  const next = DEMOS[idx + 1]

  return (
      <article className={styles.article}>
        <header className={styles.pageHeading}>
          <div className="text-xs font-medium leading-4 text-text-3">{demo.group}</div>
          <h1 className="brand-heading font-medium">{demo.title}</h1>
          <p className="brand-body text-text-2 text-pretty">{demo.summary}</p>
        </header>

        <section className={styles.section} aria-labelledby="doc-install-title">
          <h2 id="doc-install-title" className={styles.sectionTitle}>설치</h2>
          <CopyCommand command={`npx pyospectui ${demo.slug}`} />
          <p className="brand-copy text-text-2 text-pretty">
            프로젝트에 pyospect 테마가 없으면 테마를 먼저 같이 받아요. 이미 있으면 컴포넌트만 받고 색은 그대로예요. 브랜드 색은 <a href={href("/themes")} className="font-medium text-brand-ink underline underline-offset-4">테마 페이지</a>에서 골라요.
          </p>
        </section>

        <section className={styles.section} aria-labelledby="doc-preview-title">
          <div className={styles.previewHeading}>
            <h2 id="doc-preview-title" className={styles.sectionTitle}>미리보기</h2>
            <Button hierarchy={showCode ? "tint" : "secondary"} size="sm" onClick={() => setShowCode((v) => !v)} aria-expanded={showCode} aria-controls="doc-preview-code">
              {showCode ? "코드 닫기" : "코드 보기"}
            </Button>
          </div>
          {/* surface components sit on bg; everything else is shown on a surface panel */}
          <div data-doc-preview={demo.slug} data-level={demo.stage === "bg" ? "bg" : "surface"} className={`${styles.preview} ${demo.stage === "bg" ? styles.previewBg : styles.previewSurface}`}>
            {demo.demo}
          </div>
          {showCode && <div id="doc-preview-code" className={styles.code}><CodeBlock code={demo.code} /></div>}
        </section>

        <section className={styles.section} aria-labelledby="doc-contract-title">
          <h2 id="doc-contract-title" className={styles.sectionTitle}>다섯 줄 문서</h2>
          <p className="brand-copy text-text-2">컴포넌트 파일 맨 위 주석을 그대로 읽어온 거예요. 그래서 문서와 코드가 어긋나지 않아요.</p>
          <dl className={styles.metadata}>
            {DOC_KEYS.map((k) => (
              <div key={k} className={styles.metadataRow}>
                <dt>{k}</dt>
                <dd>{doc.lines[k] ?? ""}</dd>
              </div>
            ))}
          </dl>
        </section>

        <nav className={styles.pageNav} aria-label="이전 다음">
          {prev ? <Button hierarchy="ghost" size="sm" onClick={() => (location.hash = `/docs/${prev.slug}`)}>{prev.title}</Button> : <span />}
          {next ? <Button hierarchy="ghost" size="sm" onClick={() => (location.hash = `/docs/${next.slug}`)}>{next.title}</Button> : <span />}
        </nav>
      </article>
  )
}
