/**
 * Diff
 * Naming     Diff, DiffLine.
 * Variant    line kind: add | del | context.
 * Token      bg surface-2 (level: inset, no glow), radius sm, JetBrains Mono 12px, add ok-tint + ok text, del danger-tint + danger text.
 * Structure  header (path, truncates + counts) + lines. lives inside a surface.
 * Usage Rule additions and deletions are told apart by tinted backgrounds only, plus a sign at the line start. lines are one line and truncate.
 */
import * as React from "react"
import { cn } from "@/lib/utils"

interface DiffProps extends React.HTMLAttributes<HTMLDivElement> {
  path: string
  added?: number
  removed?: number
}

function Diff({ path, added = 0, removed = 0, className, children, ...props }: DiffProps) {
  return (
    <div data-level="inset" className={cn("overflow-hidden rounded-sm bg-surface-2 text-sm leading-5", className)} {...props}>
      <div className="flex items-center justify-between gap-3 px-3 py-2">
        <span className="one-line font-mono text-xs font-medium text-text">{path}</span>
        <span className="shrink-0 font-mono text-xs tabular text-text-3">
          <span className="font-medium text-ok">+{added}</span> <span className="text-danger">-{removed}</span>
        </span>
      </div>
      {children}
    </div>
  )
}

function DiffLine({ kind = "context", className, children, ...props }: React.HTMLAttributes<HTMLDivElement> & { kind?: "add" | "del" | "context" }) {
  const sign = kind === "add" ? "+" : kind === "del" ? "-" : " "
  return (
    <div
      className={cn(
        "one-line flex gap-3 px-3 py-1 font-mono text-xs leading-4 text-text-2",
        kind === "add" && "bg-ok-tint text-ok",
        kind === "del" && "bg-danger-tint text-danger",
        className
      )}
      {...props}
    >
      <span className="w-3 shrink-0 font-medium">{sign}</span>
      {children}
    </div>
  )
}

export { Diff, DiffLine }
