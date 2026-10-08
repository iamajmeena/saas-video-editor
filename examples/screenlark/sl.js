/* Screenlark ad kit - shared by comp A/B/C. Everything is a pure function of t (onetake contract). */
(function (root) {
  'use strict';
  const OM = root.OM, { clamp, lerp, seg, sstep, ssstep } = OM, E = OM.ease;
  const W = 1080, H = 1920;
  const SL = { W, H, OM };

  // ---------- DOM helpers ----------
  SL.mk = function (tag, cls, parent, css, html) {
    const e = document.createElement(tag); if (cls) e.className = cls; if (css) e.style.cssText = css; if (html != null) e.innerHTML = html;
    (parent || document.getElementById('stage')).appendChild(e); return e;
  };
  SL.svg = function (parent, html, css) {
    const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('width', W); s.setAttribute('height', H); s.setAttribute('viewBox', `0 0 ${W} ${H}`);
    s.style.cssText = 'position:absolute;left:0;top:0;pointer-events:none;overflow:visible;' + (css || '');
    s.innerHTML = html; parent.appendChild(s); return s;
  };
  // piecewise keyed value: keys [[t, v, curve?]...] ; curve eases the segment ENDING at that key
  SL.K = function (t, keys) {
    if (t <= keys[0][0]) return keys[0][1];
    for (let i = 0; i < keys.length - 1; i++) {
      if (t < keys[i + 1][0]) { const c = keys[i + 1][2] || E.expoInOut; return lerp(keys[i][1], keys[i + 1][1], c(seg(t, keys[i][0], keys[i + 1][0]))); }
    }
    return keys[keys.length - 1][1];
  };
  SL.tf = function (e, o) {  // x y z rx ry rz s sx sy op blur br  (3D transform write)
    const s = o.s == null ? 1 : o.s;
    e.style.transform = `translate3d(${(o.x || 0).toFixed(2)}px,${(o.y || 0).toFixed(2)}px,${(o.z || 0).toFixed(2)}px) rotateX(${(o.rx || 0).toFixed(3)}deg) rotateY(${(o.ry || 0).toFixed(3)}deg) rotateZ(${(o.rz || 0).toFixed(3)}deg) scale(${((o.sx == null ? s : o.sx)).toFixed(4)},${((o.sy == null ? s : o.sy)).toFixed(4)})`;
    e.style.opacity = o.op == null ? 1 : clamp(o.op, 0, 1).toFixed(3);
    let f = ''; if (o.blur > 0.3) f += `blur(${o.blur.toFixed(2)}px) `; if (o.br != null && Math.abs(o.br - 1) > 0.005) f += `brightness(${o.br.toFixed(3)}) `;
    e.style.filter = f || 'none';
    if (e._d === undefined) e._d = e.style.display || '';
    e.style.display = (o.op != null && o.op <= 0.002) ? 'none' : e._d;
  };

  // ---------- ground: only gradients move ----------
  SL.ground = function () {
    const g = SL.mk('div', 'ground', null, 'position:absolute;inset:0;background:#06050d;overflow:hidden');
    const blobs = [];
    for (let i = 0; i < 4; i++) blobs.push(SL.mk('div', '', g, 'position:absolute;left:0;top:0;border-radius:50%;will-change:transform'));
    const arc1 = SL.mk('div', '', g, 'position:absolute;left:-380px;top:-300px;width:1840px;height:1840px;border-radius:50%;will-change:transform');
    const noise = SL.mk('canvas', '', g, 'position:absolute;inset:0;width:1080px;height:1920px;opacity:1;mix-blend-mode:overlay');
    noise.width = 256; noise.height = 256; noise.style.imageRendering = 'pixelated';
    const c = noise.getContext('2d'), d = c.createImageData(256, 256), r = OM.rng(11);
    for (let i = 0; i < 256 * 256; i++) { const v = r() > 0.5 ? 255 : 0; d.data[i * 4] = d.data[i * 4 + 1] = d.data[i * 4 + 2] = v; d.data[i * 4 + 3] = 7; }
    c.putImageData(d, 0, 0); noise.style.background = 'none';
    const DK = (root.SL_DARK == null ? 0.42 : root.SL_DARK);   // 1 = original brightness, lower = darker ground
    const cols = [['109,40,217', 0.60 * DK, 1100], ['139,92,246', 0.38 * DK, 900], ['34,211,238', 0.16 * DK, 800], ['236,72,153', 0.14 * DK, 760]];
    cols.forEach((cc, i) => { const b = blobs[i]; b.style.width = b.style.height = cc[2] + 'px'; b.style.background = `radial-gradient(closest-side, rgba(${cc[0]},${cc[1]}), rgba(${cc[0]},0))`; });
    return {
      el: g,
      at(t, mood) {   // mood: 0..1 shifts the horizon glow up (finale) ; level of glow
        mood = mood || 0;
        const P = [[540 + 330 * Math.sin(t * 0.55), 560 + 260 * Math.cos(t * 0.41)], [260 + 420 * Math.cos(t * 0.37 + 1), 1380 + 240 * Math.sin(t * 0.5)],
          [900 + 200 * Math.sin(t * 0.43 + 2), 360 + 220 * Math.cos(t * 0.33)], [120 + 180 * Math.cos(t * 0.6), 1750 - 260 * mood + 120 * Math.sin(t * 0.7)]];
        blobs.forEach((b, i) => { const w = parseFloat(b.style.width); b.style.transform = `translate3d(${(P[i][0] - w / 2).toFixed(1)}px,${(P[i][1] - w / 2).toFixed(1)}px,0)`; });
        arc1.style.background = `radial-gradient(closest-side, rgba(6,5,13,0) 58%, rgba(167,139,250,${0.09 + 0.03 * Math.sin(t * 1.1)}) 61%, rgba(109,40,217,0.03) 70%, rgba(6,5,13,0) 78%)`;
        arc1.style.transform = `translate3d(${40 * Math.sin(t * 0.3)}px,${30 * Math.cos(t * 0.27)}px,0) scale(${1 + 0.04 * Math.sin(t * 0.4)})`;
      }
    };
  };

  // ---------- lamp (logo on a frosted glass plate = the torch) ----------
  SL.lamp = function (parent) {
    const root_ = SL.mk('div', 'lamp', parent, 'position:absolute;left:0;top:0;width:0;height:0;will-change:transform');
    const halo = SL.mk('div', '', root_, 'position:absolute;left:-300px;top:-300px;width:600px;height:600px;border-radius:50%;mix-blend-mode:screen;background:radial-gradient(closest-side,rgba(255,244,255,.55),rgba(167,139,250,.28) 38%,rgba(109,40,217,0) 100%)');
    const plate = SL.mk('div', '', root_, 'position:absolute;left:-84px;top:-84px;width:168px;height:168px;border-radius:44px;background:linear-gradient(160deg,#1b1533,#0a0814);border:2px solid rgba(255,255,255,.55);box-shadow:0 0 0 6px rgba(255,255,255,.07),0 0 60px 8px rgba(196,181,253,.65),inset 0 2px 0 rgba(255,255,255,.35),inset 0 -20px 40px rgba(139,92,246,.25)');
    const img = SL.mk('img', '', plate, 'position:absolute;left:24px;top:30px;width:120px'); img.src = 'assets/sym.png';
    const shine = SL.mk('div', '', plate, 'position:absolute;inset:0;border-radius:44px;background:linear-gradient(115deg,rgba(255,255,255,0) 35%,rgba(255,255,255,.32) 50%,rgba(255,255,255,0) 65%);will-change:transform;mix-blend-mode:screen');
    return {
      el: root_, plate,
      at(o) { // x y s op glow shine(0..1)
        root_.style.transform = `translate3d(${o.x}px,${o.y}px,0) scale(${o.s})`;
        root_.style.opacity = o.op == null ? 1 : o.op; root_.style.display = (o.op != null && o.op <= 0.002) ? 'none' : '';
        halo.style.opacity = (o.glow == null ? 1 : o.glow).toFixed(3);
        shine.style.transform = `translateX(${(-170 + 340 * (o.shine || 0)).toFixed(1)}px)`;
      }
    };
  };

  // ---------- torch beam: crisp cone + core + rim lines + target pool, all SVG ----------
  SL.beam = function (parent) {
    const s = SL.svg(parent, `
      <defs>
        <linearGradient id="bg1" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".55" stop-color="#ddd0ff" stop-opacity=".42"/><stop offset="1" stop-color="#a78bfa" stop-opacity=".16"/></linearGradient>
        <linearGradient id="bg2" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="1"/><stop offset="1" stop-color="#fff" stop-opacity=".22"/></linearGradient>
        <filter id="bl" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="9"/></filter>
        <filter id="bl2" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.2"/></filter>
        <radialGradient id="pool"><stop offset="0" stop-color="#fff" stop-opacity=".10"/><stop offset=".6" stop-color="#c4b5fd" stop-opacity=".16"/><stop offset="1" stop-color="#8b5cf6" stop-opacity="0"/></radialGradient>
      </defs>
      <g style="mix-blend-mode:screen">
        <polygon id="bo" fill="url(#bg1)" filter="url(#bl2)"/>
        <polygon id="bc" fill="url(#bg2)" opacity=".55" filter="url(#bl2)"/>
        <polygon id="bhalo" fill="#c4b5fd" opacity=".35" filter="url(#bl)"/>
        <line id="bl1" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".9"/><line id="bl2" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".9"/>
        <ellipse id="pool_" fill="url(#pool)"/>
        <rect id="rim" fill="none" stroke="#fff" stroke-width="3" rx="22"/><rect id="rimg" fill="none" stroke="#a78bfa" stroke-width="10" rx="26" filter="url(#bl)" opacity=".9"/>
      </g>`, 'mix-blend-mode:screen');
    const q = id => s.querySelector('#' + id);
    const bo = q('bo'), bc = q('bc'), bh = q('bhalo'), l1 = q('bl1'), l2 = q('bl2'), pool = q('pool_'), rim = q('rim'), rimg = q('rimg');
    const gs = s.querySelectorAll('linearGradient');
    return {
      el: s,
      at(o) { // sx sy (source) ; box {x,y,w,h} screen rect of lit target ; a (0..1) ; spread
        if (!o || o.a <= 0.003) { s.style.display = 'none'; return; } s.style.display = '';
        const { sx, sy, box, a } = o, pad = o.pad == null ? 10 : o.pad;
        const x0 = box.x - pad, x1 = box.x + box.w + pad, yt = box.y - pad, yb = box.y + box.h + pad;
        const endY = o.endY != null ? o.endY : yt;                    // where the cone stops (top edge of target)
        const pts = (w0, ex0, ex1) => `${sx - w0},${sy} ${sx + w0},${sy} ${ex1},${endY} ${ex0},${endY}`;
        bo.setAttribute('points', pts(22, x0, x1)); bc.setAttribute('points', pts(8, lerp(x0, sx, 0.55), lerp(x1, sx, 0.55)));
        bh.setAttribute('points', pts(34, x0 - 20, x1 + 20));
        gs.forEach(g => { g.setAttribute('y1', sy); g.setAttribute('y2', endY); });
        l1.setAttribute('x1', sx - 22); l1.setAttribute('y1', sy); l1.setAttribute('x2', x0); l1.setAttribute('y2', endY);
        l2.setAttribute('x1', sx + 22); l2.setAttribute('y1', sy); l2.setAttribute('x2', x1); l2.setAttribute('y2', endY);
        pool.setAttribute('cx', box.x + box.w / 2); pool.setAttribute('cy', box.y + box.h / 2); pool.setAttribute('rx', box.w * 0.75 + 80); pool.setAttribute('ry', box.h * 0.9 + 70);
        [rim, rimg].forEach(r => { r.setAttribute('x', x0); r.setAttribute('y', yt); r.setAttribute('width', x1 - x0); r.setAttribute('height', yb - yt); });
        s.style.opacity = a.toFixed(3);
      }
    };
  };

  // ---------- glass slab holding a real UI crop ----------
  SL.slab = function (parent, src, w, h, o) {
    o = o || {};
    const e = SL.mk('div', 'slab', parent, `position:absolute;left:${-w / 2}px;top:${-h / 2}px;width:${w}px;height:${h}px;border-radius:${o.r == null ? 18 : o.r}px;overflow:hidden;background:#0b0916;will-change:transform,opacity,filter;` +
      `box-shadow:0 0 0 1.5px rgba(196,181,253,.55),0 30px 80px -10px rgba(0,0,0,.7),0 0 46px rgba(139,92,246,.35);backface-visibility:hidden`);
    const im = SL.mk('img', '', e, `position:absolute;left:0;top:0;width:100%;height:100%;object-fit:${o.fit || 'cover'};object-position:${o.pos || '50% 50%'}`); im.src = src;
    SL.mk('div', '', e, 'position:absolute;inset:0;border-radius:inherit;background:linear-gradient(125deg,rgba(255,255,255,.16),rgba(255,255,255,0) 32%,rgba(255,255,255,0) 70%,rgba(167,139,250,.14));pointer-events:none');
    return e;
  };

  SL.glassPill = function (parent, html, css) {
    return SL.mk('div', 'pill', parent, 'position:absolute;display:flex;align-items:center;justify-content:center;white-space:nowrap;border-radius:999px;color:#fff;font-weight:600;' +
      'background:linear-gradient(180deg,rgba(255,255,255,.20),rgba(255,255,255,.07));border:1.5px solid rgba(255,255,255,.45);box-shadow:0 14px 50px rgba(109,40,217,.55),inset 0 1px 0 rgba(255,255,255,.5),0 0 0 1px rgba(10,8,20,.4);will-change:transform,opacity;' + (css || ''), html);
  };

  SL.keycap = function (parent, label, wpx) {
    const w = wpx || 150;
    const k = SL.mk('div', '', parent, `position:absolute;left:${-w / 2}px;top:-72px;width:${w}px;height:130px;border-radius:26px;display:flex;align-items:center;justify-content:center;font-size:56px;font-weight:600;color:#1a1530;will-change:transform,opacity;` +
      'background:linear-gradient(180deg,#ffffff,#ddd6fe);box-shadow:0 12px 0 #8b5cf6,0 26px 50px rgba(109,40,217,.6),inset 0 -6px 0 rgba(139,92,246,.25)', label);
    return k;
  };

  SL.fontReady = async function () {
    try { await document.fonts.load('600 40px Outfit'); await document.fonts.load('400 40px Outfit'); await document.fonts.load('800 40px Outfit'); } catch (e) { }
    const imgs = [...document.images]; await Promise.all(imgs.map(i => i.decode().catch(() => { })));
  };
  // projected screen rect of an element (post 3D transform)
  SL.rectOf = function (e) { const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; };

  root.SL = SL;
})(window);
