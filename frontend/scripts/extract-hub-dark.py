"""Remove flat dark-navy backdrop; keep the graphic. High-quality crop."""
from pathlib import Path
from collections import deque
from PIL import Image

SRC = Path(
    r"C:\Users\atcom\AppData\Roaming\Cursor\User\workspaceStorage"
    r"\40b744057ce8837be13ffa159e0be125\images"
    r"\image-8feec225-5703-4fe4-ae78-da280b5dc467.png"
)
OUT = Path(__file__).resolve().parents[1] / "public" / "solutions-hub-dark.png"
GEN = Path(
    r"C:\Users\atcom\.cursor\projects\c-Users-atcom-OneDrive-Desktop-Avere-f"
    r"\assets\solutions-hub-dark.png"
)


def lum(c):
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]


def is_navy_bg(r, g, b, ref, tol=28):
    """Backdrop: dark, slightly blue-ish, low saturation variance from corner refs."""
    L = lum((r, g, b))
    if L > 55:
        return False
    # match corner navy
    if all(abs(int(c) - int(rf)) <= tol for c, rf in zip((r, g, b), ref)):
        return True
    # generic deep navy / near-black plate (not mid-gray cube faces)
    if L < 42 and b >= r - 5 and b >= g - 5 and abs(r - g) < 18:
        return True
    return False


def remove_bg(path: Path) -> Image.Image:
    im = Image.open(path).convert("RGBA")
    w, h = im.size
    px = im.load()
    refs = [
        px[x, y][:3]
        for x, y in [
            (4, 4),
            (w - 5, 4),
            (4, h - 5),
            (w - 5, h - 5),
            (w // 2, 3),
            (3, h // 2),
            (w - 4, h // 2),
            (w // 2, h - 4),
        ]
    ]
    # use darkest cornerish ref
    ref = min(refs, key=lum)

    visited = set()
    q = deque([(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1), (w // 2, 0), (0, h // 2)])
    while q:
        x, y = q.popleft()
        if (x, y) in visited or not (0 <= x < w and 0 <= y < h):
            continue
        visited.add((x, y))
        r, g, b, a = px[x, y]
        if is_navy_bg(r, g, b, ref):
            px[x, y] = (0, 0, 0, 0)
            q.extend([(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)])

    # second pass: kill leftover navy speckles not connected (optional mild)
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            # isolated dark navy far from bright blue content: only if very close to ref
            if all(abs(int(c) - int(rf)) <= 18 for c, rf in zip((r, g, b), ref)) and lum((r, g, b)) < 38:
                # only if neighbor has transparency (edge leftover)
                for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < w and 0 <= ny < h and px[nx, ny][3] < 10:
                        px[x, y] = (0, 0, 0, 0)
                        break

    bbox = im.getbbox()
    if not bbox:
        raise SystemExit("empty after bg remove")
    l, t, r, b = bbox
    pad = 16
    im = im.crop((max(0, l - pad), max(0, t - pad), min(w, r + pad), min(h, b + pad)))

    # Upscale gently for retina if small
    if max(im.size) < 1000:
        scale = 1200 / max(im.size)
        im = im.resize(
            (int(im.width * scale), int(im.height * scale)),
            Image.Resampling.LANCZOS,
        )
    elif max(im.size) > 1600:
        scale = 1400 / max(im.size)
        im = im.resize(
            (int(im.width * scale), int(im.height * scale)),
            Image.Resampling.LANCZOS,
        )
    return im


def main():
    # Prefer user's photo (exact look); fall back to generated extract
    source = SRC if SRC.exists() else GEN
    print("source", source)
    out = remove_bg(source)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    out.save(OUT, "PNG", optimize=True)
    print("wrote", OUT, out.size, OUT.stat().st_size)


if __name__ == "__main__":
    main()
