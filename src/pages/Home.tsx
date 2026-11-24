import { useState } from "react"
import { ArrowDown, ArrowUpRight, Check, CircleCheck, Contrast, Moon, Sun } from "lucide-react"
import { CopyCommand } from "@/components/ui/copy-command"
import { href } from "@/lib/router"
import { DEFAULT_BRAND, REGISTRY_BASE, resolveBrand } from "@/lib/theme"
import { SettingsPreview, type Settings, INITIAL_SETTINGS } from "@/site/settings-preview"
import styles from "./Home.module.css"

const START = resolveBrand(DEFAULT_BRAND)
if (!START.ok) throw new Error("기본 테마를 찾을 수 없어요.")
const INITIAL_THEME = START.theme
const SWATCHES = ["pyospect", "blue", "violet", "lime", "amber"]
  .map((name) => resolveBrand(name))
  .filter((result) => result.ok)

function ContrastNote() {
  return (
    <div className={styles.contrastNote}>
      <Contrast size={20} aria-hidden />
      <div>
        <p>배경색에 맞춰 버튼 글자도 달라져요.</p>
        <p className={styles.muted}>파랑은 밝은 글자, 라임은 어두운 글자를 써요. 각 화면의 수치는 실제 버튼 배경과 글자 사이의 대비예요. 일반 글자의 AA 기준은 4.5:1이에요.</p>
      </div>
    </div>
  )
}

export function Home() {
  const [theme, setTheme] = useState(INITIAL_THEME)
  const [draft, setDraft] = useState(INITIAL_THEME.seed)
  const [error, setError] = useState("")
  const [settings, setSettings] = useState<Settings>(INITIAL_SETTINGS)
  const [saved, setSaved] = useState<Settings>(INITIAL_SETTINGS)
  const [attempted, setAttempted] = useState(false)
  const [message, setMessage] = useState("")

  function applyBrand(raw: string) {
    const result = resolveBrand(raw)
    if (!result.ok) {
      setError(result.message)
      return
    }
    if (result.theme.contract.fails.length) {
      setError("대비 기준을 만족하지 못했어요. 다른 색을 골라 주세요.")
      return
    }
    setTheme(result.theme)
    setDraft(result.theme.seed)
    setError("")
  }

  function updateSettings(next: Settings) {
    setSettings(next)
    setMessage("")
  }

  const command = theme.preset
    ? `npx pyospectui --preset ${theme.preset.name}`
    : `npx pyospectui --brand "${theme.seed}"`

  return (
    <main id="main-content" tabIndex={-1} className={styles.home}>
      <header className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>한국어 제품을 위한 디자인 시스템</p>
          <h1 className="brand-heading">한국어 화면을,<br />자연스럽게.</h1>
          <p className={styles.intro}>읽기 편한 글자와 적당한 여백.<br />일하는 화면에는 필요한 만큼의 밀도.<br />pyospectui로 익숙하고 차분한 화면을 만들어요.</p>
          <a className={styles.textLink} href={href("/demo")}>화면에서 직접 써보기 <ArrowDown size={16} aria-hidden /></a>
        </div>
        <aside className={styles.quickStart} aria-label="설치 안내">
          <p className={styles.eyebrow}>내 프로젝트에서 시작하기</p>
          <CopyCommand command="npx pyospectui" />
          <p className={styles.muted}>React와 Tailwind CSS, shadcn 프로젝트에서 써요.<br />컴포넌트는 내 코드로 가져와 자유롭게 고쳐요.</p>
          <a className={styles.textLink} href={href("/install")}>설치 방법 보기 <ArrowUpRight size={16} aria-hidden /></a>
        </aside>
      </header>

      <section id="demo" className={styles.demo} aria-labelledby="demo-title">
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>하나의 색, 두 가지 화면</p>
            <h2 id="demo-title">같은 설정을, 밝게도 어둡게도.</h2>
          </div>
          <p className={styles.muted}>색을 바꾸고 입력해 보세요.<br />두 화면이 같은 설정을 함께 보여줘요.</p>
        </div>

        <div className={styles.themeTools}>
          <fieldset className={styles.presetField}>
            <legend>브랜드 색 고르기</legend>
            <div className={styles.swatches}>
              {SWATCHES.map((result) => (
                <button
                  key={result.key}
                  type="button"
                  aria-label={`${result.theme.preset?.label} 색 적용하기`}
                  aria-pressed={theme.seed === result.theme.seed}
                  onClick={() => applyBrand(result.key)}
                  className={styles.swatch}
                >
                  <span style={{ backgroundColor: result.theme.seed }} aria-hidden>
                    {theme.seed === result.theme.seed && (
                      <Check size={16} style={{ color: result.theme.gen.light["brand-text"] }} />
                    )}
                  </span>
                </button>
              ))}
            </div>
          </fieldset>
          <form
            className={styles.hexForm}
            onSubmit={(event) => {
              event.preventDefault()
              applyBrand(draft)
            }}
            noValidate
          >
            <label htmlFor="demo-brand">직접 입력하기</label>
            <div className={styles.hexControls}>
              <input
                id="demo-brand"
                value={draft}
                onChange={(event) => {
                  setDraft(event.target.value)
                  setError("")
                }}
                aria-invalid={!!error}
                aria-describedby="brand-help"
                spellCheck={false}
                autoComplete="off"
                maxLength={32}
              />
              <button type="submit" className={styles.applyButton}>적용하기</button>
            </div>
          </form>
          <p
            id="brand-help"
            className={`${styles.pickerHelp} ${error ? styles.error : ""}`}
            role={error ? "alert" : undefined}
          >
            {error || "#3366FF처럼 입력해요. 선택한 색은 아래 예시에만 적용돼요."}
          </p>
        </div>

        <div className={styles.previews}>
          {(["light", "dark"] as const).map((mode) => (
              <div key={mode}>
              <div className={styles.modeLabel}>
                {mode === "light" ? <Sun size={16} aria-hidden /> : <Moon size={16} aria-hidden />}
                <span>{mode === "light" ? "라이트" : "다크"}</span>
                <span className={styles.modeSub}>같은 컴포넌트와 설정</span>
              </div>
              <SettingsPreview
                mode={mode}
                theme={theme}
                settings={settings}
                saved={saved}
                attempted={attempted}
                message={message}
                onChange={updateSettings}
                onAttempt={() => setAttempted(true)}
                onSave={() => {
                  setSaved(settings)
                  setAttempted(false)
                  setMessage("설정을 저장했어요.")
                }}
                onReset={() => {
                  setSettings(saved)
                  setAttempted(false)
                  setMessage("마지막 저장 상태로 되돌렸어요.")
                }}
              />
            </div>
          ))}
        </div>

        <div className={styles.demoNotes}>
          <ContrastNote />
          <p className={styles.demoDisclaimer}>가상 워크스페이스예요. 저장은 이 화면에서만 유지돼요.</p>
        </div>
        <div className={styles.themeNext}>
          <div>
            <CircleCheck size={16} aria-hidden />
            <p>선택한 색의 라이트와 다크 대비 검사를 통과했어요.</p>
          </div>
          <a
            className={styles.textLink}
            href={`${href("/themes")}?brand=${theme.preset?.name ?? theme.seed.slice(1)}`}
          >테마 자세히 살펴보기 <ArrowUpRight size={16} aria-hidden /></a>
        </div>
      </section>

      <section id="components" className={styles.principles} aria-label="화면을 만드는 기준">
        {[
          ["읽는 글자와 쓰는 글자", "소개문은 넉넉하게, 라벨과 입력은 간결하게. 한글의 호흡과 작업 화면의 밀도를 함께 생각해요."],
          ["색보다 먼저, 의미", "색에만 기대지 않아요. 상태는 아이콘과 문장으로, 포커스는 선명한 선으로 알려줘요."],
          ["하나를 바꿔도, 함께", "브랜드 색 하나에서 채움과 글자색을 만들어요. 밝은 화면과 어두운 화면의 대비도 함께 검사해요."],
        ].map(([title, text]) => (
          <article key={title}>
            <h2>{title}</h2>
            <p className={styles.muted}>{text}</p>
          </article>
        ))}
      </section>

      <section id="install" className={styles.install} aria-labelledby="install-title">
        <div>
          <p className={styles.eyebrow}>내 화면으로 이어가기</p>
          <h2 id="install-title">마음에 드는 색으로 시작해요.</h2>
          <p className={styles.muted}>설치된 프로젝트에서는 테마만 바꿔요.<br />첫 설치에는 <code>--overwrite</code>를 붙여요.</p>
        </div>
        <div className={styles.installCommand}>
          <CopyCommand command={command} label="선택한 테마 설치 명령 복사하기" />
          <a className={styles.textLink} href={href("/docs/button")}>컴포넌트 문서 보기 <ArrowUpRight size={16} aria-hidden /></a>
        </div>
        <details className={styles.installDetails}>
          <summary>새 프로젝트 만들기와 레지스트리 주소 보기</summary>
          <div className={styles.installSteps}>
            <CopyCommand command="npx shadcn@~4.21 init -t vite -b radix -p nova -y --no-monorepo -n my-app" />
            <CopyCommand command={`cd my-app && ${command} --overwrite`} />
            <CopyCommand command="npm run dev" />
            <p className={styles.muted}>shadcn 레지스트리 주소: <code>{REGISTRY_BASE}pyospect.json</code></p>
          </div>
        </details>
      </section>

      <section id="rules" className={styles.rules} aria-label="디자인 규칙">
        <p className={styles.muted}>Pretendard 500. 4px 그리드. 무채색 면과 하나의 브랜드 색.</p>
        <a
          className={styles.textLink}
          href={`${import.meta.env.BASE_URL}DESIGN.md`}
          target="_blank"
          rel="noreferrer"
        >디자인 규칙 읽기 <ArrowUpRight size={16} aria-hidden /></a>
      </section>
    </main>
  )
}
