# 남색 테마 (indigo)

scripts/build-registry.mjs가 만든 파일이에요. 규칙은 https://ui.pyospect.com/TASTE.md 의 §20에 있고, 여기에는 그 규칙이 이 브랜드 색에서 만든 값과 대비 검사 결과가 있어요.

- 시드: `#526DE4`
- 모드: 흰 글자 (채움 위 글자 `#FFFFFF`)
- 채움: `#526DE4` (brand-600), 시드 그대로예요
- 상태색 hue: danger 25°, warn 65°, ok 150°
- 설치: `npx pyospectui --preset indigo` 또는 `npx shadcn add https://ui.pyospect.com/r/v0.4.0/theme-indigo.json`

## 알려 드릴 점

- 없어요. 상태색이 브랜드와 30° 넘게 떨어져 있고, 모든 조합이 기준을 넘어요.

## 브랜드 스케일

| step | hex |
|---|---|
| brand-50 | `#F1F5FF` |
| brand-100 | `#E4EBFF` |
| brand-200 | `#CDDAFF` |
| brand-300 | `#ADC2FF` |
| brand-400 | `#8EA9FF` |
| brand-500 | `#6D8BFF` |
| brand-600 | `#526DE4` 채움 |
| brand-700 | `#455CBE` |
| brand-800 | `#354896` |
| brand-900 | `#283773` |
| brand-950 | `#18224C` |

## 토큰

| 토큰 | 라이트 | 다크 |
|---|---|---|
| brand | `#526DE4` | `#526DE4` |
| brand-text | `#FFFFFF` | `#FFFFFF` |
| brand-hover | `#455CBE` | `#455CBE` |
| brand-ink | `#455CBE` | `#ADC2FF` |
| brand-tint | `#EDF1FF` | `#282B37` |
| brand-tint-2 | `#DFE5FF` | `#343A4F` |
| brand-tint-2-hover | `#D0DAFF` | `#3F4966` |
| brand-tint-2-text | `#354896` | `#ADC2FF` |
| brand-graphic | `#526DE4` | `#526DE4` |
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
| chart-1 | `#526DE4` | `#526DE4` |
| chart-2 | `#B25693` | `#B25693` |
| chart-3 | `#B75F0F` | `#B75F0F` |
| chart-4 | `#5F8106` | `#5F8106` |
| chart-5 | `#008488` | `#008488` |

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
| 라이트 | brand-text on brand-hover | WCAG | 5.95 | 4.5 | 통과 |
| 라이트 | brand-tint-2-text on brand-tint-2 | WCAG | 6.67 | 4.5 | 통과 |
| 라이트 | brand-tint-2-text on brand-tint-2-hover | WCAG | 6.02 | 4.5 | 통과 |
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
| 라이트 | brand-ink on bg | WCAG | 5.70 | 4.5 | 통과 |
| 라이트 | brand-ink on bg (APCA) | APCA Lc | 76.46 | 60 | 통과 |
| 라이트 | brand-ink on surface | WCAG | 5.95 | 4.5 | 통과 |
| 라이트 | brand-ink on surface (APCA) | APCA Lc | 79.45 | 60 | 통과 |
| 라이트 | brand-ink on surface-2 | WCAG | 5.46 | 4.5 | 통과 |
| 라이트 | brand-ink on surface-2 (APCA) | APCA Lc | 73.48 | 60 | 통과 |
| 라이트 | text on brand-tint | WCAG | 13.42 | 4.5 | 통과 |
| 라이트 | text-2 on brand-tint | WCAG | 6.93 | 4.5 | 통과 |
| 라이트 | brand-ink on brand-tint | WCAG | 5.28 | 4.5 | 통과 |
| 라이트 | brand-ink on brand-tint (APCA) | APCA Lc | 71.24 | 60 | 통과 |
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
| 라이트 | brand-graphic on bg | WCAG | 4.31 | 3 | 통과 |
| 라이트 | line on bg | WCAG | 4.35 | 3 | 통과 |
| 라이트 | line on surface | WCAG | 4.54 | 3 | 통과 |
| 라이트 | line on surface-2 | WCAG | 4.17 | 3 | 통과 |
| 라이트 | ring on surface | WCAG | 5.95 | 3 | 통과 |
| 라이트 | ring on bg | WCAG | 5.70 | 3 | 통과 |
| 라이트 | chart-1 on surface | WCAG | 4.50 | 3 | 통과 |
| 라이트 | chart-1 on bg | WCAG | 4.31 | 3 | 통과 |
| 라이트 | chart-2 on surface | WCAG | 4.52 | 3 | 통과 |
| 라이트 | chart-2 on bg | WCAG | 4.33 | 3 | 통과 |
| 라이트 | chart-3 on surface | WCAG | 4.51 | 3 | 통과 |
| 라이트 | chart-3 on bg | WCAG | 4.32 | 3 | 통과 |
| 라이트 | chart-4 on surface | WCAG | 4.54 | 3 | 통과 |
| 라이트 | chart-4 on bg | WCAG | 4.35 | 3 | 통과 |
| 라이트 | chart-5 on surface | WCAG | 4.51 | 3 | 통과 |
| 라이트 | chart-5 on bg | WCAG | 4.32 | 3 | 통과 |
| 라이트 | brand-tint vs surface-2 (dE-OK) | ΔE OK | 0.0217 | 0.0184 | 통과 |
| 라이트 | bg vs surface (dE-OK) | ΔE OK | 0.0149 | 0.01 | 통과 |
| 라이트 | surface vs surface-2 (dE-OK) | ΔE OK | 0.0298 | 0.01 | 통과 |
| 라이트 | surface-2 vs surface-3 (dE-OK) | ΔE OK | 0.0482 | 0.01 | 통과 |
| 라이트 | brand vs ok-fill (hue gap) | hue 간격 | 120.16 | 29.5 | 통과 |
| 라이트 | brand vs warn-fill (hue gap) | hue 간격 | 154.78 | 29.5 | 통과 |
| 라이트 | brand vs danger-fill (hue gap) | hue 간격 | 114.61 | 29.5 | 통과 |
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
| 다크 | brand-text on brand-hover | WCAG | 5.95 | 4.5 | 통과 |
| 다크 | brand-tint-2-text on brand-tint-2 | WCAG | 6.40 | 4.5 | 통과 |
| 다크 | brand-tint-2-text on brand-tint-2-hover | WCAG | 5.07 | 4.5 | 통과 |
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
| 다크 | brand-ink on bg | WCAG | 11.25 | 4.5 | 통과 |
| 다크 | brand-ink on bg (APCA) | APCA Lc | 70.38 | 60 | 통과 |
| 다크 | brand-ink on surface | WCAG | 10.19 | 4.5 | 통과 |
| 다크 | brand-ink on surface (APCA) | APCA Lc | 69.51 | 60 | 통과 |
| 다크 | brand-ink on surface-2 | WCAG | 8.60 | 4.5 | 통과 |
| 다크 | brand-ink on surface-2 (APCA) | APCA Lc | 67.43 | 60 | 통과 |
| 다크 | text on brand-tint | WCAG | 12.87 | 4.5 | 통과 |
| 다크 | text-2 on brand-tint | WCAG | 9.46 | 4.5 | 통과 |
| 다크 | brand-ink on brand-tint | WCAG | 7.97 | 4.5 | 통과 |
| 다크 | brand-ink on brand-tint (APCA) | APCA Lc | 66.34 | 60 | 통과 |
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
| 다크 | ring on surface | WCAG | 10.19 | 3 | 통과 |
| 다크 | ring on bg | WCAG | 11.25 | 3 | 통과 |
| 다크 | chart-1 on surface | WCAG | 3.98 | 3 | 통과 |
| 다크 | chart-1 on bg | WCAG | 4.40 | 3 | 통과 |
| 다크 | chart-2 on surface | WCAG | 3.97 | 3 | 통과 |
| 다크 | chart-2 on bg | WCAG | 4.38 | 3 | 통과 |
| 다크 | chart-3 on surface | WCAG | 3.98 | 3 | 통과 |
| 다크 | chart-3 on bg | WCAG | 4.39 | 3 | 통과 |
| 다크 | chart-4 on surface | WCAG | 3.95 | 3 | 통과 |
| 다크 | chart-4 on bg | WCAG | 4.36 | 3 | 통과 |
| 다크 | chart-5 on surface | WCAG | 3.97 | 3 | 통과 |
| 다크 | chart-5 on bg | WCAG | 4.39 | 3 | 통과 |
| 다크 | brand-tint vs surface-2 (dE-OK) | ΔE OK | 0.0318 | 0.0184 | 통과 |
| 다크 | bg vs surface (dE-OK) | ΔE OK | 0.0598 | 0.01 | 통과 |
| 다크 | surface vs surface-2 (dE-OK) | ΔE OK | 0.0640 | 0.01 | 통과 |
| 다크 | surface-2 vs surface-3 (dE-OK) | ΔE OK | 0.1029 | 0.01 | 통과 |
| 다크 | brand vs ok-fill (hue gap) | hue 간격 | 120.16 | 29.5 | 통과 |
| 다크 | brand vs warn-fill (hue gap) | hue 간격 | 154.78 | 29.5 | 통과 |
| 다크 | brand vs danger-fill (hue gap) | hue 간격 | 114.61 | 29.5 | 통과 |
| 다크 | bg chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
| 다크 | surface chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
| 다크 | surface-2 chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
| 다크 | surface-3 chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
| 다크 | text chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
| 다크 | text-2 chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
| 다크 | text-3 chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
| 다크 | line chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
