# RULES — curated (seed from reels 1-5, Juno, Screenlark, DDR; 2026-10-08)

## 0. Tooling law
1. ALL animation = onetake skill, deep (comp.html pure f(t) + OM moves + camera + shutter render.py). Never hand-rolled PIL/numpy as the deliverable (user, said twice; film5.py rejected). If something was not made with it, say so honestly.
2. Protocol: read learnings -> reference deconstruction (analyze_ref) -> 3 concepts, user picks -> beat sheet with carry -> stills (contact sheet) -> short trial -> approval -> full render -> 4K.
3. Trial first (5-9 s), light preview copy (crf 21, maxrate 8M, level 4.1, yuv420p, faststart); finals CRF 12-16. 1080p first; 4K only after "final done" -> `D:\claude\5 oct reel\export_4K\reelN_<topic>_4K.mp4`.
4. Don't touch audio (no volume/peak fixes). No SFX unless asked (user does sound design). Original voice kept.

## 1. Process for a new reel
5. Transcribe immediately (faster-whisper large-v3-turbo, hi, cpu/int8, no VAD, beam 5, condition_on_previous_text False); check word duration >1.5 s and re-transcribe lost ranges; never put the expected answer in initial_prompt.
6. Show cleaned transcript -> beat plan -> ONE message of questions (names, links, assets) -> build beat 1 as trial -> approve -> continue.
7. Confirm product names with user (Whisper: "Muse board"->Muse bot, "one tech"->OneTake, "personal box"->personal inbox). Hinglish "rakho" = KEEP.

## 2. Look
8. Original UIs only (real screenshots/recordings). Exception: Claude's own UI is rebuilt by hand; Screenlark UI replicas allowed because user said so explicitly.
9. Glass (frosted, translucent) as main panel style; overlays over translucent items need an opaque backing.
10. Background: ONLY the gradient moves (drifting glows/light sweep). NO particles/dots. Dark gradients band -> render low-res field, cubic upscale + grain.
11. Instagram safe zone: x 40-940, y 255-1295 (hard limit y 200-1450). Keep graphics OFF the speaker's face.
12. Premium = restrained: not "something everywhere"; logo plate appears only for the reveal then lifts away.

## 3. Motion
13. HOOK = densest, most advanced, smoothest part of the reel ("khat-khat-khat" streams, kinetic type, morphs, camera moves).
14. VARIETY of layouts per beat (fullscreen face, circle, split, PIP, full-width recording, tilted cards, blurred recording bg). Never copy the previous reel's recipe. More face time (+10-15%), face not required at start.
15. Every layout change is CARRIED by a morphing container (nothing just replaces anything). Soft smootherstep entrances (ad t80~0.8), not springs.
16. CAMERA travels to every click (pan + zoom + slight 3D tilt), then settles; perspective changes each beat (alternating ~±4° rotateX/Y + perspective(1700px)).
17. BUILD progressively: glass box forms -> items one by one -> text written word by word on the spoken word; calendars/lists cell by cell; UIs build from an empty shell (not moving a finished panel).
18. Visible cause for every action (big cursor enters, presses, target reacts). Click lands AFTER the spoken word.
19. Real shutter motion blur; thin fast strokes need denser samples (--gap 1.5, samples 6-40).

## 4. Rendering hygiene
20. Look at stills before every render; `node --check` patched JS; Windows filenames are case-insensitive (never output name differing only by case from input).
21. If 4K renders, don't also render 1080 concurrently.
22. Never grab the full screen casually (private chats). Never edit files in another agent's in-progress folder (read-only copy).
