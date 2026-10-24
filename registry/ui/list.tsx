/**
 * List
 * Naming     List, ListItem.
 * Variant    selected: true | false.
 * Token      list bg surface (level: surface, glow), radius md, padding 4. item radius max(0, outer - 4), padding 12, hover surface-2, selected brand-tint + brand-ink.
 * Structure  List is a role=group (name it with aria-label). ListItem is a button so Tab reaches it; aria-pressed carries selected.
 *            primary text (truncates) + trailing meta (at most 45% of the row, truncates). List sits on bg, never inside a Card or Panel.
 * Usage Rule hover and selected are shown by the row background only. no divider lines between rows.
 */
import * as React from "react"
import { cn } from "@/lib/utils"

function List({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div role="group" data-level="surface" className={cn("grid rounded-md bg-surface p-1 glow", className)} {...props} />
}

interface ListItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean
  meta?: React.ReactNode
}

const ListItem = React.forwardRef<HTMLButtonElement, ListItemProps>(({ className, selected, meta, children, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    aria-pressed={!!selected}
    className={cn(
      "flex w-full cursor-pointer items-center justify-between gap-3 rounded-[max(0px,calc(var(--radius)_-_4px))] p-3 text-left text-sm font-medium leading-5 text-text transition-colors hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-40",
      selected && "bg-brand-tint text-brand-ink hover:bg-brand-tint",
      className
    )}
    {...props}
  >
    <span className="one-line flex-1">{children}</span>
    {meta != null && <span className={cn("one-line max-w-[45%] shrink-0 text-sm font-medium tabular", selected ? "text-brand-ink" : "text-text-3")}>{meta}</span>}
  </button>
))
ListItem.displayName = "ListItem"

export { List, ListItem }
