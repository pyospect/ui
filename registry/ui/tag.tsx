/**
 * Tag
 * Naming     Tag, Tag/Status.
 * Variant    tone: neutral | brand | ok | warn | danger.
 * Token      height 24, padding-x 8, radius full, 12px medium. colored tones are solid fills with white text (AA in both themes).
 * Structure  text only, one line, truncates. not interactive.
 * Usage Rule status is shown only as a Tag. tints are for surfaces, never for pills.
 */
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const tagVariants = cva("inline-flex h-6 max-w-full items-center gap-1 rounded-full px-2 text-xs font-medium leading-4 one-line", {
  variants: {
    tone: {
      neutral: "bg-surface-2 text-text-2",
      brand: "bg-brand text-brand-text",
      ok: "bg-ok-fill text-white",
      warn: "bg-warn-fill text-white",
      danger: "bg-danger-fill text-white",
    },
  },
  defaultVariants: { tone: "neutral" },
})

function Tag({ className, tone, ...props }: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof tagVariants>) {
  return <span className={cn(tagVariants({ tone }), className)} {...props} />
}

export { Tag, tagVariants }
