# GOTCHAS — errors & fixes (append the moment they happen)

- Windows: PYTHONUTF8=1 always; ffprobe one file per call; forward slashes in python strings; big scripts via Write tool not heredoc; CRLF files; output filename must differ from input by more than case.
- Whisper: VAD drops speech; one word stretched over lost span -> check duration >1.5 s, rechunk with overlap; expected-answer initial_prompt hallucinates.
- onetake: look.py needs comp.html + fonttools/brotli; verify_promo uses 1920x1080 for portrait (wrap collect); oracle rest/quiet legs fail on talking-head/continuous narration (expected, report it); Claude browser pane shows static snapshot (no JS) - judge via mp4 / real Chrome.
- JS: temporal-dead-zone (const declared after use in same scope) not caught by __seek alone - probe __track too; `node --check` after regex patches; re.sub slice bug.
- CSS: background-clip:text on parent breaks inline-block children; leaf-only 3D layers; element created without parent lands after #cam (insert ground as firstChild); resetting display wipes inline flex; 256px noise stretched = blocky (use createPattern).
- morphRect clamps to source rect before start (item visible early) -> gate on start; maskRise partly visible pre-start -> gate on voice time.
- Blender: wall plane vs object y; area lights visible in glossy -> visible_glossy False; unlit emission for screens; output path joined to script folder.
- Never edit another agent's in-progress folder.
- [2026-10-08 · DDR Day 04] Portrait contact sheets alone missed wrapped-caption extent. Measure actual DOM bounds including all spans; first layout reached y1522, fixed to y1477. Stop only your own render before modifying a composition, then restart. Moving recording windows require per-segment viewer crops and a checked final frame.
- [2026-10-08 · DDR Day 04] Official render.py stopped with BrokenProcessPool after 230/269 frames. Use its built-in --resume with unchanged comp/settings, 2 workers and --recycle 20 to keep existing shutter-rendered frames. Resume render metadata counters describe only the resumed captures, not the total captures across both runs.
- [2026-10-08 · DDR full seek QA] Compare active DOM layers only. Hidden sub-compositions retain stale styles harmlessly; including them yields false deterministic failures. Check the visible ident, prelude or demo depending on master time.
- [2026-10-08 · DDR Day 04 audio] MOV format/video duration can differ from PCM audio duration: day_04 is 2.333333 s picture but 2.320 s voice. Measure audio samples, not format duration, when concatenating. Full voice is sample-identical to sources at 29.796667 s; 894 video frames run 29.800 s.
- [2026-10-08 · saas-video-editor test] new_reel.py ran fine from the installed skill (4K 24fps -> 1080x1920 30fps frames 1318 in ~1 min; transcribe on CPU a few minutes). When started with `&` inside a background Bash job, the job reports "completed" immediately — wait on the output files (transcript.txt) with a Monitor instead.
- [2026-10-08 · DDR Day 2 skill test] Stills caught: two words written side by side overlapped (measure text width; place 2nd word by measureText or far enough), a formBox keeps drawing its final rect after the morph away (stop calling it after the morph start), initial camera zoom 1.2 cropped the headline (keep <=1.1 when text is in the top band).

## 2026-10-08
- ffmpeg piping the .mov audio straight into numpy returned empty (container has extra data streams); use a pre-extracted wav (-vn -ac 1 -ar 16000) for RMS dip measurements.
- 4K onetake renders: hook 184 frames ~12 min and body 1027 frames ~31 min with 8 workers; use --workers 5 --recycle 60 when other jobs run, and --resume on crash.
