import { CopyCommand } from "@/components/ui/copy-command"
import { href } from "@/lib/router"

const HERO = [
  ["저는 생각한 것을 직접 만드는 사람이에요. ", "화면으로, ", "문장으로, ", "코드로요. ", "조용한 밤에 화면 하나를 붙잡고 여백과 문장의 온도를 다듬을 때 가장 몰입하고, ", "그렇게 만든 것이 누군가의 손에 닿아 반응으로 돌아올 때 의미를 느껴요."],
  ["이 시스템은 그 습관을 AI에게 건네주려고 만들었어요. ", "사람이 결정할 일과 시스템이 처리할 일을 나누고, ", "쓰는 사람이 덜 불안하게 다음 행동을 고를 수 있도록 다듬는 것. ", "기술이 삶에 닿는 마지막 한 뼘을, ", "누구나 설치 한 줄로 시작할 수 있으면 좋겠어요."],
]

export function Home() {
  return (
    <main className="mx-auto grid max-w-[1160px] gap-6 px-4 pb-14 sm:px-6">
      <header className="grid justify-items-center gap-7 section-space px-6 text-center sm:px-12">
        <h1 className="site-heading brand-heading font-medium">pyospectui</h1>
        <div className="site-copy brand-body grid max-w-[640px] gap-7 text-text-2">
          {HERO.map((para, i) => (
            <p key={i}>
              {para.map((seg, j) => (
                <span key={j}>
                  <span className="inline-block">{seg.trim()}</span>{" "}
                </span>
              ))}
            </p>
          ))}
        </div>
        <p className="site-copy text-xs leading-4 text-text-3">고경표, Product Designer</p>
        <CopyCommand command="npx pyospectui" size="lg" className="mt-2 w-full max-w-[400px]" />
        <div className="site-copy flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
          <a className="site-link underline underline-offset-4" href={href("/components")}>컴포넌트 살펴보기</a>
          <a className="site-link underline underline-offset-4" href={href("/ai")}>AI 협업 패턴 보기</a>
        </div>
      </header>

    </main>
  )
}
