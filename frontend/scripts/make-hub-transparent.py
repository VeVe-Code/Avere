"""Make hub PNGs transparent by clearing near-corner background colors."""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1] / "public"
FILES = ["solutions-hub-light.png", "solutions-hub-dark.png"]


def sample_corners(im, inset=8):
    w, h = im.size
    pts = [
        (inset, inset),
        (w - inset - 1, inset),
        (inset, h - inset - 1),
        (w - inset - 1, h - inset - 1),
    ]
    return [im.getpixel(p)[:3] for p in pts]


def near(c, ref, tol):
    return all(abs(int(c[i]) - int(ref[i])) <= tol for i in range(3))


def clear_bg(path: Path, tol=28):
    im = Image.open(path).convert("RGBA")
    refs = sample_corners(im)
    # also sample a few edge midpoints
    w, h = im.size
    refs += [
        im.getpixel((w // 2, 6))[:3],
        im.getpixel((6, h // 2))[:3],
        im.getpixel((w - 7, h // 2))[:3],
        im.getpixel((w // 2, h - 7))[:3],
    ]
    px = im.load()
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if any(near((r, g, b), ref, tol) for ref in refs):
                px[x, y] = (r, g, b, 0)
    # flood-fill from corners for leftovers that match bg continuously
    from collections import deque

    visited = set()
    q = deque()
    for sx, sy in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]:
        q.append((sx, sy))
    while q:
        x, y = q.popleft()
        if (x, y) in visited or x < 0 or y < 0 or x >= w or y >= h:
            continue
        visited.add((x, y))
        r, g, b, a = px[x, y]
        if a == 0 or any(near((r, g, b), ref, tol + 8) for ref in refs):
            px[x, y] = (r, g, b, 0)
            q.extend([(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)])
        # stop when hitting non-bg
    # trim transparent margins
    bbox = im.getbbox()
    if bbox:
        # small padding
        pad = 8
        l, t, r, b = bbox
        l = max(0, l - pad)
        t = max(0, t - pad)
        r = min(w, r + pad)
        b = min(h, b + pad)
        im = im.crop((l, t, r, b))
    out = path
    im.save(out, "PNG", optimize=True)
    print(f"ok {path.name} -> {im.size}")


def main():
    for name in FILES:
        p = ROOT / name
        if p.exists():
            clear_bg(p)


if __name__ == "__main__":
    main()
