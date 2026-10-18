/* Mini Guerre v9 — tutoriel interactif + PWA complète (installation, hors-ligne, mises à jour).
   Chargé après extras2.js. Aucune donnée n'est envoyée nulle part : tout reste sur l'appareil. */
(() => {
'use strict';
const $ = id => document.getElementById(id);
const LS = (k, v) => { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } };
const hook = (n, f) => { const o = window[n]; if (typeof o !== 'function') return; window[n] = function (...a) { return f.call(this, o, ...a); }; };
const el = (tag, attrs, html) => { const e = document.createElement(tag); Object.assign(e, attrs || {}); if (html != null) e.innerHTML = html; return e; };
const beep = (f, d, v) => { try { snd(f, d, v || .05, 'triangle'); } catch (e) {} };

/* ================= Styles ================= */
document.head.appendChild(el('style', {}, `
#t3card{position:fixed;top:calc(64px + env(safe-area-inset-top));left:50%;transform:translateX(-50%);width:min(92vw,440px);z-index:8;display:none;
 background:rgba(11,16,32,.93);border:2px solid var(--ac);border-radius:14px;padding:10px 12px;text-align:left;pointer-events:none;
 box-shadow:0 8px 30px rgba(0,0,0,.5);transition:border-color .2s,box-shadow .2s}
#t3card.ok{border-color:#3ddc84;box-shadow:0 0 0 3px rgba(61,220,132,.35),0 8px 30px rgba(0,0,0,.5)}
#t3card .xh{display:flex;gap:8px;align-items:baseline;flex-wrap:wrap}#t3card .xh b{color:var(--ac);font-size:12px;letter-spacing:.5px;text-transform:uppercase}
#t3card .xh span{font-size:16px;font-weight:800}#t3card p{margin:6px 0 8px;font-size:13px;line-height:1.35;font-weight:600}
#t3card kbd{background:#2b3a67;border:1px solid #4a5d99;border-bottom-width:2px;border-radius:5px;padding:0 6px;font:inherit;font-weight:800;white-space:nowrap}
#t3card .xbar{height:6px;background:rgba(255,255,255,.14);border-radius:4px;overflow:hidden}#t3card .xbar i{display:block;height:100%;width:0;background:linear-gradient(90deg,#ffb020,#3ddc84);transition:width .35s}
#t3card .xbt{display:flex;gap:6px;margin-top:8px;justify-content:flex-end;flex-wrap:wrap}
#t3card .xbt button{pointer-events:auto;width:auto;margin:0;padding:6px 10px;font-size:12px;border-radius:8px}
#t3card .xbt button.go{background:var(--ac);color:#111}
@media (max-height:480px){#t3card{top:calc(54px + env(safe-area-inset-top));padding:7px 10px}#t3card p{font-size:12px;margin:4px 0 6px}#t3card .xh span{font-size:14px}}
#t3wel{position:fixed;inset:0;z-index:10;display:none;align-items:center;justify-content:center;background:rgba(3,6,16,.75);padding:12px}
#t3wel>div{width:min(92vw,380px);background:var(--pn);border:2px solid var(--ac);border-radius:16px;padding:18px;text-align:center}
#t3wel h2{margin:0 0 6px;color:var(--ac);font-size:22px}#t3wel p{margin:0 0 10px;font-size:14px;line-height:1.4}
#t3pill{position:fixed;left:50%;bottom:calc(10px + env(safe-area-inset-bottom));transform:translateX(-50%);z-index:11;display:none;pointer-events:none;
 background:rgba(11,16,32,.92);border:1px solid #4a5d99;border-radius:20px;padding:6px 14px;font-size:13px;white-space:nowrap}
#t3upd{position:fixed;left:50%;bottom:calc(46px + env(safe-area-inset-bottom));transform:translateX(-50%);z-index:12;display:none;align-items:center;gap:8px;
 background:rgba(11,16,32,.96);border:2px solid var(--ac);border-radius:14px;padding:8px 10px;font-size:13px}
#t3upd button{width:auto;margin:0;padding:6px 12px;font-size:13px;border-radius:8px}
#t3tuto,#t3inst{margin:4px 0}
`));

/* ================= Tutoriel ================= */
const T = { on: 0, i: -1, s: {}, dummy: null, lock: 0, starting: 0, sv: null };
const touch = () => matchMedia('(pointer:coarse)').matches || document.body.classList.contains('t');
const kn = id => { try { return (typeof lab === 'function' ? lab(BD[id], BL[id]) : (BL[id] || BD[id])) || '?'; } catch (e) { return '?'; } };
const K_ = s => '<kbd>' + s + '</kbd>';
const tx = (d, m) => touch() ? m : d;

const STEPS = [
  { t: 'Se déplacer', d: () => tx(`Appuie sur ${K_(kn('L'))} / ${K_(kn('R'))} (ou ← →) pour marcher.`, 'Pousse le <b>joystick gauche</b> vers la gauche ou la droite.'),
    init: s => { s.x0 = me.x; }, ok: s => Math.abs(me.x - s.x0) > 160 },
  { t: 'Voler avec le jetpack', d: () => tx(`Maintiens ${K_(kn('J'))} ou ${K_('Espace')} pour voler. Le carburant (barre bleue) se vide en vol et se recharge au sol.`,
      'Pousse le <b>joystick gauche vers le haut</b> pour voler. Le carburant (barre bleue) se recharge au sol.'),
    init: s => { s.y0 = me.y; }, ok: s => me.y < s.y0 - 100 || me.fuel < 60 },
  { t: 'Foncer (dash)', d: () => tx(`Appuie sur ${K_(kn('D'))} pour foncer d'un coup dans ta direction (recharge 1,6 s).`, 'Appuie sur le bouton <b>💨</b>.'),
    init: () => {}, ok: () => me.dash > 0 },
  { t: 'Viser et tirer', d: () => tx('Vise avec la <b>souris</b> et fais un <b>clic gauche</b> pour tirer. Tire quelques balles.',
      'Pousse le <b>joystick droit</b> dans la direction voulue : tu tires tout seul. Tire quelques balles.'),
    init: s => { s.a0 = me.am[me.wi]; }, ok: s => me.am[me.wi] <= s.a0 - 3 },
  { t: 'Recharger', d: () => tx(`Appuie sur ${K_(kn('RL'))} pour recharger ton arme.`, 'Appuie sur le bouton <b>↻</b>.'),
    init: () => {}, ok: () => me.rl > 0 },
  { t: 'Changer d\'arme', d: () => tx(`Appuie sur ${K_(kn('F'))} ou utilise la <b>molette</b> de la souris.`, 'Appuie sur le bouton <b>🔄</b>.'),
    init: s => { s.w0 = me.wi; }, ok: s => me.wi !== s.w0 },
  { t: 'Éliminer le mannequin', d: () => {
      const b = T.dummy; let h = '';
      if (b) { const dx = b.x - me.x, dy = b.y - me.y; h = ` Il est ${Math.abs(dx) > 60 ? (dx > 0 ? '➡️ à droite' : '⬅️ à gauche') : ''}${dy < -120 ? ' ⬆️ plus haut' : dy > 120 ? ' ⬇️ plus bas' : ''} (≈ ${Math.round(Math.hypot(dx, dy) / 10)} m).`; }
      return 'Un mannequin immobile t\'attend : élimine-le ! Viser la <b>tête</b> fait ×1,5 de dégâts.' + h; },
    dyn: 1, init: s => { s.k0 = me.k; placeDummy(); }, ok: s => me.k > s.k0 },
  { t: 'Lancer une grenade', d: () => tx(`Vise puis appuie sur ${K_(kn('G'))} : la grenade explose après ~2 s. Tu en as 3 par vie.`, 'Vise avec le joystick droit puis appuie sur le bouton <b>💣</b>.'),
    init: s => { s.g0 = me.gc; }, ok: s => me.gc < s.g0 },
  { t: 'Construire', d: () => tx(`Vise un peu vers le haut (endroit dégagé) puis appuie sur ${K_(kn('E'))} pour poser un mur (coûte du bois 🪵, voir le HUD). ${K_(kn('C'))} change le type de construction.`,
      'Vise un peu vers le haut (joystick droit) puis appuie sur <b>🧱</b> pour construire (coûte du bois 🪵). Un autre bouton change le type.'),
    init: s => { s.m0 = me.mt; }, ok: s => me.mt < s.m0 }
];

function placeDummy() {
  const b = mk('b1', 'Mannequin', '#9aa7c7', 1); b.cl = 0; spawn(b);
  let best = null, bd = 1e9;
  for (const s of SP) { const d = Math.hypot(s[0] - (me.x + 10), s[1] - (me.y + 38)); if (d > 260 && d < bd) { bd = d; best = s; } }
  if (best) { b.x = best[0] - 10; b.y = best[1] - 38; b.vx = b.vy = 0; }
  b.wi = 0; bots = [b]; T.dummy = b;
}
// Le mannequin ne bouge pas et ne tire jamais.
hook('aiIn', (o, b, dt) => (T.on && T.dummy && b === T.dummy) ? { mx: 0, jet: (b.y > WH - 300 && b.vy > 0) ? 1 : 0, a: b.a, fire: 0 } : o(b, dt));
// Si le joueur lance une autre partie pendant le tutoriel, on l'arrête proprement.
hook('begin', (o, ...a) => { if (T.on && !T.starting) endTuto(false); return o(...a); });

const card = el('div', { id: 't3card' }, '<div class="xh"><b id="t3n"></b><span id="t3t"></span></div><p id="t3d"></p><div class="xbar"><i id="t3bar"></i></div><div class="xbt" id="t3x"></div>');
document.body.appendChild(card);

function btns(list) {
  const box = $('t3x'); box.innerHTML = '';
  list.forEach(([label, cls, fn]) => { const b = el('button', { className: cls || 's', type: 'button' }, label); b.onclick = fn; box.appendChild(b); });
}
function showStep() {
  const st = STEPS[T.i]; if (!st) return;
  card.classList.remove('ok'); T.s = {}; st.init(T.s);
  $('t3n').textContent = 'Étape ' + (T.i + 1) + '/' + STEPS.length; $('t3t').textContent = st.t;
  $('t3d').innerHTML = st.d(); $('t3bar').style.width = (T.i / STEPS.length * 100) + '%';
  btns([['Passer l\'étape ⏭', 's', () => advance(true)], ['Quitter', 's', () => endTuto(true)]]);
  card.style.display = 'block'; T.lock = 0;
}
function advance(skipped) {
  if (T.lock || !T.on) return; T.lock = 1;
  if (!skipped) { card.classList.add('ok'); beep(660, .12); setTimeout(() => beep(880, .15), 110); }
  setTimeout(() => { if (!T.on) return; T.i++; if (T.i >= STEPS.length) finish(); else showStep(); }, skipped ? 0 : 750);
}
function finish() {
  LS('mgTuto', 'done'); T.lock = 1; T.dummy = null; bots = [];
  card.classList.add('ok'); beep(523, .15); setTimeout(() => beep(659, .15), 150); setTimeout(() => beep(784, .25), 300);
  $('t3n').textContent = 'Terminé ✔'; $('t3t').textContent = 'Bravo, tu sais jouer !'; $('t3bar').style.width = '100%';
  $('t3d').innerHTML = 'Ramasse les <b>power-ups</b> (❤️ 🛡️ 💥 ⚡ 🔫), choisis ta <b>classe</b> et ton <b>mode</b> dans le menu, puis lance-toi contre des bots ou invite des amis avec un code de salle.';
  btns([['Menu', 's', () => endTuto(true)], ['🤖 Jouer contre des bots', 'go', () => { endTuto(false); $('bs').click(); }]]);
}
function restoreMenu() {
  const v = T.sv; if (!v) return;
  for (const k of ['cl', 'df', 'lm', 'gm', 'mp']) { const e = $(k); if (e && v[k] != null) e.value = v[k]; }
  for (const k of ['mmC', 'mmD']) { if (v[k] == null) { try { localStorage.removeItem(k); } catch (e) {} } else LS(k, v[k]); }
  T.sv = null;
}
function endTuto(toMenu) {
  const was = T.on; T.on = 0; T.dummy = null; T.i = -1; card.style.display = 'none'; card.classList.remove('ok');
  restoreMenu();
  if (was && toMenu) { run = 0; bots = []; menu(1); }
}
function startTuto() {
  if (T.on) return;
  T.sv = { mmC: LS('mmC'), mmD: LS('mmD') };
  for (const k of ['cl', 'df', 'lm', 'gm', 'mp']) T.sv[k] = $(k).value;
  $('cl').value = '0'; $('df').value = '0'; $('lm').value = '0'; $('gm').value = '0'; $('mp').value = '0';
  T.on = 1; T.i = -1; T.lock = 1; card.style.display = 'none';
  T.starting = 1; try { leave(); begin(0); } finally { T.starting = 0; }
  bots = []; T.dummy = null; restoreMenu_keepOn();
  // on attend la fin de l'écran de chargement avant la 1re étape
  const w = setInterval(() => { if (!T.on) return clearInterval(w); if (LD <= 0) { clearInterval(w); T.i = 0; showStep(); } }, 100);
}
// begin() a déjà lu les réglages : on remet les choix du joueur dans le menu sans arrêter le tutoriel.
function restoreMenu_keepOn() { restoreMenu(); }

setInterval(() => {
  if (!T.on || T.lock || T.i < 0 || busy()) return;
  const st = STEPS[T.i]; if (!st) return;
  try { if (st.dyn) $('t3d').innerHTML = st.d(); if (st.ok(T.s)) advance(); } catch (e) {}
}, 80);

/* ---- boutons du menu + invitation au premier lancement ---- */
const bs = $('bs');
const bTuto = el('button', { id: 't3tuto', className: 's', type: 'button' }, '🎓 Tutoriel interactif');
bs.parentNode.insertBefore(bTuto, bs);
bTuto.onclick = startTuto;

const wel = el('div', { id: 't3wel' }, '<div><h2>🎓 Bienvenue !</h2><p>Première partie ? Apprends à jouer en une minute : déplacement, jetpack, tir, grenades et construction.</p></div>');
const wb = wel.firstChild;
wb.appendChild(el('button', { type: 'button', textContent: '▶ Lancer le tutoriel', onclick: () => { wel.style.display = 'none'; startTuto(); } }));
wb.appendChild(el('button', { type: 'button', className: 's', textContent: 'Plus tard', onclick: () => { wel.style.display = 'none'; LS('mgTuto', 'later'); } }));
document.body.appendChild(wel);

/* ================= PWA : installation ================= */
const standalone = () => matchMedia('(display-mode: standalone)').matches || matchMedia('(display-mode: fullscreen)').matches ||
  matchMedia('(display-mode: minimal-ui)').matches || navigator.standalone === true;
const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
let deferred = null;
const bInst = el('button', { id: 't3inst', className: 's', type: 'button', style: 'display:none' }, '📲 Installer l\'application');
bs.parentNode.insertBefore(bInst, bs);
const pill = el('div', { id: 't3pill' }); document.body.appendChild(pill);
let pillT = 0;
const say = (txt, ms) => { pill.textContent = txt; pill.style.display = 'block'; clearTimeout(pillT); if (ms) pillT = setTimeout(() => { pill.style.display = 'none'; refreshOffline(); }, ms); };
function refreshInstall() { bInst.style.display = !standalone() && (deferred || isIOS) ? 'block' : 'none'; }
addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferred = e; refreshInstall(); });
addEventListener('appinstalled', () => { deferred = null; refreshInstall(); say('✅ Application installée', 3500); });
bInst.onclick = async () => {
  if (deferred) { const d = deferred; deferred = null; refreshInstall(); try { d.prompt(); await d.userChoice; } catch (e) {} }
  else if (isIOS) say('Touche Partager ⬆️ puis « Sur l\'écran d\'accueil »', 7000);
};
matchMedia('(display-mode: standalone)').addEventListener && matchMedia('(display-mode: standalone)').addEventListener('change', refreshInstall);
refreshInstall();

/* ================= PWA : hors-ligne ================= */
function refreshOffline() { if (!navigator.onLine) { pill.textContent = '📴 Hors-ligne · le solo reste disponible'; pill.style.display = 'block'; } else pill.style.display = 'none'; }
addEventListener('offline', refreshOffline);
addEventListener('online', () => say('✅ De retour en ligne', 2500));
// Le multijoueur a besoin du réseau : message clair au lieu d'une attente de 45 s.
document.addEventListener('click', e => {
  if (!navigator.onLine && e.target.closest && e.target.closest('#bm')) {
    e.stopPropagation(); e.preventDefault();
    const ms = $('ms'); if (ms) ms.textContent = 'Pas de connexion : le multijoueur est indisponible. Le solo fonctionne hors-ligne.';
  }
}, true);
refreshOffline();

/* ================= PWA : mises à jour + stockage persistant ================= */
const upd = el('div', { id: 't3upd' }, '<span>🔄 Nouvelle version disponible</span>');
const bUpd = el('button', { type: 'button', textContent: 'Mettre à jour' }); upd.appendChild(bUpd);
upd.appendChild(el('button', { type: 'button', className: 's', textContent: 'Plus tard', onclick: () => { upd.style.display = 'none'; } }));
document.body.appendChild(upd);
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  let refreshing = false, wantReload = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (refreshing || !wantReload) return; refreshing = true; location.reload(); });
  const offer = w => { upd.style.display = 'flex'; bUpd.onclick = () => { wantReload = true; w.postMessage('SKIP_WAITING'); }; };
  navigator.serviceWorker.ready.then(reg => {
    if (reg.waiting && navigator.serviceWorker.controller) offer(reg.waiting);
    reg.addEventListener('updatefound', () => {
      const n = reg.installing; if (!n) return;
      n.addEventListener('statechange', () => { if (n.state === 'installed' && navigator.serviceWorker.controller) offer(n); });
    });
    const chk = () => { try { reg.update(); } catch (e) {} };
    setInterval(chk, 30 * 60 * 1000);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) chk(); });
  }).catch(() => {});
}
// Demande au navigateur de ne pas effacer les données du jeu (niveau, pièces, réglages) quand l'espace manque.
try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) {}

/* ================= Raccourcis (?play=solo, ?tuto=1) et 1er lancement ================= */
const q = new URLSearchParams(location.search);
if (q.has('play') || q.has('tuto') || q.has('source')) { try { history.replaceState(null, '', location.pathname); } catch (e) {} }
setTimeout(() => {
  if (q.get('tuto')) startTuto();
  else if (q.get('play') === 'solo') bs.click();
  else if (!LS('mgTuto') && !T.on) wel.style.display = 'flex';
}, 400);
window.MGX3 = { startTuto, endTuto, T, STEPS };
})();
