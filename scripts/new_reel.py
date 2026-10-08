#!/usr/bin/env python3
"""new_reel.py — scaffold a project for a NEW video in one command.

  python scripts/new_reel.py MyReel path/to/source.mov [--w 1080 --h 1920] [--fps 30] [--no-transcribe] [--prompt "domain words"]

Creates MyReel/ with: comp.html (starter from templates/reel9x16), lib/ (motion.js, ui_kit.js, glyph.js),
face/f0001.jpg... (frames of the source at --fps, scaled to --w x --h, for img.src-by-frame — never <video>),
audio.wav, transcript_words.json + transcript.txt (+flags.txt) unless --no-transcribe.
Then follow WORKFLOW.md: show the transcript, plan beats, ask the user, build beat 1 as a trial.
"""
import argparse, os, shutil, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)


def sh(cmd): subprocess.run(cmd, check=True)


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("name"); ap.add_argument("src")
    ap.add_argument("--w", type=int, default=1080); ap.add_argument("--h", type=int, default=1920); ap.add_argument("--fps", type=int, default=30)
    ap.add_argument("--no-transcribe", action="store_true"); ap.add_argument("--prompt", default=""); a = ap.parse_args()
    p = a.name; os.makedirs(os.path.join(p, "face"), exist_ok=True); os.makedirs(os.path.join(p, "lib"), exist_ok=True)
    for f in ("motion.js", "ui_kit.js", "glyph.js"): shutil.copy(os.path.join(ROOT, "lib", f), os.path.join(p, "lib", f))
    shutil.copy(os.path.join(ROOT, "templates", "reel9x16", "comp.html"), os.path.join(p, "comp.html"))
    sh(["ffmpeg", "-v", "error", "-y", "-i", a.src, "-vf", f"scale={a.w}:{a.h}", "-q:v", "4", "-r", str(a.fps), os.path.join(p, "face", "f%04d.jpg")])
    sh(["ffmpeg", "-v", "error", "-y", "-i", a.src, "-ac", "1", "-ar", "16000", os.path.join(p, "audio.wav")])
    n = len([f for f in os.listdir(os.path.join(p, "face")) if f.endswith(".jpg")])
    print(f"{p}/ ready: {n} face frames @ {a.fps} fps. In comp.html set FACE={{dir:'face/',count:{n},fps:{a.fps}}} (frame = floor(t*fps)+1).")
    if not a.no_transcribe:
        sh([sys.executable, os.path.join(HERE, "transcribe.py"), a.src, "--out", p] + (["--prompt", a.prompt] if a.prompt else []))
    print("NEXT: show transcript.txt to the user, make the beat plan, ask everything unclear in ONE message (names, links, assets).")


if __name__ == "__main__":
    main()
