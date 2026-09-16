/**
 * ValidationCard
 * Naming     ValidationCard. one check the agent ran.
 * Variant    status: ok | warn | danger.
 * Token      bg surface-2 (level: inset, no glow), radius sm, padding 16. status shown by Tag only.
 * Structure  Title (one line) + Reason (one line, truncates) + Tag on the right. stack several in a grid with gap 8.
 * Usage Rule the reason says what was found, in 해요체, one sentence. labels: 통과, 확인 필요, 실패.
 */
import * as React from "react"
import { Tag } from "@/components/ui/tag"
import { cn } from "@/lib/utils"

const labels = { ok: "통과", warn: "확인 필요", danger: "실패" } as const

interface ValidationCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  reason: string
  status: keyof typeof labels
}

function ValidationCard({ title, reason, status, className, ...props }: ValidationCardProps) {
  return (
    <div
      data-level="inset"
      className={cn("grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 rounded-sm bg-surface-2 p-4", className)}
      {...props}
    >
      <b className="one-line text-sm font-medium leading-5 text-text">{title}</b>
      <Tag tone={status} className="col-start-2 row-span-2 row-start-1">{labels[status]}</Tag>
      <span className="one-line col-start-1 text-xs leading-4 text-text-2">{reason}</span>
    </div>
  )
}

export { ValidationCard }
