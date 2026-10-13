# On-board vision card: the olive-tree photo seen through an "AI contrast camera" — left a slice of the real image,
# the rest a high-contrast monochrome with cyan edge detection and labelled detections (Geist Mono).
import cv2, numpy as np
from PIL import Image, ImageDraw, ImageFont
O="/var/www/project-website-alicron-app/generated/pages"; FM="/var/www/project-website-alicron-app/generated/pipeline/fonts/GeistMono-Medium.ttf"
W,H=1920,1080
img=cv2.resize(cv2.imread(f"{O}/SW3-vision-base-v2.png"),(W,H))
g=cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)
clahe=cv2.createCLAHE(clipLimit=3.0,tileGridSize=(8,8)).apply(g)
c=clahe.astype(np.float32)/255; mono=np.stack([c*235,c*205,c*150],2).clip(0,255).astype(np.uint8)   # cool teal-tinted monochrome
edges=cv2.Canny(cv2.bilateralFilter(cv2.GaussianBlur(g,(0,0),3.2),9,60,9),45,120)   # only strong structure: trunk, ladder, box, hose, terrace
n,lab,st,_=cv2.connectedComponentsWithStats(edges,8); keep=np.isin(lab,[k for k in range(1,n) if st[k,cv2.CC_STAT_AREA]>90]); edges=(keep*255).astype(np.uint8)
cyan=np.zeros_like(img); cyan[edges>0]=(230,220,90)          # BGR: cyan-ish
vision=cv2.addWeighted(mono,1.0,cyan,0.75,0)
x0=int(W*0.18); mask=np.clip((np.arange(W)-x0)/14.0,0,1)[None,:,None]
out=(vision*mask+img*(1-mask)).astype(np.uint8)
pil=Image.fromarray(cv2.cvtColor(out,cv2.COLOR_BGR2RGB)).convert("RGBA"); ov=Image.new("RGBA",pil.size,(0,0,0,0)); d=ImageDraw.Draw(ov)
f20=ImageFont.truetype(FM,20); f22=ImageFont.truetype(FM,22)
d.line([(x0,0),(x0,H)],fill=(255,255,255,255),width=2)
C=(120,230,240,255); A=(254,215,77,255)
boxes=[("OLIVE TREE",0.44,0.02,0.99,0.90,0.97,C),("VALVE BOX",0.325,0.60,0.405,0.78,0.94,A),("HOSE",0.29,0.73,0.50,0.94,0.88,C),("LADDER",0.62,0.38,0.75,0.94,0.91,C)]
for lab,a,b,c,e,conf,col in boxes:
    x1,y1,x2,y2=int(a*W),int(b*H),int(c*W),int(e*H)
    for (p,q) in (((x1,y1),(x1+28,y1)),((x1,y1),(x1,y1+28)),((x2,y1),(x2-28,y1)),((x2,y1),(x2,y1+28)),((x1,y2),(x1+28,y2)),((x1,y2),(x1,y2-28)),((x2,y2),(x2-28,y2)),((x2,y2),(x2,y2-28))):
        d.line([p,q],fill=col,width=3)
    t=f"{lab}  {conf:.2f}"; tw=d.textlength(t,font=f20)
    d.rectangle([x1,y1-30,x1+tw+16,y1-2],fill=(5,5,6,200)); d.text((x1+8,y1-27),t,font=f20,fill=col)
d.rectangle([x0+24,24,x0+420,96],fill=(5,5,6,170))
d.text((x0+38,34),"CAM · CONTRAST + AI",font=f22,fill=(255,255,255,240)); d.text((x0+38,64),"4 OBJECTS · 38 MS",font=f20,fill=A)
Image.alpha_composite(pil,ov).convert("RGB").save(f"{O}/SW3-vision-final.jpg",quality=92)
