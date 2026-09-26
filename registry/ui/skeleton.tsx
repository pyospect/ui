/**
 * Skeleton
 * Naming     Skeleton, SkeletonText.
 * Variant    none. width is set per bar.
 * Token      bg skeleton (surface-3 tone), height 12, radius full, gap 8. no animation.
 * Structure  gray bars only. no illustration, no spinner.
 * Usage Rule show while loading. SkeletonText is a role=status with a screen reader line in 해요체 (불러오는 중이에요).
 *            set aria-busy on the region that is loading.
 */
import * as React from "react"
import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("h-3 rounded-full bg-skeleton", className)} {...props} />
}

function SkeletonText({ lines = 4, className, ...props }: React.HTMLAttributes<HTMLDivElement> & { lines?: number }) {
  const widths = ["40%", "90%", "75%", "60%", "85%", "50%"]
  return (
    <div role="status" className={cn("grid gap-2", className)} {...props}>
      <span className="sr-only">불러오는 중이에요</span>
      {Array.from({ length: lines }, (_, i) => <Skeleton key={i} aria-hidden style={{ width: widths[i % widths.length] }} />)}
    </div>
  )
}

export { Skeleton, SkeletonText }
