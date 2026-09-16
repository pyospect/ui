/**
 * List
 * Naming     List, ListItem.
 * Variant    selected: true | false.
 * Token      list bg surface (level: surface, glow), radius md, padding 4. item radius sm, padding 12, hover surface-2, selected brand-tint + brand-ink.
 * Structure  ListItem is a button so the keyboard reaches it: primary text (truncates) + trailing meta (never shrinks).
 *            List sits on bg, never inside a Card or Panel.
 * Usage Rule hover and selected are shown by the row background only. no divider lines between rows.
 */
import * as React from "react"
import { cn } from "@/lib/utils"

function List({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div role="listbox" data-level="surface" className={cn("grid rounded-md bg-surface p-1 glow", className)} {...props} />
}

interface ListItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean
  meta?: React.ReactNode
}

const ListItem = React.forwardRef<HTMLButtonElement, ListItemProps>(({ className, selected, meta, children, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    role="option"
    aria-selected={!!selected}
    className={cn(
      "flex w-full cursor-pointer items-center justify-between gap-3 rounded-sm p-3 text-left text-sm font-medium leading-5 text-text transition-colors duration-[120ms] ease-out hover:bg-surface-2",
      selected && "bg-brand-tint text-brand-ink hover:bg-brand-tint",
      className
    )}
    {...props}
  >
    <span className="one-line flex-1">{children}</span>
    {meta != null && <span className={cn("shrink-0 whitespace-nowrap text-sm font-normal tabular", selected ? "text-brand-ink" : "text-text-3")}>{meta}</span>}
  </button>
))
ListItem.displayName = "ListItem"

export { List, ListItem }
