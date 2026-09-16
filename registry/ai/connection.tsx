/**
 * Connection
 * Naming     ConnectionList, Connection.
 * Variant    connected: true | false.
 * Token      row padding-y 8, 14px. dot 8 full: ok when connected, surface-3 + line ring when not. name text medium, status text-2.
 * Structure  dot + name + status text + optional trailing action (ghost button). rows never wrap; status truncates first.
 * Usage Rule status copy in 해요체: 연결됐어요 / 아직 연결 전이에요. the action only appears when not connected.
 */
import * as React from "react"
import { cn } from "@/lib/utils"

function ConnectionList({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("grid gap-1", className)} {...props} />
}

interface ConnectionProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  connected: boolean
  action?: React.ReactNode
}

function Connection({ name, connected, action, className, ...props }: ConnectionProps) {
  return (
    <div className={cn("flex flex-nowrap items-center gap-2 py-2 text-sm leading-5 text-text-2", className)} {...props}>
      <span className={cn("size-2 shrink-0 rounded-full", connected ? "bg-ok" : "bg-surface-3 shadow-[inset_0_0_0_1px_var(--line)]")} aria-hidden />
      <b className="shrink-0 font-medium text-text">{name}</b>
      <span className="one-line flex-1">{connected ? "연결됐어요" : "아직 연결 전이에요"}</span>
      {!connected && action}
    </div>
  )
}

export { ConnectionList, Connection }
