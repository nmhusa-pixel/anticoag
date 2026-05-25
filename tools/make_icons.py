from pathlib import Path
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


def make_icon(size):
    blue = (36, 91, 143, 255)
    white = (255, 255, 255, 255)
    pale = (238, 244, 245, 255)
    teal = (15, 118, 110, 255)
    center = size / 2
    outer_r = size * 0.305
    inner_r = size * 0.23
    cross_half = size * 0.047
    cross_len = size * 0.211
    pixels = []

    for y in range(size):
        for x in range(size):
            dx = x + 0.5 - center
            dy = y + 0.5 - center
            dist = (dx * dx + dy * dy) ** 0.5
            color = blue
            if dist <= outer_r:
                color = white
            if dist <= inner_r:
                color = pale
            if abs(dx) <= cross_half and abs(dy) <= cross_len:
                color = teal
            if abs(dy) <= cross_half and abs(dx) <= cross_len:
                color = teal
            pixels.append(color)

    return png(size, size, pixels)


def make_maskable_icon(size):
    blue = (36, 91, 143, 255)
    white = (255, 255, 255, 255)
    pale = (238, 244, 245, 255)
    teal = (15, 118, 110, 255)

    center = size / 2
    outer_r = size * 0.25
    inner_r = size * 0.19
    cross_half = size * 0.039
    cross_len = size * 0.172
    pixels = []

    for y in range(size):
        for x in range(size):
            dx = x + 0.5 - center
            dy = y + 0.5 - center
            dist = (dx * dx + dy * dy) ** 0.5
            color = blue
            if dist <= outer_r:
                color = white
            if dist <= inner_r:
                color = pale
            if abs(dx) <= cross_half and abs(dy) <= cross_len:
                color = teal
            if abs(dy) <= cross_half and abs(dx) <= cross_len:
                color = teal
            pixels.append(color)

    return png(size, size, pixels)


def main():
    ICON_DIR.mkdir(parents=True, exist_ok=True)
    for size in (192, 512):
        (ICON_DIR / f"icon-{size}.png").write_bytes(make_icon(size))
        (ICON_DIR / f"icon-{size}-maskable.png").write_bytes(make_maskable_icon(size))
        (ICON_DIR / f"icon-{size}-v2.png").write_bytes(make_icon(size))
        (ICON_DIR / f"icon-{size}-maskable-v2.png").write_bytes(make_maskable_icon(size))


if __name__ == "__main__":
    main()
