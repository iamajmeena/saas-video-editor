#!/usr/bin/env python3
"""transcribe.py — Hinglish-safe word timestamps (glyph-motions rules baked in).

  python scripts/transcribe.py audio_or_video.mov --out project/ [--prompt "Product names, comma separated"] [--lang hi]

Rules (learned the hard way, see GOTCHAS.md):
  * faster-whisper large-v3-turbo, language hi, cpu/int8, beam 5, NO VAD, condition_on_previous_text=False
  * VAD drops real speech; one word can be stretched over a lost span -> any word > 1.5 s or any gap > 1.0 s is
    re-transcribed from an overlapping chunk (with the optional --prompt of DOMAIN words only; never put the answer
    you expect, e.g. a list of day numbers, in the prompt) and merged back.
  * Product names get misheard (Muse bot/board, OneTake/one tech, personal inbox/box): ALWAYS show the transcript
    to the user and confirm names before building.
Outputs: <out>/transcript_words.json  [{word,start,end}], <out>/transcript.txt (readable, timestamped), <out>/flags.txt
"""
import argparse, json, os, subprocess, sys, tempfile
os.environ.setdefault("PYTHONUTF8", "1")
from faster_whisper import WhisperModel

LONG_WORD, GAP = 1.5, 1.0


def to_wav(src, dst, ss=None, t=None):
    cmd = ["ffmpeg", "-v", "error", "-y"]
    if ss is not None: cmd += ["-ss", str(ss)]
    if t is not None: cmd += ["-t", str(t)]
    subprocess.run(cmd + ["-i", src, "-ac", "1", "-ar", "16000", dst], check=True)


def run(model, wav, lang, prompt, offset=0.0):
    segs, _ = model.transcribe(wav, language=lang, beam_size=5, vad_filter=False, word_timestamps=True,
                               condition_on_previous_text=False, initial_prompt=prompt or None)
    return [{"word": w.word.strip(), "start": round(w.start + offset, 3), "end": round(w.end + offset, 3)}
            for s in segs for w in (s.words or [])]


def suspicious(words, dur):
    bad = []
    for i, w in enumerate(words):
        if w["end"] - w["start"] > LONG_WORD: bad.append((w["start"] - 1.0, w["end"] + 1.0, f"word '{w['word']}' lasts {w['end']-w['start']:.1f}s"))
        if i and w["start"] - words[i - 1]["end"] > GAP: bad.append((words[i - 1]["end"] - 1.0, w["start"] + 1.0, f"gap {w['start']-words[i-1]['end']:.1f}s"))
    if words and dur - words[-1]["end"] > 3: bad.append((words[-1]["end"] - 1.0, dur, "tail not transcribed"))
    return bad


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("src"); ap.add_argument("--out", default="."); ap.add_argument("--lang", default="hi")
    ap.add_argument("--prompt", default=""); ap.add_argument("--model", default="large-v3-turbo"); a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)
    tmp = tempfile.mkdtemp(); wav = os.path.join(tmp, "a.wav"); to_wav(a.src, wav)
    dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", wav]).decode().strip())
    model = WhisperModel(a.model, device="cpu", compute_type="int8")
    words = run(model, wav, a.lang, a.prompt)
    flags = []
    for (s, e, why) in suspicious(words, dur):
        s, e = max(0, s), min(dur, e)
        cw = os.path.join(tmp, "c.wav"); to_wav(a.src, cw, ss=s, t=e - s)
        new = run(model, cw, a.lang, a.prompt, offset=s)
        if new:
            words = [w for w in words if not (w["start"] >= s and w["end"] <= e)] + new
            words.sort(key=lambda w: w["start"]); flags.append(f"re-transcribed {s:.1f}-{e:.1f}s ({why}) -> {len(new)} words")
    left = suspicious(words, dur)
    flags += [f"STILL SUSPICIOUS {s:.1f}-{e:.1f}s: {why} — ask the user / listen" for s, e, why in left]
    json.dump(words, open(os.path.join(a.out, "transcript_words.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    lines, cur, t0 = [], [], None
    for w in words:
        if t0 is None: t0 = w["start"]
        cur.append(w["word"])
        if w["word"][-1:] in ".?!।" or len(cur) >= 14:
            lines.append(f"[{t0:6.2f}] {' '.join(cur)}"); cur, t0 = [], None
    if cur: lines.append(f"[{t0:6.2f}] {' '.join(cur)}")
    open(os.path.join(a.out, "transcript.txt"), "w", encoding="utf-8").write("\n".join(lines) + "\n")
    open(os.path.join(a.out, "flags.txt"), "w", encoding="utf-8").write("\n".join(flags) + "\n")
    print("\n".join(lines)); print(f"\n{len(words)} words, duration {dur:.1f}s, last word {words[-1]['end']:.1f}s" if words else "no words")
    print("\n".join(flags) if flags else "no flags")


if __name__ == "__main__":
    sys.exit(main())
