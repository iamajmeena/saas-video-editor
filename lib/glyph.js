/* glyph.js — glyph-motions helpers on top of onetake's lib/motion.js (window.OM).
 * Everything is a pure function of time t. Load AFTER motion.js:  <script src="lib/glyph.js"></script>
 * Distilled from the Juno v2 / DDR / Screenlark builds (see examples/). Canvas-2D helpers take the context `g`.
 */
(function () {
  const OM = window.OM, E = OM.ease || {};
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const U = (t, a, b, curve) => { const k = clamp((t - a) / (b - a)); return curve ? curve(k) : k; };
  const L = (a, b, k) => a + (b - a) * k;
  const soft = k => k * k * k * (k * (k * 6 - 15) + 10);          // smootherstep: our default entrance (t80 ~ 0.8)

  /* ---- camera that travels to every click --------------------------------------------------------
   * clicks: [{at, x, y, zoom?, rot?}] in world px.  Returns {keys, moves}: pass keys to OM.camera(t, keys, {W,H});
   * pass moves to window.__motion so the shutter budget sees the camera (moves = [[t0,t1,pxTravel],...]).
   * Recipe: neutral at at-1.1, focus at at-0.22 (80% of the way), hold to at+0.55, neutral at at+1.35. */
  function cameraToClicks(clicks, { W = 1080, H = 1920, zoom = 1.62 } = {}) {
    const cx = W / 2, cy = H / 2, keys = [{ t: 0, x: cx, y: cy, zoom: 1, rot: 0 }], moves = [];
    for (const c of clicks) {
      const fx = L(cx, c.x, .8), fy = L(cy, c.y, .8), z = c.zoom || zoom, r = c.rot || 0;
      keys.push({ t: c.at - 1.1, x: cx, y: cy, zoom: 1, rot: 0 }, { t: c.at - .22, x: fx, y: fy, zoom: z, rot: r },
        { t: c.at + .55, x: fx, y: fy, zoom: z, rot: r }, { t: c.at + 1.35, x: cx, y: cy, zoom: 1, rot: 0 });
      moves.push([c.at - 1.1, c.at - .22, 1100], [c.at + .55, c.at + 1.35, 1100]);
    }
    keys.sort((a, b) => a.t - b.t);
    return { keys, moves };
  }

  /* ---- CSS 3D perspective that changes every beat (still pure f(t)) --------------------------------
   * beatIndex: integer index of current scene, k: 0..1 progress of the eased change into it. */
  function applyTilt(canvas, cam, beatIndex, k, { W = 1080, H = 1920, deg = 4.2, persp = 1700, scale = 1.045 } = {}) {
    const zf = clamp((cam.zoom - 1) / .6), sg = n => n <= 0 ? 0 : (n % 2 ? 1 : -1) * deg;
    const base = L(sg(beatIndex - 1), sg(beatIndex), k);
    const ry = -(cam.x - W / 2) / (W / 2) * 7 * zf + base, rx = (cam.y - H / 2) / (H / 2) * 5 * zf + base * .45;
    canvas.style.transform = `perspective(${persp}px) rotateX(${rx.toFixed(3)}deg) rotateY(${ry.toFixed(3)}deg) scale(${scale})`;
    canvas.style.transformOrigin = '50% 50%';
  }

  /* ---- glass panel: translucent fill + top highlight + hairline border + soft shadow ----------------
   * opts.backing: draw an opaque layer first (REQUIRED for overlays on top of other translucent items). */
  function rrect(g, x, y, w, h, r, fill, stroke, lw = 1) {
    g.beginPath(); g.roundRect(x, y, Math.max(.1, w), Math.max(.1, h), Math.min(r, w / 2, h / 2));
    if (fill) { g.fillStyle = fill; g.fill(); } if (stroke) { g.lineWidth = lw; g.strokeStyle = stroke; g.stroke(); }
  }
  function glass(g, x, y, w, h, r, { o = 1, fill = 'rgba(44,58,26,.62)', tint = 'rgba(204,255,0,.06)', backing = null } = {}) {
    if (o <= .002) return;
    g.save(); g.globalAlpha *= Math.min(1, o);
    if (backing) rrect(g, x, y, w, h, r, backing);
    g.shadowColor = 'rgba(0,0,0,.45)'; g.shadowBlur = 34; g.shadowOffsetY = 16; rrect(g, x, y, w, h, r, fill);
    g.shadowBlur = 0; g.shadowOffsetY = 0;
    const gr = g.createLinearGradient(x, y, x, y + h);
    gr.addColorStop(0, 'rgba(255,255,255,.16)'); gr.addColorStop(.4, 'rgba(255,255,255,.04)'); gr.addColorStop(1, tint);
    rrect(g, x, y, w, h, r, gr); rrect(g, x, y, w, h, r, null, 'rgba(255,255,255,.24)', 1.4);
    g.restore();
  }

  /* ---- text WRITTEN word by word on the spoken word -----------------------------------------------
   * list: [[word, startSeconds], ...]  (use real word timestamps from transcript_words.json) */
  function words(g, t, list, x, y, size, weight, color, font = 'Inter') {
    g.font = `${weight} ${size}px ${font}`; g.textAlign = 'left'; g.textBaseline = 'alphabetic'; let cx = x;
    for (const [w, at] of list) {
      const q = U(t, at, at + .24, E.quintOut || soft);
      if (q > .001) { g.save(); g.globalAlpha *= q; g.fillStyle = color; g.font = `${weight} ${size}px ${font}`; g.fillText(w, cx, y + (1 - q) * 16); g.restore(); }
      cx += g.measureText(w + ' ').width;
    }
  }
  /* build a [[word,t]] list from transcript words: pick(wordsJson, fromIdx, n, offset) */
  const wordList = (tw, i, n, off = 0) => tw.slice(i, i + n).map(w => [w.word.trim(), w.start + off]);

  /* ---- glass box that FORMS: small pill -> full rect with blur-in (progressive build) --------------- */
  function formBox(g, t, t0, t1, from, to, glassOpts = {}) {
    const k = U(t, t0, t1, E.quintInOut || soft), b = OM.morphRect(t, t0, t1, from, to, { curve: E.quintInOut || soft });
    g.save(); if (k < 1) g.filter = `blur(${((1 - k) * 5).toFixed(2)}px)`;
    glass(g, b.x, b.y, b.w, b.h, b.r, { ...glassOpts, o: U(t, t0 - .05, t0 + .3) }); g.restore(); return b;
  }

  /* ---- chip that pops in with a tiny scale (waterfall: call with at + i*.22) ------------------------ */
  function chip(g, t, label, x, y, at, { color = '#ccff00', font = 'Mono' } = {}) {
    const q = U(t, at, at + .34, E.quintOut || soft); if (q < .002) return 0;
    g.font = `550 25px ${font}`; const w = g.measureText(label).width + 52;
    g.save(); g.globalAlpha *= q; g.translate(x + w / 2, y + 25); g.scale(.82 + .18 * q, .82 + .18 * q); g.translate(-w / 2, -25);
    glass(g, 0, 0, w, 50, 25); g.font = `550 24px ${font}`; g.textAlign = 'center'; g.fillStyle = color; g.fillText(label, w / 2, 33); g.restore();
    return w;
  }

  /* ---- number that rolls up exactly on its spoken word ------------------------------------------- */
  const rollTo = (t, at, to, dur = .5) => Math.round(to * U(t, at, at + dur, E.quintOut || soft));

  /* ---- face as jpg sequence (never <video>): frame index from time ---------------------------------
   * ffmpeg -i src.mov -vf scale=1080:1920 -q:v 4 -r 30 face/f%04d.jpg     (index starts at 1) */
  const frameIndex = (t, fps, count) => Math.min(count, Math.max(1, Math.floor(t * fps) + 1));

  /* ---- shutter budget helper: pass moves from cameraToClicks + your own [t0,t1,px] moves ----------- */
  function motionBudget(moves) {
    return (a, b) => { let d = 0; for (const [s, e, px] of moves) d = Math.max(d, Math.abs(U(b, s, e) - U(a, s, e)) * px); return d; };
  }

  window.GM = { U, L, clamp, soft, cameraToClicks, applyTilt, glass, rrect, words, wordList, formBox, chip, rollTo, frameIndex, motionBudget };
})();
