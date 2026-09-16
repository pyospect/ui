/**
 * Thinking
 * Naming     Thinking. the agent's collapsible reasoning block.
 * Variant    live: true | false. open: controlled by the user.
 * Token      bg surface-2 (level: inset, no glow), radius sm, dot 8 accent, steps text-2 14px.
 * Structure  Summary (dot + title + chevron) + list of steps. lives inside a surface. never nests another surface.
 * Usage Rule while live the dot pulses and the title is present tense (생각하는 중이에요). when done the title is past tense
 *            (25초 동안 생각했어요) and the dot stops. never bold or color the steps.
 */
import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface ThinkingProps extends React.HTMLAttributes<HTMLDetailsElement> {
  title: string
  live?: boolean
  steps: string[]
}

function Thinking({ title, live, steps, className, ...props }: ThinkingProps) {
  return (
    <details data-level="inset" className={cn("group overflow-hidden rounded-sm bg-surface-2", className)} {...props}>
      <summary className="flex cursor-pointer list-none items-center gap-2 p-3 text-sm font-medium leading-5 text-text [&::-webkit-details-marker]:hidden">
        <span className={cn("size-2 shrink-0 rounded-full bg-accent", live && "animate-pulse")} aria-hidden />
        <span className="one-line flex-1">{title}</span>
        <ChevronDown className="size-4 shrink-0 text-text-3 transition-transform duration-[120ms] group-open:rotate-180" />
      </summary>
      <ol className="grid gap-2 px-3 pb-3">
        {steps.map((s, i) => (
          <li key={i} className="flex gap-2 text-sm leading-5 text-text-2 text-pretty">
            <span className="mt-2 size-1 shrink-0 rounded-full bg-text-3" aria-hidden />
            {s}
          </li>
        ))}
      </ol>
    </details>
  )
}

export { Thinking }
