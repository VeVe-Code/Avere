from pathlib import Path
from PIL import Image
from collections import deque

PUBLIC = Path(__file__).resolve().parents[1] / "public"


def lum(c):
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]


def clean_dark(path: Path):
    im = Image.open(path).convert("RGBA")
    w, h = im.size
    px = im.load()

    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a < 8:
                px[x, y] = (0, 0, 0, 0)
                continue
            L = lum((r, g, b))
            # keep vivid blue glow
            if b > r + 25 and b > g + 15 and b > 100:
                continue
            # kill neutral checkerboard / white halo
            if abs(r - g) < 18 and abs(g - b) < 18 and abs(r - b) < 18 and L > 85:
                px[x, y] = (0, 0, 0, 0)
                continue
            if L > 175 and abs(r - g) < 25 and abs(g - b) < 25:
                px[x, y] = (0, 0, 0, 0)

    visited = set()
    q = deque([(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)])
    while q:
        x, y = q.popleft()
        if (x, y) in visited or not (0 <= x < w and 0 <= y < h):
            continue
        visited.add((x, y))
        r, g, b, a = px[x, y]
        L = lum((r, g, b))
        if a == 0 or (L < 40 and abs(r - g) < 14 and abs(g - b) < 14):
            px[x, y] = (0, 0, 0, 0)
            q.extend([(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)])

    bbox = im.getbbox()
    if bbox:
        l, t, r, b = bbox
        pad = 8
        im = im.crop((max(0, l - pad), max(0, t - pad), min(w, r + pad), min(h, b + pad)))
    im.save(path, "PNG", optimize=True)
    print("dark", im.size, path.stat().st_size)


def clean_light(path: Path):
    im = Image.open(path).convert("RGBA")
    w, h = im.size
    px = im.load()
    visited = set()
    q = deque([(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)])
    while q:
        x, y = q.popleft()
        if (x, y) in visited or not (0 <= x < w and 0 <= y < h):
            continue
        visited.add((x, y))
        r, g, b, a = px[x, y]
        L = lum((r, g, b))
        if a == 0 or (L > 238 and abs(r - g) < 12 and abs(g - b) < 12):
            px[x, y] = (0, 0, 0, 0)
            q.extend([(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)])
    bbox = im.getbbox()
    if bbox:
        l, t, r, b = bbox
        pad = 8
        im = im.crop((max(0, l - pad), max(0, t - pad), min(w, r + pad), min(h, b + pad)))
    im.save(path, "PNG", optimize=True)
    print("light", im.size, path.stat().st_size)


if __name__ == "__main__":
    clean_dark(PUBLIC / "solutions-hub-dark.png")
    clean_light(PUBLIC / "solutions-hub-light.png")
