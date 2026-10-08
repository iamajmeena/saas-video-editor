# TECHNIQUES — onetake recipes that worked (append)

- Real video inside comp: ffmpeg -> jpg sequence (`-r 24/30 -q:v 4`), set img.src by frame index in __seek, await decode; never `<video>`. Circle/rounded crops via border-radius/clip-path. Circle must show whole head (head centre ~(555,560), 400px tall; circle 420 -> s~1.25).
- Camera: OM.camera keyed; per click c: neutral c-1.1, focus c-0.22 (zoom ~1.62, 80% to target), hold to c+0.55, neutral c+1.35. World through OM.view(cam); bg depth 1.4 for parallax. Add window.__motion CAMMOVES so shutter budget is right; __meta.inFrame={}.
- Perspective: canvas transform `perspective(1700px) rotateX() rotateY() scale(1.045)`; alternate ±4.2° per scene, eased across transitions.
- Glass: translucent rgba fill + white top highlight gradient + 1.5px border + soft shadow; opaque backing for overlays.
- Progressive build: words(t,[[word,start]...]); gbox/gchip via morphRect from small pill + blur-in; counters roll on the spoken word; typed prompts per spoken word.
- Torch/lit-region: dim div with evenodd clip-path hole over target + white rim + SVG beam from above frame.
- UI rebuild: author in 1920x1080 DOM, scale by transform; arrive(el,{dist,axis}) quartOut stagger, sweep() clip-path wipe, typeOn(cps 65), inspector lift (rotateY -7, rotateZ -2, scale 2.4).
- Hook recipe: scan beam + 18 real-UI tiles popping as beam crosses rows, logo flies into pill (carry), push-in on face.
- Face states keyed (full / circle / split / PIP) with morphRect; screen card z-index above face when face is FULL.
- Blender -> onetake handoff: bake poses from OM-sampled values; track 3D logo with world_to_camera_view; emission material for screens.
- Render: `python ~/.claude/skills/onetake/scripts/render.py X.html --out X.mp4 --width 1080 --height 1920 --fps 30 --workers 8 --samples-min 6 --samples-max 40 --gap 1.5 --crf 14`; vertical stills via custom vstills.py (stills.py is 16:9); segment trials via window.__T0 offset.
- Timings seen: 6.8 s trial 43 s; 70 s full ~30-40 min on 8 workers.
- [2026-10-08 · DDR Day 04] Shared ResolveUI Color-page extension in ddr_series/lib/resolve-color-ui.js/css: progressive effect search, pointer carries effect onto node, Settings morph, Strength 0.500→1.000. Source refs 144/148/180 s; viewer is cropped original recording. Word captions use 0.30 s quintOut fade-up/blur; maximum wrapped caption bottom measured at y1477.
- [2026-10-08 · DDR Day 04 full] Reuse approved demo render; render only the added hook/body. Embed original ident HTML in same-origin iframe srcdoc with a base href and only day-number substitution. Await its __ready, then seek it on the master clock; time-warp graphics to original day voice instead of padding silence. Remux one continuous original voice track after video concat.
- [2026-10-08 · DDR Day 2 skill test] Beat 1 built with the installed skill: reel02_skill/beat1.html (canvas + GM.words/formBox/glass/applyTilt + OM.camera/morphRect). Hook = scan beam + 24 real Resolve-page crop tiles popping per row, then all tiles carry (fly+shrink) into ONE glass card that forms on the face; strip of real timeline wipes in, clips flip to MEDIA OFFLINE on the spoken word, card morphs into a top-band pill. Face jpg frames from new_reel.py, blurred+dimmed under the tile field then clears. Trial render 228 frames/912 captures/134 s on 6 workers, no page errors.

## Before/after object-removal reveal (DDR Day 5)
- Take the "after" frame, paste the object patch from an earlier "before" frame (aligned by the offset of a fixed landmark, e.g. the red poster bbox) so the presenter pose is identical and ONLY the object changes. Reveal = clip-path: circle(r at objectScreenPos) on the "after" layer, r eased 0->300 px, plus two SVG rings at the same radius; viewer/recording crops stay at native resolution.
- Camera over a real recording still/clip: clamp the camera centre to the real-UI area per world (lim [x0,x1,y0,y1]) and use a zoom high enough that the card window fits inside it, otherwise wallpaper/taskbar bands show. Crossfade windows of consecutive layers must overlap.
- Stable windows in a screen recording: 10 fps 160x90 frame-diff, keep runs < 2-3 diff for >= 2 s; recorder zoom animations are real recording but can contain wallpaper, so avoid or clamp.
- 4K onetake: default workers (cores-2, max 8) is ~1.5x faster than a cautious 5; on crash use --resume. Concat finished 4K segments with `ffmpeg -f concat -c copy` (same codec params from render.py) instead of re-encoding.
