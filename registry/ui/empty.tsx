/**
 * Empty
 * Naming     Empty.
 * Variant    none.
 * Token      bg surface (level: surface, glow), radius md, padding 24, left aligned.
 * Structure  Title (one line) + Text (one line) + one Button. nothing else, no illustration.
 * Usage Rule the title says what is missing in 해요체 (아직 일감이 없어요), the text says what will fill it, the button does that.
 */
import * as React from "react"
import { cn } from "@/lib/utils"

interface EmptyProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  text: string
  action?: React.ReactNode
}

function Empty({ title, text, action, className, ...props }: EmptyProps) {
  return (
    <div data-level="surface" className={cn("grid justify-items-start gap-3 rounded-md bg-surface p-6 glow", className)} {...props}>
      <h3 className="one-line max-w-full text-base font-semibold leading-6 text-text">{title}</h3>
      <p className="text-sm leading-5 text-text-2 text-pretty">{text}</p>
      {action}
    </div>
  )
}

export { Empty }
