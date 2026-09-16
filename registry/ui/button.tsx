/**
 * Button
 * Naming     Button/Primary, Button/Secondary, Button/Ghost, Button/Tint. hierarchy is in the name.
 * Variant    hierarchy: primary | secondary | ghost | tint. size: sm | md | lg. state: default | hover | disabled. icon: none | leading | trailing.
 * Token      bg brand, text brand-text, radius full, height 40, padding-x 20, motion 120ms.
 * Structure  one label and at most one icon. no tags, no second line. overflow truncates with an ellipsis.
 * Usage Rule one primary per screen. labels are verbs that say what happens: 저장하기, 보내기, 작성하기.
 *            secondary for reversible side actions, ghost for quiet ones, tint instead of secondary on an brand-tint ground.
 *            there is no outline button.
 */
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 max-w-full items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap overflow-hidden text-ellipsis transition-[background-color,color,opacity] duration-[120ms] ease-out disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      hierarchy: {
        primary: "bg-brand text-brand-text hover:bg-brand-hover",
        secondary: "bg-surface-2 text-text hover:bg-surface-3",
        ghost: "bg-transparent text-text-2 hover:bg-surface-2 hover:text-text",
        tint: "bg-brand-tint-2 text-brand-ink hover:bg-[color-mix(in_srgb,var(--brand)_32%,var(--surface))]",
      },
      size: {
        sm: "h-8 px-4 text-xs leading-4 [&_svg]:size-4",
        md: "h-10 px-5 text-sm leading-5",
        lg: "h-12 px-6 text-base leading-6",
      },
    },
    defaultVariants: { hierarchy: "primary", size: "md" },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, hierarchy, size, type = "button", ...props }, ref) => (
    <button ref={ref} type={type} className={cn(buttonVariants({ hierarchy, size }), className)} {...props} />
  )
)
Button.displayName = "Button"

export { Button, buttonVariants }
