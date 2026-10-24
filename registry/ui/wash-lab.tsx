/**
 * WashLab
 * Naming     WashLab, a reusable procedural background workshop.
 * Variant    palette, tone, seed, texture and aspect ratio; follows light or dark theme.
 * Token      bg, surface, text, text-2, text-3, border and ring; artwork colors are user data.
 * Structure  controls, three previews, named recipe library and JSON import/export.
 * Usage Rule render as a page section; state stays in this browser until exported.
 */
"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type FormEvent, type ComponentProps } from "react";

import { Button as BaseButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WASH_PALETTES, renderWash } from "@/lib/wash-engine/engine";
import { createWashDraftStore, DEFAULT_WASH_DRAFT, type WashDraft, type WashDraftPalette, type WashDraftSettings } from "@/lib/wash-engine/draft";
import { MAX_SAVED_WASH_RECIPES, WASH_RECIPES_STORAGE_KEY, parseWashRecipe, readSavedRecipes, saveSavedRecipes, type WashRecipe } from "@/lib/wash-engine/recipes";
import { WASH_VARIANTS, applyWashVariant, type WashVariant } from "@/lib/wash-engine/variants";
import styles from "./wash-lab.module.css";

function Button({ variant = "default", ...props }: ComponentProps<typeof BaseButton> & { variant?: "default" | "outline" | "ghost" }) {
  return <BaseButton hierarchy={variant === "outline" ? "secondary" : variant === "ghost" ? "ghost" : "primary"} {...props} />;
}

function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={[styles.textarea, className].filter(Boolean).join(" ")} {...props} />;
}

const DRAFT_EVENT = "pyospect-wash-draft-change";
const RECIPES_EVENT = "pyospect-wash-recipes-change";
const draftStore = createWashDraftStore(() => window.localStorage);
let cachedRecipesRaw = "[]";

function subscribe(eventName: string, onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(eventName, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(eventName, onChange);
  };
}
const subscribeDraft = (onChange: () => void) => subscribe(DRAFT_EVENT, onChange);
const subscribeRecipes = (onChange: () => void) => subscribe(RECIPES_EVENT, onChange);
function getRecipesRaw() {
  try { cachedRecipesRaw = window.localStorage.getItem(WASH_RECIPES_STORAGE_KEY) ?? "[]"; } catch { /* Keep the last readable collection. */ }
  return cachedRecipesRaw;
}
const getServerRecipesRaw = () => "[]";

const SHAPES = [
  { id: "portrait", label: "세로", width: 480, height: 640, exportWidth: 900, exportHeight: 1200 },
  { id: "landscape", label: "가로", width: 640, height: 400, exportWidth: 1600, exportHeight: 1000 },
  { id: "square", label: "정사각", width: 560, height: 560, exportWidth: 1200, exportHeight: 1200 },
] as const;
const CONTROLS = [
  { key: "blur", label: "색 번짐" },
  { key: "warp", label: "흐름의 굴곡" },
  { key: "grain", label: "미세한 입자" },
  { key: "texture", label: "종이의 결" },
] as const;

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function WashLab({ className }: { className?: string }) {
  const draft = useSyncExternalStore(subscribeDraft, draftStore.getSnapshot, draftStore.getServerSnapshot);
  const { settings, palettes } = draft;
  const recipesRaw = useSyncExternalStore(subscribeRecipes, getRecipesRaw, getServerRecipesRaw);
  const diskRecipes = useMemo(() => readSavedRecipes({ getItem: () => recipesRaw, setItem: () => {} }), [recipesRaw]);
  const [memoryRecipes, setMemoryRecipes] = useState<WashRecipe[] | null>(null);
  const recipes = memoryRecipes ?? diskRecipes;
  const [notice, setNotice] = useState("현재 작업은 이 브라우저에 자동 저장돼요.");
  const [renderedKey, setRenderedKey] = useState("");
  const [renderError, setRenderError] = useState("");
  const [exporting, setExporting] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [names, setNames] = useState(["", "", ""]);
  const [importText, setImportText] = useState("");
  const [importFeedback, setImportFeedback] = useState<{ error: boolean; message: string } | null>(null);
  const [removed, setRemoved] = useState<WashRecipe | null>(null);
  const canvasRefs = useRef<Array<HTMLCanvasElement | null>>([]);
  const shape = SHAPES.find((item) => item.id === settings.shape) ?? SHAPES[0];
  const renderKey = JSON.stringify(draft);
  const ready = renderedKey === renderKey && !renderError;
  const configText = JSON.stringify(palettes.map(({ id, colors, variant }) => ({ id, options: { ...settings, width: shape.exportWidth, height: shape.exportHeight, pixelRatio: 1, palette: applyWashVariant(colors, variant) } })), null, 2);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        for (const [index, palette] of palettes.entries()) {
          const canvas = canvasRefs.current[index];
          if (canvas) renderWash(canvas, { ...settings, width: shape.width, height: shape.height, pixelRatio: 1, palette: applyWashVariant(palette.colors, palette.variant) });
        }
        setRenderedKey(renderKey);
        setRenderError("");
      } catch (error) {
        setRenderError(error instanceof Error ? error.message : "배경을 그리지 못했어요.");
      }
    }, 160);
    return () => window.clearTimeout(timer);
  }, [settings, palettes, shape.width, shape.height, renderKey]);

  function saveDraft(next: WashDraft) {
    const persisted = draftStore.save(next);
    window.dispatchEvent(new Event(DRAFT_EVENT));
    setNotice(persisted ? "현재 작업을 이 브라우저에 저장했어요." : "브라우저에 저장할 수 없어 이번 화면에서만 유지돼요. 시안을 파일로 내보내 주세요.");
    return persisted;
  }

  function updateSettings(patch: Partial<WashDraftSettings>) {
    const current = draftStore.getSnapshot();
    saveDraft({ ...current, settings: { ...current.settings, ...patch } });
  }

  function updatePalette(index: number, palette: WashDraftPalette) {
    const current = draftStore.getSnapshot();
    saveDraft({ ...current, palettes: current.palettes.map((item, slot) => slot === index ? palette : item) });
  }

  function changeColor(slot: number, index: number, color: string) {
    const palette = draftStore.getSnapshot().palettes[slot];
    updatePalette(slot, { ...palette, id: `custom-${slot}`, label: "직접 고른 색", colors: palette.colors.map((item, position) => position === index ? color.toLowerCase() : item) });
  }

  function writeRecipes(next: WashRecipe[]) {
    let persisted = false;
    try { persisted = saveSavedRecipes(window.localStorage, next); } catch { /* Storage can be denied before access. */ }
    if (persisted) cachedRecipesRaw = JSON.stringify(next);
    setMemoryRecipes(persisted ? null : next);
    window.dispatchEvent(new Event(RECIPES_EVENT));
    return persisted;
  }

  function addRecipe(input: unknown) {
    if (recipes.length >= MAX_SAVED_WASH_RECIPES) throw new Error(`시안은 ${MAX_SAVED_WASH_RECIPES}개까지 보관할 수 있어요. 먼저 보관함을 정리해 주세요.`);
    let recipe = parseWashRecipe(input);
    if (recipes.some((item) => item.id === recipe.id)) recipe = { ...recipe, id: crypto.randomUUID() };
    return { recipe, persisted: writeRecipes([recipe, ...recipes]) };
  }

  function savePalette(index: number) {
    try {
      const palette = palettes[index];
      const { recipe, persisted } = addRecipe({ schemaVersion: 1, id: crypto.randomUUID(), name: names[index].trim() || palette.label, ...settings, palette: { label: palette.label, colors: palette.colors, ...(palette.variant ? { variant: palette.variant } : {}) } });
      setNotice(persisted ? `${recipe.name} 시안을 보관했어요.` : "저장소를 사용할 수 없어 이 화면에만 보관했어요. 시안 파일을 내보내 주세요.");
    } catch (error) { setNotice(error instanceof Error ? error.message : "시안을 보관하지 못했어요."); }
  }

  function applyRecipe(recipe: WashRecipe) {
    const current = draftStore.getSnapshot();
    const persisted = saveDraft({ ...current, settings: { seed: String(recipe.seed), blur: recipe.blur, warp: recipe.warp, grain: recipe.grain, texture: recipe.texture, shape: recipe.shape }, palettes: [{ id: recipe.id, ...recipe.palette }, ...current.palettes.slice(1)] });
    setNames((value) => [recipe.name, ...value.slice(1)]);
    return persisted;
  }

  function importRecipe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const { recipe, persisted } = addRecipe(JSON.parse(importText));
      const draftPersisted = applyRecipe(recipe);
      setImportText("");
      setImportFeedback({ error: false, message: persisted && draftPersisted ? `${recipe.name} 시안을 보관하고 첫 번째 칸에 불러왔어요.` : "시안을 불러왔지만 브라우저에 저장할 수 없어요. 파일로 보관해 주세요." });
    } catch (error) { setImportFeedback({ error: true, message: error instanceof SyntaxError ? "시안 JSON 문법을 확인해 주세요." : error instanceof Error ? error.message : "시안 파일을 읽지 못했어요." }); }
  }

  function exportRecipe(recipe: WashRecipe) {
    downloadBlob(new Blob([JSON.stringify(recipe, null, 2)], { type: "application/json" }), `pyospect-wash-${recipe.id}.json`);
    setNotice(`${recipe.name} 시안을 파일로 내보냈어요.`);
  }

  async function exportImage(index: number) {
    setExporting(true);
    setNotice("큰 이미지를 만들고 있어요.");
    try {
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      const palette = palettes[index];
      const canvas = document.createElement("canvas");
      renderWash(canvas, { ...settings, width: shape.exportWidth, height: shape.exportHeight, pixelRatio: 1, palette: applyWashVariant(palette.colors, palette.variant) });
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
      if (!blob) throw new Error("이미지 파일을 만들지 못했어요.");
      downloadBlob(blob, `pyospect-wash-${palette.id}${palette.variant && palette.variant !== "natural" ? `-${palette.variant}` : ""}-${settings.seed.replace(/[^a-z0-9_-]/giu, "-").slice(0, 40) || "draft"}.png`);
      setNotice(`${palette.label} 이미지를 저장했어요. ${canvas.width} × ${canvas.height}px`);
    } catch (error) { setNotice(error instanceof Error ? error.message : "이미지를 저장하지 못했어요."); }
    finally { setExporting(false); }
  }

  return (
    <div className={["bg-bg text-text", styles.root, className].filter(Boolean).join(" ")}>
      <main className={styles.main}>
        <div className={styles.heading}><div><p>배경 실험실</p><h1>색은 흐르게,<br />결은 섬세하게.</h1></div><p>12가지 색 조합과 다섯 가지 농도로 시작해요. 밝기와 채도를 바꾸고, 마음에 드는 구도와 질감을 시안으로 보관해요.</p></div>
        <section className={styles.controls} aria-label="배경 생성 설정">
          <div className={styles.seedControl}>
            <label htmlFor="wash-seed">시드</label>
            <Input key={settings.seed} id="wash-seed" maxLength={96} defaultValue={settings.seed} onBlur={(event) => { const seed = event.target.value.trim(); if (seed) updateSettings({ seed }); else { event.target.value = settings.seed; setNotice("시드를 입력해 주세요. 이전 시드를 유지했어요."); } }} onKeyDown={(event) => { if (event.key === "Enter") event.currentTarget.blur(); }} />
            <Button variant="outline" onClick={() => updateSettings({ seed: `pyospect-${crypto.getRandomValues(new Uint32Array(1))[0].toString(36)}` })}>다른 구도</Button>
          </div>
          <div className={styles.sliders}>{CONTROLS.map(({ key, label }) => <label key={key} className={styles.slider}><span>{label}<output>{Math.round(settings[key] * 100)}%</output></span><input type="range" min={0} max={1} step={0.01} value={settings[key]} onChange={(event) => updateSettings({ [key]: Number(event.target.value) })} aria-label={label} /></label>)}</div>
          <div className={styles.settingsFooter}><div role="group" aria-label="이미지 비율" className={styles.shapeControls}>{SHAPES.map(({ id, label }) => <Button size="sm" variant={settings.shape === id ? "default" : "outline"} aria-pressed={settings.shape === id} key={id} onClick={() => updateSettings({ shape: id })}>{label}</Button>)}</div><Button size="sm" variant="ghost" onClick={() => saveDraft(DEFAULT_WASH_DRAFT)}>처음 값으로</Button></div>
        </section>
        <p className={styles.notice} role="status">{renderError || (!ready ? "배경을 그리고 있어요." : notice)}</p>
        <section className={styles.gallery} aria-label="생성한 배경">
          {palettes.map((palette, slot) => {
            const catalog = WASH_PALETTES.some((item) => item.id === palette.id && JSON.stringify(item.colors) === JSON.stringify(palette.colors));
            return <article key={slot} className={styles.card} aria-label={`${slot + 1}번 미리보기`}>
              <div className={styles.canvasFrame} style={{ aspectRatio: `${shape.width} / ${shape.height}` }}><canvas role="img" aria-label={`${palette.label}, ${WASH_VARIANTS.find((item) => item.id === (palette.variant ?? "natural"))?.label} 색감의 번짐과 종이결 배경`} ref={(element) => { canvasRefs.current[slot] = element; }} /></div>
              <div className={styles.cardFooter}><h2>{slot + 1}번 색 조합</h2><Button size="sm" variant="outline" disabled={!ready || exporting} onClick={() => void exportImage(slot)}>이미지 저장</Button></div>
              <span className={styles.selectField}><Select value={catalog ? palette.id : "custom"} onValueChange={(value) => { const item = WASH_PALETTES.find((candidate) => candidate.id === value); if (item) updatePalette(slot, { ...item, colors: [...item.colors], ...(palette.variant ? { variant: palette.variant } : {}) }); }}><SelectTrigger aria-label={`${slot + 1}번 색 조합`}><SelectValue /></SelectTrigger><SelectContent>{!catalog ? <SelectItem value="custom" disabled>직접 고른 색</SelectItem> : null}{WASH_PALETTES.map((item) => <SelectItem key={item.id} value={item.id}>{item.label}</SelectItem>)}</SelectContent></Select></span>
              <span className={styles.selectField}><Select value={palette.variant ?? "natural"} onValueChange={(value) => updatePalette(slot, { ...palette, variant: value as WashVariant })}><SelectTrigger aria-label={`${slot + 1}번 색감 변주`}><SelectValue /></SelectTrigger><SelectContent>{WASH_VARIANTS.map((item) => <SelectItem key={item.id} value={item.id}>{item.label}</SelectItem>)}</SelectContent></Select></span>
              <p className={styles.variantDescription}>{WASH_VARIANTS.find((item) => item.id === (palette.variant ?? "natural"))?.description}</p>
              <div className={styles.colorStrip} aria-label={`${slot + 1}번 팔레트 색상`}>{applyWashVariant(palette.colors, palette.variant).map((color, index) => <span key={index} style={{ background: color }} title={color} />)}</div>
              <details className={styles.paletteDetails}><summary>색 편집과 시안 저장</summary><div className={styles.paletteEditor}>
                <div className={styles.colorGrid}>{palette.colors.map((color, index) => <div key={index} className={styles.colorField}>
                  <input type="color" value={color} aria-label={`${slot + 1}번 팔레트 ${index + 1}번째 색 선택`} onChange={(event) => changeColor(slot, index, event.target.value)} />
                  <input key={color} type="text" defaultValue={color} maxLength={9} spellCheck={false} aria-label={`${slot + 1}번 팔레트 ${index + 1}번째 색 코드`} onBlur={(event) => { const value = event.target.value.trim(); if (/^#[0-9a-f]{6}$/iu.test(value)) changeColor(slot, index, value); else { event.target.value = color; setNotice("색 코드는 #rrggbb 형식으로 입력해 주세요. 이전 색을 유지했어요."); } }} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); event.currentTarget.blur(); } }} />
                  <button type="button" disabled={palette.colors.length <= 3} aria-label={`${slot + 1}번 팔레트 ${index + 1}번째 색 빼기`} onClick={() => updatePalette(slot, { ...palette, id: `custom-${slot}`, label: "직접 고른 색", colors: palette.colors.filter((_, position) => position !== index) })}>빼기</button>
                </div>)}</div>
                <Button size="sm" variant="outline" disabled={palette.colors.length >= 5} onClick={() => updatePalette(slot, { ...palette, id: `custom-${slot}`, label: "직접 고른 색", colors: [...palette.colors, "#ffffff"] })}>색 추가</Button> {/* taste-lint-ignore token/raw-color */}
                <p>기준색 3~5개에 선택한 색감 변주를 적용해요. 색의 개수가 같으면 구도를 유지하며 비교할 수 있어요.</p>
                <label className={styles.recipeName}>시안 이름<Input maxLength={60} value={names[slot]} placeholder={palette.label} aria-label={`${slot + 1}번 시안 이름`} onChange={(event) => setNames((value) => value.map((name, index) => index === slot ? event.target.value : name))} /></label>
                <Button size="sm" onClick={() => savePalette(slot)}>시안 보관</Button>
              </div></details>
            </article>;
          })}
        </section>
        <section className={styles.library} aria-labelledby="wash-library-title">
          <div className={styles.libraryHeading}><h2 id="wash-library-title">보관한 시안 <span>{recipes.length}/{MAX_SAVED_WASH_RECIPES}</span></h2>{removed ? <Button size="sm" variant="outline" onClick={() => { if (recipes.length >= MAX_SAVED_WASH_RECIPES) { setNotice("보관함이 가득 차 있어요."); return; } writeRecipes([removed, ...recipes.filter((item) => item.id !== removed.id)]); setRemoved(null); setNotice("삭제한 시안을 되돌렸어요."); }}>삭제한 시안 되돌리기</Button> : null}</div>
          <p>시드,기준색,색감 변주,번짐,질감,비율을 함께 보관해요. 불러온 시안은 첫 번째 칸에서 다시 다듬을 수 있어요.</p>
          {recipes.length ? <ul className={styles.recipeList}>{recipes.map((recipe) => <li key={recipe.id}><div className={styles.recipeInfo}><div className={styles.savedSwatches}>{applyWashVariant(recipe.palette.colors, recipe.palette.variant).map((color, index) => <span key={index} style={{ background: color }} />)}</div><div><h3>{recipe.name}</h3><p>{recipe.seed} , {SHAPES.find((item) => item.id === recipe.shape)?.label}</p></div></div><div className={styles.recipeActions}><Button size="sm" variant="outline" onClick={() => { const persisted = applyRecipe(recipe); if (persisted) setNotice(`${recipe.name} 시안을 첫 번째 칸에 불러왔어요.`); }}>불러오기</Button><Button size="sm" variant="ghost" onClick={() => exportRecipe(recipe)}>설정 내보내기</Button><Button size="sm" variant="ghost" aria-label={`${recipe.name} 시안 삭제`} onClick={() => { writeRecipes(recipes.filter((item) => item.id !== recipe.id)); setRemoved(recipe); setNotice("시안을 보관함에서 지웠어요. 되돌리기로 복원할 수 있어요."); }}>삭제</Button></div></li>)}</ul> : <p className={styles.emptyLibrary}>마음에 드는 팔레트의 ‘색 편집과 시안 저장’에서 첫 시안을 보관해 보세요.</p>}
          <details className={styles.importDetails}><summary>설정 파일로 가져오기</summary><form onSubmit={importRecipe}><label htmlFor="wash-import">보관함에서 내보낸 시안 JSON</label><Textarea id="wash-import" rows={5} value={importText} aria-invalid={importFeedback?.error || undefined} aria-describedby={importFeedback ? "wash-import-feedback" : undefined} onChange={(event) => { setImportText(event.target.value); setImportFeedback(null); }} placeholder="시안 설정을 붙여 넣으세요" /><Button type="submit" size="sm" variant="outline" disabled={!importText.trim()}>시안 가져오기</Button>{importFeedback ? <p id="wash-import-feedback" className={styles.importFeedback} role={importFeedback.error ? "alert" : "status"}>{importFeedback.message}</p> : null}</form></details>
        </section>
        <section className={styles.notes}><div><h2>구도는 그대로, 색은 자유롭게</h2><p>팔레트만 바꾸면 현재 시드와 질감은 유지돼요. 세 미리보기의 색을 따로 골라 나란히 비교해 보세요. 마지막 작업 상태도 새로고침 후 이어집니다.</p></div><div><Button variant="outline" aria-expanded={showConfig} onClick={() => setShowConfig(!showConfig)}>현재 엔진 설정 {showConfig ? "접기" : "보기"}</Button>{showConfig ? <label className={styles.config}><span>팔레트별 설정 , renderWash(canvas, 설정[0].options)</span><Textarea readOnly aria-label="배경 생성 설정 JSON" rows={12} value={configText} /></label> : null}<p>현재 작업과 보관함은 이 브라우저에 저장돼요. 다른 기기나 프로젝트에서도 쓸 조합은 시안 파일로 내보내세요.</p></div></section>
      </main>
    </div>
  );
}
