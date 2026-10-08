---
name: glyph-motions
license: PolyForm Noncommercial 1.0.0 (derivative of onetake — see LICENSE / NOTICE)
description: "Build short vertical (9:16) reels, ads and product motion graphics the glyph-motions way — onetake's deterministic HTML composition + shutter-blur render pipeline, plus a hard-won rule set: camera that travels to every click, 3D perspective that changes per beat, glass panels that FORM, text written word-by-word on the spoken word, a hook that is the densest edit, layout variety, Instagram safe zone, real UIs. Use for any animation / motion graphic / ad / reel for a talking-head or product, Hinglish voice-driven cuts, and when the user says 'one take', 'glyph', 'animation', 'ad', 'reel graphics'."
---

# glyph-motions

onetake (Patrick, feitangyuan/onetake) is the engine; glyph-motions is the taste. Read `RULES.md` first — it is the
curated list of rules that came from real corrections. Then `TECHNIQUES.md`, `GOTCHAS.md`. `CORRECTIONS.md` and
`REFERENCES.md` are the evidence logs.

## Layout of this skill
- `lib/motion.js`, `lib/ui_kit.js` — onetake's move library (window.OM). `lib/glyph.js` — ours (window.GM): `cameraToClicks`,
  `applyTilt`, `glass`, `formBox`, `chip`, `words`, `wordList`, `rollTo`, `frameIndex`, `motionBudget`.
- `scripts/` — onetake's `render.py` (frame-by-frame + shutter blur), `stills.py`, `probe.py`, `verify_promo.py`, `analyze_ref.py`,
  `look.py`, `sfx_palette.py`, `vo_tools.py`; ours: `vstills.py` (vertical contact sheet; stills.py is 16:9 only).
- `templates/comp.html` — starting composition. `references/*.md` — onetake's docs (composition, motion-library, rhythm, sound, product-demo, reference-deconstruction).
- `examples/` — real builds (code only, no media): `juno/` (patching a ChatGPT film to v2 with camera+glass+words),
  `ddr/` (series ident with real-3D icons + reel comp), `screenlark/` (shared kit sl.js, 3 concepts, morph-chain ad B2, UI-rebuild Q1).

## Protocol (in order, no skipping)
1. Read RULES.md + GOTCHAS.md. New reel? Transcribe immediately (rule 5), show cleaned transcript + timestamps.
2. Beat-by-beat plan (layout per range: face / split / fullscreen / recording; voice-synced). Ask everything unclear in ONE message.
3. Reference deconstruction (`analyze_ref.py`) -> 3 distinct concepts -> user picks.
4. Beat sheet with CARRY (one container morphs through beats; nothing just replaces).
5. `stills` (use `vstills.py` for 9:16) -> 5-9 s trial -> light preview copy -> approval -> next beat.
6. Full render 1080p -> approval -> 4K. Log every correction/learning into this folder immediately.

## Non-negotiables (short form; full list in RULES.md)
- Everything is a pure function of time; real video only as jpg sequence; never `<video>`.
- Camera travels to every click; perspective tilts differently each beat; shutter blur on fast moves.
- Glass boxes form first, items appear one by one, text is written on the spoken word.
- Hook = most advanced part. Variety of layouts. Gradient-only moving background (no particles). Nothing on the face.
- Safe zone x 40-940, y 255-1295. Original UIs only. Do not touch the audio; no SFX unless asked.

## Minimal use of lib/glyph.js
```js
const { keys, moves } = GM.cameraToClicks([{ at: 42.62, x: 786, y: 240 }]);
const cam = OM.camera(t, keys, { W: 1080, H: 1920 });
GM.applyTilt(canvas, cam, beatIndex, k);
GM.formBox(g, t, 36.55, 37.4, {x:395,y:226,w:110,h:64,r:32}, {x:54,y:184,w:792,h:115,r:24});
GM.words(g, t, GM.wordList(transcriptWords, 40, 4), 83, 253, 32, 450, '#fff');
window.__motion = GM.motionBudget(moves);
```
