# SaaS Video Editor (glyph-motions) — living knowledge base & Claude skill

## Preview
Built with this skill (silent GIFs, real renders live in the source projects):

| Series ident (real 3D icons) | Product ad (morph chain) | Reel hook (dense, face + real UI) |
|---|---|---|
| ![ident](media/ddr-ident.gif) | ![ad](media/screenlark-ad.gif) | ![hook](media/reel-hook.gif) |

Goal: grow this folder, reel by reel, until it can be packaged as our own Claude skill
(final name: **glyph-motions**) — a derivative of the
`onetake` skill (`~/.claude/skills/onetake`) with the user's rules, taste and corrections baked in.

## Standing rule
EVERY animation / motion graphic / ad is built with the **onetake skill, in depth**.
While doing so, every new learning is written HERE immediately (not just in `../learnings.md`).

## Files (append-only logs + curated rules)
| File | What goes in | When to write |
|---|---|---|
| `RULES.md` | Curated, deduplicated rules (the future SKILL.md body). Each rule: statement, why, source tag. | Whenever a rule is new or sharpened |
| `CORRECTIONS.md` | Every user correction: what I did -> what user said -> rule it produced. | Right after any feedback/rejection/approval |
| `REFERENCES.md` | Videos/links/screenshots the user supplied + measured analysis (analyze_ref numbers, look, moves). | When user shares a ref or I analyze one |
| `TECHNIQUES.md` | Working onetake recipes (camera, morph, glass, face-as-jpg-seq, render flags, ...). | When something works |
| `GOTCHAS.md` | Bugs/failed attempts + fix (Windows, CSS 3D, onetake, ffmpeg...). | The moment an error happens |

## How an entry looks
`- [YYYY-MM-DD · reelN/source] text` — keep one fact per bullet. Promote stable facts into `RULES.md`.

## Packaging into a skill (later)
1. Freeze RULES.md -> SKILL.md (protocol + rules), TECHNIQUES.md + GOTCHAS.md -> references/.
2. Ship own `lib/` additions (e.g. glass panels, words(), face jpg-seq loader, camera-to-click helper) as `lib/glyph.js`.
3. Keep onetake's LICENSE (PolyForm Noncommercial 1.0.0) and author credit (Patrick / feitangyuan) — it is a derivative;
   check the license before any commercial/public distribution.
4. Test on a fresh reel; the user approves; only then publish/install to `~/.claude/skills/`.

## Credit
Derivative workflow of the `onetake` skill by Patrick (github.com/feitangyuan/onetake), PolyForm Noncommercial 1.0.0. This repo holds only notes/rules, not onetake code.

## Contents now
`SKILL.md` (entry) · `lib/` (onetake motion.js + ui_kit.js + our glyph.js) · `scripts/` (render, stills, vstills, probe, analyze_ref, ...) ·
`templates/` · `references/` (onetake docs) · `examples/` (Juno, DDR, Screenlark build code, no media) · `LICENSE` + `NOTICE`.
