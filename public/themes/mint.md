# 민트 테마 (mint)

scripts/build-registry.mjs가 만든 파일이에요. 규칙은 https://ui.pyospect.com/TASTE.md 의 §20에 있고, 여기에는 그 규칙이 이 브랜드 색에서 만든 값과 대비 검사 결과가 있어요.

- 시드: `#11866F`
- 모드: 흰 글자 (채움 위 글자 `#FFFFFF`)
- 채움: `#11866F` (brand-600), 시드 그대로예요
- 상태색 hue: danger 25°, warn 65°, ok 143° (-7° 옮김)
- 설치: `npx pyospectui --preset mint` 또는 `npx shadcn add https://ui.pyospect.com/r/theme-mint.json`

## 알려 드릴 점

- ok(성공) 색이 브랜드와 가까워서 hue 150°에서 143°로 옮겼어요(채움 #388636).

## 브랜드 스케일

| step | hex |
|---|---|
| brand-50 | `#E7FAF4` |
| brand-100 | `#CEF5E9` |
| brand-200 | `#AEE9D8` |
| brand-300 | `#85D7C0` |
| brand-400 | `#5BC4A9` |
| brand-500 | `#39AB91` |
| brand-600 | `#11866F` 채움 |
| brand-700 | `#1D7663` |
| brand-800 | `#165D4D` |
| brand-900 | `#13473B` |
| brand-950 | `#092D25` |

## 토큰

| 토큰 | 라이트 | 다크 |
|---|---|---|
| brand | `#11866F` | `#11866F` |
| brand-text | `#FFFFFF` | `#FFFFFF` |
| brand-hover | `#1D7663` | `#1D7663` |
| brand-ink | `#1D7663` | `#85D7C0` |
| brand-tint | `#E4F4F0` | `#202E2B` |
| brand-tint-2 | `#D0EBE5` | `#274039` |
| brand-tint-2-hover | `#BDE3DA` | `#2D5148` |
| brand-tint-2-text | `#165D4D` | `#85D7C0` |
| brand-graphic | `#11866F` | `#11866F` |
| brand-graphic-text | `#FFFFFF` | `#FFFFFF` |
| ok | `#2D7C2B` | `#7AD075` |
| warn | `#9B5B00` | `#F4A437` |
| danger | `#C13C3B` | `#FF8079` |
| ok-fill | `#388636` | `#388636` |
| warn-fill | `#AC6600` | `#AC6600` |
| danger-fill | `#CE4846` | `#CE4846` |
| ok-fill-text | `#FFFFFF` | `#FFFFFF` |
| warn-fill-text | `#FFFFFF` | `#FFFFFF` |
| danger-fill-text | `#FFFFFF` | `#FFFFFF` |
| ok-tint | `#EBF3EB` | `#243023` |
| warn-tint | `#F5EDE0` | `#352A1B` |
| danger-tint | `#FAEDED` | `#372524` |
| chart-1 | `#11866F` | `#11866F` |
| chart-2 | `#157BC3` | `#157BC3` |
| chart-3 | `#9E5DB0` | `#9E5DB0` |
| chart-4 | `#C05646` | `#C05646` |
| chart-5 | `#837800` | `#837800` |

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
| 라이트 | brand-text on brand-hover | WCAG | 5.49 | 4.5 | 통과 |
| 라이트 | brand-tint-2-text on brand-tint-2 | WCAG | 6.17 | 4.5 | 통과 |
| 라이트 | brand-tint-2-text on brand-tint-2-hover | WCAG | 5.59 | 4.5 | 통과 |
| 라이트 | brand-graphic-text on brand-graphic | WCAG | 4.50 | 4.5 | 통과 |
| 라이트 | ok-fill-text on ok-fill | WCAG | 4.53 | 4.5 | 통과 |
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
| 라이트 | brand-ink on bg | WCAG | 5.26 | 4.5 | 통과 |
| 라이트 | brand-ink on bg (APCA) | APCA Lc | 74.08 | 60 | 통과 |
| 라이트 | brand-ink on surface | WCAG | 5.49 | 4.5 | 통과 |
| 라이트 | brand-ink on surface (APCA) | APCA Lc | 77.08 | 60 | 통과 |
| 라이트 | brand-ink on surface-2 | WCAG | 4.91 | 4.5 | 통과 |
| 라이트 | brand-ink on surface-2 (APCA) | APCA Lc | 69.38 | 60 | 통과 |
| 라이트 | text on brand-tint | WCAG | 16.61 | 4.5 | 통과 |
| 라이트 | text-2 on brand-tint | WCAG | 5.86 | 4.5 | 통과 |
| 라이트 | brand-ink on brand-tint | WCAG | 4.83 | 4.5 | 통과 |
| 라이트 | brand-ink on brand-tint (APCA) | APCA Lc | 68.30 | 60 | 통과 |
| 라이트 | ok on bg | WCAG | 4.99 | 4.6 | 통과 |
| 라이트 | ok on surface | WCAG | 5.21 | 4.6 | 통과 |
| 라이트 | ok on surface-2 | WCAG | 4.66 | 4.6 | 통과 |
| 라이트 | ok on ok-tint | WCAG | 4.60 | 4.6 | 통과 |
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
| 라이트 | ring on surface | WCAG | 5.49 | 3 | 통과 |
| 라이트 | ring on bg | WCAG | 5.26 | 3 | 통과 |
| 라이트 | chart-1 on surface | WCAG | 4.50 | 3 | 통과 |
| 라이트 | chart-1 on bg | WCAG | 4.31 | 3 | 통과 |
| 라이트 | chart-2 on surface | WCAG | 4.51 | 3 | 통과 |
| 라이트 | chart-2 on bg | WCAG | 4.32 | 3 | 통과 |
| 라이트 | chart-3 on surface | WCAG | 4.52 | 3 | 통과 |
| 라이트 | chart-3 on bg | WCAG | 4.33 | 3 | 통과 |
| 라이트 | chart-4 on surface | WCAG | 4.51 | 3 | 통과 |
| 라이트 | chart-4 on bg | WCAG | 4.32 | 3 | 통과 |
| 라이트 | chart-5 on surface | WCAG | 4.51 | 3 | 통과 |
| 라이트 | chart-5 on bg | WCAG | 4.33 | 3 | 통과 |
| 라이트 | brand-tint vs surface-2 (dE-OK) | ΔE OK | 0.0189 | 0.0184 | 통과 |
| 라이트 | bg vs surface (dE-OK) | ΔE OK | 0.0149 | 0.01 | 통과 |
| 라이트 | surface vs surface-2 (dE-OK) | ΔE OK | 0.0386 | 0.01 | 통과 |
| 라이트 | surface-2 vs surface-3 (dE-OK) | ΔE OK | 0.0359 | 0.01 | 통과 |
| 라이트 | brand vs ok-fill (hue gap) | hue 간격 | 31.48 | 29.5 | 통과 |
| 라이트 | brand vs warn-fill (hue gap) | hue 간격 | 109.54 | 29.5 | 통과 |
| 라이트 | brand vs danger-fill (hue gap) | hue 간격 | 149.70 | 29.5 | 통과 |
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
| 다크 | brand-text on brand-hover | WCAG | 5.49 | 4.5 | 통과 |
| 다크 | brand-tint-2-text on brand-tint-2 | WCAG | 6.64 | 4.5 | 통과 |
| 다크 | brand-tint-2-text on brand-tint-2-hover | WCAG | 5.22 | 4.5 | 통과 |
| 다크 | brand-graphic-text on brand-graphic | WCAG | 4.50 | 4.5 | 통과 |
| 다크 | ok-fill-text on ok-fill | WCAG | 4.53 | 4.5 | 통과 |
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
| 다크 | brand-ink on bg | WCAG | 11.62 | 4.5 | 통과 |
| 다크 | brand-ink on bg (APCA) | APCA Lc | 72.88 | 60 | 통과 |
| 다크 | brand-ink on surface | WCAG | 10.75 | 4.5 | 통과 |
| 다크 | brand-ink on surface (APCA) | APCA Lc | 72.19 | 60 | 통과 |
| 다크 | brand-ink on surface-2 | WCAG | 9.79 | 4.5 | 통과 |
| 다크 | brand-ink on surface-2 (APCA) | APCA Lc | 71.12 | 60 | 통과 |
| 다크 | text on brand-tint | WCAG | 12.92 | 4.5 | 통과 |
| 다크 | text-2 on brand-tint | WCAG | 5.60 | 4.5 | 통과 |
| 다크 | brand-ink on brand-tint | WCAG | 8.37 | 4.5 | 통과 |
| 다크 | brand-ink on brand-tint (APCA) | APCA Lc | 68.96 | 60 | 통과 |
| 다크 | ok on bg | WCAG | 10.35 | 4.5 | 통과 |
| 다크 | ok on surface | WCAG | 9.57 | 4.5 | 통과 |
| 다크 | ok on surface-2 | WCAG | 8.72 | 4.5 | 통과 |
| 다크 | ok on ok-tint | WCAG | 7.29 | 4.5 | 통과 |
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
| 다크 | ring on surface | WCAG | 10.75 | 3 | 통과 |
| 다크 | ring on bg | WCAG | 11.62 | 3 | 통과 |
| 다크 | chart-1 on surface | WCAG | 4.02 | 3 | 통과 |
| 다크 | chart-1 on bg | WCAG | 4.34 | 3 | 통과 |
| 다크 | chart-2 on surface | WCAG | 4.01 | 3 | 통과 |
| 다크 | chart-2 on bg | WCAG | 4.33 | 3 | 통과 |
| 다크 | chart-3 on surface | WCAG | 4.00 | 3 | 통과 |
| 다크 | chart-3 on bg | WCAG | 4.33 | 3 | 통과 |
| 다크 | chart-4 on surface | WCAG | 4.02 | 3 | 통과 |
| 다크 | chart-4 on bg | WCAG | 4.34 | 3 | 통과 |
| 다크 | chart-5 on surface | WCAG | 4.01 | 3 | 통과 |
| 다크 | chart-5 on bg | WCAG | 4.33 | 3 | 통과 |
| 다크 | brand-tint vs surface-2 (dE-OK) | ΔE OK | 0.0520 | 0.0184 | 통과 |
| 다크 | bg vs surface (dE-OK) | ΔE OK | 0.0459 | 0.01 | 통과 |
| 다크 | surface vs surface-2 (dE-OK) | ΔE OK | 0.0391 | 0.01 | 통과 |
| 다크 | surface-2 vs surface-3 (dE-OK) | ΔE OK | 0.0457 | 0.01 | 통과 |
| 다크 | brand vs ok-fill (hue gap) | hue 간격 | 31.48 | 29.5 | 통과 |
| 다크 | brand vs warn-fill (hue gap) | hue 간격 | 109.54 | 29.5 | 통과 |
| 다크 | brand vs danger-fill (hue gap) | hue 간격 | 149.70 | 29.5 | 통과 |
| 다크 | bg chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
| 다크 | surface chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
| 다크 | surface-2 chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
| 다크 | surface-3 chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
| 다크 | text chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
| 다크 | text-2 chroma | 채도 | 0.0043 | ≤ 0.008 | 통과 |
| 다크 | text-3 chroma | 채도 | 0.0059 | ≤ 0.008 | 통과 |
| 다크 | line chroma | 채도 | 0.0060 | ≤ 0.008 | 통과 |
