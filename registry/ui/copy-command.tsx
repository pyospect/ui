/**
 * CopyCommand
 * Naming     CopyCommand. a terminal command with a copy button.
 * Variant    size: md | lg.
 * Token      bg surface-2 (level: inset, no glow), radius sm, JetBrains Mono 12/14, copy button ghost 32.
 * Structure  prompt sign (text-3) + command (one line, scrolls sideways if long) + icon button. lives on a surface or on bg.
 * Usage Rule the button turns into a check and says 복사했어요 for 1.2초, then returns. never auto-select the text; copying is the button's job.
 */
import * as React from "react"
import { Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"

interface CopyCommandProps extends React.HTMLAttributes<HTMLDivElement> {
  command: string
  size?: "md" | "lg"
}

function CopyCommand({ command, size = "md", className, ...props }: CopyCommandProps) {
  const [copied, setCopied] = React.useState(false)
  const copy = async () => {
    try { await navigator.clipboard.writeText(command); setCopied(true); setTimeout(() => setCopied(false), 1200) } catch {}
  }
  return (
    <div
      data-level="inset"
      className={cn(
        "flex items-center gap-2 rounded-sm bg-surface-2 py-1 pl-4 pr-1",
        size === "lg" ? "font-mono text-sm leading-5" : "font-mono text-xs leading-4",
        className
      )}
      {...props}
    >
      <span className="select-none text-text-3" aria-hidden>$</span>
      <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap py-2 text-left text-text">{command}</code>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "복사했어요" : "명령어 복사하기"}
        className={cn(
          "inline-flex h-8 shrink-0 items-center gap-1 rounded-full px-2 font-sans text-xs font-medium leading-4 transition-colors duration-[120ms] ease-out",
          copied ? "text-brand-ink" : "text-text-2 hover:bg-surface-3 hover:text-text"
        )}
      >
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        <span className={cn(copied ? "inline" : "hidden sm:inline")}>{copied ? "복사했어요" : "복사"}</span>
      </button>
    </div>
  )
}

export { CopyCommand }
