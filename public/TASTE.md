# pyospectui Taste Rules (draft v0.3)

포트폴리오(2026 리뉴얼) + 본인 진술에서 추출. AI가 그대로 따를 수 있게 "금지/허용"으로 씀.

## 1. Grid: 4배수
- 모든 spacing / font-size / line-height / radius / icon size는 4의 배수.
- 간격 스케일: `4 8 12 16 20 24 32 40 48 64`. 6, 10, 14 같은 값 금지.
- 글자 크기는 12 / 14 / 16 / 20 / 28 / 40. 14만 4배수가 아닌 유일한 예외이고, 줄 높이 20이 리듬을 지킨다. 선 굵기(1, 2)는 간격이 아니라 규칙 대상이 아니다.

## 2. Type: Pretendard, weight 셋
- font-family: Pretendard Variable, 폴백 system-ui.
- weight는 400 / 500 / 600만. 700 이상 금지. 본문 기본은 500.
- 위계는 size 점프보다 "색 톤 + weight"로 낸다. 제목 = 흰색/검정 600, 본문 = 회색 400~500.
- 카드와 패널의 헤더는 14px 600에 text 색(라이트 검정, 다크 흰색). 본문(text-2)과 굵기와 톤 둘 다로 구분한다.
- 섹션 라벨 패턴: 작은 회색 라벨(Case 01) + 한 줄 아래 굵은 흰색 소제목.
- line-height는 국문 기준 1.5~1.6, 4배수로 맞춘 px 값 (예: 16px → 24px).

## 3. Color: neutral 베이스 + brand 1개
- 유채색 이름은 문서와 코드 모두 `brand`. (shadcn의 `accent`는 hover 배경이라 그 이름을 쓰지 않는다.) shadcn 표준 변수(background, primary, muted, border...)는 전부 pyospect 토큰에 매핑돼 있어서 shadcn 기본 컴포넌트도 같은 표정이 난다.
- 베이스는 무채색 램프 하나. 색기 없는 순수 gray (blue-tint 금지).
  - light: bg `#FAFAFA`, surface `#FFFFFF`, surface-2 `#F2F2F3`, surface-3 `#E6E6E8`
  - dark: bg `#0C0C0C`, surface `#161616`, surface-2 `#1F1F1F`, surface-3 `#2A2A2A`
  - text 3단계: light `#111111` / `#5C5C5F` / `#6F6F73`, dark `#F5F5F5` / `#A3A3A6` / `#8E8E92`. 전부 AA 4.5:1 이상.
  - line 토큰 하나: light `#767676`, dark `#7A7A7E`. 의미 있는 선(input, 스위치 off 트랙, focus)에만.
- 유채색 스케일은 brand 하나. 따뜻한 초록(OKLCH hue 152): 50 `#E7FBEB` 100 `#CEF7D8` 200 `#AEECBE` 300 `#86DB9D` 400 `#5CC87F` 500 `#3AAF65` 600 `#269451` 700 `#1E7942` 800 `#175F33` 900 `#144927` 950 `#0A2F17`. Tailwind에는 `brand`로 등록하고, 기본 팔레트의 다른 유채색은 쓰지 않는다.
- brand는 두 역할: `brand`(채움) = brand-600 `#118846`, 흰 글씨가 AA를 딱 넘기는(4.53) 가장 밝은 초록. 라이트와 다크 공통. `brand-ink`(surface 위 글자, 링크, 선택 텍스트, focus) = light brand-700 / dark brand-300. brand-500 이상 밝은 초록에는 흰 글씨 금지.
- brand는 버튼 primary, 선택 상태, 링크, 진행 표시 외에는 쓰지 않는다.
- tint(brand-tint, 상태 tint)는 rgba 반투명이 아니라 `color-mix`로 surface에 섞은 불투명 단색. 반투명이면 뒤의 선이나 콘텐츠가 비쳐서 어색해진다.
- 색조 있는 면(brand-tint 카드 등) 위에는 뉴트럴 회색 채움(secondary 버튼, surface-2 조각)을 올리지 않는다. 그 자리에는 brand를 조금 더 섞은 tint 버튼(brand-tint-2 + brand 글자)이나 ghost.
- 상태색은 success / warning / danger 3개. brand와 같은 방식으로 OKLCH에서 뽑았다(hue 150 / 70 / 25, brand-600과 같은 명도): light와 pill fill `#1E8843` / `#AC6600` / `#CE4846`(흰 글자 4.5 이상), dark 글자와 점 `#67D283` / `#F4A437` / `#FF8079`. 색 있는 pill은 단색 채움 + 흰 글자. pill fill은 두 테마 공통으로 light 상태색을 쓴다. 다크의 밝은 상태색은 글자와 점에만. 반투명 tint pill은 눈에 안 들어오므로 금지. tint는 면(선택 row, 카드, 완료 원)에만.

## 4. Surface: 선보다 면
- 영역 구분의 기본은 border가 아니라 surface 톤 차이 한 단계 (bg → surface → surface-2).
- border는 "장식"으로는 쓰지 않는다. UI적으로 의미가 있을 때만 쓴다: 선택됨, focus ring, 오류 상태, 드래그 대상 등.
- 단순 구획, 카드 외곽, 리스트 구분선에는 border 금지. 여백(12~20px)이나 톤 차이로 대신한다.

## 5. Elevation: 그림자 거의 없음
- light 모드: shadow는 overlay(dialog, popover, dropdown)에만. `0 4px 12px rgba(0,0,0,.08)` 이하.
- dark 모드: shadow 금지. 떠 있는 표면은 surface 톤을 한 단계 올리거나, 아주 약한 glow(흰색 4~8%)로 표현.
- 카드에 그림자 금지. 카드는 surface 색으로만 존재한다.

## 6. Depth: 2겹까지
- 중첩은 bg → surface 까지. 카드 안에 카드 금지.
- 카드 안에서 그룹이 필요하면 surface-2 톤의 "면"으로만 표시하고, 그것도 한 단계까지만.
- 3겹이 필요하다고 느껴지면 정보 구조를 다시 나눈다 (탭, 스텝, 섹션 분리).
- 테이블, 리스트, 카드처럼 그 자체가 surface인 컴포넌트는 패널 안에 넣지 않는다. bg 위에 바로 놓고 제목과 설명은 패널 밖 텍스트로. 같은 톤이 두 겹 겹치면 경계가 사라진다.

## 7. Radius: full 아니면 작게, 중첩은 a+b=c
- 두 tier만: `full`(9999) 과 `md`(12). 필요시 `sm`(8).
- pill, tag, chip, 아이콘 버튼, avatar, 토글 = full.
- card, input, dialog, dropdown = md(12). 큰 패널(sheet, modal)은 20.
- 4, 6, 16, 24 같은 중간값 금지.
- **중첩 라운드 규칙 (a+b=c): 바깥 요소 radius = 안쪽 요소 radius + 둘 사이 padding.**
  - 절곡 판재의 "외부 R = 내부 R + 판 두께"와 같은 원리. 코너에서 여백이 갑자기 두꺼워 보이지 않게 한다.
  - 예: 스위치 핸들 20 + padding 4 → 트랙 28, 폭 48. 둘 다 full. (padding도 4배수)
  - 예: 카드 안 이미지 radius 8 + padding 4 → 카드 radius 12. 카드 padding이 20이면 이미지 radius는 12 - 20 < 0 이므로 이미지는 각지게(0).
  - 안쪽 radius가 0 이하로 계산되면 안쪽은 각지게 둔다. 바깥보다 안쪽 radius가 큰 조합 금지.

## 8. Text: 단어 단위, 한 줄 UI는 말줄임
- 줄바꿈은 단어 단위로만 (`word-break: keep-all`). 단어 중간에서 끊지 않는다.
- 태그, 버튼, 제목, 폼 라벨, 리스트 라벨처럼 한 줄일 때 예쁜 UI는 두 줄로 꺾지 않는다. 넘치면 말줄임표(`nowrap + ellipsis`).
- 라벨 + 컨트롤(스위치, 버튼, 체크박스) 쌍은 flex-wrap 없이 한 줄. 좁으면 컨트롤은 그대로 두고 라벨이 먼저 말줄임된다. 두 줄로 갈라지는 건 금지.
- 콘텐츠가 카드나 컨테이너 밖으로 나가는 것은 가장 나쁘다. 컨테이너는 `min-width: 0`, 넘치는 건 잘라내거나 줄임표.
- 본문(설명, 문단)만 여러 줄 허용. 짧은 문단은 너비 제한 없이 컨테이너 폭을 그대로 쓴다. 긴 문서 본문만 최대 폭을 두되 ch가 아니라 px(640~720)로. 마지막 줄 고아 단어는 `text-wrap: pretty`.

## 9. Writing: 친절하게 풀어쓴 해요체
- UI 문장은 해요체. 명사로 끝내지 않는다. "저장 완료" 대신 "저장했어요", "유효하지 않은 이메일 형식" 대신 "이메일 주소를 다시 확인해 주세요".
- 영어 직역 말투 금지. "성공적으로 삭제되었습니다", "권한이 요구됩니다", "정말로 삭제하시겠습니까?" 같은 문장은 쓰지 않는다.
- 오류는 무엇이 잘못됐고 어떻게 하면 되는지 한 문장. 사과나 "에러가 발생했습니다" 금지.
- 버튼은 동사로 끝난다: 저장하기, 보내기, 작성하기. "확인 / 취소"처럼 뜻 없는 라벨 금지. dialog 제목은 질문이고 primary 버튼이 그 답.
- 숫자는 tabular에 콤마와 단위(479,100원), 날짜는 ISO(2025-06-10), 상대시간은 "3분 전", 로딩은 "불러오는 중이에요".
- em dash(—), 가운뎃점(·)을 쓰지 않는다. 나열은 쉼표, 구분은 콜론이나 마침표.
- monospace는 UI 문장에는 없다. 코드, diff, 파일 경로, 토큰 값에만 JetBrains Mono(400/500, 12px).

## 10. Interaction: 절제
- transition은 120ms ease-out 하나. 색/투명도만 애니메이션, 크기 변화 금지.
- hover는 surface 한 단계 밝게(dark) / 어둡게(light). 그림자나 테두리로 hover 표현 금지.
- selected는 brand tinted-bg(10%) + brand-ink text, 필요하면 brand-ink 1px border 추가. 의미 있는 상태에는 border를 쓴다.

## 11. Icon
- Lucide, 선 굵기 1.5, 크기 16(인라인)과 20(버튼, 리스트). 채운 아이콘 금지. 항상 옆 글자와 같은 색.

## 12. Layout
- 왼쪽 정렬이 기본. 가운데 정렬은 페이지 hero, 인용문, 빈 화면의 짧은 한 줄에만. hero는 위아래 48/32로 넓게 잡고 소개문은 720 폭.
- 문서 hero는 시스템 요약이 아니라 만든 사람의 이야기: 누구인지, 왜 만드는지. hero 문장은 본문 크기(14/24)에 폭 640, 위아래 여백 64.
- hero 줄바꿈 예외: 잘 읽혀야 하므로 쉼표(,)와 마침표(.) 뒤에서만 줄이 바뀐다. 절 단위를 `inline-block`으로 묶는다. 이 예외는 hero에만, 본문은 단어 단위 그대로. 브랜드 문장 "생각한 것을 직접 만든다. 쓰는 사람이 이해하고 결정하기 쉽게 다듬는다"와 "기술이 삶에 닿는 마지막 한 뼘"을 축으로.
- 컨테이너 폭은 720(읽기), 1040(앱), 1280(테이블 많은 화면) 셋 중 하나. 좌우 여백 모바일 16, 데스크톱 24.
- 브레이크포인트 640, 1024. 모바일 터치 영역 44 이상.
- 폼: 라벨은 항상 input 위. placeholder는 예시만, 설명은 help 줄. 오류 문구는 help 자리.
- 테마: 제품 UI는 라이트 기본. 다크는 같은 토큰으로 자동. 다크 카드는 6% 흰색 glow 한 겹.

## 13. Data와 상태
- 테이블: 숫자 우측 정렬에 tabular, 행 사이 선 없음, hover는 배경 톤, 헤더는 surface-2. 상태는 pill, 안내는 아이콘 + 회색 한 줄. 넓은 표는 컨테이너 안에서만 가로 스크롤.
- 로딩은 회색 바 skeleton. 빈 상태는 제목 한 줄 + 설명 한 줄 + 버튼 하나. 일러스트 없음.
- Dialog는 되돌릴 수 없거나 다음 단계가 갈리는 결정에만. 되돌릴 수 있는 결과는 toast.

## 14. AI 협업 패턴 (이 시스템만의 컴포넌트)
- Thinking: 접히는 생각 블록. 진행 중이면 brand 점이 천천히 깜빡이고, 끝나면 제목이 과거형("25초 동안 생각했어요"). 본문은 text-2, 강조 없음.
- Connection: 도구 연결 상태 리스트. 연결됨은 ok 점, 미연결은 line 테두리의 빈 점 + "연결하기" ghost 버튼.
- Validation: 제목, 이유 한 줄(말줄임), 오른쪽에 상태 pill(통과 / 확인 필요 / 실패). 패널 안에 놓이는 조각이라 surface-2, glow 없음.
- Decision: 에이전트가 만든 결과물 한 줄 + 다음 갈림길 버튼 둘. 방향이 갈리는 순간은 사람이 눌러야 넘어간다.
- Steps: 채운 원 = 에이전트가 처리, 점선 원 = 사람이 결정, tint 원 = 완료. 항상 범례를 같이 보여준다.
- Diff: 본문 서체, 추가/삭제는 tint 배경만. 파일 경로 헤더에 +n -n.
- Versions: 현재 버전만 tint. 나머지는 면 없음.
- Chat: 사람은 brand 말풍선(오른쪽), 에이전트는 surface-2 말풍선(왼쪽). 꼬리 쪽 radius만 sm.
- 원칙: 에이전트가 처리한 것과 사람이 결정할 것은 항상 모양이 다르다.

## 15. AI-Ready 문서 형식 (컴포넌트마다 다섯 줄)
- Naming: 이름에 위계가 들어간다 (Button/Primary).
- Variant: hierarchy, size, state, icon 네 축까지만.
- Token: raw 값 금지, 의미 토큰만.
- Structure: 무엇이 무엇 안에 들어갈 수 있는지.
- Usage Rule: 언제 무엇을 쓰는지 한두 문장.

## 16. 데이터와 보안
- 데모, 문서, 목업의 데이터는 전부 가상. 실제 프로젝트 키(PROJ-, COMMERCE-), 사람 이름, 사내 시스템명, 실제 파일 경로, 실제 이메일을 쓰지 않는다. TASK-101, ORDER-42, hello@example.com 같은 명백한 예시값.

## 17. Accessibility
- WCAG AA 기준. 글자, brand, 상태색 4.5:1. 의미 있는 경계선(input, 스위치 트랙) 3:1은 line 토큰으로.
- 모든 인터랙션에 키보드로 닿는다. 리스트 row도 button. focus는 2px ring, offset 2.
- 오류 input은 aria-invalid + aria-describedby. 스위치는 role=switch + aria-checked + label.
- 터치 영역 24 이상, 모바일 44. reduced-motion이면 전환과 애니메이션 끔.

## 18. 대표 컴포넌트 표정
- Button: primary = brand 채움 + 검정 글씨 + full radius. secondary = surface-2 채움 + primary text. ghost = 텍스트만. tint = brand-tint-2 채움 + brand 글자, 색조 면 위의 secondary 대용. outline 버튼 없음.
- Tag/Chip: full radius, 12px 500. 중립은 surface-2 채움 + text-2. 상태와 brand tag는 단색 채움 + 흰 글자.
- Card: surface 채움, radius 12, padding 20, 그림자·테두리 없음.
- Input: surface 채움 + line 1px(의미 있는 선), hover surface-2, focus brand-ink 2px. radius 8.
- List item: 선택/hover는 row 배경 톤 변화로만.

## 19. AI에게 주는 한 줄 요약
"Pretendard 500, 4배수 간격, 무채색 표면 톤 차이로 영역 구분, 장식용 선과 그림자와 카드 중첩 금지, radius는 full 아니면 12이고 중첩 시 바깥 r = 안쪽 r + padding, brand는 따뜻한 초록 brand 스케일 하나(채움은 500에 검정 글자, 글자는 700), 단어 단위 줄바꿈에 한 줄 UI는 말줄임, 문장은 해요체에 버튼은 동사, em dash와 가운뎃점과 monospace 금지, AA 대비, 에이전트 처리와 사람 결정은 모양이 다르다."
