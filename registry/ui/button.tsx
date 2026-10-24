/**
 * Button
 * Naming     Button/Primary, Button/Secondary, Button/Ghost, Button/Tint. hierarchy is in the name.
 * Variant    hierarchy: primary | secondary | ghost | tint. size: sm | md | lg. state: default | hover | disabled. icons go in as children, leading or trailing.
 * Token      primary brand + brand-text (hover brand-hover). secondary surface-2 + text (hover surface-3). ghost text-2 (hover surface-2 + text).
 *            tint brand-tint-2 + brand-tint-2-text (hover brand-tint-2-hover). radius full, height 32 / 40 / 48, padding-x 16 / 20 / 24, motion 120ms.
 * Structure  one label and at most one icon. no tags, no second line. overflow truncates with an ellipsis.
 * Usage Rule one primary per screen. labels are verbs that say what happens: 저장하기, 보내기, 작성하기.
 *            secondary for reversible side actions, ghost for quiet ones, tint instead of secondary on a brand-tint ground.
 *            on tint the only text color is brand-tint-2-text (icons included); text-2 and text-3 miss 4.5:1 there.
 *            there is no outline button.
 */
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 max-w-full items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap overflow-hidden text-ellipsis transition-[background-color,color,opacity] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      hierarchy: {
        primary: "bg-brand text-brand-text hover:bg-brand-hover",
        secondary: "bg-surface-2 text-text hover:bg-surface-3",
        ghost: "bg-transparent text-text-2 hover:bg-surface-2 hover:text-text",
        tint: "bg-brand-tint-2 text-brand-tint-2-text hover:bg-brand-tint-2-hover",
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

// Keep icons fixed while a long label truncates. Adjacent text nodes stay one label,
// including interpolated numbers; fragments do not add extra gaps between words.
function buttonContent(children: React.ReactNode) {
  const out: React.ReactNode[] = []
  let label = ""
  const flush = () => {
    if (!label) return
    out.push(<span key={`label-${out.length}`} className="one-line">{label}</span>)
    label = ""
  }
  const visit = (nodes: React.ReactNode) => React.Children.forEach(nodes, (child) => {
    if (typeof child === "string" || typeof child === "number") label += child
    else if (React.isValidElement<{ children?: React.ReactNode }>(child) && child.type === React.Fragment) visit(child.props.children)
    else if (child != null && typeof child !== "boolean") {
      flush()
      out.push(<React.Fragment key={`node-${out.length}`}>{child}</React.Fragment>)
    }
  })
  visit(children)
  flush()
  return out.length ? out : undefined
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, hierarchy, size, type = "button", children, ...props }, ref) => (
    <button ref={ref} type={type} className={cn(buttonVariants({ hierarchy, size }), className)} {...props}>{buttonContent(children)}</button>
  )
)
Button.displayName = "Button"

export { Button, buttonVariants }
