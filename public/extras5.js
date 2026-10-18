/* Mini Guerre v11 — écran d'accueil + salon de sélection de carte façon Mini Militia.
   Chargé après extras4.js. Ne remplace rien : l'ancien menu reste en dessous (il sert de « moteur » et de menu pause).
   - Accueil : profil/niveau, pièces, ELO, boutons Profil / Atelier / Boutique / Classé / Éditeur / Tutoriel, gros bouton COMBAT.
   - COMBAT → salon : mode de jeu, carte (toucher = choisir), liste des joueurs, options, bouton JOUER.
   - Choix de carte : écran dédié avec grand aperçu + vignettes. */
(() => {
'use strict';
const $ = id => document.getElementById(id);
const LS = (k, v) => { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } };
const el = (tag, attrs, html) => { const e = document.createElement(tag); Object.assign(e, attrs || {}); if (html != null) e.innerHTML = html; return e; };
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ---------- données lues (jamais modifiées) ---------- */
const prof = () => { try { return JSON.parse(LS('mgP2')) || {}; } catch (e) { return {}; } };
const lvlOf = xp => Math.floor(Math.sqrt((xp || 0) / 60)) + 1;
const RANKS = [[1, 'Soldat'], [3, 'Caporal'], [6, 'Sergent'], [10, 'Lieutenant'], [15, 'Capitaine'], [20, 'Commandant'], [26, 'Colonel'], [32, 'Général']];
const milRank = l => RANKS.filter(r => l >= r[0]).pop()[1];
const eloRank = e => e < 900 ? 'Bronze' : e < 1100 ? 'Argent' : e < 1300 ? 'Or' : e < 1500 ? 'Platine' : 'Diamant';
const COLS = [null, '#ff3b30', '#2f6bff', '#2ee6a6', '#a45cff', '#ff5fa2', '#ff9500', '#2b2b33', '#ffd23f'];
const myName = () => ($('nm') && $('nm').value.trim()) || (typeof me !== 'undefined' && me.n) || 'Joueur';
const BOTN = () => (typeof BN !== 'undefined' ? BN : ['Rambo', 'Viper', 'Ghost', 'Titan']);

/* ---------- dessins ---------- */
const SKIN = '#e0aa94', INK = '#2c211b';
const head = (hair, skin) => `<svg viewBox="0 0 60 60" aria-hidden="true"><circle cx="30" cy="31" r="22" fill="${skin || SKIN}" stroke="${INK}" stroke-width="2.5"/><path d="M8.500 29C8 14 18 8 30 8s22 6 21.500 21c-4-7-11-10-21.500-10S12.500 22 8.500 29z" fill="${hair}" stroke="${INK}" stroke-width="2"/><path d="M14 26l13 5M46 26l-13 5" stroke="${INK}" stroke-width="4.200" stroke-linecap="round"/><ellipse cx="23" cy="34" rx="3.600" ry="3.200" fill="#fff"/><ellipse cx="37" cy="34" rx="3.600" ry="3.200" fill="#fff"/><circle cx="24" cy="35" r="1.600" fill="${INK}"/><circle cx="36" cy="35" r="1.600" fill="${INK}"/><path d="M19 44q11 7 22 0" stroke="${INK}" stroke-width="2.500" fill="#fff" stroke-linejoin="round"/></svg>`;
const HAIR = ['#6b5344', '#2d2d33', '#9a6b2f', '#444b57', '#7a2f2f'];

const soldier = jk => {
  const dk = '#1f2a16';
  return `<svg viewBox="0 0 220 340" aria-hidden="true">
<ellipse cx="112" cy="328" rx="70" ry="8" fill="rgba(0,0,0,.22)"/>
<path d="M66 236h88l7 62h-44l-3-38-4 38H60z" fill="#55703a" stroke="${dk}" stroke-width="3.500" stroke-linejoin="round"/>
<path d="M74 252q11-9 20 0-4 13-20 0zM118 270q13-6 22 3-7 11-22-3zM100 240q8-4 12 3-6 5-12-3z" fill="#2f4120"/><path d="M130 246q8-3 12 4-7 4-12-4zM72 280q9-3 13 5-8 4-13-5z" fill="#7f9a52"/>
<path d="M56 296h50l4 24H46z" fill="#5d5d63" stroke="${dk}" stroke-width="3.500" stroke-linejoin="round"/><path d="M114 296h50l8 24h-60z" fill="#5d5d63" stroke="${dk}" stroke-width="3.500" stroke-linejoin="round"/>
<path d="M58 134l52-20 52 20 14 94-22 14H66l-22-14z" fill="${jk}" stroke="${dk}" stroke-width="3.500" stroke-linejoin="round"/>
<path d="M88 118l22 26 22-26 12 16-34 26-34-26z" fill="${jk}" stroke="${dk}" stroke-width="3" stroke-linejoin="round" style="filter:brightness(1.12)"/>
<path d="M110 144v96" stroke="${dk}" stroke-width="2.500"/><circle cx="110" cy="170" r="3.500" fill="${dk}"/><circle cx="110" cy="200" r="3.500" fill="${dk}"/><circle cx="110" cy="228" r="3.500" fill="${dk}"/>
<path d="M72 176h28v26H72zM120 176h28v26h-28z" fill="none" stroke="${dk}" stroke-width="3"/><path d="M72 184h28M120 184h28" stroke="${dk}" stroke-width="2.200"/>
<path d="M66 150l9 6 5-12" fill="none" stroke="${dk}" stroke-width="2.500" stroke-linecap="round" stroke-linejoin="round" opacity=".7"/>
<path d="M48 148l-16 80 22 6 12-70z" fill="${jk}" stroke="${dk}" stroke-width="3.500" stroke-linejoin="round" style="filter:brightness(.95)"/><path d="M172 148l16 80-22 6-12-70z" fill="${jk}" stroke="${dk}" stroke-width="3.500" stroke-linejoin="round" style="filter:brightness(.95)"/>
<path d="M30 226l26 6-2 34-26-8z" fill="#2b2b30" stroke="#111" stroke-width="3" stroke-linejoin="round"/><path d="M190 226l-26 6 2 34 26-8z" fill="#2b2b30" stroke="#111" stroke-width="3" stroke-linejoin="round"/>
<circle cx="110" cy="74" r="58" fill="${SKIN}" stroke="${INK}" stroke-width="4"/>
<path d="M54 66C52 28 80 12 110 12s58 16 56 54c-8-18-24-28-56-28S62 48 54 66z" fill="#6b5344" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
<path d="M68 62l36 14M152 62l-36 14" stroke="${INK}" stroke-width="11" stroke-linecap="round"/>
<ellipse cx="86" cy="82" rx="12" ry="9" fill="#fff" stroke="${INK}" stroke-width="2.500"/><ellipse cx="134" cy="82" rx="12" ry="9" fill="#fff" stroke="${INK}" stroke-width="2.500"/><circle cx="88" cy="84" r="4.500" fill="${INK}"/><circle cx="132" cy="84" r="4.500" fill="${INK}"/>
<path d="M82 106q28 22 56 0l-3 12q-25 12-50 0z" fill="#fff" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><path d="M92 112h36M110 108v10" stroke="${INK}" stroke-width="2"/>
</svg>`;
};

/* fond de jungle (silhouettes pointues) généré une fois */
const jungle = () => {
  let s = 7; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const layer = (base, amp, step, col) => { let d = `M0 600V${base}`; for (let x = 0; x <= 1000; x += step) { d += `L${x + step * .5} ${base - amp * (.4 + rnd() * .9)}L${x + step} ${base + amp * .1 * rnd()}`; } return `<path d="${d}V600z" fill="${col}"/>`; };
  const star = (cx, cy, r, col) => { let d = ''; for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2, rr = i % 2 ? r * .45 : r * (.8 + rnd() * .4); d += (i ? 'L' : 'M') + (cx + Math.cos(a) * rr).toFixed(0) + ' ' + (cy + Math.sin(a) * rr).toFixed(0); } return `<path d="${d}z" fill="${col}"/>`; };
  let st = ''; for (let i = 0; i < 7; i++) st += star(70 + i * 150 + rnd() * 60, 250 + rnd() * 120, 70 + rnd() * 50, 'rgba(140,165,130,.55)');
  let st2 = ''; for (let i = 0; i < 6; i++) st2 += star(40 + i * 180 + rnd() * 60, 380 + rnd() * 80, 60 + rnd() * 40, 'rgba(105,135,105,.85)');
  return `<svg viewBox="0 0 1000 600" preserveAspectRatio="xMidYMax slice" aria-hidden="true">${layer(330, 90, 40, 'rgba(176,196,160,.55)')}${st}${layer(430, 80, 34, 'rgba(120,150,115,.8)')}${st2}<path d="M0 520q80-24 160-4t160 6 160-14 160 8 160-8 160 10 160-12 80 6V600H0z" fill="#8c8473"/><path d="M0 520q80-24 160-4t160 6 160-14 160 8 160-8 160 10 160-12 80 6" fill="none" stroke="#b5cfa8" stroke-width="10" stroke-linejoin="round"/></svg>`;
};

/* ---------- styles ---------- */
const css = `
#hm,#lb,#mpk,#hsh{--s:clamp(10px,2.55vmin,21px);font-size:var(--s);font-family:"Trebuchet MS","Segoe UI",system-ui,sans-serif;color:#fff;display:none}
:where(#hm,#lb,#mpk,#hsh) button{width:auto;margin:0;padding:0;border:0;background:none;color:inherit;font:inherit;cursor:pointer;border-radius:0;-webkit-tap-highlight-color:transparent}
:where(#hm,#lb,#mpk,#hsh) *{box-sizing:border-box}
.ol{text-shadow:-1px -1px 0 #14231f,1px -1px 0 #14231f,-1px 1px 0 #14231f,1px 1px 0 #14231f,0 2px 0 #14231f}
.pn{background:linear-gradient(#3d6059,#2c4742);border:.2em solid #1b2f2b;border-bottom-width:.38em;border-radius:.7em;box-shadow:0 .2em .5em rgba(0,0,0,.25)}
button.pn:active{transform:translateY(.15em);border-bottom-width:.23em}
/* --- accueil --- */
#hm{position:fixed;inset:0;z-index:9;grid-template-columns:auto 1fr auto;grid-template-rows:auto 1fr auto;gap:0 1em;padding:max(.8em,env(safe-area-inset-top)) max(1em,env(safe-area-inset-right)) max(.8em,env(safe-area-inset-bottom)) max(1em,env(safe-area-inset-left));background:linear-gradient(#f6f6cf,#d9e4b4 40%,#a9c28f);overflow:hidden;animation:hfi .3s}
@keyframes hfi{from{opacity:0}to{opacity:1}}
#hm .hbg{position:absolute;inset:0;pointer-events:none}#hm .hbg svg{width:100%;height:100%;display:block}
#hm>:not(.hbg){position:relative}
.htop{grid-column:1/-1;display:flex;align-items:center;gap:.7em}
.hpf{display:flex;align-items:center;gap:.6em;padding:.35em .9em .35em .4em!important;min-width:13em;text-align:left}
.hlv{width:2.7em;height:2.9em;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:1.25em;color:#2a2200;background:linear-gradient(#ffe066,#f2b81c);clip-path:polygon(50% 0,100% 22%,100% 78%,50% 100%,0 78%,0 22%);flex:none}
.hpn{flex:1;min-width:0}.hpn b{display:block;font-size:1.05em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.hpn i{display:block;height:.7em;border-radius:.4em;background:#16231f;margin-top:.25em;overflow:hidden;border:.12em solid #0d1714}.hpn u{display:block;height:100%;width:0;background:linear-gradient(#9fe870,#4cb82e);text-decoration:none}
.hsq{width:2.9em;height:2.9em;display:flex;align-items:center;justify-content:center;font-size:1.3em}
.hsp{flex:1}
.hpl{display:flex;align-items:center;gap:.5em;padding:.35em .45em .35em .7em!important;min-width:7.5em}.hpl span{font-size:1.4em;line-height:1}.hpl b{flex:1;text-align:right;font-size:1.05em}
.hpl em{font-style:normal;font-weight:900;width:1.6em;height:1.6em;line-height:1.5em;text-align:center;border-radius:.3em;background:linear-gradient(#6ee05a,#2f9b2a);border:.12em solid #14301a;font-size:1.15em}
.hlft,.hrgt{display:flex;flex-direction:column;justify-content:center;gap:.8em;grid-row:2}.hlft{grid-column:1}.hrgt{grid-column:3}
.hnb{width:5.6em;padding:.45em .2em .35em!important;text-align:center;font-size:.92em}.hnb .hic{font-size:2.3em;line-height:1.15}.hnb span{display:block;font-weight:900;font-size:1em;margin-top:.1em}
.hmid{grid-column:2;grid-row:2;display:flex;align-items:flex-end;justify-content:center;min-height:0;padding-bottom:.4em}
#hchar{height:min(100%,34em);aspect-ratio:220/340;animation:hbob 2.6s ease-in-out infinite;cursor:pointer}#hchar img{width:100%;height:100%;object-fit:contain;display:block;filter:drop-shadow(0 .25em 0 rgba(0,0,0,.12))}#hchar svg{width:100%;height:100%;display:block;filter:drop-shadow(0 .25em 0 rgba(0,0,0,.12))}
@keyframes hbob{50%{transform:translateY(-.35em)}}
.hbot{grid-column:1/-1;display:flex;align-items:flex-end;gap:1em}
.hst{flex:1;display:grid;grid-template-columns:repeat(4,1fr);gap:.7em;max-width:44em}
.hsc{padding:.5em .3em .4em;text-align:center;opacity:.95}.hsc small{display:block;font-size:.72em;letter-spacing:.1em;text-transform:uppercase;color:#bfe3c8;font-weight:800}.hsc b{display:block;font-size:1.5em;margin-top:.05em}
.hbat{display:flex;flex-direction:column;align-items:stretch;gap:.5em;margin-left:auto}
.hcu{padding:.45em 1em!important;font-size:.85em;font-weight:900;text-align:center;color:#d8f2a8}
.hgo{padding:.55em 2.2em .7em!important;font-size:2.1em;font-weight:900;letter-spacing:.05em;color:#fff;background:linear-gradient(#ffdb5e,#f2b21c)!important;border:.12em solid #3b2a00!important;border-bottom-width:.2em!important;border-radius:.4em!important;box-shadow:0 .15em .5em rgba(0,0,0,.35)}
.hgo:active{transform:translateY(.1em)}
.hgo span{text-shadow:-2px -2px 0 #4a3500,2px -2px 0 #4a3500,-2px 2px 0 #4a3500,2px 2px 0 #4a3500,0 3px 0 #4a3500}
@media (max-aspect-ratio:1/1){#hm{grid-template-columns:auto 1fr auto}.hst{max-width:none}.hbot{flex-direction:column;align-items:stretch}.hbat{margin:0}.hgo{font-size:1.8em}.hnb{width:4.6em}}
/* --- salon --- */
#lb{position:fixed;inset:0;z-index:9;flex-direction:column;background:radial-gradient(ellipse at 50% 20%,#3b5f5a,#223a37 70%);padding:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);animation:hfi .25s}
#lb .lbh,#mpk .lbh{position:relative;display:flex;align-items:center;justify-content:space-between;padding:.6em 1em;background:linear-gradient(#2f4a46,#243b38);border-bottom:.2em solid #17282500;box-shadow:0 .2em 0 #162522}
.lbb{width:3.2em;height:3em;display:flex;align-items:center;justify-content:center;font-size:1.25em!important;background:linear-gradient(#ff6b5e,#d8362a)!important;border:.12em solid #5b120c!important;border-bottom-width:.22em!important;border-radius:.4em!important;box-shadow:0 .1em .3em rgba(0,0,0,.4)}
.lbm{position:absolute;left:50%;top:0;transform:translateX(-50%);min-width:15em;padding:.3em 2.5em .45em!important;text-align:center;background:linear-gradient(#35504b,#2a423e)!important;border:.15em solid #162522!important;border-top:0!important;border-radius:0 0 1.1em 1.1em!important;clip-path:polygon(0 0,100% 0,94% 100%,6% 100%)}
.lbm b{display:block;font-size:1.2em;letter-spacing:.04em;color:#cfe0d6;text-transform:uppercase}.lbm small{display:block;font-size:.7em;opacity:.65;font-weight:700}
.lbtg{display:flex;gap:.3em}.lbtg button{padding:.55em .9em!important;font-weight:900;font-size:.85em;border-radius:.5em!important;background:#2a423e!important;border:.12em solid #162522!important;opacity:.7}.lbtg button.on{background:linear-gradient(#ffd75a,#f1b020)!important;color:#2a1d00;opacity:1}
.lbc{display:flex;gap:1em;justify-content:center;padding:1em 1em .5em}
.lbmap{position:relative;display:flex;align-items:center;gap:.8em;flex:0 1 24em;padding:.3em .6em .3em .3em!important;text-align:left;background:#243b38!important;border:.15em solid #162522!important;border-radius:.6em!important;box-shadow:inset 0 0 0 .12em rgba(255,255,255,.05)}
.lbmap canvas{width:6.4em;height:3.6em;border-radius:.4em;border:.12em solid #0f1a18;flex:none;display:block}.lbmap div{flex:1;min-width:0}.lbmap b{display:block;font-size:1.25em;color:#d9f2a0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.lbmap small{display:block;font-size:.78em;opacity:.7;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.lbmap i{font-style:normal;font-size:.7em;background:rgba(255,255,255,.1);border-radius:.5em;padding:.25em .6em;font-weight:900;flex:none}
.lbar{width:2.2em;height:2.6em;border-radius:.4em!important;background:#243b38!important;border:.12em solid #162522!important;font-size:1.2em!important;font-weight:900}
.lbtot{display:flex;align-items:center;gap:.7em;flex:0 1 20em;padding:.3em 1.2em;background:#243b38;border:.15em solid #162522;border-radius:.6em;font-size:1.15em;font-weight:900;color:#e9f3e6}.lbtot i{font-style:normal;font-size:1.8em;filter:grayscale(.2)}.lbtot b{color:#f2b64a;font-size:1.1em}
.lbbody{flex:1;min-height:0;overflow:auto;touch-action:pan-y;padding:.3em 1.2em .5em;-webkit-overflow-scrolling:touch}
.lbl{padding:.35em .9em;margin-bottom:.6em;background:rgba(0,0,0,.28);border-radius:.3em;color:#8be08c;font-weight:900;font-size:.95em}
.lbg{display:grid;grid-template-columns:1fr 1fr;gap:.6em .7em;max-width:62em;margin:0 auto}
@media (max-width:560px){.lbg{grid-template-columns:1fr}}
.sl{display:flex;align-items:center;gap:.7em;min-height:3.9em;padding:.25em .9em .25em .6em;border-radius:.6em;border:.15em solid #162522;border-bottom-width:.28em;background:#5fa88b;text-align:left;width:100%;animation:slin .3s}
@keyframes slin{from{opacity:0;transform:translateY(.5em)}}
.sl.me{background:#f6b94a;border-color:#6e4a07}.sl.em{background:#2b3f3d;border-style:solid;border-color:#1c2e2b;opacity:.9;animation:none}
.sl .av{width:2.7em;height:2.7em;flex:none}.sl .av svg{width:100%;height:100%;display:block}
.sl .tx{flex:1;min-width:0}.sl b{display:block;font-size:1.35em;line-height:1.05;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-shadow:-1px -1px 0 #14231f,1px -1px 0 #14231f,-1px 1px 0 #14231f,1px 1px 0 #14231f}
.sl small{display:block;font-weight:900;font-size:.9em;color:#f6ee6a;text-shadow:-1px -1px 0 #14231f,1px -1px 0 #14231f,-1px 1px 0 #14231f,1px 1px 0 #14231f}.sl.me small{color:#fff6b0}
.sl .ed{font-size:1.1em;opacity:.8}
#lbon{max-width:34em;margin:.8em auto 0;padding:.8em 1em;background:rgba(0,0,0,.25);border-radius:.7em;display:none}
#lbon label{display:block;font-size:.72em;letter-spacing:.12em;font-weight:900;text-transform:uppercase;opacity:.65;margin:.2em 0 .3em}
#lbon input{width:100%;padding:.7em;border-radius:.5em;border:.12em solid #162522;background:#16231f;color:#fff;font:inherit;font-weight:800;text-align:center;margin:0}
#lbon p{margin:.7em 0 0;font-size:.8em;opacity:.75;line-height:1.45;font-weight:600}
.lbf{display:flex;align-items:center;gap:.8em;padding:.6em 1em .7em;background:linear-gradient(#243b38,#1c2f2c);border-top:.15em solid #162522}
.lbw{display:flex;align-items:center;gap:.6em;flex:0 1 auto;min-width:0;font-weight:900;font-size:1.05em;max-width:28%}.lbw .dt{width:.9em;height:.9em;border-radius:50%;border:.2em solid #f2b64a;border-top-color:transparent;flex:none;animation:sp 1s linear infinite}.lbw.ok .dt{animation:none;border-color:#8be08c;background:#8be08c}.lbw span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
@keyframes sp{to{transform:rotate(360deg)}}
.lbch{flex:1;display:flex;gap:.5em;overflow-x:auto;touch-action:pan-x;padding:.2em .1em;min-width:0}.lbch::-webkit-scrollbar{display:none}
.ch{flex:none;padding:.3em .9em .35em!important;text-align:left;background:#2a423e!important;border:.12em solid #162522!important;border-bottom-width:.22em!important;border-radius:.5em!important}.ch small{display:block;font-size:.68em;letter-spacing:.1em;text-transform:uppercase;opacity:.6;font-weight:800}.ch b{display:block;font-size:.95em;white-space:nowrap}
.lbgo{flex:none;padding:.55em 1.8em .65em!important;font-size:1.6em!important;font-weight:900;letter-spacing:.05em;background:linear-gradient(#ffdb5e,#f2b21c)!important;border:.12em solid #3b2a00!important;border-bottom-width:.2em!important;border-radius:.4em!important;box-shadow:0 .15em .4em rgba(0,0,0,.4)}.lbgo:active{transform:translateY(.1em)}
.lbgo span{text-shadow:-2px -2px 0 #4a3500,2px -2px 0 #4a3500,-2px 2px 0 #4a3500,2px 2px 0 #4a3500,0 3px 0 #4a3500}
@media (max-aspect-ratio:1/1){.lbf{flex-wrap:wrap}.lbw{max-width:none;flex:1 0 100%}.lbch{flex:1 0 100%;order:2}.lbgo{order:3;flex:1 0 100%}.lbm{min-width:10em}}
/* --- choix de carte --- */
#mpk{position:fixed;inset:0;z-index:10;flex-direction:column;background:radial-gradient(ellipse at 50% 20%,#3b5f5a,#223a37 70%);padding:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);animation:hfi .2s}
#mpk .lbh{justify-content:flex-start;gap:1em}#mpk h2{margin:0;font-size:1.4em;letter-spacing:.06em;text-transform:uppercase;color:#cfe0d6}
.mpb{flex:1;min-height:0;display:flex;gap:1em;padding:1em 1.2em}
.mpl{flex:1.25;min-width:0;display:flex;flex-direction:column;gap:.6em;overflow:auto;touch-action:pan-y}
.mpv{position:relative;border-radius:.8em;overflow:hidden;border:.2em solid #162522;box-shadow:0 .4em 1.2em rgba(0,0,0,.45);aspect-ratio:16/9;background:#000;width:100%;max-height:52vh;margin:0 auto}.mpv canvas{display:block;width:100%;height:100%}
.mpv em{position:absolute;top:.6em;left:.6em;font-style:normal;font-size:.75em;font-weight:900;letter-spacing:.1em;padding:.3em .8em;border-radius:99px;background:rgba(0,0,0,.55);border:1px solid rgba(255,255,255,.25)}
.mpl h3{margin:.1em 0 0;font-size:1.6em;color:#d9f2a0}.mpl p{margin:0;font-size:.9em;opacity:.85;line-height:1.4;font-weight:600}
.mpt{display:flex;flex-wrap:wrap;gap:.4em}.mpt span{font-size:.75em;padding:.3em .8em;border-radius:99px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.16);font-weight:800}
.mpr{flex:1;min-width:0;display:grid;grid-template-columns:1fr 1fr;gap:.6em;align-content:start;grid-auto-rows:max-content;overflow:auto;touch-action:pan-y;padding:.2em .3em .6em}
.mth{position:relative;padding:0!important;border-radius:.6em!important;overflow:hidden;background:#16231f!important;border:.18em solid #162522!important;opacity:.8;text-align:left}.mth.on{border-color:#ffd75a!important;opacity:1;box-shadow:0 0 0 .15em rgba(255,215,90,.35)}
.mth .w{display:block;position:relative;aspect-ratio:16/9;width:100%}.mth canvas{position:absolute;inset:0;width:100%;height:100%;display:block}.mth b{display:block;font-size:.8em;padding:.35em .5em .4em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;background:rgba(0,0,0,.5)}.mth em{position:absolute;top:.3em;left:.4em;font-style:normal;font-size:.7em;font-weight:900;background:rgba(0,0,0,.65);border-radius:.4em;padding:.1em .5em}
.mpf{display:flex;justify-content:center;padding:.6em 1em .8em;background:linear-gradient(#243b38,#1c2f2c);border-top:.15em solid #162522}
@media (max-aspect-ratio:1/1){.mpb{flex-direction:column;overflow:auto}.mpl,.mpr{flex:none;overflow:visible}.mpr{grid-template-columns:1fr 1fr 1fr}.mpv{max-height:none}}
/* --- feuille de choix --- */
#hsh{position:fixed;inset:0;z-index:30;align-items:center;justify-content:center;background:rgba(5,12,10,.65);padding:1em}
#hsh>div{width:min(92vw,26em);max-height:86vh;display:flex;flex-direction:column;background:linear-gradient(#37564f,#2a423e);border:.2em solid #162522;border-radius:.9em;box-shadow:0 1em 3em rgba(0,0,0,.6);overflow:hidden}
#hsh h4{margin:0;padding:.7em 1em;font-size:1.1em;letter-spacing:.06em;text-transform:uppercase;background:#1f332f;color:#cfe0d6}
#hsh .li{overflow:auto;touch-action:pan-y;padding:.5em}
#hsh .li button{display:block;width:100%!important;text-align:left;padding:.7em .9em!important;margin:.2em 0!important;border-radius:.5em!important;background:#2f4a45!important;font-weight:800;border:.12em solid #162522!important}#hsh .li button.on{background:linear-gradient(#ffd75a,#f1b020)!important;color:#2a1d00}#hsh .li button:disabled{opacity:.4}
#hsh .li button small{display:block;font-weight:600;opacity:.75;font-size:.8em;margin-top:.15em;white-space:normal}
#hsh .x{padding:.6em;text-align:center;background:#1f332f;font-weight:900;width:100%!important;border-radius:0!important}
`;
const st = el('style', {}, ''); st.textContent = css; document.head.appendChild(st);

/* ---------- construction ---------- */
const hm = el('div', { id: 'hm' });
hm.innerHTML = `<div class="hbg">${jungle()}</div>
<div class="htop">
 <button class="pn hpf ol" id="hpf" type="button"><div class="hlv" id="hlv">1</div><div class="hpn"><b id="hpn"></b><i><u id="hxp"></u></i></div></button>
 <button class="pn hsq" id="hgear" type="button" aria-label="Paramètres">⚙️</button>
 <div class="hsp"></div>
 <button class="pn hpl ol" id="hcoin" type="button"><span>🪙</span><b id="hcv">0</b><em>+</em></button>
 <button class="pn hpl ol" id="helo" type="button"><span>🏅</span><b id="hev">1000</b></button>
</div>
<div class="hlft">
 <button class="pn hnb ol" data-a="prof" type="button"><div class="hic">🪖</div><span>Profil</span></button>
 <button class="pn hnb ol" data-a="arm" type="button"><div class="hic">🔫</div><span>Atelier</span></button>
 <button class="pn hnb ol" data-a="shop" type="button"><div class="hic">🛍️</div><span>Boutique</span></button>
</div>
<div class="hmid"><div id="hchar"></div></div>
<div class="hrgt">
 <button class="pn hnb ol" data-a="rank" type="button"><div class="hic">🏅</div><span>Classé</span></button>
 <button class="pn hnb ol" data-a="tuto" type="button"><div class="hic">🎓</div><span>Tutoriel</span></button>
</div>
<div class="hbot">
 <div class="hst">
  <div class="pn hsc ol"><small>Kills</small><b id="hs1">0</b></div><div class="pn hsc ol"><small>Parties</small><b id="hs2">0</b></div>
  <div class="pn hsc ol"><small>Victoires</small><b id="hs3">0</b></div><div class="pn hsc ol"><small>Rang</small><b id="hs4">—</b></div>
 </div>
 <div class="hbat"><button class="pn hcu ol" id="hpriv" type="button">👥 SALLE PRIVÉE</button><button class="hgo" id="hgo" type="button"><span>COMBAT</span></button></div>
</div>`;

const lb = el('div', { id: 'lb' });
lb.innerHTML = `<div class="lbh"><button class="lbb ol" id="lbk" type="button" aria-label="Retour">◀</button>
 <button class="lbm ol" id="lbmode" type="button"><b id="lbmn"></b><small>Toucher pour changer de mode ▾</small></button>
 <div class="lbtg"><button id="lbs" type="button">SOLO</button><button id="lbo" type="button">EN LIGNE</button></div></div>
<div class="lbc"><button class="lbar" id="lbpl" type="button" aria-label="Carte précédente">‹</button>
 <button class="lbmap" id="lbmap" type="button"><canvas id="lbpc" width="208" height="117"></canvas><div><b id="lbmnm"></b><small id="lbmd"></small></div><i>CHOISIR ▸</i></button>
 <button class="lbar" id="lbnx" type="button" aria-label="Carte suivante">›</button>
 <div class="lbtot ol"><i>👤</i><span>Joueurs : <b id="lbtot">5</b></span></div></div>
<div class="lbbody"><div class="lbl" id="lbl"></div><div class="lbg" id="lbg"></div>
 <div id="lbon"><label for="lbrc">Code de salle (le même pour tous tes amis)</label><input id="lbrc" maxlength="20" placeholder="ex : amis42" autocomplete="off" autocapitalize="off"><p>Tes amis ouvrent le jeu, tapent le même code et choisissent la même carte et le même mode. Même couleur d’équipe = alliés.</p></div></div>
<div class="lbf"><div class="lbw" id="lbw"><i class="dt"></i><span id="lbwt"></span></div><div class="lbch" id="lbch"></div><button class="lbgo" id="lbgo" type="button"><span>JOUER</span></button></div>`;

const mpk = el('div', { id: 'mpk' });
mpk.innerHTML = `<div class="lbh"><button class="lbb ol" id="mpback" type="button" aria-label="Retour">◀</button><h2 class="ol">Choisis ta carte</h2></div>
<div class="mpb"><div class="mpl"><div class="mpv"><canvas id="mpc" width="800" height="450"></canvas><em id="mpi"></em></div><h3 id="mpn"></h3><div class="mpt" id="mpt"></div><p id="mpd"></p></div><div class="mpr" id="mpr"></div></div>
<div class="mpf"><button class="lbgo" id="mpok" type="button"><span>CHOISIR ✔</span></button></div>`;

const hsh = el('div', { id: 'hsh' });
document.body.append(hm, lb, mpk, hsh);

/* ---------- état ---------- */
let mode = 'solo', lbOpen = false, wasHome = false, fillT = [];
const isRun = () => typeof run !== 'undefined' && !!run;
const sel = () => (typeof msel !== 'undefined' ? msel : (+$('mp').value || 0));

/* ---------- feuille de choix générique ---------- */
function sheet(title, items, cur, pick) {
  hsh.innerHTML = '<div><h4>' + esc(title) + '</h4><div class="li"></div><button class="x" type="button">Fermer</button></div>';
  const li = hsh.querySelector('.li');
  items.forEach(it => {
    const b = el('button', { type: 'button' }, esc(it.t) + (it.d ? '<small>' + esc(it.d) + '</small>' : ''));
    if (it.v === cur) b.className = 'on'; if (it.off) b.disabled = true;
    b.onclick = () => { hsh.style.display = 'none'; pick(it.v); }; li.appendChild(b);
  });
  hsh.querySelector('.x').onclick = () => { hsh.style.display = 'none'; };
  hsh.onclick = e => { if (e.target === hsh) hsh.style.display = 'none'; };
  hsh.style.display = 'flex';
}
const setSel = (id, v) => { const s = $(id); if (!s) return; s.value = v; s.dispatchEvent(new Event('change', { bubbles: true })); };
const optsOf = id => { const s = $(id); return s ? [...s.options].map(o => ({ t: o.textContent, v: o.value, off: o.disabled })) : []; };
const curTxt = id => { const s = $(id); return s && s.selectedOptions[0] ? s.selectedOptions[0].textContent : '—'; };

/* ---------- accueil ---------- */
function refreshHome() {
  const P = prof(), xp = P.xp || 0, lv = lvlOf(xp), a = 60 * (lv - 1) * (lv - 1), b = 60 * lv * lv;
  $('hlv').textContent = lv; $('hpn').textContent = myName();
  $('hxp').style.width = Math.max(4, Math.min(100, (xp - a) / (b - a) * 100)) + '%';
  $('hcv').textContent = P.coins != null ? P.coins : 0; $('hev').textContent = P.elo || 1000;
  $('hs1').textContent = P.k || 0; $('hs2').textContent = P.g || 0; $('hs3').textContent = P.w || 0; $('hs4').textContent = eloRank(P.elo || 1000);
  const jk = (P.eq && COLS[P.eq.co]) || '#5f7a40';
  const sk = (P.eq && P.eq.kk) | 0, key = jk + '|' + sk; if ($('hchar').dataset.k !== key) { $('hchar').innerHTML = sk && window.MGSK ? '<img alt="" src="' + window.MGSK.thumb(sk, 440, 680) + '">' : soldier(jk); $('hchar').dataset.k = key; }
}
const click = (id) => { const b = $(id); if (b) b.click(); };
const act = {
  prof: () => click('xps'),
  shop: () => { click('xps'); const t = document.querySelector('#xst [data-t="s"]'); if (t) t.click(); },
  arm: () => click('xbw'),
  tuto: () => click('t3tuto'),
  rank: () => { openLobby('online'); const r = [...document.querySelectorAll('#m button')].find(b => /CLASS/i.test(b.textContent)); if (r) r.click(); }
};
hm.querySelectorAll('[data-a]').forEach(b => b.onclick = () => act[b.dataset.a]());
$('hpf').onclick = act.prof; $('hcoin').onclick = act.shop; $('helo').onclick = act.rank; $('hchar').onclick = act.prof;
$('hgo').onclick = () => openLobby('solo');
$('hpriv').onclick = () => openLobby('online');
$('hgear').onclick = () => {
  const items = [{ t: '⚙️ Réglages (son, viseur, touches PC)', v: 'bp' }, { t: '🎮 Touches mobiles (déplacer les boutons)', v: 'bt' }, { t: '🔫 Atelier d’armes', v: 'xbw' }, { t: '🎓 Tutoriel interactif', v: 't3tuto' }];
  const inst = $('t3inst'); if (inst && inst.style.display !== 'none') items.push({ t: '📲 Installer l’application', v: 't3inst' });
  sheet('Paramètres', items, null, v => click(v));
};

/* ---------- salon ---------- */
function slotHtml(cls, av, name, rk, ed) { return '<button class="sl ' + cls + '" type="button"' + (cls === 'me' ? ' data-me="1"' : ' tabindex="-1"') + '><div class="av">' + av + '</div><div class="tx"><b>' + esc(name) + '</b>' + (rk ? '<small>' + esc(rk) + '</small>' : '') + '</div>' + (ed ? '<span class="ed">✎</span>' : '') + '</button>'; }
function botCount() { const gm = $('gmode'), m = gm ? +gm.value | 0 : 0; return m === 5 ? 0 : (m === 1 || m === 3) ? 2 : 4; }
function botRank(i) { const d = +($('df') || {}).value | 0; return [['Soldat', 'Caporal'], ['Sergent', 'Lieutenant'], ['Colonel', 'Général']][d][i % 2]; }
function renderSlots(nb) {
  const P = prof(), lv = lvlOf(P.xp), g = $('lbg'), n = BOTN();
  let h = slotHtml('me', head(HAIR[0]), myName(), milRank(lv) + ' · Niv ' + lv, 1);
  if (mode === 'solo') {
    const tot = 1 + botCount(), vis = Math.min(nb, tot);
    for (let i = 0; i < vis - 1; i++) h += slotHtml('', head(HAIR[(i + 1) % HAIR.length]), n[i % n.length], botRank(i));
    for (let i = vis; i < Math.max(tot, 2) + (tot % 2); i++) h += slotHtml('em', '', '', '');
    $('lbtot').textContent = tot; $('lbl').innerHTML = 'Joueurs : ' + Math.min(vis, tot);
    const full = vis >= tot;
    $('lbw').className = 'lbw ol' + (full ? ' ok' : '');
    $('lbwt').textContent = full ? (tot > 1 ? 'Tout le monde est prêt' : 'Prêt — affronte les vagues') : 'En attente de ' + (tot - vis) + ' joueur' + (tot - vis > 1 ? 's' : '') + '…';
  } else {
    h += slotHtml('em', '', '', ''); $('lbtot').textContent = '2 – 16'; $('lbl').innerHTML = 'Salle en ligne (16 joueurs max)';
    $('lbw').className = 'lbw ol'; $('lbwt').textContent = ($('ms') && $('ms').textContent.trim()) || 'Choisis un code, puis rejoins';
  }
  g.innerHTML = h;
  const me = g.querySelector('[data-me]'); if (me) me.onclick = () => { const v = prompt('Ton pseudo (14 caractères max)', myName()); if (v != null && v.trim()) { $('nm').value = v.trim().slice(0, 14); renderSlots(99); } };
}
function renderChips() {
  const defs = mode === 'solo' ? [['df', 'Bots'], ['cl', 'Classe'], ['gm', 'Constructions'], ['lm', 'Objectif']] : [['cl', 'Classe'], ['tm', 'Équipe'], ['gm', 'Constructions'], ['lm', 'Objectif'], ['xtr', 'Tournoi']];
  const w = $('lbch'); w.innerHTML = '';
  defs.forEach(([id, lab]) => {
    if (!$(id)) return;
    const b = el('button', { type: 'button', className: 'ch' }, '<small>' + lab + '</small><b>' + esc(curTxt(id)) + '</b>');
    b.onclick = () => sheet(lab, optsOf(id), $(id).value, v => { setSel(id, v); renderChips(); renderSlots(99); });
    w.appendChild(b);
  });
}
function renderMode() {
  const gm = $('gmode'); $('lbmn').textContent = gm ? curTxt('gmode').replace(/\s*\(.*\)/, '') : 'Mode classique';
  $('lbs').className = mode === 'solo' ? 'on' : ''; $('lbo').className = mode === 'online' ? 'on' : '';
  $('lbon').style.display = mode === 'online' ? 'block' : 'none'; $('lbgo').firstChild.textContent = mode === 'solo' ? 'JOUER' : 'REJOINDRE';
}
function renderMap() {
  const i = sel(), m = MAPS[i]; if (!m) return;
  preview($('lbpc'), i); $('lbmnm').textContent = m.e + ' ' + m.n;
  const t = typeof mTags === 'function' ? mTags(m) : []; $('lbmd').textContent = t.slice(0, 3).join(' · ');
}
function fillBots() {
  fillT.forEach(clearTimeout); fillT = [];
  if (mode !== 'solo') { renderSlots(99); return; }
  const tot = 1 + botCount(); renderSlots(1);
  for (let k = 2; k <= tot; k++) fillT.push(setTimeout(() => { if (lbOpen && mode === 'solo') renderSlots(k); }, 260 * (k - 1) + 120));
}
function openLobby(m) {
  mode = m || 'solo'; lbOpen = true; $('lbrc').value = ($('rc') && $('rc').value) || '';
  renderMode(); renderMap(); renderChips(); fillBots(); vis();
}
$('lbk').onclick = () => { lbOpen = false; fillT.forEach(clearTimeout); vis(); };
$('lbs').onclick = () => { mode = 'solo'; renderMode(); renderChips(); fillBots(); };
$('lbo').onclick = () => { mode = 'online'; renderMode(); renderChips(); fillBots(); };
$('lbmode').onclick = () => { const o = optsOf('gmode'); if (o.length) sheet('Mode de jeu', o, $('gmode').value, v => { setSel('gmode', v); renderMode(); renderChips(); fillBots(); }); };
$('lbpl').onclick = () => { selectMap(sel() - 1, 1); renderMap(); };
$('lbnx').onclick = () => { selectMap(sel() + 1, 1); renderMap(); };
$('lbmap').onclick = () => openPicker();
$('lbrc').oninput = e => { $('rc').value = e.target.value; };
$('lbgo').onclick = () => {
  if (mode === 'solo') { click('bs'); }
  else { $('rc').value = $('lbrc').value.trim(); if (!$('rc').value) { $('lbwt').textContent = 'Tape d’abord un code de salle'; return; } click('bm'); }
};
setInterval(() => { if (lbOpen && mode === 'online') { const t = $('ms') && $('ms').textContent.trim(); if (t) $('lbwt').textContent = t; } }, 400);

/* ---------- choix de carte ---------- */
let pkBuilt = 0;
function openPicker() {
  const r = $('mpr');
  if (pkBuilt !== MAPS.length) {
    r.innerHTML = '';
    MAPS.forEach((m, i) => { const b = el('button', { type: 'button', className: 'mth' }, '<span class="w"><canvas width="208" height="117"></canvas></span><em>' + (i + 1) + '</em><b>' + esc(m.e + ' ' + m.n) + '</b>'); preview(b.querySelector('canvas'), i); b.onclick = () => { selectMap(i, 1); pkShow(); }; r.appendChild(b); });
    pkBuilt = MAPS.length;
  }
  mpk.style.display = 'flex'; pkShow();
  const on = r.querySelector('.on'); if (on) setTimeout(() => { try { on.scrollIntoView({ block: 'center' }); } catch (e) { } }, 30);
}
function pkShow() {
  const i = sel(), m = MAPS[i];
  preview($('mpc'), i); $('mpn').textContent = m.e + ' ' + m.n; $('mpd').textContent = m.d || ''; $('mpi').textContent = 'CARTE ' + (i + 1) + ' / ' + MAPS.length;
  $('mpt').innerHTML = typeof tagsHtml === 'function' ? tagsHtml(m) : '';
  $('mpr').querySelectorAll('.mth').forEach((b, j) => b.classList.toggle('on', j === i));
}
const closePicker = () => { mpk.style.display = 'none'; renderMap(); };
$('mpback').onclick = closePicker; $('mpok').onclick = closePicker;

/* ---------- affichage selon l'état du jeu ---------- */
function vis() {
  const m = $('m'), on = m && getComputedStyle(m).display !== 'none', idle = on && !isRun();
  const home = idle && !lbOpen;
  if (!idle) { lbOpen = false; mpk.style.display = 'none'; hsh.style.display = 'none'; }
  hm.style.display = home ? 'grid' : 'none'; lb.style.display = idle && lbOpen ? 'flex' : 'none';
  if (home && !wasHome) refreshHome();
  wasHome = home;
  if (qb) qb.style.display = on && isRun() ? 'block' : 'none';
}
/* bouton « quitter vers l'accueil » dans le menu pause */
const qb = el('button', { type: 'button', className: 's', style: 'display:none' }, '🏠 Quitter la partie (retour à l’accueil)');
qb.onclick = () => { if (confirm('Quitter la partie en cours et revenir à l’accueil ?')) { try { leave(); } catch (e) { } location.reload(); } };
const br = $('br'); if (br) br.insertAdjacentElement('afterend', qb);

new MutationObserver(vis).observe($('m'), { attributes: true, attributeFilter: ['style'] });
setInterval(vis, 300); setInterval(() => { if (wasHome) refreshHome(); }, 1500);
vis();
window.MG5 = { openLobby, openPicker, vis };
})();
