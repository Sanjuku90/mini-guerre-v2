/* Sons d'armes v18 « studio » — tout est synthétisé (Web Audio), aucun fichier audio.
   Chaîne master : saturation douce (punch) → égaliseur (graves +, aigus −) → compresseur.
   Chaque tir = transitoire + claquement + corps + détonation grave (+ harmonique) + écho de salle (réverbération sombre) + écho lointain (canyon) + douille.
   Les tirs lointains sont plus sourds (absorption de l'air) et stéréo. Recharges propres à chaque arme, explosion en couches,
   bruit de touche (hit), headshot « ding », arme vide (clic sec), changement d'arme.
   Réglage par arme : tableau PR (c=claquement [fréq, durée, gain, Q] · l=corps [fréq départ, fin, durée, gain] · b=grave [départ, fin, durée, gain]
   rg=résonance métallique [fréq, durée, gain] · w=réverbération · e=écho lointain · fast=cadence rapide, version allégée). Chargé après extras.js. */
(() => {
let A, M, RV, NB, EI, wt = 0, wc = 0, dryT = 0, hitT = 0, swT = 0;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v)), rnd = (a, b) => a + Math.random() * (b - a);
function init() {
  if (A) { if (A.state == 'suspended') A.resume(); return true; }
  try { A = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return false; }
  const cp = A.createDynamicsCompressor(); cp.threshold.value = -16; cp.knee.value = 14; cp.ratio.value = 5; cp.attack.value = .002; cp.release.value = .14; cp.connect(A.destination);
  const hs = A.createBiquadFilter(); hs.type = 'highshelf'; hs.frequency.value = 6500; hs.gain.value = -1.5; hs.connect(cp);
  const ls = A.createBiquadFilter(); ls.type = 'lowshelf'; ls.frequency.value = 140; ls.gain.value = 3.5; ls.connect(hs);
  const sat = A.createWaveShaper(), cu = new Float32Array(2048); for (let i = 0; i < 2048; i++) { const x = i / 1023.5 - 1; cu[i] = Math.tanh(x * 1.7) / Math.tanh(1.7); }
  sat.curve = cu; sat.oversample = '2x'; sat.connect(ls);
  M = A.createGain(); M.connect(sat);
  NB = A.createBuffer(1, A.sampleRate * 2, A.sampleRate); const d = NB.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const L = (A.sampleRate * 2) | 0, ib = A.createBuffer(2, L, A.sampleRate); // réverbération sombre : bruit filtré, de plus en plus sourd
  for (let ch = 0; ch < 2; ch++) {
    const q = ib.getChannelData(ch); let y = 0;
    for (let i = 0; i < L; i++) { const t = i / L, k = clamp(.85 - 1.2 * t, .07, .85); y += ((Math.random() * 2 - 1) - y) * k; q[i] = y * Math.pow(1 - t, 2.6) * Math.exp(-t * 2.2) * 1.15; }
    [.011, .019, .029, .043].forEach((tp, j) => { q[((tp + ch * .003) * A.sampleRate) | 0] += (ch ? -1 : 1) * .6 * (1 - j * .15); }); // premières réflexions
  }
  RV = A.createConvolver(); RV.buffer = ib; const rg = A.createGain(); rg.gain.value = .5; RV.connect(rg); rg.connect(M);
  EI = A.createGain(); const ED = A.createDelay(1), fb = A.createGain(), lp = A.createBiquadFilter(), eo = A.createGain(); // écho lointain (canyon)
  ED.delayTime.value = .19; fb.gain.value = .34; lp.type = 'lowpass'; lp.frequency.value = 2200; eo.gain.value = .45;
  EI.connect(ED); ED.connect(lp); lp.connect(fb); fb.connect(ED); lp.connect(eo); eo.connect(M);
  return true;
}
const bus = (vol, pan, wet, ec, fc) => {
  const g = A.createGain(); g.gain.value = vol; let tail = g;
  if (fc < 18000) { const f = A.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = fc; f.Q.value = .5; g.connect(f); tail = f; }
  if (A.createStereoPanner) { const p = A.createStereoPanner(); p.pan.value = pan; tail.connect(p); p.connect(M); } else tail.connect(M);
  const s = A.createGain(); s.gain.value = wet; tail.connect(s); s.connect(RV);
  if (ec > .01) { const e = A.createGain(); e.gain.value = ec; tail.connect(e); e.connect(EI); }
  return g;
};
const env = (t, dur, g0) => { const e = A.createGain(); e.gain.setValueAtTime(g0, t); e.gain.exponentialRampToValueAtTime(.0008, t + dur); return e; };
function nz(b, t, dur, ty, f, q, g0, rate) { // éclat de bruit filtré
  const s = A.createBufferSource(); s.buffer = NB; s.loop = true; s.playbackRate.value = rate || 1;
  const fl = A.createBiquadFilter(); fl.type = ty; fl.frequency.value = f; fl.Q.value = q || .7;
  const e = env(t, dur, g0); s.connect(fl); fl.connect(e); e.connect(b); s.start(t, Math.random() * 1.5); s.stop(t + dur + .02);
}
function sw(b, t, ty, f0, f1, dur, g0) { // bruit dont le filtre glisse (souffle, explosion, flammes)
  const s = A.createBufferSource(); s.buffer = NB; s.loop = true; const fl = A.createBiquadFilter(); fl.type = ty; fl.Q.value = .9;
  fl.frequency.setValueAtTime(f0, t); fl.frequency.exponentialRampToValueAtTime(Math.max(30, f1), t + dur);
  const e = env(t, dur, g0); s.connect(fl); fl.connect(e); e.connect(b); s.start(t, Math.random() * 1.5); s.stop(t + dur + .02);
}
function tn(b, t, f0, f1, dur, g0, ty) { // tonalité / détonation grave
  const o = A.createOscillator(); o.type = ty || 'sine'; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
  const e = env(t, dur, g0); o.connect(e); e.connect(b); o.start(t); o.stop(t + dur + .02);
}
function fm(b, t, fc, fmod, idx, f1, dur, g0) { // synthèse FM (laser, railgun)
  const o = A.createOscillator(), m = A.createOscillator(), mg = A.createGain(), e = env(t, dur, g0);
  o.frequency.setValueAtTime(fc, t); o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
  m.frequency.value = fmod; mg.gain.setValueAtTime(idx, t); mg.gain.exponentialRampToValueAtTime(1, t + dur);
  m.connect(mg); mg.connect(o.frequency); o.connect(e); e.connect(b); o.start(t); m.start(t); o.stop(t + dur + .02); m.stop(t + dur + .02);
}
function swell(b, t, f0, f1, dur, g0, ty) { // montée en puissance (recharge d'énergie, rotation)
  const o = A.createOscillator(); o.type = ty || 'sine'; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
  const e = A.createGain(); e.gain.setValueAtTime(.0008, t); e.gain.exponentialRampToValueAtTime(g0, t + dur * .85); e.gain.exponentialRampToValueAtTime(.0008, t + dur + .02);
  o.connect(e); e.connect(b); o.start(t); o.stop(t + dur + .05);
}
const ring = (b, t, f, dur, g) => { tn(b, t, f, f * .995, dur, g); tn(b, t, f * 2.76, f * 2.74, dur * .55, g * .4); }; // résonance métallique inharmonique
const click = (b, t, f) => { nz(b, t, .03, 'bandpass', f || 3500, 3, .5); tn(b, t, (f || 3500) * .7, (f || 3500) * .5, .04, .1); };
const thunk = (b, t, f) => { nz(b, t, .07, 'lowpass', 900, 1, .8); tn(b, t, f || 160, 70, .09, .55); nz(b, t, .02, 'bandpass', 3000, 3, .3); };
const slide = (b, t, d, f0, f1, g) => sw(b, t, 'bandpass', f0 || 900, f1 || 2600, d || .08, g || .45);
const brass = (b, t) => { const f = rnd(2400, 3400); tn(b, t, f, f * .97, .1, .05); tn(b, t + .004, f * 2.4, f * 2.35, .05, .03); }; // douille qui tinte

/* profils : c=claquement [fréq, durée, gain, Q] · l=corps [fréq départ, fin, durée, gain] · b=grave [départ, fin, durée, gain] · rg=résonance · w=réverbération · e=écho · fast=allégé */
const PR = [
 {c:[3200,.06,.9,1.1], l:[2600,800,.09,.5], b:[230,80,.09,.7], w:.22, e:.1},                           // 0 Pistolet : sec et net
 {c:[2300,.09,1,1], l:[2000,520,.17,.85], b:[150,52,.15,.95], rg:[1650,.12,.1], w:.34, e:.2},        // 1 AK-47 : claquement métallique lourd
 {c:[1700,.15,1,.7], l:[1500,260,.3,1.15], b:[100,34,.3,1.2], w:.5, e:.3},                            // 2 Shotgun : énorme, pompe
 {c:[3600,.1,1,1.2], l:[1400,300,.38,1], b:[78,28,.5,1.25], rg:[2600,.3,.08], w:.8, e:.65},         // 3 Sniper : coup sec + gros écho
 {c:[3400,.05,.8,1.2], l:[2800,900,.06,.4], b:[240,95,.05,.5], w:.18, e:.04, fast:1},                // 4 Uzi : crépitement aigu
 {c:[2500,.1,1,.9], l:[1500,380,.22,.95], b:[110,40,.24,1.1], rg:[900,.35,.12], w:.5, e:.3},        // 5 Revolver : rond et lourd
 {c:[2800,.04,.7,1], l:[2000,800,.05,.45], b:[130,60,.06,.6], w:.14, e:.03, fast:1},                 // 6 Minigun : rafale serrée
 0, 0, 0,                                                                                            // 7 Bazooka · 8 Laser · 9 Flammes (spéciaux)
 {c:[2600,.08,1,1], l:[2200,600,.13,.7], b:[165,58,.12,.85], w:.3, e:.15},                          // 10 M4 : claquement net
 {c:[3700,.05,.8,1.2], l:[3000,1000,.06,.4], b:[260,100,.05,.5], w:.18, e:.04, fast:1},              // 11 P90 : pop aigu
 {c:[2100,.14,1,.8], l:[1500,330,.26,1], b:[92,36,.28,1.15], rg:[1100,.4,.12], w:.6, e:.45},        // 12 Desert Eagle : canon à main
 0, 0,                                                                                                // 13 Railgun · 14 Lance-grenades (spéciaux)
 {c:[1900,.11,.95,.8], l:[1700,360,.2,.95], b:[112,42,.2,1], w:.4, e:.2}                             // 15 AA-12 : pompe automatique
];
const BRASS = [0, 1, 2, 3, 4, 5, 6, 10, 11, 12, 15];
function shot(x, y, wi, mine) {
  if (!init()) return;
  const t = A.currentTime + .004, dx = x - (me.x + 10), d = Math.hypot(dx, y - (me.y + 19)), near = clamp(1 - d / 1700, 0, 1);
  let v = mine ? 1 : Math.pow(near, 1.6); if (v < .03) return;
  if (!mine) { if (t > wt) { wt = t + .1; wc = 0; } if (++wc > 5) return; } // pas plus de 5 sons / 0,1 s pour les autres
  const sil = mine && window.XS && XS.sil; if (sil) v *= .22;
  M.gain.value = ST.vol * .9;
  const j = rnd(.94, 1.07), p = PR[wi], fast = p && p.fast, wet = (p ? p.w : .4) + (1 - near) * .3, ec = ((p ? p.e : .35) || 0) * (mine ? 1 : .7) * (sil ? .2 : 1),
    b = bus(v * rnd(.92, 1.05), clamp(dx / 900, -1, 1), wet, ec, mine ? 20000 : 900 + 15000 * near * near);
  if (p) {
    if (!sil) nz(b, t, p.c[1], 'bandpass', p.c[0] * j, p.c[3], p.c[2]);
    nz(b, t, .004, 'highpass', 6000, .7, sil ? .25 : 1.1); // transitoire de la détente
    sw(b, t, 'lowpass', p.l[0] * j, p.l[1], p.l[2], p.l[3] * (sil ? .45 : 1));
    tn(b, t, p.b[0] * j, p.b[1], p.b[2], p.b[3] * (sil ? .5 : 1));
    if (!fast) tn(b, t, p.b[0] * 2 * j, p.b[1] * 1.6, p.b[2] * .5, p.b[3] * .25, 'triangle'); // harmonique : plus de présence
    if (p.rg && !sil) ring(b, t + .002, p.rg[0] * j, p.rg[1], p.rg[2]);
    if (wi == 2) { slide(b, t + .46, .09, 800, 2400, .5); click(b, t + .55, 2800); thunk(b, t + .6, 120); } // pompe : « tchak-tchak »
    if (wi == 3) { click(b, t + .42, 3200); slide(b, t + .5, .1, 700, 1800, .4); thunk(b, t + .66, 140); click(b, t + .7, 2600); } // culasse
    if (wi == 5 || wi == 12) click(b, t + .42, 3000);
    if (BRASS.includes(wi) && Math.random() < (fast ? .25 : .8)) brass(b, t + rnd(.25, .45)); // douille
  }
  else if (wi == 7) { // Bazooka : départ du tube, souffle arrière, moteur de fusée
    nz(b, t, .06, 'lowpass', 900, .7, 1); tn(b, t, 85, 26, .55, 1.3); tn(b, t, 170, 50, .25, .5, 'triangle');
    sw(b, t + .02, 'lowpass', 2500, 280, .7, .85); sw(b, t + .05, 'bandpass', 700, 3200, .6, .5); sw(b, t + .08, 'highpass', 3000, 1500, .5, .22); nz(b, t, .1, 'highpass', 3000, .7, .6);
  }
  else if (wi == 8) { // Laser : « pew » FM + scintillement
    fm(b, t, 2000 * j, 330, 900, 240, .26, .32); tn(b, t, 2600 * j, 180, .2, .22, 'sawtooth'); tn(b, t, 1300 * j, 120, .26, .22, 'square');
    tn(b, t + .01, 3800, 2600, .12, .1); nz(b, t, .02, 'highpass', 6000, .7, .5); sw(b, t, 'bandpass', 5000, 1500, .18, .18);
  }
  else if (wi == 9) { // Lance-flammes : souffle + crépitement
    sw(b, t, 'lowpass', 700, 1900, .16, .6); sw(b, t, 'bandpass', 2600, 1200, .14, .2); tn(b, t, 75, 50, .16, .3, 'sawtooth');
    for (let i = 0; i < 3; i++) nz(b, t + rnd(0, .1), .012, 'highpass', 3000, .7, .15);
  }
  else if (wi == 13) { // Railgun : zap FM + claquement supersonique + gros choc
    fm(b, t, 3800, 700, 1400, 90, .38, .42); nz(b, t, .02, 'highpass', 6000, .7, 1); tn(b, t, 120, 30, .55, 1.25); tn(b, t, 240, 60, .3, .4, 'triangle');
    sw(b, t, 'bandpass', 6000, 600, .38, .5); ring(b, t + .02, 2200, .3, .1); for (let i = 0; i < 4; i++) nz(b, t + .06 + i * rnd(.03, .07), .015, 'highpass', 5000, .7, .22);
  }
  else { // 14 Lance-grenades : « thoomp » grave + bloop
    tn(b, t, 170, 55, .22, .95); tn(b, t + .015, 440, 150, .13, .35, 'triangle'); nz(b, t, .05, 'lowpass', 1400, .7, .85); sw(b, t, 'lowpass', 900, 200, .32, .5); click(b, t + .18, 2200);
  }
}
function reload(e) {
  if (!init()) return;
  const t = A.currentTime + .01, dx = e.x - me.x, d = Math.hypot(dx, e.y - me.y), v = e === me ? .8 : Math.pow(clamp(1 - d / 800, 0, 1), 1.6) * .8; if (v < .03) return;
  M.gain.value = ST.vol * .9; const b = bus(v, clamp(dx / 900, -1, 1), .15, 0, e === me ? 20000 : 3500), D = W[e.wi].rl || 1.5, wi = e.wi;
  if (wi == 2) { for (let i = 0; i < 4; i++) { thunk(b, t + .15 + i * D / 5.5, 200); click(b, t + .2 + i * D / 5.5, 2600); } slide(b, t + D - .2, .08, 800, 2200, .5); thunk(b, t + D - .1, 130); click(b, t + D - .04, 3000); } // cartouches une à une + pompe
  else if (wi == 3) { click(b, t + .1, 3000); slide(b, t + .18, .12, 700, 1700, .4); thunk(b, t + D * .45, 170); click(b, t + D * .45 + .05, 3200); slide(b, t + D - .32, .1, 900, 2200, .4); thunk(b, t + D - .16, 140); click(b, t + D - .08, 2600); } // culasse
  else if (wi == 5) { click(b, t + .1, 2800); slide(b, t + .2, .1, 1200, 600, .3); for (let i = 0; i < 6; i++) click(b, t + D * .35 + i * .06, 3600 + i * 80); thunk(b, t + D - .2, 150); click(b, t + D - .08, 2400); } // barillet
  else if (wi == 6) { swell(b, t, 60, 520, D * .7, .1, 'sawtooth'); click(b, t + .12, 3000); thunk(b, t + D * .45, 160); click(b, t + D - .12, 3000); thunk(b, t + D - .05, 140); } // boîte de munitions + rotation
  else if (wi == 7 || wi == 14) { click(b, t + .1, 2000); slide(b, t + .15, .12, 600, 1400, .4); thunk(b, t + D * .5, 90); thunk(b, t + D * .5 + .06, 160); click(b, t + D - .15, 2400); thunk(b, t + D - .05, 110); } // chargement du tube
  else if (wi == 8 || wi == 13) { swell(b, t + .1, 300, 2600, D * .8, .16, 'sine'); swell(b, t + .1, 150, 1300, D * .8, .08, 'sawtooth'); ring(b, t + D - .05, 1800, .14, .16); click(b, t + D - .02, 4200); } // recharge d'énergie
  else if (wi == 9) { click(b, t + .1, 1800); sw(b, t + .2, 'highpass', 3500, 1800, D * .6, .12); thunk(b, t + D * .5, 130); sw(b, t + D - .3, 'highpass', 4000, 2000, .25, .22); click(b, t + D - .08, 2200); } // bonbonne + veilleuse
  else { slide(b, t + .1, .07, 1200, 2400, .35); click(b, t + .12, 3200); thunk(b, t + D * .45, 160); click(b, t + D * .45 + .05, 3600); slide(b, t + D - .24, .09, 1000, 2600, .45); click(b, t + D - .15, 3000); thunk(b, t + D - .08, 140); } // chargeur + culasse
}
function blast(x, y) {
  if (!init()) return;
  const t = A.currentTime + .004, dx = x - (me.x + 10), d = Math.hypot(dx, y - (me.y + 19)), n = clamp(1 - d / 2400, 0, 1), v = Math.pow(n, 1.3); if (v < .03) return;
  M.gain.value = ST.vol * .9; const b = bus(v * 1.1, clamp(dx / 1200, -1, 1), .9, .5, 1200 + 17000 * n * n);
  nz(b, t, .16, 'bandpass', 1500, .8, 1); nz(b, t, .008, 'highpass', 5000, .7, 1.1); sw(b, t, 'lowpass', 1800, 110, 1.4, 1.25);
  tn(b, t, 68, 22, 1.1, 1.5); tn(b, t, 150, 40, .4, .8); tn(b, t + .02, 38, 24, 1.3, .7); sw(b, t + .1, 'lowpass', 400, 60, 1.6, .7); // fireball + sub + grondement
  for (let i = 0; i < 8; i++) nz(b, t + .15 + Math.random() * 1.1, .04, 'bandpass', rnd(1500, 4500), 2, rnd(.12, .32)); // débris
}
function hit(dm, hd) { // bruit de touche : tick net ; headshot : « ding » cristallin
  if (!init()) return; const t = A.currentTime, b = bus(.55, 0, hd ? .3 : .08, 0, 20000); M.gain.value = ST.vol * .9; if (t < hitT) return; hitT = t + .03;
  if (hd) { tn(b, t, 1568, 1500, .14, .3); tn(b, t + .05, 2349, 2300, .24, .3); nz(b, t, .05, 'lowpass', 1400, 1, .5); ring(b, t + .05, 2349, .2, .08); }
  else { tn(b, t, 1900, 1300, .05, .25, 'triangle'); nz(b, t, .02, 'bandpass', 3000, 3, .35); nz(b, t, .05, 'lowpass', 700, 1, .25); }
}
function dry() { if (!init()) return; M.gain.value = ST.vol * .9; const t = A.currentTime, b = bus(.5, 0, .05, 0, 20000); click(b, t, 2600); tn(b, t + .004, 600, 400, .05, .12); } // arme vide
function swapSnd() { if (!init()) return; M.gain.value = ST.vol * .9; const t = A.currentTime, b = bus(.5, 0, .05, 0, 20000); slide(b, t, .06, 900, 2200, .3); click(b, t + .05, 3000); thunk(b, t + .09, 220); }
const hook = (n, f) => { const o = window[n]; if (typeof o != 'function') return; window[n] = function (...a) { return f.call(this, o, ...a); }; };
const mute = (o, a, th) => { const v = ST.vol; ST.vol = 0; try { return o.apply(th, a); } finally { ST.vol = v; } }; // coupe l'ancien bip
hook('fire', function (o, id, x, y, a, wi, mine, q) { const r = mute(o, [id, x, y, a, wi, mine, q], this); try { shot(x, y, wi, !!mine); } catch (e) {} return r; });
hook('rel', function (o, e) { const b = e.rl; const r = o(e); try { if (b <= 0 && e.rl > 0) reload(e); } catch (x) {} return r; });
hook('boom', function (o, x, y, ow) { const r = mute(o, [x, y, ow], this); try { blast(x, y); } catch (e) {} return r; });
hook('hitFx', function (o, d, hd, x, y) { const r = mute(o, [d, hd, x, y], this); try { hit(d, hd); } catch (e) {} return r; });
hook('swap', function (o, e) { const r = mute(o, [e], this); try { if (e === me) swapSnd(); } catch (x) {} return r; });
hook('shoot', function (o, e) { try { if (e === me && me.al && me.cd <= 0 && me.rl <= 0 && me.am[me.wi] <= 0 && performance.now() > dryT) { dryT = performance.now() + 280; dry(); } } catch (x) {} return o(e); });
window.MGSND = { shot, reload, blast, hit, dry };
})();
