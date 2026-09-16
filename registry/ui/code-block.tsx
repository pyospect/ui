/**
 * CodeBlock
 * Naming     CodeBlock. a block of code with a copy button.
 * Variant    none. language is a label only.
 * Token      bg surface-2 (level: inset, no glow), radius sm, JetBrains Mono 12/16, padding 16, copy button ghost 32.
 * Structure  header (language label + copy button) + pre. long lines scroll sideways inside the block, never the page.
 * Usage Rule for code the reader will paste. for a single terminal command use CopyCommand instead.
 */
import * as React from "react"
import { Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"

interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  code: string
  language?: string
}

function CodeBlock({ code, language = "tsx", className, ...props }: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false)
  const copy = async () => {
    try { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1200) } catch {}
  }
  return (
    <div data-level="inset" className={cn("overflow-hidden rounded-sm bg-surface-2", className)} {...props}>
      <div className="flex items-center justify-between gap-2 pl-4 pr-1 pt-1">
        <span className="font-mono text-xs leading-4 text-text-3">{language}</span>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "복사했어요" : "코드 복사하기"}
          className={cn(
            "inline-flex h-8 shrink-0 items-center gap-1 rounded-full px-2 text-xs font-medium leading-4 transition-colors duration-[120ms] ease-out",
            copied ? "text-brand-ink" : "text-text-2 hover:bg-surface-3 hover:text-text"
          )}
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          {copied ? "복사했어요" : "복사"}
        </button>
      </div>
      <pre className="overflow-x-auto px-4 pb-4 pt-2 font-mono text-xs leading-4 text-text"><code>{code}</code></pre>
    </div>
  )
}

export { CodeBlock }
