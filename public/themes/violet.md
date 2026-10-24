# 보라 테마 (violet)

scripts/build-registry.mjs가 만든 파일이에요. 규칙은 https://ui.pyospect.com/TASTE.md 의 §20에 있고, 여기에는 그 규칙이 이 브랜드 색에서 만든 값과 대비 검사 결과가 있어요.

- 시드: `#7E61DF`
- 모드: 흰 글자 (채움 위 글자 `#FFFFFF`)
- 채움: `#7E61DF` (brand-600), 시드 그대로예요
- 상태색 hue: danger 25°, warn 65°, ok 150°
- 설치: `npx pyospectui --preset violet` 또는 `npx shadcn add https://ui.pyospect.com/r/v0.4.0/theme-violet.json`

## 알려 드릴 점

- 없어요. 상태색이 브랜드와 30° 넘게 떨어져 있고, 모든 조합이 기준을 넘어요.

## 브랜드 스케일

| step | hex |
|---|---|
| brand-50 | `#F5F4FF` |
| brand-100 | `#EAE8FF` |
| brand-200 | `#D9D5FF` |
| brand-300 | `#C3BAFF` |
| brand-400 | `#AD9EFF` |
| brand-500 | `#977BFF` |
| brand-600 | `#7E61DF` 채움 |
| brand-700 | `#6850B8` |
| brand-800 | `#513E91` |
| brand-900 | `#3E306F` |
| brand-950 | `#271D4A` |

## 토큰

| 토큰 | 라이트 | 다크 |
|---|---|---|
| brand | `#7E61DF` | `#7E61DF` |
| brand-text | `#FFFFFF` | `#FFFFFF` |
| brand-hover | `#6850B8` | `#6850B8` |
| brand-ink | `#6850B8` | `#C3BAFF` |
| brand-tint | `#F3EFFF` | `#2C2A37` |
| brand-tint-2 | `#E8E2FF` | `#3B374F` |
| brand-tint-2-hover | `#DED5FF` | `#4A4566` |
| brand-tint-2-text | `#513E91` | `#C3BAFF` |
| brand-graphic | `#7E61DF` | `#7E61DF` |
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
| ok-tint | `#E9F3EC` | `#223126` |
| warn-tint | `#F5EDE0` | `#362B1B` |
| danger-tint | `#FAEDED` | `#372625` |
| chart-1 | `#7E61DF` | `#7E61DF` |
| chart-2 | `#BD5376` | `#BD5376` |
| chart-3 | `#A26B00` | `#A26B00` |
| chart-4 | `#2E873C` | `#2E873C` |
| chart-5 | `#00829B` | `#00829B` |

## 대비 검사

164개 조합 중 164개가 기준을 넘어요. 8비트 값과 반올림 전 값 중 나쁜 쪽으로 쟀어요.

| 테마 | 조합 | 종류 | 값 | 기준 | 결과 |
|---|---|---|---|---|---|
| 라이트 | card-foreground on card | WCAG | 15.13 | 4.5 | 통과 |
| 라이트 | popover-foreground on popover | WCAG | 15.13 | 4.5 | 통과 |
| 라이트 | primary-foreground on primary | WCAG | 4.50 | 4.5 | 통과 |
| 라이트 | secondary-foreground on secondary | WCAG | 13.88 | 4.5 | 통과 |
| 라이트 | muted-foreground on muted | WCAG | 7.17 | 4.5 | 통과 |
| 라이트 | accent-foreground on accent | WCAG | 13.88 | 4.5 | 통과 |
| 라이트 | destructive-foreground on destructive | WCAG | 4.53 | 4.5 | 통과 |
| 라이트 | sidebar-foreground on sidebar | WCAG | 15.13 | 4.5 | 통과 |
| 라이트 | sidebar-primary-foreground on sidebar-primary | WCAG | 4.50 | 4.5 | 통과 |
| 라이트 | sidebar-accent-foreground on sidebar-accent | WCAG | 13.88 | 4.5 | 통과 |
| 라이트 | brand-text on brand | WCAG | 4.50 | 4.5 | 통과 |
| 라이트 | brand-text on brand-hover | WCAG | 6.13 | 4.5 | 통과 |
| 라이트 | brand-tint-2-text on brand-tint-2 | WCAG | 6.84 | 4.5 | 통과 |
| 라이트 | brand-tint-2-text on brand-tint-2-hover | WCAG | 6.14 | 4.5 | 통과 |
| 라이트 | brand-graphic-text on brand-graphic | WCAG | 4.50 | 4.5 | 통과 |
| 라이트 | ok-fill-text on ok-fill | WCAG | 4.51 | 4.5 | 통과 |
| 라이트 | warn-fill-text on warn-fill | WCAG | 4.51 | 4.5 | 통과 |
| 라이트 | danger-fill-text on danger-fill | WCAG | 4.53 | 4.5 | 통과 |
| 라이트 | foreground on background | WCAG | 14.50 | 4.5 | 통과 |
| 라이트 | text on bg | WCAG | 14.50 | 4.5 | 통과 |
| 라이트 | text on surface | WCAG | 15.13 | 4.5 | 통과 |
| 라이트 | text on surface-2 | WCAG | 13.88 | 4.5 | 통과 |
| 라이트 | text-2 on bg | WCAG | 7.49 | 4.5 | 통과 |
| 라이트 | text-2 on surface | WCAG | 7.81 | 4.5 | 통과 |
| 라이트 | text-2 on surface-2 | WCAG | 7.17 | 4.5 | 통과 |
| 라이트 | text-3 on bg | WCAG | 6.02 | 4.5 | 통과 |
| 라이트 | text-3 on surface | WCAG | 6.29 | 4.5 | 통과 |
| 라이트 | text-3 on surface-2 | WCAG | 5.77 | 4.5 | 통과 |
| 라이트 | brand-ink on bg | WCAG | 5.87 | 4.5 | 통과 |
| 라이트 | brand-ink on bg (APCA) | APCA Lc | 77.28 | 60 | 통과 |
| 라이트 | brand-ink on surface | WCAG | 6.13 | 4.5 | 통과 |
| 라이트 | brand-ink on surface (APCA) | APCA Lc | 80.27 | 60 | 통과 |
| 라이트 | brand-ink on surface-2 | WCAG | 5.62 | 4.5 | 통과 |
| 라이트 | brand-ink on surface-2 (APCA) | APCA Lc | 74.31 | 60 | 통과 |
| 라이트 | text on brand-tint | WCAG | 13.41 | 4.5 | 통과 |
| 라이트 | text-2 on brand-tint | WCAG | 6.92 | 4.5 | 통과 |
| 라이트 | brand-ink on brand-tint | WCAG | 5.43 | 4.5 | 통과 |
| 라이트 | brand-ink on brand-tint (APCA) | APCA Lc | 71.98 | 60 | 통과 |
| 라이트 | ok on bg | WCAG | 5.03 | 4.6 | 통과 |
| 라이트 | ok on surface | WCAG | 5.25 | 4.6 | 통과 |
| 라이트 | ok on surface-2 | WCAG | 4.81 | 4.6 | 통과 |
| 라이트 | ok on ok-tint | WCAG | 4.62 | 4.6 | 통과 |
| 라이트 | warn on bg | WCAG | 5.17 | 4.6 | 통과 |
| 라이트 | warn on surface | WCAG | 5.40 | 4.6 | 통과 |
| 라이트 | warn on surface-2 | WCAG | 4.95 | 4.6 | 통과 |
| 라이트 | warn on warn-tint | WCAG | 4.64 | 4.6 | 통과 |
| 라이트 | danger on bg | WCAG | 5.06 | 4.6 | 통과 |
| 라이트 | danger on surface | WCAG | 5.28 | 4.6 | 통과 |
| 라이트 | danger on surface-2 | WCAG | 4.84 | 4.6 | 통과 |
| 라이트 | danger on danger-tint | WCAG | 4.62 | 4.6 | 통과 |
| 라이트 | brand-graphic on surface | WCAG | 4.50 | 3 | 통과 |
| 라이트 | brand-graphic on bg | WCAG | 4.32 | 3 | 통과 |
| 라이트 | line on bg | WCAG | 4.35 | 3 | 통과 |
| 라이트 | line on surface | WCAG | 4.54 | 3 | 통과 |
| 라이트 | line on surface-2 | WCAG | 4.17 | 3 | 통과 |
| 라이트 | ring on surface | WCAG | 6.13 | 3 | 통과 |
| 라이트 | ring on bg | WCAG | 5.87 | 3 | 통과 |
| 라이트 | chart-1 on surface | WCAG | 4.50 | 3 | 통과 |
| 라이트 | chart-1 on bg | WCAG | 4.32 | 3 | 통과 |
| 라이트 | chart-2 on surface | WCAG | 4.50 | 3 | 통과 |
| 라이트 | chart-2 on bg | WCAG | 4.32 | 3 | 통과 |
| 라이트 | chart-3 on surface | WCAG | 4.53 | 3 | 통과 |
| 라이트 | chart-3 on bg | WCAG | 4.34 | 3 | 통과 |
| 라이트 | chart-4 on surface | WCAG | 4.52 | 3 | 통과 |
| 라이트 | chart-4 on bg | WCAG | 4.33 | 3 | 통과 |
| 라이트 | chart-5 on surface | WCAG | 4.50 | 3 | 통과 |
| 라이트 | chart-5 on bg | WCAG | 4.31 | 3 | 통과 |
| 라이트 | brand-tint vs surface-2 (dE-OK) | ΔE OK | 0.0237 | 0.0184 | 통과 |
| 라이트 | bg vs surface (dE-OK) | ΔE OK | 0.0149 | 0.01 | 통과 |
| 라이트 | surface vs surface-2 (dE-OK) | ΔE OK | 0.0298 | 0.01 | 통과 |
| 라이트 | surface-2 vs surface-3 (dE-OK) | ΔE OK | 0.0482 | 0.01 | 통과 |
| 라이트 | brand vs ok-fill (hue gap) | hue 간격 | 140.14 | 29.5 | 통과 |
| 라이트 | brand vs warn-fill (hue gap) | hue 간격 | 134.80 | 29.5 | 통과 |
| 라이트 | brand vs danger-fill (hue gap) | hue 간격 | 94.64 | 29.5 | 통과 |
| 라이트 | bg chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
| 라이트 | surface chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
| 라이트 | surface-2 chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
| 라이트 | surface-3 chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
| 라이트 | text chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
| 라이트 | text-2 chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
| 라이트 | text-3 chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
| 라이트 | line chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
| 다크 | card-foreground on card | WCAG | 16.44 | 4.5 | 통과 |
| 다크 | popover-foreground on popover | WCAG | 16.44 | 4.5 | 통과 |
| 다크 | primary-foreground on primary | WCAG | 4.50 | 4.5 | 통과 |
| 다크 | secondary-foreground on secondary | WCAG | 13.88 | 4.5 | 통과 |
| 다크 | muted-foreground on muted | WCAG | 10.21 | 4.5 | 통과 |
| 다크 | accent-foreground on accent | WCAG | 13.88 | 4.5 | 통과 |
| 다크 | destructive-foreground on destructive | WCAG | 4.53 | 4.5 | 통과 |
| 다크 | sidebar-foreground on sidebar | WCAG | 16.44 | 4.5 | 통과 |
| 다크 | sidebar-primary-foreground on sidebar-primary | WCAG | 4.50 | 4.5 | 통과 |
| 다크 | sidebar-accent-foreground on sidebar-accent | WCAG | 13.88 | 4.5 | 통과 |
| 다크 | brand-text on brand | WCAG | 4.50 | 4.5 | 통과 |
| 다크 | brand-text on brand-hover | WCAG | 6.13 | 4.5 | 통과 |
| 다크 | brand-tint-2-text on brand-tint-2 | WCAG | 6.36 | 4.5 | 통과 |
| 다크 | brand-tint-2-text on brand-tint-2-hover | WCAG | 5.05 | 4.5 | 통과 |
| 다크 | brand-graphic-text on brand-graphic | WCAG | 4.50 | 4.5 | 통과 |
| 다크 | ok-fill-text on ok-fill | WCAG | 4.51 | 4.5 | 통과 |
| 다크 | warn-fill-text on warn-fill | WCAG | 4.51 | 4.5 | 통과 |
| 다크 | danger-fill-text on danger-fill | WCAG | 4.53 | 4.5 | 통과 |
| 다크 | foreground on background | WCAG | 18.16 | 4.5 | 통과 |
| 다크 | text on bg | WCAG | 18.16 | 4.5 | 통과 |
| 다크 | text on surface | WCAG | 16.44 | 4.5 | 통과 |
| 다크 | text on surface-2 | WCAG | 13.88 | 4.5 | 통과 |
| 다크 | text-2 on bg | WCAG | 13.36 | 4.5 | 통과 |
| 다크 | text-2 on surface | WCAG | 12.09 | 4.5 | 통과 |
| 다크 | text-2 on surface-2 | WCAG | 10.21 | 4.5 | 통과 |
| 다크 | text-3 on bg | WCAG | 7.85 | 4.5 | 통과 |
| 다크 | text-3 on surface | WCAG | 7.11 | 4.5 | 통과 |
| 다크 | text-3 on surface-2 | WCAG | 6.00 | 4.5 | 통과 |
| 다크 | brand-ink on bg | WCAG | 11.11 | 4.5 | 통과 |
| 다크 | brand-ink on bg (APCA) | APCA Lc | 69.68 | 60 | 통과 |
| 다크 | brand-ink on surface | WCAG | 10.06 | 4.5 | 통과 |
| 다크 | brand-ink on surface (APCA) | APCA Lc | 68.81 | 60 | 통과 |
| 다크 | brand-ink on surface-2 | WCAG | 8.49 | 4.5 | 통과 |
| 다크 | brand-ink on surface-2 (APCA) | APCA Lc | 66.73 | 60 | 통과 |
| 다크 | text on brand-tint | WCAG | 12.90 | 4.5 | 통과 |
| 다크 | text-2 on brand-tint | WCAG | 9.49 | 4.5 | 통과 |
| 다크 | brand-ink on brand-tint | WCAG | 7.89 | 4.5 | 통과 |
| 다크 | brand-ink on brand-tint (APCA) | APCA Lc | 65.67 | 60 | 통과 |
| 다크 | ok on bg | WCAG | 10.49 | 4.5 | 통과 |
| 다크 | ok on surface | WCAG | 9.50 | 4.5 | 통과 |
| 다크 | ok on surface-2 | WCAG | 8.02 | 4.5 | 통과 |
| 다크 | ok on ok-tint | WCAG | 7.23 | 4.5 | 통과 |
| 다크 | warn on bg | WCAG | 9.63 | 4.5 | 통과 |
| 다크 | warn on surface | WCAG | 8.72 | 4.5 | 통과 |
| 다크 | warn on surface-2 | WCAG | 7.36 | 4.5 | 통과 |
| 다크 | warn on warn-tint | WCAG | 6.73 | 4.5 | 통과 |
| 다크 | danger on bg | WCAG | 8.12 | 4.5 | 통과 |
| 다크 | danger on surface | WCAG | 7.36 | 4.5 | 통과 |
| 다크 | danger on surface-2 | WCAG | 6.21 | 4.5 | 통과 |
| 다크 | danger on danger-tint | WCAG | 5.88 | 4.5 | 통과 |
| 다크 | brand-graphic on surface | WCAG | 3.98 | 3 | 통과 |
| 다크 | brand-graphic on bg | WCAG | 4.40 | 3 | 통과 |
| 다크 | line on bg | WCAG | 5.73 | 3 | 통과 |
| 다크 | line on surface | WCAG | 5.19 | 3 | 통과 |
| 다크 | line on surface-2 | WCAG | 4.38 | 3 | 통과 |
| 다크 | ring on surface | WCAG | 10.06 | 3 | 통과 |
| 다크 | ring on bg | WCAG | 11.11 | 3 | 통과 |
| 다크 | chart-1 on surface | WCAG | 3.98 | 3 | 통과 |
| 다크 | chart-1 on bg | WCAG | 4.40 | 3 | 통과 |
| 다크 | chart-2 on surface | WCAG | 3.98 | 3 | 통과 |
| 다크 | chart-2 on bg | WCAG | 4.40 | 3 | 통과 |
| 다크 | chart-3 on surface | WCAG | 3.96 | 3 | 통과 |
| 다크 | chart-3 on bg | WCAG | 4.37 | 3 | 통과 |
| 다크 | chart-4 on surface | WCAG | 3.97 | 3 | 통과 |
| 다크 | chart-4 on bg | WCAG | 4.38 | 3 | 통과 |
| 다크 | chart-5 on surface | WCAG | 3.98 | 3 | 통과 |
| 다크 | chart-5 on bg | WCAG | 4.40 | 3 | 통과 |
| 다크 | brand-tint vs surface-2 (dE-OK) | ΔE OK | 0.0337 | 0.0184 | 통과 |
| 다크 | bg vs surface (dE-OK) | ΔE OK | 0.0598 | 0.01 | 통과 |
| 다크 | surface vs surface-2 (dE-OK) | ΔE OK | 0.0640 | 0.01 | 통과 |
| 다크 | surface-2 vs surface-3 (dE-OK) | ΔE OK | 0.1029 | 0.01 | 통과 |
| 다크 | brand vs ok-fill (hue gap) | hue 간격 | 140.14 | 29.5 | 통과 |
| 다크 | brand vs warn-fill (hue gap) | hue 간격 | 134.80 | 29.5 | 통과 |
| 다크 | brand vs danger-fill (hue gap) | hue 간격 | 94.64 | 29.5 | 통과 |
| 다크 | bg chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
| 다크 | surface chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
| 다크 | surface-2 chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
| 다크 | surface-3 chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
| 다크 | text chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
| 다크 | text-2 chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
| 다크 | text-3 chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
| 다크 | line chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
