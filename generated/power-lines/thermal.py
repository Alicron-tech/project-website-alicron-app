# Thermal view of the clamp close-up: soft, low-contrast "ironbow" scene with one hot clamp and a spot readout.
import cv2, numpy as np
from PIL import Image, ImageDraw, ImageFont
K="/var/www/project-website-alicron-app/generated/power-lines/keyframes"
FM="/var/www/project-website-alicron-app/generated/pipeline/fonts/GeistMono-Medium.ttf"
img=cv2.imread(f"{K}/P3-clamp-rgb-v1.png"); img=cv2.resize(img,(1920,1080)); H,W=img.shape[:2]
g=cv2.cvtColor(img,cv2.COLOR_BGR2GRAY).astype(np.float32)/255
# thermal cameras see temperature, not light: soft optics, compressed range; metal hardware reads a little warmer than the air
B,G_,R=[c.astype(np.float32) for c in cv2.split(img)]
tex=cv2.GaussianBlur(np.abs(cv2.Laplacian(cv2.GaussianBlur(g,(0,0),1.5),cv2.CV_32F)),(0,0),9)
sky=((g>0.62)&(tex<0.012)&(np.arange(H)[:,None]<H*0.5)).astype(np.uint8)
n,lab,st,_=cv2.connectedComponentsWithStats(sky,8)                 # keep sky regions that touch the top edge
keep=np.zeros_like(sky,dtype=np.float32)
for k in range(1,n):
    if st[k,cv2.CC_STAT_TOP]==0 and st[k,cv2.CC_STAT_AREA]>5000: keep[lab==k]=1
sky=cv2.GaussianBlur(keep,(0,0),10)                                # clear sky is the coldest thing in view
base=cv2.GaussianBlur(g,(0,0),3)*0.30+0.22
base=base*(1-sky)+0.06*sky
fg=np.clip(1-np.arange(W)[None,:]/(W*0.9),0,1)*np.clip(1-np.abs(np.arange(H)[:,None]-H*0.55)/(H*0.5),0,1)   # the hardware in the foreground reads a little warmer
base+=0.08*cv2.GaussianBlur(((g>0.4)&(g<0.9)).astype(np.float32),(0,0),6)*fg
cx,cy=int(W*0.41),int(H*0.40)                        # the clamp body and its bolts
yy,xx=np.mgrid[0:H,0:W]; hot=np.exp(-(((xx-cx)/150)**2+((yy-cy)/95)**2))
t=np.clip(base+0.62*hot,0,1)
t=t+np.random.normal(0,0.012,t.shape)
col=cv2.applyColorMap((np.clip(t,0,1)*255).astype(np.uint8),cv2.COLORMAP_INFERNO)
pil=Image.fromarray(cv2.cvtColor(col,cv2.COLOR_BGR2RGB)); d=ImageDraw.Draw(pil)
f22=ImageFont.truetype(FM,22); f30=ImageFont.truetype(FM,30)
d.line([(cx-22,cy),(cx+22,cy)],fill="white",width=2); d.line([(cx,cy-22),(cx,cy+22)],fill="white",width=2); d.ellipse([cx-6,cy-6,cx+6,cy+6],outline="white",width=2)
d.line([(cx+30,cy-30),(cx+120,cy-110)],fill="white",width=2)
d.text((cx+130,cy-150),"SP1  78.4 °C",font=f30,fill="white"); d.text((cx+130,cy-110),"+41 °C ABOVE PHASE B",font=f22,fill=(254,215,77))
d.text((120,110),"CAM · THERMAL",font=f22,fill="white"); d.text((120,142),"CLAMP · TOWER 214 · PHASE A",font=f22,fill=(255,255,255))
for i,(lab,c) in enumerate([("78 °C",250),("",180),("",110),("12 °C",20)]): pass
bar=cv2.applyColorMap(np.linspace(255,0,300).astype(np.uint8)[:,None].repeat(16,1),cv2.COLORMAP_INFERNO)
pil.paste(Image.fromarray(cv2.cvtColor(bar,cv2.COLOR_BGR2RGB)),(W-150,390)); d.text((W-240,380),"80 °C",font=f22,fill="white"); d.text((W-240,670),"10 °C",font=f22,fill="white")
pil.save(f"{K}/P3b-clamp-thermal-v1.jpg",quality=92)
