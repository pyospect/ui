import { useEffect, useState } from "react"

// hash routing keeps the site static-host friendly: #/ and #/docs/<name>
export function useRoute() {
  const read = () => (window.location.hash.replace(/^#/, "") || "/")
  const [path, setPath] = useState(read)
  useEffect(() => {
    const on = () => { setPath(read()); window.scrollTo({ top: 0 }) }
    window.addEventListener("hashchange", on)
    return () => window.removeEventListener("hashchange", on)
  }, [])
  return path
}

export const href = (path: string) => `#${path}`
