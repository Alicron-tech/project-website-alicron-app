# Builds the visible -> gas camera switch from two clips, no AI: ease-out slowdown, centre band reveal, mode label.
import cv2, numpy as np, subprocess  # fonts: generated/pipeline/fonts (Geist, from the geist npm package)
from PIL import Image, ImageDraw, ImageFont
C="/var/www/project-website-alicron-app/generated/pipeline/clips"; O="/var/www/project-website-alicron-app/generated/pipeline/final"
F="/var/www/project-website-alicron-app/generated/pipeline/fonts/GeistMono-Medium.ttf"
W,H,FPS=1920,1080,24
def frames(p):
    cap=cv2.VideoCapture(p); out=[]
    while True:
        ok,f=cap.read()
        if not ok: break
        out.append(cv2.resize(f,(W,H)))
    return out
A=frames(f"{C}/B5a-visible-take1.mp4"); G=frames(f"{C}/B5b-gas-take1.mp4")
def at(seq,s):  # blended frame at time s (seconds)
    x=min(max(s*FPS,0),len(seq)-1); i=int(x); j=min(i+1,len(seq)-1); a=x-i
    return cv2.addWeighted(seq[i],1-a,seq[j],a,0) if a>1e-3 else seq[i].copy()
T_END=1.0                              # source seconds covered by the slowdown
end=at(A,T_END)
# homography from the first colour frame (= gas geometry) to the frame we stop on
g0=cv2.cvtColor(A[0],cv2.COLOR_BGR2GRAY); g1=cv2.cvtColor(end,cv2.COLOR_BGR2GRAY)
orb=cv2.ORB_create(6000); k0,d0=orb.detectAndCompute(g0,None); k1,d1=orb.detectAndCompute(g1,None)
m=sorted(cv2.BFMatcher(cv2.NORM_HAMMING,crossCheck=True).match(d0,d1),key=lambda x:x.distance)[:1500]
Hm,_=cv2.findHomography(np.float32([k0[x.queryIdx].pt for x in m]),np.float32([k1[x.trainIdx].pt for x in m]),cv2.RANSAC,3.0)
print("homography\n",np.round(Hm,3))
valid=cv2.warpPerspective(np.full((H,W),255,np.uint8),Hm,(W,H))
Z=1.0                                   # smallest centred zoom whose crop lies inside the warped gas image
while Z<1.5:
    cw,ch=int(W/Z),int(H/Z); x0,y0=(W-cw)//2,(H-ch)//2
    if valid[y0:y0+ch,x0:x0+cw].min()==255: break
    Z+=0.01
print("zoom",round(Z,2))
def zoom(f):
    cw,ch=int(W/Z),int(H/Z); x0,y0=(W-cw)//2,(H-ch)//2
    return cv2.resize(f[y0:y0+ch,x0:x0+cw],(W,H),interpolation=cv2.INTER_LANCZOS4)
PLUME=0.3                               # keep 30 % of the plume darkening: a faint grey wisp over a sharp scene
G0b=cv2.GaussianBlur(G[0].astype(np.float32),(0,0),7)
def gas_at(s):
    # Keep the current frame sharp; only lighten back the large dark area that is the plume.
    # (Blending with the first frame, as before, doubled every edge that moved: trees, walls, tracks.)
    f=at(G,s).astype(np.float32)
    plume=np.minimum(cv2.GaussianBlur(f,(0,0),7)-G0b,0)       # large-scale darkening only
    return np.clip(f-(1-PLUME)*plume,0,255).astype(np.uint8)
G0g=cv2.cvtColor(G[0],cv2.COLOR_BGR2GRAY); kG,dG=orb.detectAndCompute(G0g,None)
_dens={}
def density_at(s):
    """Plume density 0..1 in the frame's own geometry: align the frame to the first gas frame (the clip drifts),
    measure the darkening, keep only the largest connected dark area (the plume), map it back."""
    i=min(int(round(s*FPS)),len(G)-1)
    if i in _dens: return _dens[i]
    f=G[i]; fg=cv2.cvtColor(f,cv2.COLOR_BGR2GRAY)
    k1,d1=orb.detectAndCompute(fg,None)
    mm=sorted(cv2.BFMatcher(cv2.NORM_HAMMING,crossCheck=True).match(dG,d1),key=lambda x:x.distance)[:1500]
    Ht,_=cv2.findHomography(np.float32([k1[x.trainIdx].pt for x in mm]),np.float32([kG[x.queryIdx].pt for x in mm]),cv2.RANSAC,2.0)
    al=cv2.warpPerspective(f,Ht,(W,H)).astype(np.float32)
    ok=cv2.erode(cv2.warpPerspective(np.ones((H,W),np.uint8),Ht,(W,H)),np.ones((41,41)))   # ignore the borders the alignment leaves
    d=-np.minimum(cv2.GaussianBlur(al,(0,0),7)-G0b,0).mean(axis=2)*ok
    m=(d>14).astype(np.uint8)
    n,lab,st,_=cv2.connectedComponentsWithStats(m,8)
    keep=np.zeros_like(d)
    if n>1:
        j=1+int(np.argmax(st[1:,cv2.CC_STAT_AREA]))
        if st[j,cv2.CC_STAT_AREA]>1500: keep=(lab==j).astype(np.float32)
    dens=cv2.GaussianBlur(np.clip((d-6)/85,0,1)*cv2.dilate(keep,np.ones((15,15))),(0,0),9)
    dens=cv2.warpPerspective(dens,np.linalg.inv(Ht),(W,H))
    _dens[i]=dens; return dens
warpD=lambda s: cv2.warpPerspective(density_at(s).astype(np.float32),Hm,(W,H),flags=cv2.INTER_LINEAR)
small=ImageFont.truetype(F,22)
def heat(img,d,t_gas):
    """Gas-highlight mode: paint the plume with an analytics-style heat palette (purple, red, yellow) over the greyscale."""
    col=cv2.applyColorMap((np.power(d,1.0)*250).astype(np.uint8),cv2.COLORMAP_INFERNO)   # yellow only in the dense core
    a=np.clip(d*3.0,0,0.85)[...,None]
    out=(img*(1-a)+col*a).astype(np.uint8)
    ys,xs=np.where(d>0.12)
    if len(xs)>400 and t_gas>0.6:                                        # readout next to the plume once it is visible
        x,y=int(np.percentile(xs,90))+40,int(np.percentile(ys,15))
        k=min(1,(t_gas-0.6)/0.4); ppm=int(180+1100*min(1,(t_gas-0.6)/2.0))
        pil=Image.fromarray(cv2.cvtColor(out,cv2.COLOR_BGR2RGB)).convert("RGBA"); ov=Image.new("RGBA",pil.size,(0,0,0,0)); dr=ImageDraw.Draw(ov)
        A=int(235*k); dr.line([(x-34,y+14),(x-6,y+14)],fill=(255,255,255,A),width=2)
        for dx,dy,c in ((1,2,(0,0,0,int(110*k))),(0,0,(255,255,255,A))):
            dr.text((x+dx,y+dy),"CH₄ · METHANE",font=small,fill=c); dr.text((x+dx,y+30+dy),f"{ppm:,} ppm·m".replace(","," "),font=small,fill=c)
        out=cv2.cvtColor(np.array(Image.alpha_composite(pil,ov).convert("RGB")),cv2.COLOR_RGB2BGR)
    return out
warpG=lambda s: cv2.warpPerspective(gas_at(s),Hm,(W,H),flags=cv2.INTER_LANCZOS4)
font=ImageFont.truetype(F,24)
def label(img,text,alpha):
    if alpha<=0: return img
    pil=Image.fromarray(cv2.cvtColor(img,cv2.COLOR_BGR2RGB)).convert("RGBA"); ov=Image.new("RGBA",pil.size,(0,0,0,0)); d=ImageDraw.Draw(ov)
    d.text((151,153),text,font=font,fill=(0,0,0,int(110*alpha))); d.text((150,150),text,font=font,fill=(255,255,255,int(235*alpha)))
    return cv2.cvtColor(np.array(Image.alpha_composite(pil,ov).convert("RGB")),cv2.COLOR_RGB2BGR)
ease=lambda u: u*u*(3-2*u)
out=[]
# 1. colour, decelerating from normal speed to a hover over 2 s
for i in range(48):
    t=i/FPS; s=T_END*(1-(1-t/2.0)**2)
    out.append(label(zoom(at(A,s)),"CAM · VISIBLE",1.0))
# 2. centre band reveal over 1.25 s, gas footage starting from its own beginning
xs=np.arange(W,dtype=np.float32)
for i in range(30):
    u=ease(i/29); half=u*(W/2+40); gs=i/FPS
    col=zoom(end); gas=zoom(heat(warpG(gs),warpD(gs),gs))
    mask=np.clip((half-np.abs(xs-W/2))/24.0,0,1)[None,:,None]      # 24 px feathered edge
    f=(gas*mask+col*(1-mask)).astype(np.uint8)
    if 0<half<W/2:
        for sgn in (-1,1):
            x=int(W/2+sgn*half); cv2.line(f,(x,0),(x,H),(255,255,255),2,cv2.LINE_AA)
    f=label(label(f,"CAM · VISIBLE",1-u),"CAM · GAS",u); out.append(f)
# 3. gas camera, plume rising, 2.75 s
for i in range(66):
    s=30/FPS+i/FPS; out.append(label(zoom(heat(warpG(s),warpD(s),s)),"CAM · GAS",1.0))
p=subprocess.Popen(["ffmpeg","-v","error","-y","-f","rawvideo","-pix_fmt","bgr24","-s",f"{W}x{H}","-r",str(FPS),"-i","-","-c:v","libx264","-crf","14","-preset","slow","-pix_fmt","yuv420p",f"{O}/B5-switch.mp4"],stdin=subprocess.PIPE)
for f in out: p.stdin.write(f.tobytes())
p.stdin.close(); p.wait(); print("frames",len(out))
