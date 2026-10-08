# Edit v2: ChatGPT's silence-cut EDL + two holds for the new 5.85 s day ident.
# Hold 1 (2.45 s) after "...DaVinci Resolve" (src 6.62), hold 2 (1.0 s) after "Day 1" (src 7.6696).
import json, wave
import numpy as np
from pathlib import Path
R = Path(__file__).resolve().parent
e = json.loads((R / 'edit.json').read_text())
HOLDS = [(6.84, 2.45), (7.72, 1.0)]
for k in e['keeps']:
    if abs(k['srcEnd'] - 7.669562) < 1e-4: k['srcEnd'] = 7.72  # keep the natural decay of 'Day 1'
keeps = []
for k in e['keeps']:
    parts = [[k['srcStart'], k['srcEnd']]]
    for hs, _ in HOLDS:
        new = []
        for a, b in parts:
            if a < hs < b - 1e-6: new += [[a, hs], [hs, b]]
            else: new.append([a, b])
        parts = new
    keeps += parts
out, t, gaps = [], 0.0, []
for a, b in keeps:
    out.append({'srcStart': a, 'srcEnd': b, 'start': t, 'end': t + b - a}); t += b - a
    for hs, hd in HOLDS:
        if abs(b - hs) < 1e-4:
            gaps.append([t, t + hd]); t += hd
edl = {'duration': t, 'keeps': out, 'holds': gaps, 'note': 'edit.json + ident holds'}
(R / 'edit2.json').write_text(json.dumps(edl, indent=1))
(R / 'edit2.js').write_text('window.EDIT=' + json.dumps(edl) + ';', encoding='utf-8')
with wave.open(str(R / 'assets/source.wav')) as w:
    p = w.getparams(); sr = w.getframerate()
    x = np.frombuffer(w.readframes(w.getnframes()), np.int16).reshape(-1, 2).astype(np.float32)
y = np.zeros((int(round(t * sr)) + 10, 2), np.float32)
for k in out:
    a = x[round(k['srcStart'] * sr):round(k['srcEnd'] * sr)].copy()
    fi = 1920 if any(abs(k['srcStart'] - h) < 1e-4 for h, _ in HOLDS) else 144   # 40 ms soft edge next to a hold
    fo = 1920 if any(abs(k['srcEnd'] - h) < 1e-4 for h, _ in HOLDS) else 144
    a[:fi] *= (np.sin(np.linspace(0, np.pi / 2, fi)) ** 2)[:, None]; a[-fo:] *= (np.cos(np.linspace(0, np.pi / 2, fo)) ** 2)[:, None]
    s0 = round(k['start'] * sr); y[s0:s0 + len(a)] += a
with wave.open(str(R / 'assets/voice2.wav'), 'wb') as w:
    w.setparams(p); w.writeframes(np.clip(y, -32767, 32767).astype(np.int16).tobytes())
print('duration', t, 'holds', gaps)
