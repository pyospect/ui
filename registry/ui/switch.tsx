/**
 * Switch
 * Naming     Switch.
 * Variant    checked: true | false. disabled.
 * Token      track 28 x 48, handle 20, padding 4 (track r = handle r + padding, both full). off track surface-3 + line, on track brand.
 * Structure  Control row: Label + Switch, never wraps; the label truncates first.
 * Usage Rule only for settings that apply immediately. a form with a save button uses a checkbox.
 */
import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    className={cn(
      "relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full p-1 transition-[background-color,box-shadow] duration-[120ms] ease-out",
      "bg-surface-3 shadow-[inset_0_0_0_1px_var(--line)] data-[state=checked]:bg-brand data-[state=checked]:shadow-none disabled:opacity-40",
      className
    )}
    {...props}
  >
    <SwitchPrimitive.Thumb className="block size-5 rounded-full bg-line transition-[transform,background-color] duration-[120ms] ease-out data-[state=checked]:translate-x-5 data-[state=checked]:bg-brand-text" />
  </SwitchPrimitive.Root>
))
Switch.displayName = "Switch"

function Control({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-nowrap items-center justify-between gap-3 [&>label]:min-w-0 [&>label]:flex-1", className)} {...props} />
}

export { Switch, Control }
