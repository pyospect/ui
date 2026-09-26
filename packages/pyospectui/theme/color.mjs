// Dependency-free color math: sRGB <-> OKLab/OKLCH (Ottosson), WCAG 2.x contrast,
// APCA Lc (SAPC-APCA 0.0.98G-4g constants), deltaE-OK, CSS color-mix(in srgb).
// A "color" is a hex string or an unrounded [r, g, b] array in 0..1.

export const clamp01 = (x) => Math.min(1, Math.max(0, x))

export function hexToRgb(hex) {
  let h = hex.replace("#", "").trim()
  if (h.length === 3) h = h.split("").map((c) => c + c).join("")
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
}
export function rgbToHex(rgb) {
  return "#" + rgb.map((v) => Math.round(clamp01(v) * 255).toString(16).padStart(2, "0")).join("").toUpperCase()
}
export const toRgb = (c) => (typeof c === "string" ? hexToRgb(c) : c)

const toLin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
const toGam = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.sign(c) * Math.abs(c) ** (1 / 2.4) - 0.055)

export function rgbToOklab(rgb) {
  const [r, g, b] = rgb.map(toLin)
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ]
}
export function oklabToRgb([L, a, b]) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map(toGam)
}
export function oklabToOklch([L, a, b]) {
  const C = Math.hypot(a, b)
  let h = (Math.atan2(b, a) * 180) / Math.PI
  if (h < 0) h += 360
  return [L, C, C < 1e-4 ? 0 : h]
}
export function oklchToOklab([L, C, h]) {
  const r = (h * Math.PI) / 180
  return [L, C * Math.cos(r), C * Math.sin(r)]
}
export const hexToOklab = (c) => rgbToOklab(toRgb(c))
export const hexToOklch = (c) => oklabToOklch(hexToOklab(c))
export const oklchToRgb = (lch) => oklabToRgb(oklchToOklab(lch))

export const inGamut = (rgb, eps = 1e-7) => rgb.every((v) => v >= -eps && v <= 1 + eps)

// largest chroma at (L, h) that stays inside sRGB
export function maxChroma(L, h) {
  if (L <= 0 || L >= 1) return 0
  let lo = 0, hi = 0.5
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2
    if (inGamut(oklchToRgb([L, mid, h]))) lo = mid
    else hi = mid
  }
  return lo
}

// oklch -> hex, clamping chroma into gamut (hue and lightness preserved)
export function oklchToHex(L, C, h) {
  const cmax = maxChroma(L, h)
  const c = Math.min(C, cmax)
  return { hex: rgbToHex(oklchToRgb([L, c, h])), C: c, wanted: C, clamped: Math.max(0, C - cmax) }
}

// WCAG 2.x
export function luminance(c) {
  const [r, g, b] = toRgb(c).map(toLin)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
export function contrast(a, b) {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p)
  return (x + 0.05) / (y + 0.05)
}

// APCA Lc (text on bg). positive = dark text on light bg, negative = light on dark
export function apca(text, bg) {
  const Y = (c) => {
    const [r, g, b] = toRgb(c).map(clamp01)
    let y = 0.2126729 * r ** 2.4 + 0.7151522 * g ** 2.4 + 0.072175 * b ** 2.4
    if (y < 0.022) y += (0.022 - y) ** 1.414
    return y
  }
  const yt = Y(text), yb = Y(bg)
  if (Math.abs(yb - yt) < 0.0005) return 0
  let out
  if (yb > yt) {
    const s = (yb ** 0.56 - yt ** 0.57) * 1.14
    out = s < 0.1 ? 0 : s - 0.027
  } else {
    const s = (yb ** 0.65 - yt ** 0.62) * 1.14
    out = s > -0.1 ? 0 : s + 0.027
  }
  return out * 100
}

// deltaE in OKLab (Euclidean). JND is roughly 0.02
export function deltaEOK(a, b) {
  const p = hexToOklab(a), q = hexToOklab(b)
  return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2])
}

// CSS color-mix(in srgb, A pct%, B): linear interpolation of gamma-encoded sRGB.
// mixRgb keeps full precision; mixSrgb rounds to the 8-bit hex a stylesheet would carry
export function mixRgb(a, pct, b) {
  const x = toRgb(a), y = toRgb(b), t = pct / 100
  return x.map((v, i) => v * t + y[i] * (1 - t))
}
export const mixSrgb = (a, pct, b) => rgbToHex(mixRgb(a, pct, b))

export function hueDist(h1, h2) {
  const d = Math.abs(h1 - h2) % 360
  return d > 180 ? 360 - d : d
}
// signed shortest rotation from h1 to h2
export function hueDelta(h1, h2) {
  let d = (h2 - h1) % 360
  if (d > 180) d -= 360
  if (d < -180) d += 360
  return d
}
export const normHue = (h) => ((h % 360) + 360) % 360
