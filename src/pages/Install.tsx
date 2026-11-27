import { CopyCommand } from "@/components/ui/copy-command"
import { href } from "@/lib/router"
import { PRESETS, REGISTRY_BASE } from "@/lib/theme"
import { PageFrame } from "@/pages/PageFrame"
import concentric from "@/site/concentric.module.css"

const INSTALL: [string, string, string][] = [
  ["1. 새 프로젝트", "shadcn이 Vite와 Tailwind까지 만들어 줘요.", "npx shadcn@~4.21 init -t vite -b radix -p nova -y --no-monorepo -n my-app"],
  ["2. 전부 받기", "테마와 컴포넌트, 배경 실험실을 함께 받아요. 첫 설치에는 --overwrite를 붙여요.", "cd my-app && npx pyospectui --overwrite"],
  ["3. 실행", "화면을 만들면 돼요.", "npm run dev"],
]
const POSITIONING = "pyospectui는 한국어 제품을 만드는 팀을 위한 디자인 시스템이에요. neutral 테마로 시작하고, 필요하면 브랜드 색 하나에서 나머지 색을 만들고 검사해요."
export function Install() {
  return (
    <PageFrame title="시작하기" sub="Node.js만 있으면 돼요. 새 프로젝트를 만들고, 전부 받고, 화면을 만들면 끝이에요.">
      <div className="grid gap-6">
        <p className="site-copy brand-body text-text text-pretty">{POSITIONING}</p>
        {INSTALL.map(([title, text, cmd]) => (
          <div key={cmd} data-level="surface" className={concentric.insetEnd + " grid gap-5 rounded-md bg-surface p-[var(--pyo-card-padding)] glow"}>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h2 className="text-sm font-medium leading-[1.5] text-text [overflow-wrap:anywhere]">{title}</h2>
              <p className="site-copy brand-copy text-text-2">{text}</p>
            </div>
            <CopyCommand command={cmd} />
          </div>
        ))}
        <div data-level="surface" className="grid gap-5 rounded-md bg-surface p-[var(--pyo-card-padding)] glow">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h2 className="text-sm font-medium leading-[1.5] text-text [overflow-wrap:anywhere]">내 브랜드 색으로</h2>
            <p className="site-copy brand-copy text-text-2">2번 대신 써요. 규칙이 나머지 색을 만들고 대비를 검사한 뒤에 설치해요.</p>
          </div>
          <CopyCommand command={'cd my-app && npx pyospectui --brand "#3366FF" --overwrite'} />
          <p className="site-copy brand-copy text-text-2 text-pretty">미리 만든 프리셋 {PRESETS.length}개와 미리보기는 <a href={href("/themes")} className="site-link font-medium underline underline-offset-4">테마 페이지</a>에 있어요. 이미 설치한 프로젝트에서 이 명령을 쓰면 색 변수만 바뀌어요.</p>
        </div>
        <p className="site-copy brand-copy text-text-2 text-pretty">몇 개만 고르려면 <code className="font-mono text-xs">npx pyospectui button card</code>처럼 이름을 붙여요. shadcn 명령을 그대로 쓰고 싶으면 레지스트리 주소는 <code className="font-mono text-xs">{REGISTRY_BASE}pyospect.json</code>이에요.</p>
      </div>
    </PageFrame>
  )
}
