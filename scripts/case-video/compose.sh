#!/bin/zsh
# Usage: compose.sh <recDir> <out.mp4>
# Turns timestamped frames into a 60 fps 1920x1080 H.264 video: the
# 1600x900 page sits on a neutral backdrop with rounded corners and a
# soft shadow, matching the framed look of the existing case-study reels.
set -e
S=${0:A:h}
REC=$1
OUT=$2

# Backdrop + mask are built once.
if [[ ! -f $S/bg.png || ! -f $S/mask.png ]]; then
python3 - "$S" <<'PY'
import sys
from PIL import Image, ImageDraw, ImageFilter
S = sys.argv[1]
W, H, w, h, r = 1920, 1080, 1600, 900, 18
x0, y0 = (W - w) // 2, (H - h) // 2
bg = Image.new("RGB", (W, H))
top, bot = (238, 236, 232), (222, 219, 213)
d = ImageDraw.Draw(bg)
for y in range(H):
    k = y / (H - 1)
    d.line([(0, y), (W, y)], fill=tuple(int(top[i] + (bot[i] - top[i]) * k) for i in range(3)))
sh = Image.new("L", (W, H), 0)
ImageDraw.Draw(sh).rounded_rectangle([x0, y0 + 14, x0 + w, y0 + h + 14], r, fill=90)
sh = sh.filter(ImageFilter.GaussianBlur(28))
bg = Image.composite(Image.new("RGB", (W, H), (60, 56, 50)), bg, sh)
bg.save(f"{S}/bg.png")
m = Image.new("L", (w, h), 0)
ImageDraw.Draw(m).rounded_rectangle([0, 0, w - 1, h - 1], r, fill=255)
m.save(f"{S}/mask.png")
PY
fi

# Concat list with real per-frame durations from the screencast timestamps.
python3 - "$REC" <<'PY'
import json, sys, os
rec = sys.argv[1]
t = json.load(open(os.path.join(rec, "timestamps.json")))
endp = os.path.join(rec, "end.json")
end = json.load(open(endp)) if os.path.exists(endp) else None
with open(os.path.join(rec, "list.txt"), "w") as f:
    for i in range(len(t)):
        d = (t[i + 1] - t[i]) if i + 1 < len(t) else ((end - t[i]) if end else 1 / 60)
        f.write(f"file 'f{i:05d}.jpg'\nduration {max(d, 1/240):.5f}\n")
    f.write(f"file 'f{len(t)-1:05d}.jpg'\n")
PY

DUR=$(python3 -c "import json,os;t=json.load(open('$REC/timestamps.json'));e=json.load(open('$REC/end.json')) if os.path.exists('$REC/end.json') else t[-1]+1/60;print(round(e-t[0],3))")

# Mask and backdrop are single still images reused for every frame
# (the loop inputs are capped by -t, so the encode ends with the page).
ffmpeg -v error -y \
  -f concat -safe 0 -i "$REC/list.txt" \
  -loop 1 -t "$DUR" -i "$S/bg.png" \
  -loop 1 -t "$DUR" -i "$S/mask.png" \
  -filter_complex "[0:v]fps=60,scale=1600:900,format=rgba[pg];[2:v]fps=60,format=gray[m];[pg][m]alphamerge[win];[1:v]fps=60[b];[b][win]overlay=160:90:shortest=1,format=yuv420p[v]" \
  -map "[v]" -t "$DUR" -c:v libx264 -preset medium -crf 24 -maxrate 3M -bufsize 6M -profile:v high -r 60 -movflags +faststart -an "$OUT"

ffprobe -v error -show_entries stream=width,height,r_frame_rate:format=duration,size -of compact "$OUT"
