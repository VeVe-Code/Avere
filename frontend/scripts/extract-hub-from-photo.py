"""Remove page background from landscape hub photo — edge flood only."""
from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image

ASSETS = Path(
    r"C:\Users\atcom\.cursor\projects\c-Users-atcom-OneDrive-Desktop-Avere-f\assets"
)
OUT = Path(__file__).resolve().parents[1] / "public" / "solutions-hub.png"
TARGET_LONG_EDGE = 1660  # ~3x from best landscape source


def lum(c: tuple[int, int, int]) -> float:
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]


def is_removable_bg(r: int, g: int, b: int, a: int) -> bool:
    if a < 8:
        return True
    L = lum((r, g, b))
    if L > 198 and abs(r - g) < 14 and abs(g - b) < 16:
        return False
    if b > r + 8 and b > g + 4 and 175 < L < 252:
        return True
    if L > 243 and (b - r) >= 4 and (b - g) >= 2:
        return True
    return False


def find_src() -> Path:
    patterns = ("*image-ea784589*", "*image-5b7da8c1*", "*image-5afb839c*")
    candidates: list[Path] = []
    for pattern in patterns:
        candidates.extend(ASSETS.glob(pattern))
    if not candidates:
        raise SystemExit("landscape hub photo not found")

    def area(p: Path) -> int:
        with Image.open(p) as im:
            return im.size[0] * im.size[1]

    return max(candidates, key=area)


def remove_bg(im: Image.Image) -> Image.Image:
    im = im.convert("RGBA")
    w, h = im.size
    px = im.load()

    visited: set[tuple[int, int]] = set()
    q: deque[tuple[int, int]] = deque()
    for x in range(w):
        q.append((x, 0))
        q.append((x, h - 1))
    for y in range(h):
        q.append((0, y))
        q.append((w - 1, y))

    while q:
        x, y = q.popleft()
        if (x, y) in visited or not (0 <= x < w and 0 <= y < h):
            continue
        visited.add((x, y))
        r, g, b, a = px[x, y]
        if is_removable_bg(r, g, b, a):
            px[x, y] = (0, 0, 0, 0)
            q.extend([(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)])

    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            L = lum((r, g, b))
            if L > 198 and abs(r - g) < 14 and abs(g - b) < 16:
                continue
            if b > r + 8 and b > g + 4 and 175 < L < 252:
                px[x, y] = (0, 0, 0, 0)

    bbox = im.getbbox()
    if not bbox:
        raise SystemExit("empty result")
    l, t, r, b = bbox
    pad = 10
    return im.crop((max(0, l - pad), max(0, t - pad), min(w, r + pad), min(h, b + pad)))


def upscale(im: Image.Image) -> Image.Image:
    long = max(im.size)
    if long >= TARGET_LONG_EDGE:
        return im
    scale = TARGET_LONG_EDGE / long
    return im.resize(
        (int(im.width * scale), int(im.height * scale)),
        Image.Resampling.LANCZOS,
    )


def main() -> None:
    src = find_src()
    with Image.open(src) as raw:
        print("source", src.name, raw.size)
        im = upscale(remove_bg(raw.copy()))

    OUT.parent.mkdir(parents=True, exist_ok=True)
    im.save(OUT, "PNG", compress_level=1, optimize=False)
    print("wrote", OUT.name, im.size, OUT.stat().st_size)


if __name__ == "__main__":
    main()
