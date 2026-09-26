// types for contract.mjs
export type CssVars = Record<string, string>
export interface ContractResult {
  mode: "light" | "dark"
  kind: "contrast" | "apca" | "dE" | "deg" | "chroma"
  severity: "fail" | "warn"
  why: string
  pair: string
  fg: string
  bg?: string
  fgHex: string
  bgHex?: string
  ratio: number
  min: number
  pass: boolean
}
export const LIMITS: Record<string, number>
export function parseCssVars(css: string): { theme: CssVars; light: CssVars; dark: CssVars }
export function envFromCss(css: string): { light: CssVars; dark: CssVars }
export function parseColor(str: string): [number, number, number] | null
export function resolver(env: CssVars): ((name: string) => { hex: string; rgb: number[] } | null) & { expr(e: string): { hex: string; rgb: number[] } | null }
export function checkContract(env: { light: CssVars; dark: CssVars }, opts?: { only?: Set<string> }): {
  n: number
  results: ContractResult[]
  fails: ContractResult[]
  warnings: ContractResult[]
  edges: ContractResult[]
}
export function formatResult(r: ContractResult): string
