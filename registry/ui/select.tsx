/**
 * Select
 * Naming     Select, SelectTrigger, SelectValue, SelectContent and SelectItem.
 * Variant    controlled or uncontrolled value, disabled items, optional groups and labels.
 * Token      popover and popover-foreground, accent and accent-foreground, border and ring; font-sans Medium, trigger radius md.
 * Structure  Root > Trigger + Content; Content portals a padded viewport, scrolling controls and inset rounded items.
 * Usage Rule give the trigger a label; use container for a scoped theme. Radix manages focus, arrows, typeahead and Escape.
 */
"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root
const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    data-pyospect-component="select"
    className={cn(
      "relative inline-flex h-11 w-full min-w-0 items-center rounded-md border border-border bg-popover py-2 pl-3 pr-10 text-left font-sans text-sm font-medium leading-6 text-popover-foreground",
      "outline-none transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-40 data-[placeholder]:text-muted-foreground",
      className
    )}
    {...props}
  >
    <span className="min-w-0 truncate">{children}</span>
    <SelectPrimitive.Icon asChild>
      <ChevronDown aria-hidden className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = "SelectTrigger"

type SelectContentProps = React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> & {
  /** Portal into a scoped theme root instead of document.body. */
  container?: HTMLElement | null
}

const SelectContent = React.forwardRef<React.ElementRef<typeof SelectPrimitive.Content>, SelectContentProps>(
  ({ className, children, container, position = "popper", sideOffset = 8, collisionPadding = 12, ...props }, ref) => (
    <SelectPrimitive.Portal container={container}>
      <SelectPrimitive.Content
        ref={ref}
        position={position}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        className={cn(
          "relative z-50 max-h-[min(320px,var(--radix-select-content-available-height))] min-w-[var(--radix-select-trigger-width)] max-w-[calc(100vw-24px)] overflow-hidden rounded-md bg-popover inset-ring-1 inset-ring-border font-sans text-sm font-medium leading-6 text-popover-foreground",
          className
        )}
        {...props}
      >
        <SelectPrimitive.ScrollUpButton className="flex h-8 cursor-default items-center justify-center bg-popover text-popover-foreground">
          <ChevronUp className="size-4" aria-hidden />
        </SelectPrimitive.ScrollUpButton>
        <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
        <SelectPrimitive.ScrollDownButton className="flex h-8 cursor-default items-center justify-center bg-popover text-popover-foreground">
          <ChevronDown className="size-4" aria-hidden />
        </SelectPrimitive.ScrollDownButton>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
)
SelectContent.displayName = "SelectContent"

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex min-h-10 w-full cursor-default select-none items-center rounded-[max(0px,calc(var(--radius)_-_4px))] py-2 pl-3 pr-10 font-sans text-sm font-medium leading-6 break-words outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
      className
    )}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    <SelectPrimitive.ItemIndicator className="absolute right-3 flex size-4 items-center justify-center">
      <Check className="size-4" aria-hidden />
    </SelectPrimitive.ItemIndicator>
  </SelectPrimitive.Item>
))
SelectItem.displayName = "SelectItem"

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => <SelectPrimitive.Label ref={ref} className={cn("px-3 py-2 font-sans text-xs font-medium leading-4 text-muted-foreground", className)} {...props} />)
SelectLabel.displayName = "SelectLabel"

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => <SelectPrimitive.Separator ref={ref} className={cn("my-1 h-px bg-border", className)} {...props} />)
SelectSeparator.displayName = "SelectSeparator"

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup, SelectLabel, SelectSeparator }
export type { SelectContentProps }
