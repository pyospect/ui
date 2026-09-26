// types for item.mjs
import type { Generated, ThemeItem, CssVars } from "./generate.mjs"
import type { ContractResult, checkContract } from "./contract.mjs"
export const SITE: string
export function modeLabel(mode: Generated["mode"]): string
export interface ThemeBase { cssVars: { theme: CssVars; light: CssVars; dark: CssVars }; css: Record<string, unknown>; docs: string }
export function themeItem(seed: string, base: ThemeBase, opts?: { name?: string; label?: string; slug?: string }): { item: ThemeItem; gen: Generated }
export function itemEnv(item: ThemeItem): { light: CssVars; dark: CssVars }
export function contractOf(item: ThemeItem): ReturnType<typeof checkContract>
export function resolveItem(item: ThemeItem, keys: string[]): { token: string; light: string | null; dark: string | null }[]
export const SUMMARY_PAIRS: string[]
export function summaryRows(report: { results: ContractResult[] }): { pair: string; light?: number; dark?: number; min: number; pass: boolean }[]
