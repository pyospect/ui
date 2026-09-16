import type { ReactNode } from "react"
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

import buttonSrc from "@/components/ui/button.tsx?raw"
import inputSrc from "@/components/ui/input.tsx?raw"
import switchSrc from "@/components/ui/switch.tsx?raw"
import cardSrc from "@/components/ui/card.tsx?raw"
import tagSrc from "@/components/ui/tag.tsx?raw"
import dialogSrc from "@/components/ui/dialog.tsx?raw"
import listSrc from "@/components/ui/list.tsx?raw"
import tableSrc from "@/components/ui/table.tsx?raw"
import skeletonSrc from "@/components/ui/skeleton.tsx?raw"
import emptySrc from "@/components/ui/empty.tsx?raw"
import copyCommandSrc from "@/components/ui/copy-command.tsx?raw"
import codeBlockSrc from "@/components/ui/code-block.tsx?raw"
import thinkingSrc from "@/components/ai/thinking.tsx?raw"
import validationSrc from "@/components/ai/validation-card.tsx?raw"
import stepsSrc from "@/components/ai/steps.tsx?raw"
import decisionSrc from "@/components/ai/decision-card.tsx?raw"
import diffSrc from "@/components/ai/diff.tsx?raw"
import versionsSrc from "@/components/ai/versions.tsx?raw"
import chatSrc from "@/components/ai/chat.tsx?raw"
import connectionSrc from "@/components/ai/connection.tsx?raw"

export type Demo = {
  slug: string
  title: string
  group: "기본" | "AI 협업 패턴"
  summary: string
  source: string
  demo: ReactNode
  code: string
}

export const DEMOS: Demo[] = [
  {
    slug: "button", title: "Button", group: "기본",
    summary: "primary, secondary, ghost, tint. 한 화면에 primary는 하나이고 라벨은 동사예요.",
    source: buttonSrc,
    demo: (
      <div className="grid gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Button>저장하기</Button><Button hierarchy="secondary">취소</Button><Button hierarchy="ghost">더 보기</Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm">작게</Button><Button>기본</Button><Button size="lg">크게</Button><Button disabled>비활성</Button>
        </div>
      </div>
    ),
    code: `import { Button } from "@/components/ui/button"

<Button>저장하기</Button>
<Button hierarchy="secondary">취소</Button>
<Button hierarchy="ghost">더 보기</Button>
<Button size="sm">작게</Button>`,
  },
  {
    slug: "input", title: "Input", group: "기본",
    summary: "면 위에 의미 있는 선 하나. Field, Label, Help가 같이 들어 있고 라벨은 항상 위예요.",
    source: inputSrc,
    demo: (
      <div className="grid max-w-[360px] gap-4">
        <Field>
          <Label htmlFor="d-i1">프로젝트 이름</Label>
          <Input id="d-i1" placeholder="예: 봄 시즌 프로모션" aria-describedby="d-i1h" />
          <Help id="d-i1h">팀원에게 보이는 이름이에요.</Help>
        </Field>
        <Field>
          <Label htmlFor="d-i2">이메일</Label>
          <Input id="d-i2" defaultValue="hello@example" aria-invalid="true" aria-describedby="d-i2h" />
          <Help id="d-i2h" error>@ 뒤에 도메인이 빠졌어요. 예: example.com</Help>
        </Field>
      </div>
    ),
    code: `import { Input, Field, Label, Help } from "@/components/ui/input"

<Field>
  <Label htmlFor="name">프로젝트 이름</Label>
  <Input id="name" placeholder="예: 봄 시즌 프로모션" aria-describedby="name-help" />
  <Help id="name-help">팀원에게 보이는 이름이에요.</Help>
</Field>`,
  },
  {
    slug: "switch", title: "Switch", group: "기본",
    summary: "트랙 28, 핸들 20, padding 4. Control 줄이 라벨과 스위치를 한 줄로 붙잡아요.",
    source: switchSrc,
    demo: (
      <div className="grid max-w-[320px] gap-3">
        <Control><Label htmlFor="d-s1">AI 추천 켜기</Label><Switch id="d-s1" defaultChecked /></Control>
        <Control><Label htmlFor="d-s2">알림</Label><Switch id="d-s2" /></Control>
      </div>
    ),
    code: `import { Switch, Control } from "@/components/ui/switch"
import { Label } from "@/components/ui/input"

<Control>
  <Label htmlFor="ai">AI 추천 켜기</Label>
  <Switch id="ai" defaultChecked />
</Control>`,
  },
  {
    slug: "card", title: "Card", group: "기본",
    summary: "선도 그림자도 없이 surface 톤 하나로 bg 위에 놓여요. 카드 속 카드는 없어요.",
    source: cardSrc,
    demo: (
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
        <Card media>
          <CardMedia />
          <CardBody><CardTitle>이미지 카드</CardTitle><CardText>이미지 radius는 12에서 4를 뺀 8이에요.</CardText></CardBody>
        </Card>
        <Card selected><CardTitle>선택된 카드</CardTitle><CardText>의미 있는 상태라서 선을 써요.</CardText></Card>
        <Card><CardTitle>기본 카드</CardTitle><CardText>surface 톤 하나로 존재해요.</CardText></Card>
      </div>
    ),
    code: `import { Card, CardMedia, CardBody, CardTitle, CardText } from "@/components/ui/card"

<Card>
  <CardTitle>기본 카드</CardTitle>
  <CardText>surface 톤 하나로 존재해요.</CardText>
</Card>

<Card media>
  <CardMedia />
  <CardBody>
    <CardTitle>이미지 카드</CardTitle>
  </CardBody>
</Card>`,
  },
  {
    slug: "tag", title: "Tag", group: "기본",
    summary: "full radius pill. 색이 있는 톤은 단색에 흰 글자예요.",
    source: tagSrc,
    demo: <div className="flex flex-wrap gap-2"><Tag>기본</Tag><Tag tone="brand">선택됨</Tag><Tag tone="ok">통과</Tag><Tag tone="warn">확인 필요</Tag><Tag tone="danger">실패</Tag></div>,
    code: `import { Tag } from "@/components/ui/tag"

<Tag>기본</Tag>
<Tag tone="ok">통과</Tag>
<Tag tone="warn">확인 필요</Tag>
<Tag tone="danger">실패</Tag>`,
  },
  {
    slug: "dialog", title: "Dialog", group: "기본",
    summary: "그림자가 허용되는 유일한 곳. 제목은 질문이고 primary 버튼이 그 답이에요.",
    source: dialogSrc,
    demo: (
      <Dialog>
        <DialogTrigger asChild><Button>스펙 작성하기</Button></DialogTrigger>
        <DialogContent>
          <DialogTitle>스펙을 작성할까요?</DialogTitle>
          <DialogDescription>ORDER-42 변경안을 기준으로 Spec 초안을 만들어요.</DialogDescription>
          <DialogNote>되돌릴 수 없거나 다음 단계가 갈리는 결정에만 써요.</DialogNote>
          <DialogActions>
            <DialogClose asChild><Button hierarchy="ghost">취소</Button></DialogClose>
            <DialogClose asChild><Button>작성하기</Button></DialogClose>
          </DialogActions>
        </DialogContent>
      </Dialog>
    ),
    code: `import { Dialog, DialogTrigger, DialogClose, DialogContent, DialogTitle, DialogDescription, DialogActions } from "@/components/ui/dialog"

<Dialog>
  <DialogTrigger asChild><Button>스펙 작성하기</Button></DialogTrigger>
  <DialogContent>
    <DialogTitle>스펙을 작성할까요?</DialogTitle>
    <DialogDescription>ORDER-42 변경안을 기준으로 초안을 만들어요.</DialogDescription>
    <DialogActions>
      <DialogClose asChild><Button hierarchy="ghost">취소</Button></DialogClose>
      <DialogClose asChild><Button>작성하기</Button></DialogClose>
    </DialogActions>
  </DialogContent>
</Dialog>`,
  },
  {
    slug: "list", title: "List", group: "기본",
    summary: "row는 button이라 키보드로 닿아요. hover와 선택은 row 배경으로만이에요.",
    source: listSrc,
    demo: (
      <List aria-label="일감" className="max-w-[400px]">
        <ListItem meta="TASK-101" selected>장바구니 쿠폰 적용 순서 정리</ListItem>
        <ListItem meta="TASK-102">배송지 저장 화면</ListItem>
        <ListItem meta="TASK-103">재고 알림 배너</ListItem>
      </List>
    ),
    code: `import { List, ListItem } from "@/components/ui/list"

<List aria-label="일감">
  <ListItem meta="TASK-101" selected>장바구니 쿠폰 적용 순서 정리</ListItem>
  <ListItem meta="TASK-102">배송지 저장 화면</ListItem>
</List>`,
  },
  {
    slug: "table", title: "Table", group: "기본",
    summary: "숫자는 오른쪽 정렬에 tabular, 행 사이에 선이 없어요. 넓으면 안에서만 가로 스크롤이에요.",
    source: tableSrc,
    demo: (
      <TableWrap>
        <Table>
          <TableHead><TableRow><TableHeader>날짜</TableHeader><TableHeader>구간</TableHeader><TableHeader num>금액</TableHeader><TableHeader>결제수단</TableHeader><TableHeader>안내</TableHeader></TableRow></TableHead>
          <TableBody>
            <TableRow><TableCell>2026-03-02</TableCell><TableCell>서울역에서 천안아산역</TableCell><TableCell num>14,100원</TableCell><TableCell><Tag>개인카드</Tag></TableCell><TableCell><TableHint><Info />정산 후 입금돼요</TableHint></TableCell></TableRow>
            <TableRow><TableCell>2026-03-02</TableCell><TableCell>천안아산역에서 세종청사</TableCell><TableCell num>31,200원</TableCell><TableCell><Tag tone="brand">법인카드</Tag></TableCell><TableCell><Button hierarchy="secondary" size="sm">증빙 추가하기</Button></TableCell></TableRow>
          </TableBody>
        </Table>
      </TableWrap>
    ),
    code: `import { TableWrap, Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from "@/components/ui/table"

<TableWrap>
  <Table>
    <TableHead>
      <TableRow><TableHeader>날짜</TableHeader><TableHeader num>금액</TableHeader></TableRow>
    </TableHead>
    <TableBody>
      <TableRow><TableCell>2026-03-02</TableCell><TableCell num>14,100원</TableCell></TableRow>
    </TableBody>
  </Table>
</TableWrap>`,
  },
  {
    slug: "skeleton", title: "Skeleton", group: "기본",
    summary: "회색 바만 있어요. 일러스트도 스피너도 없어요.",
    source: skeletonSrc,
    demo: <SkeletonText className="max-w-[400px]" />,
    code: `import { Skeleton, SkeletonText } from "@/components/ui/skeleton"

<SkeletonText lines={4} />
<Skeleton style={{ width: "60%" }} />`,
  },
  {
    slug: "empty", title: "Empty", group: "기본",
    summary: "제목 한 줄, 설명 한 줄, 버튼 하나. 왼쪽 정렬이에요.",
    source: emptySrc,
    demo: <Empty className="max-w-[400px]" title="아직 일감이 없어요" text="Jira에서 일감을 가져오면 여기에 나타나요." action={<Button size="sm">Jira 연결하기</Button>} />,
    code: `import { Empty } from "@/components/ui/empty"

<Empty
  title="아직 일감이 없어요"
  text="Jira에서 일감을 가져오면 여기에 나타나요."
  action={<Button size="sm">Jira 연결하기</Button>}
/>`,
  },
  {
    slug: "copy-command", title: "CopyCommand", group: "기본",
    summary: "터미널 명령어 한 줄과 복사 버튼이에요. 누르면 복사했어요가 1.2초 보여요.",
    source: copyCommandSrc,
    demo: <CopyCommand command="npx pyospectui" className="max-w-[400px]" />,
    code: `import { CopyCommand } from "@/components/ui/copy-command"

<CopyCommand command="npx pyospectui" />
<CopyCommand command="npm run dev" size="lg" />`,
  },
  {
    slug: "code-block", title: "CodeBlock", group: "기본",
    summary: "붙여넣을 코드 블록이에요. 긴 줄은 블록 안에서만 가로 스크롤이에요.",
    source: codeBlockSrc,
    demo: <CodeBlock code={`import { Button } from "@/components/ui/button"\n\n<Button>저장하기</Button>`} className="max-w-[480px]" />,
    code: `import { CodeBlock } from "@/components/ui/code-block"

<CodeBlock language="tsx" code={source} />`,
  },
  {
    slug: "thinking", title: "Thinking", group: "AI 협업 패턴",
    summary: "에이전트의 접히는 생각 블록이에요. 진행 중이면 점이 깜빡이고, 끝나면 제목이 과거형이에요.",
    source: thinkingSrc,
    demo: <Thinking live open className="max-w-[520px]" title="25초 동안 생각했어요" steps={["이 티켓이 단순 문구 수정인지, 조건 분기까지 바뀌는지부터 나눠서 볼게요.", "영향받는 화면과 기능이 어디까지인지 확인할게요."]} />,
    code: `import { Thinking } from "@/components/ui/thinking"

<Thinking
  live
  title="생각하는 중이에요"
  steps={["이 티켓이 단순 문구 수정인지부터 볼게요.", "영향받는 화면을 확인할게요."]}
/>`,
  },
  {
    slug: "validation-card", title: "ValidationCard", group: "AI 협업 패턴",
    summary: "에이전트가 돌린 검증 하나예요. 제목, 이유 한 줄, 오른쪽에 상태 pill이에요.",
    source: validationSrc,
    demo: (
      <div className="grid max-w-[520px] gap-2">
        <ValidationCard title="Component Usage" reason="기존 Button과 Filter 컴포넌트를 재사용했어요" status="ok" />
        <ValidationCard title="Semantic Token" reason="raw 색상 값 두 곳을 썼어요" status="danger" />
        <ValidationCard title="Layout Pattern" reason="목록 필터 위치가 규칙과 달라요" status="warn" />
      </div>
    ),
    code: `import { ValidationCard } from "@/components/ui/validation-card"

<ValidationCard title="Semantic Token" reason="raw 색상 값 두 곳을 썼어요" status="danger" />`,
  },
  {
    slug: "steps", title: "Steps", group: "AI 협업 패턴",
    summary: "채운 원은 에이전트가 처리하고, 점선 원은 사람이 결정해요. 범례를 항상 같이 보여줘요.",
    source: stepsSrc,
    demo: (
      <div className="grid gap-4">
        <StepsLegend />
        <Steps>
          <Step index={1} who="agent" done title="온보딩" text="역할과 프로젝트, 도구 연결을 확인해요." />
          <Step index={2} who="agent" title="일감과 맥락" text="목적과 업무 규칙, 이전 결정을 불러와요." />
          <Step index={3} who="human" title="생성과 검토" text="확정과 수정은 사람이 결정해요." />
        </Steps>
      </div>
    ),
    code: `import { Steps, Step, StepsLegend } from "@/components/ui/steps"

<StepsLegend />
<Steps>
  <Step index={1} who="agent" done title="온보딩" text="도구 연결을 확인해요." />
  <Step index={2} who="human" title="검토" text="확정은 사람이 결정해요." />
</Steps>`,
  },
  {
    slug: "decision-card", title: "DecisionCard", group: "AI 협업 패턴",
    summary: "에이전트가 만든 결과물과 다음 선택지예요. 사람이 눌러야 넘어가요.",
    source: decisionSrc,
    demo: <DecisionCard className="max-w-[520px]" title="ORDER-42 변경안" proceedLabel="스펙 작성하기" />,
    code: `import { DecisionCard } from "@/components/ui/decision-card"

<DecisionCard title="ORDER-42 변경안" proceedLabel="스펙 작성하기" onProceed={() => {}} />`,
  },
  {
    slug: "diff", title: "Diff", group: "AI 협업 패턴",
    summary: "코드 변경이에요. 추가와 삭제는 tint 배경만으로 구분해요.",
    source: diffSrc,
    demo: (
      <Diff className="max-w-[520px]" path="src/cart/applyCoupon.ts" added={2} removed={1}>
        <DiffLine kind="del">cart.clear();</DiffLine>
        <DiffLine kind="add">cart.clearPayment();</DiffLine>
        <DiffLine kind="add">cart.recalculate({"{ coupon }"});</DiffLine>
      </Diff>
    ),
    code: `import { Diff, DiffLine } from "@/components/ui/diff"

<Diff path="src/cart/applyCoupon.ts" added={2} removed={1}>
  <DiffLine kind="del">cart.clear();</DiffLine>
  <DiffLine kind="add">cart.clearPayment();</DiffLine>
</Diff>`,
  },
  {
    slug: "versions", title: "Versions", group: "AI 협업 패턴",
    summary: "현재 버전만 tint예요. 나머지는 면이 없어요.",
    source: versionsSrc,
    demo: (
      <Versions className="max-w-[400px]">
        <Version label="v2" meta="최신" note="검증 규칙과 감사 로그를 추가했어요" current />
        <Version label="v1" meta="어제" note="처음 작성한 스펙이에요" />
      </Versions>
    ),
    code: `import { Versions, Version } from "@/components/ui/versions"

<Versions>
  <Version label="v2" meta="최신" note="검증 규칙을 추가했어요" current />
  <Version label="v1" meta="어제" note="처음 작성한 스펙이에요" />
</Versions>`,
  },
  {
    slug: "chat", title: "Chat", group: "AI 협업 패턴",
    summary: "사람은 brand 쪽, 에이전트는 면이에요.",
    source: chatSrc,
    demo: (
      <Chat className="max-w-[520px]">
        <Bubble from="me">ORDER-42 변경안 작성해줘.</Bubble>
        <Bubble from="ai">ORDER-42 분석이 끝났어요. 아래 내용을 검토해 주세요.</Bubble>
        <ChatTime>방금</ChatTime>
      </Chat>
    ),
    code: `import { Chat, Bubble, ChatTime } from "@/components/ui/chat"

<Chat>
  <Bubble from="me">ORDER-42 변경안 작성해줘.</Bubble>
  <Bubble from="ai">분석이 끝났어요. 검토해 주세요.</Bubble>
  <ChatTime>방금</ChatTime>
</Chat>`,
  },
  {
    slug: "connection", title: "Connection", group: "AI 협업 패턴",
    summary: "도구 연결 상태예요. 연결됐으면 ok 점, 아니면 빈 점과 연결하기 버튼이에요.",
    source: connectionSrc,
    demo: (
      <ConnectionList className="max-w-[400px]">
        <Connection name="Figma" connected />
        <Connection name="Jira" connected />
        <Connection name="Git" connected={false} action={<Button hierarchy="ghost" size="sm">연결하기</Button>} />
      </ConnectionList>
    ),
    code: `import { ConnectionList, Connection } from "@/components/ui/connection"

<ConnectionList>
  <Connection name="Figma" connected />
  <Connection name="Git" connected={false} action={<Button hierarchy="ghost" size="sm">연결하기</Button>} />
</ConnectionList>`,
  },
]
