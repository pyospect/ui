# pyospectui Taste Rules (v0.3)

포트폴리오(2026 리뉴얼) + 본인 진술에서 추출. AI가 그대로 따를 수 있게 "금지/허용"으로 씀.
이 문서는 문법이다. 규칙과 고정값(뉴트럴, 간격, radius, 서체)만 적고 브랜드 색의 hex는 적지 않는다. 브랜드 값은 §20 규칙이 만들고, 프리셋마다 생성된 값과 대비표는 따로 있다: https://ui.pyospect.com/themes/pyospect.md (프리셋 목록은 https://ui.pyospect.com/themes/index.md, 값은 `/themes/<preset>.md`).

## 0. 무엇이 고정이고 무엇을 고르나
- 고르는 것(KNOB)은 브랜드 색 하나뿐이다. 나머지는 고정(FIXED)이거나, 브랜드 색에서 같은 규칙으로 계산(RULE)된다.
- 고정은 어떤 브랜드에서도 값이 같다. 계산은 브랜드가 바뀌면 값이 바뀌지만 계산식과 대비 기준은 바뀌지 않는다.

| 항목 | 구분 | 값 또는 규칙 |
|---|---|---|
| 브랜드 색 | KNOB (유일) | sRGB hex 하나. OKLCH 채도 0.04 미만(회색에 가까운 색)은 받지 않는다 |
| brand 스케일 50~950 | RULE | §20 R2, R4 |
| brand fill, 그 위 글자, hover, ink, tint, graphic | RULE | §20 R3, R5~R8 |
| 상태색 ok, warn, danger | 역할은 FIXED, hue는 RULE | §3, §20 R9 |
| chart 1~5 | RULE | §20 R10 |
| 뉴트럴 (면, 글자, 선) | FIXED | §3의 값 그대로 |
| 대비 기준 | FIXED | 글자와 fill 위 글자 4.5:1, 그래픽과 의미 있는 선 3:1 (§17) |
| 간격, 글자 크기, weight | FIXED | 4배수, 12/14/16/20/28/40, 400/500/600 (§1, §2) |
| radius | FIXED | full, lg 20, md 12, sm 8 (§7) |
| 서체 | FIXED | Pretendard Variable, 코드만 JetBrains Mono (§2, §9) |
| 모션 | FIXED | 120ms ease-out, 색과 투명도만, reduced-motion이면 끔 (§10) |
| 언어와 문장 | FIXED | 한국어, 해요체, 동사 버튼, `word-break: keep-all` (§8, §9) |
| AI 협업 패턴 | FIXED | 에이전트와 사람은 모양이 다르다 (§14) |

- radius, 서체, 뉴트럴, 모션, 대비는 옵션으로 열지 않는다. 설치된 파일은 자기 코드라 고칠 수 있지만, 고친 값은 pyospect 규칙과 검사의 보장 밖이다.
- 브랜드 색은 `npx pyospectui --brand "<hex>"`로 넣고, 미리 만든 프리셋은 `--preset <name>`으로 고른다(목록은 `npx pyospectui presets`). pyospect의 초록도 같은 규칙으로 만든 프리셋(`pyospect`) 하나다. 프리셋은 `packages/pyospectui/presets/` 폴더의 파일이 전부이고, 이름은 색을 설명할 뿐 다른 회사의 브랜드 색을 따라 하지 않는다.

## 1. Grid: 4배수
- 모든 spacing / font-size / line-height / radius / icon size는 4의 배수.
- 간격 스케일: `4 8 12 16 20 24 32 40 48 64`. 6, 10, 14 같은 값 금지.
- 글자 크기는 12 / 14 / 16 / 20 / 28 / 40. 14만 4배수가 아닌 유일한 예외이고, 줄 높이 20이 4배수를 지킨다. 선 굵기(1, 2)는 간격이 아니라 규칙 대상이 아니다.
- Tailwind 단위로는 `0.5`(2px)를 선에만 쓰고, `1.5`, `2.5`, `3.5`는 쓰지 않는다.

## 2. Type: Pretendard, weight 셋
- font-family: Pretendard Variable, 폴백 system-ui.
- weight는 400 / 500 / 600만. 700 이상 금지. 본문(설명, 문단)은 400, UI 라벨과 버튼은 500, 제목은 600.
- 위계는 size 점프보다 "색 톤 + weight"로 낸다. 제목 = text 색 600, 본문 = text-2 400.
- Card와 Empty의 제목은 16px 600, 패널과 타일의 헤더는 14px 600. 둘 다 text 색(라이트 검정, 다크 흰색)이고, 본문(text-2)과 굵기와 톤 둘 다로 구분한다.
- 섹션 라벨 패턴: 작은 회색 라벨(Case 01) + 한 줄 아래 text 색 600 소제목.
- line-height는 국문 기준 1.5~1.6, 4배수로 맞춘 px 값 (예: 16px → 24px).

## 3. Color: neutral 베이스 + brand 1개
- 유채색 이름은 문서와 코드 모두 `brand`. (shadcn의 `accent`는 hover 배경이라 그 이름을 쓰지 않는다.) shadcn 표준 변수(background, primary, muted, border...)는 전부 pyospect 토큰에 매핑돼 있어서 shadcn 기본 컴포넌트도 pyospect 색으로 나온다. 모양 규칙까지 따라오지는 않는다: 기본 Card는 테두리와 shadow-sm을 그대로 가진다.
- 베이스는 무채색 램프 하나(FIXED, 브랜드가 바뀌어도 그대로). 색기 없는 순수 gray (blue-tint 금지).
  - light: bg `#FAFAFA`, surface `#FFFFFF`, surface-2 `#F2F2F3`, surface-3 `#E6E6E8`
  - dark: bg `#0C0C0C`, surface `#161616`, surface-2 `#1F1F1F`, surface-3 `#2A2A2A`
  - text 3단계: light `#111111` / `#5C5C5F` / `#6D6D71`, dark `#F5F5F5` / `#A3A3A6` / `#8E8E92`. 전부 bg, surface, surface-2 위에서 AA 4.5:1 이상. text-3는 brand tint 위에 두지 않는다. tint 면(선택 row, 현재 버전)의 보조 글자는 brand-ink로 바꾼다. brand-tint-2 위(사람 말풍선, tint 버튼)의 글자는 보조 글자까지 전부 brand-tint-2-text다. text-2도 다크에서는 4.5:1을 넘지 못한다.
  - line 토큰 하나: light `#767676`, dark `#7A7A7E`. bg, surface, surface-2 위에서 3:1 이상. 의미 있는 선(input 테두리, 스위치 off 트랙)에만. focus ring은 line이 아니라 brand-ink.
- 유채색 스케일은 brand 하나(`brand-50`~`brand-950`). 값은 브랜드 색에서 §20 규칙으로 계산하고 이 문서에는 적지 않는다. Tailwind에는 `brand`로 등록하고, 기본 팔레트의 다른 유채색은 쓰지 않는다. 컴포넌트는 `brand-600` 같은 스케일 단계를 직접 쓰지 않고 아래 역할 토큰만 쓴다.
- brand 역할 토큰. 이름은 모든 테마에서 같다.
  - `brand`: fill(primary 버튼). `brand-text`: fill 위 글자. 보통 흰 글자, 밝은 브랜드는 검은 글자(§20 R3). 라이트와 다크 공통.
  - `brand-hover`: fill의 hover. 흰 글자 모드면 한 단계 어두운 700, 라이트와 다크 모두.
  - `brand-ink`: surface 위 글자, 링크, 선택 텍스트, focus ring. light 700 / dark 300.
  - `brand-tint`, `brand-tint-2`: 색조 면. tint는 선택 row, 완료 원, DecisionCard 바탕. tint-2는 tint 버튼과 사람 말풍선.
  - `brand-tint-2-hover`: tint 버튼 hover. `brand-tint-2-text`: tint-2와 tint-2-hover 위 글자. tint-2 위에서 대비가 보장되는 글자색은 이것 하나다.
  - `brand-graphic`: 글자가 아닌 brand 표시(스위치 on 트랙, Steps 에이전트 원과 범례 점, Thinking 점, 로고 점). `brand-graphic-text`: 그 위 글자.
  - 이름 약속: `X-text`는 `X` 위에서, `X-hover`가 있으면 그 위에서도 4.5:1을 보장한다. `brand-graphic`은 bg와 surface 위에서 3:1을 보장한다.
- brand는 버튼 primary, 선택 상태, 링크, 진행 표시, 에이전트 표시(Steps 원, Thinking 점) 외에는 쓰지 않는다.
- tint(brand-tint, 상태 tint)는 rgba 반투명이 아니라 `color-mix`로 surface에 섞은 불투명 단색. 반투명이면 뒤의 선이나 콘텐츠가 비쳐서 어색해진다.
- 색조 있는 면(brand-tint 카드 등) 위에는 뉴트럴 회색 배경(secondary 버튼, surface-2 요소)을 올리지 않는다. 그 자리에는 brand를 조금 더 섞은 tint 버튼(brand-tint-2 + brand-tint-2-text)이나 ghost.
- 상태색은 ok / warn / danger 3개. 역할은 고정이고 hue는 §20 R9가 정한다: 기본 hue 150 / 65 / 25, fill은 그 hue에서 흰 글자 4.5:1 경계 톤. 브랜드와 30° 안으로 가까우면 자기 범위 안에서 옮긴다. pyospect 초록 프리셋은 ok가 초록과 겹쳐서 teal(hue 약 183)로 옮겨져 있다.
  - `ok`, `warn`, `danger`는 글자와 점 색. `ok-fill`, `warn-fill`, `danger-fill`은 pill fill이고 `ok-fill-text`, `warn-fill-text`, `danger-fill-text`(흰 글자)가 그 위 글자. `ok-tint`, `warn-tint`, `danger-tint`는 면.
  - 색 있는 pill은 단색 fill + fill-text. pill fill은 두 테마 공통. 다크의 밝은 상태색은 글자와 점에만. 반투명 tint pill은 눈에 안 들어오므로 금지. tint는 면(선택 row, 카드, 완료 원, diff 줄)에만.
  - shadcn의 `destructive`는 `danger-fill`, `destructive-foreground`는 `danger-fill-text`.

## 4. Surface: 선보다 면
- 영역 구분의 기본은 border가 아니라 surface 톤 차이 한 단계 (bg → surface → surface-2).
- border는 "장식"으로는 쓰지 않는다. UI적으로 의미가 있을 때만 쓴다: 선택됨, focus ring, 오류 상태, 드래그 대상 등.
- 단순 구획, 카드 외곽, 리스트 구분선에는 border 금지. 여백(12~20px)이나 톤 차이로 대신한다.

## 5. Elevation: 그림자 거의 없음
- light 모드: shadow는 overlay(dialog, popover, dropdown)에만. `0 4px 12px rgba(0,0,0,.08)` 이하.
- dark 모드: shadow 금지. 떠 있는 요소는 surface 톤을 한 단계 올리거나, 아주 약한 glow(흰색 4~8%)로 표현.
- 카드에 그림자 금지. 카드는 surface 색으로만 존재한다.

## 6. Depth: 2단계까지
- 중첩은 bg → surface 까지. 카드 안에 카드 금지.
- 카드 안에서 그룹이 필요하면 surface-2 톤의 "면"으로만 표시하고, 그것도 한 단계까지만.
- 3단계가 필요하다고 느껴지면 정보 구조를 다시 나눈다 (탭, 스텝, 섹션 분리).
- 테이블, 리스트, 카드처럼 그 자체가 surface인 컴포넌트는 패널 안에 넣지 않는다. bg 위에 바로 놓고 제목과 설명은 패널 밖 텍스트로. 같은 톤이 두 번 겹치면 경계가 사라진다.

## 7. Radius: full 아니면 작게, 중첩은 a+b=c
- 네 tier만: `full`(9999), `lg`(20), `md`(12), `sm`(8). Tailwind로는 `rounded-full`, `rounded-lg`, `rounded-md`, `rounded-sm`.
- full: 버튼, pill, tag, chip, 아이콘 버튼, avatar, 토글.
- md(12): card, list, table, empty처럼 bg 위에 바로 놓이는 면. popover, dropdown.
- sm(8): input, 면 안에 들어가는 inset 요소(code, diff, thinking, validation, decision), list row, version row.
- lg(20): dialog, sheet 같은 큰 overlay 패널과 채팅 말풍선.
- 4, 6, 16, 24 같은 중간값 금지. `rounded-xs`, `rounded`, `rounded-2xl`, `rounded-3xl`을 쓰지 않는다.
- **중첩 라운드 규칙 (a+b=c): 바깥 요소 radius = 안쪽 요소 radius + 둘 사이 padding.**
  - 절곡 판재의 "외부 R = 내부 R + 판 두께"와 같은 원리. 코너에서 여백이 갑자기 두꺼워 보이지 않게 한다.
  - 예: 스위치 핸들 20 + padding 4 → 트랙 28, 폭 48. 둘 다 full. (padding도 4배수)
  - 예: 카드 안 이미지 radius 8 + padding 4 → 카드 radius 12. 카드 padding이 20이면 이미지 radius는 12 - 20 < 0 이므로 이미지는 각지게(0).
  - 안쪽 radius가 0 이하로 계산되면 안쪽은 각지게 둔다. 바깥보다 안쪽 radius가 큰 조합 금지.

## 8. Text: 단어 단위, 한 줄 UI는 말줄임
- 줄바꿈은 단어 단위로만 (`word-break: keep-all`). 단어 중간에서 끊지 않는다. 한국어가 기본이라 `:lang(ko)`로 좁히지 않고 전역에 건다.
- 태그, 버튼, 제목, 폼 라벨, 리스트 라벨처럼 한 줄일 때 예쁜 UI는 두 줄로 꺾지 않는다. 넘치면 말줄임표(`nowrap + ellipsis`).
- 라벨 + 컨트롤(스위치, 버튼, 체크박스) 쌍은 flex-wrap 없이 한 줄. 좁으면 컨트롤은 그대로 두고 라벨이 먼저 말줄임된다. 두 줄로 갈라지는 건 금지.
- 콘텐츠가 카드나 컨테이너 밖으로 나가는 것은 가장 나쁘다. 컨테이너는 `min-width: 0`, 넘치는 건 잘라내거나 줄임표.
- 본문(설명, 문단)만 여러 줄 허용. 짧은 문단은 너비 제한 없이 컨테이너 폭을 그대로 쓴다. 긴 문서 본문만 최대 폭을 두되 ch가 아니라 px(640~720)로. 마지막 줄에 한 단어만 남는 것은 `text-wrap: pretty`.

## 9. Writing: 친절하게 풀어쓴 해요체
- UI 문장은 해요체. 명사로 끝내지 않는다. "저장 완료" 대신 "저장했어요", "유효하지 않은 이메일 형식" 대신 "이메일 주소를 다시 확인해 주세요".
- 영어 직역 말투 금지. "성공적으로 삭제되었습니다", "권한이 요구됩니다", "정말로 삭제하시겠습니까?" 같은 문장은 쓰지 않는다.
- 오류는 무엇이 잘못됐고 어떻게 하면 되는지 한 문장. 사과나 "에러가 발생했습니다" 금지.
- 버튼은 동사로 끝난다: 저장하기, 보내기, 작성하기, 복사하기. 누른 뒤의 상태는 과거형(복사했어요). "확인 / 취소"처럼 뜻 없는 라벨 금지. dialog 제목은 질문이고 primary 버튼이 그 답.
- 숫자는 tabular에 콤마와 단위(479,100원), 날짜는 ISO(2025-06-10), 상대시간은 "3분 전", 로딩은 "불러오는 중이에요".
- em dash(U+2014), 가운뎃점(U+00B7)을 쓰지 않는다. 나열은 쉼표, 구분은 콜론이나 마침표.
- monospace는 UI 문장에는 없다. 코드, diff, 파일 경로, 토큰 값에만 JetBrains Mono(400/500, 12px. 큰 설치 명령 한 줄만 14px).

## 10. Interaction: 절제
- transition은 120ms ease-out 하나. 테마가 Tailwind 기본 transition 값으로 등록하므로 `duration-[...]`를 따로 쓰지 않는다. 색/투명도만 애니메이션, 크기 변화 금지.
- hover는 surface 한 단계 밝게(dark) / 어둡게(light). 그림자나 테두리로 hover 표현 금지.
- brand fill의 hover는 이 규칙을 따르지 않고 두 테마 모두 brand-hover를 쓴다(흰 글자 모드면 한 단계 어둡게). 다크에서 밝게 올리면 fill 위 글자 대비가 4.5:1 아래로 내려가기 때문이다.
- selected는 brand-tint 면 + brand-ink 글자, 필요하면 brand-ink 1px border 추가. 의미 있는 상태에는 border를 쓴다.

## 11. Icon
- Lucide, 선 굵기 1.5, 크기 16(인라인)과 20(버튼, 리스트). 채운 아이콘 금지. 항상 옆 글자와 같은 색.

## 12. Layout
- 왼쪽 정렬이 기본. 가운데 정렬은 페이지 hero, 인용문, 빈 화면의 짧은 한 줄에만. hero는 위아래 48/32로 넓게 잡고 소개문은 720 폭.
- 문서 hero는 시스템 요약이 아니라 만든 사람의 이야기: 누구인지, 왜 만드는지. hero 문장은 본문 크기(14/24)에 폭 640, 위아래 여백 64.
- hero 줄바꿈 예외: 잘 읽혀야 하므로 쉼표(,)와 마침표(.) 뒤에서만 줄이 바뀐다. 절 단위를 `inline-block`으로 묶는다. 이 예외는 hero에만, 본문은 단어 단위 그대로. 브랜드 문장 "생각한 것을 직접 만든다. 쓰는 사람이 이해하고 결정하기 쉽게 다듬는다"와 "기술이 삶에 닿는 마지막 한 뼘"을 축으로.
- 컨테이너 폭은 720(읽기), 1040(앱), 1280(테이블 많은 화면) 셋 중 하나. 좌우 여백 모바일 16, 데스크톱 24.
- 브레이크포인트 640, 1024. 모바일 터치 영역 44 이상.
- 폼: 라벨은 항상 input 위. placeholder는 예시만, 설명은 help 줄. 오류 문구는 help 자리.
- 테마: 제품 UI는 라이트 기본. 다크는 같은 토큰으로 자동. 다크 카드는 6% 흰색 glow 1px.

## 13. Data와 상태
- 테이블: 숫자 우측 정렬에 tabular, 행 사이 선 없음, hover는 배경 톤, 헤더는 surface-2. 상태는 pill, 안내는 아이콘 + 회색 한 줄. 넓은 표는 컨테이너 안에서만 가로 스크롤.
- 로딩은 회색 바 skeleton. 빈 상태는 제목 한 줄 + 설명 한 줄 + 버튼 하나. 일러스트 없음.
- Dialog는 되돌릴 수 없거나 다음 단계가 갈리는 결정에만. 되돌릴 수 있는 결과는 toast.

## 14. AI 협업 패턴 (이 시스템만의 컴포넌트)
- Thinking: 접히는 생각 블록. 진행 중이면 brand-graphic 점이 천천히 깜빡이고(reduced-motion이면 멈춘다), 끝나면 제목이 과거형("25초 동안 생각했어요"). 본문은 text-2, 강조 없음.
- Connection: 도구 연결 상태 리스트. 연결됨은 ok 점, 미연결은 line 테두리의 빈 점 + "연결하기" ghost 버튼.
- Validation: 제목, 이유 한 줄(말줄임), 오른쪽에 상태 pill(통과 / 확인 필요 / 실패). 패널 안에 들어가는 요소라 surface-2, glow 없음.
- Decision: 에이전트가 만든 결과물 한 줄 + 다음 선택지 버튼 둘. 방향이 갈리는 순간은 사람이 눌러야 넘어간다.
- Steps: 채운 원(brand-graphic) = 에이전트가 처리, 점선 원(brand-ink 2px 점선) = 사람이 결정, tint 원 = 완료. 항상 범례를 같이 보여준다.
- Diff: JetBrains Mono 12px. 추가/삭제는 tint 배경(ok-tint, danger-tint)과 줄 앞 기호로만 구분한다. 파일 경로 헤더에 +n -n.
- Versions: 현재 버전만 tint. 나머지는 면 없음.
- Chat: 사람은 brand-tint-2 말풍선 + brand-tint-2-text(오른쪽, 말풍선 안의 보조 글자도 brand-tint-2-text), 에이전트는 surface-2 말풍선 + text(왼쪽). 꼬리 쪽 radius만 sm. 누가 말하는지는 `who: "agent" | "human"`으로 정한다.
- 원칙: 에이전트가 처리한 것과 사람이 결정할 것은 항상 모양이 다르다. 누가 했는지 보여주는 표시(원, 점, 말풍선)에서 brand fill은 항상 에이전트가 처리한 것이다. 사람 쪽은 점선 원이나 tint 말풍선으로 그리고 brand fill로 칠하지 않는다. 색만으로 구분하지 않고 모양과 범례를 같이 쓴다.

## 15. AI-Ready 문서 형식 (컴포넌트마다 다섯 줄)
- Naming: 이름에 위계가 들어간다 (Button/Primary).
- Variant: hierarchy, size, state, icon 네 축까지만.
- Token: raw 값 금지, 의미 토큰만. hex, `text-white`, `bg-green-500` 같은 Tailwind 기본 유채색, `brand-600` 같은 스케일 단계도 raw 값이다.
- Structure: 무엇이 무엇 안에 들어갈 수 있는지.
- Usage Rule: 언제 무엇을 쓰는지 한두 문장.

## 16. 데이터와 보안
- 데모, 문서, 목업의 데이터는 전부 가상. 실제 프로젝트 키(PROJ-, COMMERCE-), 사람 이름, 사내 시스템명, 실제 파일 경로, 실제 이메일을 쓰지 않는다. TASK-101, ORDER-42, hello@example.com 같은 명백한 예시값.

## 17. Accessibility
- WCAG AA 기준. 글자와 fill 위 글자 4.5:1. 라이트의 상태 글자는 bg, surface-2, 자기 tint 위에서 4.6:1(반올림 전 color-mix 값으로 재도), 다크의 상태 글자는 4.5:1. 그래픽(스위치 on 트랙, 에이전트 원과 점, chart)과 의미 있는 경계선(input, 스위치 off 트랙) 3:1. brand-ink는 APCA Lc 60 이상도 함께 지킨다.
- 모든 인터랙션에 키보드로 닿는다. 리스트 row도 button. 화살표 키를 지원하지 않으면 listbox/option role을 쓰지 않고, 선택은 aria-pressed나 aria-current로 알린다. focus는 brand-ink 2px ring, offset 2.
- 오류 input은 aria-invalid + aria-describedby. focus를 받은 오류 input은 danger 2px. 스위치는 role=switch + aria-checked + label.
- 로딩 skeleton은 role=status와 화면에 보이지 않는 해요체 문장("불러오는 중이에요")으로 알린다.
- 터치 영역 24 이상, 모바일 44. reduced-motion이면 전환과 애니메이션 끔.

## 18. 대표 컴포넌트 스타일
- Button: primary = brand fill + brand-text + full radius, hover brand-hover. secondary = surface-2 fill + text 색 글자. ghost = 텍스트만. tint = brand-tint-2 fill + brand-tint-2-text, hover brand-tint-2-hover. 색조 면 위의 secondary 대용. outline 버튼 없음.
- Tag/Chip: full radius, 12px 500. 중립은 surface-2 fill + text-2. brand tag는 brand fill + brand-text, 상태 tag는 `*-fill` + `*-fill-text`.
- Card: surface fill, radius 12, padding 20, 그림자와 테두리 없음.
- Input: surface fill + line 1px(의미 있는 선), hover surface-2, focus brand-ink 2px, 오류 danger. radius sm(8).
- List item: 선택/hover는 row 배경 톤 변화로만.

## 19. AI에게 주는 한 줄 요약
"Pretendard에 본문 400, UI 500, 제목 600, 4배수 간격, 무채색 면의 톤 차이로 영역 구분, 장식용 선과 그림자와 카드 중첩 금지, radius는 full, lg 20, md 12, sm 8이고 중첩 시 바깥 r = 안쪽 r + padding, 유채색은 브랜드 색 하나에서 규칙으로 만든 brand 토큰뿐(fill은 흰 글자가 4.5:1을 넘는 가장 밝은 톤이고 밝은 브랜드는 검은 글자, 글자는 brand-ink), 단어 단위 줄바꿈에 한 줄 UI는 말줄임, 문장은 해요체에 버튼은 동사, em dash와 가운뎃점 금지, UI 문장에 monospace 금지, AA 대비, 에이전트 처리와 사람 결정은 모양이 다르고 brand fill은 에이전트 쪽이다."

## 20. 색 규칙: 브랜드 색 하나에서 나머지를 만든다
- 브랜드 색(시드) 하나를 넣으면 아래 규칙이 brand 스케일, 역할 토큰, 상태색, chart 색을 만든다. CLI(`npx pyospectui --brand`), 사이트의 테마 페이지, pyospect 초록 프리셋이 모두 같은 생성 코드를 쓴다.
- 규칙이 시드보다 앞선다. 시드가 규칙을 못 지키면 fill은 옮기고, 원래 색은 스케일 안에 남긴다. 규칙을 끄는 예외 옵션은 없다.
- 생성된 테마는 `:root`에 `--pyo-seed`로 시드를 기록한다. 나중에 같은 시드로 다시 만들 수 있다.

- R1. 시드: 색을 OKLCH(명도 L, 채도 C, hue h)로 읽는다. 채도 0.04 미만(회색에 가까운 색)은 받지 않는다. 무채색 브랜드는 다른 문법이다.
- R2. 스케일: 50~950의 11단계는 시드의 hue에서 정해진 명도와 채도 표로 만든다.
  - 명도: .97 .94 .89 .82 .75 .67 .59 .51 .43 .36 .27
  - 채도: .03 .06 .09 .12 .145 .15 .14 .12 .10 .08 .06에 (시드 채도 / 0.14, 최대 1.5)를 곱한다.
  - sRGB 밖으로 나가는 단계는 명도와 hue를 그대로 두고 채도만 줄인다.
- R3. fill과 그 위 글자: fill(600 자리)은 흰 글자가 4.5:1을 넘는 가장 밝은 톤이다. 시드가 그 톤과 거의 같으면(ΔE_OK .005 안) 시드를 한 글자도 바꾸지 않고 쓴다.
  - 밝은 브랜드는 검은 글자로 바뀐다. 시드가 그 톤보다 명도 0.12 넘게 밝으면(노랑, 호박, 라임처럼) 흰 글자 fill은 원래 색과 멀어지므로(노랑은 탁한 올리브가 된다), 시드를 그대로 fill로 두고 brand-text를 `#111111`로 바꾼다. `#111111`이 4.5:1에 못 미치면 fill을 조금 밝힌다.
- R4. 시드 고정: 시드가 fill이 아니면 명도가 가장 가까운 스케일 단계를 시드로 바꾼다. 정확한 브랜드 색이 필요한 곳(일러스트, 로고)은 그 단계를 쓴다.
- R5. hover: 흰 글자 모드면 한 단계 어두운 700, 라이트와 다크 모두. 검은 글자 모드면 시드 채도에서 명도를 .04 옮기고 `#111111` 4.5:1을 지킨다.
- R6. ink: 라이트는 bg, surface, surface-2, brand-tint 위에서 WCAG 4.5:1과 APCA Lc 60을 둘 다 넘는 가장 밝은 단계, 다크는 다크 면과 다크 tint 위에서 같은 조건을 넘는 가장 어두운 단계. 시험한 28개 hue 모두 700(라이트) / 300(다크)이 나온다.
  - brand-tint-2-text는 tint-2와 tint-2-hover 둘 다에서 4.5:1을 넘어야 한다. 그래서 라이트는 보통 한 단계 더 어두운 800, 다크는 300.
- R7. tint: 반투명이 아니라 불투명 `color-mix(in srgb, <단계> p%, var(--surface))`. 라이트는 500을 12%, 다크는 400을 14%에서 시작해 surface-2와 눈으로 구분될 때까지(ΔE_OK .0184 이상) 0.5%씩 올린다(최대 +12). tint-2는 p+10, tint-2-hover는 p+20.
- R8. graphic: brand-graphic은 fill이 bg와 surface 위에서 3:1을 넘으면 fill, 못 넘으면 ink. 밝은 노랑 fill은 흰 바탕에서 1.5:1 남짓이라 스위치 트랙과 점은 ink 톤으로 그린다. brand-graphic-text는 그 위에서 4.5:1을 넘는 글자색.
- R9. 상태색: 기본 hue는 ok 150, warn 65, danger 25. fill은 각 hue에서 흰 글자가 4.5:1을 넘는 경계 톤이고, fill 위 글자(`*-fill-text`)는 흰색.
  - 상태색은 브랜드와 30° 이상 떨어진다. 30° 안이면 자기 범위(ok 135~195, warn 45~95, danger 10~40) 안에서 브랜드와 다른 상태색 모두와 30° 이상 떨어지는 가장 가까운 hue로 옮기고 fill을 다시 푼다.
  - 범위 안에 그런 자리가 없으면(빨강 브랜드와 danger처럼) 가장 먼 자리에 두고 경고한다. 그때 뜻은 라벨이 전한다. Tag와 ValidationCard는 항상 글자를 같이 쓴다.
  - 상태 글자(`ok`, `warn`, `danger`)는 라이트에서 bg, surface-2, 그리고 자기 tint 위에서도 4.6:1을 넘는 가장 밝은 톤. tint는 8비트로 반올림한 값과 브라우저가 실제로 쓰는 반올림 전 color-mix 값 둘 다로 재고, 검사도 4.6으로 한다. 다크 글자는 원래 명도와 채도를 옮긴 hue에서 쓰고 4.5:1을 지킨다.
  - 라이트 `*-tint`는 `*-fill`에서, 다크 `*-tint`는 다크 글자색에서 섞는다.
- R10. chart: chart-1은 brand fill(3:1을 못 넘는 밝은 브랜드면 brand-graphic), chart-2~5는 브랜드 hue에서 72°씩 돌린 hue의 흰 글자 경계 톤. 모든 chart 색은 흰 바탕과 다크 surface 위에서 3:1을 넘어야 하고, 못 넘는 색은 넘을 때까지 명도를 옮긴다.

- 검사: 이 규칙들은 문장이 아니라 검사로 돈다. `npm run check`가 (1) pyospect 초록을 다시 만든 값이 `src/index.css`와 토큰 하나까지 같은지, (2) 배포되는 CSS의 글자와 바탕 쌍, fill과 fill-text, graphic, line이 기준을 넘는지, (3) 28개 hue와 모든 프리셋에서 대비 실패가 없는지 확인하고, 상태색 간격을 못 지킨 경우는 경고로 보여준다. 여백 감각이나 문장 톤처럼 판단이 필요한 규칙은 검사가 대신하지 못한다.
