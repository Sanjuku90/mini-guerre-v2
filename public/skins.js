/* Skins de personnage (v14). Chargé avant extras2.js. Tout est dessiné en code : mêmes formes en partie, en boutique et à l'accueil.
   Champs : c corps · d accent · m métal · k peau · e yeux · w ailes · h tête · v torse · b dos · a aura [c1,c2]. Ajouter un skin = une ligne ici. */
(() => {
const PI = Math.PI;
const SP = [
 ['Standard', 0, {}],
 ['Commando', 100, {c:'#4a5a2b', d:'#d62828', h:'band', v:'ammo'}],
 ['Punk', 120, {c:'#1d1d22', d:'#ff2fa0', m:'#c0c6d0', h:'mohawk', v:'spike'}],
 ['Zombie', 150, {c:'#56664a', d:'#8a1c1c', k:'#8fbf7a', e:'#ffe14d', h:'zomb', v:'tear'}],
 ['Pirate', 150, {c:'#7a1f2b', d:'#e0b64a', h:'pirate', v:'ammo'}],
 ['Ninja', 200, {c:'#16161b', d:'#d90429', h:'hood', b:'scarf'}],
 ['Agent spécial', 200, {c:'#1c2430', d:'#2fd0ff', m:'#3a4658', h:'swat', v:'vest'}],
 ['Astronaute', 200, {c:'#e8ecf3', d:'#ff7a1a', m:'#9fb4c8', h:'astro', v:'vest'}],
 ['Viking', 250, {c:'#5a3b24', d:'#2e86c1', m:'#c9ccd1', h:'horn', v:'fur'}],
 ['Samouraï', 300, {c:'#8b1e2d', d:'#e0b64a', m:'#2b2b33', h:'kabuto', v:'plate', b:'katana'}],
 ['Chevalier', 300, {c:'#9aa5b5', d:'#c1121f', m:'#e3e8f0', h:'knight', v:'plate', b:'cape'}],
 ['Spartiate', 300, {c:'#b5483a', d:'#c1121f', m:'#c9953c', h:'sparta', v:'plate', b:'cape'}],
 ['Cyborg', 350, {c:'#4b5563', d:'#ff2a2a', m:'#aab4c0', h:'cyb', v:'core'}],
 ['Chasseur de primes', 400, {c:'#4d5a43', d:'#ff9f1c', m:'#6c7a86', h:'tvisor', v:'vest', b:'cape'}],
 ['Exterminateur', 400, {c:'#2a2f38', d:'#ff1a1a', m:'#c9d1d9', h:'robot', v:'ribs', a:['#ff3b30','#ffb199']}],
 ['Cyberpunk', 450, {c:'#12121f', d:'#00f0ff', m:'#ff2fd0', h:'neon', v:'core', a:['#00f0ff','#ff2fd0']}],
 ['Démon', 500, {c:'#3a0d12', d:'#ffb020', m:'#1a0608', k:'#c1272d', e:'#ffe14d', w:'#7a0f1a', h:'demon', v:'spike', b:'wings', a:['#ff4d00','#ffd23f']}],
 ['Faucheur', 550, {c:'#15101c', d:'#9b5cff', k:'#ece6d6', h:'reaper', v:'ribs', b:'scythe', a:['#7a3cff','#cdb4ff']}],
 ['Phénix', 600, {c:'#c2410c', d:'#ffd23f', m:'#7c1d06', k:'#ffd9a8', w:'#ff7a1a', h:'phoenix', v:'plate', b:'wings', a:['#ff7a1a','#ffe14d']}],
 ['Roi des glaces', 600, {c:'#7cc7e8', d:'#e6fbff', m:'#bdf0ff', k:'#dff6ff', e:'#1e6fa8', h:'ice', v:'plate', b:'cape', a:['#bdf0ff','#ffffff']}],
 ['Dragon', 700, {c:'#2f6b3a', d:'#f2c14e', m:'#1d4727', k:'#4caf50', e:'#ffe14d', w:'#3d8f4a', h:'dragon', v:'spike', b:'wings', a:['#ff7a1a','#ffd23f']}],
 ['Seigneur noir', 800, {c:'#0e0b14', d:'#a855f7', m:'#2a2236', k:'#14101c', e:'#c77dff', h:'dlord', v:'plate', b:'cape', a:['#7a3cff','#3a1a66']}],
 ['Roi doré', 1000, {c:'#d4a017', d:'#c1121f', m:'#ffd23f', h:'king', v:'plate', b:'cape', a:['#ffd23f','#fff6c8']}]
];

const R = (c, k, x, y, w, h) => { c.fillStyle = k; c.fillRect(x, y, w, h); };
const O = (c, k, x, y, r, a0, a1) => { c.fillStyle = k; c.beginPath(); c.arc(x, y, r, a0 || 0, a1 == null ? 7 : a1); c.fill(); };
const Y = (c, k, ...p) => { c.fillStyle = k; c.beginPath(); c.moveTo(p[0], p[1]); for (let i = 2; i < p.length; i += 2) c.lineTo(p[i], p[i + 1]); c.closePath(); c.fill(); };
const L = (c, k, w, x1, y1, x2, y2) => { c.strokeStyle = k; c.lineWidth = w; c.lineCap = 'round'; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke(); };

/* ---------- aura (particules qui montent) ---------- */
function aura(c, s, t) {
  if (!s.a) return; const ga = c.globalAlpha, gc = c.globalCompositeOperation;
  c.globalCompositeOperation = 'lighter';
  const h = c.createRadialGradient(0, 22, 2, 0, 22, 30); h.addColorStop(0, s.a[0]); h.addColorStop(1, 'rgba(0,0,0,0)');
  c.globalAlpha = ga * (.2 + .08 * Math.sin(t * 4)); c.fillStyle = h; c.beginPath(); c.arc(0, 22, 30, 0, 7); c.fill(); // halo
  for (let i = 0; i < 20; i++) { const p = (t * (.7 + (i % 3) * .25) + i * .17) % 1; c.globalAlpha = ga * (1 - p) * .9; const x = Math.sin(i * 4.1 + t * 2.4) * (8 + p * 8), y = 40 - p * 58, r = 2.8 * (1 - p) + .5;
    O(c, s.a[i & 1], x, y, r); if (i % 5 == 0) { c.fillStyle = '#fff'; c.fillRect(x - r * 1.6, y - .3, r * 3.2, .6); c.fillRect(x - .3, y - r * 1.6, .6, r * 3.2); } } // braises + étincelles
  c.globalAlpha = ga; c.globalCompositeOperation = gc;
}
function shine(c, s, t) { // reflet métallique qui balaie le torse toutes les ~2,5 s
  if (!(s.m || s.a)) return; const p = (t % 2.5) / 1.1; if (p > 1) return;
  c.save(); c.beginPath(); c.rect(-9, 9, 18, 19); c.clip(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = .55 * Math.sin(p * Math.PI);
  const x = -16 + p * 32; Y(c, '#fff', x, 8, x + 5, 8, x - 3, 29, x - 8, 29); c.restore();
}

/* ---------- dos : cape, ailes, katana, faux, écharpe (dessiné AVANT le corps) ---------- */
function back(c, s, f, t, mv, post) {
  const b = s.b; if (!b || (b == 'cape') != !!post) return; const l = -f, sw = Math.sin(t * (mv ? 9 : 3)) * (mv ? 3 : 1.5);
  if (b == 'cape') {
    Y(c, s.d, l * 8, 10, l * 13, 11, l * (23 + sw), 36, l * (17 + sw), 41, l * (11 + sw * .5), 36, l * 8.5, 30);
    Y(c, 'rgba(0,0,0,.3)', l * 8, 10, l * 10.5, 10.5, l * (15 + sw), 37, l * (11 + sw * .5), 36, l * 8.5, 30);
  } else if (b == 'wings') {
    const fl = sw * 1.7;
    for (const k of [.7, 1]) {
      const P = (u, v) => [-f * (5 + u * k), 12 + v * k + (k < 1 ? -4 : 0)];
      const q = [[0, 0], [12, -16 + fl], [31, -14 + fl * 1.4], [27, -3 + fl], [23, 5], [18, 0], [15, 11], [10, 6], [6, 13], [0, 9]].map(a => P(a[0], a[1]));
      c.fillStyle = k < 1 ? 'rgba(0,0,0,.4)' : (s.w || s.d); c.beginPath(); q.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fill();
      c.strokeStyle = s.m || '#222'; c.lineWidth = 1.5; c.lineCap = 'round'; c.beginPath();
      const A = P(0, 0), B = P(12, -16 + fl), T = P(31, -14 + fl * 1.4); c.moveTo(...A); c.lineTo(...B); c.lineTo(...T);
      for (const a of [[23, 5], [15, 11]]) { c.moveTo(...B); c.lineTo(...P(a[0], a[1])); } c.stroke();
    }
  } else if (b == 'katana') {
    L(c, '#d7dde6', 2, l * 9, 33, f * 4, -1); L(c, '#241a1a', 3.2, f * 4, -1, f * 6.5, -7); R(c, s.d, f * 3 - 1.5, -2.5, 4, 1.6);
  } else if (b == 'scythe') {
    L(c, '#6b4a2a', 2.2, l * 10, 38, l * 4, -14);
    Y(c, '#d7dde6', l * 4, -14, f * 7, -19, f * 14, -10, f * 8, -13, f * 0, -10); Y(c, s.d, l * 3, -13, f * 6, -17, f * 9, -13, f * 2, -11);
  } else if (b == 'scarf') {
    const w1 = Math.sin(t * 8) * 2, w2 = Math.sin(t * 8 + 1.5) * 3, w3 = Math.sin(t * 8 + 3) * 3.5;
    Y(c, s.d, l * 7, 9, l * 13, 8 + w1, l * 21, 11 + w2, l * 28, 9 + w3, l * 22, 15 + w2, l * 13, 13 + w1, l * 7, 13);
  }
}

/* ---------- torse (détails, dessinés APRÈS le corps ; zone du bras 14-19 laissée libre) ---------- */
function torso(c, s, f, t) { torso0(c, s, f, t); shine(c, s, t); }
function torso0(c, s, f, t) {
  const v = s.v, d = s.d, m = s.m || '#9aa5b5'; if (!v) return;
  if (v == 'ammo') { L(c, '#4a3512', 3.4, -8, 10, 8, 27); for (let i = 0; i < 5; i++) O(c, '#e0b64a', -6.5 + i * 3.4, 12 + i * 3.7, 1.3); R(c, '#2a1a0e', -9, 24, 18, 3); }
  else if (v == 'vest') { R(c, '#10151c', -9, 9, 4.5, 19); R(c, '#10151c', 4.5, 9, 4.5, 19); R(c, '#10151c', -9, 24, 18, 3); R(c, m, -8.5, 20.5, 5, 3.6); R(c, m, 3.5, 20.5, 5, 3.6); R(c, d, -2.5, 10, 5, 1.6); }
  else if (v == 'plate') { R(c, m, -9, 9, 18, 4.5); R(c, 'rgba(255,255,255,.4)', -9, 9, 18, 1.3); O(c, m, -9.5, 10.5, 4.6); O(c, m, 9.5, 10.5, 4.6); O(c, 'rgba(255,255,255,.3)', -10.5, 9.4, 1.8); O(c, 'rgba(255,255,255,.3)', 8.5, 9.4, 1.8); R(c, d, -9, 13.2, 18, 1.5); R(c, d, -9, 22.5, 18, 3.5); O(c, m, 0, 24.2, 2.1); }
  else if (v == 'fur') { R(c, '#efe7d6', -10, 8.5, 20, 4); for (let i = 0; i < 5; i++) Y(c, '#efe7d6', -10 + i * 4.5, 12, -7.75 + i * 4.5, 16, -5.5 + i * 4.5, 12); R(c, '#2a1a0e', -9, 23, 18, 3); R(c, d, -2, 23, 4, 3); }
  else if (v == 'spike') { for (const q of [-1, 1]) { Y(c, m, q * 6, 10.5, q * 13.5, 1, q * 10.5, 11); Y(c, m, q * 8, 11, q * 15, 6, q * 11, 14); } for (let i = 0; i < 5; i++) O(c, m, -7 + i * 3.5, 24.5, 1); }
  else if (v == 'core') { const ga = c.globalAlpha; c.globalAlpha = ga * .3; O(c, d, 0, 22, 6.5 + Math.sin(t * 5)); c.globalAlpha = ga; O(c, '#10151c', 0, 22, 4); O(c, d, 0, 22, 2.6); R(c, m, -9, 9, 18, 2.2); R(c, '#10151c', -9, 26, 18, 1.6); }
  else if (v == 'ribs') { R(c, '#ece6d6', -.8, 9.5, 1.6, 17); for (let i = 0; i < 3; i++) R(c, '#ece6d6', -6, 21 + i * 2.2, 12, 1.1); R(c, d, -9, 9, 18, 1.3); }
  else if (v == 'tear') { Y(c, '#7a1c1c', -4, 21, 0, 19, 3, 23, -1, 26); for (let i = 0; i < 4; i++) Y(c, s.c, -9 + i * 4.5, 26, -6.75 + i * 4.5, 31, -4.5 + i * 4.5, 26); R(c, '#2a1a14', -9, 9, 5, 2); }
}

/* ---------- tête : visage + couvre-chef (dessiné par-dessus la tête d'origine) ---------- */
function head(c, s, f, t) {
  const k = s.k || '#f1c27d', d = s.d, m = s.m || '#9aa5b5', h = s.h, col = s.c, sw = Math.sin(t * 5) * 2;
  O(c, k, 0, 5, 7); O(c, k, 0, 4, 8.1, PI, 0);
  const eye = () => { R(c, s.e || '#111', f * 3, 3, 3, 2); if (s.e) { const gc = c.globalCompositeOperation, ga = c.globalAlpha; c.globalCompositeOperation = 'lighter'; c.globalAlpha = ga * (.5 + .25 * Math.sin(t * 6)); O(c, s.e, f * 4.5, 4, 5); c.globalAlpha = ga; c.globalCompositeOperation = gc; } };
  if (h == 'band') { eye(); O(c, '#1b1b1b', 0, 4, 8.2, PI, 0); R(c, d, -8, 0, 16, 3); Y(c, d, -f * 7, 1, -f * 16, -1 + sw, -f * 14, 3 + sw); Y(c, d, -f * 7, 2, -f * 15, 5 - sw, -f * 13, 7); }
  else if (h == 'mohawk') { eye(); O(c, '#26262c', 0, 4, 8.2, PI, 0); for (const i of [-5, -2, 1, 4]) Y(c, d, i - 1.6, 1, i + .5, -11 - (i & 1) * 3, i + 2.4, 1); O(c, m, -f * 7, 7, 1.3); O(c, m, -f * 7, 10, 1.3); }
  else if (h == 'zomb') { eye(); O(c, '#2b2418', 0, 4, 8.2, PI, 0); Y(c, '#2b2418', -6, 0, -4, -5, -1, 0); Y(c, '#2b2418', 1, 0, 4, -4, 7, 1); R(c, '#7a1c1c', f * 1, 0, 4, 3); R(c, '#222', f * 1, 0, 4, .8); R(c, '#2a0e0e', -2, 9.5, 5, 2); }
  else if (h == 'pirate') { eye(); Y(c, '#1a1a1d', -12, 1.5, 0, -11, 12, 1.5, 0, -3); R(c, d, -11, -.4, 22, 1.5); O(c, '#fff', 0, -5, 1.6); R(c, '#111', f * 1, 2, 5, 4); R(c, '#111', -7, 1.2, 14, 1); }
  else if (h == 'hood') { O(c, col, 0, 5, 8.3); R(c, k, -6, 2, 12, 4); R(c, '#fff', f * 2, 3, 3.4, 2); R(c, d, f * 3.4, 3.3, 1.6, 1.4); R(c, d, -8.3, 0, 16.6, 2.2); Y(c, d, -f * 8, 0.5, -f * 18, -3 + sw, -f * 16, 2 + sw); Y(c, d, -f * 8, 1.5, -f * 17, 5 - sw, -f * 14, 4); }
  else if (h == 'swat') { eye(); O(c, m, 0, 4, 8.7, PI, 0); R(c, '#222', -1, -5, 2, 2); R(c, '#0b1620', -7, 2, 14, 4.2); R(c, d, -6, 3.2, 12, 1.6); R(c, '#111', -7, 7, 14, 5); R(c, '#2b3340', -7, 8.5, 14, 1); }
  else if (h == 'astro') { eye(); R(c, m, -9, 12.5, 18, 3); O(c, 'rgba(160,225,255,.28)', 0, 5, 10); c.strokeStyle = '#fff'; c.lineWidth = 2; c.beginPath(); c.arc(0, 5, 10, 0, 7); c.stroke(); c.strokeStyle = 'rgba(255,255,255,.85)'; c.lineWidth = 1.4; c.beginPath(); c.arc(0, 5, 7.2, PI * 1.1, PI * 1.5); c.stroke(); O(c, d, -f * 9, 13.5, 1.6); }
  else if (h == 'horn') { eye(); O(c, m, 0, 4, 8, PI, 0); R(c, '#7b8089', -.8, -3, 1.6, 7); R(c, d, -8, 0, 16, 1.6); for (const q of [-1, 1]) Y(c, '#f2e8cf', q * 6, 1, q * 14.5, -2, q * 15.5, -12, q * 11, -5.5, q * 7, -3); Y(c, '#c2793a', -6, 9, 6, 9, 4, 17, 0, 15, -4, 17); }
  else if (h == 'kabuto') { O(c, m, 0, 4, 8.4, PI, 0); R(c, col, -10.5, 3, 21, 3); R(c, d, -8.4, 0.5, 16.8, 1.5); for (const q of [-1, 1]) Y(c, d, q * 1.5, -3, q * 10.5, -15, q * 4.5, -6); R(c, '#2b2b33', -6.5, 6.5, 13, 6); R(c, '#d90429', -3.5, 9, 7, 1.1); R(c, '#fff', f * 3, 3.2, 3, 2); }
  else if (h == 'knight') { O(c, m, 0, 4, 8.5, PI, 0); R(c, m, -8.5, 4, 17, 8.5); R(c, '#0b0e14', -7.5, 4.8, 15, 2.4); for (let i = 0; i < 3; i++) R(c, '#5b6472', f * 2 + i * 2 - 2, 9, 1, 2.6); R(c, 'rgba(255,255,255,.45)', -6, -1, 5, 1.3); Y(c, d, -2, -3, -f * 6 + sw, -14, -f * 15 + sw, -10, -f * 12 + sw, -3, 2, -2); }
  else if (h == 'sparta') { O(c, m, 0, 4, 8.6, PI, 0); R(c, m, -8.6, 4, 3, 8.5); R(c, m, 5.6, 4, 3, 8.5); R(c, '#0b0e14', -5, 3.5, 10, 2.2); R(c, '#0b0e14', -1, 3.5, 2, 7.5); Y(c, d, -9, 0, -7, -9, -2, -13.5, 3, -13.5, 8, -9, 9, 0); R(c, '#e24a3b', -4, -11.5, 8, 1.2); }
  else if (h == 'cyb') { O(c, m, 0, 4, 8.5, PI, 0); R(c, m, -8.5, 4, 17, 3); R(c, '#0a0a0a', -7, 2.4, 14, 4); R(c, d, Math.sin(t * 3) * 4 - 1.4, 3.2, 3.4, 2.2); R(c, m, f * 5, -10, 1.6, 6); O(c, d, f * 5.8, -10, 1.7); R(c, '#2b323c', -4, 9.5, 8, 2.5); }
  else if (h == 'tvisor') { O(c, m, 0, 5, 8.6); R(c, 'rgba(255,255,255,.25)', -6, -1, 5, 1.3); R(c, '#0a0a0a', -6.5, 3, 13, 3.2); R(c, '#0a0a0a', -1.6, 3, 3.2, 9); R(c, d, f * 1, 3.7, 5, 1.6); R(c, s.c, -8.6, 8, 17, 1.4); }
  else if (h == 'robot') { O(c, m, 0, 5, 7.8); R(c, '#59626e', -7, 1, 14, 2); const ga = c.globalAlpha; c.globalAlpha = ga * .35; O(c, d, -3, 4.5, 4.6); O(c, d, 3, 4.5, 4.6); c.globalAlpha = ga; O(c, d, -3, 4.5, 2.2); O(c, d, 3, 4.5, 2.2); R(c, '#59626e', -4.5, 9, 9, 3.2); for (let i = 0; i < 4; i++) R(c, '#2a2f38', -3.4 + i * 2.3, 9, .8, 3.2); }
  else if (h == 'neon') { O(c, '#12121f', 0, 4, 8.3, PI, 0); for (const i of [-4, 0, 4]) Y(c, i ? m : d, i - 2.2, 1, i + .5, -8 - (i ? 0 : 3), i + 2.2, 1); R(c, '#07070f', -8, 2, 16, 4.4); R(c, d, -8, 3.5, 16, 1.3); O(c, d, -f * 7.5, 8, 1.6); R(c, m, -8.3, 0, 16.6, 1.3); }
  else if (h == 'demon') { eye(); for (const q of [-1, 1]) { Y(c, '#1a0608', q * 4.5, 0, q * 14, -5, q * 12.5, -15, q * 8.5, -6); Y(c, d, q * 12.5, -15, q * 11.7, -11.5, q * 13.5, -9.6); } R(c, '#7a0f1a', -6.5, .8, 13, 2); R(c, '#fff', -2.4, 10, 1.5, 2.2); R(c, '#fff', .9, 10, 1.5, 2.2); R(c, '#4a0a10', -3.5, 9.5, 7, 1.2); }
  else if (h == 'reaper') { O(c, col, 0, 3, 10.5, PI, 0); R(c, col, -10.5, 3, 21, 10); Y(c, col, -f * 8, 0, -f * 16, 10 + sw * .5, -f * 6, 13); O(c, k, 0, 6.5, 6.2); O(c, '#000', -2.6, 5.6, 1.9); O(c, '#000', 2.6, 5.6, 1.9); O(c, d, -2.6, 5.6, .8); O(c, d, 2.6, 5.6, .8); Y(c, '#000', 0, 8, -1, 10, 1, 10); R(c, '#222', -3, 11, 6, 1.3); R(c, '#222', -.4, 10.5, .8, 2); }
  else if (h == 'phoenix') { eye(); O(c, '#c2410c', 0, 4, 8, PI, 0); for (let i = 0; i < 5; i++) { const x = -6 + i * 3; Y(c, i % 2 ? '#ffd23f' : '#ff7a1a', x - 2.6, 1.5, x + Math.sin(t * 9 + i) * 1.5, -10 - (i % 3) * 2.5 - Math.sin(t * 11 + i * 2) * 2, x + 2.6, 1.5); } }
  else if (h == 'ice') { eye(); O(c, '#eaf8ff', 0, 4, 8.1, PI, 0); R(c, m, -7.5, -.5, 15, 3.2); for (let i = -2; i <= 2; i++) Y(c, i & 1 ? d : m, i * 3.2 - 2.2, -.5, i * 3.2, -1 - [7, 10, 13, 10, 7][i + 2], i * 3.2 + 2.2, -.5); Y(c, 'rgba(255,255,255,.6)', 0, -1, 0, -13, 1.2, -1); O(c, '#bdf0ff', 0, 1.2, 1.3); }
  else if (h == 'dragon') { eye(); R(c, '#111', f * 4.3, 3, 1, 2.4); for (let i = 0; i < 4; i++) Y(c, d, -5.2 + i * 3.4, 1, -3.5 + i * 3.4, -5 - (i & 1) * 2.5, -1.8 + i * 3.4, 1); for (const q of [-1, 1]) Y(c, '#f2d9a0', q * 4, 0, q * 9, -12, q * 12.5, -13, q * 10.5, -5); O(c, m, f * 5.5, 8, .9); R(c, '#2a6b33', -6, 9.5, 12, 1); }
  else if (h == 'dlord') { O(c, '#14101c', 0, 5, 7); const ga = c.globalAlpha; c.globalAlpha = ga * .4; O(c, s.e, -3, 4.2, 3.6); O(c, s.e, 3, 4.2, 3.6); c.globalAlpha = ga; O(c, s.e, -3, 4.2, 1.7); O(c, s.e, 3, 4.2, 1.7); R(c, m, -7.5, -1, 15, 3.4); for (const i of [-6, -3, 0, 3, 6]) Y(c, m, i - 1.7, -1, i, -9 - (i ? 0 : 5), i + 1.7, -1); O(c, d, 0, 1, 1.4); }
  else if (h == 'king') { eye(); R(c, m, -7.5, -2, 15, 4); for (const i of [-6, -2, 2, 6]) { Y(c, m, i - 2.4, -2, i, -10 - (i == -2 || i == 2 ? 2 : 0), i + 2.4, -2); O(c, '#fff', i, -10.5 - (i == -2 || i == 2 ? 2 : 0), 1); O(c, d, i, 0, 1.2); } Y(c, '#8a5a1c', -6, 9, 6, 9, 3, 16, 0, 14.5, -3, 16); }
  else eye();
}

/* ---------- API ---------- */
const bodyOf = (c, s, f, t, thumb, mv) => {
  if (thumb) { const sw = mv ? Math.sin(t * 14) * 5 : 0; // personnage de base (en partie c'est le jeu qui le dessine)
    const k = s.k || '#f1c27d'; R(c, '#4a4f66', -f * 13 - 4, 10, 8, 20); R(c, '#26304a', -6 + sw, 26, 6, 12); R(c, '#26304a', 1 - sw, 26, 6, 12);
    R(c, s.c || '#5f7a40', -9, 9, 18, 19); R(c, 'rgba(0,0,0,.25)', -9, 22, 18, 4); R(c, '#f1c27d', 0, 14, 12, 5); R(c, '#2b2f3a', 4, 13.5, 18, 4); R(c, '#2b2f3a', 2, 16, 5, 7);
  }
};
function drawFull(c, s, t, f, mv) { // personnage complet (boutique / accueil)
  f = f || 1; mv = mv || 0; aura(c, s, t); back(c, s, f, t, mv); bodyOf(c, s, f, t, 1, mv); back(c, s, f, t, mv, 1); torso(c, s, f, t); head(c, s, f, t);
}
const cache = {};
function thumb(i, W, H) {
  const key = i + '_' + W + '_' + H; if (cache[key]) return cache[key];
  const s = SP[i] ? SP[i][2] : {}, cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const c = cv.getContext('2d'), sc = Math.min(W / 64, H / 58); c.translate(W / 2 + 7 * sc, (H - 58 * sc) / 2 + 15 * sc); c.scale(sc, sc);
  if (!i) { s.c = '#5f7a40'; } drawFull(c, s, .4);
  return cache[key] = cv.toDataURL();
}
const MG = window.MGSK = { list: SP, thumb, drawFull, cur: () => 0, of: () => 0, preview };

/* ---------- boutique : essai en direct (aperçu animé). Rien n'est équipé : le skin n'est utilisable qu'après achat ---------- */
let ov, pc, pst = { i: 0, run: 0, flip: 1 }, praf = 0;
function pclose() { if (ov) ov.style.display = 'none'; cancelAnimationFrame(praf); praf = 0; removeEventListener('keydown', pkey, true); }
function pkey(e) { if (e.key == 'Escape') { e.stopImmediatePropagation(); e.preventDefault(); pclose(); } }
function pframe() {
  if (!praf) return;
  const c = pc.getContext('2d'), W = pc.width, H = pc.height, t = performance.now() / 1000, sc = W / 70;
  c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, W, H);
  const gr = c.createRadialGradient(W / 2, H * .55, 10, W / 2, H * .55, W * .8); gr.addColorStop(0, '#3a4468'); gr.addColorStop(1, '#161b2e'); c.fillStyle = gr; c.fillRect(0, 0, W, H);
  c.translate(W / 2, H * .2); c.scale(pst.flip * sc, sc); c.translate(7, 0);
  c.fillStyle = '#0d1120'; c.fillRect(-60, 38, 120, 40);
  for (let k = 0; k < 8; k++) { const x = (((k * 16 - (pst.run ? t * 70 : 0)) % 128) + 128) % 128 - 64; c.fillStyle = 'rgba(255,255,255,.14)'; c.fillRect(x, 43, 8, 1.2); }
  c.fillStyle = 'rgba(0,0,0,.35)'; c.beginPath(); c.ellipse(0, 39, 17, 3, 0, 0, 7); c.fill();
  drawFull(c, SP[pst.i][2], t, 1, pst.run); praf = requestAnimationFrame(pframe);
}
function preview(i, buy, missing) {
  if (!ov) {
    const st = document.createElement('style');
    st.textContent = '.xcard button.xtryb{background:transparent;border:1px solid var(--ln);color:var(--tx)}' +
      '#xpw{position:fixed;inset:0;z-index:99999;display:none;align-items:center;justify-content:center;background:rgba(5,8,16,.82)}' +
      '#xpw .xpb{width:min(92vw,340px);max-height:96vh;display:grid;gap:10px;padding:12px;border-radius:16px;background:#151a2b;border:1px solid rgba(255,255,255,.18);color:#fff;font:700 14px system-ui,sans-serif;text-align:center}' +
      '#xpw canvas{width:auto;height:auto;max-width:100%;max-height:52vh;margin:auto;border-radius:12px}#xpw .r{display:flex;gap:8px}' +
      '#xpw button{flex:1;padding:11px 6px;border:0;border-radius:10px;font:800 13px system-ui,sans-serif;background:#2a3350;color:#fff}' +
      '#xpw button[data-a=buy]{background:linear-gradient(180deg,#ffc247,#ff9a1f);color:#111}#xpw button:disabled{opacity:.55}';
    document.head.appendChild(st); ov = document.createElement('div'); ov.id = 'xpw';
    ov.innerHTML = '<div class="xpb"><div class="t"></div><canvas width="560" height="640"></canvas><div class="r"><button data-a="run">🏃 Courir</button><button data-a="flip">↔ Tourner</button></div><div class="r"><button data-a="buy"></button><button data-a="close">Fermer</button></div></div>';
    document.body.appendChild(ov); pc = ov.querySelector('canvas');
    ov.onclick = e => { const a = e.target.dataset && e.target.dataset.a;
      if (e.target === ov || a == 'close') pclose();
      else if (a == 'run') { pst.run ^= 1; e.target.textContent = pst.run ? '🧍 Immobile' : '🏃 Courir'; }
      else if (a == 'flip') pst.flip *= -1; };
  }
  pst = { i, run: 0, flip: 1 }; ov.querySelector('.t').textContent = 'Essai : ' + SP[i][0] + ' (aperçu, non équipé)';
  ov.querySelector('[data-a=run]').textContent = '🏃 Courir';
  const bb = ov.querySelector('[data-a=buy]'); bb.textContent = missing > 0 ? '🪙 ' + SP[i][1] + ' · manque ' + missing : '🪙 ' + SP[i][1] + ' · Acheter'; bb.disabled = missing > 0;
  bb.onclick = () => { pclose(); buy(); };
  ov.style.display = 'flex'; addEventListener('keydown', pkey, true); cancelAnimationFrame(praf); praf = requestAnimationFrame(pframe);
}

/* ---------- en partie : habille le personnage (moi + joueurs en ligne) ---------- */
const hook = (n, f) => { const o = window[n]; window[n] = function (...a) { return f.call(this, o, ...a); }; };
hook('ent', function (o, e, m) {
  const i = m ? MG.cur() : MG.of(e.pid), s = i > 0 && SP[i] && SP[i][2];
  if (!s || !e.al) return o(e, m);
  const f = e.f, t = time, ga = g.globalAlpha, fl = e.inv > 0 && ((t * 10) | 0) % 2;
  g.save(); g.translate(e.x + 10, e.y); if (fl) g.globalAlpha = .5; aura(g, s, t); back(g, s, f, t, e.mv); g.restore();
  const c0 = e.c; if (!e.team) e.c = s.c; // en équipe, le corps garde la couleur de l'équipe
  try { o(e, m); } finally { e.c = c0; }
  g.save(); g.translate(e.x + 10, e.y); if (fl) g.globalAlpha = .5; back(g, s, f, t, e.mv, 1); torso(g, s, f, t); head(g, s, f, t); g.restore(); g.globalAlpha = ga;
});
})();
