# DDR — animation and edit plan

## Shared series system

Graphite Resolve workspace, near-white typography, cyan interaction accents, red offline/error, yellow selected action. Colours remain the same throughout 60 days. Day number, lesson name, demonstration assets and captions are data. Save all UI parts once under lib/resolve-ui.js, lib/resolve-ui.css, and lib/series-ident.js.

Hook first → series ident and spoken day insert → explanation/demo → actual outcome → relevant CTA. Day 1 already contains its spoken ident; use that take. Day 2–5 get the matching take from series day number.mov immediately after their hooks. The creator confirms that recording contains days 2–10. Previous ASR inferred repeated day numbers unreliably; do not use those guessed day numbers as an edit decision. Match original day audio before assembling full reels. Graphic ident variants can be generated independently now.

Caption system: Roman Hinglish, software menu labels in exact English. Short readable phrases, at most two lines. Essential steps also appear as menu labels/breadcrumbs so mute viewers can follow. Correct recognizer spellings such as render case→render cache, media pull→Media Pool, real link→Relink, and REC709→Rec.709. Do not silently rewrite the speaker's technical claims.

Face inset changes with purpose: rounded rectangle during explanation, circle when space is needed for a menu, larger square for a reaction/result. Morph its existing container, rather than popping unrelated copies in and out. Keep it outside the active control and recorded cursor.

Clicks: visible pointer approach → short press → restrained elastic compression and cyan ripple → actual UI change. Zoom follows the target and settles before viewers need to read. No continuous wobble on text. A longer outcome hold lets the audience verify the fix.

## Source screen-recording map

All ranges below are approximate source time and are refined at cut points.

| Source time | Evidence / use |
|---|---|
| 00:00–00:36 | Offline Media Pool and timeline, red viewer. Establish Day 1 problem. |
| 00:36–01:13 | Relink control, folder selection/dialog. Rebuild active controls from these frames. |
| 01:13–01:28 | Media restored; thumbnails and real viewer outcome. |
| 01:30–02:25 | Timeline context and render-cache setup. |
| 02:30–03:20 | Explorer/cache deletion sequence; contextual explanation, trim waiting. |
| 03:24–03:58 | Timeline remains populated but viewer reads Media Offline. Day 2 problem. |
| 04:04–04:10 | Playback → Delete Render Cache → All… → Delete Project Cache? → Delete. |
| 04:13–04:38 | Actual restored viewer and playback. Day 2 proof. |

## First 10-second sample — Day 2 cache fix

Original voice: Day 2, 00:33.38–00:40.98; natural speed. Final 2.4 seconds let the outcome breathe. This is a demonstration excerpt, not a complete reel or its opening.

| Sample time | Beat | Motion and stillness | What carries |
|---|---|---|---|
| 0.00–1.10 | Offline viewer + “To iska seedha solution hai” | Real recording establishes the problem; face in a rounded rectangle. | Same app workspace and presenter. |
| 1.10–1.72 | Find Playback | Camera pushes toward top menu; pointer approaches before clicking. | Playback label lifts from the app header. |
| 1.72–3.30 | Delete Render Cache | Recreated menu opens; selected row visibly responds, readable hold. | Same dropdown and pointer. |
| 3.30–4.48 | All… and confirm Delete | Submenu grows from selected row; confirmation replaces it through a rectangle morph. | Same selected control and cursor. |
| 4.48–5.30 | Return to app | Confirmation folds away; app recording resumes at real repaired state. | Workspace container. |
| 5.30–7.60 | “Ab aapki media dikh jayegi” | Recorded viewer is enlarged; inset morphs to circle; result remains readable. | Actual viewer and presenter. |
| 7.60–10.00 | Outcome hold | Quiet, stable before/after status and real playback; concise three-step path. | Repaired recorded view. |

## Per-reel plan

### Day 1 — Media Offline / Media Pool

- 00:00–00:05.34 hook: presenter first, error viewer expands beside him. Red offline label grows from actual UI.
- 00:05.34–00:07.52 existing spoken Day 1 ident; reuse the same series graphic.
- 00:07.52–00:15.64 distinguish Media Pool vs timeline with a camera traversal across one persistent app shell, not two unrelated slides.
- 00:15.64–00:22.28 show selected offline thumbnails, then the missing-file relationship.
- 00:22.28–00:40.26 real recording + reconstructed relink control; click, folder selection, restored thumbnails. Magnify one operation at a time.
- 00:40.26–00:58.96 supported-format/free-vs-Studio explanation as restrained labels. Codec, platform and version details need technical verification before publishing; no blanket unsupported-format claim in graphics.
- 00:58.96–end: timeline problem becomes next-episode teaser with DAY 02.

### Day 2 — Timeline render cache

- Hook around first 6 seconds, followed immediately by the separate Day 2 ident take.
- Brief reference to previous episode: small Media Pool state resolves into timeline view.
- 00:13–00:23.90: show cache strip and the supplied cache-deletion recording, shorten Explorer waiting.
- 00:23.98–00:33.38: highlight that clips exist while the viewer is offline; a connector relates cache strip to viewer.
- 00:33.38–00:40.98: approved version of the 10-second sample, exact Playback path and recorded successful playback.
- 00:41.16–end: follow CTA with face restored larger.

### Day 3 — Colour Space

- Hook: use creator-supplied examples when available to show the actual wrong conversion; do not fabricate a grading comparison.
- Insert Day 3 ident after the hook near 00:05.94.
- 00:07.08–00:20.12: a single persistent node chain explains source Log and the conversion order.
- 00:20.12–00:30.48: source colour space → DaVinci Wide Gamut working space → grading nodes → Rec.709 output. Recreate exact CST fields only after the recording arrives.
- 00:30.48–00:40.17: course CTA. Course's exact spelling/version and delivery wording remain to confirm.

### Day 4 — Blemish Removal

- Feature hook, then Day 4 ident. Keep a face detail large enough to actually see the marks.
- Recorded Color page → Effects search → Blemish Removal → drag onto node. Animated UI follows real control names and placement.
- Strength change gets one elastic handle movement, then stable recorded before/after. Preserve skin texture; no generated cosmetic outcome.
- Recording pending; voice script alone is not enough to recreate the actual effect's result.

### Day 5 — Object Removal

- Hook with the actual unwanted object identified; Day 5 ident after the hook.
- Show Power Window drawn around that object, track motion, connect the relevant alpha/node ports with a visible path.
- Effect search and drop are magnified with pointer contact; settle so the audience reads the exact setting.
- Finish with actual recorded before/after; verify the node connection and settings against upcoming screen recording.
- Trim self-corrections only when assembling the final reel; preserve meaning. Recorded demonstration pending.

## Still needed for full reels

- Screen recordings for Colour Space, Blemish Removal and Object Removal (creator is already preparing them).
- Exact Day 3 course name/version and CTA wording.
- Review of this sample's palette, pacing, face size and caption style before extending the same system.

No additional recordings are needed to review this first beat. Day 2–10 graphics share one template; day 11–60 use the same number parameter.
