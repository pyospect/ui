/**
 * Table
 * Naming     Table, TableHead, TableBody, TableRow, TableHeader, TableCell.
 * Variant    TableCell num: true (right aligned, tabular). TableHeader num: true.
 * Token      wrap bg surface (level: surface, glow), radius md, header surface-2 12px text-3, cell padding 12/16, row hover surface-2. no lines between rows.
 * Structure  TableWrap > table. wide tables scroll inside the wrap, never the page. status uses Tag, hints use TableHint (icon + text-3).
 * Usage Rule numbers right aligned with tabular digits and units (14,100원). dates ISO. cells are one line and truncate.
 */
import * as React from "react"
import { cn } from "@/lib/utils"

function TableWrap({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-level="surface" className={cn("overflow-x-auto rounded-md bg-surface glow", className)} {...props} />
}
function Table({ className, ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
  return <table className={cn("w-full border-collapse text-sm leading-5", className)} {...props} />
}
function TableHead(props: React.HTMLAttributes<HTMLTableSectionElement>) { return <thead {...props} /> }
function TableBody(props: React.HTMLAttributes<HTMLTableSectionElement>) { return <tbody {...props} /> }
function TableRow({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={cn("[&>td]:transition-colors [&>td]:duration-[120ms] hover:[&>td]:bg-surface-2", className)} {...props} />
}
function TableHeader({ className, num, ...props }: React.ThHTMLAttributes<HTMLTableCellElement> & { num?: boolean }) {
  return (
    <th
      className={cn(
        "whitespace-nowrap bg-surface-2 px-4 py-3 text-xs font-medium leading-4 text-text-3 first:rounded-tl-md last:rounded-tr-md",
        num ? "text-right" : "text-left",
        className
      )}
      {...props}
    />
  )
}
function TableCell({ className, num, ...props }: React.TdHTMLAttributes<HTMLTableCellElement> & { num?: boolean }) {
  return <td className={cn("one-line max-w-60 px-4 py-3 text-text", num && "text-right tabular", className)} {...props} />
}
function TableHint({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("inline-flex items-center gap-1 text-xs leading-4 text-text-3 [&_svg]:size-4", className)} {...props} />
}

export { TableWrap, Table, TableHead, TableBody, TableRow, TableHeader, TableCell, TableHint }
