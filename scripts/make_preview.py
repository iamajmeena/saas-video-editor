#!/usr/bin/env python3
"""make_preview.py — light playable copy and README GIF from a render.

  python scripts/make_preview.py film.mp4                      # film_preview.mp4 (crf21, 8M cap, level 4.1, faststart)
  python scripts/make_preview.py film.mp4 --gif --ss 3 --t 4   # film_3s.gif  (400px, 12fps, 160 colours ~2 MB)

Why: CRF 12-14 trial renders (22+ Mbps) do not play in the user's player -> always give a preview.
Output name is always different from the input by more than case (Windows is case-insensitive).
"""
import argparse, os, subprocess

ap = argparse.ArgumentParser(); ap.add_argument("src"); ap.add_argument("--gif", action="store_true")
ap.add_argument("--ss", type=float, default=0); ap.add_argument("--t", type=float, default=0); ap.add_argument("--width", type=int, default=400)
ap.add_argument("--fps", type=int, default=12); ap.add_argument("--out", default=None); a = ap.parse_args()
base = os.path.splitext(a.src)[0]
trim = (["-ss", str(a.ss)] if a.ss else []) + (["-t", str(a.t)] if a.t else [])
if a.gif:
    out = a.out or f"{base}_{int(a.ss)}s.gif"
    vf = f"fps={a.fps},scale={a.width}:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=160:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=3:diff_mode=rectangle"
    subprocess.run(["ffmpeg", "-v", "error", "-y", *trim, "-i", a.src, "-vf", vf, "-an", out], check=True)
else:
    out = a.out or f"{base}_preview.mp4"
    subprocess.run(["ffmpeg", "-v", "error", "-y", *trim, "-i", a.src, "-c:v", "libx264", "-crf", "21", "-maxrate", "8M", "-bufsize", "16M",
                    "-profile:v", "high", "-level", "4.1", "-pix_fmt", "yuv420p", "-g", "30", "-movflags", "+faststart", "-c:a", "aac", out], check=True)
assert os.path.abspath(out).lower() != os.path.abspath(a.src).lower()
print(out, round(os.path.getsize(out) / 1e6, 1), "MB")
