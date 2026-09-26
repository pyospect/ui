// the site-wide brand. one choice re-themes every page: ?brand= in the hash wins, then localStorage, then pyospect green.
// green is src/index.css itself; any other brand is one <style id="pyo-theme"> over :root and .dark (no reload).
// favicon, OG image and theme-color stay green.
import { useSyncExternalStore } from "react"
import { resolveBrand, varDecl, DEFAULT_BRAND, type Theme } from "@/lib/theme"
import { readHash, setHashQuery } from "@/lib/router"

type State = { key: string; theme: Theme; invalid: { raw: string; message: string } | null }

const STORE = "pyo-brand"
const listeners = new Set<() => void>()
const initial = resolveBrand(DEFAULT_BRAND)
if (!initial.ok) throw new Error("the pyospect preset is missing")
let state: State = { key: initial.key, theme: initial.theme, invalid: null }

const load = () => { try { return localStorage.getItem(STORE) } catch { return null } }
const save = (key: string | null) => { try { if (key) localStorage.setItem(STORE, key); else localStorage.removeItem(STORE) } catch {} }
// URL form: the preset name, or the hex without "#" (#/themes?brand=3366ff)
const urlValue = (key: string) => (key === DEFAULT_BRAND ? null : key.replace(/^#/, "").toLowerCase())

// :root:root (0,2,0) and :root:root .dark (0,3,0) outrank src/index.css (:root, .dark) wherever the bundler puts
// that stylesheet. the second selector covers a nested .dark (a dark preview in a light page); index.css repeats
// the var() mappings in .dark so they resolve against these values there too
function inject(theme: Theme | null) {
  let el = document.getElementById("pyo-theme")
  if (!theme) { el?.remove(); return }
  if (!el) { el = document.createElement("style"); el.id = "pyo-theme"; document.head.appendChild(el) }
  el.textContent = `:root:root { ${varDecl(theme.gen.light)} }\n:root:root.dark, :root:root .dark { ${varDecl(theme.gen.dark)} }`
}

// a color picker fires on every move: storage and URL are written once it settles
let timer = 0
function persist() {
  window.clearTimeout(timer)
  timer = window.setTimeout(() => { save(urlValue(state.key) && state.key); setHashQuery("brand", urlValue(state.key)) }, 240)
}

const emit = () => listeners.forEach((l) => l())

/** raw: a preset name or a hex. an invalid value keeps the current theme and is reported in `invalid` */
export function setBrand(raw: string) {
  const r = resolveBrand(raw)
  if (!r.ok) { state = { ...state, invalid: { raw, message: r.message } }; emit(); return r }
  if (r.key !== state.key) inject(r.key === DEFAULT_BRAND ? null : r.theme)
  state = { key: r.key, theme: r.theme, invalid: null }
  persist()
  emit()
  return r
}

export const resetBrand = () => setBrand(DEFAULT_BRAND)

export function useBrand() {
  return useSyncExternalStore(
    (l) => { listeners.add(l); return () => { listeners.delete(l) } },
    () => state,
  )
}

// a brand from the URL. an invalid one keeps the current theme, is reported once, and the URL goes back to the brand shown
function fromUrl(v: string) {
  if (!setBrand(v).ok) setHashQuery("brand", urlValue(state.key))
}

// first paint: the link's brand, then this viewer's last one. a stale stored value is dropped quietly
{
  const url = readHash().query.get("brand")
  const stored = load()
  if (url) fromUrl(url)
  else if (stored && !setBrand(stored).ok) { state = { ...state, invalid: null }; save(null) }
}

// navigation drops the query: put the brand back (and drop an old error), or follow a link (or Back) that names another one
window.addEventListener("hashchange", () => {
  const v = readHash().query.get("brand")
  if (v) { if (v !== urlValue(state.key)) fromUrl(v) }
  else {
    if (state.invalid) { state = { ...state, invalid: null }; emit() }
    setHashQuery("brand", urlValue(state.key))
  }
})
