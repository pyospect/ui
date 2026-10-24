# 주황 테마 (orange)

scripts/build-registry.mjs가 만든 파일이에요. 규칙은 https://ui.pyospect.com/TASTE.md 의 §20에 있고, 여기에는 그 규칙이 이 브랜드 색에서 만든 값과 대비 검사 결과가 있어요.

- 시드: `#BC5A29`
- 모드: 흰 글자 (채움 위 글자 `#FFFFFF`)
- 채움: `#BC5A29` (brand-600), 시드 그대로예요
- 상태색 hue: danger 13° (-12° 옮김), warn 76° (+11° 옮김), ok 150°
- 설치: `npx pyospectui --preset orange` 또는 `npx shadcn add https://ui.pyospect.com/r/v0.4.0/theme-orange.json`

## 알려 드릴 점

- danger(위험) 색이 브랜드와 가까워서 hue 25°에서 13°로 옮겼어요(채움 #CD4760).
- warn(주의) 색이 브랜드와 가까워서 hue 65°에서 76°로 옮겼어요(채움 #A06C00).

## 브랜드 스케일

| step | hex |
|---|---|
| brand-50 | `#FFF2ED` |
| brand-100 | `#FFE5DA` |
| brand-200 | `#FFCFBA` |
| brand-300 | `#FFAE8A` |
| brand-400 | `#F98D5C` |
| brand-500 | `#DF723F` |
| brand-600 | `#BC5A29` 채움 |
| brand-700 | `#9D4B24` |
| brand-800 | `#7C3B1B` |
| brand-900 | `#5F2D16` |
| brand-950 | `#3E1B0B` |

## 토큰

| 토큰 | 라이트 | 다크 |
|---|---|---|
| brand | `#BC5A29` | `#BC5A29` |
| brand-text | `#FFFFFF` | `#FFFFFF` |
| brand-hover | `#9D4B24` | `#9D4B24` |
| brand-ink | `#9D4B24` | `#FFAE8A` |
| brand-tint | `#FBEEE8` | `#372821` |
| brand-tint-2 | `#F8E0D5` | `#4D3328` |
| brand-tint-2-hover | `#F5D2C2` | `#643F2E` |
| brand-tint-2-text | `#7C3B1B` | `#FFAE8A` |
| brand-graphic | `#BC5A29` | `#BC5A29` |
| brand-graphic-text | `#FFFFFF` | `#FFFFFF` |
| ok | `#087D39` | `#67D283` |
| warn | `#906100` | `#EEA82F` |
| danger | `#C03A55` | `#FE7E90` |
| ok-fill | `#1E8843` | `#1E8843` |
| warn-fill | `#A06C00` | `#A06C00` |
| danger-fill | `#CD4760` | `#CD4760` |
| ok-fill-text | `#FFFFFF` | `#FFFFFF` |
| warn-fill-text | `#FFFFFF` | `#FFFFFF` |
| danger-fill-text | `#FFFFFF` | `#FFFFFF` |
| ok-tint | `#E9F3EC` | `#223126` |
| warn-tint | `#F4EDE0` | `#352B1A` |
| danger-tint | `#FAEDEF` | `#372528` |
| chart-1 | `#BC5A29` | `#BC5A29` |
| chart-2 | `#717D00` | `#717D00` |
| chart-3 | `#00857F` | `#00857F` |
| chart-4 | `#4575C9` | `#4575C9` |
| chart-5 | `#AB599F` | `#AB599F` |

## 대비 검사

164개 조합 중 164개가 기준을 넘어요. 8비트 값과 반올림 전 값 중 나쁜 쪽으로 쟀어요.

| 테마 | 조합 | 종류 | 값 | 기준 | 결과 |
|---|---|---|---|---|---|
| 라이트 | card-foreground on card | WCAG | 15.13 | 4.5 | 통과 |
| 라이트 | popover-foreground on popover | WCAG | 15.13 | 4.5 | 통과 |
| 라이트 | primary-foreground on primary | WCAG | 4.53 | 4.5 | 통과 |
| 라이트 | secondary-foreground on secondary | WCAG | 13.88 | 4.5 | 통과 |
| 라이트 | muted-foreground on muted | WCAG | 7.17 | 4.5 | 통과 |
| 라이트 | accent-foreground on accent | WCAG | 13.88 | 4.5 | 통과 |
| 라이트 | destructive-foreground on destructive | WCAG | 4.50 | 4.5 | 통과 |
| 라이트 | sidebar-foreground on sidebar | WCAG | 15.13 | 4.5 | 통과 |
| 라이트 | sidebar-primary-foreground on sidebar-primary | WCAG | 4.53 | 4.5 | 통과 |
| 라이트 | sidebar-accent-foreground on sidebar-accent | WCAG | 13.88 | 4.5 | 통과 |
| 라이트 | brand-text on brand | WCAG | 4.53 | 4.5 | 통과 |
| 라이트 | brand-text on brand-hover | WCAG | 6.06 | 4.5 | 통과 |
| 라이트 | brand-tint-2-text on brand-tint-2 | WCAG | 6.65 | 4.5 | 통과 |
| 라이트 | brand-tint-2-text on brand-tint-2-hover | WCAG | 5.95 | 4.5 | 통과 |
| 라이트 | brand-graphic-text on brand-graphic | WCAG | 4.53 | 4.5 | 통과 |
| 라이트 | ok-fill-text on ok-fill | WCAG | 4.51 | 4.5 | 통과 |
| 라이트 | warn-fill-text on warn-fill | WCAG | 4.53 | 4.5 | 통과 |
| 라이트 | danger-fill-text on danger-fill | WCAG | 4.50 | 4.5 | 통과 |
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
| 라이트 | brand-ink on bg | WCAG | 5.81 | 4.5 | 통과 |
| 라이트 | brand-ink on bg (APCA) | APCA Lc | 76.76 | 60 | 통과 |
| 라이트 | brand-ink on surface | WCAG | 6.06 | 4.5 | 통과 |
| 라이트 | brand-ink on surface (APCA) | APCA Lc | 79.76 | 60 | 통과 |
| 라이트 | brand-ink on surface-2 | WCAG | 5.56 | 4.5 | 통과 |
| 라이트 | brand-ink on surface-2 (APCA) | APCA Lc | 73.79 | 60 | 통과 |
| 라이트 | text on brand-tint | WCAG | 13.33 | 4.5 | 통과 |
| 라이트 | text-2 on brand-tint | WCAG | 6.88 | 4.5 | 통과 |
| 라이트 | brand-ink on brand-tint | WCAG | 5.34 | 4.5 | 통과 |
| 라이트 | brand-ink on brand-tint (APCA) | APCA Lc | 71.09 | 60 | 통과 |
| 라이트 | ok on bg | WCAG | 5.03 | 4.6 | 통과 |
| 라이트 | ok on surface | WCAG | 5.25 | 4.6 | 통과 |
| 라이트 | ok on surface-2 | WCAG | 4.81 | 4.6 | 통과 |
| 라이트 | ok on ok-tint | WCAG | 4.62 | 4.6 | 통과 |
| 라이트 | warn on bg | WCAG | 5.16 | 4.6 | 통과 |
| 라이트 | warn on surface | WCAG | 5.39 | 4.6 | 통과 |
| 라이트 | warn on surface-2 | WCAG | 4.94 | 4.6 | 통과 |
| 라이트 | warn on warn-tint | WCAG | 4.63 | 4.6 | 통과 |
| 라이트 | danger on bg | WCAG | 5.06 | 4.6 | 통과 |
| 라이트 | danger on surface | WCAG | 5.28 | 4.6 | 통과 |
| 라이트 | danger on surface-2 | WCAG | 4.84 | 4.6 | 통과 |
| 라이트 | danger on danger-tint | WCAG | 4.62 | 4.6 | 통과 |
| 라이트 | brand-graphic on surface | WCAG | 4.53 | 3 | 통과 |
| 라이트 | brand-graphic on bg | WCAG | 4.34 | 3 | 통과 |
| 라이트 | line on bg | WCAG | 4.35 | 3 | 통과 |
| 라이트 | line on surface | WCAG | 4.54 | 3 | 통과 |
| 라이트 | line on surface-2 | WCAG | 4.17 | 3 | 통과 |
| 라이트 | ring on surface | WCAG | 6.06 | 3 | 통과 |
| 라이트 | ring on bg | WCAG | 5.81 | 3 | 통과 |
| 라이트 | chart-1 on surface | WCAG | 4.53 | 3 | 통과 |
| 라이트 | chart-1 on bg | WCAG | 4.34 | 3 | 통과 |
| 라이트 | chart-2 on surface | WCAG | 4.53 | 3 | 통과 |
| 라이트 | chart-2 on bg | WCAG | 4.34 | 3 | 통과 |
| 라이트 | chart-3 on surface | WCAG | 4.51 | 3 | 통과 |
| 라이트 | chart-3 on bg | WCAG | 4.32 | 3 | 통과 |
| 라이트 | chart-4 on surface | WCAG | 4.52 | 3 | 통과 |
| 라이트 | chart-4 on bg | WCAG | 4.34 | 3 | 통과 |
| 라이트 | chart-5 on surface | WCAG | 4.51 | 3 | 통과 |
| 라이트 | chart-5 on bg | WCAG | 4.32 | 3 | 통과 |
| 라이트 | brand-tint vs surface-2 (dE-OK) | ΔE OK | 0.0204 | 0.0184 | 통과 |
| 라이트 | bg vs surface (dE-OK) | ΔE OK | 0.0149 | 0.01 | 통과 |
| 라이트 | surface vs surface-2 (dE-OK) | ΔE OK | 0.0298 | 0.01 | 통과 |
| 라이트 | surface-2 vs surface-3 (dE-OK) | ΔE OK | 0.0482 | 0.01 | 통과 |
| 라이트 | brand vs ok-fill (hue gap) | hue 간격 | 105.35 | 29.5 | 통과 |
| 라이트 | brand vs warn-fill (hue gap) | hue 간격 | 31.02 | 29.5 | 통과 |
| 라이트 | brand vs danger-fill (hue gap) | hue 간격 | 31.72 | 29.5 | 통과 |
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
| 다크 | primary-foreground on primary | WCAG | 4.53 | 4.5 | 통과 |
| 다크 | secondary-foreground on secondary | WCAG | 13.88 | 4.5 | 통과 |
| 다크 | muted-foreground on muted | WCAG | 10.21 | 4.5 | 통과 |
| 다크 | accent-foreground on accent | WCAG | 13.88 | 4.5 | 통과 |
| 다크 | destructive-foreground on destructive | WCAG | 4.50 | 4.5 | 통과 |
| 다크 | sidebar-foreground on sidebar | WCAG | 16.44 | 4.5 | 통과 |
| 다크 | sidebar-primary-foreground on sidebar-primary | WCAG | 4.53 | 4.5 | 통과 |
| 다크 | sidebar-accent-foreground on sidebar-accent | WCAG | 13.88 | 4.5 | 통과 |
| 다크 | brand-text on brand | WCAG | 4.53 | 4.5 | 통과 |
| 다크 | brand-text on brand-hover | WCAG | 6.06 | 4.5 | 통과 |
| 다크 | brand-tint-2-text on brand-tint-2 | WCAG | 6.39 | 4.5 | 통과 |
| 다크 | brand-tint-2-text on brand-tint-2-hover | WCAG | 5.09 | 4.5 | 통과 |
| 다크 | brand-graphic-text on brand-graphic | WCAG | 4.53 | 4.5 | 통과 |
| 다크 | ok-fill-text on ok-fill | WCAG | 4.51 | 4.5 | 통과 |
| 다크 | warn-fill-text on warn-fill | WCAG | 4.53 | 4.5 | 통과 |
| 다크 | danger-fill-text on danger-fill | WCAG | 4.50 | 4.5 | 통과 |
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
| 다크 | brand-ink on bg | WCAG | 11.01 | 4.5 | 통과 |
| 다크 | brand-ink on bg (APCA) | APCA Lc | 69.29 | 60 | 통과 |
| 다크 | brand-ink on surface | WCAG | 9.97 | 4.5 | 통과 |
| 다크 | brand-ink on surface (APCA) | APCA Lc | 68.42 | 60 | 통과 |
| 다크 | brand-ink on surface-2 | WCAG | 8.41 | 4.5 | 통과 |
| 다크 | brand-ink on surface-2 (APCA) | APCA Lc | 66.34 | 60 | 통과 |
| 다크 | text on brand-tint | WCAG | 12.95 | 4.5 | 통과 |
| 다크 | text-2 on brand-tint | WCAG | 9.52 | 4.5 | 통과 |
| 다크 | brand-ink on brand-tint | WCAG | 7.85 | 4.5 | 통과 |
| 다크 | brand-ink on brand-tint (APCA) | APCA Lc | 65.31 | 60 | 통과 |
| 다크 | ok on bg | WCAG | 10.49 | 4.5 | 통과 |
| 다크 | ok on surface | WCAG | 9.50 | 4.5 | 통과 |
| 다크 | ok on surface-2 | WCAG | 8.02 | 4.5 | 통과 |
| 다크 | ok on ok-tint | WCAG | 7.23 | 4.5 | 통과 |
| 다크 | warn on bg | WCAG | 9.69 | 4.5 | 통과 |
| 다크 | warn on surface | WCAG | 8.77 | 4.5 | 통과 |
| 다크 | warn on surface-2 | WCAG | 7.41 | 4.5 | 통과 |
| 다크 | warn on warn-tint | WCAG | 6.77 | 4.5 | 통과 |
| 다크 | danger on bg | WCAG | 8.11 | 4.5 | 통과 |
| 다크 | danger on surface | WCAG | 7.34 | 4.5 | 통과 |
| 다크 | danger on surface-2 | WCAG | 6.20 | 4.5 | 통과 |
| 다크 | danger on danger-tint | WCAG | 5.87 | 4.5 | 통과 |
| 다크 | brand-graphic on surface | WCAG | 3.96 | 3 | 통과 |
| 다크 | brand-graphic on bg | WCAG | 4.37 | 3 | 통과 |
| 다크 | line on bg | WCAG | 5.73 | 3 | 통과 |
| 다크 | line on surface | WCAG | 5.19 | 3 | 통과 |
| 다크 | line on surface-2 | WCAG | 4.38 | 3 | 통과 |
| 다크 | ring on surface | WCAG | 9.97 | 3 | 통과 |
| 다크 | ring on bg | WCAG | 11.01 | 3 | 통과 |
| 다크 | chart-1 on surface | WCAG | 3.96 | 3 | 통과 |
| 다크 | chart-1 on bg | WCAG | 4.37 | 3 | 통과 |
| 다크 | chart-2 on surface | WCAG | 3.96 | 3 | 통과 |
| 다크 | chart-2 on bg | WCAG | 4.37 | 3 | 통과 |
| 다크 | chart-3 on surface | WCAG | 3.98 | 3 | 통과 |
| 다크 | chart-3 on bg | WCAG | 4.39 | 3 | 통과 |
| 다크 | chart-4 on surface | WCAG | 3.96 | 3 | 통과 |
| 다크 | chart-4 on bg | WCAG | 4.38 | 3 | 통과 |
| 다크 | chart-5 on surface | WCAG | 3.98 | 3 | 통과 |
| 다크 | chart-5 on bg | WCAG | 4.39 | 3 | 통과 |
| 다크 | brand-tint vs surface-2 (dE-OK) | ΔE OK | 0.0339 | 0.0184 | 통과 |
| 다크 | bg vs surface (dE-OK) | ΔE OK | 0.0598 | 0.01 | 통과 |
| 다크 | surface vs surface-2 (dE-OK) | ΔE OK | 0.0640 | 0.01 | 통과 |
| 다크 | surface-2 vs surface-3 (dE-OK) | ΔE OK | 0.1029 | 0.01 | 통과 |
| 다크 | brand vs ok-fill (hue gap) | hue 간격 | 105.35 | 29.5 | 통과 |
| 다크 | brand vs warn-fill (hue gap) | hue 간격 | 31.02 | 29.5 | 통과 |
| 다크 | brand vs danger-fill (hue gap) | hue 간격 | 31.72 | 29.5 | 통과 |
| 다크 | bg chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
| 다크 | surface chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
| 다크 | surface-2 chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
| 다크 | surface-3 chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
| 다크 | text chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
| 다크 | text-2 chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
| 다크 | text-3 chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
| 다크 | line chroma | 채도 | 0.0000 | ≤ 0.008 | 통과 |
