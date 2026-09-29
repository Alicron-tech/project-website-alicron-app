# Usage: python3 endcard.py fonts/Geist-Variable.ttf final/A6-endcard.mp4
# ALICRON end card for the pipeline films: white wordmark on the dark ground, fade in 0.4 s, hold, fade out 0.4 s (2.4 s).
import subprocess, sys
from PIL import Image, ImageDraw, ImageFont
W,H,FPS=1920,1080,24; SIZE=75                         # wordmark size in px (was 150, halved on 2026-09-30)
f=ImageFont.truetype(sys.argv[1],SIZE); f.set_variation_by_axes([800])   # Geist variable font at weight 800
text="ALICRON"; track=0.1*SIZE                         # +0.1em tracking, as the site's wordmark
widths=[f.getlength(c) for c in text]; total=sum(widths)+track*(len(text)-1); l,t,r,b=f.getbbox(text)
def card(a):
    im=Image.new("RGB",(W,H),(5,5,6)); d=ImageDraw.Draw(im); x=(W-total)/2; y=(H-(b-t))/2-t; v=int(5+250*a)
    for c,w in zip(text,widths): d.text((x,y),c,font=f,fill=(v,v,v)); x+=w+track
    return im.tobytes()
p=subprocess.Popen(["ffmpeg","-v","error","-y","-f","rawvideo","-pix_fmt","rgb24","-s",f"{W}x{H}","-r",str(FPS),"-i","-","-c:v","libx264","-crf","14","-preset","slow","-pix_fmt","yuv420p",sys.argv[2]],stdin=subprocess.PIPE)
for i in range(int(2.4*FPS)):
    s=i/FPS; a=min(1,s/0.4) if s<2.0 else max(0,1-(s-2.0)/0.4); p.stdin.write(card(a*a*(3-2*a)))
p.stdin.close(); p.wait()
