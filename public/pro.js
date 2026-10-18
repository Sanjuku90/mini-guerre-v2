/* Rendu « pro » v18 — couche graphique globale, chargée en dernier (aucune logique de jeu modifiée).
   • Personnages : ombre portée au sol (qui s'étire et pâlit quand ils sautent)
   • Tirs : lueur additive autour des balles, lumière de bouche (muzzle light), fumée de canon, braises incandescentes
   • Explosions : boule de feu, onde de choc, fumée épaisse
   • Plateformes : arête éclairée, contour, ombre portée sous les plateformes fines
   • HUD : panneaux « verre » dégradés, barres brillantes, minimap décalée (plus de chevauchement)
   • Étalonnage : lumière chaude en haut / froide en bas (soft-light) pour une image plus cohérente
   • Interface : transitions, focus, ascenseurs, lissage des polices
   Pour désactiver : retirer la balise <script src="pro.js"> de index.html. */
(() => {
const hook = (n, f) => { const o = window[n]; if (typeof o != 'function') return; window[n] = function (...a) { return f.call(this, o, ...a); }; };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v)), rnd = (a, b) => a + Math.random() * (b - a);

/* ---------- interface (CSS) ---------- */
const st = document.createElement('style');
st.textContent = 'html,body{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-rendering:optimizeLegibility}' +
  'button{transition:transform .12s,filter .15s,box-shadow .15s}button:active{transform:scale(.97)}@media (hover:hover){button:hover{filter:brightness(1.1)}}' +
  'button:focus-visible,input:focus-visible,select:focus-visible{outline:2px solid #ffb020;outline-offset:2px}' +
  '*{scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.25) transparent}::-webkit-scrollbar{width:8px;height:8px}::-webkit-scrollbar-thumb{background:rgba(255,255,255,.22);border-radius:8px}' +
  '#xtb{left:170px!important;top:152px!important}' +
  '#m2>div{border-radius:18px;box-shadow:0 24px 70px rgba(0,0,0,.6),inset 0 0 0 1px rgba(255,255,255,.06)}' +
  'input,select{transition:border-color .15s,box-shadow .15s}input:focus,select:focus{border-color:#ffb020;box-shadow:0 0 0 3px rgba(255,176,32,.18);outline:none}';
document.head.appendChild(st);

/* ---------- HUD en verre ---------- */
const gl = () => g; // `g` (contexte du canvas) est une const globale du jeu : accessible par son nom
window.panel = function (x, y, w, h, r) {
  const g = gl(); r = r || 10; rr(x, y + 2, w, h, r); g.fillStyle = 'rgba(0,0,0,.22)'; g.fill(); // ombre
  rr(x, y, w, h, r); const d = g.createLinearGradient(0, y, 0, y + h); d.addColorStop(0, 'rgba(24,34,66,.78)'); d.addColorStop(1, 'rgba(8,12,28,.7)'); g.fillStyle = d; g.fill();
  g.strokeStyle = 'rgba(255,255,255,.14)'; g.lineWidth = 1; g.stroke();
  g.save(); rr(x, y, w, h, r); g.clip(); g.fillStyle = 'rgba(255,255,255,.07)'; g.fillRect(x, y, w, Math.min(h * .45, 14)); g.restore(); // reflet du haut
};
window.bar2 = function (x, y, w, h, v, c1, c2, txt) {
  const g = gl(); rr(x, y, w, h, h / 2); g.fillStyle = 'rgba(0,0,0,.4)'; g.fill(); g.strokeStyle = 'rgba(255,255,255,.1)'; g.lineWidth = 1; g.stroke(); v = clamp(v, 0, 1);
  if (v > .01) { const bw = Math.max(h, w * v), gd = g.createLinearGradient(x, 0, x + w, 0); gd.addColorStop(0, c1); gd.addColorStop(1, c2); rr(x, y, bw, h, h / 2); g.fillStyle = gd; g.fill();
    g.save(); rr(x, y, bw, h, h / 2); g.clip(); const gs = g.createLinearGradient(0, y, 0, y + h); gs.addColorStop(0, 'rgba(255,255,255,.4)'); gs.addColorStop(.5, 'rgba(255,255,255,0)'); gs.addColorStop(1, 'rgba(0,0,0,.18)'); g.fillStyle = gs; g.fillRect(x, y, bw, h); g.restore(); }
  if (txt != null) { g.font = '800 10px system-ui,sans-serif'; g.textAlign = 'left'; g.fillStyle = 'rgba(0,0,0,.5)'; g.fillText(txt, x + 9, y + h - 2); g.fillStyle = '#fff'; g.fillText(txt, x + 8, y + h - 3); }
};

/* ---------- plateformes ---------- */
hook('platAt', function (o, c, r, ti) {
  o(c, r, ti); const x = r.x, y = r.y, w = r.w, h = r.h; c.save();
  if (h <= 90 && w > 20) { const s = c.createLinearGradient(0, y + h, 0, y + h + 18); s.addColorStop(0, 'rgba(0,0,0,.26)'); s.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = s; c.fillRect(x + 2, y + h, w - 4, 18); } // ombre sous la plateforme
  c.fillStyle = 'rgba(255,255,255,.2)'; c.fillRect(x, y, w, 1.4);
  if (h > 14) { const s = c.createLinearGradient(0, y + h - 16, 0, y + h); s.addColorStop(0, 'rgba(0,0,0,0)'); s.addColorStop(1, 'rgba(0,0,0,.22)'); c.fillStyle = s; c.fillRect(x, y + h - 16, w, 16); }
  c.strokeStyle = 'rgba(0,0,0,.3)'; c.lineWidth = 1; c.strokeRect(x + .5, y + .5, w - 1, h - 1); c.restore();
});

/* ---------- personnages : ombre au sol ---------- */
hook('ent', function (o, e, m) {
  if (e.al) try {
    const g = gl(), cx = e.x + 10, fy = e.y + 38; let gy = 1e9;
    for (const s of SO) if (s.y >= fy - 6 && cx > s.x && cx < s.x + s.w && s.y < gy) gy = s.y;
    const dist = gy - fy;
    if (gy < 1e9 && dist < 380) { const k = clamp(1 - dist / 380, 0, 1); g.save(); g.fillStyle = 'rgba(0,0,0,' + (.34 * k) + ')'; g.beginPath(); g.ellipse(cx, gy - .5, 13 * (1 + (1 - k) * .5), 3.4, 0, 0, 7); g.fill(); g.restore(); }
  } catch (x) {}
  return o(e, m);
});

/* ---------- effets : fumée, lumières, ondes de choc ---------- */
const FX = []; let last = performance.now();
const MZ_ = () => window.MZ || [];
hook('fire', function (o, id, x, y, a, wi, mine, q) {
  const r = o(id, x, y, a, wi, mine, q);
  try {
    const d = (MZ_()[wi] || 30), gx = x + Math.cos(a) * d, gy = y + Math.sin(a) * d, big = wi == 3 || wi == 13 || wi == 7 || wi == 2 || wi == 12, fast = [4, 6, 9, 11].includes(wi);
    if (wi != 9 && wi != 8) { if (Math.random() < (fast ? .22 : .7)) FX.push({ k: 's', x: gx, y: gy, vx: Math.cos(a) * rnd(15, 55) + rnd(-12, 12), vy: -rnd(14, 44), l: .8, l0: .8, r: big ? 5 : 3.2 }); }
    FX.push({ k: 'f', x: gx, y: gy, l: .075, l0: .075, r: (big ? 120 : 72) * (fast ? .8 : 1), c: wi == 8 ? '120,220,255' : wi == 13 ? '150,235,255' : wi == 9 ? '255,140,40' : '255,190,90' });
  } catch (e) {}
  return r;
});
hook('boom', function (o, x, y, ow) {
  const r = o(x, y, ow);
  try {
    FX.push({ k: 'f', x, y, l: .22, l0: .22, r: 260, c: '255,170,70' }, { k: 'r', x, y, l: .5, l0: .5, r: 150 }, { k: 'r', x, y, l: .35, l0: .35, r: 95 });
    for (let i = 0; i < 12; i++) { const a = rnd(0, 6.28), v = rnd(20, 150); FX.push({ k: 's', x: x + Math.cos(a) * 10, y: y + Math.sin(a) * 10, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 25, l: rnd(.9, 1.5), l0: 1.5, r: rnd(11, 24), dk: 1 }); }
  } catch (e) {}
  return r;
});
const HOT = { '#ff8c1a': 1, '#ffd24a': 1, '#ffb020': 1, '#ff4d2e': 1, '#ffd27a': 1, '#ffb347': 1, '#ff6a3a': 1 };
hook('fxDraw', function (o) {
  o(); const g = gl(), now = performance.now(), dt = Math.min(.05, (now - last) / 1000); last = now;
  try {
    g.save();
    for (let i = FX.length - 1; i >= 0; i--) { const f = FX[i]; f.l -= dt; if (f.l <= 0) { FX.splice(i, 1); continue; } if (f.k == 's') { f.x += f.vx * dt; f.y += f.vy * dt; f.vx *= .97; f.vy -= 8 * dt; } }
    for (const f of FX) { if (f.k != 's') continue; const u = 1 - f.l / f.l0, a = (1 - u) * (f.dk ? .5 : .3), rad = f.r * (1 + u * (f.dk ? 1.2 : 1.8));
      g.globalAlpha = a; g.fillStyle = f.dk ? '#2b2724' : '#8a8d96'; g.beginPath(); g.arc(f.x, f.y, rad, 0, 7); g.fill(); }
    g.globalCompositeOperation = 'lighter';
    for (const f of FX) { const u = f.l / f.l0;
      if (f.k == 'f') { const gd = g.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r); gd.addColorStop(0, 'rgba(' + (f.c || '255,190,90') + ',' + (.55 * u) + ')'); gd.addColorStop(1, 'rgba(' + (f.c || '255,190,90') + ',0)'); g.globalAlpha = 1; g.fillStyle = gd; g.beginPath(); g.arc(f.x, f.y, f.r, 0, 7); g.fill(); }
      else if (f.k == 'r') { g.globalAlpha = u * .7; g.strokeStyle = '#ffd9a0'; g.lineWidth = 2 + 7 * u; g.beginPath(); g.arc(f.x, f.y, f.r * (1 - u * u) + 6, 0, 7); g.stroke(); } }
    for (const b of bl) { const k = BT[b.wi | 0] || [.02, 2.2], R = 5 + k[1] * 3.2, gd = g.createRadialGradient(b.x, b.y, 0, b.x, b.y, R); gd.addColorStop(0, b.c || '#ffd27a'); gd.addColorStop(1, 'rgba(0,0,0,0)'); g.globalAlpha = .45; g.fillStyle = gd; g.beginPath(); g.arc(b.x, b.y, R, 0, 7); g.fill(); }
    let n = 0; for (const p of pt) { if (!HOT[p.c] || p.s < 3 || n > 140) continue; n++; g.globalAlpha = clamp(p.l * 2, 0, .45); g.fillStyle = p.c; g.beginPath(); g.arc(p.x, p.y, p.s * 1.3, 0, 7); g.fill(); }
    g.restore();
  } catch (e) { try { gl().restore(); } catch (x) {} }
});

/* ---------- étalonnage de l'image ---------- */
hook('amb', function (o, c, w, h, ti, tm) {
  o(c, w, h, ti, tm); c.save(); c.globalCompositeOperation = 'soft-light';
  const d = c.createLinearGradient(0, 0, 0, h); d.addColorStop(0, 'rgba(255,214,160,.2)'); d.addColorStop(.55, 'rgba(255,255,255,0)'); d.addColorStop(1, 'rgba(60,100,200,.2)'); c.fillStyle = d; c.fillRect(0, 0, w, h); c.restore();
});
})();
