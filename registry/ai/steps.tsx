/**
 * Steps
 * Naming     Steps, Step/Agent, Step/Human, Step/Done.
 * Variant    who: agent | human. done: true | false.
 * Token      circle 40 full. agent = accent fill + accent-text. human = surface + 2px dashed accent-ink. done = accent-tint + accent-ink. line surface-3 2px.
 * Structure  a horizontal row of Step (circle + title + text). always render the Legend with it.
 * Usage Rule filled circle = the agent handles it, dashed circle = a person decides. the shapes must differ; never rely on color alone.
 */
import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepProps extends React.HTMLAttributes<HTMLDivElement> {
  index: number
  who: "agent" | "human"
  done?: boolean
  title: string
  text: string
}

function Step({ index, who, done, title, text, className, ...props }: StepProps) {
  return (
    <div className={cn("relative grid justify-items-start gap-2", className)} {...props}>
      <span
        className={cn(
          "grid size-10 place-items-center rounded-full text-sm font-semibold leading-5",
          done ? "bg-accent-tint text-accent-ink"
            : who === "agent" ? "bg-accent text-accent-text"
            : "bg-surface text-text outline-2 outline-dashed -outline-offset-2 outline-accent-ink"
        )}
        aria-label={`${index}단계, ${who === "agent" ? "에이전트가 처리해요" : "사람이 결정해요"}${done ? ", 완료" : ""}`}
      >
        {done ? <Check className="size-4" /> : index}
      </span>
      <h4 className="one-line mt-1 max-w-full text-sm font-semibold leading-5 text-text">{title}</h4>
      <p className="text-xs leading-4 text-text-2 text-pretty">{text}</p>
    </div>
  )
}

function Steps({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("relative grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4", className)} {...props}>
      <span className="absolute left-5 right-5 top-5 h-0.5 -translate-y-px bg-surface-3" aria-hidden />
      {children}
    </div>
  )
}

function StepsLegend({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-wrap gap-4 text-xs leading-4 text-text-2", className)} {...props}>
      <span className="inline-flex items-center gap-2"><i className="size-3 rounded-full bg-accent" />에이전트가 처리하는 지점</span>
      <span className="inline-flex items-center gap-2"><i className="size-3 rounded-full outline-2 outline-dashed -outline-offset-2 outline-accent-ink" />사람이 결정하는 지점</span>
    </div>
  )
}

export { Steps, Step, StepsLegend }
