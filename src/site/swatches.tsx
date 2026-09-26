// preset swatches: one 24px dot per file in presets/, 44px touch target, a 2px text ring on the current one
import { cn } from "@/lib/utils"
import { PRESETS } from "@/lib/theme"
import { setBrand, useBrand } from "@/lib/brand"

export function Swatches({ className, onPick }: { className?: string; onPick?: () => void }) {
  const { key } = useBrand()
  return (
    <div role="group" aria-label="프리셋" className={cn("flex flex-wrap", className)}>
      {PRESETS.map((p) => (
        <button
          key={p.name}
          type="button"
          title={p.label}
          aria-label={`${p.label} 테마로 바꾸기`}
          aria-pressed={key === p.name}
          onClick={() => { setBrand(p.name); onPick?.() }}
          className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full transition-colors hover:bg-surface-2"
        >
          <span className={cn("grid size-8 place-items-center rounded-full", key === p.name && "shadow-[inset_0_0_0_2px_var(--text)]")}>
            <span className="size-6 rounded-full" style={{ backgroundColor: p.brand }} />
          </span>
        </button>
      ))}
    </div>
  )
}
