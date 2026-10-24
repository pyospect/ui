/** Procedural colour wash. No source image, font, network request or animation. */
export type WashOptions = {
  width: number;
  height: number;
  pixelRatio: number;
  seed: string | number;
  palette: readonly string[];
  blur: number;
  warp: number;
  grain: number;
  texture: number;
};

export const WASH_PALETTES = [
  { id: "coral", label: "코럴과 라벤더", colors: ["#f9785c", "#e2a0ab", "#777cae", "#f4dcc1"] },
  { id: "blue", label: "블루와 아이보리", colors: ["#284b7c", "#7eadd2", "#b9b6d4", "#f2e8da"] },
  { id: "ink", label: "잉크와 종이", colors: ["#17171e", "#5d5d70", "#b4b0bf", "#efeeeb"] },
  { id: "violet", label: "바이올렛과 피치", colors: ["#5c3cb4", "#a18bdb", "#d5bde6", "#f4d5cd"] },
  { id: "rose", label: "로즈와 크림", colors: ["#be516f", "#e495ab", "#efc9d3", "#fff0d8"] },
  { id: "amber", label: "앰버와 허니", colors: ["#c96c18", "#eda342", "#f3ca7e", "#f7ead6"] },
  { id: "sand", label: "샌드와 오트", colors: ["#8f6b51", "#b89578", "#d7bea1", "#f3e8d8"] },
  { id: "cherry", label: "체리와 블러시", colors: ["#8f2442", "#cf4361", "#ed8792", "#f6d4c6"] },
  { id: "mint", label: "민트와 크림", colors: ["#167c7c", "#63b8ab", "#b7d9c5", "#eef2dc"] },
  { id: "forest", label: "포레스트와 세이지", colors: ["#183f38", "#52775c", "#98af83", "#e5dfbf"] },
  { id: "cobalt", label: "코발트와 미스트", colors: ["#2149a6", "#467be2", "#9bc8e9", "#eaf2f2"] },
  { id: "dusk", label: "플럼과 노을", colors: ["#54437a", "#a36691", "#df9c9f", "#f3ceaa"] },
] as const;

export const DEFAULT_WASH_OPTIONS: Readonly<WashOptions> = Object.freeze({
  width: 1024,
  height: 640,
  pixelRatio: 1,
  seed: "pyospect-01",
  palette: WASH_PALETTES[0].colors,
  blur: 0.55,
  warp: 0.55,
  grain: 0.32,
  texture: 0.6,
});

export type WashRenderResult = {
  options: WashOptions;
  pixelWidth: number;
  pixelHeight: number;
};

type Surface = HTMLCanvasElement | OffscreenCanvas;
type Context = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
type RGB = readonly [number, number, number];

const MAX_PIXELS = 4_000_000;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function numberOption(value: unknown, fallback: number, min: number, max: number) {
  return typeof value === "number" && Number.isFinite(value) ? clamp(value, min, max) : fallback;
}

export function normalizeWashOptions(input: Partial<WashOptions> = {}): WashOptions {
  const palette = input.palette ?? DEFAULT_WASH_OPTIONS.palette;
  if (!Array.isArray(palette) || palette.length < 3 || palette.length > 5 ||
      !palette.every((color) => typeof color === "string" && /^#[0-9a-f]{6}$/i.test(color))) {
    throw new Error("색상은 #rrggbb 형식으로 3개에서 5개까지 넣어 주세요.");
  }
  const seed = typeof input.seed === "number" && Number.isFinite(input.seed)
    ? String(input.seed)
    : typeof input.seed === "string" && input.seed.trim()
      ? input.seed.trim().slice(0, 96)
      : String(DEFAULT_WASH_OPTIONS.seed);
  const width = Math.round(numberOption(input.width, DEFAULT_WASH_OPTIONS.width, 160, 1600));
  const height = Math.round(numberOption(input.height, DEFAULT_WASH_OPTIONS.height, 160, 1200));
  const requestedRatio = numberOption(input.pixelRatio, 1, 1, 2);
  return {
    width,
    height,
    pixelRatio: Math.min(requestedRatio, Math.sqrt(MAX_PIXELS / (width * height))),
    seed,
    palette: [...palette],
    blur: numberOption(input.blur, DEFAULT_WASH_OPTIONS.blur, 0, 1),
    warp: numberOption(input.warp, DEFAULT_WASH_OPTIONS.warp, 0, 1),
    grain: numberOption(input.grain, DEFAULT_WASH_OPTIONS.grain, 0, 1),
    texture: numberOption(input.texture, DEFAULT_WASH_OPTIONS.texture, 0, 1),
  };
}

function seedHash(seed: string) {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index++) {
    hash = Math.imul(hash ^ seed.charCodeAt(index), 16777619);
  }
  return hash >>> 0;
}

function randomSource(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function lattice(x: number, y: number, seed: number) {
  let value = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ seed;
  value = Math.imul(value ^ (value >>> 13), 1274126177);
  return ((value ^ (value >>> 16)) >>> 0) / 4294967295;
}

function noise(x: number, y: number, seed: number) {
  const ix = Math.floor(x), iy = Math.floor(y);
  const tx = x - ix, ty = y - iy;
  const sx = tx * tx * (3 - 2 * tx), sy = ty * ty * (3 - 2 * ty);
  const a = lattice(ix, iy, seed), b = lattice(ix + 1, iy, seed);
  const c = lattice(ix, iy + 1, seed), d = lattice(ix + 1, iy + 1, seed);
  return (a + (b - a) * sx) * (1 - sy) + (c + (d - c) * sx) * sy;
}

function fbm(x: number, y: number, seed: number) {
  return noise(x, y, seed) * 0.58 + noise(x * 2.03, y * 2.03, seed + 81) * 0.29 +
    noise(x * 4.13, y * 4.13, seed + 173) * 0.13;
}

function surface(width: number, height: number, target: Surface): Surface {
  if (typeof OffscreenCanvas !== "undefined") return new OffscreenCanvas(width, height);
  if ("ownerDocument" in target) {
    const canvas = target.ownerDocument.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }
  throw new Error("이 환경에서는 2D canvas를 만들 수 없어요.");
}

function context(canvas: Surface): Context {
  const ctx = canvas.getContext("2d") as Context | null;
  if (!ctx) throw new Error("이 환경에서는 2D canvas를 사용할 수 없어요.");
  return ctx;
}

// Three sliding box passes approximate a Gaussian without Canvas filter support.
function blurField(data: Uint8ClampedArray, width: number, height: number, radius: number) {
  if (!radius) return;
  const temp = new Uint8ClampedArray(data.length);
  const window = radius * 2 + 1;
  for (let pass = 0; pass < 3; pass++) {
    for (let y = 0; y < height; y++) {
      const sums = [0, 0, 0];
      for (let k = -radius; k <= radius; k++) {
        const offset = (y * width + clamp(k, 0, width - 1)) * 4;
        for (let channel = 0; channel < 3; channel++) sums[channel] += data[offset + channel];
      }
      for (let x = 0; x < width; x++) {
        const offset = (y * width + x) * 4;
        for (let channel = 0; channel < 3; channel++) temp[offset + channel] = sums[channel] / window;
        temp[offset + 3] = 255;
        const before = (y * width + clamp(x - radius, 0, width - 1)) * 4;
        const after = (y * width + clamp(x + radius + 1, 0, width - 1)) * 4;
        for (let channel = 0; channel < 3; channel++) sums[channel] += data[after + channel] - data[before + channel];
      }
    }
    for (let x = 0; x < width; x++) {
      const sums = [0, 0, 0];
      for (let k = -radius; k <= radius; k++) {
        const offset = (clamp(k, 0, height - 1) * width + x) * 4;
        for (let channel = 0; channel < 3; channel++) sums[channel] += temp[offset + channel];
      }
      for (let y = 0; y < height; y++) {
        const offset = (y * width + x) * 4;
        for (let channel = 0; channel < 3; channel++) data[offset + channel] = sums[channel] / window;
        const before = (clamp(y - radius, 0, height - 1) * width + x) * 4;
        const after = (clamp(y + radius + 1, 0, height - 1) * width + x) * 4;
        for (let channel = 0; channel < 3; channel++) sums[channel] += temp[after + channel] - temp[before + channel];
      }
    }
  }
}

function addFibres(target: Surface, ctx: Context, seed: number, amount: number, ratio: number) {
  if (!amount) return;
  // Odd-sized tile and broken, jittered fibres avoid a rigid crosshatch grid.
  const tile = surface(Math.round(173 * ratio), Math.round(167 * ratio), target);
  const tileContext = context(tile);
  const random = randomSource(seed ^ 0x86c732a1);
  const count = 3900;
  tileContext.lineCap = "round";
  for (let index = 0; index < count; index++) {
    const x = random() * tile.width, y = random() * tile.height;
    const direction = index % 2 ? 0.61 : -0.61;
    const angle = direction + (random() - 0.5) * 0.42;
    const length = (1.8 + random() * 4.2) * ratio;
    tileContext.strokeStyle = random() > 0.5
      ? `rgba(255,255,255,${0.12 + random() * 0.3})`
      : `rgba(0,0,0,${0.09 + random() * 0.24})`;
    tileContext.lineWidth = (0.35 + random() * 0.5) * ratio;
    tileContext.beginPath();
    tileContext.moveTo(x, y);
    tileContext.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
    tileContext.stroke();
  }
  const pattern = ctx.createPattern(tile, "repeat");
  if (!pattern) return;
  ctx.save();
  ctx.globalCompositeOperation = "soft-light";
  ctx.globalAlpha = amount * 0.8;
  ctx.fillStyle = pattern;
  ctx.fillRect(0, 0, target.width, target.height);
  ctx.restore();
}

/** Call from a client effect/event. Identical options reproduce pixels in the same browser. */
export function renderWash(canvas: Surface, input: Partial<WashOptions> = {}): WashRenderResult {
  const options = normalizeWashOptions(input);
  const { width, height, pixelRatio, blur, warp, grain, texture } = options;
  const pixelWidth = Math.round(width * pixelRatio), pixelHeight = Math.round(height * pixelRatio);
  const seed = seedHash(String(options.seed));
  const random = randomSource(seed);
  const palette: RGB[] = options.palette.map((hex) => [
    parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16),
  ]);
  const phase = random() * Math.PI * 2;
  const blobs = palette.map((color, index) => {
    const angle = phase + index / palette.length * Math.PI * 2;
    return {
      color,
      x: 0.5 + Math.cos(angle) * (0.34 + random() * 0.18),
      y: 0.5 + Math.sin(angle) * (0.34 + random() * 0.18),
      spread: 0.1 + random() * 0.09,
    };
  });
  const coarseScale = Math.min(1, 288 / Math.max(width, height));
  const coarseWidth = Math.max(48, Math.round(width * coarseScale));
  const coarseHeight = Math.max(48, Math.round(height * coarseScale));
  const field = surface(coarseWidth, coarseHeight, canvas);
  const fieldContext = context(field);
  const image = fieldContext.createImageData(coarseWidth, coarseHeight);
  for (let y = 0; y < coarseHeight; y++) {
    for (let x = 0; x < coarseWidth; x++) {
      const u = x / (coarseWidth - 1), v = y / (coarseHeight - 1);
      const wx = u + (fbm(u * 2.6, v * 2.6, seed) - 0.5) * warp * 0.9;
      const wy = v + (fbm(u * 2.6 + 37, v * 2.6 - 19, seed + 973) - 0.5) * warp * 0.9;
      let total = 0, red = 0, green = 0, blue = 0;
      for (const blob of blobs) {
        const dx = wx - blob.x, dy = wy - blob.y;
        const weight = Math.exp(-(dx * dx + dy * dy) / (blob.spread * (0.55 + blur * 0.6)));
        total += weight;
        red += blob.color[0] * weight;
        green += blob.color[1] * weight;
        blue += blob.color[2] * weight;
      }
      const offset = (y * coarseWidth + x) * 4;
      image.data[offset] = red / total;
      image.data[offset + 1] = green / total;
      image.data[offset + 2] = blue / total;
      image.data[offset + 3] = 255;
    }
  }
  blurField(image.data, coarseWidth, coarseHeight, Math.round(blur * 8));
  fieldContext.putImageData(image, 0, 0);
  canvas.width = pixelWidth;
  canvas.height = pixelHeight;
  const ctx = context(canvas);
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(field, 0, 0, pixelWidth, pixelHeight);
  addFibres(canvas, ctx, seed, texture, pixelRatio);
  if (grain) {
    const pixels = ctx.getImageData(0, 0, pixelWidth, pixelHeight);
    const noiseRandom = randomSource(seed ^ 0xbcac7d19);
    for (let index = 0; index < pixels.data.length; index += 4) {
      // Shared luminance perturbation: never independent red/green/blue speckles.
      const delta = (noiseRandom() + noiseRandom() - 1) * grain * 34;
      for (let channel = 0; channel < 3; channel++) pixels.data[index + channel] += delta;
    }
    ctx.putImageData(pixels, 0, 0);
  }
  ctx.restore();
  return { options, pixelWidth, pixelHeight };
}
