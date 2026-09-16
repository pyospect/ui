/**
 * Versions
 * Naming     Versions, Version.
 * Variant    current: true | false.
 * Token      item radius sm, padding 12, 14px. current = brand-tint bg + brand-ink text. others have no fill.
 * Structure  Version = label + meta (right, 12px text-3) + one-line note. stack in a grid with gap 4.
 * Usage Rule only the current version has a fill. meta is a relative time (어제) or a state word (최신).
 */
import * as React from "react"
import { cn } from "@/lib/utils"

function Versions({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("grid gap-1", className)} {...props} />
}

interface VersionProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  meta?: string
  note: string
  current?: boolean
}

function Version({ label, meta, note, current, className, ...props }: VersionProps) {
  return (
    <div className={cn("grid gap-1 rounded-sm p-3 text-sm leading-5 text-text-2", current && "bg-brand-tint text-brand-ink", className)} {...props}>
      <b className={cn("flex justify-between gap-2 font-medium text-text", current && "text-brand-ink")}>
        <span className="one-line">{label}</span>
        {meta && <span className={cn("shrink-0 text-xs font-normal leading-4", current ? "text-brand-ink" : "text-text-3")}>{meta}</span>}
      </b>
      <span className="one-line">{note}</span>
    </div>
  )
}

export { Versions, Version }
