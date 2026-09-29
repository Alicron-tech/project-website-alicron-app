#!/usr/bin/env python3
"""Fixed-wing drone sketch variants for the page backgrounds (fal.ai flux/dev). Output: generated/sketches/raw-<n>.jpg"""
import json, os, time, urllib.request
KEY = os.environ["FAL_KEY"]
BASE = ("technical line drawing of a fixed-wing unmanned aircraft with a 2 metre straight wing, twin tail booms and a pusher propeller, "
        "thin clean black ink lines on a pure white background, no shading, no fill, no text, no labels, no numbers, no logos, "
        "engineering illustration, minimal, precise")
VARIANTS = {
 1: BASE + ", three-quarter perspective view from above, wireframe with visible construction lines and a few faint geometric circles and arcs",
 2: BASE + ", orthographic top view, symmetrical, with light construction guide lines and centre line",
 3: BASE + ", side elevation view, skeleton structure showing ribs and spars, blueprint drafting style",
 4: BASE + ", isometric view, low-polygon wireframe made of triangles and straight edges, geometric",
 5: BASE + ", front three-quarter view banking slightly, sparse sketch with a few pencil construction strokes and a large faint circle behind",
 6: BASE + ", exploded view with the wing lifted slightly above the fuselage, thin dashed guide lines between parts, draftsman style",
}
def submit(prompt):
    body = json.dumps({"prompt": prompt, "image_size": {"width": 1536, "height": 1152}, "num_inference_steps": 28, "guidance_scale": 3.5, "num_images": 1, "enable_safety_checker": True, "output_format": "jpeg"}).encode()
    req = urllib.request.Request("https://queue.fal.run/fal-ai/flux/dev", data=body, headers={"Authorization": "Key " + KEY, "Content-Type": "application/json"})
    return json.load(urllib.request.urlopen(req, timeout=60))
def get(url): return json.load(urllib.request.urlopen(urllib.request.Request(url, headers={"Authorization": "Key " + KEY}), timeout=60))
jobs = {k: submit(p) for k, p in VARIANTS.items() if not os.path.exists(f"sketches/raw-{k}.jpg")}
while jobs:
    for k, j in list(jobs.items()):
        st = get(j["status_url"])
        if st.get("status") == "COMPLETED":
            urllib.request.urlretrieve(get(j["response_url"])["images"][0]["url"], f"sketches/raw-{k}.jpg"); print("done", k, flush=True); del jobs[k]
        elif st.get("status") not in ("IN_QUEUE", "IN_PROGRESS"): print("failed", k, st); del jobs[k]
    time.sleep(4)
