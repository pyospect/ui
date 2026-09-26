import { useEffect, useState } from "react"

// hash routing keeps the site static-host friendly: #/ and #/docs/<name>.
// a query after "?" rides along (#/themes?brand=blue) and is not part of the path
export function readHash() {
  const h = window.location.hash.replace(/^#/, "")
  const i = h.indexOf("?")
  return { path: (i < 0 ? h : h.slice(0, i)) || "/", query: new URLSearchParams(i < 0 ? "" : h.slice(i + 1)) }
}

export function useRoute() {
  const [path, setPath] = useState(() => readHash().path)
  useEffect(() => {
    let last = readHash().path
    // a query-only change (the brand switcher) keeps the scroll position
    const on = () => { const p = readHash().path; if (p !== last) { last = p; setPath(p); window.scrollTo({ top: 0 }) } }
    window.addEventListener("hashchange", on)
    return () => window.removeEventListener("hashchange", on)
  }, [])
  return path
}

// replaces one query key in place: no history entry, no hashchange. null removes it
export function setHashQuery(key: string, value: string | null) {
  const { path, query } = readHash()
  if (value == null) query.delete(key)
  else query.set(key, value)
  const q = query.toString()
  const next = `#${path}${q ? `?${q}` : ""}`
  if (next === window.location.hash || (next === "#/" && !window.location.hash)) return
  try { history.replaceState(history.state, "", next) } catch {} // Safari throttles replaceState
}

export const href = (path: string) => `#${path}`
