# Crop-monitoring film: orchard row with a vegetation-index band, one tree with ripeness boxes, vines, end card.
import cv2, numpy as np, subprocess
from PIL import Image, ImageDraw, ImageFont
G="/var/www/project-website-alicron-app/generated/agriculture"; C=f"{G}/clips"; O=f"{G}/final"
FM="/var/www/project-website-alicron-app/generated/pipeline/fonts/GeistMono-Medium.ttf"
W,H,FPS=1920,1080,24
f22=ImageFont.truetype(FM,22); f18=ImageFont.truetype(FM,18)
def ease(u):
    u=min(max(u,0.0),1.0); return u*u*(3-2*u)
def frames(p):
    cap=cv2.VideoCapture(p); out=[]
    while True:
        ok,f=cap.read()
        if not ok: break
        out.append(cv2.resize(f,(W,H)))
    return out
def text(img,items):
    pil=Image.fromarray(cv2.cvtColor(img,cv2.COLOR_BGR2RGB)).convert("RGBA"); ov=Image.new("RGBA",pil.size,(0,0,0,0)); d=ImageDraw.Draw(ov)
    for (x,y),s,font,col in items:
        d.text((x+1,y+2),s,font=font,fill=(0,0,0,int(col[3]*0.45))); d.text((x,y),s,font=font,fill=col)
    return cv2.cvtColor(np.array(Image.alpha_composite(pil,ov).convert("RGB")),cv2.COLOR_RGB2BGR)
# --- vegetation index (excess green as an RGB stand-in for NDVI), canopy only --------------------
stops=[(0,(30,40,215)),(0.35,(40,160,245)),(0.55,(80,220,250)),(0.75,(90,200,120)),(1.0,(40,130,30))]
LUT=np.stack([np.interp(np.linspace(0,1,256),[s[0] for s in stops],[s[1][k] for s in stops]) for k in range(3)],1).astype(np.uint8)
def index_view(img):
    f=img.astype(np.float32); B,Gc,R=cv2.split(f); exg=(2*Gc-R-B)/(R+Gc+B+1e-3)
    veg=cv2.GaussianBlur(((exg>0.05)&(Gc>60)).astype(np.float32),(0,0),3)[...,None]
    idx=LUT[(cv2.GaussianBlur(np.clip((exg-0.02)/0.35,0,1),(0,0),6)*255).astype(np.uint8)].astype(np.float32)
    gray=cv2.cvtColor(cv2.cvtColor(img,cv2.COLOR_BGR2GRAY),cv2.COLOR_GRAY2BGR).astype(np.float32)
    return ((idx*0.8+gray*0.2)*veg+gray*0.85*(1-veg)).astype(np.uint8)
# --- fruit detection by skin colour (Lab), touching fruit split by distance transform -------------
COL={"RIPE":(82,82,255),"TURNING":(77,215,254),"GREEN":(120,220,140)}      # BGR
def detect(img):
    lab=cv2.cvtColor(img,cv2.COLOR_BGR2LAB).astype(np.float32); L,Aa,Bb=lab[...,0],lab[...,1]-128,lab[...,2]-128
    m=(((Aa>12)&(L>50))|((Bb>30)&(L>125)&(Aa>-14))).astype(np.uint8)*255
    m=cv2.morphologyEx(cv2.morphologyEx(m,cv2.MORPH_OPEN,np.ones((3,3),np.uint8)),cv2.MORPH_CLOSE,np.ones((5,5),np.uint8))
    dist=cv2.distanceTransform(m,cv2.DIST_L2,5); pk=((dist>=cv2.dilate(dist,np.ones((13,13))))&(dist>5)).astype(np.uint8)
    n,_,_,cen=cv2.connectedComponentsWithStats(pk,8); out=[]
    for k in range(1,n):
        x,y=cen[k]; r=float(dist[int(y),int(x)])*1.15
        if y<60 or r<6 or r>70: continue
        ra=float(Aa[max(0,int(y)-2):int(y)+3,max(0,int(x)-2):int(x)+3].mean())
        out.append((x,y,r,"RIPE" if ra>26 else ("TURNING" if ra>8 else "GREEN")))
    keep=[]                                   # one box per apple: drop centres that fall inside a larger kept one
    for d in sorted(out,key=lambda d:-d[2]):
        if all((d[0]-k[0])**2+(d[1]-k[1])**2>(0.9*max(d[2],k[2])+4)**2 for k in keep): keep.append(d)
    return keep
frames_out=[]
# 1-2. orchard row, first 4 s (trees on both sides): 2 s plain, then the index opens on the left and right
#      (the tree rows) in 0.8 s and holds; the centre alley stays in colour
A=frames(f"{C}/G1-row-take1.mp4"); xs=np.arange(W,dtype=np.float32); INNER=330   # whole 6 s take (tree rows on both sides throughout); INNER = half-width of the untouched centre
for i,f in enumerate(A):
    t=i/FPS; u=ease((t-1.0)/0.8)                             # index opens after 1 s
    if u<=0: frames_out.append(f); continue
    edge=W/2-u*(W/2-INNER)                                   # sides grow inwards from the frame edges
    band=np.clip((np.abs(xs-W/2)-edge)/10.0,0,1)[None,:,None]
    g=(index_view(f)*band+f*(1-band)).astype(np.uint8)
    for s in (-1,1): cv2.line(g,(int(W/2+s*edge),0),(int(W/2+s*edge),H),(255,255,255),2,cv2.LINE_AA)
    a=int(235*u)
    frames_out.append(text(g,[((150,120),"CAM · VEGETATION INDEX",f22,(255,255,255,a)),((150,152),"CANOPY VIGOUR",f18,(255,255,255,a))]))
# 3-4. one tree: 1.5 s plain, then a scan line sweeps down and boxes appear behind it, readout counts up
T0=frames(f"{C}/G3-tree-take1.mp4")[:80]           # stop at 3.3 s of source, before apples get so close they split into several boxes
T=[]                                                  # play the approach at 0.8x (neighbouring frames blended) so the detection stays longer
for j in range(100):
    x=j*0.79; a=int(x); b=min(a+1,79); w=x-a; T.append(cv2.addWeighted(T0[a],1-w,T0[b],w,0) if w>1e-3 else T0[a])
for i,f in enumerate(T):
    t=i/FPS; s=ease((t-0.5)/1.2) if t>0.5 else 0     # scan starts at 0.5 s
    if s<=0: frames_out.append(f); continue
    g=f.copy(); scan=s*H; det=detect(f); shown=[d for d in det if d[1]<scan]
    for x,y,r,c in shown: cv2.rectangle(g,(int(x-r-2),int(y-r-2)),(int(x+r+2),int(y+r+2)),COL[c],2,cv2.LINE_AA)
    if s<1: cv2.line(g,(0,int(scan)),(W,int(scan)),(255,255,255),1,cv2.LINE_AA)
    n=max(1,len(shown)); cnt={k:sum(1 for d in shown if d[3]==k) for k in COL}
    rgb=lambda c:(COL[c][2],COL[c][1],COL[c][0],255)
    frames_out.append(text(g,[((120,120),"CAM · RGB + AI",f22,(255,255,255,235)),((120,152),f"FRUIT IN VIEW  {len(shown)}",f22,(255,255,255,235)),
        ((120,184),f"RIPE     {100*cnt['RIPE']//n:3d} %",f22,rgb("RIPE")),((120,216),f"TURNING  {100*cnt['TURNING']//n:3d} %",f22,rgb("TURNING")),((120,248),f"GREEN    {100*cnt['GREEN']//n:3d} %",f22,rgb("GREEN"))]))
# 5. vines, fading to black over the last 0.6 s
V=frames(f"{C}/G5-vines-chase2-take1.mp4")
for i,f in enumerate(V):
    k=min(1,(len(V)-1-i)/(0.6*FPS)); frames_out.append((f.astype(np.float32)*k).astype(np.uint8))
p=subprocess.Popen(["ffmpeg","-v","error","-y","-f","rawvideo","-pix_fmt","bgr24","-s",f"{W}x{H}","-r",str(FPS),"-i","-","-c:v","libx264","-crf","14","-preset","slow","-pix_fmt","yuv420p",f"{O}/agri-body.mp4"],stdin=subprocess.PIPE)
for f in frames_out: p.stdin.write(f.tobytes())
p.stdin.close(); p.wait(); print("frames",len(frames_out))
