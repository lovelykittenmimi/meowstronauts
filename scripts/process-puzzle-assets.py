"""Prepare the four puzzle images for the web build.

Usage:
    python scripts/process-puzzle-assets.py <source-dir> <output-dir> [<preview-dir>]

Source files:
    base.png, solar.png, greenhouse.png, wall.png

Outputs:
    base.webp, solar-array.webp, greenhouse.webp, outer-wall.webp

The cut-outs are photographed on a near-white studio background. We flood-fill
the connected white region from the frame edge, and for the ring-shaped wall
also from the centre so the hole becomes transparent. A one-pixel erode plus a
small alpha blur removes the white fringe without hard-cutting the edges.
"""

from collections import deque
from pathlib import Path
import sys

from PIL import Image, ImageDraw, ImageFilter

SRC = Path(sys.argv[1])
OUT = Path(sys.argv[2])
PREVIEW = Path(sys.argv[3]) if len(sys.argv) > 3 else None

SOURCES = [
    ("solar.png", "solar-array.webp", False),
    ("greenhouse.png", "greenhouse.webp", False),
    ("wall.png", "outer-wall.webp", True),
]


def is_background(pixel: tuple[int, int, int, int]) -> bool:
    r, g, b, _ = pixel
    return min(r, g, b) >= 244 and max(r, g, b) - min(r, g, b) <= 8


def remove_background(path: Path, hole: bool) -> Image.Image:
    image = Image.open(path).convert("RGBA")
    width, height = image.size
    pixels = image.load()
    visited = bytearray(width * height)
    queue: deque[tuple[int, int]] = deque()

    def seed(x: int, y: int) -> None:
        if not (0 <= x < width and 0 <= y < height):
            return
        index = y * width + x
        if visited[index] or not is_background(pixels[x, y]):
            return
        visited[index] = 1
        queue.append((x, y))

    for x in range(width):
        seed(x, 0)
        seed(x, height - 1)
    for y in range(height):
        seed(0, y)
        seed(width - 1, y)
    if hole:
        seed(width // 2, height // 2)

    while queue:
        x, y = queue.popleft()
        seed(x - 1, y)
        seed(x + 1, y)
        seed(x, y - 1)
        seed(x, y + 1)

    mask = Image.new("L", (width, height), 255)
    mask_pixels = mask.load()
    for y in range(height):
        offset = y * width
        for x in range(width):
            if visited[offset + x]:
                mask_pixels[x, y] = 0

    # Erode one pixel to remove the white antialias fringe, then soften.
    mask = mask.filter(ImageFilter.MinFilter(3))
    mask = mask.filter(ImageFilter.GaussianBlur(0.7))
    image.putalpha(mask)

    bbox = mask.point(lambda alpha: 255 if alpha > 8 else 0).getbbox()
    if bbox:
        image = image.crop(bbox)
    return image


def checkerboard(size: tuple[int, int], cell: int = 16) -> Image.Image:
    board = Image.new("RGBA", size, (245, 245, 245, 255))
    draw = ImageDraw.Draw(board)
    for y in range(0, size[1], cell):
        for x in range(0, size[0], cell):
            if (x // cell + y // cell) % 2:
                draw.rectangle((x, y, x + cell - 1, y + cell - 1), fill=(210, 210, 210, 255))
    return board


def save_preview(image: Image.Image, path: Path) -> None:
    board = checkerboard(image.size)
    board.alpha_composite(image)
    board.convert("RGB").save(path, "PNG")


OUT.mkdir(parents=True, exist_ok=True)
if PREVIEW:
    PREVIEW.mkdir(parents=True, exist_ok=True)

base = Image.open(SRC / "base.png").convert("RGB")
base.save(OUT / "base.webp", "WEBP", quality=88, method=6)
print(f"base.webp {base.size}")

cutouts: dict[str, Image.Image] = {}
for source_name, output_name, hole in SOURCES:
    cutout = remove_background(SRC / source_name, hole)
    cutout.save(OUT / output_name, "WEBP", quality=90, method=6)
    cutouts[output_name] = cutout
    print(f"{output_name} {cutout.size}")
    if PREVIEW:
        save_preview(cutout, PREVIEW / output_name.replace(".webp", "-preview.png"))

if PREVIEW:
    # Rough placement preview on top of the base plate.
    canvas = base.convert("RGBA")
    bw, bh = canvas.size

    wall = cutouts["outer-wall.webp"]
    wall_w = int(bw * 0.92)
    wall = wall.resize((wall_w, int(wall.height * wall_w / wall.width)), Image.LANCZOS)
    canvas.alpha_composite(wall, ((bw - wall.width) // 2, (bh - wall.height) // 2))

    solar = cutouts["solar-array.webp"]
    solar_w = int(bw * 0.38)
    solar = solar.resize((solar_w, int(solar.height * solar_w / solar.width)), Image.LANCZOS)
    canvas.alpha_composite(solar, (int(bw * 0.03), bh - solar.height - int(bh * 0.1)))

    greenhouse = cutouts["greenhouse.webp"]
    greenhouse_w = int(bw * 0.31)
    greenhouse = greenhouse.resize(
        (greenhouse_w, int(greenhouse.height * greenhouse_w / greenhouse.width)),
        Image.LANCZOS,
    )
    canvas.alpha_composite(
        greenhouse,
        (bw - greenhouse.width - int(bw * 0.03), bh - greenhouse.height - int(bh * 0.12)),
    )

    canvas.convert("RGB").save(PREVIEW / "composite.png", "PNG")
    print(f"composite.png {canvas.size}")
