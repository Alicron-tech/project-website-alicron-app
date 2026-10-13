# Mapping film: launch, survey line, top-down camera, photos tiling into the map, wipe to the elevation model with a
# stockpile volume, fade to black (end card added by concat).
import cv2, numpy as np, subprocess
from PIL import Image, ImageDraw, ImageFont
M="/var/www/project-website-alicron-app/generated/mapping"; C=f"{M}/clips"; K=f"{M}/keyframes"
FM="/var/www/project-website-alicron-app/generated/pipeline/fonts/GeistMono-Medium.ttf"
W,H,FPS=1920,1080,24; f22=ImageFont.truetype(FM,22); f30=ImageFont.truetype(FM,30)
def ease(u): u=min(max(u,0.0),1.0); return u*u*(3-2*u)
def frames(p,a=0,b=None):
    cap=cv2.VideoCapture(p); out=[]
    while True:
        ok,f=cap.read()
        if not ok: break
        out.append(cv2.resize(f,(W,H)))
    return out[int(a*FPS):None if b is None else int(b*FPS)]
def draw(img,fn):
    im=Image.fromarray(cv2.cvtColor(img,cv2.COLOR_BGR2RGB)).convert("RGBA"); ov=Image.new("RGBA",im.size,(0,0,0,0)); fn(ImageDraw.Draw(ov))
    return cv2.cvtColor(np.array(Image.alpha_composite(im,ov).convert("RGB")),cv2.COLOR_RGB2BGR)
out=[]
out+=frames(f"{C}/MA1-launch2-take1.mp4",1.0)                         # from 1.0 s: the take shows a flame flash before
out+=frames(f"{C}/MA2-line2-take1.mp4")                                 # retake: the first had a warping wingtip
nad=frames(f"{C}/MA3-nadir4-take1.mp4",0,3.0); out+=nad                          # played forward (reversing it made the trucks drive backwards)
still=cv2.resize(cv2.imread(f"{K}/A3-nadir-v3.png"),(W,H)); elev0=cv2.resize(cv2.imread(f"{K}/A4-elevation-v1.png"),(W,H))
photo=nad[-1].copy()                                   # freeze on the last frame of the moving shot: the map is built from exactly that frame
_o=cv2.ORB_create(6000); _k0,_d0=_o.detectAndCompute(cv2.cvtColor(still,cv2.COLOR_BGR2GRAY),None); _k1,_d1=_o.detectAndCompute(cv2.cvtColor(photo,cv2.COLOR_BGR2GRAY),None)
_m=sorted(cv2.BFMatcher(cv2.NORM_HAMMING,crossCheck=True).match(_d0,_d1),key=lambda x:x.distance)[:1500]
HS,_=cv2.findHomography(np.float32([_k0[x.queryIdx].pt for x in _m]),np.float32([_k1[x.trainIdx].pt for x in _m]),cv2.RANSAC,3.0)   # still -> frozen frame
elev=cv2.warpPerspective(elev0,HS,(W,H),flags=cv2.INTER_LANCZOS4,borderMode=cv2.BORDER_REPLICATE)   # elevation model moved onto the frozen frame
# photo footprints along a serpentine survey pattern, one after another
fw,fh=300,200; ox,oy=-40,-30; path=[]
sx=(W+80-fw)//7; sy=(H+60-fh)//6                      # 8 columns x 7 rows reaching past every edge, so no gap is left
for r in range(7):
    for c in (range(8) if r%2==0 else range(7,-1,-1)): path.append((ox+c*sx,oy+r*sy))
N=int(3.5*FPS)
for i in range(N):
    n=int(len(path)*min(1,(i+1)/(N*0.85))); cov=np.zeros((H,W),np.float32)
    for (x,y) in path[:n]: cov[max(0,y):y+fh,max(0,x):x+fw]=1
    k=1-0.72*ease(i/8); dim=(photo*k).astype(np.uint8)    # the frozen frame dims over 1/3 s while the first footprints land
    base=(photo*cov[...,None]+dim*(1-cov[...,None])).astype(np.uint8); line=min(7,n//8+1)
    def fn(d,n=n,line=line):
        for k,(x,y) in enumerate(path[:n]):
            last=k==n-1; d.rectangle([x,y,x+fw,y+fh],outline=(255,255,255,255 if last else 70),width=3 if last else 1)
        d.text((120,110),f"SURVEY · LINE {line} OF 7",font=f22,fill=(255,255,255,235)); d.text((120,142),"OVERLAP 75 % · GSD 2.1 CM",font=f22,fill=(255,255,255,235))
    out.append(draw(base,fn))
# wipe from the orthophoto to the elevation model, then the stockpile callout counts up
x0=int(W*0.30); _p=HS@np.array([862,700,1.0]); cx,cy,r=int(_p[0]/_p[2]),int(_p[1]/_p[2]),112   # stockpile, moved with the frame; N=int(4.5*FPS)
for i in range(N):
    t=i/FPS; edge=W-(W-x0)*ease(t/1.2); mask=np.clip((np.arange(W)-edge)/12.0,0,1)[None,:,None]
    z=1+0.04*ease(t/4.5); cw,ch=int(W/z),int(H/z); xa,ya=(W-cw)//2,(H-ch)//2
    comp=(elev*mask+photo*(1-mask)).astype(np.uint8)
    a=ease((t-1.3)/0.5); vol=int(18640*ease((t-1.3)/1.4)); dv=int(4820*ease((t-1.3)/1.4))
    def fn(d,edge=edge,a=a,vol=vol,dv=dv):
        d.line([(edge,0),(edge,H)],fill=(255,255,255,255),width=2)
        d.text((120,110),"ORTHOPHOTO",font=f22,fill=(255,255,255,235))
        if edge<W-200: d.text((edge+30,110),"ELEVATION MODEL",font=f22,fill=(255,255,255,235))
        if a>0:
            A=int(255*a); d.ellipse([cx-r,cy-r,cx+r,cy+r],outline=(255,255,255,A),width=3)
            d.line([(cx+int(r*0.7),cy-int(r*0.7)),(cx+170,cy-160)],fill=(255,255,255,A),width=2)
            d.rectangle([cx+165,cy-212,cx+640,cy-96],fill=(5,5,6,int(170*a)))
            d.text((cx+180,cy-200),"STOCKPILE 3",font=f22,fill=(255,255,255,A))
            d.text((cx+180,cy-168),f"{vol:,} m³".replace(","," "),font=f30,fill=(255,255,255,A))
            d.text((cx+180,cy-128),f"+{dv:,} m³ SINCE LAST FLIGHT".replace(","," "),font=f22,fill=(254,215,77,A))
    fr=draw(comp,fn); fr=cv2.resize(fr[ya:ya+ch,xa:xa+cw],(W,H),interpolation=cv2.INTER_LANCZOS4)
    k=min(1,(N-1-i)/(0.6*FPS)); out.append((fr.astype(np.float32)*k).astype(np.uint8))
p=subprocess.Popen(["ffmpeg","-v","error","-y","-f","rawvideo","-pix_fmt","bgr24","-s",f"{W}x{H}","-r",str(FPS),"-i","-","-c:v","libx264","-crf","14","-preset","slow","-pix_fmt","yuv420p",f"{M}/final/map-body.mp4"],stdin=subprocess.PIPE)
for f in out: p.stdin.write(f.tobytes())
p.stdin.close(); p.wait(); print("frames",len(out))
