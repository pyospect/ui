/**
 * Card
 * Naming     Card, Card/Media, Card/Selected.
 * Variant    media: none | top. selected: true | false.
 * Token      bg surface, radius md, padding 20 (media card padding 4, inner media radius = 12 - 4 = 8), glow 1px in dark only. no shadow.
 * Structure  level: surface. sits on bg only. never inside another Card or Panel. inner groups use surface-2 with no glow.
 * Usage Rule selected is the only state with a line (brand-ink 1px + tint). titles are one line.
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
        "grid min-w-0 content-start gap-3 overflow-hidden rounded-md bg-surface glow",
        media ? "p-1" : "p-5",
        selected && "bg-brand-tint outline outline-1 -outline-offset-1 outline-brand-ink",
        className
      )}
      {...props}
    />
  )
}

function CardMedia({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("aspect-video rounded-[calc(var(--radius-md)-4px)] bg-surface-3", className)} {...props} />
}

function CardBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("grid gap-2 p-4", className)} {...props} />
}

function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("one-line text-base font-semibold leading-6 text-text", className)} {...props} />
}

function CardText({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm leading-5 text-text-2 text-pretty", className)} {...props} />
}

export { Card, CardMedia, CardBody, CardTitle, CardText }
