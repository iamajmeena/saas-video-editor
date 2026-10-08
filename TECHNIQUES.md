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
