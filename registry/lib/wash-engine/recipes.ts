import { isWashVariant, type WashVariant } from "./variants";

export type WashRecipe = {
  schemaVersion: 1;
  id: string;
  name: string;
  seed: string | number;
  blur: number;
  warp: number;
  grain: number;
  texture: number;
  shape: "portrait" | "landscape" | "square";
  palette: { label: string; colors: string[]; variant?: WashVariant };
};

export type WashRecipeStorage = Pick<Storage, "getItem" | "setItem">;

export const WASH_RECIPES_STORAGE_KEY = "pyospect.wash-recipes.v1";
export const MAX_SAVED_WASH_RECIPES = 24;

function record(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label}은 JSON 객체여야 해요.`);
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== null && prototype !== Object.prototype) {
    throw new Error(`${label}은 일반 JSON 객체여야 해요.`);
  }
  return value as Record<string, unknown>;
}

function own(value: object, key: string): unknown {
  const descriptor = Object.getOwnPropertyDescriptor(value, key);
  if (!descriptor || !("value" in descriptor)) {
    throw new Error(`${key} 값을 확인해 주세요.`);
  }
  return descriptor.value;
}

function text(value: unknown, label: string, maximum: number): string {
  if (typeof value !== "string" || !value.trim() || value.trim().length > maximum) {
    throw new Error(`${label}은 1자에서 ${maximum}자 사이로 입력해 주세요.`);
  }
  return value.trim();
}

function effect(value: unknown, label: string): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > 1) {
    throw new Error(`${label} 값은 0에서 1 사이여야 해요.`);
  }
  return value;
}

/** Validate an imported recipe and copy only supported data fields. */
export function parseWashRecipe(value: unknown): WashRecipe {
  const input = record(value, "저장한 조합");
  if (own(input, "schemaVersion") !== 1) {
    throw new Error("지원하는 배경 조합 파일을 넣어 주세요.");
  }
  const id = own(input, "id");
  if (typeof id !== "string" || !/^[A-Za-z0-9-]{1,80}$/u.test(id)) {
    throw new Error("조합 식별자는 영문·숫자·하이픈 80자 이내여야 해요.");
  }
  const name = text(own(input, "name"), "조합 이름", 60);
  const rawSeed = own(input, "seed");
  let seed: string | number;
  if (typeof rawSeed === "number" && Number.isFinite(rawSeed)) {
    seed = rawSeed;
  } else {
    seed = text(rawSeed, "시드", 96);
  }
  const shape = own(input, "shape");
  if (shape !== "portrait" && shape !== "landscape" && shape !== "square") {
    throw new Error("이미지 비율은 세로·가로·정사각 중에서 골라 주세요.");
  }
  const palette = record(own(input, "palette"), "팔레트");
  const label = text(own(palette, "label"), "팔레트 이름", 60);
  const variant = Object.hasOwn(palette, "variant") ? own(palette, "variant") : undefined;
  if (variant !== undefined && !isWashVariant(variant)) throw new Error("지원하는 색감 변주를 골라 주세요.");
  const rawColors = own(palette, "colors");
  if (!Array.isArray(rawColors) || rawColors.length < 3 || rawColors.length > 5) {
    throw new Error("팔레트는 #rrggbb 색상 3개에서 5개로 구성해 주세요.");
  }
  const colors: string[] = [];
  for (let index = 0; index < rawColors.length; index++) {
    const color = own(rawColors, String(index));
    if (typeof color !== "string" || !/^#[0-9A-Fa-f]{6}$/u.test(color)) {
      throw new Error("팔레트 색상은 #rrggbb 형식이어야 해요.");
    }
    colors.push(color);
  }
  return {
    schemaVersion: 1,
    id,
    name,
    seed,
    blur: effect(own(input, "blur"), "색 번짐"),
    warp: effect(own(input, "warp"), "흐름의 굴곡"),
    grain: effect(own(input, "grain"), "미세한 입자"),
    texture: effect(own(input, "texture"), "종이의 결"),
    shape,
    palette: { label, colors, ...(variant === undefined ? {} : { variant }) },
  };
}

function parseCollection(value: unknown): WashRecipe[] {
  if (!Array.isArray(value) || value.length > MAX_SAVED_WASH_RECIPES) {
    throw new Error(`조합은 ${MAX_SAVED_WASH_RECIPES}개까지 보관할 수 있어요.`);
  }
  const ids = new Set<string>();
  const recipes: WashRecipe[] = [];
  for (let index = 0; index < value.length; index++) {
    const recipe = parseWashRecipe(own(value, String(index)));
    if (ids.has(recipe.id)) throw new Error("조합 식별자가 중복돼요.");
    ids.add(recipe.id);
    recipes.push(recipe);
  }
  return recipes;
}

/** Missing, malformed or unavailable storage never prevents opening the editor. */
export function readSavedRecipes(storage: WashRecipeStorage | null | undefined): WashRecipe[] {
  try {
    if (!storage) return [];
    const raw = storage.getItem(WASH_RECIPES_STORAGE_KEY);
    return raw === null ? [] : parseCollection(JSON.parse(raw));
  } catch {
    return [];
  }
}

/** Invalid collections and failed writes preserve the last successfully stored value. */
export function saveSavedRecipes(
  storage: WashRecipeStorage | null | undefined,
  recipes: readonly WashRecipe[],
): boolean {
  try {
    if (!storage) return false;
    const validated = parseCollection(recipes);
    storage.setItem(WASH_RECIPES_STORAGE_KEY, JSON.stringify(validated));
    return true;
  } catch {
    return false;
  }
}
