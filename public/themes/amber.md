# 호박 테마 (amber)

scripts/build-registry.mjs가 만든 파일이에요. 규칙은 https://ui.pyospect.com/TASTE.md 의 §20에 있고, 여기에는 그 규칙이 이 브랜드 색에서 만든 값과 대비 검사 결과가 있어요.

- 시드: `#FFB020`
- 모드: 검은 글자 (채움 위 글자 `#111111`)
- 채움: `#FFB020` (brand-300), 시드 그대로예요
- 상태색 hue: danger 25°, warn 55° (-10° 옮김), ok 150°
- 설치: `npx pyospectui --preset amber` 또는 `npx shadcn add https://ui.pyospect.com/r/v0.4.0/theme-amber.json`

## 알려 드릴 점

- 밝은 브랜드 색이라 채움 위 글자를 흰색 대신 검은색(#111111)으로 써요. 대비는 10.33:1이에요.
- 채움 색은 흰 바탕에서 1.83:1이라 스위치와 점 같은 그래픽에는 brand-graphic(#895B00)을 써요.
- warn(주의) 색이 브랜드와 가까워서 hue 65°에서 55°로 옮겼어요(채움 #B3611E).
- warn(주의) 색이 브랜드와 20°밖에 떨어지지 않아요. 색만으로는 구분되지 않으니 라벨로 구분해 주세요.

## 브랜드 스케일

| step | hex |
|---|---|
| brand-50 | `#FFF3E4` |
| brand-100 | `#FFE7C8` |
| brand-200 | `#FFD395` |
| brand-300 | `#FFB020` 채움 |
| brand-400 | `#E79D00` |
| brand-500 | `#C78600` |
| brand-600 | `#A87100` |
| brand-700 | `#895B00` |
| brand-800 | `#6C4700` |
| brand-900 | `#543600` |
| brand-950 | `#362200` |

## 토큰

| 토큰 | 라이트 | 다크 |
|---|---|---|
| brand | `#FFB020` | `#FFB020` |
| brand-text | `#111111` | `#111111` |
| brand-hover | `#F1A300` | `#F1A300` |
| brand-ink | `#895B00` | `#FFB020` |
| brand-tint | `#F8F0E0` | `#342A14` |
| brand-tint-2 | `#F3E4C7` | `#493711` |
| brand-tint-2-hover | `#EDD8AD` | `#5E450F` |
| brand-tint-2-text | `#6C4700` | `#FFB020` |
| brand-graphic | `#895B00` | `#FFB020` |
| brand-graphic-text | `#FFFFFF` | `#111111` |
| ok | `#087D39` | `#67D283` |
| warn | `#A55508` | `#FF9B51` |
| danger | `#C13C3B` | `#FF8079` |
| ok-fill | `#1E8843` | `#1E8843` |
| warn-fill | `#B3611E` | `#B3611E` |
| danger-fill | `#CE4846` | `#CE4846` |
| ok-fill-text | `#FFFFFF` | `#FFFFFF` |
| warn-fill-text | `#FFFFFF` | `#FFFFFF` |
| danger-fill-text | `#FFFFFF` | `#FFFFFF` |
| ok-tint | `#E9F3EC` | `#223126` |
| warn-tint | `#F6ECE4` | `#37291F` |
| danger-tint | `#FAEDED` | `#372625` |
| chart-1 | `#895B00` | `#FFB020` |
| chart-2 | `#2B873D` | `#2B873D` |
| chart-3 | `#00819C` | `#00819C` |
| chart-4 | `#7C68C6` | `#7C68C6` |
| chart-5 | `#BD5374` | `#BD5374` |

## 대비 검사

164개 조합 중 162개가 기준을 넘어요. 기준에 못 미친 2개는 경고(hue 간격)예요. 라벨로 구분해 주세요. 8비트 값과 반올림 전 값 중 나쁜 쪽으로 쟀어요.

| 테마 | 조합 | 종류 | 값 | 기준 | 결과 |
|---|---|---|---|---|---|
| 라이트 | card-foreground on card | WCAG | 15.13 | 4.5 | 통과 |
| 라이트 | popover-foreground on popover | WCAG | 15.13 | 4.5 | 통과 |
| 라이트 | primary-foreground on primary | WCAG | 10.33 | 4.5 | 통과 |
| 라이트 | secondary-foreground on secondary | WCAG | 13.88 | 4.5 | 통과 |
| 라이트 | muted-foreground on muted | WCAG | 7.17 | 4.5 | 통과 |
| 라이트 | accent-foreground on accent | WCAG | 13.88 | 4.5 | 통과 |
| 라이트 | destructive-foreground on destructive | WCAG | 4.53 | 4.5 | 통과 |
| 라이트 | sidebar-foreground on sidebar | WCAG | 15.13 | 4.5 | 통과 |
| 라이트 | sidebar-primary-foreground on sidebar-primary | WCAG | 10.33 | 4.5 | 통과 |
| 라이트 | sidebar-accent-foreground on sidebar-accent | WCAG | 13.88 | 4.5 | 통과 |
| 라이트 | brand-text on brand | WCAG | 10.33 | 4.5 | 통과 |
| 라이트 | brand-text on brand-hover | WCAG | 8.97 | 4.5 | 통과 |
| 라이트 | brand-tint-2-text on brand-tint-2 | WCAG | 6.59 | 4.5 | 통과 |
| 라이트 | brand-tint-2-text on brand-tint-2-hover | WCAG | 5.92 | 4.5 | 통과 |
| 라이트 | brand-graphic-text on brand-graphic | WCAG | 5.90 | 4.5 | 통과 |
| 라이트 | ok-fill-text on ok-fill | WCAG | 4.51 | 4.5 | 통과 |
| 라이트 | warn-fill-text on warn-fill | WCAG | 4.52 | 4.5 | 통과 |
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
| 라이트 | brand-ink on bg | WCAG | 5.65 | 4.5 | 통과 |
| 라이트 | brand-ink on bg (APCA) | APCA Lc | 76.21 | 60 | 통과 |
| 라이트 | brand-ink on surface | WCAG | 5.90 | 4.5 | 통과 |
| 라이트 | brand-ink on surface (APCA) | APCA Lc | 79.21 | 60 | 통과 |
| 라이트 | brand-ink on surface-2 | WCAG | 5.41 | 4.5 | 통과 |
| 라이트 | brand-ink on surface-2 (APCA) | APCA Lc | 73.24 | 60 | 통과 |
| 라이트 | text on brand-tint | WCAG | 13.35 | 4.5 | 통과 |
| 라이트 | text-2 on brand-tint | WCAG | 6.90 | 4.5 | 통과 |
| 라이트 | brand-ink on brand-tint | WCAG | 5.21 | 4.5 | 통과 |
| 라이트 | brand-ink on brand-tint (APCA) | APCA Lc | 70.66 | 60 | 통과 |
| 라이트 | ok on bg | WCAG | 5.03 | 4.6 | 통과 |
| 라이트 | ok on surface | WCAG | 5.25 | 4.6 | 통과 |
| 라이트 | ok on surface-2 | WCAG | 4.81 | 4.6 | 통과 |
| 라이트 | ok on ok-tint | WCAG | 4.62 | 4.6 | 통과 |
| 라이트 | warn on bg | WCAG | 5.16 | 4.6 | 통과 |
| 라이트 | warn on surface | WCAG | 5.38 | 4.6 | 통과 |
| 라이트 | warn on surface-2 | WCAG | 4.94 | 4.6 | 통과 |
| 라이트 | warn on warn-tint | WCAG | 4.62 | 4.6 | 통과 |
| 라이트 | danger on bg | WCAG | 5.06 | 4.6 | 통과 |
| 라이트 | danger on surface | WCAG | 5.28 | 4.6 | 통과 |
| 라이트 | danger on surface-2 | WCAG | 4.84 | 4.6 | 통과 |
| 라이트 | danger on danger-tint | WCAG | 4.62 | 4.6 | 통과 |
| 라이트 | brand-graphic on surface | WCAG | 5.90 | 3 | 통과 |
| 라이트 | brand-graphic on bg | WCAG | 5.65 | 3 | 통과 |
| 라이트 | line on bg | WCAG | 4.35 | 3 | 통과 |
| 라이트 | line on surface | WCAG | 4.54 | 3 | 통과 |
| 라이트 | line on surface-2 | WCAG | 4.17 | 3 | 통과 |
| 라이트 | ring on surface | WCAG | 5.90 | 3 | 통과 |
| 라이트 | ring on bg | WCAG | 5.65 | 3 | 통과 |
| 라이트 | chart-1 on surface | WCAG | 5.90 | 3 | 통과 |
| 라이트 | chart-1 on bg | WCAG | 5.65 | 3 | 통과 |
| 라이트 | chart-2 on surface | WCAG | 4.53 | 3 | 통과 |
| 라이트 | chart-2 on bg | WCAG | 4.34 | 3 | 통과 |
| 라이트 | chart-3 on surface | WCAG | 4.55 | 3 | 통과 |
| 라이트 | chart-3 on bg | WCAG | 4.35 | 3 | 통과 |
| 라이트 | chart-4 on surface | WCAG | 4.51 | 3 | 통과 |
| 라이트 | chart-4 on bg | WCAG | 4.32 | 3 | 통과 |
| 라이트 | chart-5 on surface | WCAG | 4.51 | 3 | 통과 |
| 라이트 | chart-5 on bg | WCAG | 4.32 | 3 | 통과 |
| 라이트 | brand-tint vs surface-2 (dE-OK) | ΔE OK | 0.0257 | 0.0184 | 통과 |
| 라이트 | bg vs surface (dE-OK) | ΔE OK | 0.0149 | 0.01 | 통과 |
| 라이트 | surface vs surface-2 (dE-OK) | ΔE OK | 0.0298 | 0.01 | 통과 |
| 라이트 | surface-2 vs surface-3 (dE-OK) | ΔE OK | 0.0482 | 0.01 | 통과 |
| 라이트 | brand vs ok-fill (hue gap) | hue 간격 | 74.95 | 29.5 | 통과 |
| 라이트 | brand vs warn-fill (hue gap) | hue 간격 | 20.56 | 29.5 | 경고 |
| 라이트 | brand vs danger-fill (hue gap) | hue 간격 | 50.27 | 29.5 | 통과 |
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
| 다크 | primary-foreground on primary | WCAG | 10.33 | 4.5 | 통과 |
| 다크 | secondary-foreground on secondary | WCAG | 13.88 | 4.5 | 통과 |
| 다크 | muted-foreground on muted | WCAG | 10.21 | 4.5 | 통과 |
| 다크 | accent-foreground on accent | WCAG | 13.88 | 4.5 | 통과 |
| 다크 | destructive-foreground on destructive | WCAG | 4.53 | 4.5 | 통과 |
| 다크 | sidebar-foreground on sidebar | WCAG | 16.44 | 4.5 | 통과 |
| 다크 | sidebar-primary-foreground on sidebar-primary | WCAG | 10.33 | 4.5 | 통과 |
| 다크 | sidebar-accent-foreground on sidebar-accent | WCAG | 13.88 | 4.5 | 통과 |
| 다크 | brand-text on brand | WCAG | 10.33 | 4.5 | 통과 |
| 다크 | brand-text on brand-hover | WCAG | 8.97 | 4.5 | 통과 |
| 다크 | brand-tint-2-text on brand-tint-2 | WCAG | 6.24 | 4.5 | 통과 |
| 다크 | brand-tint-2-text on brand-tint-2-hover | WCAG | 4.92 | 4.5 | 통과 |
| 다크 | brand-graphic-text on brand-graphic | WCAG | 10.33 | 4.5 | 통과 |
| 다크 | ok-fill-text on ok-fill | WCAG | 4.51 | 4.5 | 통과 |
| 다크 | warn-fill-text on warn-fill | WCAG | 4.52 | 4.5 | 통과 |
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
| 다크 | brand-ink on bg | WCAG | 10.83 | 4.5 | 통과 |
| 다크 | brand-ink on bg (APCA) | APCA Lc | 68.55 | 60 | 통과 |
| 다크 | brand-ink on surface | WCAG | 9.80 | 4.5 | 통과 |
| 다크 | brand-ink on surface (APCA) | APCA Lc | 67.68 | 60 | 통과 |
| 다크 | brand-ink on surface-2 | WCAG | 8.28 | 4.5 | 통과 |
| 다크 | brand-ink on surface-2 (APCA) | APCA Lc | 65.60 | 60 | 통과 |
| 다크 | text on brand-tint | WCAG | 12.95 | 4.5 | 통과 |
| 다크 | text-2 on brand-tint | WCAG | 9.53 | 4.5 | 통과 |
| 다크 | brand-ink on brand-tint | WCAG | 7.72 | 4.5 | 통과 |
| 다크 | brand-ink on brand-tint (APCA) | APCA Lc | 64.57 | 60 | 통과 |
| 다크 | ok on bg | WCAG | 10.49 | 4.5 | 통과 |
| 다크 | ok on surface | WCAG | 9.50 | 4.5 | 통과 |
| 다크 | ok on surface-2 | WCAG | 8.02 | 4.5 | 통과 |
| 다크 | ok on ok-tint | WCAG | 7.23 | 4.5 | 통과 |
| 다크 | warn on bg | WCAG | 9.48 | 4.5 | 통과 |
| 다크 | warn on surface | WCAG | 8.59 | 4.5 | 통과 |
| 다크 | warn on surface-2 | WCAG | 7.25 | 4.5 | 통과 |
| 다크 | warn on warn-tint | WCAG | 6.67 | 4.5 | 통과 |
| 다크 | danger on bg | WCAG | 8.12 | 4.5 | 통과 |
| 다크 | danger on surface | WCAG | 7.36 | 4.5 | 통과 |
| 다크 | danger on surface-2 | WCAG | 6.21 | 4.5 | 통과 |
| 다크 | danger on danger-tint | WCAG | 5.88 | 4.5 | 통과 |
| 다크 | brand-graphic on surface | WCAG | 9.80 | 3 | 통과 |
| 다크 | brand-graphic on bg | WCAG | 10.83 | 3 | 통과 |
| 다크 | line on bg | WCAG | 5.73 | 3 | 통과 |
| 다크 | line on surface | WCAG | 5.19 | 3 | 통과 |
| 다크 | line on surface-2 | WCAG | 4.38 | 3 | 통과 |
| 다크 | ring on surface | WCAG | 9.80 | 3 | 통과 |
| 다크 | ring on bg | WCAG | 10.83 | 3 | 통과 |
| 다크 | chart-1 on surface | WCAG | 9.80 | 3 | 통과 |
| 다크 | chart-1 on bg | WCAG | 10.83 | 3 | 통과 |
| 다크 | chart-2 on surface | WCAG | 3.96 | 3 | 통과 |
| 다크 | chart-2 on bg | WCAG | 4.37 | 3 | 통과 |
| 다크 | chart-3 on surface | WCAG | 3.94 | 3 | 통과 |
| 다크 | chart-3 on bg | WCAG | 4.36 | 3 | 통과 |
| 다크 | chart-4 on surface | WCAG | 3.97 | 3 | 통과 |
| 다크 | chart-4 on bg | WCAG | 4.39 | 3 | 통과 |
| 다크 | chart-5 on surface | WCAG | 3.97 | 3 | 통과 |
| 다크 | chart-5 on bg | WCAG | 4.39 | 3 | 통과 |
| 다크 | brand-tint vs surface-2 (dE-OK) | ΔE OK | 0.0439 | 0.0184 | 통과 |
| 다크 | bg vs surface (dE-OK) | ΔE OK | 0.0598 | 0.01 | 통과 |
| 다크 | surface vs surface-2 (dE-OK) | ΔE OK | 0.0640 | 0.01 | 통과 |
| 다크 | surface-2 vs surface-3 (dE-OK) | ΔE OK | 0.1029 | 0.01 | 통과 |
| 다크 | brand vs ok-fill (hue gap) | hue 간격 | 74.95 | 29.5 | 통과 |
| 다크 | brand vs warn-fill (hue gap) | hue 간격 | 20.56 | 29.5 | 경고 |
| 다크 | brand vs danger-fill (hue gap) | hue 간격 | 50.27 | 29.5 | 통과 |
| 다크 | bg chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
| 다크 | surface chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
| 다크 | surface-2 chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
| 다크 | surface-3 chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
| 다크 | text chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
| 다크 | text-2 chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
| 다크 | text-3 chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
| 다크 | line chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
