# Company page map, Varda-style: a duotone relief of the Alicante area built from real elevation (AWS Terrain Tiles,
# Terrarium encoding; sources incl. SRTM/Copernicus via Mapzen, attribution "Mapzen, AWS Open Data") with a touch of
# Sentinel-2 cloudless texture, coloured from deep blue (shade) to warm orange (sunlit slopes). Alicante is marked
# with a crosshair, range rings and its coordinates. The image is rendered larger than the 3:1 frame so the page can
# drift it slowly back and forth (CSS) without ever showing an edge.
import math, os, urllib.request, io
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont
OUT = os.path.dirname(os.path.abspath(__file__)); FM = "/var/www/project-website-alicron-app/generated/pipeline/fonts/GeistMono-Medium.ttf"
LAT, LON = 38.3452, -0.4810
import sys
STYLE = sys.argv[1] if len(sys.argv) > 1 else 'dark'
Z = 13; W, H = 3360, 1120; CX, CY = 0.60, 0.52          # canvas is 112 % of a 3000 x 1000 frame
def px(lat, lon):
    n = 256 * 2 ** Z; return (lon + 180) / 360 * n, (1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * n
ax, ay = px(LAT, LON); x0, y0 = ax - W * CX, ay - H * CY
def mosaic(url, decode):
    c = None
    for tx in range(int(x0 // 256), int((x0 + W) // 256) + 1):
        for ty in range(int(y0 // 256), int((y0 + H) // 256) + 1):
            k = f"/tmp/{abs(hash(url)) % 10**8}-{Z}-{tx}-{ty}"
            if not os.path.exists(k):
                open(k, "wb").write(urllib.request.urlopen(urllib.request.Request(url.format(z=Z, x=tx, y=ty), headers={"User-Agent": "alicron-map/1.0"}), timeout=30).read())
            a = decode(Image.open(k))
            if c is None: c = np.zeros((H, W) + a.shape[2:], np.float32)
            xx, yy = int(tx * 256 - x0), int(ty * 256 - y0)
            sx0, sy0 = max(0, -xx), max(0, -yy); dx0, dy0 = max(0, xx), max(0, yy)
            w = min(256 - sx0, W - dx0); h = min(256 - sy0, H - dy0)
            if w > 0 and h > 0: c[dy0:dy0 + h, dx0:dx0 + w] = a[sy0:sy0 + h, sx0:sx0 + w]
    return c
elev = mosaic("https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png",
              lambda im: (lambda a: a[..., 0] * 256 + a[..., 1] + a[..., 2] / 256 - 32768)(np.asarray(im.convert("RGB")).astype(np.float32)))
sat = mosaic("https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless_3857/default/g/{z}/{y}/{x}.jpg",
             lambda im: np.asarray(im.convert("L")).astype(np.float32)[..., None])[..., 0] / 255
# hillshade: multi-directional, exaggerated, metres per pixel at this latitude and zoom
mpp = 156543.03392 * math.cos(math.radians(LAT)) / 2 ** Z
e = cv2.GaussianBlur(elev, (0, 0), 1.0) * 3.0
gy, gx = np.gradient(e, mpp)
slope = np.arctan(np.hypot(gx, gy)); aspect = np.arctan2(-gx, gy)
def shade(az, alt):
    az, alt = math.radians(az), math.radians(alt)
    return np.clip(np.sin(alt) * np.cos(slope) + np.cos(alt) * np.sin(slope) * np.cos(az - aspect), 0, 1)
hs = 0.55 * shade(315, 30) + 0.25 * shade(270, 35) + 0.20 * shade(0, 45)
land = elev > 0.5
tex = cv2.GaussianBlur(sat, (0, 0), 0.8)
detail = np.clip(0.5 + 2.5 * (tex - cv2.GaussianBlur(tex, (0, 0), 6)), 0, 1)   # local texture: fields, gullies, towns
mix = (0.62, 0.18, 0.20) if STYLE == 'dark' else (0.80, 0.12, 0.08)   # the light map reads busy with much fine texture
v = np.where(land, mix[0] * hs + mix[1] * tex + mix[2] * detail, 0.10 + 0.05 * tex)            # sea stays deep and quiet
v = np.clip((v - np.percentile(v[land], 2)) / (np.percentile(v[land], 99.5) - np.percentile(v[land], 2)), 0, 1)
v = np.where(land, np.power(v, 1.1), 0.06 + 0.06 * tex)          # gamma pushes mid-tones to blue, orange stays on the lit ridges
# duotone ramp: deep blue -> mid blue -> warm orange (Varda-like, tuned to the site's amber)
PAL = {  # ALICRON tokens: void #050506, ink-600 #292e3a, ink-500 #4a4947, paper #fffef8, amber-400 #fbbf24, amber-300 #fed74d
  'dark':  dict(stops=[(0.00, (6, 7, 9)), (0.35, (22, 25, 32)), (0.55, (41, 46, 58)), (0.70, (96, 84, 52)), (0.84, (196, 150, 40)), (1.00, (254, 215, 77))], sea=(5, 5, 6), ink=(238, 236, 228), lab=(5, 5, 6)),
  'light': dict(stops=[(0.00, (138, 145, 158)), (0.35, (190, 195, 204)), (0.55, (230, 231, 230)), (0.70, (246, 241, 226)), (0.84, (250, 216, 128)), (1.00, (251, 191, 36))], sea=(250, 249, 243), ink=(41, 46, 58), lab=(255, 254, 248)),
  'paper': dict(stops=[(0.00, (74, 73, 71)), (0.45, (150, 148, 140)), (0.66, (236, 234, 224)), (0.84, (251, 191, 36)), (1.00, (254, 215, 77))], sea=(245, 244, 237), ink=(22, 26, 30), lab=(255, 254, 248)),
}[STYLE]
stops = PAL['stops']
xs = [s[0] for s in stops]; rgb = np.stack([np.interp(v, xs, [s[1][k] for s in stops]) for k in range(3)], -1)
rgb = np.where(land[..., None], rgb, np.array(PAL['sea'], np.float32) + (8 if STYLE == 'dark' else -4) * tex[..., None])   # darker, quiet sea keeps the coast crisp
grain = np.random.default_rng(3).normal(0, 3.0, rgb.shape[:2])[..., None]
img = Image.fromarray(np.clip(rgb + grain, 0, 255).astype(np.uint8))
img.save(f"{OUT}/map-terrain-{STYLE}.jpg", quality=90)   # the moving layer: terrain only
# fixed layer: the page shows the image at 112% of the frame (inset -6%), so the frame at rest is the centre 100/112 of it.
# Rings, crosshair, label and credit also go on a transparent overlay of exactly that region (for a drifting-terrain variant);
# the site uses the flat composite map-relief-<style>.jpg, static, with the CSS grid on top.
FX, FY = round(W * 6 / 112), round(H * 6 / 112); FW, FH = round(W * 100 / 112), round(H * 100 / 112)
terrain = img; img = Image.new("RGBA", (FW, FH), (0, 0, 0, 0)); ax, ay = ax - FX, ay - FY; W = FW; H = FH
d = ImageDraw.Draw(img, "RGBA"); f30, f38, f52 = (ImageFont.truetype(FM, s) for s in (30, 38, 52))
ink = PAL['ink'] + (240,); acc = (254, 215, 77, 255) if STYLE == 'dark' else (41, 46, 58, 255)
cx, cy = ax - x0, ay - y0
for km in (2, 5, 10):   # rings and their labels strong enough to read at page size (the image shows at about 0.37x)
    r = km * 1000 / mpp; d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=PAL['ink'] + (185,), width=4)
    d.text((cx - r * 0.71 - 110, cy + r * 0.71 + 8), f"{km} KM", font=f30, fill=PAL['ink'] + (235,))
d.ellipse([cx - 48, cy - 48, cx + 48, cy + 48], outline=acc, width=6)
for a, b in (((cx - 84, cy), (cx - 56, cy)), ((cx + 56, cy), (cx + 84, cy)), ((cx, cy - 84), (cx, cy - 56)), ((cx, cy + 56), (cx, cy + 84))): d.line([a, b], fill=acc, width=6)
d.ellipse([cx - 7, cy - 7, cx + 7, cy + 7], fill=acc)
# callout: larger type, generous padding, a hairline amber frame
lines = [("ALICANTE · BASE", f52, ink), ("38°20′43″ N   0°28′52″ W", f38, acc), ("38.3452, -0.4810", f30, ink)]
pad, gap = 40, 18
tw = max(d.textbbox((0, 0), s, font=f)[2] for s, f, _ in lines); th = sum(d.textbbox((0, 0), s, font=f)[3] for s, f, _ in lines) + gap * 2
bx, by = cx + 170, cy - 140 - (th + 2 * pad)
d.line([(cx + 36, cy - 36), (bx, by + th + 2 * pad)], fill=acc, width=4)
d.rectangle([bx, by, bx + tw + 2 * pad, by + th + 2 * pad], fill=PAL['lab'] + (225,), outline=acc[:3] + (200,), width=2)
y = by + pad
for s, f, c in lines:
    d.text((bx + pad, y), s, font=f, fill=c); y += d.textbbox((0, 0), s, font=f)[3] + gap
d.text((W - 1500, H - 44), "RELIEF: AWS TERRAIN TILES (MAPZEN) · IMAGERY: SENTINEL-2 CLOUDLESS · EOX · COPERNICUS", font=ImageFont.truetype(FM, 20), fill=PAL['ink'] + (120,))
img.save(f"{OUT}/map-overlay-{STYLE}.png", optimize=True)
comp = terrain.convert("RGBA"); comp.alpha_composite(img, (FX, FY)); comp.convert("RGB").save(f"{OUT}/map-relief-{STYLE}.jpg", quality=90)   # flat preview
print("ok", terrain.size, img.size)
