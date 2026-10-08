# Juno full reel — approved direction, revised treatment

## Scope and assets

User approved the 6.8-second concept and authorized the complete reel. Deliver one continuous 9:16 film at 1080 × 1920 / 30 fps, about 70.17 seconds, with original speech and talking-head footage. Use OneTake and the accepted research → calendar → content transformation, revised to the attached dark/lime reference.

Confirmed local sources:
- `../audio.mp3`: original 70.166938-second voice.
- `../transcript_words.json`: 275 timestamped words.
- `../frames/frame_0001.png` through `frame_2105.png`: extracted talking-head frames. Existing composition maps `floor(t*30)+1`; inspect synchronization before final rendering. Original MOV is absent, but the frame sequence is available.
- `../New folder/preview_vertical_18s.png`: user-supplied color and material reference.
- `../juno_onetake_trial/`: accepted motion concept and local fonts/library.

Pending from user: real Juno images they said they would provide. Existing `bot_standing.png` / `bot_working.png` are previous illustrated assets; do not assume these are the newly requested real images. Real app screenshots/result examples are helpful if supplied, but do not block illustrative graphic sections.

Full render is already authorized. No new concept vote or extra trial approval is required. Finish the full film after required Juno assets arrive.

## Art direction

- Ground: near black `#070A04`, subtle olive depth `#1D2604`.
- Panels: charcoal `#111411` and `#191D15`, broad rounded corners, low-contrast lime edges.
- Accent: electric lime around `#CCFF00`; use for selection, progress, count emphasis, cursor targets and speaker outline.
- Type: off-white `#F4F5EF`; secondary gray `#9B9F94`. Local Geist/Inter; restrained mono for small labels.
- Soft grounded shadows, controlled light on panel edges, sparse glass-like layers. Key text gets an opaque enough ground to remain legible.
- Composition inherits the screenshot's palette/materials, while keeping one dominant action at a time. Its example values 419K, 4K and 280K are not established by the transcript; do not present them as actual results unless the user supplies evidence.

## Speaker placement

Graphics-led mode: circular upper-center portrait, roughly 300–340 px diameter at x≈540, y≈320, with a 4–6 px lime rim. Main graphics occupy approximately x=100–920, y=600–1450. Keep the face, microphone and key text clear of interface overlays.

Speaker-led mode: the same portrait container smoothly grows into a rounded rectangle for personal explanation and CTA. Graphics reduce into adjacent compact objects. Avoid arbitrary repositioning; move the speaker only when the composition needs room.

The actual footage continues in sync throughout. Crop around face/upper torso; do not vertically compress or stretch it. Its container can change radius, dimensions and position while the video content retains aspect ratio. All frame loading is deterministic and awaited before capture. Inspect sample crops early, middle and late because the speaker moves.

## Motion language

- Every important action has a visible cause. Large white cursor enters physically from outside the frame, aligns its tip with the target, compresses on click, then the target reacts.
- Pointer approximately 75 px wide at 1080 px canvas; shadow for contrast. Cursor exits physically or travels to the next action.
- Main transforms use soft ease-in/ease-out with clear acceleration and settling, generally 0.45–0.80 s. Small highlights take 0.15–0.25 s.
- Calendar dates form individually in a directional cascade. In the fast opening, stagger 18–25 ms with overlapping 0.30–0.42 s movement; in the later full calendar explanation, stagger 35–50 ms for a slower readable build.
- Sequence: date settles → selected outline appears → cursor arrives → press → same cell morphs into the larger content card. Target values and timing come from the common timeline.
- Container position, dimensions, radius and inner layout all interpolate. Text reveals from masks once there is enough room, so it does not stretch with the outer rectangle.
- Library moves: `morphRect`, `gather`, `camera`, `maskRise`, `press`, `cursor`. Pure `__seek(t)`, bounded curves, real shutter blur on fast travel.
- Calm graphic holds between sequences; the live speaker naturally remains moving. No forced frozen footage to satisfy a static-scene oracle.

## Whole-reel beat sheet

| Time | Spoken idea | On-screen choreography | Persistent carrier |
|---|---|---|---|
| 0.00–2.12 | Juno researched 300 competitors | Speaker in upper circle. Juno real image/name introduces the field; 300 lands on voice. Compact profile population resolves beneath it. | Juno marker and profile tiles |
| 2.12–3.66 | Research → next month | Lime research sweep groups profiles; groups begin reorganizing into the month. | Leading tile of each group |
| 3.66–4.44 | 30 days of content | Thirty numbered cells build one by one in an overlapping cascade, retaining their group origins. Keep 30 clearly readable. | Same thirty cells |
| 4.44–6.80 | Content in viral categories | One cell highlights, cursor clicks, cell morphs into a content-category detail; Viral lands with the spoken word. | Selected day and pointer |
| 6.86–11.96 | Juno told me what to say | Detail card extends into a script strip. Speaker container enlarges moderately; reading highlight moves through short supplied phrases. | Content card becomes script |
| 11.96–17.44 | Who Juno is / Muse / Meta | Script folds to make room for the user-supplied Juno image. Reveal Juno → Muse → Meta relationship in the order spoken. Treat wording as the supplied narrative. | Juno image and connecting path |
| 17.44–21.68 | Access explanation / prior reels | Connection becomes a compact availability/access panel; speaker takes greater visual prominence during this verbal explanation. | Relationship path and panel |
| 21.80–31.14 | Creative use / connection to content | Cursor activates a connect action; content shapes travel along the same path into an analysis panel. Real screenshot styling only if supplied. | Connect path becomes evidence flow |
| 31.46–35.98 | Analytics: which reel and why | Reel miniatures arrange, one highlights and grows into an evidence detail. Use conceptual comparisons without fabricated view counts. | Selected reel |
| 36.34–42.92 | Competitor research / 300 competitors | Expanded reel compresses into a search/input object. Cursor initiates the narrated example; the profile field grows from this object. | Search result container |
| 43.06–47.58 | Extract content / identify viral patterns | Profile results become content strips; selected patterns gather into a research summary. | Content strips and selected evidence |
| 47.84–51.90 | Make next 30 days of content | Summary widens into the planner. Dates fill one by one with a more generous cascade than in the hook. Speaker stays in its upper circle. | Summary tiles become days |
| 51.90–55.70 | Scripting points / topics | A date highlights, cursor clicks, cell expands into a topic outline. Short labels and abstract lines keep attention on the explanation. | Same date becomes topic card |
| 55.74–59.82 | Instagram / hook / script | Topic header becomes the hook line. At 58.48 s hook emphasis lands; at 59.10 s the same card unfolds into the script structure. | Header and writing surface |
| 59.82–65.92 | Interesting / guide / automate | Script sections gather into a guide cover, with a compact process sequence connecting research, plan and script. | Script folds into guide |
| 65.94–69.94 | Comment praise for Juno / guide delivery | Speaker expands for the CTA. Cursor enters the comment field; a short Juno praise appears. Send click causes the guide to arrive as a final compact card. | Comment → delivery card |
| 69.94–70.17 | Natural tail | Clean final hold with speaker and guide; preserve the end of original speech. | Final state |

## Quality and export

1. Receive real Juno images and prepare local asset manifest.
2. Build entire composition and score from original word timestamps.
3. Inspect portrait stills for every chapter and transition, plus face crops at several source times.
4. Check date cadence, highlight-before-click, cursor targeting and continuous morphing in short internal render segments. This is internal QA, not another user approval gate.
5. Check deterministic seeking including footage decoding, missing assets, portrait framing and face/voice synchronization.
6. Render full 1080 × 1920 / 30 fps with original voice, restrained SFX and real shutter blur. Give a measured time estimate before the full render. Optimize local frame sizes for the largest displayed speaker area rather than decoding 3 GB repeatedly without need.
7. Decode-check final MP4, inspect encoded scene/transition samples, verify duration and unclipped audio. Report expected static-rest/quiet-audio oracle limitations for continuous live footage and speech.
8. Deliver full MP4 and contact sheet; retain editable source and render metadata.

## Inputs to request now

Only required missing input: the real Juno images the user wants used. Talking-head footage and voice are already present. User may optionally include actual Juno conversation/result screenshots for more faithful UI and content.
