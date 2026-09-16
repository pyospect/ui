# pyospectui

고경표의 취향을 담은 AI 친화적 디자인 시스템이에요. shadcn 레지스트리 형식이라 어떤 React + Tailwind v4 프로젝트에서든 한 줄로 시작할 수 있어요.

```bash
npx pyospectui
```

이 한 줄이면 설정 없이 테마와 컴포넌트 18개가 전부 들어와요. 몇 개만 고르려면 `npx pyospectui button card`처럼 이름을 붙여요. shadcn 명령을 그대로 쓰고 싶으면 `npx shadcn add https://ui.pyospect.com/r/pyospect.json`이에요.

- 규칙: [docs/TASTE.md](docs/TASTE.md)
- AI용 요약: [public/llms.txt](public/llms.txt)
- 컴포넌트: `registry/ui` (기본), `registry/ai` (AI 협업 패턴)

## 개발

```bash
npm install
npm run dev              # 데모 페이지
npm run registry:build   # public/r/*.json 생성
```

## 빈 맥에서 시작하기

Node.js만 있으면 돼요. 없으면 https://nodejs.org 에서 LTS를 설치하세요.

```bash
npx shadcn@latest init -t vite -b radix -p nova -y --no-monorepo -n my-app
cd my-app
```

전부 받아요. 첫 설치에는 `--overwrite`를 붙여요. init이 만든 기본 button을 pyospect 것으로 바꿔야 하니까요.

```bash
npx pyospectui --overwrite
```

하나씩 고르고 싶으면 `components.json`에 레지스트리를 등록하고 이름으로 받아요.

```json
"registries": { "@pyospect": "https://ui.pyospect.com/r/{name}.json" }
```

```bash
npx shadcn@latest add @pyospect/button @pyospect/card
```

`index.html`의 `<head>`에 Pretendard를 넣어요.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" />
```

`src/App.tsx`에서 바로 써요.

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardTitle, CardText } from "@/components/ui/card"

export default function App() {
  return (
    <Card>
      <CardTitle>pyospectui가 붙었어요</CardTitle>
      <CardText>이 카드와 버튼은 방금 받은 거예요.</CardText>
      <Button>저장하기</Button>
    </Card>
  )
}
```

```bash
npm run dev
```

## 전체 컴포넌트

```bash
npx shadcn add @pyospect/button @pyospect/input @pyospect/switch @pyospect/card @pyospect/tag @pyospect/dialog @pyospect/list @pyospect/table @pyospect/skeleton @pyospect/empty
npx shadcn add @pyospect/thinking @pyospect/validation-card @pyospect/steps @pyospect/decision-card @pyospect/diff @pyospect/versions @pyospect/chat @pyospect/connection
```

테마는 파일이 아니라 변수로 들어와요. `shadcn add @pyospect/theme`가 프로젝트 전역 CSS의 `:root`, `.dark`, `@theme inline`에 pyospect 토큰과 shadcn 표준 변수를 합쳐 넣어요. 그래서 `npx shadcn add dropdown-menu` 같은 shadcn 기본 컴포넌트도 같은 모습으로 나와요. Pretendard와 JetBrains Mono는 `index.html`에서 불러와요.
