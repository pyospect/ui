# 한국어 첫 화면 리디자인 검토

2026-11-24, `codex/korean-first-screen`. 기준 커밋은 `origin/main`의 `87f1490`입니다.

## 실행

```sh
npm ci
npm run dev -- --host 127.0.0.1 --port 5174 --strictPort
```

주소는 <http://127.0.0.1:5174/ui/>입니다. 첫 화면의 **화면에서 직접 써보기**로 대표 예시에 이동할 수 있습니다.

## 구현한 범위

- 개인 소개와 전체 카탈로그를 길게 나열하던 홈을 소개, 대표 설정 데모, 설치 안내 중심으로 정리했습니다. 기존 컴포넌트 문서와 테마 편집기는 연결해 두었습니다.
- Pretendard 500, 제목 36px/1.2, 소개문 16px/1.8을 유지했습니다. 랜딩에는 56px 섹션 여백을, 실제 폼에는 12~14px 글자와 16px 필드 간격, 40~44px 컨트롤을 적용했습니다. 데스크톱은 필드를 두 열로, 모바일은 읽을 수 있는 폭에 맞춰 배치합니다.
- 같은 가상 워크스페이스의 설정을 라이트와 다크에서 함께 보여줍니다. 이름, 이메일, 언어, 시간대, 활동 요약 선택, 저장과 되돌리기, 오류 안내가 실제로 동작하며 두 화면이 상태를 공유합니다. 저장은 현재 화면의 메모리 안에서만 유지됩니다.
- `resolveBrand`, `theme.vars.light/dark`, `varStyle`, `theme.contract`를 재사용했습니다. 프리셋이나 직접 입력한 브랜드 색은 데모 두 장에 함께 적용되며, 주변 사이트의 색은 바꾸지 않습니다. 테마 페이지로 이동하면 선택한 색을 전달합니다.
- 기존 Button, Input/Field/Label/Help, Radix Select를 사용했습니다. 팝업도 각 데모의 테마 범위에 포털로 렌더링합니다. 저장이 필요한 폼이라 활동 요약에는 네이티브 checkbox를 사용했습니다.
- 각 버튼 옆에 실제 생성 토큰의 대비를 표시하고, 밝은 글자와 어두운 글자를 고르는 이유를 문장과 샘플로 보여줍니다. 잘못된 색이나 저채도 색은 안내하고 마지막 유효 테마를 유지합니다.
- npm 패키지 `pyospectui`, 버전 `0.4.0`, 기존 레지스트리 경로와 엔진은 유지했습니다.

## 실제 화면과 모바일

로컬의 별도 headless Chromium 프로필로 확인했습니다. 사용자의 브라우저 세션은 사용하지 않았습니다.

| 확인 | 결과 |
| --- | --- |
| 화면 폭과 높이 | 320×568, 390×844, 768×800, 1024×640, 1440×1100 |
| 사이트 테마 | 위 다섯 크기 모두 라이트와 다크에서 확인 |
| 넘침 | 페이지와 데모 내부 가로 넘침 없음, 폼 컨트롤이 화면 밖으로 벗어나지 않음 |
| 글꼴 | Pretendard Variable의 한글 글리프 로드, weight 500 확인 |
| 상태 | 같은 입력값, 저장, 되돌리기, 비활성 버튼, 빈 이름과 잘못된 이메일의 오류 상태 확인 |
| 이동 | 데모 바로가기와 테마 페이지 연결에서 선택한 브랜드 유지, 문서 진입과 홈 복귀 확인 |
| 오류 | 검증 중 브라우저 pageerror 및 console error 0개 |

캡처: [대표 데모](./review/2026-11-24/demo-blue.png), [데스크톱 기본색](./review/2026-11-24/desktop-neutral.png), [파랑](./review/2026-11-24/desktop-blue.png), [라임](./review/2026-11-24/desktop-lime.png), [320px 라이트](./review/2026-11-24/mobile-320-light.png), [390px 다크](./review/2026-11-24/mobile-390-dark.png), [모바일 다크 팝업](./review/2026-11-24/mobile-dark-select.png), [입력 오류](./review/2026-11-24/validation-error.png).

## 키보드와 포커스

- Tab 순서가 이름 → 이메일 → 언어 → 시간대 → checkbox → 저장 버튼으로 이어집니다. 비활성 되돌리기는 건너뜁니다. checkbox는 Space로 전환됩니다.
- Select는 Enter로 열리고, Home/방향키/Enter로 선택하며, 비활성 항목을 선택하지 않습니다. Escape로 닫은 뒤 트리거로 포커스가 돌아옵니다. 두 테마에서 확인했습니다.
- 저장 시 잘못된 첫 필드로 포커스를 옮기고 연결된 한국어 오류 설명을 제공합니다.
- 본문 건너뛰기를 반복 실행해도 main으로 포커스가 이동합니다. 버튼 focus는 2px/offset 2px, Input의 focus는 2px 안쪽 선으로 확인했습니다.
- 모바일 폼의 주요 컨트롤과 브랜드 선택은 44px 이상입니다. reduced-motion에서 transition duration이 0s로 적용됩니다.

## 대비

계약 검사와 별도로 실제 브라우저의 계산된 색을 읽어 WCAG 대비를 확인했습니다. 데모의 제목, 라벨, 입력값, 도움말, 상태, 저장 버튼과 대비 안내의 28개 텍스트 요소를 7개 상태에서 측정했습니다. 비활성 버튼은 이 측정에 포함하지 않았습니다.

| 버튼 배경 | 라이트 글자 대비 | 다크 글자 대비 | 글자색 |
| --- | --- | --- | --- |
| 기본 neutral | 17.18:1 | 16.44:1 | 모드별 밝은 글자 / 어두운 글자 |
| 파랑 | 4.54:1 | 4.54:1 | 밝은 글자 |
| 파랑 hover | 5.72:1 | 5.72:1 | 밝은 글자 |
| 라임 | 13.63:1 | 13.63:1 | 어두운 글자 |
| 직접 입력 `#3366FF` | 4.52:1 | 4.52:1 | 밝은 글자 |

일반 텍스트 기준 4.5:1을 모두 충족했습니다. 직접 입력한 seed와 실제 버튼의 채움 색은 생성기의 대비 조정 때문에 달라질 수 있습니다. 전역 테마를 다크로 바꿔도 라이트 데모의 계산된 면과 색은 유지됩니다. 상태는 색뿐 아니라 문장과 아이콘으로 구분합니다.

## 동심형 모서리 실측

320px 다크 화면의 열린 Select와 두 저장 버튼을 브라우저에서 측정했습니다.

```sh
npm run check:geometry -- docs/review/2026-11-24/geometry.json
```

3개 측정 모두 통과했습니다. 팝업 바깥 24px − 실제 간격 4px = 항목 안쪽 20px이며, 44px 저장 버튼의 유효 pill 반경은 22px입니다. 결과는 이 측정 대상에 한정됩니다.

## 빌드와 기존 검사

- `npm run build`: TypeScript와 Vite production build 통과.
- `npm run check`: theme contract, taste lint, 카탈로그 링크, 기존 node 테스트 7개 통과. 368개 seed에서 32,752개 생성 토큰 검사 실패 0. 기존 상태색 hue 간격 경고 48개는 대비 실패가 아닙니다.
- `node scripts/version-check.mjs`: `0.4.0`과 `https://ui.pyospect.com/r/v0.4.0/` 일치.
- `npm run check:geometry -- docs/review/2026-11-24/geometry.json`: 실측 3개 통과.
- `npm run registry:build`: 통과. 생성 후 `registry.json`, `theme/base.json`, `public/themes`, DESIGN/TASTE 복사본의 Git 변경 없음.
- `bash scripts/e2e-install.sh`: 통과. 임시 새 Vite 앱에서 전체 설치, 컴포넌트 재설치, 프리셋 교체, 직접 입력한 파랑과 노랑, `--cwd`, 저채도 거절, 구형 테마 갱신과 생성 앱 빌드를 확인했습니다.
- `E2E_TEMPLATE=<위 검사에서 만든 base/app> bash scripts/e2e-release-compat.sh`: 통과. 배포된 `0.2.0`과 현재 소스를 pack한 `0.4.0`을 각각 임시 프로젝트에 설치하고 빌드했습니다. 구형 `/r/`의 초록 테마와 `/r/v0.4.0/`의 neutral 테마가 각자 유지됩니다. npm publish는 수행하지 않았습니다.

설치 검사의 명령과 결과는 [install-checks.json](./review/2026-11-24/install-checks.json)에 기록했습니다.
최종 로컬 검사 출력도 [build.log](./review/2026-11-24/build.log), [check.log](./review/2026-11-24/check.log), [geometry.log](./review/2026-11-24/geometry.log)에 남겼습니다.

## 브라우저 검사 재현

검증 코드는 [scripts/review-home.mjs](../scripts/review-home.mjs)입니다. 프로젝트 의존성을 변경하지 않고 기존 로컬 Playwright 런타임을 재사용했습니다. Playwright와 해당 Chromium이 있는 환경에서 다음처럼 실행합니다.

```sh
# playwright가 일반 node module로 설치된 환경
node scripts/review-home.mjs

# 별도 경로에 설치된 런타임을 사용할 때
PLAYWRIGHT_MODULE=file:///absolute/path/node_modules/playwright/index.mjs \
  node scripts/review-home.mjs
```

`REVIEW_URL`, `REVIEW_OUTPUT`, `CHROMIUM_EXECUTABLE`로 서버, 출력 경로, 브라우저 실행 파일을 바꿀 수 있습니다. 9개 시나리오의 전체 결과, 196개 텍스트 대비 실측, 화면 폭별 데이터는 [browser-results.json](./review/2026-11-24/browser-results.json)에 있습니다. 테스트는 실패 시 종료 코드가 0이 아니며 결과 JSON을 남깁니다.

수동 스크린리더와 실제 휴대전화 테스트, 전체 컴포넌트 카탈로그의 시각 재검수는 이번 검토 범위에 포함하지 않았습니다.
