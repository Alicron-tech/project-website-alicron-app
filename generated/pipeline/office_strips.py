# Office shot collapses to a narrow centre strip; vertical strips of other shots take the rest of the frame.
import cv2, numpy as np, subprocess, sys
C="/var/www/project-website-alicron-app/generated/pipeline/clips"; O="/var/www/project-website-alicron-app/generated/pipeline/final"
W,H,FPS=1920,1080,24
def frames(p):
    cap=cv2.VideoCapture(p); out=[]
    while True:
        ok,f=cap.read()
        if not ok: break
        out.append(cv2.resize(f,(W,H)))
    return out
office=frames(f"{C}/A5-office-empty-take1.mp4")
LEFT=["B4-river-take1","B6-excavator-take1"]; RIGHT=["B3-valve-take1","B2-chase-take2"]   # shots not used elsewhere in Film A
side={n:frames(f"{C}/{n}.mp4") for n in LEFT+RIGHT}

PAPER=(248,254,255)                                # site paper #fffef8 in BGR
GUT=10; SW=600; OX=870                             # gutter, office strip width, office strip centre in the source frame
rest=(W-SW-2*GUT*len(LEFT))//(2*len(LEFT))           # side strips, same count each side
# slot x positions: [s0][g][s1][g][office][g][s2][g][s3]
x=0; slots=[]
for _ in LEFT: slots.append(x); x+=rest+GUT
ox=x; x+=SW+GUT
for _ in RIGHT: slots.append(x); x+=rest+GUT
crop_cx={"B4-river-take1":0.62,"B6-excavator-take1":0.45,"B3-valve-take1":0.42,"B5b-gas-take1":0.5,"B2-chase-take2":0.5}
order=LEFT+RIGHT
ease=lambda u: u*u*(3-2*u)
def strip(seq,i,cx,w):
    f=seq[min(i,len(seq)-1)]; c=int(cx*W); x0=min(max(c-w//2,0),W-w); return f[:,x0:x0+w]
T_FULL,T_MOVE,T_HOLD=2.0,0.4,3.1
out=[]; N=int((T_FULL+T_MOVE+T_HOLD)*FPS)
for i in range(N):
    t=i/FPS; of=office[min(i,len(office)-1)] if i<len(office) else office[len(office)-1]
    if t<T_FULL:
        out.append(of); continue
    u=ease(min(1,(t-T_FULL)/T_MOVE))
    # the full office frame slides so that its strip lands at ox, while it narrows from full width to SW
    frame=np.full((H,W,3),PAPER,np.uint8)
    si=i-int(T_FULL*FPS)                          # side clips start when the move starts
    for n,sx in zip(order,slots):
        frame[:,sx:sx+rest]=strip(side[n],si,crop_cx[n],rest)
    left_src=int((OX-SW//2)*u); right_src=int(W-(W-(OX+SW//2))*u)      # visible part of the office frame
    dst_l=int(ox*u)+int(0*(1-u)); w_vis=right_src-left_src
    frame[:,dst_l:dst_l+w_vis]=of[:,left_src:right_src]
    # paper gutters beside the office strip once it has landed
    if u>0.99:
        frame[:,ox-GUT:ox]=PAPER; frame[:,ox+SW:ox+SW+GUT]=PAPER
    out.append(frame)
p=subprocess.Popen(["ffmpeg","-v","error","-y","-f","rawvideo","-pix_fmt","bgr24","-s",f"{W}x{H}","-r",str(FPS),"-i","-","-c:v","libx264","-crf","14","-preset","slow","-pix_fmt","yuv420p",f"{O}/A5-office-strips.mp4"],stdin=subprocess.PIPE)
for f in out: p.stdin.write(f.tobytes())
p.stdin.close(); p.wait(); print("frames",len(out),"slots",slots,"office at",ox)
