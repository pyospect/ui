# pyospectui 프리셋

scripts/build-registry.mjs가 packages/pyospectui/presets 폴더에서 만든 목록이에요. 프리셋 12개가 모두 같은 규칙(https://ui.pyospect.com/TASTE.md §20)으로 만들어졌고, 하나가 테마 하나예요. pyospect가 이미 있는 프로젝트에서 프리셋을 바꾸면 CSS 변수만 바뀌고 컴포넌트는 그대로예요.

| 프리셋 | 이름 | 브랜드 색 | 채움 | 채움 위 글자 | 알려 드릴 점 | 바꾸는 명령 |
|---|---|---|---|---|---|---|
| [pyospect](https://ui.pyospect.com/themes/pyospect.md) | 뉴트럴 | `#171717` | `#171717` | 흰 글자 | 0개 | `npx pyospectui --preset pyospect` |
| [red](https://ui.pyospect.com/themes/red.md) | 빨강 | `#D34342` | `#D34342` | 흰 글자 | 2개 | `npx pyospectui --preset red` |
| [orange](https://ui.pyospect.com/themes/orange.md) | 주황 | `#BC5A29` | `#BC5A29` | 흰 글자 | 2개 | `npx pyospectui --preset orange` |
| [amber](https://ui.pyospect.com/themes/amber.md) | 호박 | `#FFB020` | `#FFB020` | 검은 글자 | 4개 | `npx pyospectui --preset amber` |
| [yellow](https://ui.pyospect.com/themes/yellow.md) | 노랑 | `#FCCA21` | `#FCCA21` | 검은 글자 | 3개 | `npx pyospectui --preset yellow` |
| [lime](https://ui.pyospect.com/themes/lime.md) | 라임 | `#BCEB56` | `#BCEB56` | 검은 글자 | 3개 | `npx pyospectui --preset lime` |
| [mint](https://ui.pyospect.com/themes/mint.md) | 민트 | `#11866F` | `#11866F` | 흰 글자 | 1개 | `npx pyospectui --preset mint` |
| [sky](https://ui.pyospect.com/themes/sky.md) | 하늘 | `#0480A9` | `#0480A9` | 흰 글자 | 0개 | `npx pyospectui --preset sky` |
| [blue](https://ui.pyospect.com/themes/blue.md) | 파랑 | `#2679C5` | `#2679C5` | 흰 글자 | 0개 | `npx pyospectui --preset blue` |
| [indigo](https://ui.pyospect.com/themes/indigo.md) | 남색 | `#526DE4` | `#526DE4` | 흰 글자 | 0개 | `npx pyospectui --preset indigo` |
| [violet](https://ui.pyospect.com/themes/violet.md) | 보라 | `#7E61DF` | `#7E61DF` | 흰 글자 | 0개 | `npx pyospectui --preset violet` |
| [pink](https://ui.pyospect.com/themes/pink.md) | 분홍 | `#C44696` | `#C44696` | 흰 글자 | 0개 | `npx pyospectui --preset pink` |

shadcn 명령으로는 `npx shadcn add https://ui.pyospect.com/r/v0.4.0/theme-<프리셋>.json`이에요. 목록에 없는 색은 `npx pyospectui --brand "#RRGGBB"`로 만들어요.
