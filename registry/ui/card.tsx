/**
 * Card
 * Naming     Card, Card/Media, Card/Selected.
 * Variant    media: none | top. selected: true | false.
 * Token      bg surface, radius md, padding pyo-card-padding (24), gap pyo-card-gap (20); body copy 14px / 1.85 / -0.015em (media card padding 4), media radius max(0, outer - 4), 20 at the default, no glow. no shadow.
 * Structure  level: surface. sits on bg only. never inside another Card or Panel. inner groups use surface-2 with no glow.
 * Usage Rule selected is the only state with a line (brand-ink 1px + tint). titles wrap so a decision never depends on hidden text.
 */
import * as React from "react"
import { cn } from "@/lib/utils"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  selected?: boolean
  media?: boolean
}

function Card({ className, selected, media, ...props }: CardProps) {
  return (
    <div
      data-level="surface"
      className={cn(
        "grid min-w-0 content-start gap-[var(--pyo-card-gap)] overflow-hidden rounded-md bg-surface glow",
        media ? "p-1" : "p-[var(--pyo-card-padding)]",
        selected && "bg-brand-tint outline outline-1 -outline-offset-1 outline-brand-ink",
        className
      )}
      {...props}
    />
  )
}

function CardMedia({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("aspect-video rounded-[max(0px,calc(var(--radius)_-_4px))] bg-surface-3", className)} {...props} />
}

function CardBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("grid gap-[var(--pyo-card-gap)] p-[var(--pyo-card-padding)]", className)} {...props} />
}

function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-base font-medium leading-6 text-text text-pretty", className)} {...props} />
}

function CardText({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("brand-copy text-text-2 text-pretty", className)} {...props} />
}

export { Card, CardMedia, CardBody, CardTitle, CardText }
