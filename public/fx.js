/* Mini Guerre v19 — cosmétiques refaits : traînées de dash, emotes animées, avatars à cadres de rareté,
   effets des skins d'arme EVO (balles, impacts, finish, montée de niveau). Chargé avant extras2.js. */
(() => {
'use strict';
const TAU = Math.PI * 2, PI = Math.PI;
const R = (a, b) => a + Math.random() * (b - a), cl = (v, a, b) => v < a ? a : v > b ? b : v, pick = a => a[Math.random() * a.length | 0];
const hsl = (h, s, l, a) => 'hsla(' + (((h % 360) + 360) % 360 | 0) + ',' + s + '%,' + l + '%,' + (a == null ? 1 : a) + ')';
const hook = (n, f) => { const o = window[n]; if (typeof o !== 'function') return; window[n] = function (...a) { return f.call(this, o, ...a); }; };
const FONT = 'system-ui,"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
const rgb = h => { h = h.replace('#', ''); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; };
const mix = (a, b, t, al) => { const A = rgb(a), B = rgb(b); return 'rgba(' + (A[0] + (B[0] - A[0]) * t | 0) + ',' + (A[1] + (B[1] - A[1]) * t | 0) + ',' + (A[2] + (B[2] - A[2]) * t | 0) + ',' + al + ')'; };

/* ================= moteur de particules (une « scène » = une liste) ================= */
const Stage = () => ({ p: [], rib: {}, em: [], acc: {}, time: 0, dt: .016 });
const GS = Stage();
const add = (S, o) => { if (S.p.length > 900) return; const l = o.l == null ? .6 : o.l; S.p.push(Object.assign({ k: 'dot', x: 0, y: 0, vx: 0, vy: 0, g: 0, s: 3, c: '#fff', rot: 0, vr: 0 }, o, { l, m: l })); };
const rate = (o, key, per, dt, fn) => { o.acc = o.acc || {}; o.acc[key] = (o.acc[key] || 0) + per * dt; let n = 0; while (o.acc[key] >= 1 && n++ < 8) { o.acc[key]--; fn(); } if (o.acc[key] > 2) o.acc[key] = 0; };
const bolt = (x0, y0, x1, y1, j) => { const pts = [[x0, y0]], n = 6; for (let i = 1; i < n; i++) pts.push([x0 + (x1 - x0) * i / n + R(-j, j), y0 + (y1 - y0) * i / n + R(-j, j)]); pts.push([x1, y1]); return pts; };
function rr(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
function cap(c, x, y, col, a, outline, sc) { // silhouette de joueur (capsule + tête)
  c.save(); c.translate(x, y); if (sc) c.scale(sc, sc); c.globalAlpha = a;
  c.beginPath(); c.arc(0, -13, 7.5, 0, TAU); rr(c, -8.5, -6, 17, 25, 6);
  if (outline) { c.strokeStyle = col; c.lineWidth = 1.6; c.stroke(); c.globalAlpha = a * .18; } c.fillStyle = col; c.fill(); c.restore();
}
const ADD = { glow: 1, flame: 1, spark: 1, star: 1, bolt: 1, streak: 1, ring: 1 };
function dp(c, q) {
  const f = cl(q.l / q.m, 0, 1), u = 1 - f; c.globalCompositeOperation = ADD[q.k] ? 'lighter' : 'source-over';
  switch (q.k) {
    case 'dot': c.globalAlpha = f; c.fillStyle = q.c; c.beginPath(); c.arc(q.x, q.y, Math.max(.3, q.s * (q.sh ? f : 1)), 0, TAU); c.fill(); break;
    case 'glow': c.fillStyle = q.c; c.globalAlpha = f * .22; c.beginPath(); c.arc(q.x, q.y, q.s * 2.2, 0, TAU); c.fill(); c.globalAlpha = f * .9; c.beginPath(); c.arc(q.x, q.y, q.s * (.5 + f * .5), 0, TAU); c.fill(); break;
    case 'spark': { c.globalAlpha = f; c.fillStyle = q.c; const r = q.s * (.4 + f * .6); c.fillRect(q.x - r, q.y - .5, r * 2, 1); c.fillRect(q.x - .5, q.y - r, 1, r * 2); break; }
    case 'star': { c.save(); c.translate(q.x, q.y); c.rotate(q.rot); c.globalAlpha = f; c.fillStyle = q.c; const s = q.s * (.5 + f * .5); c.beginPath(); for (let i = 0; i < 8; i++) { const r = i & 1 ? s * .32 : s, a = i * PI / 4; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.closePath(); c.fill(); c.restore(); break; }
    case 'flame': c.globalAlpha = f * .85; c.fillStyle = u < .5 ? q.c : q.c2 || q.c; c.beginPath(); c.arc(q.x, q.y, Math.max(.4, q.s * (1 - u * .65)), 0, TAU); c.fill(); break;
    case 'smoke': c.globalAlpha = f * .32; c.fillStyle = q.c; c.beginPath(); c.arc(q.x, q.y, q.s * (1 + u * 1.7), 0, TAU); c.fill(); break;
    case 'petal': c.save(); c.translate(q.x, q.y); c.rotate(q.rot); c.globalAlpha = Math.min(1, f * 1.6); c.fillStyle = q.c; c.beginPath(); c.ellipse(0, 0, q.s, q.s * .55, 0, 0, TAU); c.fill(); c.restore(); break;
    case 'ghost': cap(c, q.x, q.y, q.c, f * (q.a || .5), q.o); break;
    case 'glitch': c.globalAlpha = f * .8; c.fillStyle = '#ff2f5a'; c.fillRect(q.x - 3, q.y, q.w, q.h); c.fillStyle = '#19d8ff'; c.fillRect(q.x + 3, q.y, q.w, q.h); c.globalAlpha = f; c.fillStyle = q.c; c.fillRect(q.x, q.y, q.w, q.h); break;
    case 'bolt': { c.lineJoin = 'round'; c.lineCap = 'round'; c.beginPath(); q.pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.globalAlpha = f * .35; c.strokeStyle = q.c; c.lineWidth = q.s * 3; c.stroke(); c.globalAlpha = f; c.strokeStyle = '#fff'; c.lineWidth = q.s; c.stroke(); break; }
    case 'coin': { c.save(); c.translate(q.x, q.y); c.globalAlpha = Math.min(1, f * 2); c.fillStyle = '#ffd23f'; c.strokeStyle = '#a77400'; c.lineWidth = .7; c.beginPath(); c.ellipse(0, 0, q.s * Math.abs(Math.cos(q.rot)) + .4, q.s, 0, 0, TAU); c.fill(); c.stroke(); c.restore(); break; }
    case 'bubble': c.globalAlpha = f; c.strokeStyle = q.c; c.lineWidth = 1; c.beginPath(); c.arc(q.x, q.y, q.s, 0, TAU); c.stroke(); c.globalAlpha = f * .25; c.fillStyle = q.c; c.fill(); c.globalAlpha = f * .9; c.fillStyle = '#fff'; c.fillRect(q.x - q.s * .45, q.y - q.s * .5, 1, 1); break;
    case 'ring': c.globalAlpha = f * .9; c.strokeStyle = q.c; c.lineWidth = Math.max(.6, (q.lw || 3) * f); c.beginPath(); c.arc(q.x, q.y, q.s * (.12 + .88 * Math.sqrt(u)), 0, TAU); c.stroke(); break;
    case 'txt': c.save(); c.translate(q.x, q.y); c.rotate(q.rot); c.globalAlpha = Math.min(1, f * 2); c.font = q.s + 'px ' + FONT; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = q.c; c.fillText(q.t, 0, 0); c.restore(); break;
    case 'conf': c.save(); c.translate(q.x, q.y); c.rotate(q.rot); c.globalAlpha = Math.min(1, f * 2); c.fillStyle = q.c; c.scale(1, Math.abs(Math.cos(q.rot * 1.7)) + .15); c.fillRect(-q.s, -q.s * .5, q.s * 2, q.s); c.restore(); break;
    case 'streak': c.globalAlpha = f; c.strokeStyle = q.c; c.lineWidth = q.s; c.lineCap = 'round'; c.beginPath(); c.moveTo(q.x, q.y); c.lineTo(q.x - q.vx * .05, q.y - q.vy * .05); c.stroke(); break;
  }
}
function stepP(S, dt) {
  S.time += dt; S.dt = dt;
  for (let i = S.p.length - 1; i >= 0; i--) {
    const q = S.p[i]; if ((q.l -= dt) <= 0) { S.p.splice(i, 1); continue; }
    if (q.d) { const k = Math.max(0, 1 - q.d * dt); q.vx *= k; q.vy *= k; }
    if (q.ax) { const dx = q.ax - q.x, dy = q.ay - q.y, d = Math.hypot(dx, dy) || 1; q.vx += dx / d * q.pull * dt; q.vy += dy / d * q.pull * dt; }
    q.x += q.vx * dt; q.y += q.vy * dt; q.vy += q.g * dt; q.rot += q.vr * dt;
    if (q.sa) q.x += Math.sin((q.m - q.l) * 6 + q.ph) * q.sa * dt;
  }
  for (const k in S.rib) { const a = S.rib[k]; while (a.length && S.time - a[0].t > .5) a.shift(); if (!a.length) delete S.rib[k]; }
}

/* ================= TRAÎNÉES DE DASH ================= */
// n, prix, [couleur1, couleur2] (puce de boutique), ruban {c:[tête,queue]|'rb', w, add}, effet
const TR = [
  null,
  { n: 'Feu', p: 150, chip: ['#ff7a1a', '#ffd23f'], rib: { c: ['#ffe9a0', '#ff3b00'], w: 11, add: 1 }, fx: 'fire' },
  { n: 'Glace', p: 150, chip: ['#8fe3ff', '#ffffff'], rib: { c: ['#ffffff', '#5ec8ff'], w: 9, add: 1 }, fx: 'ice' },
  { n: 'Néon', p: 200, chip: ['#00ffcc', '#ff00ff'], rib: { c: ['#00ffcc', '#ff00ff'], w: 6, add: 1 }, fx: 'neon' },
  { n: 'Étoiles', p: 300, chip: ['#ffe14d', '#ffffff'], rib: { c: ['#fff7c2', '#ffb300'], w: 5, add: 1 }, fx: 'stars' },
  { n: 'Arc-en-ciel', p: 400, chip: 'rb', rib: { c: 'rb', w: 12, add: 1 }, fx: 'rainbow' },
  { n: 'Foudre', p: 350, chip: ['#4cc9f0', '#ffffff'], rib: { c: ['#ffffff', '#4cc9f0'], w: 4, add: 1 }, fx: 'bolt' },
  { n: 'Fantôme', p: 350, chip: ['#bfe9ff', '#6b8cff'], fx: 'ghost' },
  { n: 'Sakura', p: 300, chip: ['#ffb7d5', '#ff8fb8'], rib: { c: ['#ffe3ee', '#ff9ec4'], w: 6, add: 1 }, fx: 'sakura' },
  { n: 'Glitch', p: 400, chip: ['#00ffcc', '#ff2fd0'], fx: 'glitch' },
  { n: 'Ombre', p: 450, chip: ['#6b3fa0', '#0d0618'], rib: { c: ['#6b3fa0', '#0d0618'], w: 10 }, fx: 'shadow' },
  { n: 'Comète', p: 500, chip: ['#ffffff', '#4cc9f0'], rib: { c: ['#ffffff', '#4cc9f0'], w: 10, add: 1 }, fx: 'comet' },
  { n: 'Toxique', p: 450, chip: ['#c8ff7a', '#1f7a12'], rib: { c: ['#c8ff7a', '#1f7a12'], w: 9, add: 1 }, fx: 'toxic' },
  { n: 'Galaxie', p: 600, chip: ['#ff9bf0', '#5a2be0'], rib: { c: ['#ff9bf0', '#5a2be0'], w: 9, add: 1 }, fx: 'galaxy' },
  { n: 'Or massif', p: 800, chip: ['#fff3b0', '#d4a017'], rib: { c: ['#fff3b0', '#d4a017'], w: 8, add: 1 }, fx: 'gold' }
];
const TFX = {
  fire(S, x, y, dt, k) { rate(S, k + 'a', 80, dt, () => add(S, { b: 1, k: 'flame', x: x + R(-5, 5), y: y + R(-6, 12), vx: R(-30, 30), vy: R(-100, -20), g: -90, s: R(5, 9), l: R(.3, .55), c: '#ffd23f', c2: '#ff3b00' })); rate(S, k + 'b', 14, dt, () => add(S, { b: 1, k: 'smoke', x: x + R(-4, 4), y: y, vy: -35, s: 5, l: .8, c: '#444' })); rate(S, k + 'c', 25, dt, () => add(S, { b: 1, k: 'dot', x: x + R(-6, 6), y: y + R(-8, 8), vx: R(-60, 60), vy: R(-120, -30), g: 200, s: 1.4, l: R(.4, .8), c: '#ffb347', sh: 1 })); },
  ice(S, x, y, dt, k) { rate(S, k + 'a', 55, dt, () => add(S, { b: 1, k: 'spark', x: x + R(-8, 8), y: y + R(-14, 14), vx: R(-20, 20), vy: R(10, 50), g: 80, s: R(2, 4.5), l: R(.35, .7), c: '#fff' })); rate(S, k + 'b', 30, dt, () => add(S, { b: 1, k: 'dot', x: x + R(-9, 9), y: y + R(-14, 14), vy: R(10, 40), g: 60, s: R(1, 2.2), l: R(.4, .8), c: '#bfeaff', sh: 1 })); rate(S, k + 'c', 12, dt, () => add(S, { b: 1, k: 'smoke', x: x + R(-6, 6), y: y + R(0, 16), vy: 10, s: 6, l: .7, c: '#cfefff' })); },
  neon(S, x, y, dt, k) { rate(S, k + 'g', 22, dt, () => { S.ni = (S.ni || 0) + 1; add(S, { b: 1, k: 'ghost', x, y, c: S.ni & 1 ? '#00ffcc' : '#ff00ff', o: 1, a: .9, l: .35 }); }); rate(S, k + 'a', 50, dt, () => add(S, { b: 1, k: 'spark', x: x + R(-8, 8), y: y + R(-16, 16), vx: R(-50, 50), vy: R(-50, 50), s: R(2, 4), l: R(.2, .45), c: pick(['#00ffcc', '#ff00ff', '#fff']) })); },
  stars(S, x, y, dt, k) { rate(S, k + 'a', 45, dt, () => add(S, { b: 1, k: 'star', x: x + R(-10, 10), y: y + R(-16, 16), vx: R(-50, 50), vy: R(-50, 50), g: 30, s: R(3, 7), rot: R(0, 6), vr: R(-6, 6), l: R(.45, .8), c: pick(['#ffe14d', '#fff', '#ffcf40']) })); },
  rainbow(S, x, y, dt, k) { rate(S, k + 'a', 70, dt, () => add(S, { b: 1, k: 'glow', x: x + R(-6, 6), y: y + R(-12, 14), vx: R(-40, 40), vy: R(-40, 40), s: R(2, 4), l: R(.3, .6), c: hsl(S.time * 400 + R(0, 120), 95, 60) })); rate(S, k + 'b', 18, dt, () => add(S, { b: 1, k: 'star', x: x + R(-10, 10), y: y + R(-12, 12), vy: R(-30, 10), s: R(3, 5), rot: R(0, 6), vr: 4, l: .5, c: hsl(S.time * 400 + R(0, 200), 100, 70) })); },
  bolt(S, x, y, dt, k) { rate(S, k + 'a', 55, dt, () => { const a = R(0, TAU), d = R(18, 40); add(S, { b: 1, k: 'bolt', pts: bolt(x, y + R(-6, 6), x + Math.cos(a) * d, y + Math.sin(a) * d, 6), s: R(.7, 1.2), c: '#4cc9f0', l: R(.1, .2) }); }); rate(S, k + 'b', 40, dt, () => add(S, { b: 1, k: 'spark', x: x + R(-10, 10), y: y + R(-14, 14), vx: R(-80, 80), vy: R(-80, 80), s: R(2, 4), l: .25, c: '#e6fbff' })); },
  ghost(S, x, y, dt, k) { rate(S, k + 'g', 24, dt, () => add(S, { b: 1, k: 'ghost', x, y, c: '#bfe9ff', a: .55, l: .45 })); rate(S, k + 'a', 30, dt, () => add(S, { b: 1, k: 'glow', x: x + R(-8, 8), y: y + R(-14, 14), vy: R(-50, -15), s: R(2, 4), l: R(.4, .8), c: '#bfe9ff' })); },
  sakura(S, x, y, dt, k) { rate(S, k + 'a', 38, dt, () => add(S, { b: 1, k: 'petal', x: x + R(-10, 10), y: y + R(-16, 14), vx: R(-30, 30), vy: R(-15, 25), g: 25, s: R(3, 5.5), rot: R(0, 6), vr: R(-6, 6), sa: R(15, 40), ph: R(0, 6), l: R(.7, 1.2), c: pick(['#ffb7d5', '#ff8fb8', '#ffd9e8']) })); },
  glitch(S, x, y, dt, k) { rate(S, k + 'a', 50, dt, () => add(S, { b: 1, k: 'glitch', x: x + R(-16, 16), y: y + R(-20, 20), w: R(5, 18), h: R(1.5, 5), l: R(.1, .3), c: pick(['#00ffcc', '#ff2fd0', '#ffffff']) })); rate(S, k + 'g', 16, dt, () => add(S, { b: 1, k: 'ghost', x: x + R(-5, 5), y, c: '#00ffcc', a: .45, o: 1, l: .22 })); },
  shadow(S, x, y, dt, k) { rate(S, k + 'g', 26, dt, () => add(S, { b: 1, k: 'ghost', x, y, c: '#1a0f2e', a: .8, l: .42 })); rate(S, k + 'a', 34, dt, () => add(S, { b: 1, k: 'smoke', x: x + R(-8, 8), y: y + R(-12, 12), vy: R(-30, -5), s: R(5, 9), l: R(.5, .9), c: '#2a1747' })); rate(S, k + 'e', 20, dt, () => add(S, { b: 1, k: 'glow', x: x + R(-3, 3), y: y - 14, s: 2, l: .25, c: '#ff2e4d' })); },
  comet(S, x, y, dt, k) { add(S, { b: 1, k: 'glow', x, y, s: 7, l: .1, c: '#e8f7ff' }); rate(S, k + 'a', 80, dt, () => add(S, { b: 1, k: 'glow', x: x + R(-5, 5), y: y + R(-10, 12), vx: R(-20, 20), vy: R(-20, 20), s: R(2, 4), l: R(.35, .6), c: '#9fdcff' })); rate(S, k + 'b', 22, dt, () => add(S, { b: 1, k: 'spark', x: x + R(-8, 8), y: y + R(-12, 12), vy: R(-30, 30), s: R(2, 4), l: .35, c: '#fff' })); },
  toxic(S, x, y, dt, k) { rate(S, k + 'a', 36, dt, () => add(S, { b: 1, k: 'bubble', x: x + R(-8, 8), y: y + R(-12, 14), vx: R(-10, 10), vy: R(-65, -20), s: R(2, 5), l: R(.45, .9), c: '#9cff3a' })); rate(S, k + 'b', 32, dt, () => add(S, { b: 1, k: 'dot', x: x + R(-7, 7), y: y + R(0, 16), vy: R(0, 40), g: 420, s: R(1.4, 3), l: R(.4, .8), c: '#b6ff4d' })); rate(S, k + 'c', 20, dt, () => add(S, { b: 1, k: 'glow', x: x + R(-6, 6), y: y + R(-10, 10), s: 4, l: .4, c: '#6bff2a' })); },
  galaxy(S, x, y, dt, k) { rate(S, k + 'a', 55, dt, () => add(S, { b: 1, k: 'star', x: x + R(-12, 12), y: y + R(-18, 18), vx: R(-30, 30), vy: R(-30, 30), s: R(2.5, 6), rot: R(0, 6), vr: R(-5, 5), l: R(.5, .9), c: pick(['#ffffff', '#ff2fd0', '#a98bff']) })); rate(S, k + 'b', 30, dt, () => { const a = R(0, TAU); add(S, { b: 1, k: 'glow', x: x + Math.cos(a) * 9, y: y + Math.sin(a) * 14, vx: -Math.sin(a) * 60, vy: Math.cos(a) * 60, s: R(2, 3.5), l: .45, c: pick(['#7a3cff', '#ff2fd0']) }); }); },
  gold(S, x, y, dt, k) { rate(S, k + 'a', 26, dt, () => add(S, { b: 1, k: 'coin', x: x + R(-8, 8), y: y + R(-12, 8), vx: R(-40, 40), vy: R(-100, -25), g: 430, s: R(3, 4.6), rot: R(0, 6), vr: R(8, 16), l: R(.6, .95) })); rate(S, k + 'b', 45, dt, () => add(S, { b: 1, k: 'spark', x: x + R(-10, 10), y: y + R(-16, 16), s: R(2, 4), l: R(.2, .45), c: pick(['#fff3b0', '#ffd23f']) })); rate(S, k + 'c', 22, dt, () => add(S, { b: 1, k: 'glow', x: x + R(-7, 7), y: y + R(-12, 12), s: 3, l: .35, c: '#ffd23f' })); }
};
function trail(S, x, y, id, key) {
  const d = TR[id | 0]; if (!d) return; const dt = S.dt || .016; (S.rid || (S.rid = {}))[key] = id | 0;
  if (d.rib) { const a = S.rib[key] || (S.rib[key] = []), l = a[a.length - 1]; if (!l || Math.hypot(l.x - x, l.y - y) > 2.2) { a.push({ x, y, t: S.time }); if (a.length > 40) a.shift(); } }
  TFX[d.fx](S, x, y, dt, key + id);
}
function drawRib(S, c, id0) {
  for (const key in S.rib) {
    const a = S.rib[key], d = TR[S.rid ? S.rid[key] : id0]; if (!d || !d.rib || a.length < 2) continue;
    const r = d.rib; c.lineCap = 'round'; c.lineJoin = 'round'; c.globalCompositeOperation = r.add ? 'lighter' : 'source-over';
    for (let i = 1; i < a.length; i++) {
      const age = cl((S.time - a[i].t) / .5, 0, 1), fr = i / a.length, w = r.w * (1 - age) * (.25 + .75 * fr), fade = 1 - age;
      let col; if (r.c == 'rb') col = hsl(i * 22 + S.time * 200, 95, 60, 1); else col = mix(r.c[1], r.c[0], fr, 1);
      c.beginPath(); c.moveTo(a[i - 1].x, a[i - 1].y); c.lineTo(a[i].x, a[i].y);
      c.globalAlpha = .22 * fade; c.strokeStyle = col; c.lineWidth = w * 2.2; c.stroke();
      c.globalAlpha = .9 * fade; c.lineWidth = w; c.stroke();
    }
  }
  c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
}

/* ================= EMOTES ANIMÉES ================= */
// col = couleur de la bulle · an = animation du symbole · fx = effets autour
const EMD = {
  '👍': { col: '#4cc9f0', an: 'pop', fx: 'sparkle', f: 660 }, '😂': { col: '#ffd23f', an: 'shake', fx: 'tears', f: 740 }, '😡': { col: '#ff3b30', an: 'pulse', fx: 'steam', f: 180 },
  '🔥': { col: '#ff7a1a', an: 'pop', fx: 'flames', f: 330 }, '🫡': { col: '#9aa3b8', an: 'tilt', fx: 'sparkle', f: 440 }, '💀': { col: '#c9ccd6', an: 'float', fx: 'smoke', f: 150 },
  '🎉': { col: '#ff5fa2', an: 'spin', fx: 'confetti', f: 880 }, '❤️': { col: '#ff4d6d', an: 'beat', fx: 'hearts', f: 520 }, '😎': { col: '#2f6bff', an: 'pop', fx: 'glint', f: 400 },
  '🤡': { col: '#ff9500', an: 'shake', fx: 'honk', f: 300 }, '🥶': { col: '#8fe3ff', an: 'shake', fx: 'frost', f: 700 }, '😭': { col: '#4cc9f0', an: 'shake', fx: 'tears', f: 260 },
  '🤯': { col: '#ff9500', an: 'pop', fx: 'boom', f: 120 }, '🥳': { col: '#a45cff', an: 'spin', fx: 'confetti', f: 760 }, '😈': { col: '#a855f7', an: 'pulse', fx: 'purple', f: 200 },
  '👀': { col: '#e6e6f0', an: 'look', fx: 'none', f: 500 }, '💪': { col: '#ffd23f', an: 'beat', fx: 'sparkle', f: 350 }, '👋': { col: '#ffcc66', an: 'wave', fx: 'none', f: 580 },
  '🏆': { col: '#ffd23f', an: 'pop', fx: 'coins', f: 840 }, '⚡': { col: '#ffe14d', an: 'shake', fx: 'bolts', f: 960 }, 'GG': { col: '#2ee6a6', an: 'pop', fx: 'sparkle', f: 620, txt: 1 },
  'WOW': { col: '#ff5fa2', an: 'pulse', fx: 'boom', f: 700, txt: 1 }
};
const emd = l => EMD[l] || { col: '#ffd23f', an: 'pop', fx: 'sparkle', f: 500 };
const EFX = {
  sparkle(S, x, y, dt, E) { rate(E, 'a', 18, dt, () => add(S, { k: 'star', x: x + R(-32, 32), y: y + R(-32, 32), vy: -20, s: R(2.5, 6), l: R(.4, .8), vr: 5, c: pick(['#fff', E.d.col, '#ffe14d']) })); },
  tears(S, x, y, dt, E) { rate(E, 'a', 16, dt, () => add(S, { k: 'dot', x: x + (Math.random() < .5 ? -14 : 14), y: y + 2, vx: R(-20, 20) + (Math.random() < .5 ? -40 : 40), vy: R(-80, -20), g: 520, s: R(2, 3.4), l: .8, c: '#7fd4ff' })); },
  steam(S, x, y, dt, E) { rate(E, 'a', 16, dt, () => add(S, { k: 'smoke', x: x + (Math.random() < .5 ? -22 : 22), y: y - 8, vx: R(-15, 15), vy: R(-50, -20), s: R(5, 8), l: .7, c: '#ffb0a8' })); rate(E, 'b', 10, dt, () => add(S, { k: 'spark', x: x + R(-26, 26), y: y + R(-26, 26), s: R(3, 6), l: .25, c: '#ff3b30' })); },
  flames(S, x, y, dt, E) { rate(E, 'a', 70, dt, () => add(S, { k: 'flame', x: x + R(-22, 22), y: y + R(10, 26), vx: R(-20, 20), vy: R(-110, -40), g: -80, s: R(5, 10), l: R(.3, .55), c: '#ffd23f', c2: '#ff3b00' })); },
  purple(S, x, y, dt, E) { rate(E, 'a', 60, dt, () => add(S, { k: 'flame', x: x + R(-22, 22), y: y + R(10, 26), vx: R(-20, 20), vy: R(-110, -40), g: -80, s: R(5, 10), l: R(.3, .55), c: '#d9a6ff', c2: '#5b1fb0' })); },
  smoke(S, x, y, dt, E) { rate(E, 'a', 26, dt, () => add(S, { k: 'smoke', x: x + R(-20, 20), y: y + R(10, 24), vy: R(-50, -20), s: R(5, 9), l: R(.6, 1), c: '#8890a3' })); },
  confetti(S, x, y, dt, E) { rate(E, 'a', 40, dt, () => add(S, { k: 'conf', x: x + R(-18, 18), y: y - 10, vx: R(-110, 110), vy: R(-180, -60), g: 360, s: R(2, 3.6), rot: R(0, 6), vr: R(-9, 9), l: R(.8, 1.4), c: hsl(R(0, 360), 90, 60) })); },
  hearts(S, x, y, dt, E) { rate(E, 'a', 9, dt, () => add(S, { k: 'txt', t: '❤', x: x + R(-26, 26), y: y + R(0, 20), vy: R(-70, -35), vx: R(-10, 10), s: R(10, 20), rot: R(-.4, .4), l: R(.8, 1.3), c: pick(['#ff4d6d', '#ff8fa3', '#ff2e5e']) })); },
  glint(S, x, y, dt, E) { rate(E, 'a', 3, dt, () => add(S, { k: 'star', x: x + R(-12, 4), y: y - 4, s: R(5, 8), l: .4, c: '#fff', vr: 8 })); },
  honk(S, x, y, dt, E) { rate(E, 'a', 4, dt, () => add(S, { k: 'ring', x, y, s: 44, l: .5, c: '#ff9500', lw: 3 })); },
  frost(S, x, y, dt, E) { rate(E, 'a', 28, dt, () => add(S, { k: 'spark', x: x + R(-30, 30), y: y + R(-30, 30), vy: R(10, 40), s: R(2, 5), l: R(.4, .8), c: '#dff6ff' })); },
  boom(S, x, y, dt, E) { rate(E, 'a', 30, dt, () => { const a = R(0, TAU); add(S, { k: 'streak', x, y, vx: Math.cos(a) * 200, vy: Math.sin(a) * 200, s: 2, l: .3, d: 3, c: pick(['#ffd23f', '#ff7a1a', '#fff']) }); }); },
  coins(S, x, y, dt, E) { rate(E, 'a', 14, dt, () => add(S, { k: 'coin', x: x + R(-22, 22), y: y - 4, vx: R(-50, 50), vy: R(-130, -50), g: 430, s: R(3, 5), rot: R(0, 6), vr: R(8, 14), l: R(.7, 1.1) })); },
  bolts(S, x, y, dt, E) { rate(E, 'a', 12, dt, () => { const a = R(0, TAU), d = R(30, 50); add(S, { k: 'bolt', pts: bolt(x + Math.cos(a) * 24, y + Math.sin(a) * 24, x + Math.cos(a) * d, y + Math.sin(a) * d, 5), s: 1, c: '#ffe14d', l: R(.1, .18) }); }); },
  none() { }
};
function emote(S, key, label) {
  const d = emd(label); S.em = S.em.filter(e => e.key !== key); S.em.push({ key, label, d, age: 0, life: 2.7, acc: {}, px: 0, py: 0, ok: 0, st: 0 });
}
function stepEm(S, dt, pos) {
  for (let i = S.em.length - 1; i >= 0; i--) {
    const E = S.em[i]; E.age += dt; if (E.age >= E.life) { S.em.splice(i, 1); continue; }
    const p = pos(E.key); E.ok = !!p; if (!p) continue; E.px = p[0]; E.py = p[1] - 66 - Math.min(E.age, 1) * 8;
    if (!E.st) { E.st = 1; startFx(S, E); } if (E.age < E.life - .35) EFX[E.d.fx](S, E.px, E.py, dt, E);
  }
}
function startFx(S, E) {
  const x = E.px, y = E.py, d = E.d, f = d.fx; add(S, { k: 'ring', x, y, s: 52, l: .5, c: d.col, lw: 4 });
  if (f == 'confetti') for (let i = 0; i < 28; i++) { const a = R(-PI, 0); add(S, { k: 'conf', x, y, vx: Math.cos(a) * R(60, 220), vy: Math.sin(a) * R(100, 260), g: 380, d: .4, s: R(2, 4), rot: R(0, 6), vr: R(-10, 10), l: R(.9, 1.5), c: hsl(R(0, 360), 90, 60) }); }
  if (f == 'boom') { for (let i = 0; i < 22; i++) { const a = R(0, TAU), v = R(100, 280); add(S, { k: 'flame', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, d: 2.5, s: R(4, 8), l: R(.3, .6), c: '#ffd23f', c2: '#ff3b00' }); } add(S, { k: 'ring', x, y, s: 80, l: .45, c: '#fff', lw: 3 }); }
  if (f == 'honk') for (let i = 0; i < 3; i++) setTimeout(() => add(S, { k: 'ring', x: E.px, y: E.py, s: 56 + i * 12, l: .5, c: '#ff9500', lw: 3 }), i * 110);
  if (f == 'frost') for (let i = 0; i < 16; i++) { const a = R(0, TAU); add(S, { k: 'spark', x, y, vx: Math.cos(a) * 110, vy: Math.sin(a) * 110, d: 3, s: R(3, 6), l: .5, c: '#dff6ff' }); }
  if (f == 'bolts') for (let i = 0; i < 4; i++) { const a = R(0, TAU); add(S, { k: 'bolt', pts: bolt(x, y, x + Math.cos(a) * 50, y + Math.sin(a) * 50, 8), s: 1.2, c: '#ffe14d', l: .22 }); }
  if (f == 'coins' || f == 'sparkle' || f == 'hearts') for (let i = 0; i < 8; i++) { const a = R(0, TAU); add(S, { k: 'star', x, y, vx: Math.cos(a) * 90, vy: Math.sin(a) * 90, d: 2.5, s: R(3, 6), l: .5, vr: 6, c: pick(['#fff', d.col]) }); }
  try { const dist = Math.hypot(x - (me.x + 10), y - me.y); if (S === GS && dist < 700) { const b = d.f; snd(b, .09, .045 * (dist > 300 ? .6 : 1), 'triangle'); setTimeout(() => snd(b * 1.5, .13, .04 * (dist > 300 ? .6 : 1), 'triangle'), 75); } } catch (e) { }
}
const eout = u => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(u - 1, 3) + c1 * Math.pow(u - 1, 2); };
function drawEm(S, c) {
  for (const E of S.em) {
    if (!E.ok) continue; const d = E.d, a = E.age, left = E.life - a;
    let s = a < .38 ? Math.max(0, eout(a / .38)) : 1, al = 1; if (left < .35) { s *= left / .35; al = left / .35; }
    c.save(); c.translate(E.px, E.py); c.scale(s, s); c.globalAlpha = al; c.globalCompositeOperation = 'source-over';
    c.font = (d.txt ? '800 20px ' : '30px ') + FONT; const tw = d.txt ? c.measureText(E.label).width : 0, hw = d.txt ? tw / 2 + 12 : 25, hh = 25;
    c.shadowColor = d.col; c.shadowBlur = 12 + 4 * Math.sin(a * 8);
    c.fillStyle = 'rgba(14,18,34,.86)'; c.strokeStyle = d.col; c.lineWidth = 2.6;
    if (d.txt) rr(c, -hw, -hh, hw * 2, hh * 2, 14); else { c.beginPath(); c.arc(0, 0, hh, 0, TAU); }
    c.fill(); c.stroke(); c.shadowBlur = 0;
    c.beginPath(); c.moveTo(-6, hh - 2); c.lineTo(0, hh + 8); c.lineTo(6, hh - 2); c.closePath(); c.fillStyle = 'rgba(14,18,34,.9)'; c.fill(); c.stroke();
    c.beginPath(); c.moveTo(-5, hh - 1.6); c.lineTo(5, hh - 1.6); c.strokeStyle = 'rgba(14,18,34,.95)'; c.lineWidth = 3; c.stroke();
    c.save(); const an = d.an;
    if (an == 'shake') c.rotate(Math.sin(a * 28) * .2); else if (an == 'pulse') { const k = 1 + .14 * Math.sin(a * 9); c.scale(k, k); }
    else if (an == 'beat') { const k = 1 + .3 * Math.pow(Math.max(0, Math.sin(a * 7)), 4); c.scale(k, k); }
    else if (an == 'spin') c.rotate(a < .8 ? a / .8 * TAU * 2 : 0); else if (an == 'wave') { c.translate(0, 10); c.rotate(Math.sin(a * 10) * .45); c.translate(0, -10); }
    else if (an == 'look') c.translate(Math.sin(a * 5) * 6, 0); else if (an == 'float') c.translate(0, Math.sin(a * 4) * 3); else if (an == 'tilt') c.rotate(-.35 * Math.min(1, a * 8));
    c.textAlign = 'center'; c.textBaseline = 'middle';
    if (d.txt) { c.lineWidth = 4; c.strokeStyle = 'rgba(0,0,0,.6)'; c.strokeText(E.label, 0, 1); c.fillStyle = d.col; c.fillText(E.label, 0, 1); } else c.fillText(E.label, 0, 2);
    c.restore(); c.restore();
  }
  c.globalAlpha = 1;
}

/* ================= AVATARS : cadres de rareté ================= */
const RAR = [{ n: 'Commun', c: '#9aa3b8' }, { n: 'Rare', c: '#4cc9f0' }, { n: 'Épique', c: '#b36bff' }, { n: 'Légendaire', c: '#ffd23f' }, { n: 'Mythique', c: 'rb' }];
function badge(c, x, y, r, emo, rar, t) {
  rar = cl(rar | 0, 0, 4); const col = RAR[rar].c, rb = rar == 4; c.save(); c.globalCompositeOperation = 'source-over';
  if (rar >= 2) { c.shadowColor = rb ? hsl(t * 120, 100, 60) : col; c.shadowBlur = r * (rar == 2 ? .6 : .9 + .35 * Math.sin(t * 3)); }
  const gr = c.createRadialGradient(x, y - r * .35, r * .1, x, y, r); gr.addColorStop(0, '#2c3658'); gr.addColorStop(1, '#0d111f');
  c.beginPath(); c.arc(x, y, r, 0, TAU); c.fillStyle = gr; c.fill(); c.shadowBlur = 0; c.lineWidth = r * .17;
  if (rb) for (let i = 0; i < 24; i++) { c.beginPath(); c.arc(x, y, r, i * TAU / 24, (i + 1.15) * TAU / 24); c.strokeStyle = hsl(t * 140 + i * 15, 95, 60); c.stroke(); }
  else { c.beginPath(); c.arc(x, y, r, 0, TAU); c.strokeStyle = col; c.stroke(); }
  if (rar >= 3) { c.beginPath(); c.arc(x, y, r * .9, t * 2.2, t * 2.2 + .9); c.strokeStyle = 'rgba(255,255,255,.85)'; c.lineWidth = r * .07; c.stroke(); }
  if (rb) for (let i = 0; i < 3; i++) { const a = t * 2 + i * TAU / 3; c.fillStyle = hsl(t * 200 + i * 120, 100, 70); c.beginPath(); c.arc(x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3, r * .1, 0, TAU); c.fill(); }
  c.font = (r * 1.15 | 0) + 'px ' + FONT; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#fff'; c.fillText(emo, x, y + r * .06); c.restore();
}
const avDom = (emo, rar, big) => '<span class="xv r' + cl(rar | 0, 0, 4) + (big ? ' big' : '') + '">' + emo + '</span>';
const emDom = l => { const d = emd(l); return '<span class="xav xe-' + d.an + '"' + (d.txt ? ' style="font:800 26px ' + FONT + ';color:' + d.col + '"' : '') + '>' + l + '</span>'; };

/* ================= effets EVO (skins d'arme évolutifs) ================= */
const TH = [0, 10, 30, 60, 100];
const EVC = {
  12: { n: 'Phénix', c: ['#ffb347', '#ff3b00'], t: 'fire' }, 13: { n: 'Foudre', c: ['#4cc9f0', '#ffffff'], t: 'bolt' },
  14: { n: 'Dragon', c: ['#7dff6a', '#ffd23f'], t: 'dragon' }, 15: { n: 'Cosmos', c: ['#c58bff', '#ff2fd0'], t: 'cosmos' },
  16: { n: 'Venin', c: ['#9cff3a', '#2a8a14'], t: 'toxic' }, 17: { n: 'Spectre', c: ['#bff3ff', '#6b8cff'], t: 'ghost' }
};
function evoCur() {
  const W = window.MGWS, X = window.MGX && MGX.X; if (!W || !X) return null; const id = X.sk | 0; if (id < W.base) return null;
  const s = W.list[id - W.base]; if (!s || s[2] != 'V' || !EVC[id]) return null; return { id, lv: W.lvl(id), k: W.evo()[id] | 0, cf: EVC[id], name: s[0] };
}
const evBurst = (S, t, x, y, n, c) => { // petites gerbes d'impact / de bouche selon le skin
  for (let i = 0; i < n; i++) { const a = R(0, TAU), v = R(40, 190);
    if (t == 'fire') add(S, { k: 'flame', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 30, g: -60, d: 2, s: R(3, 6), l: R(.25, .5), c: '#ffd23f', c2: '#ff3b00' });
    else if (t == 'bolt') add(S, { k: 'spark', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, d: 3, s: R(3, 6), l: R(.2, .4), c: pick(['#fff', '#4cc9f0']) });
    else if (t == 'dragon') add(S, { k: 'flame', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, d: 2, s: R(3, 6), l: R(.25, .5), c: '#7dff6a', c2: '#1f8a3a' });
    else if (t == 'cosmos') add(S, { k: 'star', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, d: 2.5, s: R(3, 6), vr: R(-8, 8), l: R(.4, .7), c: pick(['#fff', '#ff2fd0', '#a98bff']) });
    else if (t == 'toxic') add(S, { k: i & 1 ? 'bubble' : 'dot', x, y, vx: Math.cos(a) * v * .6, vy: Math.sin(a) * v * .6 - 20, g: 200, d: 1.5, s: R(1.5, 4), l: R(.4, .8), c: '#9cff3a' });
    else add(S, { k: 'glow', x, y, vx: Math.cos(a) * v * .5, vy: Math.sin(a) * v * .5 - 30, d: 1.5, s: R(2, 4), l: R(.4, .8), c: pick(['#bff3ff', '#6b8cff']) });
  }
};
function evFinish(S, id, lv, x, y) {
  const cf = EVC[id]; if (!cf || lv < 3) return; const big = lv >= 5, k = big ? 1 : lv == 4 ? .6 : .35, t = cf.t;
  add(S, { k: 'ring', x, y, s: 60 + k * 60, l: .5, c: cf.c[0], lw: 4 });
  if (t == 'fire') { for (let i = 0; i < 30 * k; i++) add(S, { k: 'flame', x: x + R(-12, 12), y: y + R(0, 20), vx: R(-60, 60), vy: -R(120, 330), g: -40, s: R(5, 11), l: R(.4, .9), c: '#ffd23f', c2: '#ff3b00' }); if (big) for (let i = 0; i < 12; i++) add(S, { k: 'petal', x, y, vx: R(-120, 120), vy: -R(60, 220), g: 120, s: R(4, 7), rot: R(0, 6), vr: R(-8, 8), l: R(.8, 1.4), c: '#ff9a2e' }); }
  else if (t == 'bolt') { for (let i = 0; i < 3 * k + 1; i++) { const sx = x + R(-14, 14); add(S, { k: 'bolt', pts: bolt(sx + R(-30, 30), y - 280, sx, y + 8, 14), s: R(1.3, 2.2), c: '#4cc9f0', l: R(.18, .3) }); } for (let i = 0; i < 24 * k; i++) { const a = R(0, TAU), v = R(60, 260); add(S, { k: 'spark', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, d: 3, s: R(3, 6), l: R(.25, .5), c: '#e6fbff' }); } }
  else if (t == 'dragon') { for (let i = 0; i < 34 * k; i++) { const a = R(-PI, 0), v = R(90, 300); add(S, { k: 'flame', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, d: 1.6, g: -30, s: R(5, 10), l: R(.4, .8), c: '#ffd23f', c2: '#3fb55a' }); } for (let i = 0; i < 8 * k; i++) add(S, { k: 'smoke', x: x + R(-14, 14), y, vy: -R(30, 90), s: R(7, 12), l: R(.7, 1.2), c: '#103a1c' }); }
  else if (t == 'cosmos') { for (let i = 0; i < 26 * k + 4; i++) { const a = R(0, TAU), r0 = R(50, 80); add(S, { k: 'star', x: x + Math.cos(a) * r0, y: y + Math.sin(a) * r0, vx: -Math.cos(a) * 200, vy: -Math.sin(a) * 200, s: R(3, 6), vr: 8, l: .3, c: pick(['#fff', '#ff2fd0', '#a98bff']) }); }
    setTimeout(() => { add(S, { k: 'ring', x, y, s: 110 * k + 30, l: .55, c: '#ff2fd0', lw: 5 }); for (let i = 0; i < 30 * k + 4; i++) { const a = R(0, TAU), v = R(100, 320); add(S, { k: 'star', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, d: 2.2, s: R(3, 7), vr: R(-8, 8), l: R(.5, .9), c: pick(['#fff', '#ff2fd0', '#a98bff', '#7a3cff']) }); } }, 300); }
  else if (t == 'toxic') { for (let i = 0; i < 14 * k + 3; i++) add(S, { k: 'smoke', x: x + R(-16, 16), y: y + R(-10, 12), vx: R(-40, 40), vy: -R(10, 60), s: R(8, 14), l: R(.8, 1.3), c: '#59d62a' }); for (let i = 0; i < 20 * k + 3; i++) add(S, { k: 'bubble', x: x + R(-18, 18), y: y + R(-10, 14), vy: -R(30, 110), s: R(2, 6), l: R(.6, 1.1), c: '#9cff3a' }); }
  else { for (let i = 0; i < 4 * k + 1; i++) add(S, { k: 'ghost', x: x + R(-14, 14), y: y + R(-4, 12), vy: -R(50, 110), c: '#bff3ff', a: .6, l: R(.7, 1.1) }); for (let i = 0; i < 22 * k; i++) add(S, { k: 'glow', x: x + R(-14, 14), y, vx: R(-50, 50), vy: -R(40, 160), s: R(2, 4), l: R(.5, 1), c: pick(['#bff3ff', '#6b8cff']) }); }
  if (big) { try { shake = Math.max(shake, 8); } catch (e) { } }
}
function evTrail(S, b, lv) {
  const cf = EVC[b.ev]; if (!cf) return; const n = lv < 2 ? 0 : lv == 2 ? (Math.random() < .5 ? 1 : 0) : lv - 1, t = cf.t, x = b.x, y = b.y, big = lv >= 5 ? 1.4 : 1;
  for (let i = 0; i < n; i++) {
    if (t == 'fire') add(S, { k: 'flame', x, y, vx: R(-20, 20), vy: R(-35, 10), g: -50, s: R(3, 6) * big, l: R(.25, .45), c: '#ffd23f', c2: '#ff3b00' });
    else if (t == 'bolt') { add(S, { k: 'spark', x, y, vx: R(-40, 40), vy: R(-40, 40), s: R(3, 5), l: .25, c: '#e6fbff' }); if (lv >= 3 && Math.random() < .5) add(S, { k: 'bolt', pts: bolt(x, y, x - b.vx * .05 + R(-9, 9), y - b.vy * .05 + R(-9, 9), 5), s: 1, c: '#4cc9f0', l: .12 }); }
    else if (t == 'dragon') { add(S, { k: 'flame', x, y, vx: R(-20, 20), vy: R(-30, 10), g: -50, s: R(3, 6) * big, l: R(.25, .45), c: '#7dff6a', c2: '#1f8a3a' }); if (lv >= 5) add(S, { k: 'dot', x, y, vx: R(-40, 40), vy: R(-60, 0), g: 100, s: 1.6, l: .5, c: '#ffd23f', sh: 1 }); }
    else if (t == 'cosmos') add(S, { k: 'star', x, y, vx: R(-25, 25), vy: R(-25, 25), s: R(2.5, 5) * big, vr: R(-6, 6), l: R(.4, .7), c: pick(['#fff', '#ff2fd0', '#a98bff']) });
    else if (t == 'toxic') add(S, { k: Math.random() < .4 ? 'bubble' : 'dot', x, y, vx: R(-15, 15), vy: R(-10, 25), g: 260, s: R(1.5, 3.2), l: R(.4, .7), c: '#9cff3a' });
    else add(S, { k: Math.random() < .5 ? 'glow' : 'smoke', x, y, vx: R(-15, 15), vy: R(-25, 5), s: R(2, 4), l: R(.4, .8), c: '#bff3ff' });
  }
}
let prevB = new Map(), lastK = -1, lastVic = null, seenLv = {}, hudA = 0;
function getPos(k) { const e = k === 'me' ? me : RV[k]; return e && e.al ? [e.x + 10, e.y] : null; }
function evoStep() {
  const ev = evoCur(), cur = new Map();
  for (const b of bl) if (b.ev) { cur.set(b, { x: b.x, y: b.y, id: b.ev, lv: b.lv | 0 }); evTrail(GS, b, b.lv | 0); }
  for (const [b, i] of prevB) if (!cur.has(b) && i.lv >= 2) { evBurst(GS, EVC[i.id].t, i.x, i.y, 3 + i.lv * 2, EVC[i.id].c); if (i.lv >= 4) add(GS, { k: 'ring', x: i.x, y: i.y, s: 22 + i.lv * 4, l: .3, c: EVC[i.id].c[0], lw: 2 }); }
  prevB = cur;
  if (!ev) { lastK = me.k | 0; return; }
  const k = me.k | 0; if (lastK < 0 || k < lastK) lastK = k;
  if (k > lastK) { lastK = k; const v = lastVic && performance.now() - lastVic.t < 2500 ? lastVic : null; evFinish(GS, ev.id, ev.lv, v ? v.x : me.x + 10, v ? v.y : me.y + 19); }
  if (seenLv[ev.id] == null) seenLv[ev.id] = ev.lv; else if (ev.lv > seenLv[ev.id]) { seenLv[ev.id] = ev.lv; levelUp(ev); }
}
function levelUp(ev) {
  const x = me.x + 10, y = me.y + 19, cf = ev.cf;
  try { banner('⭐ ' + cf.n.toUpperCase() + ' — NIVEAU ' + ev.lv + (ev.lv >= 5 ? ' MAX !' : ' !'), cf.c[0]); feed('Skin EVO ' + cf.n + ' : niveau ' + ev.lv); } catch (e) { }
  add(GS, { k: 'ring', x, y, s: 140, l: .7, c: cf.c[0], lw: 6 }); add(GS, { k: 'ring', x, y, s: 90, l: .55, c: '#fff', lw: 3 });
  for (let i = 0; i < 30; i++) { const a = R(0, TAU), v = R(80, 300); add(GS, { k: 'star', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, d: 2, s: R(4, 8), vr: R(-8, 8), l: R(.6, 1.1), c: pick([cf.c[0], cf.c[1], '#fff']) }); }
  evBurst(GS, cf.t, x, y, 18, cf.c);
  try { for (let i = 0; i < 4; i++) setTimeout(() => snd(440 * Math.pow(1.26, i), .12, .06, 'triangle'), i * 90); if (ev.lv >= 5) setTimeout(() => snd(1320, .4, .06, 'sine'), 380); } catch (e) { }
}
function evoHud() {
  const ev = evoCur(); if (!ev || !run) { hudA = 0; return; } hudA = Math.min(1, hudA + .08);
  const nx = TH.find(v => v > ev.k), pv = TH[ev.lv - 1] | 0, pr = nx ? cl((ev.k - pv) / (nx - pv), 0, 1) : 1, w = 200, h = 34, x = Wd / 2 - w / 2, y = Ht - 84, cf = ev.cf;
  g.save(); g.globalAlpha = hudA; g.fillStyle = 'rgba(10,14,28,.62)'; rr(g, x, y, w, h, 10); g.fill(); g.strokeStyle = cf.c[0]; g.globalAlpha = hudA * .6; g.lineWidth = 1.2; g.stroke(); g.globalAlpha = hudA;
  g.font = '800 11px system-ui,sans-serif'; g.textAlign = 'left'; g.fillStyle = cf.c[0]; g.fillText('EVO ' + cf.n.toUpperCase() + ' · NIV ' + ev.lv, x + 10, y + 14); g.textAlign = 'right'; g.fillStyle = '#fff'; g.fillText(nx ? ev.k + ' / ' + nx : 'MAX', x + w - 10, y + 14);
  g.fillStyle = 'rgba(255,255,255,.14)'; rr(g, x + 10, y + 21, w - 20, 7, 3.5); g.fill();
  const gd = g.createLinearGradient(x + 10, 0, x + w - 10, 0); gd.addColorStop(0, cf.c[1]); gd.addColorStop(1, cf.c[0]); g.fillStyle = gd; if (pr > 0) { rr(g, x + 10, y + 21, Math.max(7, (w - 20) * pr), 7, 3.5); g.fill(); }
  g.restore();
}
hook('fire', function (o, id, x, y, a, wi, mine, q) {
  const n = bl.length; o.call(this, id, x, y, a, wi, mine, q);
  try { const ev = mine ? evoCur() : null; if (!ev) return; for (let i = n; i < bl.length; i++) { const b = bl[i]; b.ev = ev.id; b.lv = ev.lv; if (ev.lv >= 2) b.c = ev.cf.c[0]; }
    const gx = x + Math.cos(a) * MZ[wi], gy = y + Math.sin(a) * MZ[wi]; if (ev.lv >= 3) evBurst(GS, ev.cf.t, gx, gy, ev.lv - 1, ev.cf.c); } catch (e) { }
});
hook('die', function (o, e, by) { try { if (by === 'me' && e !== me) lastVic = { x: e.x + 10, y: e.y + 19, t: performance.now() }; } catch (x) { } return o.call(this, e, by); });
hook('hitFx', function (o, d, hd, x, y) { try { lastVic = { x, y: y + 19, t: performance.now() }; } catch (e) { } return o.apply(this, [d, hd, x, y]); });
hook('update', function (o, dt) { o(dt); stepP(GS, dt); stepEm(GS, dt, getPos); evoStep(); });
hook('ent', function (o, e, m) { if (!GS.behind) { GS.behind = 1; try { drawRib(GS, g, 0); for (const q of GS.p) if (q.b) dp(g, q); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; } catch (x) { } } return o.call(this, e, m); });
hook('fxDraw', function (o) { o(); GS.behind = 0; g.save(); try { for (const q of GS.p) if (!q.b) dp(g, q); drawEm(GS, g); } catch (x) { } g.restore(); });
hook('hud', function (o) { o(); try { evoHud(); } catch (e) { } });

/* ================= aperçu en boutique (traînées, emotes, avatars) ================= */
let ov, pc, praf = 0, ps = null, PS = null, ST_ = {};
function pclose() { if (ov) ov.style.display = 'none'; cancelAnimationFrame(praf); praf = 0; removeEventListener('keydown', pkey, true); }
function pkey(e) { if (e.key == 'Escape') { e.stopImmediatePropagation(); e.preventDefault(); pclose(); } }
function dummy(c, x, y, t, col) { cap(c, x, y + 1, col || '#5f7a40', 1); c.fillStyle = '#e8c59a'; c.beginPath(); c.arc(x + 2, y - 13, 5, 0, TAU); c.fill(); c.fillStyle = '#222'; c.fillRect(x + 1, y - 15, 6, 2.4); c.fillStyle = 'rgba(0,0,0,.4)'; c.fillRect(x - 6, y + 4, 12, 3); }
function pframe() {
  if (!praf) return; const c = pc.getContext('2d'), W = pc.width, H = pc.height, now = performance.now() / 1000, dt = Math.min(.05, now - (ST_.l || now)); ST_.l = now; const t = now - ST_.t0;
  c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, W, H); const gr = c.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#26304f'); gr.addColorStop(1, '#0f1426'); c.fillStyle = gr; c.fillRect(0, 0, W, H);
  c.fillStyle = 'rgba(255,255,255,.5)'; for (let i = 0; i < 26; i++) c.fillRect((i * 97 + 13) % W, (i * 53 + 7) % (H * .6), 1.5, 1.5);
  const k = W / 311, G = 130; c.save(); c.scale(k, k); c.fillStyle = '#1b2440'; c.fillRect(0, G, 311, 40); c.fillStyle = '#4a5b8f'; c.fillRect(0, G, 311, 2);
  const cat = ps.cat; stepP(PS, dt); let px = 155, py = G - 19;
  if (cat == 'tr') { const T = t % 2.4; let x; if (T < .3) x = 55; else if (T < .72) { const u = (T - .3) / .42; x = 55 + (1 - Math.pow(1 - u, 3)) * 200; trail(PS, x, py, ps.i, 'pv'); } else if (T < 1.7) x = 255; else x = 255 - (T - 1.7) / .7 * 200; px = x; }
  else if (cat == 'em') { px = 155; if (!ST_.n || t - ST_.n > 2.4) { ST_.n = t; emote(PS, 'pv', ps.label); } stepEm(PS, dt, () => [px, py - 19]); }
  if (cat == 'tr') { drawRib(PS, c, ps.i); for (const q of PS.p) if (q.b) dp(c, q); c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1; dummy(c, px, py, t); for (const q of PS.p) if (!q.b) dp(c, q); }
  else if (cat == 'em') { dummy(c, px, py, t); for (const q of PS.p) dp(c, q); drawEm(PS, c); }
  else { badge(c, 155, 66, 40, ps.emo, ps.rar, t); c.font = '800 13px ' + FONT; c.textAlign = 'center'; c.fillStyle = RAR[ps.rar].c == 'rb' ? hsl(t * 140, 95, 65) : RAR[ps.rar].c; c.fillText(RAR[ps.rar].n.toUpperCase(), 155, 120); c.fillStyle = 'rgba(255,255,255,.8)'; c.font = '600 10px ' + FONT; c.fillText('Visible au-dessus de ta tête en partie', 155, 140);
    c.fillStyle = 'rgba(14,18,34,.8)'; rr(c, 80, 150, 151, 20, 10); c.fill(); badge(c, 94, 160, 7, ps.emo, ps.rar, t); c.font = '600 8px ' + FONT; c.textAlign = 'left'; c.fillStyle = 'rgba(255,255,255,.9)'; c.fillText('🇫🇷 Recrue · Niv 12', 106, 163); }
  c.restore(); c.globalAlpha = 1; praf = requestAnimationFrame(pframe);
}
function preview(cat, i, label, buyFn, price, miss, nm, rar, emo) {
  if (!ov) {
    const st = document.createElement('style'); st.textContent = '#xfp{position:fixed;inset:0;z-index:99999;display:none;align-items:center;justify-content:center;background:rgba(5,8,16,.82)}#xfp .xpb{width:min(94vw,380px);max-height:96vh;display:grid;gap:8px;padding:12px;border-radius:16px;background:#151a2b;border:1px solid rgba(255,255,255,.18);color:#fff;font:700 14px system-ui,sans-serif;text-align:center}#xfp canvas{width:100%;height:auto;border-radius:12px}#xfp .r{display:flex;gap:6px}#xfp button{flex:1;padding:10px 6px;border:0;border-radius:10px;font:800 13px system-ui,sans-serif;background:#2a3350;color:#fff}#xfp button[data-a=buy]{background:linear-gradient(180deg,#ffc247,#ff9a1f);color:#111}#xfp button:disabled{opacity:.55}';
    document.head.appendChild(st); ov = document.createElement('div'); ov.id = 'xfp';
    ov.innerHTML = '<div class="xpb"><div class="t"></div><canvas width="560" height="300"></canvas><div class="r"><button data-a="re">↻ Rejouer</button><button data-a="buy"></button></div><button data-a="close">Fermer</button></div>';
    document.body.appendChild(ov); pc = ov.querySelector('canvas');
    ov.onclick = e => { const a = e.target.dataset && e.target.dataset.a; if (e.target === ov || a == 'close') pclose(); else if (a == 're') { ST_.t0 = performance.now() / 1000; ST_.n = 0; PS = Stage(); } else if (a == 'buy' && ps.buy) { const b = ps.buy; pclose(); b(); } };
  }
  ps = { cat, i, label, buy: buyFn, emo, rar }; PS = Stage(); ST_ = { t0: performance.now() / 1000, l: 0, n: 0 };
  ov.querySelector('.t').textContent = 'Aperçu : ' + nm; const bb = ov.querySelector('[data-a=buy]'); bb.style.display = buyFn ? '' : 'none'; bb.textContent = miss > 0 ? '🪙 ' + price + ' · manque ' + miss : '🪙 ' + price + ' · Acheter'; bb.disabled = miss > 0;
  ov.querySelector('[data-a=re]').style.display = cat == 'av' ? 'none' : '';
  ov.style.display = 'flex'; addEventListener('keydown', pkey, true); cancelAnimationFrame(praf); praf = requestAnimationFrame(pframe);
}

/* ================= style des cartes boutique ================= */
(() => {
  const st = document.createElement('style');
  st.textContent = '.xcard button.xtryb{background:transparent;border:1px solid var(--ln);color:var(--tx)}' +
    '.xv{--rc:#9aa3b8;position:relative;display:inline-flex;align-items:center;justify-content:center;width:54px;height:54px;border-radius:50%;background:radial-gradient(circle at 50% 30%,#2c3658,#0d111f);border:3px solid var(--rc);font-size:28px;line-height:1;box-sizing:border-box}' +
    '.xv.big{width:88px;height:88px;font-size:46px;border-width:4px}.xv.r1{--rc:#4cc9f0}.xv.r2{--rc:#b36bff;box-shadow:0 0 14px #b36bff99}' +
    '.xv.r3{--rc:#ffd23f;box-shadow:0 0 18px #ffd23fb0;animation:xvg 2s ease-in-out infinite}.xv.r4{border-color:transparent;animation:xvg 2s ease-in-out infinite}' +
    '.xv.r4::after{content:"";position:absolute;inset:-3px;border-radius:50%;background:conic-gradient(#f33,#fc3,#3f6,#39f,#a5f,#f33);-webkit-mask:radial-gradient(farthest-side,transparent calc(100% - 4px),#000 calc(100% - 3px));mask:radial-gradient(farthest-side,transparent calc(100% - 4px),#000 calc(100% - 3px));animation:xvs 3s linear infinite}' +
    '@keyframes xvg{50%{filter:brightness(1.35)}}@keyframes xvs{to{transform:rotate(1turn)}}' +
    '.xrar{font-size:11px;font-weight:800;letter-spacing:.04em}' +
    '.xe-shake{animation:xes .5s infinite}.xe-pulse{animation:xep .8s infinite}.xe-beat{animation:xep .6s infinite}.xe-spin{animation:xer 1.6s linear infinite}.xe-wave{animation:xew .7s infinite;transform-origin:50% 90%}.xe-look{animation:xel 1.2s infinite}.xe-float{animation:xef 1.6s ease-in-out infinite}.xe-tilt,.xe-pop{animation:xep 1.4s infinite}' +
    '.xav{display:inline-block}@keyframes xes{25%{transform:rotate(-12deg)}75%{transform:rotate(12deg)}}@keyframes xep{50%{transform:scale(1.18)}}@keyframes xer{to{transform:rotate(1turn)}}@keyframes xew{50%{transform:rotate(25deg)}0%,100%{transform:rotate(-25deg)}}@keyframes xel{50%{transform:translateX(6px)}0%,100%{transform:translateX(-6px)}}@keyframes xef{50%{transform:translateY(-5px)}}';
  document.head.appendChild(st);
})();

window.MGFX = { TR, RAR, EMD, badge, avDom, emDom, preview,
  trail: (x, y, id, key) => trail(GS, x, y, id, key || 'me'),
  emote: (key, label) => emote(GS, key, label),
  _t: { Stage, stepP, stepEm, dp, drawEm, drawRib, evFinish, evTrail, evBurst, GS } };
})();
