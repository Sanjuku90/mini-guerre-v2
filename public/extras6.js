/* Mini Guerre v13 — menu pause compact + habillage des pages (boutique, profil, réglages, atelier, éditeur).
   La logique de la boutique est dans extras2.js (render) ; ici : le menu pause et le style commun. */
(() => {
'use strict';
const $ = id => document.getElementById(id);
const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; };

/* ---------- styles communs ---------- */
const css = `
:root{--p0:#0b1020;--p1:#121a33;--p2:#172040;--p3:#1f2b52;--ln:rgba(255,255,255,.1);--am:#ffb020;--ok:#3ddc97;--tx:#eef1fa;--mu:#9ba6c6}
/* --- menu pause --- */
#px{position:fixed;inset:0;z-index:9;display:none;align-items:center;justify-content:center;background:rgba(4,8,20,.72);backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px);padding:max(12px,env(safe-area-inset-top)) max(12px,env(safe-area-inset-right)) max(12px,env(safe-area-inset-bottom)) max(12px,env(safe-area-inset-left))}
#px .pxc{width:min(94vw,400px);max-height:96vh;overflow:auto;background:linear-gradient(165deg,#1a2548,#0d1329);border:1px solid var(--ln);border-radius:18px;box-shadow:0 24px 70px rgba(0,0,0,.6),inset 0 0 0 1px rgba(255,176,32,.16);padding:18px;display:grid;gap:12px;text-align:center}
#px h2{margin:0;font-size:30px;letter-spacing:6px;font-weight:900;color:var(--am);line-height:1}
#px .pxh small{display:block;font-size:11px;letter-spacing:1.4px;text-transform:uppercase;color:var(--mu);margin-top:6px;font-weight:700}
#px .pxs{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}
#px .pxs div{background:rgba(255,255,255,.06);border:1px solid var(--ln);border-radius:10px;padding:8px 4px;min-width:0}
#px .pxs b{display:block;font-size:16px;color:var(--tx);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#px .pxs span{font-size:10px;letter-spacing:1px;text-transform:uppercase;color:var(--mu)}
#px button{margin:0;width:100%;font-weight:800;border-radius:12px}
#px .pxr{padding:15px;font-size:17px;letter-spacing:1px;background:linear-gradient(180deg,#ffc247,#ff9a1f);box-shadow:0 4px 0 #b86a00,0 8px 18px rgba(0,0,0,.35)}
#px .pxr:active{transform:translateY(3px);box-shadow:0 1px 0 #b86a00}
#px .pxg{display:grid;grid-template-columns:1fr 1fr;gap:8px}
#px .pxg button{background:var(--p3);color:var(--tx);padding:12px 8px;font-size:13px;border:1px solid var(--ln);display:flex;flex-direction:column;align-items:center;gap:3px}
#px .pxg button i{font-style:normal;font-size:22px;line-height:1}
#px .pxg button.pxq.arm{background:#c0392b;border-color:#ff7b6b}
#px .pxn{font-size:12px;color:var(--mu);font-weight:600;margin:0}
#px .pxhelp{text-align:left;background:rgba(0,0,0,.25);border-radius:12px;padding:10px 12px;font-size:12px;display:grid;gap:4px;max-height:34vh;overflow:auto}
#px .pxhelp div{display:flex;justify-content:space-between;gap:10px;font-weight:600}#px .pxhelp b{color:var(--am);font-weight:800;white-space:nowrap}
/* --- réglages --- */
#m2>div{width:min(94vw,460px)!important;text-align:left!important;padding:0!important;border:1px solid var(--ln)!important;background:linear-gradient(165deg,#1a2548,#0d1329)!important;border-radius:18px!important;overflow:auto}
#m2 h1{position:sticky;top:0;z-index:2;margin:0!important;padding:16px 18px!important;font-size:20px!important;letter-spacing:3px;background:#141d3d;border-bottom:1px solid var(--ln)}
#m2 .rw{margin:8px 14px!important;padding:8px 12px;background:rgba(255,255,255,.05);border:1px solid var(--ln);border-radius:10px;font-size:13px}
#m2 .rw input[type=range]{accent-color:var(--am)}
#m2 .rw select,#m2 .rw button{background:var(--p3);color:var(--tx);border:1px solid var(--ln);border-radius:8px}
#m2 h3{margin:18px 18px 4px!important;font-size:11px!important;letter-spacing:1.6px;text-transform:uppercase;color:var(--mu)!important}
#m2 #kb{display:grid;gap:0}
#m2 #kr{width:calc(100% - 28px);margin:8px 14px}
#m2 p{margin:10px 18px!important;color:var(--mu)}
#m2 #so{position:sticky;bottom:0;width:100%;margin:10px 0 0;border-radius:0 0 16px 16px;padding:15px;font-weight:900;letter-spacing:1px;background:linear-gradient(180deg,#ffc247,#ff9a1f)}
/* --- profil / boutique --- */
#xs{background:radial-gradient(ellipse at 50% -10%,#1b2750,var(--p0) 60%)!important}
#xst{align-items:center;padding:10px 12px!important;background:rgba(10,15,34,.9)!important;border-bottom:1px solid var(--ln);gap:6px!important}
#xst button{padding:9px 14px!important;font-size:13px!important;border-radius:99px!important;background:transparent!important;color:var(--mu)!important;border:1px solid var(--ln)!important;margin:0;width:auto}
#xst button.on{background:var(--am)!important;color:#111!important;border-color:var(--am)!important}
#xst #xsx{margin-left:6px!important;color:var(--tx)!important}
#xcoin{margin-left:auto;font-weight:900;font-size:14px;color:#ffd27a;background:rgba(255,210,122,.12);border:1px solid rgba(255,210,122,.3);padding:7px 12px;border-radius:99px;white-space:nowrap}
#xsb{max-width:720px!important;padding:16px max(14px,env(safe-area-inset-left))!important}
.xhero{display:flex;gap:16px;align-items:center;background:linear-gradient(135deg,var(--p3),var(--p2));border:1px solid var(--ln);border-radius:18px;padding:16px}
.xbig{flex:0 0 auto;width:88px;height:88px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:48px;background:var(--p0);border:4px solid var(--am);box-shadow:0 0 24px rgba(255,176,32,.25)}
.xhi{min-width:0;flex:1}.xti{font-size:17px;font-weight:900}.xlv{font-size:13px;color:#ffd27a;margin:2px 0 8px}
.xbar{height:8px;border-radius:4px;background:rgba(255,255,255,.12);overflow:hidden}.xbar i{display:block;height:100%;background:linear-gradient(90deg,var(--am),#ff6b3d);border-radius:4px}
.xhi small{display:block;margin-top:4px;color:var(--mu);font-size:11px}
.xstat{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin:12px 0}
.xstat div{background:var(--p2);border:1px solid var(--ln);border-radius:12px;padding:10px 4px;text-align:center}
.xstat b{display:block;font-size:20px}.xstat span{font-size:10px;letter-spacing:1px;text-transform:uppercase;color:var(--mu)}
.xfs{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px}
.xf{display:grid;gap:4px;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:var(--mu)}
.xf input,.xf select{margin:0!important;width:100%;background:var(--p2)!important;color:var(--tx)!important;border:1px solid var(--ln)!important;border-radius:10px;padding:11px!important;text-align:left!important;text-transform:none;letter-spacing:0;font-size:14px}
.xcats{display:flex;gap:6px;overflow-x:auto;padding-bottom:8px;margin-bottom:6px}
.xcats button{flex:0 0 auto;margin:0;width:auto;padding:9px 14px;border-radius:99px;font-size:13px;background:var(--p2);color:var(--tx);border:1px solid var(--ln)}
.xcats button.on{background:var(--am);color:#111;border-color:var(--am)}
.xnote{margin:4px 0 10px;font-size:12px;color:var(--mu)}
.xgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px}
.xcard{background:var(--p2);border:1px solid var(--ln);border-radius:14px;padding:10px;display:grid;gap:8px;text-align:center;min-width:0}
.xcard.eq{border-color:var(--ok);box-shadow:0 0 0 1px var(--ok) inset}
.xpv{height:64px;display:flex;align-items:center;justify-content:center;background:var(--p0);border-radius:10px}
.xav{font-size:38px;line-height:1}.xsw{width:40px;height:40px;border-radius:50%;border:3px solid rgba(255,255,255,.7)}
.xtr{width:80%;height:14px;border-radius:7px}.xsk{width:80%;height:16px;border-radius:4px;background:#2a2d35;position:relative;overflow:hidden}.xsk i{position:absolute;left:0;right:0;top:6px;height:4px}
.xnm{font-size:13px;font-weight:800;min-height:2.4em;display:flex;align-items:center;justify-content:center;line-height:1.2}
.xcard button{margin:0;width:100%;padding:9px 4px;border-radius:10px;font-size:12px;font-weight:800}
.xcard button.buy{background:linear-gradient(180deg,#ffc247,#ff9a1f);color:#111}.xcard button.eqb{background:var(--p3);color:var(--tx)}.xcard button.ok{background:rgba(61,220,151,.18);color:var(--ok)}
.xcard button:disabled{opacity:.55}
.xrow{display:flex;align-items:center;gap:10px;background:var(--p2);border:1px solid var(--ln);border-radius:12px;padding:10px 12px;margin:8px 0}
.xrow .xa{font-size:26px}.xrow .xn{flex:1;min-width:0;font-weight:800;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.xrow .xn small{display:block;color:var(--mu);font-weight:600;font-size:11px}
.xrow button{margin:0;width:42px;height:38px;padding:0;border-radius:10px;font-size:16px;background:var(--p3);color:var(--tx)}
.xempty{text-align:center;color:var(--mu);padding:40px 10px}
/* --- atelier / éditeur --- */
#xw>div{background:linear-gradient(165deg,#1a2548,#0d1329)!important;border:1px solid var(--ln);border-radius:18px!important;padding:20px!important;gap:12px!important}
#xw select{background:var(--p2);color:var(--tx);border:1px solid var(--ln);border-radius:10px;padding:11px;margin-top:4px;width:100%}
#xw label{display:grid;gap:4px;font-size:12px;color:var(--mu)}
#xe .bar{background:rgba(10,15,34,.95)!important;border-bottom:1px solid var(--ln);padding:8px!important}
#xe .bar button{background:var(--p2)!important;color:var(--tx)!important;border:1px solid var(--ln);margin:0;width:auto;border-radius:99px!important}
#xe .bar button.on{background:var(--am)!important;color:#111!important}
`;
document.head.appendChild(el('style', '', '')).textContent = css;

/* ---------- menu pause ---------- */
const px = el('div'); px.id = 'px';
px.innerHTML = `<div class="pxc">
 <div class="pxh"><h2>PAUSE</h2><small id="pxmap"></small></div>
 <div class="pxs"><div><b id="pxk">0</b><span>Kills</span></div><div><b id="pxd">0</b><span>Morts</span></div><div><b id="pxw">-</b><span>Arme</span></div><div><b id="pxm">0</b><span>Bois</span></div></div>
 <button class="pxr" id="pxr">▶ REPRENDRE</button>
 <div class="pxg">
  <button id="pxs"><i>⚙️</i>Réglages</button>
  <button id="pxt"><i>🎮</i>Touches mobiles</button>
  <button id="pxh"><i>❓</i>Commandes</button>
  <button id="pxq" class="pxq"><i>🏠</i>Quitter la partie</button>
 </div>
 <div class="pxhelp" id="pxhelp" hidden></div>
 <p class="pxn" id="pxn"></p>
</div>`;
document.body.appendChild(px);

const PX = window.PX = { on: false };
let armT = 0;
function helpHtml() {
  const rows = [];
  try { for (const a of ACT) rows.push('<div><span>' + a[1] + '</span><b>' + lab(BD[a[0]], BL[a[0]]) + '</b></div>'); } catch (e) { }
  rows.push('<div><span>Tirer / lunette</span><b>Clic / clic droit</b></div><div><span>Changer d’arme</span><b>Molette</b></div>');
  return rows.join('');
}
PX.show = () => {
  if (!run) return;
  PX.on = true; px.style.display = 'flex';
  $('pxmap').textContent = MAPS[cur].e + ' ' + MAPS[cur].n + (room ? ' · en ligne' : ' · solo');
  $('pxk').textContent = me.k | 0; $('pxd').textContent = me.d | 0;
  $('pxw').textContent = W[me.wi].n; $('pxm').textContent = NB ? '-' : (me.mt | 0);
  const tc = document.body.classList.contains('t'); $('pxt').style.display = tc ? '' : 'none'; $('pxq').style.gridColumn = tc ? '' : '1 / -1';
  $('pxn').textContent = room ? 'La partie continue en ligne pendant la pause.' : 'Partie en pause.';
  $('pxhelp').hidden = true; resetQuit();
};
PX.hide = () => { PX.on = false; px.style.display = 'none'; resetQuit(); };
function resetQuit() { clearTimeout(armT); const q = $('pxq'); q.classList.remove('arm'); q.innerHTML = '<i>🏠</i>Quitter la partie'; }
$('pxr').onclick = () => PX.hide();
$('pxs').onclick = () => { PX.hide(); $('bp').onclick(); };
$('pxt').onclick = () => { PX.hide(); $('bt').onclick(); };
$('pxh').onclick = () => { const h = $('pxhelp'); h.hidden = !h.hidden; if (!h.hidden) h.innerHTML = helpHtml(); };
$('pxq').onclick = () => {
  const q = $('pxq');
  if (!q.classList.contains('arm')) { q.classList.add('arm'); q.innerHTML = '<i>⚠️</i>Confirmer : quitter ?'; armT = setTimeout(resetQuit, 3500); return; }
  try { leave(); } catch (e) { } location.reload();
};
px.addEventListener('pointerdown', e => { if (e.target === px) PX.hide(); });
})();
