# 분홍 테마 (pink)

scripts/build-registry.mjs가 만든 파일이에요. 규칙은 https://ui.pyospect.com/TASTE.md 의 §20에 있고, 여기에는 그 규칙이 이 브랜드 색에서 만든 값과 대비 검사 결과가 있어요.

- 시드: `#C44696`
- 모드: 흰 글자 (채움 위 글자 `#FFFFFF`)
- 채움: `#C44696` (brand-600), 시드 그대로예요
- 상태색 hue: danger 25°, warn 65°, ok 150°
- 설치: `npx pyospectui --preset pink` 또는 `npx shadcn add https://ui.pyospect.com/r/theme-pink.json`

## 알려 드릴 점

- 없어요. 상태색이 브랜드와 30° 넘게 떨어져 있고, 모든 조합이 기준을 넘어요.

## 브랜드 스케일

| step | hex |
|---|---|
| brand-50 | `#FFF0F8` |
| brand-100 | `#FFE2F1` |
| brand-200 | `#FFC8E6` |
| brand-300 | `#FFA2D7` |
| brand-400 | `#FE76C9` |
| brand-500 | `#E459B0` |
| brand-600 | `#C44696` 채움 |
| brand-700 | `#A0387A` |
| brand-800 | `#7E2B60` |
| brand-900 | `#612249` |
| brand-950 | `#3F132F` |

## 토큰

| 토큰 | 라이트 | 다크 |
|---|---|---|
| brand | `#C44696` | `#C44696` |
| brand-text | `#FFFFFF` | `#FFFFFF` |
| brand-hover | `#A0387A` | `#A0387A` |
| brand-ink | `#A0387A` | `#FFA2D7` |
| brand-tint | `#FCEBF6` | `#36232F` |
| brand-tint-2 | `#F9DAEE` | `#4E2D41` |
| brand-tint-2-hover | `#F6CAE6` | `#653753` |
| brand-tint-2-text | `#7E2B60` | `#FFA2D7` |
| brand-graphic | `#C44696` | `#C44696` |
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
| chart-1 | `#C44696` | `#C44696` |
| chart-2 | `#B66001` | `#B66001` |
| chart-3 | `#598214` | `#598214` |
| chart-4 | `#00838A` | `#00838A` |
| chart-5 | `#5F70CB` | `#5F70CB` |

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
| 라이트 | brand-text on brand-hover | WCAG | 6.28 | 4.5 | 통과 |
| 라이트 | brand-tint-2-text on brand-tint-2 | WCAG | 6.78 | 4.5 | 통과 |
| 라이트 | brand-tint-2-text on brand-tint-2-hover | WCAG | 6.04 | 4.5 | 통과 |
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
| 라이트 | brand-ink on bg | WCAG | 6.02 | 4.5 | 통과 |
| 라이트 | brand-ink on bg (APCA) | APCA Lc | 77.52 | 60 | 통과 |
| 라이트 | brand-ink on surface | WCAG | 6.28 | 4.5 | 통과 |
| 라이트 | brand-ink on surface (APCA) | APCA Lc | 80.51 | 60 | 통과 |
| 라이트 | brand-ink on surface-2 | WCAG | 5.62 | 4.5 | 통과 |
| 라이트 | brand-ink on surface-2 (APCA) | APCA Lc | 72.81 | 60 | 통과 |
| 라이트 | text on brand-tint | WCAG | 16.50 | 4.5 | 통과 |
| 라이트 | text-2 on brand-tint | WCAG | 5.82 | 4.5 | 통과 |
| 라이트 | brand-ink on brand-tint | WCAG | 5.49 | 4.5 | 통과 |
| 라이트 | brand-ink on brand-tint (APCA) | APCA Lc | 71.31 | 60 | 통과 |
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
| 라이트 | ring on surface | WCAG | 6.28 | 3 | 통과 |
| 라이트 | ring on bg | WCAG | 6.02 | 3 | 통과 |
| 라이트 | chart-1 on surface | WCAG | 4.50 | 3 | 통과 |
| 라이트 | chart-1 on bg | WCAG | 4.31 | 3 | 통과 |
| 라이트 | chart-2 on surface | WCAG | 4.50 | 3 | 통과 |
| 라이트 | chart-2 on bg | WCAG | 4.32 | 3 | 통과 |
| 라이트 | chart-3 on surface | WCAG | 4.54 | 3 | 통과 |
| 라이트 | chart-3 on bg | WCAG | 4.35 | 3 | 통과 |
| 라이트 | chart-4 on surface | WCAG | 4.55 | 3 | 통과 |
| 라이트 | chart-4 on bg | WCAG | 4.36 | 3 | 통과 |
| 라이트 | chart-5 on surface | WCAG | 4.50 | 3 | 통과 |
| 라이트 | chart-5 on bg | WCAG | 4.31 | 3 | 통과 |
| 라이트 | brand-tint vs surface-2 (dE-OK) | ΔE OK | 0.0224 | 0.0184 | 통과 |
| 라이트 | bg vs surface (dE-OK) | ΔE OK | 0.0149 | 0.01 | 통과 |
| 라이트 | surface vs surface-2 (dE-OK) | ΔE OK | 0.0386 | 0.01 | 통과 |
| 라이트 | surface-2 vs surface-3 (dE-OK) | ΔE OK | 0.0359 | 0.01 | 통과 |
| 라이트 | brand vs ok-fill (hue gap) | hue 간격 | 164.98 | 29.5 | 통과 |
| 라이트 | brand vs warn-fill (hue gap) | hue 간격 | 79.92 | 29.5 | 통과 |
| 라이트 | brand vs danger-fill (hue gap) | hue 간격 | 39.76 | 29.5 | 통과 |
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
| 다크 | brand-text on brand-hover | WCAG | 6.28 | 4.5 | 통과 |
| 다크 | brand-tint-2-text on brand-tint-2 | WCAG | 6.42 | 4.5 | 통과 |
| 다크 | brand-tint-2-text on brand-tint-2-hover | WCAG | 5.12 | 4.5 | 통과 |
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
| 다크 | brand-ink on bg | WCAG | 10.62 | 4.5 | 통과 |
| 다크 | brand-ink on bg (APCA) | APCA Lc | 67.96 | 60 | 통과 |
| 다크 | brand-ink on surface | WCAG | 9.82 | 4.5 | 통과 |
| 다크 | brand-ink on surface (APCA) | APCA Lc | 67.27 | 60 | 통과 |
| 다크 | brand-ink on surface-2 | WCAG | 8.95 | 4.5 | 통과 |
| 다크 | brand-ink on surface-2 (APCA) | APCA Lc | 66.20 | 60 | 통과 |
| 다크 | text on brand-tint | WCAG | 13.32 | 4.5 | 통과 |
| 다크 | text-2 on brand-tint | WCAG | 5.77 | 4.5 | 통과 |
| 다크 | brand-ink on brand-tint | WCAG | 7.88 | 4.5 | 통과 |
| 다크 | brand-ink on brand-tint (APCA) | APCA Lc | 64.46 | 60 | 통과 |
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
| 다크 | brand-graphic on bg | WCAG | 4.34 | 3 | 통과 |
| 다크 | line on bg | WCAG | 4.58 | 3 | 통과 |
| 다크 | line on surface | WCAG | 4.23 | 3 | 통과 |
| 다크 | line on surface-2 | WCAG | 3.86 | 3 | 통과 |
| 다크 | ring on surface | WCAG | 9.82 | 3 | 통과 |
| 다크 | ring on bg | WCAG | 10.62 | 3 | 통과 |
| 다크 | chart-1 on surface | WCAG | 4.02 | 3 | 통과 |
| 다크 | chart-1 on bg | WCAG | 4.34 | 3 | 통과 |
| 다크 | chart-2 on surface | WCAG | 4.02 | 3 | 통과 |
| 다크 | chart-2 on bg | WCAG | 4.34 | 3 | 통과 |
| 다크 | chart-3 on surface | WCAG | 3.99 | 3 | 통과 |
| 다크 | chart-3 on bg | WCAG | 4.31 | 3 | 통과 |
| 다크 | chart-4 on surface | WCAG | 3.98 | 3 | 통과 |
| 다크 | chart-4 on bg | WCAG | 4.30 | 3 | 통과 |
| 다크 | chart-5 on surface | WCAG | 4.02 | 3 | 통과 |
| 다크 | chart-5 on bg | WCAG | 4.35 | 3 | 통과 |
| 다크 | brand-tint vs surface-2 (dE-OK) | ΔE OK | 0.0571 | 0.0184 | 통과 |
| 다크 | bg vs surface (dE-OK) | ΔE OK | 0.0459 | 0.01 | 통과 |
| 다크 | surface vs surface-2 (dE-OK) | ΔE OK | 0.0391 | 0.01 | 통과 |
| 다크 | surface-2 vs surface-3 (dE-OK) | ΔE OK | 0.0457 | 0.01 | 통과 |
| 다크 | brand vs ok-fill (hue gap) | hue 간격 | 164.98 | 29.5 | 통과 |
| 다크 | brand vs warn-fill (hue gap) | hue 간격 | 79.92 | 29.5 | 통과 |
| 다크 | brand vs danger-fill (hue gap) | hue 간격 | 39.76 | 29.5 | 통과 |
| 다크 | bg chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
| 다크 | surface chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
| 다크 | surface-2 chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
| 다크 | surface-3 chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
| 다크 | text chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
| 다크 | text-2 chroma | 채도 | 0.0043 | ≤ 0.008 | 통과 |
| 다크 | text-3 chroma | 채도 | 0.0059 | ≤ 0.008 | 통과 |
| 다크 | line chroma | 채도 | 0.0060 | ≤ 0.008 | 통과 |
