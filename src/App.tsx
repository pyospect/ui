import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input, Field, Label, Help } from "@/components/ui/input"
import { Switch, Control } from "@/components/ui/switch"
import { Card, CardMedia, CardBody, CardTitle, CardText } from "@/components/ui/card"
import { Tag } from "@/components/ui/tag"
import { Dialog, DialogTrigger, DialogClose, DialogContent, DialogTitle, DialogDescription, DialogNote, DialogActions } from "@/components/ui/dialog"
import { Thinking } from "@/components/ai/thinking"
import { ValidationCard } from "@/components/ai/validation-card"
import { Steps, Step, StepsLegend } from "@/components/ai/steps"
import { DecisionCard } from "@/components/ai/decision-card"

function Section({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-6">
      <h2 className="text-xl font-semibold leading-7">
        {title}
        <small className="mt-1 block text-sm font-normal leading-5 text-text-2 text-pretty">{sub}</small>
      </h2>
      {children}
    </section>
  )
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div data-level="surface" className="grid content-start gap-4 rounded-md bg-surface p-5 glow">
      <h4 className="one-line text-sm font-semibold leading-5 text-text">{title}</h4>
      {children}
    </div>
  )
}

export default function App() {
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem("pyo-theme") === "dark" } catch { return false }
  })
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark)
    try { localStorage.setItem("pyo-theme", dark ? "dark" : "light") } catch {}
  }, [dark])

  return (
    <div className="mx-auto grid max-w-[1040px] gap-16 px-6 py-6 pb-16">
      <div className="flex justify-end">
        <Control className="shrink-0">
          <Label htmlFor="theme">다크 모드</Label>
          <Switch id="theme" checked={dark} onCheckedChange={setDark} />
        </Control>
      </div>

      <header className="grid justify-items-center py-8 text-center">
        <div className="text-xs font-medium leading-4 tracking-wide text-text-3">Work. Build. Taste.</div>
        <h1 className="mt-1 text-[40px] font-semibold leading-12 tracking-tight">pyospectui</h1>
        <p className="mt-3 max-w-[720px] text-text-2 text-pretty">
          저는 생각한 것을 직접 만드는 사람이에요. 화면으로, 문장으로, 코드로요. 이 시스템은 그 습관을 AI에게 건네주려고 만들었어요.
          사람이 결정할 일과 시스템이 처리할 일을 나누고, 쓰는 사람이 덜 불안하게 다음 행동을 고를 수 있도록 다듬는 것.
        </p>
        <p className="mt-6 max-w-[720px] text-sm leading-5 text-text-3">
          <code className="font-mono text-xs">npx shadcn add @pyospect/button</code>
        </p>
      </header>

      <Section title="Components" sub="기본 컴포넌트예요. 각 파일 맨 위에 Naming, Variant, Token, Structure, Usage Rule 다섯 줄이 있어요.">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
          <Panel title="Button: primary, secondary, ghost, tint">
            <div className="flex flex-wrap items-center gap-2">
              <Button>저장하기</Button>
              <Button hierarchy="secondary">취소</Button>
              <Button hierarchy="ghost">더 보기</Button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm">작게</Button>
              <Button>기본</Button>
              <Button size="lg">크게</Button>
              <Button disabled>비활성</Button>
            </div>
          </Panel>
          <Panel title="Input: 면 위에 의미 있는 선 하나">
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
          <Card media>
            <CardMedia />
            <CardBody>
              <CardTitle>이미지 카드</CardTitle>
              <CardText>카드 padding 4, radius 12예요. 이미지 radius는 12에서 4를 뺀 8이에요.</CardText>
              <div className="flex flex-wrap gap-2"><Tag tone="ok">통과</Tag><Tag>Jira</Tag></div>
            </CardBody>
          </Card>
          <Card selected>
            <CardTitle>선택된 카드</CardTitle>
            <CardText>의미 있는 상태라서 accent 1px 선을 써요. tint 배경과 같이 가요.</CardText>
            <div className="flex flex-wrap gap-2"><Tag tone="accent">추천</Tag></div>
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
                    <DialogClose asChild><Button hierarchy="ghost">취소</Button></DialogClose>
                    <DialogClose asChild><Button>작성하기</Button></DialogClose>
                  </DialogActions>
                </DialogContent>
              </Dialog>
            </div>
          </Card>
        </div>
      </Section>

      <Section title="AI 협업 패턴" sub="에이전트와 함께 일하는 화면에 반복해서 나오는 조각들이에요.">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-4">
          <Panel title="Thinking">
            <Thinking
              live
              title="25초 동안 생각했어요"
              steps={[
                "이 티켓이 단순 문구 수정인지, 조건 분기나 상태 처리까지 바뀌는지부터 나눠서 볼게요.",
                "영향받는 화면과 기능이 어디까지인지 확인하고, 값이 어디서 만들어져 어떤 흐름으로 전달되는지 따라가 볼게요.",
              ]}
            />
          </Panel>
          <Panel title="Validation">
            <div className="grid gap-2">
              <ValidationCard title="Component Usage" reason="기존 Button과 Filter 컴포넌트를 재사용했어요" status="ok" />
              <ValidationCard title="Semantic Token" reason="raw 색상 값 두 곳을 썼어요" status="danger" />
              <ValidationCard title="Layout Pattern" reason="목록 필터 위치가 규칙과 달라요" status="warn" />
            </div>
          </Panel>
          <Panel title="Decision">
            <DecisionCard title="ORDER-42 변경안" proceedLabel="스펙 작성하기" />
          </Panel>
          <div className="col-span-full" data-level="surface">
            <Panel title="Steps">
              <StepsLegend />
              <Steps>
                <Step index={1} who="agent" done title="온보딩" text="역할과 프로젝트, 도구 연결을 확인하고 빠진 조건을 먼저 물어봐요." />
                <Step index={2} who="agent" title="일감과 맥락" text="일감을 고르면 목적과 업무 규칙, 이전 결정을 같이 불러와요." />
                <Step index={3} who="human" title="생성과 검토" text="핵심 화면부터 만들어 보여주고, 확정과 수정은 사람이 결정해요." />
                <Step index={4} who="agent" title="버전과 충돌" text="변경은 버전으로 남기고, 겹치면 두 의도를 나란히 보여줘요." />
              </Steps>
            </Panel>
          </div>
        </div>
      </Section>
    </div>
  )
}
