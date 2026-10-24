import { DEFAULT_WASH_OPTIONS, WASH_PALETTES } from "./engine";
import { parseWashRecipe, type WashRecipeStorage } from "./recipes";
import type { WashVariant } from "./variants";

export type WashDraftSettings = {
  seed: string;
  blur: number;
  warp: number;
  grain: number;
  texture: number;
  shape: "portrait" | "landscape" | "square";
};

export type WashDraftPalette = { id: string; label: string; colors: string[]; variant?: WashVariant };

export type WashDraft = {
  schemaVersion: 1;
  settings: WashDraftSettings;
  palettes: WashDraftPalette[];
};

export const WASH_DRAFT_STORAGE_KEY = "pyospect.wash-draft.v1";

export const DEFAULT_WASH_DRAFT: WashDraft = {
  schemaVersion: 1,
  settings: {
    seed: String(DEFAULT_WASH_OPTIONS.seed),
    blur: DEFAULT_WASH_OPTIONS.blur,
    warp: DEFAULT_WASH_OPTIONS.warp,
    grain: DEFAULT_WASH_OPTIONS.grain,
    texture: DEFAULT_WASH_OPTIONS.texture,
    shape: "portrait",
  },
  palettes: WASH_PALETTES.slice(0, 3).map(({ id, label, colors }) => ({ id, label, colors: [...colors] })),
};

// The default is also the shared server snapshot; accidental mutation must not
// change the initial state of another editor or a later request.
Object.freeze(DEFAULT_WASH_DRAFT.settings);
for (const palette of DEFAULT_WASH_DRAFT.palettes) {
  Object.freeze(palette.colors);
  Object.freeze(palette);
}
Object.freeze(DEFAULT_WASH_DRAFT.palettes);
Object.freeze(DEFAULT_WASH_DRAFT);

function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("현재 작업은 JSON 객체여야 해요.");
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== null && prototype !== Object.prototype) {
    throw new Error("현재 작업은 일반 JSON 객체여야 해요.");
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

/** Validate all three slots through the same rules used for saved recipes. */
export function parseWashDraft(value: unknown): WashDraft {
  const input = record(value);
  if (own(input, "schemaVersion") !== 1) {
    throw new Error("지원하는 배경 작업 파일을 넣어 주세요.");
  }
  const settings = record(own(input, "settings"));
  const seed = own(settings, "seed");
  if (typeof seed !== "string") throw new Error("현재 작업의 시드는 문자열이어야 해요.");
  const rawPalettes = own(input, "palettes");
  if (!Array.isArray(rawPalettes) || rawPalettes.length !== 3) {
    throw new Error("현재 작업에는 팔레트 세 개가 필요해요.");
  }
  const recipes = [0, 1, 2].map((index) => {
    const palette = record(own(rawPalettes, String(index)));
    return parseWashRecipe({
      schemaVersion: 1,
      id: own(palette, "id"),
      name: own(palette, "label"),
      seed,
      blur: own(settings, "blur"),
      warp: own(settings, "warp"),
      grain: own(settings, "grain"),
      texture: own(settings, "texture"),
      shape: own(settings, "shape"),
      palette: { label: own(palette, "label"), colors: own(palette, "colors"), ...(Object.hasOwn(palette, "variant") ? { variant: own(palette, "variant") } : {}) },
    });
  });
  const first = recipes[0];
  return {
    schemaVersion: 1,
    settings: {
      seed: first.seed as string,
      blur: first.blur,
      warp: first.warp,
      grain: first.grain,
      texture: first.texture,
      shape: first.shape,
    },
    // Slot identities belong to the UI index. Reusing a catalog palette in
    // another slot is valid, so palette IDs need not be unique here.
    palettes: recipes.map(({ id, palette }) => ({ id, ...palette, colors: [...palette.colors] })),
  };
}

export function createWashDraftStore(getStorage: () => WashRecipeStorage) {
  let cachedRaw: string | null | undefined;
  let snapshot: WashDraft = DEFAULT_WASH_DRAFT;
  let hasMemoryDraft = false;

  function getSnapshot(): WashDraft {
    if (hasMemoryDraft) return snapshot;
    try {
      const raw = getStorage().getItem(WASH_DRAFT_STORAGE_KEY);
      if (raw === cachedRaw) return snapshot;
      const next = raw === null ? DEFAULT_WASH_DRAFT : parseWashDraft(JSON.parse(raw));
      cachedRaw = raw;
      snapshot = next;
    } catch {
      // Preserve the last valid snapshot/raw pair through a temporary denial,
      // malformed value or failed parse. Recovered storage can be read later.
    }
    return snapshot;
  }

  function getServerSnapshot(): WashDraft {
    return DEFAULT_WASH_DRAFT;
  }

  function save(value: WashDraft): boolean {
    const next = parseWashDraft(value);
    const raw = JSON.stringify(next);
    try {
      getStorage().setItem(WASH_DRAFT_STORAGE_KEY, raw);
      cachedRaw = raw;
      snapshot = next;
      hasMemoryDraft = false;
      return true;
    } catch {
      snapshot = next;
      hasMemoryDraft = true;
      return false;
    }
  }

  return { getSnapshot, getServerSnapshot, save };
}
