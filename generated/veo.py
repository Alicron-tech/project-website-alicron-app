# Image-to-video on Google Veo 3.1 (fal.ai), 1080p, no audio. One clip per shot, all shots in parallel.
# Usage: source ~/.zshenv && python3 veo.py <shots.json> <keyframe dir> <output dir> <take> [shot ...]
# shots.json: {"name": ["keyframe.png", "4s"|"6s"|"8s", "motion prompt"], ...}
# Each clip is saved as <name>-take<take>.mp4 next to a .json with the request and the result.
import os, sys, json, time, urllib.request, mimetypes, concurrent.futures as cf

KEY = os.environ["FAL_KEY"]; H = {"Authorization": f"Key {KEY}", "Content-Type": "application/json"}
EP = "fal-ai/veo3.1/image-to-video"
REAL = " Photorealistic live-action documentary footage, natural daylight, realistic physics and scale, steady professional camera work."
NEG = ("text, subtitles, logos, watermark, brand emblems, cartoon, CGI look, distorted vehicle, warped hands, extra propellers, "
       "morphing objects, bending wings, deforming aircraft, rocket, flame, exhaust plume, vehicles reversing, flying backwards, "
       "flicker, jumping plants, popping vegetation, shifting rows, temporal artifacts")

def call(url, body=None):
    req = urllib.request.Request(url, data=json.dumps(body).encode() if body is not None else None, headers=H)
    return json.load(urllib.request.urlopen(req, timeout=120))

def upload(path):
    ct = mimetypes.guess_type(path)[0] or "image/png"
    r = call("https://rest.alpha.fal.ai/storage/upload/initiate?storage_type=fal-cdn-v3", {"content_type": ct, "file_name": os.path.basename(path)})
    urllib.request.urlopen(urllib.request.Request(r["upload_url"], data=open(path, "rb").read(), method="PUT", headers={"Content-Type": ct})).read()
    return r["file_url"]

def run(name, shot, kf, out, take):
    img, dur, prompt = shot; dst = f"{out}/{name}-take{take}.mp4"
    if os.path.exists(dst): return name, "exists"
    body = {"image_url": upload(f"{kf}/{img}"), "prompt": prompt + REAL, "negative_prompt": NEG, "duration": dur,
            "resolution": "1080p", "aspect_ratio": "16:9", "generate_audio": False}
    q = call(f"https://queue.fal.run/{EP}", body)
    for _ in range(360):                                  # up to an hour; stop on any terminal status
        time.sleep(10); s = call(q["status_url"])
        if s["status"] not in ("IN_QUEUE", "IN_PROGRESS"): break
    res = call(q["response_url"])
    urllib.request.urlretrieve(res["video"]["url"], dst)
    json.dump({"shot": name, "take": take, "model": EP, "keyframe": img, "body": {k: v for k, v in body.items() if k != "image_url"}, "result": res},
              open(dst[:-4] + ".json", "w"), indent=1)
    return name, dst

if __name__ == "__main__":
    shots = json.load(open(sys.argv[1])); kf, out, take = sys.argv[2], sys.argv[3], int(sys.argv[4]); names = sys.argv[5:] or list(shots)
    os.makedirs(out, exist_ok=True)
    with cf.ThreadPoolExecutor(8) as ex:
        fs = {ex.submit(run, n, shots[n], kf, out, take): n for n in names}
        for f in cf.as_completed(fs):
            try: print(*f.result(), flush=True)
            except Exception as e: print("ERR", fs[f], repr(e)[:200], (getattr(e, "read", lambda: b"")() or b"")[:300], flush=True)
