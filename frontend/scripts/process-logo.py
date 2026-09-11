"""
Clean white-bg removal with aggressive fringe kill for dark UI.
"""
from PIL import Image

ORIGINAL = r'C:\Users\atcom\OneDrive\Desktop\Avere-f\frontend\public\logo-original.png'
OUT_LIGHT = r'C:\Users\atcom\OneDrive\Desktop\Avere-f\frontend\public\logo.png'
OUT_DARK = r'C:\Users\atcom\OneDrive\Desktop\Avere-f\frontend\public\logo-dark.png'

SCALE = 3
TEXT_START_X0 = 74


def clamp(v):
    return max(0, min(255, int(round(v))))


def luminance(r, g, b):
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def is_blue_ink(r, g, b):
    if b >= r + 14 and b >= g + 8 and luminance(r, g, b) < 200:
        return True
    return False


def lift_dark_icon(r, g, b):
    lum = luminance(r, g, b)
    if lum >= 70:
        return r, g, b
    target = (92, 28, 42)
    t = max(0.0, min(1.0, (70 - lum) / 70.0)) * 0.85
    return (
        clamp(r * (1 - t) + target[0] * t),
        clamp(g * (1 - t) + target[1] * t),
        clamp(b * (1 - t) + target[2] * t),
    )


def remove_white(img: Image.Image, for_dark: bool) -> Image.Image:
    w, h = img.size
    src = img.load()
    out = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    dst = out.load()
    text_x = TEXT_START_X0 * SCALE

    for y in range(h):
        for x in range(w):
            r, g, b, a0 = src[x, y]
            if a0 == 0:
                continue

            mn = min(r, g, b)
            mx = max(r, g, b)
            sat = mx - mn
            lum = luminance(r, g, b)

            if mn >= 248:
                continue
            if lum >= 245 and sat <= 20:
                continue

            alpha = (248 - mn) / 248.0
            alpha = max(0.0, min(1.0, alpha))

            if alpha < 0.18:
                continue
            if alpha < 0.35 and lum > 210 and sat < 45:
                continue
            if alpha < 0.45 and mn > 200:
                continue

            if alpha >= 0.999:
                fr, fg, fb = r, g, b
            else:
                inv = 1.0 - alpha
                fr = clamp((r - 255 * inv) / alpha)
                fg = clamp((g - 255 * inv) / alpha)
                fb = clamp((b - 255 * inv) / alpha)

            fl = luminance(fr, fg, fb)
            fs = max(fr, fg, fb) - min(fr, fg, fb)
            if fl > 200 and fs < 40:
                continue
            if fl > 175 and fs < 25 and alpha < 0.85:
                continue
            if fr > 200 and fg > 160 and fb > 160 and fs < 70 and alpha < 0.9:
                continue
            if min(fr, fg, fb) > 170 and alpha < 0.75:
                continue

            a = clamp(alpha * 255)
            if a < 140 and fl > 150 and fs < 50:
                continue

            if for_dark and (x >= text_x or is_blue_ink(fr, fg, fb)):
                if fl > 235:
                    continue
                dst[x, y] = (255, 255, 255, a)
                continue

            if for_dark:
                fr, fg, fb = lift_dark_icon(fr, fg, fb)

            dst[x, y] = (fr, fg, fb, a)

    return out


def kill_residual_halo(img: Image.Image, for_dark: bool) -> Image.Image:
    """Remove bright fringe on icon only — do not eat white text AA."""
    w, h = img.size
    px = img.load()
    out = img.copy()
    dst = out.load()
    text_x = TEXT_START_X0 * SCALE

    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            if for_dark and x >= text_x:
                continue
            if for_dark and r > 250 and g > 250 and b > 250:
                continue

            lum = luminance(r, g, b)
            sat = max(r, g, b) - min(r, g, b)

            if x < text_x:
                # Any pale / whitish pixel on icon = halo (real red has low G/B)
                if min(r, g, b) > 130:
                    dst[x, y] = (0, 0, 0, 0)
                    continue
                if lum >= 165 and sat <= 85:
                    dst[x, y] = (0, 0, 0, 0)
                    continue
                if g > 140 and b > 140 and r > 160:
                    dst[x, y] = (0, 0, 0, 0)
                    continue
                if a < 180 and lum >= 140 and sat <= 90:
                    dst[x, y] = (0, 0, 0, 0)
                    continue
                if a < 120 and lum > 100:
                    dst[x, y] = (0, 0, 0, 0)
                    continue

                if lum > 140 and a < 220:
                    empty = 0
                    solid = 0
                    for dy in (-1, 0, 1):
                        for dx in (-1, 0, 1):
                            if dx == 0 and dy == 0:
                                continue
                            nx, ny = x + dx, y + dy
                            if nx < 0 or ny < 0 or nx >= w or ny >= h:
                                empty += 1
                                continue
                            na = px[nx, ny][3]
                            if na < 30:
                                empty += 1
                            elif na > 180:
                                solid += 1
                    if empty >= 4 and solid <= 3:
                        dst[x, y] = (0, 0, 0, 0)

    return out


def autocrop(img, pad=4):
    bbox = img.getbbox()
    if not bbox:
        return img
    l, t, r, b = bbox
    return img.crop((
        max(0, l - pad),
        max(0, t - pad),
        min(img.width, r + pad),
        min(img.height, b + pad),
    ))


src = Image.open(ORIGINAL).convert('RGBA')
hi = src.resize((src.width * SCALE, src.height * SCALE), Image.Resampling.LANCZOS)

light = autocrop(kill_residual_halo(remove_white(hi, False), False))
dark = autocrop(kill_residual_halo(remove_white(hi, True), True))

light.save(OUT_LIGHT, 'PNG', optimize=True)
dark.save(OUT_DARK, 'PNG', optimize=True)
print('ok', light.size, dark.size)
