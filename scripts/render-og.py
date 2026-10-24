#!/usr/bin/env python3
"""Render public/og.png with the checked-in Pretendard Medium font.

From the repository root:
    python3 -m pip install Pillow==12.3.0
    python3 scripts/render-og.py

The font is a renderer input only; Vite serves the resulting PNG.
Its SIL Open Font License is in assets/fonts/LICENSE.txt.
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
FONT = ROOT / "assets/fonts/Pretendard-Medium.otf"
OUTPUT = ROOT / "public/og.png"
WIDTH, HEIGHT, SCALE = 1200, 630, 2
PAGE, SURFACE, INK, BODY = "#fafafa", "#ffffff", "#171717", "#525252"


def font(size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(FONT), size * SCALE)


def text(draw: ImageDraw.ImageDraw, xy: tuple[float, float], value: str,
         size: int, color: str = INK, anchor: str = "lt") -> None:
    draw.text(tuple(position * SCALE for position in xy), value,
              font=font(size), fill=color, anchor=anchor)


def heading(draw: ImageDraw.ImageDraw, y: float, value: str) -> None:
    """Use the brand heading tracking of -0.05em with a 1.2 line-height."""
    face = font(48)
    x = 104 * SCALE
    tracking = -0.05 * 48 * SCALE
    baseline = y * SCALE - face.getbbox("가", anchor="ls")[1]
    for character in value:
        draw.text((x, baseline), character, font=face, fill=INK, anchor="ls")
        x += draw.textlength(character, font=face) + tracking


def render() -> Image.Image:
    image = Image.new("RGB", (WIDTH * SCALE, HEIGHT * SCALE), PAGE)
    draw = ImageDraw.Draw(image)

    # 24px outer corners, 56px content insets, and a full-round 56px button.
    draw.rounded_rectangle((48 * SCALE, 48 * SCALE, 1152 * SCALE, 582 * SCALE),
                           radius=24 * SCALE, fill=SURFACE)
    draw.ellipse((104 * SCALE, 116 * SCALE, 128 * SCALE, 140 * SCALE), fill=INK)
    text(draw, (148, 104), "pyospectui", 48)

    heading(draw, 238, "무채색 면과 여백으로 만드는")
    heading(draw, 238 + 48 * 1.2, "디자인 시스템")
    text(draw, (104, 390), "Pretendard Medium · neutral 테마 · 다크모드", 20, BODY)

    command = "npx pyospectui --overwrite"
    button_width = draw.textlength(command, font=font(20)) / SCALE + 48
    draw.rounded_rectangle((104 * SCALE, 470 * SCALE,
                            (104 + button_width) * SCALE, 526 * SCALE),
                           radius=28 * SCALE, fill=INK)
    text(draw, (104 + button_width / 2, 498), command, 20, PAGE, "mm")
    text(draw, (1096, 498), "ui.pyospect.com", 18, BODY, "rm")

    return image.resize((WIDTH, HEIGHT), Image.Resampling.LANCZOS)


if __name__ == "__main__":
    result = render()
    result.save(OUTPUT, optimize=True)
    print(f"Rendered {OUTPUT.relative_to(ROOT)}: {result.width}×{result.height}")
