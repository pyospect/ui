/**
 * Chat
 * Naming     Chat, Bubble, ChatTime.
 * Variant    Bubble who: agent | human. from: me | ai is a deprecated alias (me = human, ai = agent).
 * Token      radius lg (20) with the tail corner at sm (8). human = brand-tint-2 + brand-tint-2-text, right. agent = surface-2 + text, left. max width 80%.
 * Structure  Chat is a vertical stack with gap 12. ChatTime is 12px text-3 under a bubble.
 * Usage Rule a brand fill always means the agent processed it, so no bubble uses one: the person gets the brand tint, the agent a plain surface.
 *            on the human bubble every text is brand-tint-2-text (text-2 and text-3 miss 4.5:1 there). no avatars inside bubbles. copy in 해요체.
 */
import * as React from "react"
import { cn } from "@/lib/utils"

function Chat({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("grid gap-3", className)} {...props} />
}

type BubbleProps = React.HTMLAttributes<HTMLDivElement> &
  ({ who: "agent" | "human"; from?: never } | { /** @deprecated use who. me = human, ai = agent */ from: "me" | "ai"; who?: never })

function Bubble({ who, from, className, ...props }: BubbleProps) {
  const human = (who ?? (from === "me" ? "human" : "agent")) === "human"
  return (
    <div
      className={cn(
        "max-w-[80%] rounded-lg px-4 py-3 text-sm leading-5 text-pretty",
        human ? "justify-self-end rounded-br-sm bg-brand-tint-2 text-brand-tint-2-text" : "justify-self-start rounded-bl-sm bg-surface-2 text-text",
        className
      )}
      {...props}
    />
  )
}

function ChatTime({ className, ...props }: React.TimeHTMLAttributes<HTMLTimeElement>) {
  return <time className={cn("text-xs leading-4 text-text-3", className)} {...props} />
}

export { Chat, Bubble, ChatTime }
