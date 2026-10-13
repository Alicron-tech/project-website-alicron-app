# Company page map: real Sentinel-2 cloudless imagery around Alicante (EOX s2cloudless 2016, CC BY 4.0,
# "Sentinel-2 cloudless - https://s2maps.eu by EOX IT Services GmbH (Contains modified Copernicus Sentinel data 2016)"),
# styled as a survey / operations map with a graticule, range rings on Alicante and its coordinates.
# Usage: python3 map.py   -> map-dark.jpg, map-paper.jpg (2400 x 800)
import math, io, os, urllib.request
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont
OUT = os.path.dirname(os.path.abspath(__file__)); FM = "/var/www/project-website-alicron-app/generated/pipeline/fonts/GeistMono-Medium.ttf"
LAT, LON = 38.3452, -0.4810                     # Alicante, city centre
Z = 12; W, H = 2400, 800; CX, CY = 0.56, 0.52   # where Alicante sits in the frame (fraction of width / height)
def px(lat, lon, z=Z):
    n = 256 * 2 ** z
    return (lon + 180) / 360 * n, (1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * n
def ll(x, y, z=Z):
    n = 256 * 2 ** z
    return math.degrees(math.atan(math.sinh(math.pi * (1 - 2 * y / n)))), x / n * 360 - 180
ax, ay = px(LAT, LON); x0, y0 = ax - W * CX, ay - H * CY
canvas = Image.new("RGB", (W, H))
for tx in range(int(x0 // 256), int((x0 + W) // 256) + 1):
    for ty in range(int(y0 // 256), int((y0 + H) // 256) + 1):
        cache = f"/tmp/s2-{Z}-{tx}-{ty}.jpg"
        if not os.path.exists(cache):
            u = f"https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless_3857/default/g/{Z}/{ty}/{tx}.jpg"
            open(cache, "wb").write(urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": "alicron-map/1.0"}), timeout=30).read())
        canvas.paste(Image.open(cache).convert("RGB"), (int(tx * 256 - x0), int(ty * 256 - y0)))
img = np.asarray(canvas).astype(np.float32)
f22, f18, f28 = ImageFont.truetype(FM, 22), ImageFont.truetype(FM, 18), ImageFont.truetype(FM, 28)
def dms(v, pos, neg):
    h = pos if v >= 0 else neg; t = round(abs(v) * 3600)          # whole seconds, so 59.99″ carries into the minute
    return f"{t // 3600}°{t % 3600 // 60:02d}′{t % 60:02d}″ {h}"
def overlay(base, ink, faint, accent, label_bg):
    im = Image.fromarray(base).convert("RGBA"); ov = Image.new("RGBA", im.size, (0, 0, 0, 0)); d = ImageDraw.Draw(ov)
    # graticule every 0.1°, labels on the top and left edges
    lat_top, lon_left = ll(x0, y0); lat_bot, lon_right = ll(x0 + W, y0 + H)
    for k in range(math.floor(lon_left * 20), math.ceil(lon_right * 20) + 1):
        x = px(LAT, k / 20)[0] - x0; d.line([(x, 0), (x, H)], fill=faint, width=1); d.text((x + 6, 8), dms(k / 20, "E", "W"), font=f18, fill=ink)
    for k in range(math.floor(lat_bot * 20), math.ceil(lat_top * 20) + 1):
        y = px(k / 20, LON)[1] - y0; d.line([(0, y), (W, y)], fill=faint, width=1); d.text((8, y + 6), dms(k / 20, "N", "S"), font=f18, fill=ink)
    cx, cy = ax - x0, ay - y0
    # range rings 5, 10, 20 km
    mpp = 156543.03392 * math.cos(math.radians(LAT)) / 2 ** Z
    for km in (2, 5, 10):
        r = km * 1000 / mpp; d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=faint, width=1); d.text((cx - r * 0.71 - 70, cy + r * 0.71 + 4), f"{km} KM", font=f18, fill=ink)
    # target circle and crosshair
    d.ellipse([cx - 34, cy - 34, cx + 34, cy + 34], outline=accent, width=3)
    for a, b in (((cx - 60, cy), (cx - 40, cy)), ((cx + 40, cy), (cx + 60, cy)), ((cx, cy - 60), (cx, cy - 40)), ((cx, cy + 40), (cx, cy + 60))): d.line([a, b], fill=accent, width=3)
    d.ellipse([cx - 4, cy - 4, cx + 4, cy + 4], fill=accent)
    # label
    lx, ly = cx + 90, cy - 118
    d.line([(cx + 26, cy - 26), (lx - 8, ly + 58)], fill=accent, width=2)
    d.rectangle([lx - 10, ly - 10, lx + 430, ly + 92], fill=label_bg)
    d.text((lx, ly), "ALICANTE · BASE", font=f28, fill=ink); d.text((lx, ly + 40), f"{dms(LAT, 'N', 'S')}   {dms(LON, 'E', 'W')}", font=f22, fill=accent)
    d.text((lx, ly + 66), f"{LAT:.4f}, {LON:.4f}", font=f18, fill=ink)
    # scale bar 10 km and north
    sb = 5000 / mpp; bx, by = W - 80 - sb, H - 48
    d.line([(bx, by), (bx + sb, by)], fill=ink, width=3); d.line([(bx, by - 8), (bx, by + 8)], fill=ink, width=2); d.line([(bx + sb, by - 8), (bx + sb, by + 8)], fill=ink, width=2)
    d.text((bx, by - 34), "5 KM", font=f18, fill=ink); d.text((W - 60, 24), "N ↑", font=f22, fill=ink)
    d.text((W - 640, H - 24), "IMAGERY: SENTINEL-2 CLOUDLESS 2016 · EOX · COPERNICUS", font=ImageFont.truetype(FM, 14), fill=faint)
    return Image.alpha_composite(im, ov).convert("RGB")
# dark: desaturated imagery, sea pushed towards near-black, cool tint
g = cv2.cvtColor(img.astype(np.uint8), cv2.COLOR_RGB2GRAY).astype(np.float32)
dark = np.clip(np.stack([g * 0.62, g * 0.68, g * 0.74], 2) - 18, 0, 255).astype(np.uint8)
overlay(dark, (240, 240, 235, 235), (240, 240, 235, 70), (254, 215, 77, 255), (5, 5, 6, 190)).save(f"{OUT}/map-dark.jpg", quality=92)
# paper: imagery as a soft greyscale print on the site's paper colour
paper = np.array([255, 254, 248], np.float32); t = (g / 255.0)[..., None] * 0.55 + 0.45
p2 = np.clip(paper * t, 0, 255).astype(np.uint8)
overlay(p2, (20, 20, 22, 235), (20, 20, 22, 60), (200, 120, 0, 255), (255, 254, 248, 215)).save(f"{OUT}/map-paper.jpg", quality=92)
print("ok")
