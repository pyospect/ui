# 하늘 테마 (sky)

scripts/build-registry.mjs가 만든 파일이에요. 규칙은 https://ui.pyospect.com/TASTE.md 의 §20에 있고, 여기에는 그 규칙이 이 브랜드 색에서 만든 값과 대비 검사 결과가 있어요.

- 시드: `#0480A9`
- 모드: 흰 글자 (채움 위 글자 `#FFFFFF`)
- 채움: `#0480A9` (brand-600), 시드 그대로예요
- 상태색 hue: danger 25°, warn 65°, ok 150°
- 설치: `npx pyospectui --preset sky` 또는 `npx shadcn add https://ui.pyospect.com/r/theme-sky.json`

## 알려 드릴 점

- 없어요. 상태색이 브랜드와 30° 넘게 떨어져 있고, 모든 조합이 기준을 넘어요.

## 브랜드 스케일

| step | hex |
|---|---|
| brand-50 | `#EAF8FF` |
| brand-100 | `#D4F0FF` |
| brand-200 | `#ADE4FF` |
| brand-300 | `#80D0F6` |
| brand-400 | `#54BBE8` |
| brand-500 | `#30A2D0` |
| brand-600 | `#0480A9` 채움 |
| brand-700 | `#166F92` |
| brand-800 | `#115773` |
| brand-900 | `#0F4358` |
| brand-950 | `#072A39` |

## 토큰

| 토큰 | 라이트 | 다크 |
|---|---|---|
| brand | `#0480A9` | `#0480A9` |
| brand-text | `#FFFFFF` | `#FFFFFF` |
| brand-hover | `#166F92` | `#166F92` |
| brand-ink | `#166F92` | `#80D0F6` |
| brand-tint | `#E4F3F9` | `#1F2D33` |
| brand-tint-2 | `#CFEAF4` | `#253E48` |
| brand-tint-2-hover | `#BBE0EF` | `#2B4E5D` |
| brand-tint-2-text | `#115773` | `#80D0F6` |
| brand-graphic | `#0480A9` | `#0480A9` |
| brand-graphic-text | `#FFFFFF` | `#FFFFFF` |
| ok | `#087D39` | `#67D283` |
| warn | `#9B5B00` | `#F4A437` |
| danger | `#C13C3B` | `#FF8079` |
| ok-fill | `#1E8843` | `#1E8843` |
| warn-fill | `#AC6600` | `#AC6600` |
| danger-fill | `#CE4846` | `#CE4846` |
| ok-fill-text | `#FFFFFF` | `#FFFFFF` |
| warn-fill-text | `#FFFFFF` | `#FFFFFF` |
| danger-fill-text | `#FFFFFF` | `#FFFFFF` |
| ok-tint | `#E9F3EC` | `#213025` |
| warn-tint | `#F5EDE0` | `#352A1B` |
| danger-tint | `#FAEDED` | `#372524` |
| chart-1 | `#0480A9` | `#0480A9` |
| chart-2 | `#8B63BF` | `#8B63BF` |
| chart-3 | `#C05363` | `#C05363` |
| chart-4 | `#967100` | `#967100` |
| chart-5 | `#008854` | `#008854` |

## 대비 검사

164개 조합 중 164개가 기준을 넘어요. 8비트 값과 반올림 전 값 중 나쁜 쪽으로 쟀어요.

| 테마 | 조합 | 종류 | 값 | 기준 | 결과 |
|---|---|---|---|---|---|
| 라이트 | card-foreground on card | WCAG | 18.88 | 4.5 | 통과 |
| 라이트 | popover-foreground on popover | WCAG | 18.88 | 4.5 | 통과 |
| 라이트 | primary-foreground on primary | WCAG | 4.50 | 4.5 | 통과 |
| 라이트 | secondary-foreground on secondary | WCAG | 16.88 | 4.5 | 통과 |
| 라이트 | muted-foreground on muted | WCAG | 5.96 | 4.5 | 통과 |
| 라이트 | accent-foreground on accent | WCAG | 16.88 | 4.5 | 통과 |
| 라이트 | destructive-foreground on destructive | WCAG | 4.53 | 4.5 | 통과 |
| 라이트 | sidebar-foreground on sidebar | WCAG | 18.88 | 4.5 | 통과 |
| 라이트 | sidebar-primary-foreground on sidebar-primary | WCAG | 4.50 | 4.5 | 통과 |
| 라이트 | sidebar-accent-foreground on sidebar-accent | WCAG | 16.88 | 4.5 | 통과 |
| 라이트 | brand-text on brand | WCAG | 4.50 | 4.5 | 통과 |
| 라이트 | brand-text on brand-hover | WCAG | 5.64 | 4.5 | 통과 |
| 라이트 | brand-tint-2-text on brand-tint-2 | WCAG | 6.34 | 4.5 | 통과 |
| 라이트 | brand-tint-2-text on brand-tint-2-hover | WCAG | 5.70 | 4.5 | 통과 |
| 라이트 | brand-graphic-text on brand-graphic | WCAG | 4.50 | 4.5 | 통과 |
| 라이트 | ok-fill-text on ok-fill | WCAG | 4.51 | 4.5 | 통과 |
| 라이트 | warn-fill-text on warn-fill | WCAG | 4.51 | 4.5 | 통과 |
| 라이트 | danger-fill-text on danger-fill | WCAG | 4.53 | 4.5 | 통과 |
| 라이트 | foreground on background | WCAG | 18.09 | 4.5 | 통과 |
| 라이트 | text on bg | WCAG | 18.09 | 4.5 | 통과 |
| 라이트 | text on surface | WCAG | 18.88 | 4.5 | 통과 |
| 라이트 | text on surface-2 | WCAG | 16.88 | 4.5 | 통과 |
| 라이트 | text-2 on bg | WCAG | 6.38 | 4.5 | 통과 |
| 라이트 | text-2 on surface | WCAG | 6.66 | 4.5 | 통과 |
| 라이트 | text-2 on surface-2 | WCAG | 5.96 | 4.5 | 통과 |
| 라이트 | text-3 on bg | WCAG | 4.94 | 4.5 | 통과 |
| 라이트 | text-3 on surface | WCAG | 5.15 | 4.5 | 통과 |
| 라이트 | text-3 on surface-2 | WCAG | 4.60 | 4.5 | 통과 |
| 라이트 | brand-ink on bg | WCAG | 5.40 | 4.5 | 통과 |
| 라이트 | brand-ink on bg (APCA) | APCA Lc | 74.80 | 60 | 통과 |
| 라이트 | brand-ink on surface | WCAG | 5.64 | 4.5 | 통과 |
| 라이트 | brand-ink on surface (APCA) | APCA Lc | 77.80 | 60 | 통과 |
| 라이트 | brand-ink on surface-2 | WCAG | 5.04 | 4.5 | 통과 |
| 라이트 | brand-ink on surface-2 (APCA) | APCA Lc | 70.10 | 60 | 통과 |
| 라이트 | text on brand-tint | WCAG | 16.62 | 4.5 | 통과 |
| 라이트 | text-2 on brand-tint | WCAG | 5.86 | 4.5 | 통과 |
| 라이트 | brand-ink on brand-tint | WCAG | 4.96 | 4.5 | 통과 |
| 라이트 | brand-ink on brand-tint (APCA) | APCA Lc | 69.06 | 60 | 통과 |
| 라이트 | ok on bg | WCAG | 5.03 | 4.6 | 통과 |
| 라이트 | ok on surface | WCAG | 5.25 | 4.6 | 통과 |
| 라이트 | ok on surface-2 | WCAG | 4.69 | 4.6 | 통과 |
| 라이트 | ok on ok-tint | WCAG | 4.62 | 4.6 | 통과 |
| 라이트 | warn on bg | WCAG | 5.17 | 4.6 | 통과 |
| 라이트 | warn on surface | WCAG | 5.40 | 4.6 | 통과 |
| 라이트 | warn on surface-2 | WCAG | 4.83 | 4.6 | 통과 |
| 라이트 | warn on warn-tint | WCAG | 4.64 | 4.6 | 통과 |
| 라이트 | danger on bg | WCAG | 5.06 | 4.6 | 통과 |
| 라이트 | danger on surface | WCAG | 5.28 | 4.6 | 통과 |
| 라이트 | danger on surface-2 | WCAG | 4.72 | 4.6 | 통과 |
| 라이트 | danger on danger-tint | WCAG | 4.62 | 4.6 | 통과 |
| 라이트 | brand-graphic on surface | WCAG | 4.50 | 3 | 통과 |
| 라이트 | brand-graphic on bg | WCAG | 4.31 | 3 | 통과 |
| 라이트 | line on bg | WCAG | 4.35 | 3 | 통과 |
| 라이트 | line on surface | WCAG | 4.54 | 3 | 통과 |
| 라이트 | line on surface-2 | WCAG | 4.06 | 3 | 통과 |
| 라이트 | ring on surface | WCAG | 5.64 | 3 | 통과 |
| 라이트 | ring on bg | WCAG | 5.40 | 3 | 통과 |
| 라이트 | chart-1 on surface | WCAG | 4.50 | 3 | 통과 |
| 라이트 | chart-1 on bg | WCAG | 4.31 | 3 | 통과 |
| 라이트 | chart-2 on surface | WCAG | 4.53 | 3 | 통과 |
| 라이트 | chart-2 on bg | WCAG | 4.34 | 3 | 통과 |
| 라이트 | chart-3 on surface | WCAG | 4.51 | 3 | 통과 |
| 라이트 | chart-3 on bg | WCAG | 4.32 | 3 | 통과 |
| 라이트 | chart-4 on surface | WCAG | 4.51 | 3 | 통과 |
| 라이트 | chart-4 on bg | WCAG | 4.32 | 3 | 통과 |
| 라이트 | chart-5 on surface | WCAG | 4.52 | 3 | 통과 |
| 라이트 | chart-5 on bg | WCAG | 4.33 | 3 | 통과 |
| 라이트 | brand-tint vs surface-2 (dE-OK) | ΔE OK | 0.0184 | 0.0184 | 통과 |
| 라이트 | bg vs surface (dE-OK) | ΔE OK | 0.0149 | 0.01 | 통과 |
| 라이트 | surface vs surface-2 (dE-OK) | ΔE OK | 0.0386 | 0.01 | 통과 |
| 라이트 | surface-2 vs surface-3 (dE-OK) | ΔE OK | 0.0359 | 0.01 | 통과 |
| 라이트 | brand vs ok-fill (hue gap) | hue 간격 | 79.79 | 29.5 | 통과 |
| 라이트 | brand vs warn-fill (hue gap) | hue 간격 | 164.85 | 29.5 | 통과 |
| 라이트 | brand vs danger-fill (hue gap) | hue 간격 | 154.99 | 29.5 | 통과 |
| 라이트 | bg chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
| 라이트 | surface chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
| 라이트 | surface-2 chroma | 채도 | 0.0013 | ≤ 0.008 | 통과 |
| 라이트 | surface-3 chroma | 채도 | 0.0027 | ≤ 0.008 | 통과 |
| 라이트 | text chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
| 라이트 | text-2 chroma | 채도 | 0.0048 | ≤ 0.008 | 통과 |
| 라이트 | text-3 chroma | 채도 | 0.0062 | ≤ 0.008 | 통과 |
| 라이트 | line chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
| 다크 | card-foreground on card | WCAG | 16.60 | 4.5 | 통과 |
| 다크 | popover-foreground on popover | WCAG | 16.60 | 4.5 | 통과 |
| 다크 | primary-foreground on primary | WCAG | 4.50 | 4.5 | 통과 |
| 다크 | secondary-foreground on secondary | WCAG | 15.12 | 4.5 | 통과 |
| 다크 | muted-foreground on muted | WCAG | 6.55 | 4.5 | 통과 |
| 다크 | accent-foreground on accent | WCAG | 15.12 | 4.5 | 통과 |
| 다크 | destructive-foreground on destructive | WCAG | 4.53 | 4.5 | 통과 |
| 다크 | sidebar-foreground on sidebar | WCAG | 16.60 | 4.5 | 통과 |
| 다크 | sidebar-primary-foreground on sidebar-primary | WCAG | 4.50 | 4.5 | 통과 |
| 다크 | sidebar-accent-foreground on sidebar-accent | WCAG | 15.12 | 4.5 | 통과 |
| 다크 | brand-text on brand | WCAG | 4.50 | 4.5 | 통과 |
| 다크 | brand-text on brand-hover | WCAG | 5.64 | 4.5 | 통과 |
| 다크 | brand-tint-2-text on brand-tint-2 | WCAG | 6.59 | 4.5 | 통과 |
| 다크 | brand-tint-2-text on brand-tint-2-hover | WCAG | 5.21 | 4.5 | 통과 |
| 다크 | brand-graphic-text on brand-graphic | WCAG | 4.50 | 4.5 | 통과 |
| 다크 | ok-fill-text on ok-fill | WCAG | 4.51 | 4.5 | 통과 |
| 다크 | warn-fill-text on warn-fill | WCAG | 4.51 | 4.5 | 통과 |
| 다크 | danger-fill-text on danger-fill | WCAG | 4.53 | 4.5 | 통과 |
| 다크 | foreground on background | WCAG | 17.94 | 4.5 | 통과 |
| 다크 | text on bg | WCAG | 17.94 | 4.5 | 통과 |
| 다크 | text on surface | WCAG | 16.60 | 4.5 | 통과 |
| 다크 | text on surface-2 | WCAG | 15.12 | 4.5 | 통과 |
| 다크 | text-2 on bg | WCAG | 7.78 | 4.5 | 통과 |
| 다크 | text-2 on surface | WCAG | 7.19 | 4.5 | 통과 |
| 다크 | text-2 on surface-2 | WCAG | 6.55 | 4.5 | 통과 |
| 다크 | text-3 on bg | WCAG | 5.99 | 4.5 | 통과 |
| 다크 | text-3 on surface | WCAG | 5.54 | 4.5 | 통과 |
| 다크 | text-3 on surface-2 | WCAG | 5.05 | 4.5 | 통과 |
| 다크 | brand-ink on bg | WCAG | 11.43 | 4.5 | 통과 |
| 다크 | brand-ink on bg (APCA) | APCA Lc | 71.95 | 60 | 통과 |
| 다크 | brand-ink on surface | WCAG | 10.57 | 4.5 | 통과 |
| 다크 | brand-ink on surface (APCA) | APCA Lc | 71.26 | 60 | 통과 |
| 다크 | brand-ink on surface-2 | WCAG | 9.63 | 4.5 | 통과 |
| 다크 | brand-ink on surface-2 (APCA) | APCA Lc | 70.19 | 60 | 통과 |
| 다크 | text on brand-tint | WCAG | 12.99 | 4.5 | 통과 |
| 다크 | text-2 on brand-tint | WCAG | 5.63 | 4.5 | 통과 |
| 다크 | brand-ink on brand-tint | WCAG | 8.28 | 4.5 | 통과 |
| 다크 | brand-ink on brand-tint (APCA) | APCA Lc | 68.11 | 60 | 통과 |
| 다크 | ok on bg | WCAG | 10.36 | 4.5 | 통과 |
| 다크 | ok on surface | WCAG | 9.59 | 4.5 | 통과 |
| 다크 | ok on surface-2 | WCAG | 8.73 | 4.5 | 통과 |
| 다크 | ok on ok-tint | WCAG | 7.31 | 4.5 | 통과 |
| 다크 | warn on bg | WCAG | 9.51 | 4.5 | 통과 |
| 다크 | warn on surface | WCAG | 8.80 | 4.5 | 통과 |
| 다크 | warn on surface-2 | WCAG | 8.02 | 4.5 | 통과 |
| 다크 | warn on warn-tint | WCAG | 6.82 | 4.5 | 통과 |
| 다크 | danger on bg | WCAG | 8.03 | 4.5 | 통과 |
| 다크 | danger on surface | WCAG | 7.42 | 4.5 | 통과 |
| 다크 | danger on surface-2 | WCAG | 6.76 | 4.5 | 통과 |
| 다크 | danger on danger-tint | WCAG | 5.93 | 4.5 | 통과 |
| 다크 | brand-graphic on surface | WCAG | 4.02 | 3 | 통과 |
| 다크 | brand-graphic on bg | WCAG | 4.35 | 3 | 통과 |
| 다크 | line on bg | WCAG | 4.58 | 3 | 통과 |
| 다크 | line on surface | WCAG | 4.23 | 3 | 통과 |
| 다크 | line on surface-2 | WCAG | 3.86 | 3 | 통과 |
| 다크 | ring on surface | WCAG | 10.57 | 3 | 통과 |
| 다크 | ring on bg | WCAG | 11.43 | 3 | 통과 |
| 다크 | chart-1 on surface | WCAG | 4.02 | 3 | 통과 |
| 다크 | chart-1 on bg | WCAG | 4.35 | 3 | 통과 |
| 다크 | chart-2 on surface | WCAG | 3.99 | 3 | 통과 |
| 다크 | chart-2 on bg | WCAG | 4.32 | 3 | 통과 |
| 다크 | chart-3 on surface | WCAG | 4.01 | 3 | 통과 |
| 다크 | chart-3 on bg | WCAG | 4.34 | 3 | 통과 |
| 다크 | chart-4 on surface | WCAG | 4.01 | 3 | 통과 |
| 다크 | chart-4 on bg | WCAG | 4.34 | 3 | 통과 |
| 다크 | chart-5 on surface | WCAG | 4.01 | 3 | 통과 |
| 다크 | chart-5 on bg | WCAG | 4.33 | 3 | 통과 |
| 다크 | brand-tint vs surface-2 (dE-OK) | ΔE OK | 0.0526 | 0.0184 | 통과 |
| 다크 | bg vs surface (dE-OK) | ΔE OK | 0.0459 | 0.01 | 통과 |
| 다크 | surface vs surface-2 (dE-OK) | ΔE OK | 0.0391 | 0.01 | 통과 |
| 다크 | surface-2 vs surface-3 (dE-OK) | ΔE OK | 0.0457 | 0.01 | 통과 |
| 다크 | brand vs ok-fill (hue gap) | hue 간격 | 79.79 | 29.5 | 통과 |
| 다크 | brand vs warn-fill (hue gap) | hue 간격 | 164.85 | 29.5 | 통과 |
| 다크 | brand vs danger-fill (hue gap) | hue 간격 | 154.99 | 29.5 | 통과 |
| 다크 | bg chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
| 다크 | surface chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
| 다크 | surface-2 chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
| 다크 | surface-3 chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
| 다크 | text chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
| 다크 | text-2 chroma | 채도 | 0.0043 | ≤ 0.008 | 통과 |
| 다크 | text-3 chroma | 채도 | 0.0059 | ≤ 0.008 | 통과 |
| 다크 | line chroma | 채도 | 0.0060 | ≤ 0.008 | 통과 |
