# pyospectui

한국어 제품을 만드는 팀을 위한 디자인 시스템이에요. 브랜드 색 하나만 고르면 pyospect의 규칙이 나머지 색을 만들고 검사해요. 고경표(pyospect)가 만들고, shadcn 프로젝트에서 한 줄로 시작해요.

```bash
npx pyospectui
```

테마(pyospect 초록)와 컴포넌트 20개가 전부 들어와요. shadcn이 만든 기본 button처럼 pyospect 파일이 아닌 같은 이름의 파일이 있으면, CLI가 설치 전에 멈추고 `--overwrite`를 붙이라고 알려 줘요.

## 쓰는 법

```bash
npx pyospectui                           # 테마 + 컴포넌트 전부
npx pyospectui button card thinking      # 고른 컴포넌트만. v0.3 테마가 없는 프로젝트면 테마부터 넣어요
npx pyospectui --brand "#3366FF"         # 브랜드 색으로 테마를 만들고 컴포넌트 전부
npx pyospectui --brand "#3366FF" button  # 브랜드 색 테마 + 고른 컴포넌트
npx pyospectui --preset violet           # --brand 대신 미리 만든 프리셋 테마로 (--preset 보라도 돼요)
npx pyospectui presets                   # 프리셋 목록 (이름, 색, 채움 위 글자)
npx pyospectui theme                     # 테마만. 기록된 브랜드 색(--pyo-seed)으로 다시 만들어요
npx pyospectui theme --brand "#3366FF"   # 테마만. 브랜드 색을 바꿔요
```

| 옵션 | 하는 일 |
|---|---|
| `--brand "<hex>"` | 브랜드 색 하나로 테마를 만들어요. 모드(흰 글자나 검은 글자), fill, 대비표, 옮긴 상태색과 경고를 보여 준 뒤 설치해요. 회색에 가까운 색(OKLCH 채도 0.04 미만)은 받지 않아요. pyospect가 이미 있는 프로젝트에서 컴포넌트 이름 없이 쓰면 테마만 바꿔요. |
| `--preset <name>` | `--brand` 대신 미리 만든 테마를 써요. 기본은 pyospect(초록)이고, 목록은 `npx pyospectui presets`예요. pyospect가 이미 있는 프로젝트에서는 테마만 바꾸고 컴포넌트는 다시 받지 않아요. |
| `presets` | 프리셋 목록을 보여 줘요. 프리셋은 `presets/` 폴더의 파일이 전부예요. |
| `theme` | 컴포넌트 없이 테마만 넣어요. `--brand`가 없으면 CSS의 `--pyo-seed`를 읽어서 다시 만들어요. |
| `--cwd <dir>` | 다른 폴더의 프로젝트에 설치해요. 값은 컴포넌트 이름으로 읽지 않아요. |
| `--overwrite` | 이미 있는 같은 이름의 파일을 pyospect 것으로 바꿔요. 없이 실행했는데 pyospect 파일이 아닌 같은 이름의 파일이 있으면, shadcn의 덮어쓰기 질문에서 멈추지 않도록 CLI가 먼저 멈추고 알려 줘요. |
| 그 밖의 옵션 | 모르는 옵션과 `--` 뒤의 인자는 shadcn에 그대로 넘겨요. `--diff`, `--view`에 경로를 줄 때는 `--view=src/components/ui/card.tsx`처럼 `=`로 붙여요. |

환경변수 `PYOSPECTUI_REGISTRY`로 레지스트리 주소를 바꿀 수 있어요. 기본값은 `https://ui.pyospect.com/r/`이고, 로컬 서버로 시험할 때 써요.

```bash
PYOSPECTUI_REGISTRY=http://localhost:4173/r/ npx pyospectui button
```

## 알아 두면 좋아요

- 고를 수 있는 건 브랜드 색 하나예요. 규칙이 색보다 먼저라서, 흰 글자가 4.5:1을 못 넘는 색이면 fill을 가장 가까운 통과 톤으로 옮기고 넣은 색은 brand 스케일에 남겨요. 노랑처럼 밝은 색은 글자가 검은색으로 바뀌어요.
- 컴포넌트를 나중에 더 받아도 고른 브랜드 색은 그대로예요. 테마는 프로젝트 CSS에 v0.3 테마가 기록하는 `--pyo-seed`가 없을 때만 넣어요. `--brand`만 있는 예전 pyospect 테마(또는 앱이 직접 정한 `--brand`)는 새 컴포넌트가 쓰는 토큰이 없어서 테마도 같이 받아요.
- 설치가 끝나면 프로젝트 CSS에 테마가 정말 들어갔는지(`--pyo-seed`) 확인하고, 아니면 0이 아닌 코드로 끝나요. `index.html`에 Pretendard가 없으면 넣을 줄도 알려 줘요.
- `--brand`로 만든 테마 파일은 임시 폴더 안의 새 폴더(mkdtemp)에 쓰고 끝나면 지워요.
- `npx pyospectui`를 다시 실행하면 기록된 브랜드 색(`--pyo-seed`)으로 테마를 만들어요. 초록으로 돌아가려면 `--preset pyospect`예요.
- 같은 색이면 `--brand`로 만든 테마와 프리셋 테마의 CSS 변수가 같아요. 둘 다 `theme/generate.mjs`와 `theme/base.json`으로 만들어요.
- 설치는 `npx --yes shadcn@~4.21 add ...`로 해요. shadcn 버전마다 덮어쓰기 규칙이 달라서 4.21로 고정했어요.
- `shadcn apply`로 테마를 바꿀 때는 꼭 `--only theme`를 붙여요. 빼면 shadcn과 이름이 같은 컴포넌트(button, input, card 등)를 shadcn 것으로 덮어써요.
- Node.js 18 이상에서 돌아가요.

규칙은 https://ui.pyospect.com/TASTE.md, 프리셋 목록과 값은 https://ui.pyospect.com/themes/index.md, 테마 미리보기는 https://ui.pyospect.com/#/themes, 데모는 https://ui.pyospect.com 이에요.
