/**
 * DecisionCard
 * Naming     DecisionCard. what the agent made, and the ways forward.
 * Variant    none.
 * Token      bg brand-tint (a tinted ground), radius sm, padding 12/16. icon brand-ink. buttons: tint (review) + primary (proceed).
 * Structure  Icon + Title (one line, truncates) + two Buttons. below 640 the buttons drop to a second row so the title keeps its words.
 *            no neutral gray fills on this tinted ground.
 * Usage Rule use where the next step branches. the person has to press to move on; the agent never auto-advances here.
 */
import * as React from "react"
import { FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DecisionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  reviewLabel?: string
  proceedLabel: string
  onReview?: () => void
  onProceed?: () => void
}

function DecisionCard({ title, reviewLabel = "검토하기", proceedLabel, onReview, onProceed, className, ...props }: DecisionCardProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3 rounded-sm bg-brand-tint py-3 pl-4 pr-3 sm:flex-nowrap", className)} {...props}>
      <FileText className="size-5 shrink-0 text-brand-ink" />
      <b className="one-line min-w-0 flex-1 basis-full text-sm font-medium leading-5 text-text sm:basis-auto">{title}</b>
      <Button hierarchy="tint" size="sm" onClick={onReview}>{reviewLabel}</Button>
      <Button size="sm" onClick={onProceed}>{proceedLabel}</Button>
    </div>
  )
}

export { DecisionCard }
