// types for generate.mjs (the site imports it from TSX)
export type CssVars = Record<string, string>
export type Step = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950
export interface StatusResult { fill: string; dark: string; text: string; h: number; moved: number; dist: number; gapOk: boolean }
export interface ReportRow { pair: string; ratio: number; min: number; pass: boolean }
export interface Generated {
  seed: string
  /** text on the brand fill: "white" (#FFFFFF) or "dark" (dark-text mode, #111111). not the dark theme */
  mode: "white" | "dark"
  scale: Record<Step, string>
  light: CssVars
  dark: CssVars
  warnings: string[]
  report: ReportRow[]
  fill: string
  fillStep: Step
  k: number
  hue: number
  tintPct: { light: number; dark: number }
  status: Record<"ok" | "warn" | "danger", StatusResult>
}
export interface ThemeItem {
  $schema: string
  name: string
  type: "registry:theme"
  cssVars: { theme: CssVars; light: CssVars; dark: CssVars }
  [key: string]: unknown
}
export class SeedError extends Error {}
export const STEPS: Step[]
export const NEUTRAL: { light: CssVars; dark: CssVars }
export const RULES: Record<string, unknown> & { minC: number; aa: number; gap: number }
export function generate(seed: string, opts?: { report?: boolean }): Generated
export function selfReport(gen: Generated): ReportRow[]
export function themeEnv(gen: Generated, base: { light: CssVars; dark: CssVars }): { light: CssVars; dark: CssVars }
export function toThemeItem(gen: Generated, base: { theme?: CssVars; light?: CssVars; dark?: CssVars } | { cssVars: { theme?: CssVars; light?: CssVars; dark?: CssVars }; css?: unknown }, meta?: Record<string, unknown>): ThemeItem
export function resolveTheme(gen: Generated, base?: { light: CssVars; dark: CssVars }): { light: Record<string, string | null>; dark: Record<string, string | null> }
export function lightestPassing(C: number, h: number, text?: string, min?: number): { L: number; hex: string; C: number } | null
