import type { ReactNode } from "react"

export function PageFrame({ title, sub, children }: { title: string; sub: string; children: ReactNode }) {
  return (
    <main className="mx-auto grid w-full max-w-[1160px] content-start gap-8 px-6 pb-16 pt-8 sm:px-12 sm:pt-12">
      <header className="grid gap-3">
        <h1 className="site-heading brand-heading">{title}</h1>
        <p className="site-copy brand-body max-w-[42rem] text-text-2 text-pretty">{sub}</p>
      </header>
      {children}
    </main>
  )
}
