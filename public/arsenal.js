/* Arsenal (v15) : 6 nouvelles armes + skins d'arme ÉTERNELS (permanents, animés) et EVO (évoluent avec tes kills, niv. 1→5).
   Chargé avant extras.js. Ajouter une arme = une ligne dans NW + un dessin dans ART. Ajouter un skin = une ligne dans SK (ne pas réordonner : les achats sont enregistrés par numéro). */
(() => {
const NW = [
 {n:'M4 Carbine',d:10,r:.075,s:1100,sp:.045,mag:30,rl:1.4,p:1,L:26,z:.4},
 {n:'P90',d:8,r:.05,s:1050,sp:.09,mag:50,rl:1.5,p:1,L:22,z:0},
 {n:'Desert Eagle',d:46,r:.55,s:1300,sp:.012,mag:7,rl:1.7,p:1,L:22,z:.2},
 {n:'Railgun',d:55,r:.9,s:3200,sp:0,mag:4,rl:2.4,p:1,L:40,z:.8},
 {n:'Lance-grenades',d:16,r:.8,s:620,sp:.02,mag:5,rl:2.2,p:1,L:36,z:0,ex:1,lf:1.4},
 {n:'AA-12',d:7,r:.2,s:850,sp:.2,mag:20,rl:2.2,p:5,L:26,z:0}
];
const F = W.length; // index de la 1re nouvelle arme
NW.forEach(w => W.push(w));
GTIP.push(40, 34, 30, 50, 36, 44); MZ.push(38, 32, 28, 48, 34, 42);
BT.push([.02, 2.2], [.025, 2], [.03, 3], [.07, 3], [.03, 5], [.016, 2.2]);
BC.push('#ffe28a', '#ffd27a', '#ffe8a0', '#9be8ff', '#ff8c1a', '#ffd27a');
WPOOL.push(F, F + 1, F + 2, F + 3, F + 4, F + 5);
try { [me, ...bots].forEach(e => { if (e && e.am) while (e.am.length < W.length) e.am.push(W[e.am.length].mag); }); } catch (e) {} // entités créées avant ce fichier

/* ---------- dessin des nouvelles armes ---------- */
const HAND = [24, 18, 12, 20, 26, 26], FLASH = [12, 9, 14, 18, 16, 14];
function art(c, wi, fl, hand) {
  const P = (k, p) => { c.fillStyle = k; c.beginPath(); c.moveTo(p[0], p[1]); for (let i = 2; i < p.length; i += 2) c.lineTo(p[i], p[i + 1]); c.closePath(); c.fill(); },
    R = (k, x, y, w, h) => { c.fillStyle = k; c.fillRect(x, y, w, h); }, i = wi - F;
  if (i == 0) { P('#2a2d35', [5, -3, -9, -1, -9, 5, 5, 3]); R('#2a2d35', 4, -5, 20, 6); R('#454a56', 4, -5, 20, 1.3); R('#1d1f26', 24, -4, 12, 3.6); R('#14161c', 36, -3.2, 5, 1.8); R('#2a2d35', 10, -7.5, 10, 2.5); R('#c8cfdd', 12, -8.4, 2, 1); P('#14161c', [12, 1, 17, 1, 19, 12, 13, 12]); P('#14161c', [6, 1, 10, 1, 9, 8, 5, 8]) }
  else if (i == 1) { R('#2a2d35', -4, -3, 6, 6); R('#e8e4d8', 2, -5.5, 26, 8); R('#9aa3b8', 2, -5.5, 26, 1.5); R('#3a4050', 6, -9, 18, 3.4); R('#4cc9f0', 8, -8.2, 14, 1.2); R('#2a2d35', 28, -3, 8, 2.6); R('#13151a', 35, -2.6, 2, 2); R('#2a2d35', 14, 2, 4, 8) }
  else if (i == 2) { R('#aab2c0', 6, -5.5, 22, 6.5); R('#e1e7f2', 6, -5.5, 22, 1.5); R('#8b93a3', 24, -4.6, 10, 4.4); R('#13151a', 32.5, -4.3, 2, 3); R('#13151a', 8, -7.2, 2, 1.7); R('#13151a', 24, -7.2, 2, 1.7); P('#14161c', [8, 1, 14, 1, 12, 10, 7, 10]); c.strokeStyle = '#14161c'; c.lineWidth = 1; c.beginPath(); c.arc(16, 3, 2.6, 0, Math.PI); c.stroke() }
  else if (i == 3) { R('#2a2d35', -8, -3, 10, 6); R('#e8ecf5', 2, -5, 30, 7); R('#4cc9f0', 6, -3, 22, 1.6); R('#2a2d35', 32, -5.5, 18, 2); R('#2a2d35', 32, -1, 18, 2); for (let k = 0; k < 3; k++) R('#9be8ff', 35 + k * 5, -6, 2, 8); R('#2a2d35', 12, 2, 4, 8) }
  else if (i == 4) { R('#2a2d35', -4, -3, 8, 6); R('#4b5a3a', 2, -6, 28, 8); R('#2a2d35', 2, -6, 28, 1.4); c.fillStyle = '#20232b'; c.beginPath(); c.arc(15, -2, 6.5, 0, 7); c.fill(); c.strokeStyle = '#8a8f99'; c.lineWidth = 1.2; c.beginPath(); c.arc(15, -2, 6.5, 0, 7); c.moveTo(15, -2); c.lineTo(15, -8); c.moveTo(15, -2); c.lineTo(21, 1); c.stroke(); R('#2a2d35', 28, -5, 16, 6); R('#111', 43, -5, 3, 6); R('#c0392b', 30, -6.4, 4, 1.4); R('#2a2d35', 14, 4, 4, 7) }
  else { P('#2a2d35', [5, -3, -10, 0, -10, 6, 5, 4]); R('#2a2d35', 4, -5.5, 16, 7); R('#20232b', 18, -5, 26, 4.5); R('#555b69', 18, -5, 26, 1.2); R('#d9382f', 40, -5, 3, 4.5); c.fillStyle = '#14161c'; c.beginPath(); c.arc(15, 7, 5.5, 0, 7); c.fill(); c.strokeStyle = '#555b69'; c.lineWidth = 1; c.beginPath(); c.arc(15, 7, 5.5, 0, 7); c.stroke(); R('#2a2d35', 22, 2, 4, 7) }
  if (hand) { c.fillStyle = '#f1c27d'; c.beginPath(); c.arc(HAND[i], 1.5, 2.7, 0, 7); c.fill() }
  if (fl > 0) { const x = GTIP[wi], y = -2.5, r = FLASH[i] * fl; c.save(); c.globalCompositeOperation = 'lighter'; const gd = c.createRadialGradient(x, y, 0, x, y, r * 1.7); gd.addColorStop(0, 'rgba(255,240,180,.95)'); gd.addColorStop(1, 'rgba(255,140,30,0)'); c.fillStyle = gd; c.beginPath(); c.arc(x, y, r * 1.7, 0, 7); c.fill(); c.fillStyle = '#fff6c8'; c.beginPath(); for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4, q = k % 2 ? r * .45 : r * (.9 + Math.random() * .4); c.lineTo(x + Math.cos(a) * q, y + Math.sin(a) * q) } c.closePath(); c.fill(); c.restore() }
}
const hook = (n, f) => { const o = window[n]; window[n] = function (...a) { return f.call(this, o, ...a); }; };

/* ---------- rendu amélioré des 16 armes (v17) : volume, arêtes lumineuses, contour sombre, détails, lueurs animées ---------- */
const og = window.gun, HAND0 = [0, 24, 28, 30, 22, 18, 24, 22, 24, 22], FL0 = [7, 11, 14, 16, 8, 10, 10, 18, 12, 16], OX = 16, OY = 14, SPR = {}, SIL = {}, DET = {}, EDG = {}, TXS = {}, TXA = {};
const mkc = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
function extra(c, wi) { // petits détails dessinés dans le sprite (grain du bois, rails, stries, bandes de sécurité…)
  const R = (k, x, y, w, h) => { c.fillStyle = k; c.fillRect(x, y, w, h); }, D = 'rgba(0,0,0,.4)', Y = '#e8c34a', tk = (x, y, n, st, h) => { for (let i = 0; i < n; i++) R(D, x + i * st, y, .7, h); };
  switch (wi) {
    case 0: tk(12, -4.4, 4, 1.7, 3.8); break;
    case 1: for (let i = 0; i < 6; i++) R('rgba(0,0,0,.25)', 24 + i * 1.9, -3, .5, 5); R('rgba(0,0,0,.2)', -8, 1, 12, .6); R('#8a8f99', 5, -6, 19, .9); break;
    case 2: tk(24, .6, 6, 2.2, 5); break;
    case 3: R('#555b69', 16, -10.4, 1.4, 5.6); R('#555b69', 31, -10.4, 1.4, 5.6); R('#cfd6e2', 14, -10, 22, .6); break;
    case 4: for (let i = 0; i < 4; i++) R(D, 18 + i * 2.4, -3.8, 1.2, 1.2); break;
    case 5: tk(9, -5.2, 4, 2.2, 5); break;
    case 6: tk(8, -5, 5, 2.2, 2.5); break;
    case 7: R(Y, 30, -6, 2, 8); R(Y, 34, -6, 2, 8); break;
    case 8: R(D, 12, -4.5, .6, 6); R(D, 20, -4.5, .6, 6); break;
    case 9: R(Y, -8, -1, 12, 1.4); break;
    case 10: tk(11, -7.6, 9, 1.1, 1.2); break;
    case 11: tk(8, -9, 6, 2.6, 2.6); break;
    case 12: tk(9, -5.2, 4, 1.6, 4); break;
    case 13: R('#fff', 8, -4.8, 18, .6); break;
    case 14: R(Y, 30, -5, 2, 6); break;
    case 15: tk(20, -4.6, 8, 3, 3.4); break;
  }
}
function edge(c, sil, w, h, dy, col) { // arêtes éclairées (dy>0 : haut) ou ombrées (dy<0 : bas)
  const t = mkc(w, h), x = t.getContext('2d'); x.drawImage(sil, 0, 0); x.globalCompositeOperation = 'destination-out'; x.drawImage(sil, 0, dy);
  x.globalCompositeOperation = 'source-in'; x.fillStyle = col; x.fillRect(0, 0, w, h); c.drawImage(t, 0, 0);
}
function detail(cv, w, h) { // lignes sombres / reflets clairs du dessin d'origine, réappliqués par-dessus un skin pour garder les détails de l'arme
  const o = mkc(w, h), x = o.getContext('2d');
  try { const d = cv.getContext('2d').getImageData(0, 0, w, h).data, out = x.createImageData(w, h), q = out.data;
    for (let i = 0; i < d.length; i += 4) { if (d[i + 3] < 40) continue; const l = (d[i] * .3 + d[i + 1] * .59 + d[i + 2] * .11) / 255;
      if (l < .3) { q[i] = 4; q[i + 1] = 5; q[i + 2] = 10; q[i + 3] = (1 - l / .3) * 150; } else if (l > .62) { q[i] = q[i + 1] = q[i + 2] = 255; q[i + 3] = Math.min(1, (l - .62) / .38) * 70; } }
    x.putImageData(out, 0, 0); } catch (e) {}
  return o;
}
function sprite(wi, S) {
  const key = wi + '_' + S; if (SPR[key]) return SPR[key];
  const w = 72 * S, h = 32 * S, cv = mkc(w, h), c = cv.getContext('2d');
  c.scale(S, S); c.translate(OX, OY); (wi < F ? og : art)(c, wi, 0, 0); extra(c, wi); c.setTransform(1, 0, 0, 1, 0, 0);
  const sil = mkc(w, h), s = sil.getContext('2d'); s.drawImage(cv, 0, 0); s.globalCompositeOperation = 'source-in'; s.fillStyle = '#fff'; s.fillRect(0, 0, w, h);
  c.globalCompositeOperation = 'source-atop';
  const gr = c.createLinearGradient(0, (OY - 9) * S, 0, (OY + 9) * S); gr.addColorStop(0, 'rgba(255,255,255,.3)'); gr.addColorStop(.45, 'rgba(255,255,255,0)'); gr.addColorStop(1, 'rgba(0,0,0,.4)'); c.fillStyle = gr; c.fillRect(0, 0, w, h);
  edge(c, sil, w, h, 1.1 * S, 'rgba(255,255,255,.65)'); edge(c, sil, w, h, -1.1 * S, 'rgba(0,0,0,.45)');
  SIL[key] = sil; DET[key] = detail(cv, w, h); const eg = mkc(w, h), ec = eg.getContext('2d'); edge(ec, sil, w, h, 1.1 * S, 'rgba(255,255,255,.65)'); edge(ec, sil, w, h, -1.1 * S, 'rgba(0,0,0,.45)'); EDG[key] = eg; // pour les skins texturés
  const bk = mkc(w, h), b = bk.getContext('2d'); b.drawImage(sil, 0, 0); b.globalCompositeOperation = 'source-in'; b.fillStyle = '#07080c'; b.fillRect(0, 0, w, h);
  c.globalCompositeOperation = 'destination-over'; for (let k = 0; k < 8; k++) c.drawImage(bk, Math.cos(k * Math.PI / 4) * .7 * S, Math.sin(k * Math.PI / 4) * .7 * S); // contour
  return SPR[key] = cv;
}
function dyn(c, wi, t) { // lueurs animées (laser, railgun, lance-flammes, éclat de lunette)
  const glow = (x, y, r, col, a) => { const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)'); c.globalAlpha = a; c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); };
  if (wi != 8 && wi != 13 && wi != 9 && wi != 3) return; c.save(); c.globalCompositeOperation = 'lighter';
  if (wi == 8) glow(16, -2.2, 11, '#4cc9f0', .35 + .2 * Math.sin(t * 7));
  else if (wi == 13) for (let k = 0; k < 3; k++) glow(36 + k * 5, -2, 4.5, '#9be8ff', .45 + .35 * Math.sin(t * 9 - k * 1.3));
  else if (wi == 9) { const f = Math.sin(t * 25); c.globalAlpha = .9; c.fillStyle = '#ff8c1a'; c.beginPath(); c.moveTo(40, -3.6); c.lineTo(44 + f * 1.5, -2.4 + f * .4); c.lineTo(40, -1.1); c.fill(); glow(42, -2.4, 5, '#ffb347', .35); }
  else if (t % 3.2 < .18) glow(35.6, -8, 4, '#fff', .8);
  c.restore();
}
function flash(c, wi, fl) {
  const x = GTIP[wi], y = -2.5, r = (wi < F ? FL0[wi] : FLASH[wi - F]) * fl; c.save(); c.globalCompositeOperation = 'lighter';
  const gd = c.createRadialGradient(x, y, 0, x, y, r * 1.8); gd.addColorStop(0, 'rgba(255,245,200,.95)'); gd.addColorStop(.4, 'rgba(255,170,60,.5)'); gd.addColorStop(1, 'rgba(255,100,20,0)'); c.fillStyle = gd; c.beginPath(); c.arc(x, y, r * 1.8, 0, 7); c.fill();
  c.fillStyle = '#fff6c8'; c.beginPath(); for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5, q = i % 2 ? r * .4 : r * (.9 + Math.random() * .5); c.lineTo(x + Math.cos(a) * q * (Math.cos(a) > 0 ? 1.5 : .8), y + Math.sin(a) * q * .8); } c.closePath(); c.fill(); c.restore();
}
window.gun = function (c, wi, fl, hand) {
  let sp; try { const m = c.getTransform ? c.getTransform() : null, k = m ? Math.hypot(m.a, m.b) : 3; sp = sprite(wi, k <= 1.6 ? 2 : k <= 3.2 ? 4 : 7); } catch (e) {}
  if (!sp) return wi < F ? og(c, wi, fl, hand) : art(c, wi, fl, hand);
  c.drawImage(sp, -OX, -OY, 72, 32); dyn(c, wi, performance.now() / 1000);
  if (hand && wi > 0) { const hx = wi < F ? HAND0[wi] : HAND[wi - F]; c.fillStyle = '#f1c27d'; c.strokeStyle = 'rgba(0,0,0,.55)'; c.lineWidth = .8; c.beginPath(); c.arc(hx, 1.5, 2.7, 0, 7); c.fill(); c.stroke(); }
  if (fl > 0) flash(c, wi, fl);
};

/* ---------- skins d'arme : [nom, prix, E=éternel / V=evo, [couleur1, couleur2], effet, teinte du corps] ---------- */
const B = 6; // les 6 skins d'origine (Standard…Arc-en-ciel) restent 0-5
const SK = [
 ['Éternel · Obsidienne', 300, 'E', ['#14101c', '#a855f7'], 'wisp', 1],
 ['Éternel · Plasma', 350, 'E', ['#00f0ff', '#ff2fd0'], 'ring', 0],
 ['Éternel · Lave', 400, 'E', ['#ff3b00', '#ffd23f'], 'ember', 1],
 ['Éternel · Glace', 400, 'E', ['#8fe3ff', '#ffffff'], 'snow', 1],
 ['Éternel · Or royal', 600, 'E', ['#d4a017', '#fff6c8'], 'spark', 1],
 ['Éternel · Néant', 800, 'E', ['#05050a', '#7a3cff'], 'star', 1],
 ['EVO · Phénix', 500, 'V', ['#ff7a1a', '#ffe14d'], 'ember', 0],
 ['EVO · Foudre', 500, 'V', ['#4cc9f0', '#ffffff'], 'spark', 0],
 ['EVO · Dragon', 700, 'V', ['#4caf50', '#ffd23f'], 'ember', 0],
 ['EVO · Cosmos', 900, 'V', ['#7a3cff', '#ff2fd0'], 'star', 0],
 ['EVO · Venin', 800, 'V', ['#9cff3a', '#2a8a14'], 'ember', 0],
 ['EVO · Spectre', 1100, 'V', ['#bff3ff', '#6b8cff'], 'wisp', 0]
];
const TH = [0, 10, 30, 60, 100]; // kills nécessaires pour les niveaux EVO 1→5
let evo = {}; try { evo = JSON.parse(localStorage.getItem('mgEvo') || '{}') || {}; } catch (e) {}
const lvl = id => { const k = evo[id] | 0; let l = 1; for (let i = 1; i < 5; i++) if (k >= TH[i]) l = i + 1; return l; };
let lastK = -1;
function track(id) { // +1 à l'EVO équipé à chaque kill
  const k = me.k | 0; if (lastK < 0 || k < lastK) { lastK = k; return; }
  if (k > lastK) { evo[id] = (evo[id] | 0) + (k - lastK); lastK = k; try { localStorage.setItem('mgEvo', JSON.stringify(evo)); } catch (e) {} }
}
/* ---------- skins v18 : texture peinte sur TOUTE l'arme (découpée à la silhouette) + motifs iconiques ---------- */
function rng(s) { s = (s | 0) % 2147483647 || 1; return () => (s = s * 16807 % 2147483647) / 2147483647; }
const lg = (c, x0, y0, x1, y1, st) => { const g = c.createLinearGradient(x0, y0, x1, y1); st.forEach(s => g.addColorStop(s[0], s[1])); return g; };
const rgd = (c, x, y, r, st) => { const g = c.createRadialGradient(x, y, 0, x, y, r); st.forEach(s => g.addColorStop(s[0], s[1])); return g; };
const fill = (c, k, tip) => { c.fillStyle = k; c.fillRect(-18, -16, tip + 40, 34); };
const stars = (c, r, n, tip, k) => { for (let i = 0; i < n; i++) { c.globalAlpha = .35 + r() * .65; c.fillStyle = k || '#fff'; const s = .25 + r() * .55; c.fillRect(-12 + r() * (tip + 22), -10 + r() * 22, s, s); } c.globalAlpha = 1; };
const bolt = (c, x0, y0, x1, y1, r, j) => { c.beginPath(); c.moveTo(x0, y0); const n = 7; for (let i = 1; i < n; i++) c.lineTo(x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n + (r() - .5) * j); c.lineTo(x1, y1); c.stroke(); };
const veins = (c, r, n, tip, col, w) => { c.lineCap = 'round'; for (let i = 0; i < n; i++) { let x = -10 + r() * (tip + 16), y = -9 + r() * 18; c.beginPath(); c.moveTo(x, y); for (let k = 0; k < 6; k++) { x += (r() - .35) * 7; y += (r() - .5) * 6; c.lineTo(x, y); } c.strokeStyle = col[0]; c.lineWidth = w * 2.6; c.globalAlpha = .22; c.stroke(); c.strokeStyle = col[1]; c.lineWidth = w; c.globalAlpha = .95; c.stroke(); } c.globalAlpha = 1; };
const sheen = (c, t, tip, a, sp, w) => { const x = ((t * sp) % 1) * (tip + 50) - 25; c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = lg(c, x - w, 0, x + w, 0, [[0, 'rgba(255,255,255,0)'], [.5, 'rgba(255,255,255,' + a + ')'], [1, 'rgba(255,255,255,0)']]); c.beginPath(); c.moveTo(x - w - 6, 12); c.lineTo(x - w + 6, -14); c.lineTo(x + w + 6, -14); c.lineTo(x + w - 6, 12); c.fill(); c.restore(); };
const glint = (c, x, y, s, a) => { c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = a; c.fillStyle = '#fff'; c.fillRect(x - s, y - .3, s * 2, .6); c.fillRect(x - .3, y - s, .6, s * 2); c.restore(); };
const scales = (c, tip, x0, y0, sz, dark, light) => { for (let row = 0, y = y0; y < 14; y += sz * .6, row++) for (let x = x0 + (row & 1 ? sz / 2 : 0); x < tip + 20; x += sz) { c.beginPath(); c.arc(x, y, sz / 2, 0, Math.PI); c.strokeStyle = dark; c.lineWidth = .55; c.stroke(); c.beginPath(); c.arc(x, y - .5, sz / 2 - .6, .25, Math.PI - .25); c.strokeStyle = light; c.lineWidth = .35; c.stroke(); } };
const SKP = {
 1: { // NÉON : corps sombre, lignes néon cyan qui pulsent
  base(c, r, lv, tip) { fill(c, lg(c, 0, -9, 0, 7, [[0, '#101f4a'], [1, '#050813']]), tip); c.lineCap = 'round';
   for (const [y, x1] of [[-3.4, tip - 6], [.9, tip - 12]]) { c.beginPath(); c.moveTo(4, y); c.lineTo(x1, y); c.strokeStyle = 'rgba(25,216,255,.28)'; c.lineWidth = 2.4; c.stroke(); c.strokeStyle = '#6ff0ff'; c.lineWidth = .8; c.stroke(); }
   c.strokeStyle = '#19d8ff'; c.lineWidth = .6; for (let x = 7; x < tip - 8; x += 5) { c.beginPath(); c.moveTo(x, -6.4); c.lineTo(x, -4.4); c.moveTo(x, -1.6); c.lineTo(x, .2); c.stroke(); }
   c.beginPath(); c.moveTo(tip - 6, -5); c.lineTo(tip - 2, -2.5); c.lineTo(tip - 6, 0); c.stroke(); },
  fx(c, t, lv, tip) { const x = ((t * .7) % 1) * (tip + 24) - 10; c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = lg(c, x - 8, 0, x + 8, 0, [[0, 'rgba(25,216,255,0)'], [.5, 'rgba(120,245,255,.65)'], [1, 'rgba(25,216,255,0)']]); c.fillRect(x - 8, -10, 16, 20); c.globalAlpha = .1 + .08 * Math.sin(t * 4); c.fillStyle = '#19d8ff'; c.fillRect(-16, -12, tip + 30, 26); c.restore(); } },
 2: { // OR : plaque d'or métallique gravée de losanges
  base(c, r, lv, tip) { fill(c, lg(c, 0, -9, 0, 7, [[0, '#fff3b0'], [.18, '#ffd23f'], [.45, '#b8860b'], [.62, '#ffdf6a'], [1, '#7a5206']]), tip);
   c.strokeStyle = 'rgba(90,55,0,.5)'; c.lineWidth = .45; for (let x = 6; x < tip - 6; x += 4.4) { c.beginPath(); c.moveTo(x, -2); c.lineTo(x + 2.2, -4.6); c.lineTo(x + 4.4, -2); c.lineTo(x + 2.2, .6); c.closePath(); c.stroke(); }
   c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(4, -5.6, tip - 10, .7); },
  fx(c, t, lv, tip) { sheen(c, t, tip, .6, .45, 4); } },
 3: { // CAMOUFLAGE : treillis forestier
  base(c, r, lv, tip) { fill(c, '#56642c', tip); const cols = ['#2f3a1a', '#7b8a43', '#1f2512', '#8a7a4a'];
   for (let i = 0; i < 30; i++) { c.fillStyle = cols[i % 4]; c.beginPath(); c.ellipse(-10 + r() * (tip + 20), -9 + r() * 20, 3 + r() * 7, 1.4 + r() * 3.2, r() * 3, 0, 7); c.fill(); }
   c.fillStyle = 'rgba(0,0,0,.18)'; for (let i = 0; i < 40; i++) c.fillRect(-10 + r() * (tip + 20), -9 + r() * 20, .7, .7); } },
 4: { // RUBIS : gemme taillée à facettes
  base(c, r, lv, tip) { fill(c, lg(c, 0, -9, tip, 9, [[0, '#3d0008'], [.5, '#c8102e'], [1, '#ff6a85']]), tip);
   for (let i = 0; i < 34; i++) { const x = -10 + r() * (tip + 20), y = -9 + r() * 20, s = 3 + r() * 6; c.beginPath(); c.moveTo(x, y); c.lineTo(x + s * (r() + .4), y + s * (r() - .5)); c.lineTo(x + s * (r() - .2), y + s * (r() + .4)); c.closePath(); c.fillStyle = r() < .5 ? 'rgba(255,255,255,.11)' : 'rgba(40,0,10,.2)'; c.fill(); c.strokeStyle = 'rgba(255,200,215,.3)'; c.lineWidth = .3; c.stroke(); } },
  fx(c, t, lv, tip) { for (let i = 0; i < 3; i++) { const p = (t * .8 + i * .33) % 1; glint(c, 8 + (i * 37 % 100) / 100 * (tip - 14), -4 + Math.sin(i * 2.3) * 3, 2.6 * Math.sin(p * Math.PI), Math.sin(p * Math.PI)); } } },
 5: { // ARC-EN-CIEL : dégradé holographique animé
  base(c, r, lv, tip) { fill(c, '#ddd', tip); },
  fx(c, t, lv, tip) { const h = (t * 90) % 360, g = c.createLinearGradient(-6, -8, tip + 4, 8); for (let i = 0; i <= 6; i++) g.addColorStop(i / 6, 'hsl(' + ((h + i * 60) % 360 | 0) + ',95%,58%)'); c.fillStyle = g; c.fillRect(-18, -16, tip + 40, 34); sheen(c, t, tip, .5, .6, 3.5); } },
 6: { // OBSIDIENNE : verre volcanique noir, veines violettes
  base(c, r, lv, tip) { fill(c, lg(c, 0, -9, 0, 7, [[0, '#1c1233'], [.5, '#0a0714'], [1, '#04030a']]), tip); veins(c, r, 7, tip, ['#a855f7', '#e9c8ff'], .5); },
  fx(c, t, lv, tip) { c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = .07 + .06 * Math.sin(t * 3); c.fillStyle = '#a855f7'; c.fillRect(-16, -12, tip + 30, 26); c.restore(); sheen(c, t, tip, .32, .3, 2); } },
 7: { // PLASMA : énergie cyan/magenta qui ondule
  base(c, r, lv, tip) { fill(c, lg(c, 0, -9, 0, 7, [[0, '#0a1c30'], [1, '#050a14']]), tip); },
  fx(c, t, lv, tip) { c.save(); c.globalCompositeOperation = 'lighter'; c.lineCap = 'round';
   for (let k = 0; k < 4; k++) { c.beginPath(); for (let x = -8; x <= tip + 8; x += 1.5) { const y = -2 + Math.sin(x * .32 + t * 5 + k * 1.7) * (3.6 - k * .5); x == -8 ? c.moveTo(x, y) : c.lineTo(x, y); } c.strokeStyle = k & 1 ? '#ff2fd0' : '#00f0ff'; c.globalAlpha = .28; c.lineWidth = 2.6; c.stroke(); c.globalAlpha = .95; c.lineWidth = .8; c.stroke(); }
   c.restore(); } },
 8: { // LAVE : roche noire craquelée, magma incandescent
  base(c, r, lv, tip) { fill(c, lg(c, 0, -9, 0, 7, [[0, '#2a0f06'], [1, '#0d0402']]), tip); veins(c, r, 10, tip, ['#ff3b00', '#ffd23f'], .55); },
  fx(c, t, lv, tip) { c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = .14 + .1 * Math.sin(t * 3); c.fillStyle = lg(c, 0, 6, 0, -8, [[0, '#ff3b00'], [1, 'rgba(255,100,0,0)']]); c.fillRect(-16, -12, tip + 30, 26); c.restore(); } },
 9: { // GLACE : cristal bleuté givré
  base(c, r, lv, tip) { fill(c, lg(c, 0, -9, tip, 8, [[0, '#f1fdff'], [.45, '#8fe3ff'], [1, '#3b93c9']]), tip); c.strokeStyle = 'rgba(255,255,255,.8)'; c.lineWidth = .4; c.lineCap = 'round';
   for (let i = 0; i < 16; i++) { const x = -8 + r() * (tip + 16), y = -8 + r() * 18, s = 1.4 + r() * 2.6; c.beginPath(); for (let a = 0; a < 3; a++) { const an = a * Math.PI / 3 + r() * .3; c.moveTo(x - Math.cos(an) * s, y - Math.sin(an) * s); c.lineTo(x + Math.cos(an) * s, y + Math.sin(an) * s); } c.stroke(); } },
  fx(c, t, lv, tip) { sheen(c, t, tip, .55, .35, 3.4); for (let i = 0; i < 3; i++) { const p = (t * .7 + i * .33) % 1; glint(c, 6 + ((i * 53) % 100) / 100 * (tip - 10), -5 + i * 2.4, 2.2 * Math.sin(p * Math.PI), Math.sin(p * Math.PI)); } } },
 10: { // OR ROYAL : or ouvragé, volutes et gemmes
  base(c, r, lv, tip) { fill(c, lg(c, 0, -9, 0, 7, [[0, '#fff6c8'], [.22, '#d4a017'], [.55, '#8a6a00'], [.75, '#f5d76e'], [1, '#5a3d00']]), tip);
   c.strokeStyle = 'rgba(60,35,0,.65)'; c.lineWidth = .55; for (let x = 6; x < tip - 8; x += 6) { c.beginPath(); c.arc(x + 3, -2.6, 2.6, Math.PI, 0); c.arc(x + 6, -2.6, 2.6, Math.PI, 0, true); c.stroke(); c.beginPath(); c.arc(x + 3, 1, 2, 0, Math.PI); c.stroke(); }
   for (const x of [13, (tip / 2 + 8) | 0, tip - 7]) { c.fillStyle = '#e0115f'; c.beginPath(); c.arc(x, -2.4, 1.5, 0, 7); c.fill(); c.strokeStyle = '#fff3b0'; c.lineWidth = .5; c.stroke(); c.fillStyle = '#fff'; c.fillRect(x - .7, -3.2, .8, .8); } },
  fx(c, t, lv, tip) { sheen(c, t, tip, .65, .4, 4); glint(c, 13, -3, 2.4 * Math.abs(Math.sin(t * 2)), 1); } },
 11: { // NÉANT : vide sidéral, nébuleuse et étoiles
  base(c, r, lv, tip) { fill(c, '#02020a', tip); c.fillStyle = rgd(c, tip * .3, -2, 16, [[0, 'rgba(122,60,255,.7)'], [1, 'rgba(122,60,255,0)']]); c.fillRect(-18, -16, tip + 40, 34); c.fillStyle = rgd(c, tip * .75, 2, 14, [[0, 'rgba(255,47,208,.45)'], [1, 'rgba(255,47,208,0)']]); c.fillRect(-18, -16, tip + 40, 34); stars(c, r, 46, tip); },
  fx(c, t, lv, tip) { c.save(); c.globalCompositeOperation = 'lighter'; const x = tip * (.5 + .4 * Math.sin(t * .6)); c.fillStyle = rgd(c, x, -2 + 3 * Math.cos(t * .9), 12, [[0, 'rgba(160,100,255,.4)'], [1, 'rgba(160,100,255,0)']]); c.fillRect(-18, -16, tip + 40, 34); c.restore(); for (let i = 0; i < 4; i++) glint(c, 6 + ((i * 41) % 100) / 100 * (tip - 8), -6 + i * 3, 1.6 * Math.abs(Math.sin(t * 2 + i * 1.9)), 1); } },
 12: { // EVO PHÉNIX : plumes de feu
  base(c, r, lv, tip) { fill(c, lg(c, 0, -9, 0, 7, [[0, lv > 2 ? '#ffe14d' : '#ffb347'], [.5, '#ff7a1a'], [1, '#8f1a06']]), tip); scales(c, tip, 4, -7, 5, 'rgba(110,20,0,.45)', 'rgba(255,235,150,.35)'); },
  fx(c, t, lv, tip) { const L = (lv - 1) / 4; c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = .05 + .22 * L * (.5 + .5 * Math.sin(t * 6)); c.fillStyle = lg(c, 0, 7, 0, -8, [[0, '#ff5a00'], [1, '#ffe14d']]); c.fillRect(-16, -12, tip + 30, 26); c.restore(); if (lv >= 5) { c.fillStyle = 'rgba(255,255,230,.8)'; c.fillRect(6, -2.8, tip - 12, .8); } } },
 13: { // EVO FOUDRE : acier bleu parcouru d'éclairs
  base(c, r, lv, tip) { fill(c, lg(c, 0, -9, 0, 7, [[0, '#2a5fa8'], [.5, '#10264f'], [1, '#070d1f']]), tip); c.strokeStyle = 'rgba(76,201,240,.45)'; c.lineWidth = .4; for (let i = 0; i < 6; i++) { const y = -7 + i * 2.8; c.beginPath(); c.moveTo(5, y); c.lineTo(5 + r() * 10, y); c.lineTo(8 + r() * 14, y + 1.6); c.lineTo(tip - 6, y + 1.6); c.stroke(); } },
  fx(c, t, lv, tip) { const f = Math.floor(t * 9); c.save(); c.globalCompositeOperation = 'lighter'; c.lineCap = 'round'; c.lineJoin = 'round'; const n = lv >= 2 ? Math.min(4, lv) : 1;
   for (let i = 0; i < n; i++) { const r = rng(f * 31 + i * 7); if (r() < .35 - lv * .04) continue; const y0 = -7 + r() * 12; c.globalAlpha = .35; c.strokeStyle = '#4cc9f0'; c.lineWidth = 2.6; const r2 = rng(f * 31 + i * 7 + 1); bolt(c, 2, y0, tip + 4, y0 + (r2() - .5) * 8, rng(f * 13 + i), 6); c.globalAlpha = 1; c.strokeStyle = '#fff'; c.lineWidth = .6; bolt(c, 2, y0, tip + 4, y0 + (r2() - .5) * 8, rng(f * 13 + i), 6); } c.restore(); } },
 14: { // EVO DRAGON : écailles émeraude, liserés d'or
  base(c, r, lv, tip) { fill(c, lg(c, 0, -9, 0, 7, [[0, lv >= 5 ? '#e6c200' : '#3fb55a'], [.5, lv >= 5 ? '#8a6d00' : '#14633a'], [1, '#07261a']]), tip); scales(c, tip, 3, -7.5, 4.6, 'rgba(0,25,10,.55)', lv >= 4 ? 'rgba(255,225,90,.7)' : 'rgba(190,255,170,.3)'); },
  fx(c, t, lv, tip) { if (lv < 3) return; const L = (lv - 2) / 3; c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = rgd(c, tip - 3, -2.5, 14, [[0, 'rgba(255,140,26,' + (.3 + .3 * L) * (.7 + .3 * Math.sin(t * 7)) + ')'], [1, 'rgba(255,140,26,0)']]); c.fillRect(-18, -16, tip + 40, 34); c.restore(); if (lv >= 5) sheen(c, t, tip, .35, .5, 3); } },
 15: { // EVO COSMOS : galaxie violette, étoiles filantes
  base(c, r, lv, tip) { fill(c, lg(c, 0, -9, tip, 9, [[0, '#14082e'], [.5, '#4a1580'], [1, '#1c0a3a']]), tip); c.fillStyle = rgd(c, tip * .4, -1, 16, [[0, 'rgba(255,47,208,.5)'], [1, 'rgba(255,47,208,0)']]); c.fillRect(-18, -16, tip + 40, 34); stars(c, r, 22 + lv * 9, tip); },
  fx(c, t, lv, tip) { for (let i = 0; i < 4; i++) glint(c, 6 + ((i * 47) % 100) / 100 * (tip - 8), -6 + i * 3.4, 1.7 * Math.abs(Math.sin(t * 2.4 + i * 1.7)), 1);
   if (lv >= 3) { const u = (t * .5) % 1; c.save(); c.globalCompositeOperation = 'lighter'; c.strokeStyle = '#fff'; c.lineWidth = .7; c.globalAlpha = Math.sin(u * Math.PI); c.beginPath(); c.moveTo(-8 + u * (tip + 20), -8 + u * 12); c.lineTo(-8 + u * (tip + 20) - 9, -8 + u * 12 - 4); c.stroke(); c.restore(); } } },
 16: { // EVO VENIN : toxique, chevrons de danger, veines vertes, gouttes
  base(c, r, lv, tip) { fill(c, lg(c, 0, -9, 0, 7, [[0, '#1e3a12'], [.5, '#0c1c08'], [1, '#050a03']]), tip);
   c.fillStyle = 'rgba(160,255,60,.5)'; for (let x = 4; x < tip - 4; x += 7) { c.beginPath(); c.moveTo(x, 3.5); c.lineTo(x + 3, 3.5); c.lineTo(x + 6, 7); c.lineTo(x + 3, 7); c.closePath(); c.fill(); }
   veins(c, r, 4 + lv * 2, tip, ['#6bff2a', '#eaffc0'], .5);
   if (lv >= 3) { c.fillStyle = '#9cff3a'; for (let i = 0; i < lv; i++) { const x = 8 + r() * (tip - 14); c.beginPath(); c.ellipse(x, 8 + r() * 2, .8, 1.8, 0, 0, 7); c.fill(); } } },
  fx(c, t, lv, tip) { const L = (lv - 1) / 4; c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = .08 + .2 * L * (.5 + .5 * Math.sin(t * 4)); c.fillStyle = lg(c, 0, 7, 0, -8, [[0, '#6bff2a'], [1, 'rgba(100,255,40,0)']]); c.fillRect(-16, -12, tip + 30, 26); c.restore();
   if (lv >= 2) for (let i = 0; i < 2 + lv; i++) { const p = (t * .6 + i * .27) % 1, x = 6 + ((i * 41) % 100) / 100 * (tip - 10), y = 6 - p * 14; c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = Math.sin(p * Math.PI) * .9; c.strokeStyle = '#b6ff4d'; c.lineWidth = .5; c.beginPath(); c.arc(x, y, .8 + (i % 3) * .4, 0, 7); c.stroke(); c.restore(); } } },
 17: { // EVO SPECTRE : ectoplasme translucide, yeux de fantôme qui s'ouvrent au niveau 2
  base(c, r, lv, tip) { fill(c, lg(c, 0, -9, tip, 9, [[0, '#e8fbff'], [.5, '#9fc3ff'], [1, '#5b6fd6']]), tip);
   c.strokeStyle = 'rgba(255,255,255,.5)'; c.lineWidth = .5; for (let i = 0; i < 6; i++) { const y = -7 + i * 2.8; c.beginPath(); c.moveTo(3, y); for (let x = 3; x < tip; x += 3) c.lineTo(x, y + Math.sin(x * .5 + i) * 1.1); c.stroke(); } },
  fx(c, t, lv, tip) { c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = .12 + .1 * Math.sin(t * 3); c.fillStyle = '#bff3ff'; c.fillRect(-16, -12, tip + 30, 26); c.restore();
   if (lv >= 2) { const a = .5 + .5 * Math.sin(t * 3 + 1); c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = 'rgba(255,255,255,' + a + ')'; c.beginPath(); c.arc(tip * .45, -3, 1, 0, 7); c.arc(tip * .45 + 4, -3, 1, 0, 7); c.fill(); c.restore(); }
   sheen(c, t, tip, .3 + lv * .06, .35, 3); } }
};
function skinTex(c, wi, id, t, lv) {
  let S; try { const m = c.getTransform(), k = Math.hypot(m.a, m.b); S = k <= 1.6 ? 2 : k <= 3.2 ? 4 : 7; } catch (e) { return false; }
  const P = SKP[id]; if (!P) return false; const key = wi + '_' + S; sprite(wi, S); const sil = SIL[key]; if (!sil) return false;
  const w = 72 * S, h = 32 * S, tip = GTIP[wi], bk = id + '_' + key + '_' + lv; let base = TXS[bk];
  if (!base) {
    base = TXS[bk] = mkc(w, h); const x = base.getContext('2d'); x.scale(S, S); x.translate(OX, OY); P.base(x, rng(id * 131 + wi * 17 + 7), lv, tip); x.setTransform(1, 0, 0, 1, 0, 0);
    x.globalCompositeOperation = 'source-atop'; x.fillStyle = lg(x, 0, (OY - 9) * S, 0, (OY + 8) * S, [[0, 'rgba(255,255,255,.3)'], [.45, 'rgba(255,255,255,0)'], [1, 'rgba(0,0,0,.4)']]); x.fillRect(0, 0, w, h);
    x.globalCompositeOperation = 'destination-in'; x.drawImage(sil, 0, 0);
  }
  const cv = TXA[S] || (TXA[S] = mkc(w, h)), a = cv.getContext('2d'); a.setTransform(1, 0, 0, 1, 0, 0); a.globalCompositeOperation = 'source-over'; a.globalAlpha = 1; a.clearRect(0, 0, w, h); a.drawImage(base, 0, 0);
  if (P.fx) { a.save(); a.scale(S, S); a.translate(OX, OY); P.fx(a, t, lv, tip); a.restore(); a.setTransform(1, 0, 0, 1, 0, 0); a.globalCompositeOperation = 'destination-in'; a.drawImage(sil, 0, 0); a.globalCompositeOperation = 'source-over'; }
  c.drawImage(cv, -OX, -OY, 72, 32); if (DET[key]) c.drawImage(DET[key], -OX, -OY, 72, 32); if (EDG[key]) c.drawImage(EDG[key], -OX, -OY, 72, 32);
  return true;
}
function draw(c, wi, id, t, lo) {
  const s = SK[id - B]; if (!s) return; const ev = s[2] == 'V', lv = lo || (ev ? (track(id), lvl(id)) : 5), tip = GTIP[wi], [c1, c2] = s[3];
  c.save(); skinTex(c, wi, id, t, lv); c.restore();
  c.save(); c.globalCompositeOperation = 'lighter';
  if (lv >= 2) { c.globalAlpha = (.3 + .2 * Math.sin(t * 5)) * (lv >= 4 ? 1.4 : 1); c.save(); c.translate(tip / 2 + 2, -2); c.scale(1, .38); const hg = c.createRadialGradient(0, 0, 0, 0, 0, tip / 2 + 10); hg.addColorStop(0, c1); hg.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = hg; c.beginPath(); c.arc(0, 0, tip / 2 + 10, 0, 7); c.fill(); c.restore(); } // halo doux
  const n = ev ? (lv < 3 ? 0 : lv * 3) : 11, fx = s[4];
  for (let i = 0; i < n; i++) {
    const p = (t * (fx == 'ember' ? 1.1 : .7) + i * .37) % 1, x = 6 + ((i * 47) % (tip - 8)), up = fx == 'snow' ? -4 + p * 16 : -6 - p * 16;
    c.globalAlpha = (1 - p) * .95; c.fillStyle = i & 1 ? c2 : c1;
    if (fx == 'star' || fx == 'spark') { const r = (1 - p) * 2.2 + .5; c.fillRect(x - r, up, r * 2, .8); c.fillRect(x - .4, up - r, .8, r * 2); }
    else if (fx == 'ring') { c.strokeStyle = c1; c.lineWidth = .6; c.beginPath(); c.arc(x, -2, 2 + p * 6, 0, 7); c.stroke(); }
    else { c.beginPath(); c.arc(x + Math.sin(t * 4 + i) * 2, up, (1 - p) * 1.8 + .4, 0, 7); c.fill(); }
  }
  if (lv >= 5 && ev) { c.globalAlpha = .9; c.strokeStyle = c2; c.lineWidth = 1; c.beginPath(); c.moveTo(tip - 4, -2.5); for (let i = 1; i < 6; i++) c.lineTo(tip - 4 + i * 4, -2.5 + Math.sin(t * 40 + i * 2.1) * 3.2); c.stroke(); } // éclair du canon au niveau max
  c.restore();
  if (ev) { c.save(); for (let i = 0; i < 5; i++) { c.globalAlpha = i < lv ? 1 : .22; c.fillStyle = i < lv ? c2 : '#888'; c.beginPath(); c.arc(8 + i * 4.2, -12, 1.4, 0, 7); c.fill(); } c.restore(); }
}

/* ---------- aperçu (boutique → Skins d'arme → 👁 Aperçu) ---------- */
const OC = [null, '#00e5ff', '#ffd23f', '#6b8e23', '#ff2e4d', 'rainbow'];
function skin(c, wi, id, t, lo) { // skins d'origine (1-5) : même rendu texturé que les autres
  if (id >= B) return draw(c, wi, id, t, lo); if (!SKP[id]) return; c.save(); skinTex(c, wi, id, t, 5); c.restore();
}
const tc = {};
function thumb(id) {
  if (tc[id]) return tc[id]; const w = 160, h = 70, cv = document.createElement('canvas'); cv.width = w; cv.height = h; const c = cv.getContext('2d');
  c.fillStyle = '#161b2e'; c.fillRect(0, 0, w, h); if (window.XS) XS.me = 0; const sc = 2.2; c.translate(w / 2 - 18 * sc, h / 2); c.scale(sc, sc);
  window.gun(c, 1, 0, 1); skin(c, 1, id, .4, 3); return tc[id] = cv.toDataURL();
}
let ov, pc, pst = {}, praf = 0;
function pclose() { if (ov) ov.style.display = 'none'; cancelAnimationFrame(praf); praf = 0; removeEventListener('keydown', pkey, true); }
function pkey(e) { if (e.key == 'Escape') { e.stopImmediatePropagation(); e.preventDefault(); pclose(); } }
function pframe() {
  if (!praf) return; const c = pc.getContext('2d'), w = pc.width, h = pc.height, t = performance.now() / 1000;
  c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, w, h);
  const gr = c.createRadialGradient(w / 2, h * .55, 10, w / 2, h * .55, w * .7); gr.addColorStop(0, '#3a4468'); gr.addColorStop(1, '#161b2e'); c.fillStyle = gr; c.fillRect(0, 0, w, h);
  const sc = w / 76, fl = pst.fl > t ? Math.min(1, (pst.fl - t) * 8) : 0;
  c.save(); c.translate(w / 2 - 18 * sc, h / 2 + 4 * sc); c.scale(sc, sc); if (window.XS) XS.me = 0; window.gun(c, pst.wi, fl, 1); skin(c, pst.wi, pst.id, t, pst.lv); c.restore();
  praf = requestAnimationFrame(pframe);
}
function pui() {
  const s = SK[pst.id - B], ev = s && s[2] == 'V', q = k => ov.querySelector(k), kk = (evo[pst.id] | 0);
  q('.t').textContent = 'Aperçu : ' + (s ? s[0] : ['Standard', 'Néon', 'Or', 'Camouflage', 'Rubis', 'Arc-en-ciel'][pst.id]);
  q('.wn').textContent = W[pst.wi].n; q('.lvr').style.display = q('.lvi').style.display = ev ? '' : 'none';
  ov.querySelectorAll('[data-l]').forEach(b => b.classList.toggle('on', +b.dataset.l == pst.lv));
  if (ev) { const nx = TH.find(v => v > kk); q('.lvi').textContent = 'Tes kills avec ce skin : ' + kk + ' · niveau ' + lvl(pst.id) + (nx ? ' (suivant à ' + nx + ')' : ' (max)'); }
  const bb = q('[data-a=buy]'); bb.style.display = pst.buy ? '' : 'none'; bb.textContent = pst.miss > 0 ? '🪙 ' + pst.price + ' · manque ' + pst.miss : '🪙 ' + pst.price + ' · Acheter'; bb.disabled = pst.miss > 0;
}
function preview(id, buy, price, miss) {
  if (!ov) {
    const st = document.createElement('style');
    st.textContent = '.xcard button.xtryb{background:transparent;border:1px solid var(--ln);color:var(--tx)}' +
      '#xwp{position:fixed;inset:0;z-index:99999;display:none;align-items:center;justify-content:center;background:rgba(5,8,16,.82)}' +
      '#xwp .xpb{width:min(94vw,380px);max-height:96vh;display:grid;gap:8px;padding:12px;border-radius:16px;background:#151a2b;border:1px solid rgba(255,255,255,.18);color:#fff;font:700 14px system-ui,sans-serif;text-align:center}' +
      '#xwp canvas{width:100%;height:auto;border-radius:12px}#xwp .r{display:flex;gap:6px;align-items:center}#xwp .wn{flex:2}#xwp small{color:#aab;font-weight:600}' +
      '#xwp button{flex:1;padding:10px 6px;border:0;border-radius:10px;font:800 13px system-ui,sans-serif;background:#2a3350;color:#fff}' +
      '#xwp button.on{background:#4cc9f0;color:#111}#xwp button[data-a=buy]{background:linear-gradient(180deg,#ffc247,#ff9a1f);color:#111}#xwp button:disabled{opacity:.55}';
    document.head.appendChild(st); ov = document.createElement('div'); ov.id = 'xwp';
    ov.innerHTML = '<div class="xpb"><div class="t"></div><canvas width="560" height="300"></canvas><div class="r"><button data-a="pw">◀</button><span class="wn"></span><button data-a="nw">▶</button></div>' +
      '<div class="r lvr">' + [1, 2, 3, 4, 5].map(l => '<button data-l="' + l + '">Niv. ' + l + '</button>').join('') + '</div><small class="lvi"></small>' +
      '<div class="r"><button data-a="shot">💥 Tirer</button><button data-a="buy"></button></div><button data-a="close">Fermer</button></div>';
    document.body.appendChild(ov); pc = ov.querySelector('canvas');
    ov.onclick = e => { const a = e.target.dataset && e.target.dataset.a, l = e.target.dataset && e.target.dataset.l, n = W.length;
      if (e.target === ov || a == 'close') pclose();
      else if (a == 'pw' || a == 'nw') { pst.wi = (pst.wi + (a == 'nw' ? 1 : n - 1)) % n; pui(); }
      else if (a == 'shot') { pst.fl = performance.now() / 1000 + .12; try { MGSND.shot(me.x + 10, me.y + 19, pst.wi, true); } catch (x) {} }
      else if (a == 'buy' && pst.buy) { const b = pst.buy; pclose(); b(); }
      else if (l) { pst.lv = +l; pui(); } };
  }
  pst = { id, wi: 1, lv: id >= B && SK[id - B][2] == 'V' ? lvl(id) : 5, buy, price, miss, fl: 0 }; pui();
  ov.style.display = 'flex'; addEventListener('keydown', pkey, true); cancelAnimationFrame(praf); praf = requestAnimationFrame(pframe);
}
window.MGWS = { thumb, preview, skin, list: SK, base: B, draw, lvl, evo: () => evo, first: F };
})();
