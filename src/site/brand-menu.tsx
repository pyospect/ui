// the nav's brand switcher: a non-modal popover with the preset swatches. picking one re-themes the whole site.
// popover: bg surface, radius md, overlay shadow in light, glow in dark (TASTE 5, 7)
import { useEffect, useId, useRef, useState } from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Swatches } from "@/site/swatches"
import { useBrand, resetBrand } from "@/lib/brand"
import { DEFAULT_BRAND } from "@/lib/theme"

export function BrandMenu() {
  const { key, theme } = useBrand()
  const [open, setOpen] = useState(false)
  const id = useId()
  const trigger = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    // focus the current swatch, or the first one when the brand is a custom hex
    const current = panel.current?.querySelector<HTMLElement>('[aria-pressed="true"]') ?? panel.current?.querySelector<HTMLElement>("button")
    current?.focus()
    const inside = (t: EventTarget | null) => t instanceof Node && (panel.current?.contains(t) || trigger.current?.contains(t))
    const down = (e: PointerEvent) => { if (!inside(e.target)) setOpen(false) }
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); trigger.current?.focus() } }
    const nav = () => setOpen(false)
    document.addEventListener("pointerdown", down)
    document.addEventListener("keydown", key)
    window.addEventListener("hashchange", nav)
    return () => { document.removeEventListener("pointerdown", down); document.removeEventListener("keydown", key); window.removeEventListener("hashchange", nav) }
  }, [open])

  const name = theme.preset?.label ?? "직접 고른 색"
  return (
    <>
      <button
        ref={trigger}
        type="button"
        aria-label={`브랜드 색 바꾸기, 지금은 ${name}`}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 shrink-0 cursor-pointer items-center gap-1 rounded-full px-3 text-text-2 transition-colors hover:bg-surface-2 hover:text-text"
      >
        <span className="size-4 rounded-full bg-brand-graphic" aria-hidden />
        <ChevronDown className="hidden size-4 sm:block" aria-hidden />
      </button>
      {open && (
        <div
          ref={panel}
          id={id}
          role="dialog"
          aria-label="브랜드 색"
          onBlur={(e) => { if (e.relatedTarget && !panel.current?.contains(e.relatedTarget) && e.relatedTarget !== trigger.current) setOpen(false) }}
          className="absolute right-4 top-full z-50 mt-1 grid w-[296px] max-w-[calc(100vw-32px)] gap-3 rounded-md bg-surface p-4 shadow-overlay glow sm:right-6"
        >
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="one-line text-sm font-semibold leading-5 text-text">{name}</h2>
            <span className="shrink-0 font-mono text-xs leading-4 text-text-3">{theme.seed}</span>
          </div>
          <Swatches className="grid grid-cols-6" />
          <p className="text-xs leading-4 text-text-2 text-pretty">고르면 사이트 전체가 그 색으로 바뀌어요. 이 브라우저에 기억해 둘게요.</p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" hierarchy="secondary" onClick={resetBrand} disabled={key === DEFAULT_BRAND}>기본으로 되돌리기</Button>
            <Button size="sm" hierarchy="ghost" onClick={() => { setOpen(false); location.hash = "/themes" }}>직접 고르기</Button>
          </div>
        </div>
      )}
    </>
  )
}
