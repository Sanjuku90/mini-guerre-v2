/* Mini Guerre v10 — interface mobile façon Mini Militia.
   Chargé après extras3.js. Ne change RIEN sur PC : tout s'active seulement quand le jeu est en mode tactile (body.t).
   - Barre du haut : PV (violet) + jetpack (bleu) + pause · chrono · arme + munitions (toucher = changer d'arme)
   - Gros stick gauche « Glisse pour bouger » et stick droit « Viser & tirer », boutons grenade / poing / zoom
   - Fil d'actions en rouge, minimap compacte en haut à droite, colonne chat / pings / joueurs / emotes
   - Boutons toujours déplaçables (Menu → réglages → disposition) */
(() => {
'use strict';
const $ = id => document.getElementById(id);
const LS = (k, v) => { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } };
const hook = (n, f) => { const o = window[n]; if (typeof o !== 'function') return; window[n] = function (...a) { return f.call(this, o, ...a); }; };
const el = (tag, attrs, html) => { const e = document.createElement(tag); Object.assign(e, attrs || {}); if (html != null) e.innerHTML = html; return e; };
const isT = () => document.body.classList.contains('t');
const T = { t: 0, hp: 0, hu: 0 };
window.T4 = { on: isT };

/* échelle de l'interface : suit la taille de l'écran (téléphone ≈ 1, tablette jusqu'à 1,45) */
const U = () => clamp(Math.min(Ht / 390, Wd / 760), .7, 1.45);

/* ================= Icônes (SVG) ================= */
const svg = (vb, inner) => `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
const ICON = {
  gren: svg('0 0 40 40', `<ellipse cx="19" cy="24" rx="11" ry="13" fill="#f2f2f2"/><path d="M11 19h16M10 25h18M11 31h16M15 12l-3 24M23 12l3 24" stroke="#9aa0a8" stroke-width="1.6" fill="none"/><rect x="15" y="8" width="8" height="5" rx="1.5" fill="#f2f2f2"/><path d="M25 8l7-3-1 5" stroke="#f2f2f2" stroke-width="2.4" fill="none" stroke-linecap="round"/>`),
  fist: svg('0 0 40 40', `<path fill="#f2f2f2" d="M12 15c0-2 1.5-3.5 3.5-3.5h13c3 0 5 2.2 5 5v6c0 6-4.500 10.500-10.500 10.500h-4C14.500 33 11 29.500 11 24.500z"/><path d="M18.500 12v8M24 12v8M29.500 13v7" stroke="#9aa0a8" stroke-width="1.8" stroke-linecap="round" fill="none"/><path d="M10 21c-2.500-.5-3.500-3-2-4.800 1.200-1.400 3.500-1.200 4.500.2z" fill="#f2f2f2"/>`),
  aim: svg('0 0 100 100', `<g fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"><circle cx="50" cy="50" r="24"/><path d="M50 8v16M50 76v16M8 50h16M76 50h16"/></g>`)
};
const dataUrl = s => 'url("data:image/svg+xml,' + encodeURIComponent(s) + '")';
const ARROWS = svg('0 0 100 100', `<g fill="#fff" fill-opacity=".85"><path d="M50 6l9 13H41z"/><path d="M50 94l9-13H41z"/><path d="M6 50l13-9v18z"/><path d="M94 50l-13-9v18z"/></g>`);

/* ================= Styles ================= */
document.head.appendChild(el('style', {}, `
body.t{--u:1}
body.t .k{background:rgba(255,255,255,.16);border:calc(3px*var(--u)) solid rgba(255,255,255,.72);box-shadow:0 0 0 1px rgba(0,0,0,.25),inset 0 0 14px rgba(255,255,255,.12);color:#fff;text-shadow:0 1px 3px rgba(0,0,0,.6);font-size:calc(20px*var(--u));overflow:visible}
body.t .k svg{width:62%;height:62%;pointer-events:none;filter:drop-shadow(0 1px 2px rgba(0,0,0,.5))}
body.t .k::after{content:'';position:absolute;inset:0;border-radius:50%;background:conic-gradient(rgba(0,0,0,.58) var(--cd,0%),transparent 0);pointer-events:none}
body.t .k.off{opacity:.4}
body.t #kW,body.e #kW{display:none!important}
body.t #kL{background:radial-gradient(circle,rgba(150,170,215,.18),rgba(90,110,160,.36))}
body.t #kL::before{content:'';position:absolute;inset:7%;background:${dataUrl(ARROWS)} center/100% no-repeat;pointer-events:none}
body.t #kR{background:radial-gradient(circle,rgba(225,95,95,.2),rgba(190,60,60,.4))}
body.t #kR.on{background:radial-gradient(circle,rgba(255,120,120,.38),rgba(225,60,60,.55))}
body.t #kL::after,body.t #kR::after{display:none}
body.t #kL i,body.t #kR i{left:29%;top:29%;width:42%;height:42%;background:rgba(255,255,255,.2);border:calc(3px*var(--u)) solid rgba(255,255,255,.82);box-shadow:0 2px 8px rgba(0,0,0,.3)}
body.t #kR i{background:${dataUrl(ICON.aim)} center/78% no-repeat,rgba(255,255,255,.18)}
body.t #kG .n{position:absolute;right:11%;top:50%;transform:translateY(-50%);font:900 calc(15px*var(--u)) ui-monospace,Menlo,monospace;color:#fff;text-shadow:0 1px 3px #000}
body.t #kG svg{width:54%;height:54%;margin-left:-16%}
body.t #kZ.on{background:rgba(255,196,60,.42)}
body.t #pb{right:auto;left:var(--pbx,0);top:var(--pby,0);width:calc(34px*var(--u));height:calc(34px*var(--u));padding:0;margin:0;background:rgba(255,255,255,.2);border:calc(2.5px*var(--u)) solid rgba(255,255,255,.88);color:#fff;font:900 calc(14px*var(--u))/1 system-ui,sans-serif;letter-spacing:-1px;display:flex;align-items:center;justify-content:center}
body.t #cb,#x4e{position:fixed;right:8px;width:calc(34px*var(--u));height:calc(34px*var(--u));padding:0;margin:0;border-radius:50%;background:rgba(255,255,255,.2);border:calc(2px*var(--u)) solid rgba(255,255,255,.7);color:#fff;font-size:calc(16px*var(--u));z-index:6;align-items:center;justify-content:center}
body.t #cb{top:calc(var(--colt,80px) + 38px*var(--u));display:flex}
#x4e{top:var(--colt,80px);z-index:40;display:none}
body:not(.t) #x4e{display:none!important}
body.t #qc{right:calc(8px + 40px*var(--u));top:calc(var(--colt,80px) + 38px*var(--u))}
body.t #xtb{left:auto;right:8px;top:calc(var(--colt,80px) + 76px*var(--u));gap:calc(4px*var(--u))}
body.t #xtb button,body.t #xem button{width:calc(34px*var(--u));height:calc(34px*var(--u));font-size:calc(16px*var(--u));background:rgba(255,255,255,.2);border:calc(2px*var(--u)) solid rgba(255,255,255,.7)}
body.t #xem{left:auto;right:calc(8px + 40px*var(--u));top:var(--colt,80px);flex-direction:row;gap:calc(4px*var(--u));display:none!important}
body.t.x4o #xem{display:flex!important}
body.t #xair{right:auto;left:50%;transform:translateX(-50%);bottom:8px}
#x4w{position:fixed;z-index:7;display:none;touch-action:none;background:transparent}
.h4{position:fixed;z-index:7;display:none;pointer-events:none;transform:translate(-50%,-100%);background:rgba(18,22,18,.84);color:#fff;font:700 calc(17px*var(--u))/1.15 system-ui,sans-serif;padding:calc(9px*var(--u)) calc(16px*var(--u));border-radius:4px;white-space:nowrap}
.h4::after{content:'';position:absolute;left:calc(50% - 9px);top:100%;border:9px solid transparent;border-top-color:rgba(18,22,18,.84)}
body.t.h4on .h4{display:block}
`));

/* ================= Disposition par défaut (comme la capture) ================= */
const NEW = { L: [.165, .745, 1], R: [.845, .745, 1], G: [.30, .865, 1], P: [.70, .865, 1], Z: [.075, .155, 1], D: [.30, .645, 1],
  A: [.385, .835, 1], X: [.70, .645, 1], B: [.615, .835, 1], M: [.615, .655, 1], W: [.5, .5, 1] };
const SZ = { L: 116, R: 116, G: 52, P: 52, Z: 54, D: 44, X: 44, A: 44, B: 44, M: 38, W: 44 };
Object.assign(BS, SZ);
for (const k in NEW) DEF[k] = NEW[k].slice();
{ // une seule fois : on remplace l'ancienne disposition sauvegardée ; ensuite celle du joueur est respectée
  let saved = null; try { saved = JSON.parse(localStorage.getItem('mmL')); } catch (e) {}
  if (LS('mg10ui') !== '1' || !saved || !saved.L) {
    lay = JSON.parse(JSON.stringify(DEF));
    try { localStorage.removeItem('mmL'); } catch (e) {}
    LS('mg10ui', '1');
  }
}
LB.G = ICON.gren; LB.P = ICON.fist; LB.Z = ICON.aim; LB.D = '💨'; LB.X = '↻';

/* contenu des boutons */
{
  const set = (k, h) => { const e = $('k' + k); if (e) e.innerHTML = h; };
  set('G', ICON.gren + '<b class="n">3</b>'); set('P', ICON.fist); set('Z', ICON.aim);
  set('D', '💨'); set('X', '<span style="font-weight:900;font-size:1.25em">↻</span>'); set('B', '🧱'); set('M', '⇄');
  $('pb').textContent = 'II';
}

/* taille des boutons proportionnelle à l'écran (remplace place() d'origine) */
window.place = function () {
  const u = U();
  document.body.style.setProperty('--u', u.toFixed(3));
  for (const k in DEF) {
    const e = $('k' + k); if (!e) continue;
    e.style.left = lay[k][0] * 100 + '%'; e.style.top = lay[k][1] * 100 + '%';
    e.style.width = e.style.height = BS[k] * lay[k][2] * u + 'px';
  }
  layoutDom();
};

/* ================= Géométrie du HUD (partagée entre canvas et boutons DOM) ================= */
function geo() {
  const u = U(), cx = Wd / 2, bh = 46 * u, tw = 76 * u, bw = 178 * u, ww = 178 * u, y = 6 * u;
  const mmW = 104 * u, k = Math.min(mmW / WW, 62 * u / WH), mw = WW * k, mh = WH * k;
  return { u, cx, bh, bw, ww, y, tw, bx: cx - tw / 2 - 6 * u - bw, wx: cx + tw / 2 + 6 * u,
    mmX: Wd - 8 - mw, mmW: mw, mmH: mh, k, colt: y + Math.max(mh, 36 * u) + 16 * u, mody: y + bh + 6 * u };
}
function layoutDom() {
  if (!Wd || !Ht || typeof WW === 'undefined') return;
  const G = geo(), s = document.body.style;
  s.setProperty('--pbx', (G.bx + G.bw - 38 * G.u) + 'px'); s.setProperty('--pby', (G.y + 6 * G.u) + 'px'); s.setProperty('--colt', G.colt + 'px');
  const w = $('x4w'); if (w) { w.style.left = G.wx + 'px'; w.style.top = G.y + 'px'; w.style.width = G.ww + 'px'; w.style.height = G.bh + 'px'; }
  for (const [id, k] of [['h4l', 'L'], ['h4r', 'R']]) {
    const h = $(id); if (!h) continue;
    h.style.left = lay[k][0] * Wd + 'px'; h.style.top = (lay[k][1] * Ht - BS[k] * lay[k][2] * G.u / 2 - 10 * G.u) + 'px';
  }
}

/* ================= Éléments DOM ajoutés ================= */
const sw = el('div', { id: 'x4w' });
sw.addEventListener('pointerdown', e => { e.preventDefault(); if (run && LD <= 0 && me.al && !busy()) swap(me); });
document.body.appendChild(sw);
const em = el('button', { id: 'x4e', textContent: '😀' });
em.onclick = () => document.body.classList.toggle('x4o');
document.body.appendChild(em);
const xem = $('xem'); if (xem) xem.addEventListener('click', () => setTimeout(() => document.body.classList.remove('x4o'), 60));
document.body.append(el('div', { id: 'h4l', className: 'h4', textContent: 'Glisse pour bouger' }), el('div', { id: 'h4r', className: 'h4', textContent: 'Viser & tirer' }));
for (const k of ['L', 'R']) $('k' + k).addEventListener('pointerdown', () => { document.body.classList.remove('h4on'); T.hu = 0; });

/* ================= Dessin du HUD ================= */
function bev(x, y, w, h, c, side, u) {
  const r = 9 * u; g.beginPath();
  if (side === 'r') { g.moveTo(x + r, y); g.lineTo(x + w, y); g.lineTo(x + w, y + h - c); g.lineTo(x + w - c, y + h); g.lineTo(x + r, y + h); g.arcTo(x, y + h, x, y + h - r, r); g.lineTo(x, y + r); g.arcTo(x, y, x + r, y, r); }
  else { g.moveTo(x, y); g.lineTo(x + w - r, y); g.arcTo(x + w, y, x + w, y + r, r); g.lineTo(x + w, y + h - r); g.arcTo(x + w, y + h, x + w - r, y + h, r); g.lineTo(x + c, y + h); g.lineTo(x, y + h - c); }
  g.closePath(); g.fillStyle = 'rgba(26,32,44,.58)'; g.fill();
  g.lineWidth = Math.max(2, 2.4 * u); g.strokeStyle = 'rgba(238,242,248,.92)'; g.lineJoin = 'round'; g.stroke();
}
function bar(x, y, w, h, v, c1, c2, u) {
  v = clamp(v, 0, 1); rr(x, y, w, h, h / 2); g.fillStyle = 'rgba(0,0,0,.55)'; g.fill();
  if (v > .01) { const gd = g.createLinearGradient(0, y, 0, y + h); gd.addColorStop(0, c1); gd.addColorStop(1, c2); rr(x, y, Math.max(h, w * v), h, h / 2); g.fillStyle = gd; g.fill(); }
  rr(x, y, w, h, h / 2); g.lineWidth = Math.max(1, 1.4 * u); g.strokeStyle = 'rgba(255,255,255,.6)'; g.stroke();
}
function heart(x, y, s) { g.save(); g.translate(x, y); g.scale(s, s); g.beginPath(); g.moveTo(0, .9); g.bezierCurveTo(-1.7, -.1, -.9, -1.3, 0, -.45); g.bezierCurveTo(.9, -1.3, 1.7, -.1, 0, .9); g.fillStyle = '#fff'; g.fill(); g.restore(); }
function jetIc(x, y, s) { g.save(); g.translate(x, y); g.scale(s, s); g.beginPath(); g.moveTo(0, -1); g.lineTo(.85, .1); g.lineTo(.32, .1); g.lineTo(.32, 1); g.lineTo(-.32, 1); g.lineTo(-.32, .1); g.lineTo(-.85, .1); g.closePath(); g.fillStyle = '#fff'; g.fill(); g.restore(); }
function otxt(t, x, y, font, col, al, u) { g.font = font; g.textAlign = al || 'left'; g.lineJoin = 'round'; g.lineWidth = 3.5 * u; g.strokeStyle = 'rgba(0,0,0,.85)'; g.strokeText(t, x, y); g.fillStyle = col; g.fillText(t, x, y); }
const pad3 = n => String(Math.max(0, n | 0)).padStart(3, '0');
const mmss = s => { s = Math.max(0, s | 0); return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); };
const SANS = 'system-ui,-apple-system,sans-serif', MONO = 'ui-monospace,Menlo,"Courier New",monospace';

function draw4() {
  const G = geo(), u = G.u; g.save(); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.textBaseline = 'alphabetic';
  const w = W[me.wi], hp = me.al ? me.hp : 0;
  /* --- PV + jetpack + pause --- */
  bev(G.bx, G.y, G.bw, G.bh, 10 * u, 'r', u);
  const bx = G.bx + 30 * u, bw = G.bw - 78 * u, low = me.al && hp / me.mh < .3, flash = low && (time * 5 | 0) % 2;
  heart(G.bx + 15 * u, G.y + 15 * u, 8.5 * u); jetIc(G.bx + 15 * u, G.y + 32 * u, 8 * u);
  bar(bx, G.y + 8 * u, bw, 14 * u, hp / me.mh, flash ? '#ff6b6b' : '#c740e6', flash ? '#d62828' : '#8a1fb4', u);
  bar(bx, G.y + 27 * u, bw, 11 * u, me.fuel / 100, '#4a5cff', '#1b25d8', u);
  if (me.sh > 0) { rr(bx - 2, G.y + 6 * u, bw + 4, 18 * u, 9 * u); g.strokeStyle = 'rgba(76,201,240,.95)'; g.lineWidth = 2 * u; g.stroke(); }
  g.font = `800 ${10 * u}px ${SANS}`; g.textAlign = 'left'; g.fillStyle = '#fff'; g.fillText(Math.max(0, hp | 0), bx + 7 * u, G.y + 19 * u);
  /* --- chrono --- */
  otxt(mmss(T.t), G.cx, G.y + 27 * u, `900 ${21 * u}px ${MONO}`, '#fff', 'center', u);
  /* --- arme + munitions --- */
  bev(G.wx, G.y, G.ww, G.bh, 10 * u, 'l', u);
  g.save(); g.translate(G.wx + 58 * u, G.y + 17 * u); g.scale(1.25 * u, 1.25 * u); g.translate(-15, 0); gun(g, me.wi, 0, 0); g.restore();
  const am = me.am[me.wi] | 0;
  if (me.rl > 0) {
    bar(G.wx + 12 * u, G.y + G.bh - 16 * u, 100 * u, 7 * u, 1 - me.rl / w.rl, '#ffd27a', '#ffb020', u);
  } else {
    g.font = `800 ${14 * u}px ${MONO}`; g.textAlign = 'left'; g.fillStyle = am <= Math.ceil(w.mag * .2) ? '#ff6b6b' : '#fff'; g.fillText(pad3(am), G.wx + 12 * u, G.y + G.bh - 7 * u);
    g.textAlign = 'right'; g.fillStyle = 'rgba(255,255,255,.55)'; g.fillText(pad3(w.mag), G.wx + 112 * u, G.y + G.bh - 7 * u);
  }
  { // cercle « arme suivante » (toucher le panneau = changer d'arme)
    const rx = G.wx + G.ww - 21 * u, ry = G.y + G.bh / 2 + 1 * u; let n = me.wi, k = 0; do { n = (n + 1) % W.length; k++; } while (!me.has[n] && k < W.length);
    g.beginPath(); g.arc(rx, ry, 16 * u, 0, 7); g.fillStyle = 'rgba(255,255,255,.12)'; g.fill(); g.lineWidth = 2 * u; g.strokeStyle = 'rgba(255,255,255,.75)'; g.stroke();
    if (n !== me.wi) { g.save(); g.translate(rx, ry + 1 * u); g.scale(.52 * u, .52 * u); g.translate(-15, 0); gun(g, n, 0, 0); g.restore(); }
    else { g.font = `800 ${13 * u}px ${SANS}`; g.textAlign = 'center'; g.fillStyle = 'rgba(255,255,255,.5)'; g.fillText('–', rx, ry + 5 * u); }
  }
  /* --- kills / morts --- */
  otxt(`⚔ ${me.k | 0}   ☠ ${me.d | 0}`, G.bx + 6 * u, G.y + G.bh + 17 * u, `800 ${13 * u}px ${SANS}`, '#fff', 'left', u);
  /* --- fil d'actions en rouge --- */
  const L = fd.slice(-4), y0 = G.y + G.bh + 42 * u, fnt = `italic 900 ${15 * u}px ${SANS}`; g.font = fnt;
  L.forEach((f, i) => {
    const y = y0 + i * 19 * u; g.globalAlpha = clamp((f.e - time) * 1.5, 0, 1); g.font = fnt; g.textAlign = 'left';
    const p = String(f.t).split(' ➜ ');
    if (p.length === 2) {
      const mid = '  a tué  ', wa = g.measureText(p[0]).width, wm = g.measureText(mid).width, wb = g.measureText(p[1]).width, x = G.cx - (wa + wm + wb) / 2;
      const mine = p[0] === me.n, dead = p[1] === me.n;
      otxt(p[0], x, y, fnt, mine ? '#ffd23f' : '#ff3030', 'left', u); otxt(mid, x + wa, y, fnt, '#ff3030', 'left', u); otxt(p[1], x + wa + wm, y, fnt, dead ? '#ff9a9a' : '#fff', 'left', u);
    } else otxt(String(f.t), G.cx, y, fnt, '#ff3030', 'center', u);
  });
  g.globalAlpha = 1;
  /* --- minimap compacte --- */
  { const x0 = G.mmX, y0m = G.y, k = G.k, mw = G.mmW, mh = G.mmH;
    rr(x0 - 3, y0m - 3, mw + 6, mh + 6, 7); g.fillStyle = 'rgba(26,32,44,.6)'; g.fill(); g.strokeStyle = 'rgba(238,242,248,.85)'; g.lineWidth = 2; g.stroke();
    g.save(); rr(x0, y0m, mw, mh, 5); g.clip(); g.fillStyle = 'rgba(4,8,20,.55)'; g.fillRect(x0, y0m, mw, mh); g.fillStyle = TH_[8]; g.globalAlpha = .85;
    for (const r of BASE) g.fillRect(x0 + r.x * k, y0m + r.y * k, Math.max(1.5, r.w * k), Math.max(1.5, r.h * k));
    g.globalAlpha = 1; g.strokeStyle = 'rgba(255,255,255,.4)'; g.lineWidth = 1; g.strokeRect(x0 + camL * k, y0m + camT * k, Wd / sc * k, Ht / sc * k);
    const dot = (e, c, r) => { g.fillStyle = c; g.strokeStyle = '#000'; g.lineWidth = .8; g.beginPath(); g.arc(x0 + (e.x + 10) * k, y0m + (e.y + 19) * k, r, 0, 7); g.fill(); g.stroke(); };
    for (const e of (room ? Object.values(RV) : bots)) { if (!e.al) continue; if (room && me.team && e.team === me.team) dot(e, TC[me.team], 2.6); else if (me.dr > 0 || Math.hypot(e.x - me.x, e.y - me.y) < 1100) dot(e, '#ff4d4d', 2.6); }
    if (me.al) dot(me, '#fff', 3); g.restore();
    if (ST.fps) { g.font = `600 ${10 * u}px ${SANS}`; g.textAlign = 'right'; g.fillStyle = 'rgba(255,255,255,.8)'; g.fillText('FPS ' + (fps | 0) + (room && room.ping ? ' · ' + room.ping + ' ms' : ''), Wd - 8, y0m + mh + 14 * u); }
  }
  g.restore();
}

/* ================= Branchements sur le jeu ================= */
hook('hud', function (o) {
  if (!isT() || !run) return o.call(this);
  const G = geo(), op = window.pill;
  window.pill = function (x, y, t, c, h) {
    if (x === Wd / 2 && y === 34) y = G.mody;                       // pastille de mode : sous la barre du haut
    else if (x === 72 && y === 122) { x = lay.Z[0] * Wd; y = lay.Z[1] * Ht + BS.Z * lay.Z[2] * G.u / 2 + 8 * G.u; } // pièces/niveau : sous le bouton zoom
    return op(x, y, t, c, h);
  };
  try { o.call(this); } finally { window.pill = op; }
  if (!endRes) draw4();
});
hook('begin', function (o, ...a) { T.t = 0; if (isT() && (+LS('mg4tip') || 0) < 3) { LS('mg4tip', (+LS('mg4tip') || 0) + 1); T.hp = 1; } return o.apply(this, a); });
hook('newMatch', function (o, ...a) { T.t = 0; return o.apply(this, a); });

let ukey = '';
const cdSet = (id, v) => { const e = $(id); if (!e) return; const s = Math.round(clamp(v, 0, 1) * 100) + '%'; if (e._cd !== s) { e._cd = s; e.style.setProperty('--cd', s); } };
const cls = (id, c, v) => { const e = $(id); if (e) e.classList.toggle(c, !!v); };
hook('update', function (o, dt) {
  o(dt);
  const t = isT(), on = t && run && LD <= 0, ed = document.body.classList.contains('e');
  if (run && LD <= 0 && endT <= 0 && !busy()) T.t += dt;
  const key = Wd + 'x' + Ht + (typeof WW !== 'undefined' ? WW + WH : ''); if (key !== ukey) { ukey = key; window.place(); }
  $('x4e').style.display = on ? 'flex' : 'none';
  $('x4w').style.display = on && !endRes ? 'block' : 'none';
  if (!on) document.body.classList.remove('x4o');
  if (T.hp && on) { T.hp = 0; document.body.classList.add('h4on'); T.hu = time + 8; }
  if (T.hu && time > T.hu) { T.hu = 0; document.body.classList.remove('h4on'); }
  if (!t || !run) return;
  const c = CL[me.cl | 0] || CL[0], w = W[me.wi];
  cls('kR', 'on', tin.fire);
  cdSet('kD', me.dc > 0 ? me.dc / 1.6 : 0); cdSet('kA', c.ab && me.ac > 0 ? me.ac / c.cd : 0); cdSet('kX', me.rl > 0 ? me.rl / w.rl : 0);
  cls('kZ', 'on', me.zm); cls('kZ', 'off', !w.z);
  const gn = $('kG').querySelector('.n'), gv = String(me.gc | 0); if (gn && gn.textContent !== gv) gn.textContent = gv; cls('kG', 'off', me.gc < 1);
  $('kA').style.visibility = (c.ab || ed) ? '' : 'hidden';
  for (const k of ['B', 'M', 'P']) $('k' + k).style.visibility = (NB && !ed) ? 'hidden' : '';
});

window.place();
})();
