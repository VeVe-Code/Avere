"""Crop light hub tightly; remove flat white plate."""
from pathlib import Path
from collections import deque
from PIL import Image

SRC = Path(
    r"C:\Users\atcom\AppData\Roaming\Cursor\User\workspaceStorage"
    r"\40b744057ce8837be13ffa159e0be125\images"
    r"\image-488b8653-3bba-4d90-a39e-8daeca0a530d.png"
)
FALLBACK = Path(__file__).resolve().parents[1] / "public" / "solutions-hub-light.png"
OUT = Path(__file__).resolve().parents[1] / "public" / "solutions-hub-light.png"


def lum(c):
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]


def main():
    path = SRC if SRC.exists() else FALLBACK
    im = Image.open(path).convert("RGBA")
    w, h = im.size
    px = im.load()

    visited = set()
    q = deque([(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1), (w // 2, 0), (0, h // 2)])
    while q:
        x, y = q.popleft()
        if (x, y) in visited or not (0 <= x < w and 0 <= y < h):
            continue
        visited.add((x, y))
        r, g, b, a = px[x, y]
        L = lum((r, g, b))
        # flat white / off-white page plate
        if a == 0 or (L > 232 and abs(r - g) < 14 and abs(g - b) < 14):
            px[x, y] = (0, 0, 0, 0)
            q.extend([(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)])

    bbox = im.getbbox()
    if not bbox:
        raise SystemExit("empty")
    l, t, r, b = bbox
    pad = 10
    im = im.crop((max(0, l - pad), max(0, t - pad), min(w, r + pad), min(h, b + pad)))

    # upscale for crisp display
    long = max(im.size)
    if long < 1200:
        scale = 1300 / long
        im = im.resize((int(im.width * scale), int(im.height * scale)), Image.Resampling.LANCZOS)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    im.save(OUT, "PNG", optimize=True)
    print("wrote", OUT, im.size, OUT.stat().st_size)


if __name__ == "__main__":
    main()
