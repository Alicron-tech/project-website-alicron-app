# Mapping overlays: photo footprints tiling into the map; photo-to-elevation wipe with a stockpile volume readout.
import cv2, numpy as np
from PIL import Image, ImageDraw, ImageFont
K="/var/www/project-website-alicron-app/generated/mapping/keyframes"
FM="/var/www/project-website-alicron-app/generated/pipeline/fonts/GeistMono-Medium.ttf"
W,H=1920,1080; f22=ImageFont.truetype(FM,22); f30=ImageFont.truetype(FM,30)
photo=cv2.resize(cv2.imread(f"{K}/A3-nadir-v1.png"),(W,H)); elev=cv2.resize(cv2.imread(f"{K}/A4-elevation-v1.png"),(W,H))
def pil(a): return Image.fromarray(cv2.cvtColor(a,cv2.COLOR_BGR2RGB))
# A3b: survey lines flown so far; covered strips show the photo map, the rest is dim; footprints outlined
fw,fh=300,200; ox,oy=-40,-30; cov=np.zeros((H,W),np.float32); boxes=[]
for r in range(7):
    cols=range(8) if r%2==0 else range(7,-1,-1)
    for k,c in enumerate(cols):
        if r>3 or (r==3 and k>4): continue                          # the aircraft is part-way through line 4
        x,y=ox+c*int(fw*0.8),oy+r*int(fh*0.75); boxes.append((x,y)); cov[max(0,y):y+fh,max(0,x):x+fw]=1
dim=(photo*0.28).astype(np.uint8)
base=(photo*cov[...,None]+dim*(1-cov[...,None])).astype(np.uint8)
im=pil(base).convert("RGBA"); ov=Image.new("RGBA",im.size,(0,0,0,0)); d=ImageDraw.Draw(ov)
for i,(x,y) in enumerate(boxes):
    a=255 if i==len(boxes)-1 else 90; d.rectangle([x,y,x+fw,y+fh],outline=(255,255,255,a),width=3 if a==255 else 1)
for r in range(4,7):                                                 # lines still to fly, dashed
    y=oy+r*int(fh*0.75)+fh//2
    for x in range(0,W,40): d.line([(x,y),(x+20,y)],fill=(254,215,77,200),width=2)
d.text((120,110),"SURVEY · LINE 4 OF 7",font=f22,fill=(255,255,255,235)); d.text((120,142),"OVERLAP 75 % · GSD 2.1 CM",font=f22,fill=(255,255,255,235))
Image.alpha_composite(im,ov).convert("RGB").save(f"{K}/A3b-footprints-v1.jpg",quality=92)
# A5: wipe from photo map to elevation map, one stockpile outlined, volume against the last flight
x0=int(W*0.30); mask=np.clip((np.arange(W)-x0)/12.0,0,1)[None,:,None]
comp=(elev*mask+photo*(1-mask)).astype(np.uint8)
im=pil(comp).convert("RGBA"); ov=Image.new("RGBA",im.size,(0,0,0,0)); d=ImageDraw.Draw(ov)
d.line([(x0,0),(x0,H)],fill=(255,255,255,255),width=2)
# the largest stockpile: a bright, roughly round patch in the right half of the photo
cx,cy,r=828,708,120                                    # the largest stockpile (concentric contour rings in the elevation model)
d.ellipse([cx-r,cy-r,cx+r,cy+r],outline=(255,255,255,255),width=3)
d.line([(cx+int(r*0.7),cy-int(r*0.7)),(cx+170,cy-160)],fill=(255,255,255,255),width=2)
d.text((cx+180,cy-200),"STOCKPILE 3",font=f22,fill=(255,255,255,255)); d.text((cx+180,cy-168),"18 640 m³",font=f30,fill=(255,255,255,255)); d.text((cx+180,cy-128),"+4 820 m³ SINCE LAST FLIGHT",font=f22,fill=(254,215,77,255))
d.text((120,110),"ORTHOPHOTO",font=f22,fill=(255,255,255,235)); d.text((x0+30,110),"ELEVATION MODEL",font=f22,fill=(255,255,255,235))
Image.alpha_composite(im,ov).convert("RGB").save(f"{K}/A5-measure-v1.jpg",quality=92)
print("stockpile at",cx,cy)

# C3: the town as a point cloud, drawn from the photo itself: coloured dots on black, denser near the camera, sparse far away
town=cv2.resize(cv2.imread(f"{K}/C1-town-v1.png"),(W,H)); rng=np.random.default_rng(7)
canvas=np.zeros((H,W,3),np.uint8); yy=np.arange(H)[:,None]
p=0.035+0.07*(yy/H)                                     # keep probability: sparser towards the horizon
keep=rng.random((H,W))<p
ys,xs=np.nonzero(keep); cols=town[ys,xs]
for (y,x),c in zip(zip(ys,xs),cols):
    if c.max()<25: continue
    canvas[y,x]=c
canvas=cv2.dilate(canvas,np.ones((2,2),np.uint8)); canvas=cv2.convertScaleAbs(canvas,alpha=1.35,beta=10)
sky=(cv2.cvtColor(town,cv2.COLOR_BGR2HSV)[...,2]>200)&(yy<H*0.12)
canvas[sky]=0
im=Image.fromarray(cv2.cvtColor(canvas,cv2.COLOR_BGR2RGB)); d=ImageDraw.Draw(im)
d.text((120,110),"PHOTOGRAMMETRY · DENSE CLOUD",font=f22,fill=(255,255,255)); d.text((120,142),"41.6 M POINTS",font=f22,fill=(254,215,77))
im.save(f"{K}/C3-pointcloud-v2.jpg",quality=92)
