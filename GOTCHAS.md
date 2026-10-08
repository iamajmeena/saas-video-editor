# GOTCHAS — errors & fixes (append the moment they happen)

- Windows: PYTHONUTF8=1 always; ffprobe one file per call; forward slashes in python strings; big scripts via Write tool not heredoc; CRLF files; output filename must differ from input by more than case.
- Whisper: VAD drops speech; one word stretched over lost span -> check duration >1.5 s, rechunk with overlap; expected-answer initial_prompt hallucinates.
- onetake: look.py needs comp.html + fonttools/brotli; verify_promo uses 1920x1080 for portrait (wrap collect); oracle rest/quiet legs fail on talking-head/continuous narration (expected, report it); Claude browser pane shows static snapshot (no JS) - judge via mp4 / real Chrome.
- JS: temporal-dead-zone (const declared after use in same scope) not caught by __seek alone - probe __track too; `node --check` after regex patches; re.sub slice bug.
- CSS: background-clip:text on parent breaks inline-block children; leaf-only 3D layers; element created without parent lands after #cam (insert ground as firstChild); resetting display wipes inline flex; 256px noise stretched = blocky (use createPattern).
- morphRect clamps to source rect before start (item visible early) -> gate on start; maskRise partly visible pre-start -> gate on voice time.
- Blender: wall plane vs object y; area lights visible in glossy -> visible_glossy False; unlit emission for screens; output path joined to script folder.
- Never edit another agent's in-progress folder.
