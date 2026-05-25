from pathlib import Path
import math
import struct
import zlib


ROOT = Path(__file__).resolve().parents[1]
ICON_DIR = ROOT / "assets" / "icons"


def chunk(kind, data):
    body = kind + data
    return struct.pack(">I", len(data)) + body + struct.pack(">I", zlib.crc32(body) & 0xFFFFFFFF)


def png(width, height, pixels):
    raw = bytearray()
    for y in range(height):
        raw.append(0)
        row_start = y * width
        for x in range(width):
            raw.extend(pixels[row_start + x])

    return b"".join([
        b"\x89PNG\r\n\x1a\n",
        chunk(b"IHDR", struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)),
        chunk(b"IDAT", zlib.compress(bytes(raw), 9)),
        chunk(b"IEND", b""),
    ])


def blend(base, overlay):
    alpha = overlay[3] / 255
    return tuple(int(overlay[i] * alpha + base[i] * (1 - alpha)) for i in range(3)) + (255,)


def in_rotated_rect(x, y, cx, cy, width, height, angle):
    ca = math.cos(angle)
    sa = math.sin(angle)
    dx = x - cx
    dy = y - cy
    rx = dx * ca + dy * sa
    ry = -dx * sa + dy * ca
    return abs(rx) <= width / 2 and abs(ry) <= height / 2


def make_icon(size, maskable=False):
    blue = (36, 91, 143, 255)
    white = (255, 255, 255, 255)
    pale = (238, 244, 245, 255)
    teal = (15, 118, 110, 255)
    steel = (216, 224, 229, 255)
    ink = (23, 32, 42, 255)
    red = (176, 42, 55, 255)
    highlight = (255, 255, 255, 140)

    center = size / 2
    panel_r = size * (0.35 if maskable else 0.39)
    angle = -math.pi / 4
    pixels = []

    for y in range(size):
        for x in range(size):
            px = x + 0.5
            py = y + 0.5
            dx = px - center
            dy = py - center
            dist = (dx * dx + dy * dy) ** 0.5
            color = blue

            if dist <= panel_r:
                color = white

            if in_rotated_rect(px, py, size * 0.48, size * 0.53, size * 0.43, size * 0.075, angle):
                color = steel
            if in_rotated_rect(px, py, size * 0.48, size * 0.53, size * 0.34, size * 0.035, angle):
                color = pale

            if in_rotated_rect(px, py, size * 0.30, size * 0.71, size * 0.12, size * 0.075, angle):
                color = teal
            if in_rotated_rect(px, py, size * 0.24, size * 0.78, size * 0.16, size * 0.052, angle):
                color = teal

            if in_rotated_rect(px, py, size * 0.69, size * 0.36, size * 0.19, size * 0.035, angle):
                color = ink
            if in_rotated_rect(px, py, size * 0.75, size * 0.30, size * 0.11, size * 0.018, angle):
                color = ink

            drop_cx = size * 0.78
            drop_cy = size * 0.56
            drop_r = size * 0.077
            drop_dx = px - drop_cx
            drop_dy = py - drop_cy
            drop_dist = (drop_dx * drop_dx + drop_dy * drop_dy) ** 0.5
            if drop_dist <= drop_r or (abs(drop_dx) <= drop_r * 0.42 and -drop_r * 1.35 <= drop_dy <= 0):
                color = red
            if (px - size * 0.755) ** 2 + (py - size * 0.535) ** 2 <= (size * 0.018) ** 2:
                color = blend(color, highlight)

            pixels.append(color)

    return png(size, size, pixels)


def main():
    ICON_DIR.mkdir(parents=True, exist_ok=True)
    for size in (192, 512):
        (ICON_DIR / f"icon-{size}.png").write_bytes(make_icon(size))
        (ICON_DIR / f"icon-{size}-maskable.png").write_bytes(make_icon(size, maskable=True))
        (ICON_DIR / f"icon-{size}-v2.png").write_bytes(make_icon(size))
        (ICON_DIR / f"icon-{size}-maskable-v2.png").write_bytes(make_icon(size, maskable=True))
        (ICON_DIR / f"icon-{size}-v3.png").write_bytes(make_icon(size))
        (ICON_DIR / f"icon-{size}-maskable-v3.png").write_bytes(make_icon(size, maskable=True))


if __name__ == "__main__":
    main()
