# WORKFLOW — a new video, start to finish (what Claude does)

0. Read `RULES.md`, `GOTCHAS.md`. Everything is built in onetake style (comp.html pure f(t) + OM moves + shutter render).
1. `python scripts/new_reel.py <Name> <source>`  -> project + face frames + audio + transcript (+ flags.txt).
2. Show the cleaned transcript with timestamps. Resolve every line in `flags.txt` (lost speech / stretched words).
3. Beat plan: per time range -> layout (fullscreen face / circle / split / PIP / full-width recording / tilted cards), what is built, which spoken word triggers it, where the camera goes, how each beat CARRIES into the next. Hook = densest beat.
4. Ask the user ONE message: product names (confirm spellings), links, screenshots/recordings, style, safe zone platform.
5. Reference deconstruction if the user gave refs: `python scripts/analyze_ref.py ref.mp4 --out ana/` (read sheets, not 60 frames).
6. Build BEAT 1 only: edit `<Name>/comp.html` (start from the starter), `python scripts/vstills.py` contact sheet -> fix -> 5-9 s trial
   `render.py --width 1080 --height 1920` -> `make_preview.py` -> user approves -> next beat. Log every correction in `CORRECTIONS.md` at once.
7. Full 1080p -> approval -> 4K (`--scale 2` / `--final`), exported with a clear name; original audio untouched; no SFX unless asked.

YouTube / 16:9: same loop with `--width 1920 --height 1080`; use `templates/comp.html` (landscape) as the base, chapters as beats, longer holds;
safe areas = title-safe 5%. Add what you learn to `RULES.md` (this section is new — first long-form video will refine it).
