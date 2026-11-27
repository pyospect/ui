import { href } from "@/lib/router"
import { PageFrame } from "@/pages/PageFrame"

const RULES: [string, string][] = [
  ["Grid", "간격은 4px 단위를 기준으로 해요. 본문 행간과 대화의 15px 글자와 18px 간격은 읽는 흐름에 맞춘 예외예요."],
  ["Type", "이 웹사이트는 한글과 영문 모두 Pretendard를 써요. 제목은 Medium 500, 줄간격 120%, 자간 0이에요. 본문은 Regular 400이에요. 패키지에 들어 있는 기존 테마의 설정은 DESIGN.md에서 확인할 수 있어요."],
  ["Text", "긴 제목과 설명은 줄을 바꿔 읽을 수 있어요. 버튼과 제한된 메타데이터만 말줄임표를 쓰고, 라벨과 컨트롤은 함께 보여요."],
  ["Writing", "친절하게 풀어쓴 해요체예요. 명사로 끝내지 않고 영어 직역을 쓰지 않아요. 버튼은 동사예요."],
  ["Color", "무채색 면 4단계에 브랜드 색 하나, 상태색 셋이에요. 브랜드 색 하나에서 규칙이 나머지를 만들고 대비를 검사해요. 색 있는 pill은 단색 fill에 그 fill의 글자색이에요."],
  ["Surface", "영역은 톤 차이로 나눠요. 일반 테두리는 없거나 10% 투명도예요. 키보드 focus와 오류, 상태 표시는 선명하게 보여요."],
  ["Depth", "bg 위에 surface, 2단계까지예요. 카드 속 카드는 없어요."],
  ["Radius", "카드와 입력창은 24px로 통일해요. 버튼은 둥근 pill, 대화 말풍선은 22px예요."],
  ["Motion", "120ms ease-out 하나예요. 색과 투명도만 움직이고, 동작 줄이기 설정이면 멈춰요."],
  ["A11y", "본문과 상태색 대비를 검사해요. 키보드로 컨트롤에 닿고 focus는 brand-ink 2px 선이에요."],
  ["AI", "모든 컴포넌트에 Naming, Variant, Token, Structure, Usage Rule 다섯 줄이 있어요. 에이전트가 처리한 것과 사람이 결정할 것은 항상 모양이 다르고, brand 채움은 에이전트 쪽이에요."],
]

export function Rules() {
  return (
    <PageFrame title="규칙" sub="간격, 글자, 색, 움직임을 정하는 기준이에요. AI에게 전달할 전체 규칙은 TASTE.md에 있어요.">
      <dl className="max-w-[42rem]">
        {RULES.map(([label, description]) => (
          <div key={label} className="grid gap-2 py-4 sm:grid-cols-[112px_1fr] sm:gap-6">
            <dt className="font-medium text-text">{label}</dt>
            <dd className="site-copy brand-copy text-text-2 text-pretty">{description}</dd>
          </div>
        ))}
      </dl>
      <nav className="site-copy flex flex-wrap gap-x-5 gap-y-2 text-sm" aria-label="규칙 문서">
        <a className="site-link underline underline-offset-4" href={href("/docs/button")}>컴포넌트 문서 보기</a>
        <a className="site-link underline underline-offset-4" href={`${import.meta.env.BASE_URL}TASTE.md`}>TASTE.md</a>
        <a className="site-link underline underline-offset-4" href={`${import.meta.env.BASE_URL}DESIGN.md`}>DESIGN.md</a>
        <a className="site-link underline underline-offset-4" href={`${import.meta.env.BASE_URL}llms.txt`}>llms.txt</a>
      </nav>
    </PageFrame>
  )
}
