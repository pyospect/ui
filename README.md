# pyospectui

한국어 제품을 만드는 팀을 위한 디자인 시스템이에요. neutral 테마로 시작하고, 브랜드 색을 고르면 pyospect의 규칙이 나머지 색을 만들고 검사해요. 기본 pyospect는 색기 없는 neutral 테마이며, 유채색 프리셋은 선택해서 써요.

고경표(pyospect)의 취향을 AI도 따를 수 있는 규칙으로 옮겼어요. shadcn 레지스트리 형식이라 어떤 React + Tailwind v4 프로젝트에서든 한 줄로 시작할 수 있어요.

```bash
npx pyospectui
```

이 한 줄이면 테마(pyospect neutral)와 컴포넌트, 배경 실험실이 함께 들어와요. `shadcn init`으로 막 만든 프로젝트처럼 shadcn 기본 `button.tsx`가 이미 있으면, CLI가 설치 전에 멈추고 `--overwrite`를 붙이라고 알려 줘요(`npx pyospectui --overwrite`). 몇 개만 고르려면 `npx pyospectui button card`처럼 이름을 붙여요. 프로젝트에 v0.3 테마(`--pyo-seed`)가 없으면 테마를 먼저 넣고, 있으면 컴포넌트만 넣어요. shadcn 명령을 그대로 쓰고 싶으면 `npx shadcn add https://ui.pyospect.com/r/v0.4.0/pyospect.json`이에요.

- 문서: https://ui.pyospect.com/#/docs/button (컴포넌트마다 미리보기, 설치 명령, 사용 코드, 다섯 줄 문서)
- 테마: https://ui.pyospect.com/#/themes (브랜드 색을 넣고 라이트와 다크를 나란히 미리 봐요)
- 실험실: https://ui.pyospect.com/#/lab (팔레트와 색감, 번짐, 종이결을 조절하고 시안과 PNG를 저장해요)
- 규칙: [docs/TASTE.md](docs/TASTE.md) (문법만 있어요. 프리셋별 실제 값은 https://ui.pyospect.com/themes/pyospect.md)
- AI용 요약: [public/llms.txt](public/llms.txt)
- 컴포넌트: `registry/ui` (기본), `registry/ai` (AI 협업 패턴)

## 기본 디자인

정본은 [DESIGN.md](DESIGN.md)예요. 영문과 한글 모두 Pretendard Medium 500을 써요. 제목은 36px / 1.2 / -0.05em, 본문은 16px / 1.8 / -0.015em, 작은 설명은 14px / 1.85예요. 워드마크 자간은 0으로 따로 유지해요. 긴 제목과 문서는 줄바꿈하며, 한 줄이 필요한 제한된 컨트롤과 메타데이터만 말줄임해요.

홈 주 섹션의 위아래 여백은 56px, 좌우 패딩은 큰 화면 48px와 작은 화면 24px예요. 패널 사이에는 24px, 다열 그리드에는 28px를 둬요. Card와 CardBody의 패딩은 24px, 안쪽 간격은 20px예요. 독립된 카드와 입력창의 바깥 반경은 24px, 버튼은 pill, 말풍선은 22px예요. 안쪽 면이 부모 윤곽을 따라가면 `안쪽 반경 = max(0, 바깥 반경 - 간격)`으로 맞춰요. 예를 들어 미디어 카드 24px 안의 이미지가 4px 들어가면 이미지 반경은 20px, 실험실 카드 안의 캔버스가 12px 들어가면 캔버스 반경은 12px예요. 패널 안의 독립된 입력창이나 버튼은 이 식을 무조건 적용하지 않아요.

질문 말풍선은 14px / 1.5에 패딩 12px × 18px, 답변은 15px / 1.85에 패딩 16px × 18px예요. 말풍선 사이는 18px예요. 56px를 모든 컨트롤 안에 넣지는 않아요. 일반 컴팩트 라벨은 14px / 1.5를 기준으로 해요. Input.Label과 Button md는 명시적 14px / 20px를 유지하고, Input 높이 40px와 Button 높이 32/40/48px도 그대로예요. 코드용 font-mono 별칭도 기본 Pretendard를 가리켜요.

브랜드 스튜디오와 같은 타이포그래피와 여백 기준을 공유하지만, 포트폴리오와 문서의 화면 배치를 똑같이 복제하지는 않아요. 밝은 테마는 neutral-50 배경 위 흰 카드, 다크 테마는 neutral-950 배경 위 neutral-900 카드예요. 일반 테두리는 10% 투명도로 낮추고 focus와 상태 표시는 명확하게 유지해요.

## 선택 목록

트리거와 열린 목록이 함께 테마를 따르는 `Select`를 써요. 운영체제가 그리는 native select 메뉴의 모양은 브라우저마다 달라요. Select는 키보드 탐색과 비활성 항목을 지원하고, 쉐브론은 오른쪽 12px에 놓여요. 팝업 바깥 반경 24px와 안쪽 여백 4px에 맞춰 항목 반경은 20px예요.

```tsx
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

<Select defaultValue="natural">
  <SelectTrigger aria-label="색감"><SelectValue /></SelectTrigger>
  <SelectContent>
    <SelectItem value="natural">기본 느낌</SelectItem>
    <SelectItem value="deep">깊고 진하게</SelectItem>
  </SelectContent>
</Select>
```

[Select 문서](https://ui.pyospect.com/#/docs/select)에서 열린 목록까지 확인해요.

## 브랜드 색으로 시작하기

```bash
npx pyospectui --brand "#3366FF"
```

브랜드 색 하나를 넣으면 규칙이 brand 스케일, 버튼 색, 글자색, tint, 상태색, chart 색을 만들고 대비를 검사해요. 설치하기 전에 모드(흰 글자인지 검은 글자인지), fill, 대비표, 옮긴 상태색과 경고를 먼저 보여 줘요.

- 규칙이 색보다 먼저예요. fill은 흰 글자가 4.5:1을 넘는 가장 밝은 톤으로 옮기고, 넣은 색은 brand 스케일 안에 그대로 남겨요.
- 노랑처럼 밝은 색은 그대로 fill이 되고, 그 위 글자가 검은색으로 바뀌어요.
- 상태색(ok, warn, danger)이 브랜드와 hue 30° 안으로 가까우면 자기 범위 안에서 옮겨요.
- 기본 neutral 색 `#171717`은 별도의 무채색 규칙을 사용해요. 다른 회색에 가까운 색(OKLCH 채도 0.04 미만)은 받지 않아요.
- 고를 수 있는 건 브랜드 색 하나예요. radius, 서체, 뉴트럴, 모션은 옵션이 아니에요.

미리 만든 프리셋도 12개 있어요. 프리셋 하나가 테마 하나라서, pyospect가 이미 있는 프로젝트에서는 한 줄로 CSS 변수만 갈아끼우고 컴포넌트 파일은 건드리지 않아요. 목록과 색은 `npx pyospectui presets`나 https://ui.pyospect.com/themes/index.md 에서 봐요.

```bash
npx pyospectui presets                                        # 프리셋 목록
npx pyospectui --preset violet                                # 보라로 바꾸기
npx shadcn add https://ui.pyospect.com/r/v0.4.0/theme-violet.json    # 같은 일을 shadcn 명령으로
npx pyospectui --preset pyospect                              # neutral 기본값으로 돌아가기
```

테마만 바꾸거나 다시 만들 수도 있어요. 설치된 CSS에 `--pyo-seed`로 브랜드 색이 기록돼 있어서, `--brand` 없이 부르면 그 색으로 다시 만들어요.

```bash
npx pyospectui theme                     # 기록된 브랜드 색으로 테마를 다시 만들어요
npx pyospectui theme --brand "#3366FF"   # 브랜드 색만 바꿔요
```

나중에 `npx pyospectui card`처럼 컴포넌트를 더 받아도 고른 브랜드 색은 바뀌지 않아요. 예전 pyospect 테마(`--brand`는 있고 `--pyo-seed`는 없는 CSS)라면 새 컴포넌트가 쓰는 토큰(brand-graphic, brand-tint-2-text, `*-fill-text`)이 없어서 테마도 같이 받아요. pyospect가 이미 있는 프로젝트에서 `--brand`나 `--preset`만 쓰면 테마만 바꾸고, `npx pyospectui`를 다시 실행하면 기록된 브랜드 색으로 테마를 만들어요. 어떤 색이 어떻게 나오는지는 https://ui.pyospect.com/#/themes 에서 먼저 볼 수 있어요.

## 개발

```bash
npm install
npm run dev              # 데모 페이지
npm run check            # 색 규칙 검사(theme-check)와 취향 린트(taste-lint)
npm run registry:build   # public/r/v0.4.0/*.json (기존 /r/ 보존), public/themes/*.md, packages/pyospectui/theme/base.json 생성
npm run e2e:install      # 새 Vite 앱에 로컬 레지스트리로 설치해 보는 테스트 (네트워크 필요)
```

`npm run check`는 pyospect neutral을 규칙으로 다시 만든 값이 `src/index.css`와 같은지, 배포되는 CSS의 모든 대비가 기준을 넘는지, 컴포넌트에 raw 색이나 금지된 값이 없는지 확인해요. CI는 이 검사를 통과해야 레지스트리를 빌드해요.

## 빈 맥에서 시작하기

Node.js만 있으면 돼요. 없으면 https://nodejs.org 에서 LTS를 설치하세요.

```bash
npx shadcn@~4.21 init -t vite -b radix -p nova -y --no-monorepo -n my-app
cd my-app
```

pyospectui는 shadcn 4.21로 시험해요. shadcn은 버전마다 CSS 변수와 파일을 덮어쓰는 규칙이 달라서, 이 문서의 shadcn 명령은 `shadcn@~4.21`로 적어요. `npx pyospectui`도 안에서 4.21을 써요.

전부 받아요. 첫 설치에는 `--overwrite`를 붙여요. init이 만든 기본 button을 pyospect 것으로 바꿔야 하니까요. 브랜드 색을 쓰려면 `--brand "#3366FF"`를 같이 붙여요.

```bash
npx pyospectui --overwrite
```

하나씩 고르고 싶으면 `components.json`에 레지스트리를 등록하고 이름으로 받아요.

```json
"registries": { "@pyospect": "https://ui.pyospect.com/r/v0.4.0/{name}.json" }
```

```bash
npx shadcn@~4.21 add @pyospect/theme @pyospect/button @pyospect/card
```

`index.html`의 `<head>`에 Pretendard를 넣어요. 테마는 글꼴 이름만 정하고 글꼴 파일은 불러오지 않아서, 이 줄이 없으면 시스템 글꼴로 보여요. `npx pyospectui`도 설치가 끝나면 이 줄이 없는지 확인해서 알려 줘요.

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
npx shadcn add @pyospect/button @pyospect/input @pyospect/select @pyospect/switch @pyospect/card @pyospect/tag @pyospect/dialog @pyospect/list @pyospect/table @pyospect/skeleton @pyospect/empty @pyospect/copy-command @pyospect/code-block
npx shadcn add @pyospect/thinking @pyospect/validation-card @pyospect/steps @pyospect/decision-card @pyospect/diff @pyospect/versions @pyospect/chat @pyospect/connection
npx shadcn add @pyospect/wash-lab
```

`shadcn add @pyospect/<name>`은 테마를 넣지 않아요. 컴포넌트가 의존하는 `tokens`는 pyospect 토큰 이름(Tailwind 클래스 등록), 뉴트럴 값, 유틸리티만 채우고 브랜드와 상태색 값은 넣지 않아요. 그래서 테마가 없는 프로젝트에서는 primary 버튼, 스위치, 상태 Tag처럼 `brand`, `brand-graphic`, `ok-fill` 같은 색을 쓰는 부분이 색 없이 나와요. radius, primary 같은 shadcn 값도 shadcn 것 그대로예요. 테마가 없는 프로젝트라면 `npx pyospectui <name>`을 쓰거나 `@pyospect/theme`을 같은 명령에 먼저 적어요. shadcn은 명령에 직접 적은 항목이 테마일 때만 기존 CSS 변수를 덮어써요. `tokens`에 색 값이 없는 이유도 여기에 있어요. shadcn은 한 번에 받는 항목의 변수를 테마 먼저, 나머지를 나중 순서로 합치기 때문에, `tokens`에 초록 값이 있으면 같은 명령으로 받은 다른 브랜드 테마를 덮어써요.

테마는 파일이 아니라 변수로 들어와요. `shadcn add @pyospect/theme`가 프로젝트 전역 CSS의 `:root`, `.dark`, `@theme inline`에 pyospect 토큰과 shadcn 표준 변수를 합쳐 넣어요. 그래서 `npx shadcn add dropdown-menu` 같은 shadcn 기본 컴포넌트도 pyospect 색과 글꼴로 나와요. 다만 모양 규칙까지 따라오지는 않아요. 기본 Card는 테두리와 `shadow-sm`을 그대로 가져요. 이름이 같은 컴포넌트가 있으면 pyospect 것을 쓰세요. Pretendard는 `index.html`에서 불러와요.

shadcn 기본 컴포넌트의 hover는 대비 검사 밖이에요. `hover:bg-primary/90`, `bg-destructive/90`처럼 투명도를 써서 흰 바탕 위에서는 fill이 밝아지고, pyospect fill은 흰 글자 4.5:1 경계에 있어서 hover 때 3.8:1 정도로 떨어져요. 버튼은 pyospect Button을 쓰고, 기본 컴포넌트를 쓴다면 hover를 `hover:bg-brand-hover`(위험 버튼은 fill 그대로)로 바꿔요.

설치하면 shadcn이 `@theme inline`에 `--brand: var(--brand)`, `--background: var(--background)` 같은 자기 참조 줄 40여 개와 `--color-pyo-seed`를 더해요. shadcn 4.21이 hex가 아닌 값(`var(...)`, `color-mix(...)`)을 가진 변수를 이렇게 등록하는데, 실제 값은 레이어 밖의 `:root`와 `.dark`가 정해서 화면에는 영향이 없어요. `bg-pyo-seed` 같은 클래스는 쓰지 않아요. 기록용이에요.

`shadcn apply`로 테마를 바꿀 때는 꼭 `--only theme`를 붙여요. 빼면 button, input, switch, card, dialog, table, skeleton, empty처럼 shadcn과 이름이 같은 파일을 shadcn 것으로 덮어써요.

```bash
npx shadcn@~4.21 apply https://ui.pyospect.com/r/v0.4.0/theme-blue.json --only theme
```

## 레지스트리 릴리스

사이트, npm CLI, `theme/version.mjs`는 같은 버전을 사용해요. 현재 설치 주소는 `/r/v0.4.0/`이며, 버전 없는 `/r/`는 CLI 0.2.0의 기존 초록 테마와 호환되도록 동결해요. `legacy-registry/v0.2.0/provenance.json`에 원본 커밋과 SHA-256을 기록했어요.

새 릴리스는 검수한 소스를 커밋한 뒤 `npm run registry:build`와 `node scripts/freeze-registry.mjs`로 `registry-releases/v<버전>/`을 동결하고, 그 스냅샷도 커밋해요. 동결한 버전은 빌드가 다른 내용을 덮어쓰지 못해요. 다음 변경은 버전을 올려 별도 주소로 배포해요. Pages에서 새 레지스트리를 확인한 다음 npm을 배포해요.
