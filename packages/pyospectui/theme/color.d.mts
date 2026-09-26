// types for color.mjs. a Color is a hex string or an unrounded [r, g, b] in 0..1
export type Color = string | number[]
export function clamp01(x: number): number
export function hexToRgb(hex: string): number[]
export function rgbToHex(rgb: number[]): string
export function toRgb(c: Color): number[]
export function rgbToOklab(rgb: number[]): number[]
export function oklabToRgb(lab: number[]): number[]
export function oklabToOklch(lab: number[]): number[]
export function oklchToOklab(lch: number[]): number[]
export function hexToOklab(c: Color): number[]
export function hexToOklch(c: Color): number[]
export function oklchToRgb(lch: number[]): number[]
export function inGamut(rgb: number[], eps?: number): boolean
export function maxChroma(L: number, h: number): number
export function oklchToHex(L: number, C: number, h: number): { hex: string; C: number; wanted: number; clamped: number }
export function luminance(c: Color): number
export function contrast(a: Color, b: Color): number
export function apca(text: Color, bg: Color): number
export function deltaEOK(a: Color, b: Color): number
export function mixRgb(a: Color, pct: number, b: Color): number[]
export function mixSrgb(a: Color, pct: number, b: Color): string
export function hueDist(h1: number, h2: number): number
export function hueDelta(h1: number, h2: number): number
export function normHue(h: number): number
