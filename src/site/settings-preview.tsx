import { useId, useState, type FormEvent } from "react"
import { Building2, Check, CircleCheck, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Field, Help, Input, Label } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { varStyle, type Theme } from "@/lib/theme"
import styles from "./settings-preview.module.css"

export type Settings = {
  name: string
  email: string
  language: string
  timezone: string
  digest: boolean
}

export const INITIAL_SETTINGS: Settings = {
  name: "해빛 디자인팀",
  email: "design@haebit.example",
  language: "ko",
  timezone: "seoul",
  digest: true,
}

type Props = {
  mode: "light" | "dark"
  theme: Theme
  settings: Settings
  saved: Settings
  attempted: boolean
  message: string
  onChange: (next: Settings) => void
  onAttempt: () => void
  onSave: () => void
  onReset: () => void
}

export function SettingsPreview({
  mode,
  theme,
  settings,
  saved,
  attempted,
  message,
  onChange,
  onAttempt,
  onSave,
  onReset,
}: Props) {
  const id = useId()
  const [container, setContainer] = useState<HTMLDivElement | null>(null)
  const nameError = !settings.name.trim() ? "워크스페이스 이름을 입력해 주세요." : ""
  const emailError = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.email)
    ? "이메일을 확인해 주세요. 예: team@example.com"
    : ""
  const dirty = Object.keys(settings).some((key) => settings[key as keyof Settings] !== saved[key as keyof Settings])
  const contrast = theme.contract.results.find((result) => (
    result.kind === "contrast" && result.mode === mode && result.pair === "brand-text on brand"
  ))
  const update = (patch: Partial<Settings>) => onChange({ ...settings, ...patch })

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onAttempt()
    if (nameError || emailError) {
      document.getElementById(`${id}-${nameError ? "name" : "email"}`)?.focus()
      return
    }
    onSave()
  }

  return (
    <div
      ref={setContainer}
      data-preview-mode={mode}
      className={styles.preview}
      style={{ ...varStyle(theme.vars[mode]), colorScheme: mode }}
    >
      <div className={styles.workspace}>
        <span className={styles.workspaceIcon}><Building2 size={18} aria-hidden /></span>
        <span>해빛 워크스페이스</span>
        <span className={styles.active}><CircleCheck size={14} aria-hidden />활성</span>
      </div>
      <div className={styles.heading}>
        <h3>워크스페이스 설정</h3>
        <p>팀이 함께 쓰는 기본 정보를 관리해요.</p>
      </div>
      <form
        onSubmit={submit}
        noValidate
        aria-label={`${mode === "light" ? "라이트" : "다크"} 워크스페이스 설정`}
      >
        <div className={styles.identityFields}>
          <Field>
            <Label htmlFor={`${id}-name`}>워크스페이스 이름</Label>
            <Input
              id={`${id}-name`}
              value={settings.name}
              maxLength={60}
              onChange={(event) => update({ name: event.target.value })}
              aria-invalid={attempted && !!nameError}
              aria-describedby={`${id}-name-help`}
            />
            <Help id={`${id}-name-help`} error={attempted && !!nameError}>
              {attempted && nameError ? nameError : "팀원에게 보이는 이름이에요."}
            </Help>
          </Field>
          <Field>
            <Label htmlFor={`${id}-email`}>팀 이메일</Label>
            <Input
              id={`${id}-email`}
              type="email"
              value={settings.email}
              maxLength={120}
              onChange={(event) => update({ email: event.target.value })}
              aria-invalid={attempted && !!emailError}
              aria-describedby={`${id}-email-help`}
            />
            <Help id={`${id}-email-help`} error={attempted && !!emailError}>
              {attempted && emailError ? emailError : "서비스 안내와 중요한 소식을 받아요."}
            </Help>
          </Field>
        </div>
        <div className={styles.selects}>
          <Field>
            <Label htmlFor={`${id}-language`}>기본 언어</Label>
            <Select value={settings.language} onValueChange={(language) => update({ language })}>
              <SelectTrigger id={`${id}-language`}><SelectValue /></SelectTrigger>
              <SelectContent container={container}>
                <SelectItem value="ko">한국어</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ja" disabled>日本語 (준비 중)</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <Label htmlFor={`${id}-timezone`}>시간대</Label>
            <Select value={settings.timezone} onValueChange={(timezone) => update({ timezone })}>
              <SelectTrigger id={`${id}-timezone`}><SelectValue /></SelectTrigger>
              <SelectContent container={container}>
                <SelectItem value="seoul">서울 (UTC+9)</SelectItem>
                <SelectItem value="london">런던 (UTC+0)</SelectItem>
                <SelectItem value="new-york">뉴욕 (UTC−5)</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>
        <label className={styles.checkboxRow}>
          <input
            type="checkbox"
            checked={settings.digest}
            onChange={(event) => update({ digest: event.target.checked })}
          />
          <span className={styles.checkboxVisual} aria-hidden>{settings.digest && <Check size={14} />}</span>
          <span>매주 월요일에 활동 요약 받기</span>
        </label>
        <div className={styles.formFooter}>
          <p className={styles.saveStatus} role={mode === "light" ? "status" : undefined}>
            {message ? (
              <><CircleCheck size={14} aria-hidden />{message}</>
            ) : dirty ? (
              <><Info size={14} aria-hidden />저장하지 않은 변경사항이 있어요.</>
            ) : "팀에 맞게 설정을 바꿔보세요."}
          </p>
          <div className={styles.actions}>
            <Button hierarchy="secondary" onClick={onReset} disabled={!dirty}>되돌리기</Button>
            <Button type="submit">저장하기</Button>
          </div>
        </div>
      </form>
      <div
        className={styles.contrast}
        aria-label={`${mode === "light" ? "라이트" : "다크"} 버튼 글자 대비`}
      >
        <span className={styles.contrastSample} aria-hidden>가</span>
        <span>버튼 글자 대비 <strong>{contrast?.ratio.toFixed(2)}:1</strong></span>
        <span className={styles.pass}><Check size={14} aria-hidden />AA 통과</span>
      </div>
    </div>
  )
}
