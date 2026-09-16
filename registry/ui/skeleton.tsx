/**
 * Skeleton
 * Naming     Skeleton, SkeletonText.
 * Variant    none. width is set per bar.
 * Token      bg skeleton (surface-3 tone), height 12, radius full, gap 8. no animation.
 * Structure  gray bars only. no illustration, no spinner.
 * Usage Rule show while loading. pair with aria-busy and a label in 해요체 (불러오는 중이에요).
 */
import * as React from "react"
import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("h-3 rounded-full bg-skeleton", className)} {...props} />
}

function SkeletonText({ lines = 4, className, ...props }: React.HTMLAttributes<HTMLDivElement> & { lines?: number }) {
  const widths = ["40%", "90%", "75%", "60%", "85%", "50%"]
  return (
    <div aria-busy="true" aria-label="불러오는 중이에요" className={cn("grid gap-2", className)} {...props}>
      {Array.from({ length: lines }, (_, i) => <Skeleton key={i} style={{ width: widths[i % widths.length] }} />)}
    </div>
  )
}

export { Skeleton, SkeletonText }
