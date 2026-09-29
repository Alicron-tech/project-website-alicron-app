#!/usr/bin/env python3
"""Generate website imagery on fal.ai (flux/dev). Output: generated/img/<key>.jpg. Reads FAL_KEY from the environment."""
import json, os, sys, time, urllib.request
KEY = os.environ["FAL_KEY"]
STYLE = ("photorealistic, cinematic documentary photography, natural light, muted earthy palette, shallow depth of field, "
         "35mm lens, no text, no logos, no flags, no insignia, no weapons, no watermark, high detail")
PROMPTS = {
 "hero-pipeline":   "wide shot at dawn in the dry hills of Alicante Spain, a white pickup truck parked on a gravel track, a rugged black case open on the tailgate, a large black carbon quadcopter drone with a flat white satellite antenna on top lifting off, an oil pipeline running along the valley into the distance",
 "case-pipeline":   "a black carbon-fibre quadcopter drone with a flat white satellite terminal on top hovering ten metres above a steel pipeline crossing arid Mediterranean scrubland, morning light, seen from slightly above",
 "hero-fixedwing":  "a small grey electric fixed-wing drone with a 1.8 metre wingspan flying low over rows of olive trees and wheat fields in Spain at golden hour, aerial perspective, long shadows",
 "case-agri":       "aerial view of a small grey fixed-wing drone gliding over patchwork farmland with a multispectral camera pod under the fuselage, late afternoon, warm light",
 "case-powerline":  "a black quadcopter drone inspecting a high-voltage transmission tower against an overcast sky, insulators and cables in sharp focus, drone small in frame",
 "case-emergency":  "a black quadcopter drone hovering at dusk over a burnt hillside with thin smoke, a fire crew's pickup far below, blue hour light",
 "case-mapping":    "aerial orthographic view of a Mediterranean coastline with a small harbour, terraces and roads, overhead drone mapping photograph, crisp midday light",
 "software-gcs":    "an operator seated at a folding table in a field with a rugged open case containing a monitor and two controllers, map on the screen out of focus, drone in the sky behind, side view",
 "software-ugv":    "a small white and grey four-wheeled autonomous field robot the size of a lawn tractor, with a flat sensor mast, driving between rows of orange trees on a farm in Spain, two engineers in jeans and t-shirts with a laptop in the background, soft overcast light, civilian agricultural robotics",
 "software-vision": "macro photograph of a small camera module and circuit board on an engineer's bench, soft window light, tweezers, dark workbench",
 "training-field":  "an instructor and two trainees in jeans, sneakers and plain t-shirts standing on a grass airfield in Spain, each holding a white radio controller, one wearing white FPV goggles, a small grey quadcopter on the grass in front of them, bright morning, civilian flight school",
 "training-class":  "a small classroom with a whiteboard covered in flight diagrams, four adults at desks with controllers and tablets, daylight from large windows",
 "engineering-lab": "an engineering workshop in Alicante with a 3D printer, a half-assembled carbon quadcopter frame on the bench, oscilloscope, soldering station, an engineer in a grey t-shirt working, warm daylight",
 "engineering-test":"a fixed-wing drone on a pneumatic launch rail in an empty field at sunrise, two engineers with a laptop checking telemetry, mist on the ground",
 "company-alicante":"modern low industrial building with white walls and large windows on the outskirts of Alicante, palm trees, mountains behind, clear blue sky, wide shot",
 "dark-carbon":     "macro photograph of a black carbon fibre drone arm and brushless motor on a black background, dramatic side light, dark moody",
 "dark-antenna":    "close-up of a flat white satellite terminal mounted on a black drone frame against a dark background, studio light, dark moody",
 "platform-multirotor": "studio product photograph of a large black carbon quadcopter drone with 15 inch propellers on a black seamless background, three-quarter view, dramatic rim light",
 "platform-fixedwing":  "studio product photograph of a grey electric fixed-wing drone with a 1.8 metre wingspan on a black seamless background, three-quarter view, dramatic rim light",
}
def submit(prompt):
    body = json.dumps({"prompt": prompt + ", " + STYLE, "image_size": {"width": 1536, "height": 864}, "num_inference_steps": 28,
                       "guidance_scale": 3.5, "num_images": 1, "enable_safety_checker": True, "output_format": "jpeg"}).encode()
    req = urllib.request.Request("https://queue.fal.run/fal-ai/flux/dev", data=body, headers={"Authorization": "Key " + KEY, "Content-Type": "application/json"})
    return json.load(urllib.request.urlopen(req, timeout=60))
def get(url):
    return json.load(urllib.request.urlopen(urllib.request.Request(url, headers={"Authorization": "Key " + KEY}), timeout=60))
os.makedirs("generated/img", exist_ok=True)
jobs = {}
for k, p in PROMPTS.items():
    if os.path.exists(f"generated/img/{k}.jpg"): continue
    jobs[k] = submit(p); print("submitted", k, flush=True)
while jobs:
    for k, j in list(jobs.items()):
        st = get(j["status_url"])
        if st.get("status") == "COMPLETED":
            res = get(j["response_url"]); url = res["images"][0]["url"]
            urllib.request.urlretrieve(url, f"generated/img/{k}.jpg"); print("done", k, flush=True); del jobs[k]
        elif st.get("status") not in ("IN_QUEUE", "IN_PROGRESS"):
            print("failed", k, st, flush=True); del jobs[k]
    time.sleep(4)
print("all done")
