/**
 * DecisionCard
 * Naming     DecisionCard. what the agent made, and the ways forward.
 * Variant    none.
 * Token      bg accent-tint (a tinted ground), radius sm, padding 12/16. icon accent-ink. buttons: tint (review) + primary (proceed).
 * Structure  Icon + Title (one line, truncates) + two Buttons. no neutral gray fills on this tinted ground.
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
    <div className={cn("flex items-center gap-3 rounded-sm bg-accent-tint py-3 pl-4 pr-3", className)} {...props}>
      <FileText className="size-5 shrink-0 text-accent-ink" />
      <b className="one-line flex-1 text-sm font-medium leading-5 text-text">{title}</b>
      <Button hierarchy="tint" size="sm" onClick={onReview}>{reviewLabel}</Button>
      <Button size="sm" onClick={onProceed}>{proceedLabel}</Button>
    </div>
  )
}

export { DecisionCard }
