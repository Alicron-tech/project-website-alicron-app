#!/usr/bin/env python3
"""Wireframe-mesh concept drawings of a fixed-wing drone (fal.ai flux/dev). Output: generated/sketches/grid-<n>.jpg"""
import json, os, time, urllib.request
KEY = os.environ["FAL_KEY"]
BASE = ("3D wireframe mesh render of a fixed-wing unmanned aircraft with a long straight wing, slim fuselage, twin tail booms and a rear pusher propeller, "
        "the whole surface described only by a dense polygon grid of thin uniform grey lines, quad mesh topology visible, transparent surfaces, "
        "no solid fill, no shading, no texture, pure white background, no text, no labels, no logos, CAD wireframe concept, clean and precise")
VARIANTS = {
 1: BASE + ", three-quarter view from above and behind, aircraft banking gently to the left",
 2: BASE + ", three-quarter view from above, the far wing tip cropped by the frame, medium-density mesh",
 3: BASE + ", isometric three-quarter view from the front, very fine dense mesh like a topographic grid",
 4: BASE + ", three-quarter view from above with the mesh fading and dissolving into scattered grid lines towards the wing tips",
 5: BASE + ", three-quarter rear view from slightly above, coarse low-polygon mesh with larger triangles",
 6: BASE + ", three-quarter view from above, mesh drawn as contour slices across the wing and fuselage like a lofted surface",
}
def submit(prompt):
    body = json.dumps({"prompt": prompt, "image_size": {"width": 1536, "height": 1152}, "num_inference_steps": 28, "guidance_scale": 3.5, "num_images": 1, "enable_safety_checker": True, "output_format": "jpeg"}).encode()
    req = urllib.request.Request("https://queue.fal.run/fal-ai/flux/dev", data=body, headers={"Authorization": "Key " + KEY, "Content-Type": "application/json"})
    return json.load(urllib.request.urlopen(req, timeout=60))
def get(url): return json.load(urllib.request.urlopen(urllib.request.Request(url, headers={"Authorization": "Key " + KEY}), timeout=60))
jobs = {k: submit(p) for k, p in VARIANTS.items() if not os.path.exists(f"sketches/grid-{k}.jpg")}
while jobs:
    for k, j in list(jobs.items()):
        st = get(j["status_url"])
        if st.get("status") == "COMPLETED":
            urllib.request.urlretrieve(get(j["response_url"])["images"][0]["url"], f"sketches/grid-{k}.jpg"); print("done", k, flush=True); del jobs[k]
        elif st.get("status") not in ("IN_QUEUE", "IN_PROGRESS"): print("failed", k, st); del jobs[k]
    time.sleep(4)
