/** Palette-only variations: the seed, composition and paper rendering stay intact. */
export const WASH_VARIANTS = [
  { id: "natural", label: "기본", description: "원래 색의 농도와 대비를 유지해요." },
  { id: "pastel", label: "파스텔", description: "명도를 높이고 채도를 낮춰 가볍게 만들어요." },
  { id: "vivid", label: "선명하게", description: "채도와 밝고 어두운 색의 차이를 키워요." },
  { id: "muted", label: "차분하게", description: "채도를 낮추고 중간 밝기로 모아요." },
  { id: "deep", label: "깊게", description: "명도를 낮추고 색의 깊이를 더해요." },
] as const;

export type WashVariant = (typeof WASH_VARIANTS)[number]["id"];

export function isWashVariant(value: unknown): value is WashVariant {
  return WASH_VARIANTS.some(({ id }) => id === value);
}

const clamp = (value: number) => Math.max(0, Math.min(1, value));

function toHsl(hex: string): [number, number, number] {
  const rgb = [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16) / 255);
  const [red, green, blue] = rgb;
  const high = Math.max(...rgb), low = Math.min(...rgb), delta = high - low;
  const lightness = (high + low) / 2;
  if (!delta) return [0, 0, lightness];
  const saturation = delta / (1 - Math.abs(2 * lightness - 1));
  const hue = high === red ? ((green - blue) / delta + (green < blue ? 6 : 0)) / 6
    : high === green ? ((blue - red) / delta + 2) / 6 : ((red - green) / delta + 4) / 6;
  return [hue, saturation, lightness];
}

function fromHsl(hue: number, saturation: number, lightness: number): string {
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const sector = hue * 6;
  const x = chroma * (1 - Math.abs(sector % 2 - 1));
  const rgb = sector < 1 ? [chroma, x, 0] : sector < 2 ? [x, chroma, 0]
    : sector < 3 ? [0, chroma, x] : sector < 4 ? [0, x, chroma]
      : sector < 5 ? [x, 0, chroma] : [chroma, 0, x];
  const offset = lightness - chroma / 2;
  return `#${rgb.map((value) => Math.round(clamp(value + offset) * 255).toString(16).padStart(2, "0")).join("")}`;
}

/** HSL art direction, not a perceptually uniform color scale. Natural is byte-preserving. */
export function applyWashVariant(colors: readonly string[], variant: WashVariant = "natural"): string[] {
  if (!isWashVariant(variant)) throw new Error("지원하는 색감 변주를 골라 주세요.");
  return colors.map((color) => {
    if (!/^#[0-9a-f]{6}$/iu.test(color)) throw new Error("팔레트 색상은 #rrggbb 형식이어야 해요.");
    if (variant === "natural") return color;
    const [hue, saturation, lightness] = toHsl(color);
    switch (variant) {
      case "pastel": return fromHsl(hue, saturation * 0.62, 0.78 + lightness * 0.16);
      case "vivid": return fromHsl(hue, clamp(saturation * 1.25), clamp(0.5 + (lightness - 0.5) * 1.3));
      case "muted": return fromHsl(hue, saturation * 0.28, 0.42 + lightness * 0.28);
      case "deep": return fromHsl(hue, clamp(saturation * 1.08), 0.08 + lightness * 0.46);
    }
  });
}
