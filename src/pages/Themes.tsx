// #/themes: a "create" screen. left, the controls (256px); right, a bento canvas of product tiles in the chosen brand.
// ≥1024 the page is one viewport tall under the nav and the body does not scroll; below that it stacks and scrolls.
// the canvas takes the site-wide brand (same generator output, same URL and storage state) and has its own light/dark.
import { useEffect, useId, useMemo, useRef, useState } from "react"
import { Info, Moon, Shuffle, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input, Field, Label, Help } from "@/components/ui/input"
import { Switch, Control } from "@/components/ui/switch"
import { Card, CardTitle, CardText } from "@/components/ui/card"
import { Tag } from "@/components/ui/tag"
import { Dialog, DialogTrigger, DialogClose, DialogContent, DialogTitle, DialogDescription, DialogActions } from "@/components/ui/dialog"
import { List, ListItem } from "@/components/ui/list"
import { TableWrap, Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from "@/components/ui/table"
import { SkeletonText } from "@/components/ui/skeleton"
import { Empty } from "@/components/ui/empty"
import { CopyCommand } from "@/components/ui/copy-command"
import { CodeBlock } from "@/components/ui/code-block"
import { Thinking } from "@/components/ai/thinking"
import { ValidationCard } from "@/components/ai/validation-card"
import { Steps, Step, StepsLegend } from "@/components/ai/steps"
import { DecisionCard } from "@/components/ai/decision-card"
import { Diff, DiffLine } from "@/components/ai/diff"
import { Versions, Version } from "@/components/ai/versions"
import { Chat, Bubble, ChatTime } from "@/components/ai/chat"
import { ConnectionList, Connection } from "@/components/ai/connection"
import { Swatches } from "@/site/swatches"
import { useBrand, setBrand, resetBrand } from "@/lib/brand"
import { DEFAULT_BRAND, PRESETS, SITE, isHex, toHex, modeLabel, varStyle, type Theme } from "@/lib/theme"
import { cn } from "@/lib/utils"

type Mode = "light" | "dark"

const HEX_HELP = "#3366FF처럼 여섯 자리로 적어요. 회색에 가까운 색은 쓸 수 없어요."
const HEX_FORMAT = "#3366FF처럼 # 뒤에 여섯 자리 hex로 적어 주세요."

// ---- controls ----

function Chip({ hex, className }: { hex?: string | null; className?: string }) {
  return <span className={cn("size-4 shrink-0 rounded-full shadow-[inset_0_0_0_1px_var(--line)]", className)} style={{ backgroundColor: hex ?? undefined }} aria-hidden />
}

// 라이트 | 다크 for the canvas only. selected = brand-tint + brand-ink (TASTE 10); track full, segments full
function ModeToggle({ mode, onMode, className }: { mode: Mode; onMode: (m: Mode) => void; className?: string }) {
  const opts: [Mode, string, typeof Sun][] = [["light", "라이트", Sun], ["dark", "다크", Moon]]
  return (
    <div role="group" aria-label="미리보기 모드" className={cn("flex h-11 shrink-0 gap-1 rounded-full bg-surface-2 p-1", className)}>
      {opts.map(([m, label, Icon]) => (
        <button
          key={m}
          type="button"
          aria-pressed={mode === m}
          onClick={() => onMode(m)}
          className="flex min-w-0 flex-1 cursor-pointer items-center justify-center gap-1 rounded-full px-2 text-sm font-medium leading-5 text-text-2 transition-colors hover:text-text aria-pressed:bg-brand-tint aria-pressed:text-brand-ink"
        >
          <Icon className="size-4 shrink-0" aria-hidden />{label}
        </button>
      ))}
    </div>
  )
}

// the hex field follows the site-wide brand, and pushes a complete hex back into it
function Picker() {
  const { theme, invalid } = useBrand()
  const [draft, setDraft] = useState(invalid?.raw ?? theme.seed)
  const [touched, setTouched] = useState(false)
  const frame = useRef(0)
  useEffect(() => { setDraft((d) => (isHex(d) && toHex(d) === theme.seed ? d : theme.seed)); setTouched(false) }, [theme.seed])
  // an error shows its value; once it is gone (a valid pick, or a link without ?brand=) the field follows the brand again
  useEffect(() => { setDraft((d) => (invalid ? invalid.raw : isHex(d) && toHex(d) === theme.seed ? d : theme.seed)) }, [invalid])
  useEffect(() => () => cancelAnimationFrame(frame.current), [])

  const error = invalid && invalid.raw === draft ? invalid.message : touched && !isHex(draft) ? HEX_FORMAT : null
  const type = (v: string) => { setDraft(v); setTouched(false); if (/^#?[0-9a-f]{6}$/i.test(v.trim())) setBrand(v) }
  const commit = () => { setTouched(true); if (isHex(draft) && toHex(draft) !== theme.seed) setBrand(draft) }
  // the color input fires on every move; apply once per frame
  const pick = (v: string) => { setDraft(v.toUpperCase()); cancelAnimationFrame(frame.current); frame.current = requestAnimationFrame(() => setBrand(v)) }

  return (
    <Field>
      <Label htmlFor="brand-hex">직접 고르기</Label>
      <div className="flex gap-2">
        {/* a circle: swatch full inside a full field (TASTE 7) */}
        <input
          type="color"
          aria-label="색상표에서 고르기"
          value={(isHex(draft) ? toHex(draft) : theme.seed).toLowerCase()}
          onChange={(e) => pick(e.target.value)}
          className="size-10 shrink-0 cursor-pointer appearance-none rounded-full bg-surface p-1 shadow-[inset_0_0_0_1px_var(--line)] transition-colors hover:bg-surface-2 [&::-moz-color-swatch]:rounded-full [&::-moz-color-swatch]:border-0 [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch-wrapper]:p-0"
        />
        <Input
          id="brand-hex"
          value={draft}
          onChange={(e) => type(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => { if (e.key === "Enter") commit() }}
          aria-invalid={error ? true : undefined}
          aria-describedby="brand-hex-help"
          autoComplete="off"
          spellCheck={false}
          placeholder="#3366FF"
          className="font-mono"
        />
      </div>
      <Help id="brand-hex-help" error={!!error}>{error ?? HEX_HELP}</Help>
    </Field>
  )
}

// each token and the contract pairs it is checked in ("fg on bg"); the list shows the lowest ratio of both themes
const STATUS = ["ok", "warn", "danger"]
const TOKENS: [string, string[]][] = [
  ["brand", ["brand-text on brand"]],
  ["brand-hover", ["brand-text on brand-hover"]],
  ["brand-ink", ["bg", "surface", "surface-2", "brand-tint"].map((b) => `brand-ink on ${b}`)],
  ["brand-tint", ["brand-ink", "text", "text-2"].map((f) => `${f} on brand-tint`)],
  ["brand-tint-2", ["brand-tint-2-text on brand-tint-2"]],
  ["brand-tint-2-hover", ["brand-tint-2-text on brand-tint-2-hover"]],
  ["brand-graphic", ["brand-graphic on bg", "brand-graphic on surface"]],
  ...STATUS.flatMap((s): [string, string[]][] => [
    [s, ["bg", "surface", "surface-2", `${s}-tint`].map((b) => `${s} on ${b}`)],
    [`${s}-fill`, [`${s}-fill-text on ${s}-fill`]],
    [`${s}-tint`, [`${s} on ${s}-tint`]],
  ]),
  ...[1, 2, 3, 4, 5].map((n): [string, string[]] => [`chart-${n}`, [`chart-${n} on bg`, `chart-${n} on surface`]]),
]

function tokenRows(theme: Theme) {
  const results = theme.contract.results.filter((r) => r.kind === "contrast")
  const hex = new Map(theme.resolve(TOKENS.map(([t]) => t)).map((r) => [r.token, r]))
  return TOKENS.map(([token, pairs]) => {
    const all = results.filter((r) => pairs.includes(r.pair)).sort((a, b) => a.ratio - b.ratio)
    return { token, light: hex.get(token)?.light, dark: hex.get(token)?.dark, low: all[0], pass: all.every((r) => r.pass) }
  })
}

function About({ theme }: { theme: Theme }) {
  const { gen, contract, preset } = theme
  const onFill = contract.results.find((r) => r.mode === "light" && r.pair === "brand-text on brand")
  const rows = useMemo(() => tokenRows(theme), [theme])
  const facts: [string, string][] = [
    ["브랜드 색", gen.seed],
    ["채움 색", `${gen.fill}, brand-${gen.fillStep}`],
    ["채움 위 글자", `${modeLabel(gen.mode)}, ${onFill ? onFill.ratio.toFixed(2) : "없음"}:1`],
  ]
  return (
    <section aria-labelledby="picked" className="grid gap-3">
      <div className="flex min-w-0 items-center gap-2">
        <Chip hex={gen.seed} />
        <h2 id="picked" className="one-line text-sm font-semibold leading-5 text-text">{preset ? `${preset.label} 프리셋` : "직접 고른 색"}</h2>
      </div>
      <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1 text-xs leading-4">
        {facts.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-text-3">{k}</dt>
            <dd className="one-line m-0 font-medium text-text">{v}</dd>
          </div>
        ))}
      </dl>
      <p className={cn("text-xs font-medium leading-4 text-pretty", contract.fails.length ? "text-danger" : "text-ok")}>
        {contract.fails.length
          ? `대비 검사 ${contract.n}개 중 ${contract.fails.length}개가 기준에 못 미쳐요. CLI가 설치하지 않는 색이에요.`
          : `대비 검사 ${contract.n}개를 모두 통과했어요.`}
      </p>
      <ul className="grid gap-2">
        {(gen.warnings.length ? gen.warnings : ["옮기거나 바꾼 색이 없어요. 브랜드 색과 상태색이 모두 기본 자리에 있어요."]).map((w) => (
          <li key={w} className="flex gap-2 text-xs leading-4 text-text-2 text-pretty"><Info className="size-4 shrink-0 text-text-3" aria-hidden />{w}</li>
        ))}
      </ul>
      <details className="group grid">
        <summary className="flex h-8 cursor-pointer list-none items-center text-xs font-medium leading-4 text-brand-ink [&::-webkit-details-marker]:hidden">
          <span className="group-open:hidden">토큰과 대비 보기</span><span className="hidden group-open:inline">토큰과 대비 접기</span>
        </summary>
        <div className="grid gap-2 pt-1">
          <p className="text-xs leading-4 text-text-3 text-pretty">라이트, 다크 값과 짝 중 가장 낮은 대비예요.</p>
          <ul className="grid gap-1">
            {rows.map((r) => (
              <li key={r.token} className="flex min-w-0 items-center gap-2 text-xs leading-4">
                <span className="one-line flex-1 font-mono text-text-2">{r.token}</span>
                <Chip hex={r.light} /><Chip hex={r.dark} />
                <span className="sr-only">라이트 {r.light ?? "없음"}, 다크 {r.dark ?? "없음"}</span>
                <span className={cn("w-8 shrink-0 text-right tabular", r.pass ? "text-text-2" : "text-danger")}>{r.low ? r.low.ratio.toFixed(2) : ""}</span>
              </li>
            ))}
          </ul>
          {preset && (
            <a className="text-xs font-medium leading-4 text-brand-ink underline underline-offset-4" href={`${import.meta.env.BASE_URL}themes/${preset.name}.md`} target="_blank" rel="noreferrer">
              전체 값과 대비표 열기
            </a>
          )}
        </div>
      </details>
    </section>
  )
}

function ShadcnCommand({ theme }: { theme: Theme }) {
  const p = theme.preset
  if (!p) return null
  return (
    <section aria-labelledby="shadcn-cmd" className="grid gap-2">
      <h2 id="shadcn-cmd" className="text-xs font-medium leading-4 text-text-3">shadcn 명령으로 받기</h2>
      <CopyCommand command={`npx shadcn@~4.21 add ${SITE}/r/theme-${p.name}.json`} />
      <p className="text-xs leading-4 text-text-2 text-pretty">테마만 받아요. CSS 변수만 바뀌고 컴포넌트 파일은 그대로예요.</p>
    </section>
  )
}

// 무작위로 고르기: a fixed walk through the catalog (a step co-prime to its length visits every preset), no Math.random
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a)
const STEP = [5, 7, 11, 1].find((s) => gcd(s, PRESETS.length) === 1) ?? 1
function nextPreset(key: string) {
  const i = PRESETS.findIndex((p) => p.name === key)
  return PRESETS[(Math.max(i, 0) + STEP) % PRESETS.length].name
}

function Actions({ theme }: { theme: Theme }) {
  const { key, invalid } = useBrand()
  const command = theme.preset ? `npx pyospectui --preset ${theme.preset.name}` : `npx pyospectui --brand "${theme.seed}"`
  return (
    <section aria-labelledby="install-cmd" className="grid gap-2">
      <h2 id="install-cmd" className="text-xs font-medium leading-4 text-text-3">설치 명령</h2>
      <CopyCommand command={command} label="설치 명령 복사하기" />
      <p className="text-xs leading-4 text-text-2 text-pretty">pyospect가 있으면 테마만 바꿔요. 새 프로젝트는 컴포넌트까지 받으니 <span className="whitespace-nowrap">--overwrite</span>를 붙여요.</p>
      <div className="grid grid-cols-2 gap-2">
        <Button hierarchy="secondary" size="sm" onClick={() => setBrand(nextPreset(key))}><Shuffle aria-hidden />무작위로 고르기</Button>
        <Button hierarchy="ghost" size="sm" onClick={resetBrand} disabled={key === DEFAULT_BRAND && !invalid}>기본으로 되돌리기</Button>
      </div>
    </section>
  )
}

// ---- canvas tiles ----

function TileHead({ title, sub, className }: { title: string; sub: string; className?: string }) {
  return (
    <header className={cn("grid shrink-0 gap-1", className)}>
      <h3 className="one-line text-sm font-semibold leading-5 text-text">{title}</h3>
      <p className="one-line text-xs leading-4 text-text-2">{sub}</p>
    </header>
  )
}

// a tile is a surface on the canvas bg: no line, no shadow, radius md, dark glow. insets inside are surface-2 only
function Tile({ title, sub, className, children }: { title: string; sub: string; className?: string; children: React.ReactNode }) {
  return (
    <section data-level="surface" className={cn("grid min-h-0 min-w-0 content-start gap-3 overflow-hidden rounded-md bg-surface p-4 glow", className)}>
      <TileHead title={title} sub={sub} />
      {children}
    </section>
  )
}

const ORDERS: [string, string, string, "brand" | "ok" | "warn" | "danger" | "neutral", string][] = [
  ["ORDER-43", "카드", "새 주문", "brand", "58,000원"],
  ["ORDER-42", "포인트와 쿠폰", "확인 필요", "warn", "479,100원"],
  ["ORDER-41", "계좌이체", "결제 완료", "ok", "128,000원"],
  ["ORDER-40", "카드", "결제 실패", "danger", "32,500원"],
]
const SHARE: [string, number][] = [["쿠폰", 38], ["포인트", 24], ["카드", 18], ["계좌이체", 12], ["기타", 8]]
const CHART = ["bg-chart-1", "bg-chart-2", "bg-chart-3", "bg-chart-4", "bg-chart-5"]
const CODE = `export const total = (cart: Cart) =>
  cart.items - cart.points - cart.coupon`

// placement. <640 one column, 640-1023 two. ≥1024 a 12-column bento in two pages of six tiles (01, 02), because twelve
// tiles with all twenty components need about a quarter more room than a 1440 x 900 screen has at this density.
// 1024-1279: the page's tiles in two columns at their own height. ≥1280: fixed 12 x 12 tracks that divide the canvas height
// (min 684px: below that the canvas scrolls inside, the page never does)
const AT = {
  agent: "sm:col-span-2 lg:col-span-12 xl:col-[1/span_6] xl:row-[1/span_7]",
  chat: "lg:col-span-6 xl:col-[7/span_3] xl:row-[1/span_12]",
  checks: "lg:col-span-6 xl:col-[10/span_3] xl:row-[7/span_6]",
  diff: "lg:col-span-6 xl:col-[1/span_3] xl:row-[8/span_5]",
  code: "lg:col-span-6 xl:col-[4/span_3] xl:row-[8/span_5]",
  workspace: "lg:col-span-6 xl:col-[10/span_3] xl:row-[1/span_6]",
  settings: "lg:col-span-6 xl:col-[1/span_4] xl:row-[1/span_6]",
  orders: "sm:col-span-2 lg:col-span-12 xl:col-[5/span_8] xl:row-[1/span_6]",
  metrics: "lg:col-span-6 xl:col-[1/span_4] xl:row-[7/span_6]",
  tasks: "lg:col-span-6 xl:col-[5/span_4] xl:row-[7/span_6]",
  empty: "lg:col-span-6 xl:col-[9/span_4] xl:row-[7/span_3]",
  summary: "lg:col-span-6 xl:col-[9/span_4] xl:row-[10/span_3]",
}
const PAGES = ["에이전트", "제품 화면"]

function Canvas({ mode, page, theme }: { mode: Mode; page: number; theme: Theme }) {
  const [task, setTask] = useState(0)
  const id = useId()
  const vars = { ...varStyle(theme.vars[mode]), colorScheme: mode }
  // a tile of the other page leaves the desktop canvas; below 1024 every tile shows
  const on = (p: number, at: string) => cn(at, p !== page && "lg:hidden")
  return (
    // the theme's own variables sit on the canvas, so it keeps its mode whatever the site's is; stage lg 20 = tile md 12 + 8
    <section aria-label="미리보기" className={cn("min-w-0 rounded-lg bg-bg p-2 text-text lg:col-start-2 lg:row-[1/-1] lg:min-h-0 lg:overflow-y-auto", mode === "dark" && "dark")} style={vars}>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-flow-row-dense lg:grid-cols-12 xl:h-full xl:min-h-[684px] xl:grid-rows-12">
        <Tile title="에이전트 작업" sub="ORDER-42 쿠폰 적용 순서를 고치고 있어요" className={on(0, AT.agent)}>
          <Thinking live open title="생각하는 중이에요" steps={["쿠폰과 포인트 중 무엇이 먼저 빠지는지 볼게요.", "영향받는 결제 화면을 확인할게요."]} />
          <StepsLegend />
          <Steps className="gap-3 lg:grid-cols-3">
            <Step index={1} who="agent" done title="맥락 모으기" text="이전 결정을 불러왔어요." />
            <Step index={2} who="agent" title="변경안 쓰기" text="코드를 고치고 있어요." />
            <Step index={3} who="human" title="검토와 확정" text="확정은 사람이 해요." />
          </Steps>
          <DecisionCard title="ORDER-42 변경안" proceedLabel="적용하기" />
        </Tile>

        {/* the newest message sits on the input; older ones leave at the top when the tile is short */}
        <Tile title="채팅" sub="에이전트와 나눈 대화예요" className={on(0, cn("grid-rows-[auto_minmax(0,1fr)_auto] content-stretch", AT.chat))}>
          <Chat className="min-h-0 content-end overflow-hidden">
            <Bubble who="human">ORDER-42 변경안 작성해 줘.</Bubble>
            <Bubble who="agent">쿠폰이 포인트보다 먼저 빠지고 있어요. 순서를 바꿀까요?</Bubble>
            <Bubble who="human">응, 포인트가 먼저 빠지게 바꿔 줘.</Bubble>
            <Bubble who="agent">바꿨어요. 결제 금액이 479,100원으로 같은지 확인해 주세요.</Bubble>
            <ChatTime>방금</ChatTime>
          </Chat>
          <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <Input aria-label="메시지" placeholder="메시지를 적어 주세요" />
            <Button type="submit">보내기</Button>
          </form>
        </Tile>

        <Tile title="검증" sub="에이전트가 돌린 검사예요" className={on(0, AT.checks)}>
          <div className="grid gap-2">
            <ValidationCard title="쿠폰 순서" reason="포인트가 먼저 빠져요" status="ok" />
            <ValidationCard title="환불 문구" reason="환불 화면이 예전 순서를 말해요" status="warn" />
            <ValidationCard title="영수증 합계" reason="합계 테스트 하나가 실패했어요" status="danger" />
          </div>
        </Tile>

        <Tile title="변경 사항" sub="에이전트가 고친 파일이에요" className={on(0, AT.diff)}>
          <Diff path="src/cart/applyCoupon.ts" added={2} removed={1}>
            <DiffLine kind="del">applyCoupon(cart)</DiffLine>
            <DiffLine kind="add">applyPoints(cart)</DiffLine>
            <DiffLine kind="add">applyCoupon(cart)</DiffLine>
          </Diff>
        </Tile>

        <Tile title="코드" sub="고친 계산식이에요" className={on(0, AT.code)}>
          <CodeBlock code={CODE} language="ts" />
        </Tile>

        <Tile title="작업 공간" sub="연결한 도구와 스펙 버전이에요" className={on(0, AT.workspace)}>
          <ConnectionList>
            <Connection name="Figma" connected />
            <Connection name="Git" connected={false} action={<Button hierarchy="ghost" size="sm">연결하기</Button>} />
          </ConnectionList>
          <Versions>
            <Version label="v2" meta="최신" note="포인트를 먼저 빼요" current />
            <Version label="v1" meta="어제" note="처음 만든 변경안이에요" />
          </Versions>
        </Tile>

        <Tile title="설정" sub="바꾸면 바로 적용돼요" className={on(1, AT.settings)}>
          <div className="grid gap-3">
            <Control><Label htmlFor={`${id}-ai`}>AI 추천 켜기</Label><Switch id={`${id}-ai`} defaultChecked /></Control>
            <Control><Label htmlFor={`${id}-mail`}>변경 알림</Label><Switch id={`${id}-mail`} /></Control>
          </div>
          <Field>
            <Label htmlFor={`${id}-to`}>알림 받을 이메일</Label>
            <Input id={`${id}-to`} defaultValue="hello@example" aria-invalid="true" aria-describedby={`${id}-to-help`} />
            <Help id={`${id}-to-help`} error>@ 뒤에 도메인이 빠졌어요. 예: example.com</Help>
          </Field>
          <div className="flex flex-wrap gap-2">
            <Button size="sm">저장하기</Button>
            <Button size="sm" hierarchy="secondary">되돌리기</Button>
            <Dialog>
              <DialogTrigger asChild><Button size="sm" hierarchy="ghost">초기화하기</Button></DialogTrigger>
              <DialogContent className={cn(mode === "dark" && "dark")} style={vars}>
                <DialogTitle>설정을 처음으로 되돌릴까요?</DialogTitle>
                <DialogDescription>AI 추천과 변경 알림이 기본값으로 돌아가요. 되돌린 뒤에는 다시 켜야 해요.</DialogDescription>
                <DialogActions>
                  <DialogClose asChild><Button hierarchy="ghost">나중에 하기</Button></DialogClose>
                  <DialogClose asChild><Button>되돌리기</Button></DialogClose>
                </DialogActions>
              </DialogContent>
            </Dialog>
          </div>
        </Tile>

        {/* Table, List, Card and Empty are surfaces themselves: they are the tile, never inside one */}
        <TableWrap className={on(1, cn("flex min-h-0 min-w-0 flex-col", AT.orders))}>
          <TileHead title="주문" sub="이번 주 결제 내역이에요" className="p-4 pb-3" />
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader className="first:rounded-tl-none">주문</TableHeader><TableHeader>결제 수단</TableHeader><TableHeader>상태</TableHeader>
                <TableHeader num className="last:rounded-tr-none">금액</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {ORDERS.map(([no, via, label, tone, amount]) => (
                <TableRow key={no}>
                  <TableCell className="font-medium">{no}</TableCell>
                  <TableCell className="text-text-2">{via}</TableCell>
                  <TableCell><Tag tone={tone}>{label}</Tag></TableCell>
                  <TableCell num>{amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableWrap>

        <Tile title="지표" sub="이번 주 결제 수단 비중이에요" className={on(1, AT.metrics)}>
          <div className="flex h-3 gap-px overflow-hidden rounded-full" role="img" aria-label={SHARE.map(([k, v]) => `${k} ${v}%`).join(", ")}>
            {SHARE.map(([k, v], i) => <span key={k} className={CHART[i]} style={{ width: `${v}%` }} />)}
          </div>
          <ul className="flex flex-wrap gap-x-4 gap-y-1">
            {SHARE.map(([k, v], i) => (
              <li key={k} className="flex items-center gap-1 text-xs leading-4 text-text-2">
                <span className={cn("size-2 shrink-0 rounded-full", CHART[i])} aria-hidden />{k}<span className="tabular text-text">{v}%</span>
              </li>
            ))}
          </ul>
          <div className="grid gap-2">
            <div className="flex justify-between gap-2 text-xs leading-4"><span className="text-text-2">이번 달 목표</span><span className="font-medium tabular text-text">72%</span></div>
            <div className="h-2 overflow-hidden rounded-full bg-surface-2" role="progressbar" aria-label="이번 달 목표" aria-valuenow={72} aria-valuemin={0} aria-valuemax={100}>
              <div className="h-full w-[72%] rounded-full bg-brand-graphic" />
            </div>
          </div>
        </Tile>

        <List aria-label="일감" className={on(1, cn("min-h-0 min-w-0 content-start overflow-hidden", AT.tasks))}>
          <TileHead title="일감" sub="고르면 맥락을 불러와요" className="px-3 pb-2 pt-3" />
          {[["장바구니 쿠폰 적용 순서 정리", "TASK-101"], ["배송지 저장 화면", "TASK-102"], ["재고 알림 배너", "TASK-103"]].map(([t, m], i) => (
            <ListItem key={m} meta={m} selected={task === i} onClick={() => setTask(i)}>{t}</ListItem>
          ))}
        </List>

        <Empty
          title="아직 받은 리뷰가 없어요"
          text="공유하면 리뷰가 여기에 모여요."
          action={<Button size="sm" hierarchy="secondary">리뷰 요청하기</Button>}
          className={on(1, cn("min-h-0 min-w-0 content-start overflow-hidden", AT.empty))}
        />

        <Card aria-busy="true" className={on(1, cn("min-h-0", AT.summary))}>
          <CardTitle>ORDER-42 요약</CardTitle>
          <CardText className="one-line">에이전트가 요약을 만들고 있어요.</CardText>
          <SkeletonText lines={2} />
        </Card>
      </div>
    </section>
  )
}

// 01 | 02: which six tiles the desktop canvas shows (the numbers are the label on screen, the names go to screen readers)
function PageToggle({ page, onPage }: { page: number; onPage: (p: number) => void }) {
  return (
    <div role="group" aria-label="미리보기 화면" className="hidden h-11 shrink-0 gap-1 rounded-full bg-surface-2 p-1 lg:flex">
      {PAGES.map((label, i) => (
        <button
          key={label}
          type="button"
          title={label}
          aria-label={`${String(i + 1).padStart(2, "0")} ${label}`}
          aria-pressed={page === i}
          onClick={() => onPage(i)}
          className="w-10 cursor-pointer rounded-full text-xs font-medium leading-4 tabular text-text-2 transition-colors hover:text-text aria-pressed:bg-brand-tint aria-pressed:text-brand-ink"
        >
          {String(i + 1).padStart(2, "0")}
        </button>
      ))}
    </div>
  )
}

export function Themes() {
  const { theme } = useBrand()
  const [mode, setMode] = useState<Mode>(() => (document.documentElement.classList.contains("dark") ? "dark" : "light"))
  const [page, setPage] = useState(0)
  // the left column: header, the swatch bar (sticky under the nav below 1024), details that scroll inside, actions pinned at the bottom
  return (
    <div className="mx-auto grid gap-4 px-4 pb-16 sm:px-6 lg:h-[calc(100dvh-64px)] lg:grid-cols-[256px_minmax(0,1fr)] lg:grid-rows-[auto_auto_minmax(0,1fr)_auto] lg:gap-x-6 lg:gap-y-4 lg:overflow-hidden lg:pb-4 lg:pt-2">
      <header className="grid gap-1 pt-4 lg:col-start-1 lg:pt-0">
        <p className="text-xs font-medium leading-4 text-text-3">테마</p>
        <h1 className="one-line text-base font-semibold leading-6 text-text">브랜드 색 하나로 만드는 테마</h1>
        <p className="text-xs leading-4 text-text-2 text-pretty">색을 고르면 규칙이 나머지 색을 만들고 검사해요. 사이트 전체가 바로 바뀌고 주소에 남아요.</p>
      </header>

      <div className="sticky top-16 z-30 -mx-4 flex items-center gap-2 bg-bg/90 px-4 py-2 backdrop-blur sm:-mx-6 sm:px-6 lg:static lg:col-start-1 lg:mx-0 lg:grid lg:gap-3 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
        <Swatches className="min-w-0 flex-1 flex-nowrap overflow-x-auto [scrollbar-width:none] lg:grid lg:grid-cols-4 lg:overflow-visible" />
        <div className="flex shrink-0 gap-2">
          <ModeToggle mode={mode} onMode={setMode} className="w-36 lg:w-auto lg:flex-1" />
          <PageToggle page={page} onPage={setPage} />
        </div>
      </div>

      <div className="grid content-start gap-6 lg:col-start-1 lg:min-h-0 lg:overflow-y-auto lg:[scrollbar-width:thin]">
        <Picker />
        <About theme={theme} />
        <ShadcnCommand theme={theme} />
      </div>

      <div className="lg:col-start-1">
        <Actions theme={theme} />
      </div>

      <Canvas mode={mode} page={page} theme={theme} />
    </div>
  )
}
