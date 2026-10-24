# 노랑 테마 (yellow)

scripts/build-registry.mjs가 만든 파일이에요. 규칙은 https://ui.pyospect.com/TASTE.md 의 §20에 있고, 여기에는 그 규칙이 이 브랜드 색에서 만든 값과 대비 검사 결과가 있어요.

- 시드: `#FCCA21`
- 모드: 검은 글자 (채움 위 글자 `#111111`)
- 채움: `#FCCA21` (brand-200), 시드 그대로예요
- 상태색 hue: danger 25°, warn 58° (-7° 옮김), ok 150°
- 설치: `npx pyospectui --preset yellow` 또는 `npx shadcn add https://ui.pyospect.com/r/v0.4.0/theme-yellow.json`

## 알려 드릴 점

- 밝은 브랜드 색이라 채움 위 글자를 흰색 대신 검은색(#111111)으로 써요. 대비는 12.24:1이에요.
- 채움 색은 흰 바탕에서 1.54:1이라 스위치와 점 같은 그래픽에는 brand-graphic(#7D6200)을 써요.
- warn(주의) 색이 브랜드와 가까워서 hue 65°에서 58°로 옮겼어요(채움 #B16317).

## 브랜드 스케일

| step | hex |
|---|---|
| brand-50 | `#FFF5DA` |
| brand-100 | `#FEEAB4` |
| brand-200 | `#FCCA21` 채움 |
| brand-300 | `#E9BF42` |
| brand-400 | `#D4A800` |
| brand-500 | `#B69000` |
| brand-600 | `#997900` |
| brand-700 | `#7D6200` |
| brand-800 | `#624D00` |
| brand-900 | `#4C3B00` |
| brand-950 | `#312500` |

## 토큰

| 토큰 | 라이트 | 다크 |
|---|---|---|
| brand | `#FCCA21` | `#FCCA21` |
| brand-text | `#111111` | `#111111` |
| brand-hover | `#EEBD00` | `#EEBD00` |
| brand-ink | `#7D6200` | `#E9BF42` |
| brand-tint | `#F6F2E0` | `#312B14` |
| brand-tint-2 | `#EFE7C7` | `#443A11` |
| brand-tint-2-hover | `#E8DBAD` | `#57480F` |
| brand-tint-2-text | `#624D00` | `#E9BF42` |
| brand-graphic | `#7D6200` | `#FCCA21` |
| brand-graphic-text | `#FFFFFF` | `#111111` |
| ok | `#087D39` | `#67D283` |
| warn | `#A25700` | `#FE9D4A` |
| danger | `#C13C3B` | `#FF8079` |
| ok-fill | `#1E8843` | `#1E8843` |
| warn-fill | `#B16317` | `#B16317` |
| danger-fill | `#CE4846` | `#CE4846` |
| ok-fill-text | `#FFFFFF` | `#FFFFFF` |
| warn-fill-text | `#FFFFFF` | `#FFFFFF` |
| danger-fill-text | `#FFFFFF` | `#FFFFFF` |
| ok-tint | `#E9F3EC` | `#223126` |
| warn-tint | `#F6ECE3` | `#372A1E` |
| danger-tint | `#FAEDED` | `#372625` |
| chart-1 | `#7D6200` | `#FCCA21` |
| chart-2 | `#00875C` | `#00875C` |
| chart-3 | `#007FB0` | `#007FB0` |
| chart-4 | `#9062BC` | `#9062BC` |
| chart-5 | `#C0545C` | `#C0545C` |

## 대비 검사

164개 조합 중 164개가 기준을 넘어요. 8비트 값과 반올림 전 값 중 나쁜 쪽으로 쟀어요.

| 테마 | 조합 | 종류 | 값 | 기준 | 결과 |
|---|---|---|---|---|---|
| 라이트 | card-foreground on card | WCAG | 15.13 | 4.5 | 통과 |
| 라이트 | popover-foreground on popover | WCAG | 15.13 | 4.5 | 통과 |
| 라이트 | primary-foreground on primary | WCAG | 12.24 | 4.5 | 통과 |
| 라이트 | secondary-foreground on secondary | WCAG | 13.88 | 4.5 | 통과 |
| 라이트 | muted-foreground on muted | WCAG | 7.17 | 4.5 | 통과 |
| 라이트 | accent-foreground on accent | WCAG | 13.88 | 4.5 | 통과 |
| 라이트 | destructive-foreground on destructive | WCAG | 4.53 | 4.5 | 통과 |
| 라이트 | sidebar-foreground on sidebar | WCAG | 15.13 | 4.5 | 통과 |
| 라이트 | sidebar-primary-foreground on sidebar-primary | WCAG | 12.24 | 4.5 | 통과 |
| 라이트 | sidebar-accent-foreground on sidebar-accent | WCAG | 13.88 | 4.5 | 통과 |
| 라이트 | brand-text on brand | WCAG | 12.24 | 4.5 | 통과 |
| 라이트 | brand-text on brand-hover | WCAG | 10.71 | 4.5 | 통과 |
| 라이트 | brand-tint-2-text on brand-tint-2 | WCAG | 6.54 | 4.5 | 통과 |
| 라이트 | brand-tint-2-text on brand-tint-2-hover | WCAG | 5.88 | 4.5 | 통과 |
| 라이트 | brand-graphic-text on brand-graphic | WCAG | 5.80 | 4.5 | 통과 |
| 라이트 | ok-fill-text on ok-fill | WCAG | 4.51 | 4.5 | 통과 |
| 라이트 | warn-fill-text on warn-fill | WCAG | 4.50 | 4.5 | 통과 |
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
| 라이트 | brand-ink on bg | WCAG | 5.56 | 4.5 | 통과 |
| 라이트 | brand-ink on bg (APCA) | APCA Lc | 75.83 | 60 | 통과 |
| 라이트 | brand-ink on surface | WCAG | 5.80 | 4.5 | 통과 |
| 라이트 | brand-ink on surface (APCA) | APCA Lc | 78.82 | 60 | 통과 |
| 라이트 | brand-ink on surface-2 | WCAG | 5.32 | 4.5 | 통과 |
| 라이트 | brand-ink on surface-2 (APCA) | APCA Lc | 72.86 | 60 | 통과 |
| 라이트 | text on brand-tint | WCAG | 13.45 | 4.5 | 통과 |
| 라이트 | text-2 on brand-tint | WCAG | 6.95 | 4.5 | 통과 |
| 라이트 | brand-ink on brand-tint | WCAG | 5.16 | 4.5 | 통과 |
| 라이트 | brand-ink on brand-tint (APCA) | APCA Lc | 70.77 | 60 | 통과 |
| 라이트 | ok on bg | WCAG | 5.03 | 4.6 | 통과 |
| 라이트 | ok on surface | WCAG | 5.25 | 4.6 | 통과 |
| 라이트 | ok on surface-2 | WCAG | 4.81 | 4.6 | 통과 |
| 라이트 | ok on ok-tint | WCAG | 4.62 | 4.6 | 통과 |
| 라이트 | warn on bg | WCAG | 5.16 | 4.6 | 통과 |
| 라이트 | warn on surface | WCAG | 5.39 | 4.6 | 통과 |
| 라이트 | warn on surface-2 | WCAG | 4.94 | 4.6 | 통과 |
| 라이트 | warn on warn-tint | WCAG | 4.62 | 4.6 | 통과 |
| 라이트 | danger on bg | WCAG | 5.06 | 4.6 | 통과 |
| 라이트 | danger on surface | WCAG | 5.28 | 4.6 | 통과 |
| 라이트 | danger on surface-2 | WCAG | 4.84 | 4.6 | 통과 |
| 라이트 | danger on danger-tint | WCAG | 4.62 | 4.6 | 통과 |
| 라이트 | brand-graphic on surface | WCAG | 5.80 | 3 | 통과 |
| 라이트 | brand-graphic on bg | WCAG | 5.56 | 3 | 통과 |
| 라이트 | line on bg | WCAG | 4.35 | 3 | 통과 |
| 라이트 | line on surface | WCAG | 4.54 | 3 | 통과 |
| 라이트 | line on surface-2 | WCAG | 4.17 | 3 | 통과 |
| 라이트 | ring on surface | WCAG | 5.80 | 3 | 통과 |
| 라이트 | ring on bg | WCAG | 5.56 | 3 | 통과 |
| 라이트 | chart-1 on surface | WCAG | 5.80 | 3 | 통과 |
| 라이트 | chart-1 on bg | WCAG | 5.56 | 3 | 통과 |
| 라이트 | chart-2 on surface | WCAG | 4.55 | 3 | 통과 |
| 라이트 | chart-2 on bg | WCAG | 4.35 | 3 | 통과 |
| 라이트 | chart-3 on surface | WCAG | 4.50 | 3 | 통과 |
| 라이트 | chart-3 on bg | WCAG | 4.32 | 3 | 통과 |
| 라이트 | chart-4 on surface | WCAG | 4.51 | 3 | 통과 |
| 라이트 | chart-4 on bg | WCAG | 4.32 | 3 | 통과 |
| 라이트 | chart-5 on surface | WCAG | 4.50 | 3 | 통과 |
| 라이트 | chart-5 on bg | WCAG | 4.31 | 3 | 통과 |
| 라이트 | brand-tint vs surface-2 (dE-OK) | ΔE OK | 0.0258 | 0.0184 | 통과 |
| 라이트 | bg vs surface (dE-OK) | ΔE OK | 0.0149 | 0.01 | 통과 |
| 라이트 | surface vs surface-2 (dE-OK) | ΔE OK | 0.0298 | 0.01 | 통과 |
| 라이트 | surface-2 vs surface-3 (dE-OK) | ΔE OK | 0.0482 | 0.01 | 통과 |
| 라이트 | brand vs ok-fill (hue gap) | hue 간격 | 60.19 | 29.5 | 통과 |
| 라이트 | brand vs warn-fill (hue gap) | hue 간격 | 31.79 | 29.5 | 통과 |
| 라이트 | brand vs danger-fill (hue gap) | hue 간격 | 65.03 | 29.5 | 통과 |
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
| 다크 | primary-foreground on primary | WCAG | 12.24 | 4.5 | 통과 |
| 다크 | secondary-foreground on secondary | WCAG | 13.88 | 4.5 | 통과 |
| 다크 | muted-foreground on muted | WCAG | 10.21 | 4.5 | 통과 |
| 다크 | accent-foreground on accent | WCAG | 13.88 | 4.5 | 통과 |
| 다크 | destructive-foreground on destructive | WCAG | 4.53 | 4.5 | 통과 |
| 다크 | sidebar-foreground on sidebar | WCAG | 16.44 | 4.5 | 통과 |
| 다크 | sidebar-primary-foreground on sidebar-primary | WCAG | 12.24 | 4.5 | 통과 |
| 다크 | sidebar-accent-foreground on sidebar-accent | WCAG | 13.88 | 4.5 | 통과 |
| 다크 | brand-text on brand | WCAG | 12.24 | 4.5 | 통과 |
| 다크 | brand-text on brand-hover | WCAG | 10.71 | 4.5 | 통과 |
| 다크 | brand-tint-2-text on brand-tint-2 | WCAG | 6.45 | 4.5 | 통과 |
| 다크 | brand-tint-2-text on brand-tint-2-hover | WCAG | 5.11 | 4.5 | 통과 |
| 다크 | brand-graphic-text on brand-graphic | WCAG | 12.24 | 4.5 | 통과 |
| 다크 | ok-fill-text on ok-fill | WCAG | 4.51 | 4.5 | 통과 |
| 다크 | warn-fill-text on warn-fill | WCAG | 4.50 | 4.5 | 통과 |
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
| 다크 | brand-ink on bg | WCAG | 11.31 | 4.5 | 통과 |
| 다크 | brand-ink on bg (APCA) | APCA Lc | 70.78 | 60 | 통과 |
| 다크 | brand-ink on surface | WCAG | 10.24 | 4.5 | 통과 |
| 다크 | brand-ink on surface (APCA) | APCA Lc | 69.91 | 60 | 통과 |
| 다크 | brand-ink on surface-2 | WCAG | 8.64 | 4.5 | 통과 |
| 다크 | brand-ink on surface-2 (APCA) | APCA Lc | 67.84 | 60 | 통과 |
| 다크 | text on brand-tint | WCAG | 12.90 | 4.5 | 통과 |
| 다크 | text-2 on brand-tint | WCAG | 9.49 | 4.5 | 통과 |
| 다크 | brand-ink on brand-tint | WCAG | 8.04 | 4.5 | 통과 |
| 다크 | brand-ink on brand-tint (APCA) | APCA Lc | 66.76 | 60 | 통과 |
| 다크 | ok on bg | WCAG | 10.49 | 4.5 | 통과 |
| 다크 | ok on surface | WCAG | 9.50 | 4.5 | 통과 |
| 다크 | ok on surface-2 | WCAG | 8.02 | 4.5 | 통과 |
| 다크 | ok on ok-tint | WCAG | 7.23 | 4.5 | 통과 |
| 다크 | warn on bg | WCAG | 9.56 | 4.5 | 통과 |
| 다크 | warn on surface | WCAG | 8.65 | 4.5 | 통과 |
| 다크 | warn on surface-2 | WCAG | 7.30 | 4.5 | 통과 |
| 다크 | warn on warn-tint | WCAG | 6.70 | 4.5 | 통과 |
| 다크 | danger on bg | WCAG | 8.12 | 4.5 | 통과 |
| 다크 | danger on surface | WCAG | 7.36 | 4.5 | 통과 |
| 다크 | danger on surface-2 | WCAG | 6.21 | 4.5 | 통과 |
| 다크 | danger on danger-tint | WCAG | 5.88 | 4.5 | 통과 |
| 다크 | brand-graphic on surface | WCAG | 11.62 | 3 | 통과 |
| 다크 | brand-graphic on bg | WCAG | 12.83 | 3 | 통과 |
| 다크 | line on bg | WCAG | 5.73 | 3 | 통과 |
| 다크 | line on surface | WCAG | 5.19 | 3 | 통과 |
| 다크 | line on surface-2 | WCAG | 4.38 | 3 | 통과 |
| 다크 | ring on surface | WCAG | 10.24 | 3 | 통과 |
| 다크 | ring on bg | WCAG | 11.31 | 3 | 통과 |
| 다크 | chart-1 on surface | WCAG | 11.62 | 3 | 통과 |
| 다크 | chart-1 on bg | WCAG | 12.83 | 3 | 통과 |
| 다크 | chart-2 on surface | WCAG | 3.94 | 3 | 통과 |
| 다크 | chart-2 on bg | WCAG | 4.36 | 3 | 통과 |
| 다크 | chart-3 on surface | WCAG | 3.98 | 3 | 통과 |
| 다크 | chart-3 on bg | WCAG | 4.40 | 3 | 통과 |
| 다크 | chart-4 on surface | WCAG | 3.98 | 3 | 통과 |
| 다크 | chart-4 on bg | WCAG | 4.39 | 3 | 통과 |
| 다크 | chart-5 on surface | WCAG | 3.98 | 3 | 통과 |
| 다크 | chart-5 on bg | WCAG | 4.40 | 3 | 통과 |
| 다크 | brand-tint vs surface-2 (dE-OK) | ΔE OK | 0.0434 | 0.0184 | 통과 |
| 다크 | bg vs surface (dE-OK) | ΔE OK | 0.0598 | 0.01 | 통과 |
| 다크 | surface vs surface-2 (dE-OK) | ΔE OK | 0.0640 | 0.01 | 통과 |
| 다크 | surface-2 vs surface-3 (dE-OK) | ΔE OK | 0.1029 | 0.01 | 통과 |
| 다크 | brand vs ok-fill (hue gap) | hue 간격 | 60.19 | 29.5 | 통과 |
| 다크 | brand vs warn-fill (hue gap) | hue 간격 | 31.79 | 29.5 | 통과 |
| 다크 | brand vs danger-fill (hue gap) | hue 간격 | 65.03 | 29.5 | 통과 |
| 다크 | bg chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
| 다크 | surface chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
| 다크 | surface-2 chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
| 다크 | surface-3 chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
| 다크 | text chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
| 다크 | text-2 chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
| 다크 | text-3 chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
| 다크 | line chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
