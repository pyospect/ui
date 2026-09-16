/**
 * Input
 * Naming     Input. Field wraps it with Label and Help.
 * Variant    state: default | hover | focus | error | disabled.
 * Token      bg surface, line 1px (meaningful boundary, 3:1), focus brand-ink 2px, radius sm, height 40.
 * Structure  Field > Label + Input + Help. label always above. placeholder holds an example only.
 * Usage Rule error text replaces the help line and explains what to do. pair with aria-invalid and aria-describedby.
 */
import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-10 w-full rounded-sm bg-surface px-3 text-sm leading-5 text-text placeholder:text-text-3",
        "shadow-[inset_0_0_0_1px_var(--line)] transition-[background-color,box-shadow] duration-[120ms] ease-out",
        "hover:bg-surface-2 focus:bg-surface focus:outline-0 focus:shadow-[inset_0_0_0_2px_var(--brand-ink)]",
        "aria-invalid:shadow-[inset_0_0_0_1px_var(--danger)] disabled:opacity-40",
        className
      )}
      {...props}
    />
  )
)
Input.displayName = "Input"

function Field({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("grid gap-2", className)} {...props} />
}

function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("one-line text-sm font-medium leading-5 text-text", className)} {...props} />
}

function Help({ className, error, ...props }: React.HTMLAttributes<HTMLParagraphElement> & { error?: boolean }) {
  return <p className={cn("text-xs leading-4", error ? "text-danger" : "text-text-3", className)} {...props} />
}

export { Input, Field, Label, Help }
