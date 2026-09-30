import cv2, numpy as np
from PIL import Image, ImageDraw, ImageFont
A="/var/www/project-website-alicron-app/generated/agriculture/keyframes"
FM="/var/www/project-website-alicron-app/generated/pipeline/fonts/GeistMono-Medium.ttf"
W,H=1920,1080
f18=ImageFont.truetype(FM,18); f22=ImageFont.truetype(FM,22)
# ---- K3: ripeness detection on the close tree -------------------------------------------------
img=cv2.resize(cv2.imread(f"{A}/K2-close-tree.png"),(W,H)); hsv=cv2.cvtColor(img,cv2.COLOR_BGR2HSV); h=hsv[...,0]
lab=cv2.cvtColor(img,cv2.COLOR_BGR2LAB).astype(np.float32); L,Aa,Bb=lab[...,0],lab[...,1]-128,lab[...,2]-128
red=(Aa>12)&(L>50)                                   # red and orange-red skin
yel=(Bb>30)&(L>125)&(Aa>-14)                          # yellow and yellow-green skin, brighter than leaves
fruit=(red|yel).astype(np.uint8)*255
fruit=cv2.morphologyEx(fruit,cv2.MORPH_OPEN,np.ones((3,3),np.uint8)); fruit=cv2.morphologyEx(fruit,cv2.MORPH_CLOSE,np.ones((5,5),np.uint8))
# split touching apples: peaks of the distance transform become separate fruit
dist=cv2.distanceTransform(fruit,cv2.DIST_L2,5); peaks=((dist>=cv2.dilate(dist,np.ones((13,13))))&(dist>5)).astype(np.uint8)
n,lab_,st,cen=cv2.connectedComponentsWithStats(peaks,8)
boxes=[]
for k in range(1,n):
    x,y=cen[k]; r=float(dist[int(y),int(x)])*1.15
    if y<60 or r<6 or r>45: continue
    m=np.zeros((H,W),np.uint8); cv2.circle(m,(int(x),int(y)),max(3,int(r*0.7)),255,-1)
    ra=cv2.mean(Aa,mask=m)[0]; cls="RIPE" if ra>26 else ("TURNING" if ra>8 else "GREEN")
    boxes.append((int(x-r-2),int(y-r-2),int(2*r+4),int(2*r+4),cls))
cnts=[]
for c in cnts:
    ar=cv2.contourArea(c)
    if ar<110 or ar>9000: continue
    (x,y),r=cv2.minEnclosingCircle(c)
    if ar/(np.pi*r*r)<0.45 or r<6 or y<60: continue
    m=np.zeros((H,W),np.uint8); cv2.drawContours(m,[c],-1,255,-1)
    ra=cv2.mean(Aa,mask=m)[0]
    cls="RIPE" if ra>28 else ("TURNING" if ra>8 else "GREEN")
    boxes.append((int(x-r-3),int(y-r-3),int(2*r+6),int(2*r+6),cls))
COL={"RIPE":(255,82,82),"TURNING":(254,215,77),"GREEN":(140,220,120)}
pil=Image.fromarray(cv2.cvtColor(img,cv2.COLOR_BGR2RGB)).convert("RGBA"); ov=Image.new("RGBA",pil.size,(0,0,0,0)); d=ImageDraw.Draw(ov)
for x,y,w,hgt,cls in boxes:
    c=COL[cls]; d.rectangle([x,y,x+w,y+hgt],outline=c+(230,),width=2)
counts={k:sum(1 for b in boxes if b[4]==k) for k in COL}; n=max(1,len(boxes))
lines=["CAM · RGB + AI",f"FRUIT IN VIEW  {len(boxes)}",f"RIPE     {100*counts['RIPE']//n:3d} %",f"TURNING  {100*counts['TURNING']//n:3d} %",f"GREEN    {100*counts['GREEN']//n:3d} %"]
for i,t in enumerate(lines):
    y=120+i*32; d.text((121,y+2),t,font=f22,fill=(0,0,0,120)); d.text((120,y),t,font=f22,fill=(255,255,255,235) if i<2 else COL[["RIPE","TURNING","GREEN"][i-2]]+(255,))
Image.alpha_composite(pil,ov).convert("RGB").save(f"{A}/K3-ripeness.jpg",quality=90)
print("fruit",len(boxes),counts)
# ---- K5: vegetation index view of the orchard row, revealed through the centre band -------------
img=cv2.resize(cv2.imread(f"{A}/K1-onboard-row.png"),(W,H)).astype(np.float32)
B,G,R=cv2.split(img)
exg=(2*G-R-B)/(R+G+B+1e-3)                          # excess-green, a stand-in for NDVI on an RGB frame
veg=((exg>0.05)&(G>60)).astype(np.float32); veg=cv2.GaussianBlur(veg,(0,0),3)
vari=cv2.GaussianBlur(np.clip((exg-0.02)/0.35,0,1),(0,0),6)
stops=np.array([[0,(30,40,215)],[0.35,(40,160,245)],[0.55,(80,220,250)],[0.75,(90,200,120)],[1.0,(40,130,30)]],dtype=object)
xs=[s[0] for s in stops]; lut=np.stack([np.interp(np.linspace(0,1,256),xs,[s[1][k] for s in stops]) for k in range(3)],1).astype(np.uint8)
idx=lut[(vari*255).astype(np.uint8)].astype(np.float32)
gray=cv2.cvtColor(cv2.cvtColor(img.astype(np.uint8),cv2.COLOR_BGR2GRAY),cv2.COLOR_GRAY2BGR)
index_view=(idx*0.8+gray.astype(np.float32)*0.2)*veg[...,None]+gray.astype(np.float32)*0.85*(1-veg[...,None])
band=np.zeros((H,W),np.float32); x0,x1=W//2-420,W//2+420; band[:,x0:x1]=1; band=cv2.GaussianBlur(band,(0,0),8)[...,None]
comp=(index_view*band+img*(1-band)).astype(np.uint8)
for x in (x0,x1): cv2.line(comp,(x,0),(x,H),(255,255,255),2,cv2.LINE_AA)
pil=Image.fromarray(cv2.cvtColor(comp,cv2.COLOR_BGR2RGB)); d=ImageDraw.Draw(pil)
for i,t in enumerate(["CAM · VEGETATION INDEX","CANOPY VIGOUR"]): d.text((x0+24,120+i*30),t,font=f22 if i==0 else f18,fill=(255,255,255))
pil.save(f"{A}/K5-vigour-band.jpg",quality=90)
