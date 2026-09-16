/**
 * Chat
 * Naming     Chat, Bubble, ChatTime.
 * Variant    Bubble from: me | ai.
 * Token      radius lg (20) with the tail corner at sm (8). me = brand fill + brand-text, right. ai = surface-2 + text, left. max width 80%.
 * Structure  Chat is a vertical stack with gap 12. ChatTime is 12px text-3 under a bubble.
 * Usage Rule the person sits on the brand side, the agent on a plain surface. no avatars inside bubbles. copy in 해요체.
 */
import * as React from "react"
import { cn } from "@/lib/utils"

function Chat({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("grid gap-3", className)} {...props} />
}

function Bubble({ from, className, ...props }: React.HTMLAttributes<HTMLDivElement> & { from: "me" | "ai" }) {
  return (
    <div
      className={cn(
        "max-w-[80%] rounded-lg px-4 py-3 text-sm leading-5 text-pretty",
        from === "me" ? "justify-self-end rounded-br-sm bg-brand text-brand-text" : "justify-self-start rounded-bl-sm bg-surface-2 text-text",
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
