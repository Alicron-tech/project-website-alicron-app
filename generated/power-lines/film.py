# Power-lines film: dawn, insulators, clamp with a switch to thermal, diverters, LiDAR push-in, golden hour, end card.
import cv2, numpy as np, subprocess
from PIL import Image, ImageDraw, ImageFont
P="/var/www/project-website-alicron-app/generated/power-lines"; C=f"{P}/clips"; K=f"{P}/keyframes"
FM="/var/www/project-website-alicron-app/generated/pipeline/fonts/GeistMono-Medium.ttf"
W,H,FPS=1920,1080,24; f22=ImageFont.truetype(FM,22); f30=ImageFont.truetype(FM,30)
def ease(u): u=min(max(u,0.0),1.0); return u*u*(3-2*u)
def frames(p):
    cap=cv2.VideoCapture(p); out=[]
    while True:
        ok,f=cap.read()
        if not ok: break
        out.append(cv2.resize(f,(W,H)))
    return out
yy,xx=np.mgrid[0:H,0:W]
def thermal(img,cx,cy,sky):
    g=cv2.cvtColor(img,cv2.COLOR_BGR2GRAY).astype(np.float32)/255
    base=cv2.GaussianBlur(g,(0,0),3)*0.30+0.22; base=base*(1-sky)+0.06*sky
    fg=np.clip(1-xx/(W*0.9),0,1)*np.clip(1-np.abs(yy-H*0.55)/(H*0.5),0,1)
    base+=0.08*cv2.GaussianBlur(((g>0.4)&(g<0.9)).astype(np.float32),(0,0),6)*fg
    hot=np.exp(-(((xx-cx)/150)**2+((yy-cy)/95)**2))
    t=np.clip(base+0.62*hot+np.random.normal(0,0.012,base.shape),0,1)
    return cv2.applyColorMap((t*255).astype(np.uint8),cv2.COLORMAP_INFERNO)
def sky_mask(img):
    g=cv2.cvtColor(img,cv2.COLOR_BGR2GRAY).astype(np.float32)/255
    tex=cv2.GaussianBlur(np.abs(cv2.Laplacian(cv2.GaussianBlur(g,(0,0),1.5),cv2.CV_32F)),(0,0),9)
    s=((g>0.62)&(tex<0.012)&(yy<H*0.5)).astype(np.uint8); n,lab,st,_=cv2.connectedComponentsWithStats(s,8); keep=np.zeros_like(g)
    for k in range(1,n):
        if st[k,cv2.CC_STAT_TOP]==0 and st[k,cv2.CC_STAT_AREA]>5000: keep[lab==k]=1
    return cv2.GaussianBlur(keep,(0,0),10)
def overlay(img,items,lines=()):
    pil=Image.fromarray(cv2.cvtColor(img,cv2.COLOR_BGR2RGB)).convert("RGBA"); ov=Image.new("RGBA",pil.size,(0,0,0,0)); d=ImageDraw.Draw(ov)
    for l,c,w in lines: d.line(l,fill=c,width=w)
    for (x,y),s,font,col in items: d.text((x+1,y+2),s,font=font,fill=(0,0,0,int(col[3]*0.4))); d.text((x,y),s,font=font,fill=col)
    return cv2.cvtColor(np.array(Image.alpha_composite(pil,ov).convert("RGB")),cv2.COLOR_RGB2BGR)
out=[]
out+=frames(f"{C}/PL1-dawn-take1.mp4")
out+=frames(f"{C}/PL2-insulators-take1.mp4")
# clamp: 1.5 s zoom camera, a 0.6 s wipe to thermal (left to right), then thermal with the spot reading; the hot spot follows the clamp
Cl=frames(f"{C}/PL3-clamp-take1.mp4"); orb=cv2.ORB_create(5000); g0=cv2.cvtColor(Cl[0],cv2.COLOR_BGR2GRAY); k0,d0=orb.detectAndCompute(g0,None)
C0=np.array([W*0.41,H*0.40,1.0]); sky0=sky_mask(Cl[0])
bar=cv2.cvtColor(cv2.applyColorMap(np.linspace(255,0,300).astype(np.uint8)[:,None].repeat(16,1),cv2.COLORMAP_INFERNO),cv2.COLOR_BGR2RGB)
for i,f in enumerate(Cl):
    t=i/FPS; u=ease((t-1.5)/0.6)
    if u<=0: out.append(overlay(f,[((120,110),"CAM · ZOOM 30×",f22,(255,255,255,235))])); continue
    k1,d1=orb.detectAndCompute(cv2.cvtColor(f,cv2.COLOR_BGR2GRAY),None)
    m=sorted(cv2.BFMatcher(cv2.NORM_HAMMING,crossCheck=True).match(d0,d1),key=lambda x:x.distance)[:800]
    Hm,_=cv2.findHomography(np.float32([k0[x.queryIdx].pt for x in m]),np.float32([k1[x.trainIdx].pt for x in m]),cv2.RANSAC,3.0)
    p=Hm@C0; cx,cy=p[0]/p[2],p[1]/p[2]; sky=cv2.warpPerspective(sky0,Hm,(W,H),borderMode=cv2.BORDER_REPLICATE)
    th=thermal(f,cx,cy,sky); edge=u*(W+40)
    mask=np.clip((edge-xx[0])/20.0,0,1)[None,:,None]
    g=(th*mask+f*(1-mask)).astype(np.uint8)
    if u<1: cv2.line(g,(int(edge),0),(int(edge),H),(255,255,255),2,cv2.LINE_AA)
    a=int(235*ease((t-2.3)/0.5)); items=[((120,110),"CAM · THERMAL",f22,(255,255,255,235)),((120,142),"CLAMP · TOWER 214 · PHASE A",f22,(255,255,255,235))]
    lines=[]
    if a>0:
        items+=[((cx+130,cy-150),"SP1  78.4 °C",f30,(255,255,255,a)),((cx+130,cy-110),"+41 °C ABOVE PHASE B",f22,(254,215,77,a))]
        lines=[([(cx-22,cy),(cx+22,cy)],(255,255,255,a),2),([(cx,cy-22),(cx,cy+22)],(255,255,255,a),2),([(cx+30,cy-30),(cx+120,cy-110)],(255,255,255,a),2)]
        items+=[((W-240,380),"80 °C",f22,(255,255,255,a)),((W-240,670),"10 °C",f22,(255,255,255,a))]
    fr=overlay(g,items,lines)
    if a>0:
        bb=(bar*(a/255)+cv2.cvtColor(fr[390:690,W-150:W-134],cv2.COLOR_BGR2RGB)*(1-a/255)).astype(np.uint8); fr[390:690,W-150:W-134]=cv2.cvtColor(bb,cv2.COLOR_RGB2BGR)
    out.append(fr)
out+=frames(f"{C}/PL4-diverters-take1.mp4")[:120]
# LiDAR: still frame, slow push-in over 3 s, faded in from the previous shot's cut
L=cv2.resize(cv2.imread(f"{K}/P5-lidar-v1.png"),(W,H))
for i in range(72):
    z=1+0.08*ease(i/71); cw,ch=int(W/z),int(H/z); x0,y0=(W-cw)//2,(H-ch)//2
    fr=cv2.resize(L[y0:y0+ch,x0:x0+cw],(W,H),interpolation=cv2.INTER_LANCZOS4)
    out.append(overlay(fr,[((120,110),"LIDAR · CORRIDOR MODEL",f22,(255,255,255,235)),((120,142),"3 TREES INSIDE CLEARANCE",f22,(254,140,90,235))]))
G6=frames(f"{C}/PL6-golden-take1.mp4")
for i,f in enumerate(G6):
    k=min(1,(len(G6)-1-i)/(0.6*FPS)); out.append((f.astype(np.float32)*k).astype(np.uint8))
p=subprocess.Popen(["ffmpeg","-v","error","-y","-f","rawvideo","-pix_fmt","bgr24","-s",f"{W}x{H}","-r",str(FPS),"-i","-","-c:v","libx264","-crf","14","-preset","slow","-pix_fmt","yuv420p",f"{P}/final/pl-body.mp4"],stdin=subprocess.PIPE)
for f in out: p.stdin.write(f.tobytes())
p.stdin.close(); p.wait(); print("frames",len(out))
