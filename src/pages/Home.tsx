import { useState } from "react"
import { REGISTRY_BASE } from "@/lib/theme"
import { Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input, Field, Label, Help } from "@/components/ui/input"
import { Switch, Control } from "@/components/ui/switch"
import { Card, CardMedia, CardBody, CardTitle, CardText } from "@/components/ui/card"
import { Tag } from "@/components/ui/tag"
import { Dialog, DialogTrigger, DialogClose, DialogContent, DialogTitle, DialogDescription, DialogNote, DialogActions } from "@/components/ui/dialog"
import { List, ListItem } from "@/components/ui/list"
import { TableWrap, Table, TableHead, TableBody, TableRow, TableHeader, TableCell, TableHint } from "@/components/ui/table"
import { SkeletonText } from "@/components/ui/skeleton"
import { Empty } from "@/components/ui/empty"
import { Thinking } from "@/components/ai/thinking"
import { ValidationCard } from "@/components/ai/validation-card"
import { Steps, Step, StepsLegend } from "@/components/ai/steps"
import { DecisionCard } from "@/components/ai/decision-card"
import { Diff, DiffLine } from "@/components/ai/diff"
import concentric from "../site/concentric.module.css"
import { Versions, Version } from "@/components/ai/versions"
import { Chat, Bubble, ChatTime } from "@/components/ai/chat"
import { ConnectionList, Connection } from "@/components/ai/connection"

import { CopyCommand } from "@/components/ui/copy-command"
import { href } from "@/lib/router"
import { PRESETS } from "@/lib/theme"
import DOC_CATALOG from "@/docs/catalog.json"

function Section({ id, title, sub, children }: { id: string; title: string; sub: string; children: React.ReactNode }) {
  return (
    <section id={id} className="grid scroll-mt-[116px] gap-6 px-6 py-[var(--pyo-section-gap)] sm:scroll-mt-24 sm:px-12">
      <h2 className="text-[23px] font-medium leading-[1.5] tracking-[-0.045em]">
        {title}
        <small className="brand-copy mt-3 block font-medium text-text-2 text-pretty">{sub}</small>
      </h2>
      {children}
    </section>
  )
}

function Panel({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div data-level="surface" className={concentric.insetEnd + " grid content-start gap-[var(--pyo-card-gap)] rounded-md bg-surface p-[var(--pyo-card-padding)] glow " + className}>
      <h4 className="text-sm font-medium leading-[1.5] text-text [overflow-wrap:anywhere]">{title}</h4>
      {children}
    </div>
  )
}

function Block({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={"grid content-start gap-6 " + className}>
      <h4 className="text-sm font-medium leading-[1.5] text-text [overflow-wrap:anywhere]">{title}</h4>
      {children}
    </div>
  )
}

// hero copy: the line may only break after a comma or a period, so each clause is one unbreakable segment
const HERO = [
  ["저는 생각한 것을 직접 만드는 사람이에요. ", "화면으로, ", "문장으로, ", "코드로요. ", "조용한 밤에 화면 하나를 붙잡고 여백과 문장의 온도를 다듬을 때 가장 몰입하고, ", "그렇게 만든 것이 누군가의 손에 닿아 반응으로 돌아올 때 의미를 느껴요."],
  ["이 시스템은 그 습관을 AI에게 건네주려고 만들었어요. ", "사람이 결정할 일과 시스템이 처리할 일을 나누고, ", "쓰는 사람이 덜 불안하게 다음 행동을 고를 수 있도록 다듬는 것. ", "기술이 삶에 닿는 마지막 한 뼘을, ", "누구나 설치 한 줄로 시작할 수 있으면 좋겠어요."],
]

const INSTALL: [string, string, string][] = [
  ["1. 새 프로젝트", "shadcn이 Vite와 Tailwind까지 만들어 줘요.", "npx shadcn@~4.21 init -t vite -b radix -p nova -y --no-monorepo -n my-app"],
  ["2. 전부 받기", "테마와 컴포넌트, 배경 실험실을 함께 받아요. 첫 설치에는 --overwrite를 붙여요.", "cd my-app && npx pyospectui --overwrite"],
  ["3. 실행", "화면을 만들면 돼요.", "npm run dev"],
]
const POSITIONING = "pyospectui는 한국어 제품을 만드는 팀을 위한 디자인 시스템이에요. neutral 테마로 시작하고, 필요하면 브랜드 색 하나에서 나머지 색을 만들고 검사해요."
const RULES: [string, string][] = [
  ["Grid", "간격은 4px 단위를 기준으로 해요. 본문 행간과 대화의 15px 글자와 18px 간격은 읽는 흐름에 맞춘 예외예요."],
  ["Type", "영문과 한글 모두 Pretendard Medium 500이에요. 제목은 36px, 행간 1.2, 자간 -0.05em이며 본문은 읽기 편한 중간 회색이에요."],
  ["Text", "긴 제목과 설명은 줄을 바꿔 읽을 수 있어요. 버튼과 제한된 메타데이터만 말줄임표를 쓰고, 라벨과 컨트롤은 함께 보여요."],
  ["Writing", "친절하게 풀어쓴 해요체예요. 명사로 끝내지 않고 영어 직역을 쓰지 않아요. 버튼은 동사예요."],
  ["Color", "무채색 면 4단계에 브랜드 색 하나, 상태색 셋이에요. 브랜드 색 하나에서 규칙이 나머지를 만들고 대비를 검사해요. 색 있는 pill은 단색 fill에 그 fill의 글자색이에요."],
  ["Surface", "영역은 톤 차이로 나눠요. 일반 테두리는 없거나 10% 투명도예요. 키보드 focus와 오류, 상태 표시는 선명하게 보여요."],
  ["Depth", "bg 위에 surface, 2단계까지예요. 카드 속 카드는 없어요."],
  ["Radius", "카드와 입력창은 24px로 통일해요. 버튼은 둥근 pill, 대화 말풍선은 22px예요."],
  ["Motion", "120ms ease-out 하나예요. 색과 투명도만 움직이고, 동작 줄이기 설정이면 멈춰요."],
  ["A11y", "본문과 상태색 대비를 검사해요. 키보드로 컨트롤에 닿고 focus는 brand-ink 2px 선이에요."],
  ["AI", "모든 컴포넌트에 Naming, Variant, Token, Structure, Usage Rule 다섯 줄이 있어요. 에이전트가 처리한 것과 사람이 결정할 것은 항상 모양이 다르고, brand 채움은 에이전트 쪽이에요."],
]

const rows = [
  ["2026-03-02", "서울역", "천안아산역", "고속철도", "96", "14,100원", "개인카드", "hint"],
  ["2026-03-02", "천안아산역", "세종청사", "택시", "24", "31,200원", "법인카드", "receipt"],
  ["2026-03-03", "세종청사", "대전역", "시외버스", "36", "4,800원", "법인카드", "file"],
  ["2026-03-03", "대전역", "서울역", "고속철도", "140", "23,700원", "현금", "receipt"],
]

export function Home() {
  const [selected, setSelected] = useState(0)
  return (
    <div className="mx-auto grid max-w-[1160px] gap-6 px-4 pb-14 sm:px-6">
      <header className="grid justify-items-center gap-7 section-space px-6 text-center sm:px-12">
        <div className="text-xs font-medium leading-4 tracking-wide text-text-3">생각을 만들고 다듬어요</div>
        <h1 className="brand-heading font-medium tracking-normal">pyospectui</h1>
        <div className="brand-body grid max-w-[640px] gap-7 text-text-2">
          {HERO.map((para, i) => (
            <p key={i}>
              {para.map((seg, j) => (
                <span key={j}>
                  <span className="inline-block">{seg.trim()}</span>{" "}
                </span>
              ))}
            </p>
          ))}
        </div>
        <p className="text-xs leading-4 text-text-3">고경표, Product Designer</p>
        <CopyCommand command="npx pyospectui" size="lg" className="mt-2 w-full max-w-[400px]" />
      </header>

      <Section id="install" title="시작하기" sub="Node.js만 있으면 돼요. 새 프로젝트를 만들고, 전부 받고, 화면을 만들면 끝이에요.">
        <div className="grid gap-6">
          <p className="brand-body text-text text-pretty">{POSITIONING}</p>
          {INSTALL.map(([title, text, cmd]) => (
            <div key={cmd} data-level="surface" className={concentric.insetEnd + " grid gap-5 rounded-md bg-surface p-[var(--pyo-card-padding)] glow"}>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h4 className="text-sm font-medium leading-[1.5] text-text [overflow-wrap:anywhere]">{title}</h4>
                <p className="brand-copy text-text-2">{text}</p>
              </div>
              <CopyCommand command={cmd} />
            </div>
          ))}
          <div data-level="surface" className="grid gap-5 rounded-md bg-surface p-[var(--pyo-card-padding)] glow">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h4 className="text-sm font-medium leading-[1.5] text-text [overflow-wrap:anywhere]">내 브랜드 색으로</h4>
              <p className="brand-copy text-text-2">2번 대신 써요. 규칙이 나머지 색을 만들고 대비를 검사한 뒤에 설치해요.</p>
            </div>
            <CopyCommand command={'cd my-app && npx pyospectui --brand "#3366FF" --overwrite'} />
            <p className="brand-copy text-text-2 text-pretty">미리 만든 프리셋 {PRESETS.length}개와 미리보기는 <a href={href("/themes")} className="font-medium text-brand-ink underline underline-offset-4">테마 페이지</a>에 있어요. 이미 설치한 프로젝트에서 이 명령을 쓰면 색 변수만 바뀌어요.</p>
          </div>
          <p className="brand-copy text-text-2 text-pretty">몇 개만 고르려면 <code className="font-mono text-xs">npx pyospectui button card</code>처럼 이름을 붙여요. shadcn 명령을 그대로 쓰고 싶으면 레지스트리 주소는 <code className="font-mono text-xs">{REGISTRY_BASE}pyospect.json</code>이에요.</p>
        </div>
      </Section>

      <Section id="components" title="컴포넌트" sub="기본 컴포넌트예요. 각 파일 맨 위에 Naming, Variant, Token, Structure, Usage Rule 다섯 줄이 있어요. shadcn 표준 변수도 전부 pyospect 토큰에 연결돼 있어서 shadcn 컴포넌트를 같이 설치해도 같은 색과 radius를 써요. 모양 규칙까지 따라오지는 않아서 기본 Card는 테두리와 그림자를 그대로 가져요.">
        <div className="flex flex-wrap gap-2">
          {DOC_CATALOG.map((d) => (
            <a key={d.slug} href={href(`/docs/${d.slug}`)} className="rounded-full bg-surface px-3 py-2 text-sm font-medium leading-5 text-text-2 glow transition-colors hover:bg-surface-2 hover:text-text">{d.title}</a>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-2">
          <Panel title="Button: primary, secondary, ghost, tint">
            <div className="flex flex-wrap items-center gap-2">
              <Button>저장하기</Button>
              <Button hierarchy="secondary">되돌리기</Button>
              <Button hierarchy="tint">검토하기</Button>
              <Button hierarchy="ghost">더 보기</Button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm">작게</Button>
              <Button>기본</Button>
              <Button size="lg">크게</Button>
              <Button disabled>비활성</Button>
            </div>
          </Panel>
          <Panel title="Input: 부드러운 경계와 선명한 focus">
            <Field>
              <Label htmlFor="i1">프로젝트 이름</Label>
              <Input id="i1" placeholder="예: 봄 시즌 프로모션" aria-describedby="i1h" />
              <Help id="i1h">팀원에게 보이는 이름이에요.</Help>
            </Field>
            <Field>
              <Label htmlFor="i2">이메일</Label>
              <Input id="i2" defaultValue="hello@example" aria-invalid="true" aria-describedby="i2h" />
              <Help id="i2h" error>@ 뒤에 도메인이 빠졌어요. 예: example.com</Help>
            </Field>
          </Panel>
          <Panel title="Switch: 트랙 28, 핸들 20, padding 4">
            <Control><Label htmlFor="s1">AI 추천 켜기</Label><Switch id="s1" defaultChecked /></Control>
            <Control><Label htmlFor="s2">알림</Label><Switch id="s2" /></Control>
          </Panel>
          <Block title="List: hover와 선택은 row 배경으로만">
            <List aria-label="일감">
              {[["장바구니 쿠폰 적용 순서 정리", "TASK-101"], ["배송지 저장 화면", "TASK-102"], ["재고 알림 배너", "TASK-103"]].map(([t, m], i) => (
                <ListItem key={m} meta={m} selected={selected === i} onClick={() => setSelected(i)}>{t}</ListItem>
              ))}
            </List>
          </Block>
          <Card media>
            <CardMedia />
            <CardBody>
              <CardTitle>이미지 카드</CardTitle>
              <CardText>카드의 바깥 코너는 24px예요. 이미지는 4px 여백에 맞춰 안쪽 코너를 20px로 줄여요.</CardText>
              <div className="flex flex-wrap gap-2"><Tag tone="ok">통과</Tag><Tag>Jira</Tag></div>
            </CardBody>
          </Card>
          <Card selected>
            <CardTitle>선택된 카드</CardTitle>
            <CardText>의미 있는 상태라서 brand-ink 1px 선을 써요. tint 배경과 같이 가요.</CardText>
            <div className="flex flex-wrap gap-2"><Tag tone="brand">추천</Tag></div>
          </Card>
          <Card>
            <CardTitle>기본 카드</CardTitle>
            <CardText>선도 그림자도 없어요. surface 톤 하나로 bg 위에 놓여요.</CardText>
            <div className="flex flex-wrap gap-2">
              <Button hierarchy="secondary" size="sm">검토하기</Button>
              <Dialog>
                <DialogTrigger asChild><Button size="sm">스펙 작성하기</Button></DialogTrigger>
                <DialogContent>
                  <DialogTitle>스펙을 작성할까요?</DialogTitle>
                  <DialogDescription>ORDER-42 변경안을 기준으로 Spec 초안을 만들어요. 만든 뒤에 블록 단위로 고칠 수 있어요.</DialogDescription>
                  <DialogNote>Dialog는 그림자가 허용되는 유일한 곳이에요. 다크에서는 그림자 대신 glow예요.</DialogNote>
                  <DialogActions>
                    <DialogClose asChild><Button hierarchy="ghost">나중에 하기</Button></DialogClose>
                    <DialogClose asChild><Button>작성하기</Button></DialogClose>
                  </DialogActions>
                </DialogContent>
              </Dialog>
            </div>
          </Card>
          <Panel title="Skeleton: 회색 바, 일러스트 없음">
            <SkeletonText />
          </Panel>
          <Empty title="아직 일감이 없어요" text="Jira에서 일감을 가져오면 여기에 나타나요." action={<Button size="sm">Jira 연결하기</Button>} />
          <Block title="Table: 숫자는 오른쪽 정렬에 tabular, 행 사이에 선이 없어요" className="col-span-full">
            <TableWrap>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader>날짜</TableHeader><TableHeader>출발지</TableHeader><TableHeader>도착지</TableHeader><TableHeader>교통편</TableHeader>
                    <TableHeader num>거리(km)</TableHeader><TableHeader num>금액</TableHeader><TableHeader>결제수단</TableHeader><TableHeader>안내</TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((r) => (
                    <TableRow key={r[0] + r[1]}>
                      <TableCell>{r[0]}</TableCell><TableCell>{r[1]}</TableCell><TableCell>{r[2]}</TableCell><TableCell>{r[3]}</TableCell>
                      <TableCell num>{r[4]}</TableCell><TableCell num>{r[5]}</TableCell>
                      <TableCell><Tag tone={r[6] === "법인카드" ? "brand" : "neutral"}>{r[6]}</Tag></TableCell>
                      <TableCell>
                        {r[7] === "hint" && <TableHint><Info />정산 후 급여계좌로 입금돼요</TableHint>}
                        {r[7] === "receipt" && <Button hierarchy="secondary" size="sm">증빙 추가하기</Button>}
                        {r[7] === "file" && <TableHint>receipt_0303.jpg</TableHint>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableWrap>
          </Block>
        </div>
      </Section>

      <Section id="ai" title="AI 협업 패턴" sub="에이전트와 함께 일하는 화면에 반복해서 쓰는 패턴이에요. shadcn에는 없는, 이 시스템만의 패턴이에요.">
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-2">
          <Panel title="Thinking: 접히는 생각 블록">
            <Thinking
              open
              title="25초 동안 생각했어요"
              steps={[
                "이 티켓이 단순 문구 수정인지, 조건 분기나 상태 처리까지 바뀌는지부터 나눠서 볼게요.",
                "영향받는 화면과 기능이 어디까지인지 확인하고, 값이 어디서 만들어져 어떤 흐름으로 전달되는지 따라가 볼게요.",
              ]}
            />
          </Panel>
          <Panel title="Connection: 도구 연결 상태">
            <ConnectionList>
              <Connection name="Figma" connected />
              <Connection name="Jira" connected />
              <Connection name="Git" connected={false} action={<Button hierarchy="ghost" size="sm">연결하기</Button>} />
            </ConnectionList>
          </Panel>
          <Panel title="Validation: 검증 결과 카드">
            <div className="grid gap-2">
              <ValidationCard title="Component Usage" reason="기존 Button과 Filter 컴포넌트를 재사용했어요" status="ok" />
              <ValidationCard title="Semantic Token" reason="raw 색상 값 두 곳을 썼어요" status="danger" />
              <ValidationCard title="Layout Pattern" reason="목록 필터 위치가 규칙과 달라요" status="warn" />
            </div>
          </Panel>
          <Panel title="Decision: 다음 단계로 가기 전에 묻기">
            <DecisionCard title="ORDER-42 변경안" proceedLabel="스펙 작성하기" />
          </Panel>
          <Panel title="Diff: 코드 변경">
            <Diff path="src/cart/applyCoupon.ts" added={2} removed={1}>
              <DiffLine kind="del">cart.clear();</DiffLine>
              <DiffLine kind="add">cart.clearPayment();</DiffLine>
              <DiffLine kind="add">cart.recalculate({"{ coupon }"});</DiffLine>
            </Diff>
          </Panel>
          <Panel title="Versions: 현재 버전만 tint">
            <Versions>
              <Version label="v2" meta="최신" note="검증 규칙과 감사 로그를 추가했어요" current />
              <Version label="v1" meta="어제" note="처음 작성한 스펙이에요" />
            </Versions>
          </Panel>
          <Panel title="Chat: 사람은 brand tint, 에이전트는 면" className="col-span-full">
            <Chat>
              <Bubble who="human">ORDER-42 변경안 작성해줘.</Bubble>
              <Bubble who="agent">ORDER-42 분석이 끝났어요. 아래 내용을 검토해 주세요. 고칠 게 있으면 이 채팅에서 바로 말해 주시면 돼요.</Bubble>
              <ChatTime>방금</ChatTime>
            </Chat>
          </Panel>
          <Panel title="Steps: 채운 원은 에이전트, 점선 원은 사람" className="col-span-full">
            <StepsLegend />
            <Steps>
              <Step index={1} who="agent" done title="온보딩" text="역할과 프로젝트, 도구 연결을 확인하고 빠진 조건을 먼저 물어봐요." />
              <Step index={2} who="agent" title="일감과 맥락" text="일감을 고르면 목적과 업무 규칙, 이전 결정을 같이 불러와요." />
              <Step index={3} who="human" title="생성과 검토" text="핵심 화면부터 만들어 보여주고, 확정과 수정은 사람이 결정해요." />
              <Step index={4} who="agent" title="버전과 충돌" text="변경은 버전으로 남기고, 겹치면 두 의도를 나란히 보여줘요." />
            </Steps>
          </Panel>
        </div>
      </Section>
      <Section id="rules" title="규칙" sub="AI에게 그대로 주는 규칙이에요. 전체는 TASTE.md에 있어요.">
        <ul className="grid gap-0">
          {RULES.map(([k, v]) => (
            <li key={k} className="brand-copy grid gap-2 py-4 text-text-2 text-pretty sm:grid-cols-[112px_1fr] sm:gap-6">
              <b className="font-medium text-text">{k}</b><span>{v}</span>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-2">
          <Button hierarchy="secondary" size="sm" onClick={() => (location.hash = "/docs/button")}>컴포넌트 문서 보기</Button>
          <Button hierarchy="ghost" size="sm" onClick={() => window.open(`${import.meta.env.BASE_URL}TASTE.md`, "_blank", "noopener,noreferrer")}>TASTE.md</Button>
          <Button hierarchy="ghost" size="sm" onClick={() => window.open(`${import.meta.env.BASE_URL}llms.txt`, "_blank", "noopener,noreferrer")}>llms.txt</Button>
        </div>
      </Section>
    </div>
  )
}
