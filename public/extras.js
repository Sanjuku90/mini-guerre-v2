/* Mini Guerre v6 — extensions : modes de jeu, atelier d'armes, killstreaks, éditeur de cartes.
   Chargé après le jeu : il « enveloppe » les fonctions existantes (hurt, die, begin, update…). */
(()=>{
'use strict';
const $=id=>document.getElementById(id),LS=(k,v)=>{try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}};
const hook=(n,f)=>{const o=window[n];window[n]=function(...a){return f.call(this,o,...a)}};
const X=window.XS={mode:0,sk:+LS('mgSk')||0,sil:LS('mgSil')==='1',mag:LS('mgMag')==='1',air:0,bombs:[],ksS:0,ci:null,gs:0};
const MODES=['Classique (premier à N kills)','🚩 Capture de drapeau','👑 Roi de la colline','⚔️ Deathmatch équipes (vies limitées)','🏝️ Battle Royale (zone qui rétrécit)','🧟 Zombies (vagues, coop)'];
const MDESC=['Le mode de toujours : atteins l’objectif de kills.','Vole le drapeau adverse et ramène-le au tien (3 captures). Équipes Bleue vs Rouge.','Reste seul sur la colline dorée : 1 point par seconde, 90 pour gagner.','Chaque équipe a un stock de vies. Plus de vies = plus de retour.','Une seule vie. La zone rouge se resserre : reste dedans, sois le dernier.','Survis aux vagues de zombies. 3 vies de renfort.'];
const TN=['Solo','Bleus','Rouges','Verts','Jaunes'];
const tmE=e=>e===me?me.team:(e.team|0),idOf=e=>e===me?'me':e.id;
const ents=()=>room?[['me',me],...Object.entries(RV)]:[['me',me],...bots.map(b=>[b.id,b])];
const alive=()=>ents().map(q=>q[1]);
const emit=(k,d)=>{if(room)room.emit(k,d).catch(()=>{})};
const lvf=t=>X.lv[t]==null?(room?15:10):X.lv[t];
const nm=id=>id==='me'?me.n:(RV[id]?RV[id].n:((bots.find(b=>b.id===id)||{}).n||'?'));

/* ---------- état des modes ---------- */
function minit(){X.t0=time;X.cyc=Math.floor(Date.now()/24e4);X.bombs=[];X.air=0;X.ksS=0;X.tm=0;X.sc={};X.fl=null;X.kz=null;X.kp={};X.lv={};X.Z=null;X.zid=0;X.R=0;
 const m=X.mode;
 if(m==1){const s=SP.slice().sort((a,b)=>a[0]-b[0]),a=s[0],b=s[s.length-1],mf=(t,p)=>({t,hx:p[0],hy:p[1],x:p[0],y:p[1],c:null,home:1,dt:0});X.fl=[null,mf(1,a),mf(2,b)];X.sc={1:0,2:0}}
 if(m==2){const c=BASE.filter(r=>r.w>=160&&r.w<=900&&r.h<=60&&r.y>150).sort((a,b)=>(Math.abs(a.x+a.w/2-WW/2)+Math.abs(a.y-WH/2)*.6)-(Math.abs(b.x+b.w/2-WW/2)+Math.abs(b.y-WH/2)*.6))[0];X.kz=c?{x:c.x+c.w/2-140,y:c.y-170,w:280,h:170}:{x:WW/2-140,y:WH/2-100,w:280,h:170}}
 if(m==5)X.Z={w:0,q:0,st:0,gap:2,lv:3,dead:0};
 if(m==5)bots=bots.filter(b=>!b.z);
}
function finish(rows){if(endT>0)return;endT=10;endRes=rows;snd(520,.4,.08,'triangle');banner(rows[0]&&rows[0].me?'🏆 VICTOIRE':'Manche terminée',rows[0]&&rows[0].me?'#ffd23f':'#fff')}
const rowsOf=o=>Object.keys(o).map(k=>{const t=+k;return{n:isNaN(t)?(k=='pme'?me.n:nm(k.slice(1))):TN[t],v:Math.floor(o[k]),c:isNaN(t)?'#fff':TC[t],me:isNaN(t)?k=='pme':t===me.team}}).sort((a,b)=>b.v-a.v);

/* ---------- Capture de drapeau ---------- */
const retf=f=>{f.c=null;f.home=1;f.x=f.hx;f.y=f.hy};
function dropf(f,x,y,notify){f.c=null;f.x=x;f.y=y;f.dt=time;f.home=0;if(notify)emit('xf',{a:'d',f:f.t,x:x|0,y:y|0})}
function capf(t,o,notify){X.sc[t]=(X.sc[t]||0)+1;retf(o);banner('🚩 '+TN[t]+' marque !',TC[t]);snd(880,.3,.08,'triangle');if(notify)emit('xf',{a:'c',f:o.t})}
function ctf(dt){const F=X.fl;
 for(const f of F){if(!f)continue;const cr=f.c?(f.c==='me'?me:RV[f.c]||bots.find(b=>b.id===f.c)):null;
  if(f.c&&(!cr||!cr.al)){f.c=null;f.dt=time}else if(cr){f.x=cr.x+10;f.y=cr.y+14;f.home=0}
  if(!f.c&&!f.home&&time-f.dt>15)retf(f)}
 for(const e of(room?[me]:[me,...bots])){if(!e.al)continue;const t=tmE(e),id=idOf(e);
  for(const f of F){if(!f||Math.hypot(e.x+10-f.x,e.y+19-f.y)>38)continue;
   if(f.t!==t){if(!f.c){f.c=id;f.home=0;emit('xf',{a:'t',f:f.t});feed(e.n+' prend le drapeau !');snd(700,.15,.06,'triangle')}}
   else if(!f.home&&!f.c){retf(f);if(e===me)emit('xf',{a:'r',f:f.t});feed(e.n+' ramène son drapeau')}
   else if(f.home){const o=F[3-f.t];if(o&&o.c===id)capf(t,o,e===me)}}}}

/* ---------- Roi de la colline ---------- */
function koth(dt){const z=X.kz,own=[];
 for(const[id,e]of ents()){if(e.al&&e.x+10>z.x&&e.x+10<z.x+z.w&&e.y+19>z.y&&e.y+19<z.y+z.h)own.push(tmE(e)||('p'+id))}
 const u=[...new Set(own)];X.kh=u.length==1?u[0]:(u.length?'?':null);
 if(u.length==1)X.kp[u[0]]=(X.kp[u[0]]||0)+dt}

/* ---------- Battle Royale ---------- */
function br(dt){const t=room?(Date.now()-X.cyc*24e4)/1e3:time-X.t0,s=clamp((t-25)/110,0,1),R0=Math.hypot(WW,WH)*.52;X.R=R0+(150-R0)*s;X.zx=WW/2;X.zy=WH/2;X.s=s;X.t=t;
 if((!room&&t>200)||(room&&Math.floor(Date.now()/24e4)!==X.cyc)){newMatch();return}
 for(const e of(room?[me]:[me,...bots]))if(e.al&&Math.hypot(e.x+10-X.zx,e.y+19-X.zy)>X.R){e.hp-=(3+9*s)*dt;if(e===me)vig=Math.max(vig,.35);if(e.hp<=0)die(e,'zone')}}

/* ---------- Zombies ---------- */
function mkZ(){const b=mk('z'+(X.zid++),'Zombie',['#6bbf59','#8fd16b','#4f9a45'][X.zid%3],1);b.z=1;b.cl=0;spawn(b);b.mh=b.hp=30+9*X.Z.w;b.cs=.5+Math.min(.45,.03*X.Z.w);b.wi=0;b.inv=0;bots.push(b)}
function zomb(dt){const Z=X.Z;Z.alive=bots.filter(b=>b.z&&b.al).length;
 if(Z.q>0){Z.st-=dt;if(Z.st<=0&&Z.alive<14){mkZ();Z.q--;Z.st=Math.max(.35,1.2-Z.w*.05)}}
 else if(!Z.alive){Z.gap-=dt;if(Z.gap<=0){Z.w++;Z.q=4+Z.w*3;Z.gap=4;Z.st=0;banner('🧟 Vague '+Z.w,'#7CFC00')}}
 bots=bots.filter(b=>!b.z||b.al);
 if(room)for(let i=bl.length-1;i>=0;i--){const b=bl[i];if(b.o!=='me')continue;for(const z of bots)if(z.al&&inr(b,z)){const hd=b.y<z.y+13;hurt(z,b.d*(hd?1.5:1),'me',hd);sp(b.x,b.y,'#7f7',6);bl.splice(i,1);break}}}
hook('aiIn',function(o,b,dt){if(!b.z)return o(b,dt);const i={mx:0,jet:0,a:0,fire:0};if(!me.al)return i;
 const dx=me.x-b.x,dy=me.y-b.y;i.mx=Math.abs(dx)>14?Math.sign(dx):0;i.a=Math.atan2(dy,dx);
 if(dy<-40||(i.mx&&b.g&&Math.abs(b.vx)<30))i.jet=1;
 b.mc=(b.mc||0)-dt;if(Math.hypot(dx,dy)<34&&b.mc<=0){b.mc=.8;hurt(me,10+X.Z.w,b.id)}return i});
hook('boom',function(o,x,y,s){o(x,y,s);if(room&&X.mode==5)for(const z of bots)if(z.z&&z.al){const d=Math.hypot(z.x+10-x,z.y+19-y);if(d<140)hurt(z,Math.max(15,95*(1-d/140)),s)}});

/* ---------- boucle des modes ---------- */
function check(dt){const m=X.mode,A=alive();X.tm+=dt;
 if(m==1&&(X.sc[1]>=3||X.sc[2]>=3))finish(rowsOf(X.sc));
 if(m==2){const k=Object.keys(X.kp).find(k=>X.kp[k]>=90);if(k)finish(rowsOf(X.kp))}
 if(m==3&&X.tm>3){const T=[...new Set(A.map(tmE))],rem=T.filter(t=>!(lvf(t)<=0&&!A.some(e=>tmE(e)===t&&e.al)));
  if(T.length>1&&rem.length<=1){const o={};T.forEach(t=>o[t]=Math.max(0,lvf(t)));finish(rowsOf(o))}}
 if(m==4&&X.tm>8&&A.length>1){const L=A.filter(e=>e.al);if(L.length<=1)finish([{n:L[0]?L[0].n:'Personne',v:1,c:'#ffd23f',me:L[0]===me}])}
 if(m==5&&X.Z.dead)finish([{n:'Vague atteinte',v:X.Z.w,c:'#7CFC00',me:1},{n:'Zombies tués',v:me.k,c:'#fff',me:0}])}
hook('matchCheck',function(o,dt){if(endT>0||!X.mode)return o(dt);check(dt)});
hook('newMatch',function(o){o();if(X.mode==5)bots=[];minit()});
hook('begin',function(o,m){const s=$('gmode');X.mode=s?+s.value|0:0;LS('mgG',X.mode);o(m);
 if(X.mode)LIM=0;
 if(!m&&(X.mode==1||X.mode==3)){me.team=1;me.c=TC[1];bots=bots.slice(0,2);bots.forEach(b=>{b.team=2;b.c=TC[2]})}
 if(X.mode==5)bots=[];
 minit();wire()});
hook('die',function(o,e,s){o(e,s);const m=X.mode;
 if(m==1&&X.fl)for(const f of X.fl)if(f&&f.c===idOf(e))dropf(f,e.x+10,e.y+30,e===me);
 if(m==3&&!room){const t=tmE(e);X.lv[t]=lvf(t)-1}
 if(m==5){if(e===me){if(X.Z.lv>0)X.Z.lv--;else X.Z.dead=1}
  if(e.z){e.rt=1e9;if(room&&s==='me'){me.k++;myKill(e.n)}}}});
function wire(){if(!room||room._x)return;room._x=1;
 room.on('xf',m=>{if(m.isMe||!X.fl)return;const d=m.data||{},f=X.fl[d.f|0];if(!f)return;
  if(d.a==='t'){f.c=m.peer;f.home=0;feed(pn(m.peer)+' prend le drapeau !')}
  else if(d.a==='d'){f.c=null;f.home=0;f.x=+d.x;f.y=+d.y;f.dt=time}
  else if(d.a==='r')retf(f);
  else if(d.a==='c'){const t=tmOf(m.peer);X.sc[t]=(X.sc[t]||0)+1;retf(f);banner('🚩 '+TN[t]+' marque !',TC[t])}});
 room.on('kill',m=>{if(X.mode!=3)return;const t=m.isMe?me.team:tmOf(m.peer);X.lv[t]=lvf(t)-1});
 room.on('xa',m=>{if(m.isMe)return;const x=+(m.data||{}).x;if(isFinite(x))strike(x,m.peer)})}

/* ---------- killstreaks : drone espion (3), frappe aérienne (5 et 10) ---------- */
function strike(x0,o){for(let i=0;i<9;i++){const x=x0-240+i*60+Math.random()*20;let y=WH+50;for(const s of SO)if(x>=s.x&&x<=s.x+s.w&&s.y>0&&s.y<y)y=s.y;X.bombs.push({x,y:y-4,t:.9+i*.18,o})}snd(200,.8,.1,'sawtooth')}
function air(){if(!me.al||X.air<=0||endT>0||LD>0)return;X.air--;const x=me.x+10+(Math.cos(me.a)>=0?1:-1)*280;strike(x,'me');emit('xa',{x:x|0});banner('✈️ Frappe aérienne !','#ff9f1c')}
function streaks(dt){if(ks<X.ksS)X.ksS=ks;
 if(ks>X.ksS){X.ksS=ks;if(ks==3){me.dr=Math.max(me.dr,10);banner('🛰️ Drone espion (série de 3)','#4cc9f0')}if(ks==5||ks==10){X.air++;banner('✈️ Frappe aérienne prête — touche H','#ff9f1c')}}
 for(let i=X.bombs.length-1;i>=0;i--){const b=X.bombs[i];if((b.t-=dt)<=0){X.bombs.splice(i,1);boom(b.x,b.y,b.o)}}
 const ba=$('xair');ba.style.display=X.air>0&&me.al?'block':'none';ba.textContent='✈️ ×'+X.air}
addEventListener('keydown',e=>{if(e.code==='KeyH'&&!e.repeat&&run&&!/INPUT|SELECT|TEXTAREA/.test((document.activeElement||{}).tagName||''))air()});

hook('update',function(o,dt){o(dt);if(!run||LD>0)return;streaks(dt);if(endT>0)return;
 const m=X.mode;if(!m)return;
 if(m==1&&X.fl)ctf(dt);if(m==2)koth(dt);if(m==4)br(dt);if(m==5)zomb(dt);
 const stay=e=>m==3?lvf(tmE(e))<=0:m==4?1:(m==5&&e===me)?X.Z.dead:0;
 if(!me.al&&stay(me))me.rt=99;for(const b of bots)if(!b.al&&!b.z&&stay(b))b.rt=99});

/* ---------- affichage des modes ---------- */
hook('hud',function(o){o();if(!run)return;const m=X.mode;let t='';
 if(m==1&&X.fl){const mine=X.fl.find(f=>f&&f.c==='me');t='🚩 Bleus '+X.sc[1]+' – '+X.sc[2]+' Rouges · premier à 3'+(mine?' · TU PORTES LE DRAPEAU !':'')}
 else if(m==2)t='👑 '+(X.kh?(X.kh=='?'?'Colline contestée':'Tenue par '+(isNaN(+X.kh)?(X.kh=='pme'?me.n:nm(X.kh.slice(1))):TN[+X.kh])):'Colline libre')+' · '+rowsOf(X.kp).slice(0,2).map(r=>r.n+' '+r.v).join(' · ');
 else if(m==3)t='⚔️ Vies — '+[...new Set(alive().map(tmE))].map(k=>(room||k?TN[k]:'Toi')+' '+Math.max(0,lvf(k))).join(' · ');
 else if(m==4)t='🏝️ Vivants '+alive().filter(e=>e.al).length+' · '+(X.s>0?'zone rétrécit':'zone dans '+Math.max(0,Math.ceil(25-X.t))+' s');
 else if(m==5&&X.Z)t='🧟 Vague '+X.Z.w+' · restants '+((X.Z.q||0)+(X.Z.alive||0))+' · renforts '+X.Z.lv;
 if(t)pill(Wd/2,34,t,'#ffd27a',20);
 if(X.air>0&&me.al)pill(Wd/2,Ht-70,'✈️ Frappe aérienne prête — touche H','#ff9f1c',22)});
hook('fxDraw',function(o){o();const m=X.mode;g.save();
 if(m==1&&X.fl)for(const f of X.fl){if(!f)continue;g.strokeStyle='rgba(255,255,255,.3)';g.setLineDash([6,6]);g.beginPath();g.arc(f.hx,f.hy-4,30,0,7);g.stroke();g.setLineDash([]);
  g.fillStyle='#ddd';g.fillRect(f.x-1.5,f.y-52,3,52);g.fillStyle=TC[f.t];const w=Math.sin(time*5)*4;g.beginPath();g.moveTo(f.x+1.5,f.y-52);g.lineTo(f.x+30,f.y-46+w);g.lineTo(f.x+1.5,f.y-30);g.fill()}
 if(m==2&&X.kz){const z=X.kz,c=X.kh&&X.kh!='?'?(isNaN(+X.kh)?'#ffd23f':TC[+X.kh]):'#ffd23f';g.globalAlpha=.14+.05*Math.sin(time*3);g.fillStyle=c;g.fillRect(z.x,z.y,z.w,z.h);g.globalAlpha=.9;g.strokeStyle=c;g.lineWidth=3;g.setLineDash([14,8]);g.strokeRect(z.x,z.y,z.w,z.h)}
 if(m==4&&X.R){g.beginPath();g.rect(camL-80,camT-80,Wd/sc+160,Ht/sc+160);g.moveTo(X.zx+X.R,X.zy);g.arc(X.zx,X.zy,X.R,0,7);g.fillStyle='rgba(255,40,40,.2)';g.fill('evenodd');g.strokeStyle='rgba(255,90,90,.9)';g.lineWidth=5;g.beginPath();g.arc(X.zx,X.zy,X.R,0,7);g.stroke()}
 for(const b of X.bombs){const py=b.y-Math.min(b.t,.9)*1400;g.fillStyle='rgba(255,80,40,.55)';g.fillRect(b.x-2,b.y-14,4,14);if(b.t<.9){g.fillStyle='#222';g.fillRect(b.x-5,py-18,10,18);g.fillStyle='#ff5030';g.fillRect(b.x-2,py,4,6)}}
 g.restore()});

/* ---------- armes : skins, silencieux, chargeur étendu ---------- */
const SKINS=[['Standard',null],['Néon','#00e5ff'],['Or','#ffd23f'],['Camouflage','#6b8e23'],['Rubis','#ff2e4d'],['Arc-en-ciel','rainbow']].concat(window.MGWS?MGWS.list.map(q=>[q[0],null]):[]);
hook('ent',function(o,e,m){X.me=!!m;o(e,m)});
hook('gun',function(o,c,wi,fl,hand){o(c,wi,fl,hand);if(!X.me)return;const tx=X.sk>=1&&window.MGWS&&MGWS.skin,s=tx||X.sk>=6?null:SKINS[X.sk][1];c.save();if(tx)MGWS.skin(c,wi,X.sk,time);else if(X.sk>=6&&window.MGWS)MGWS.draw(c,wi,X.sk,time);
 if(s){c.fillStyle=s=='rainbow'?'hsl('+((time*120)%360|0)+',90%,60%)':s;c.fillRect(7,-4.5,GTIP[wi]-14,1.4);c.fillRect(GTIP[wi]-8,-.8,6,1.2);c.fillRect(9,.6,4,1.2)}
 if(X.sil){c.fillStyle='#15171c';c.fillRect(GTIP[wi]-3,-5.4,10,5.4);c.fillStyle='#3a3f4c';c.fillRect(GTIP[wi]-3,-5.4,10,1.2)}
 if(X.mag&&wi>0){c.fillStyle='#22252d';c.fillRect(13,2,6,10);c.fillStyle='#3a3f4c';c.fillRect(13,2,6,1.2)}c.restore()});
hook('fire',function(o,...a){if(a[5]&&X.sil){const v=ST.vol;ST.vol=v*.2;try{return o(...a)}finally{ST.vol=v}}return o(...a)});
const bump=()=>{me.am=me.am.map((v,k)=>v===W[k].mag?Math.round(W[k].mag*1.5):v)};
hook('spawn',function(o,e){o(e);if(e===me&&X.mag)bump()});
hook('step',function(o,e,dt,i){const r=e===me&&me.rl>0;o(e,dt,i);if(r&&me.rl<=0&&X.mag)bump()});

/* ---------- éditeur de cartes + codes de partage ---------- */
const b36=n=>n.toString(36),pk=a=>a.map(q=>q.map(v=>b36(Math.max(0,Math.round(v/20)))).join(',')).join('~');
const enc=o=>'MG1.'+[o.t,o.pit?1:0,o.w/20,o.h/20].map(b36).join('.')+'.'+pk(o.r)+'.'+pk(o.sp);
function dec(c){try{const p=String(c).trim().split('.');if(p.length!==7||p[0]!=='MG1')return null;const n=p.slice(1,5).map(v=>parseInt(v,36)),u=s=>s?s.split('~').map(q=>q.split(',').map(v=>parseInt(v,36)*20)):[];
 if(n.some(isNaN)||n[0]<0||n[0]>=TH.length)return null;const w=clamp(n[2]*20,1000,4000),h=clamp(n[3]*20,800,2000),r=u(p[5]).filter(q=>q.length==4&&q.every(isFinite)&&q[2]>0&&q[3]>0).slice(0,80),sp=u(p[6]).filter(q=>q.length==2&&q.every(isFinite)).slice(0,24);
 return fix({t:n[0],pit:n[1]?1:0,w,h,r,sp})}catch(e){return null}}
function fix(o){if(o.sp.length<2)o.sp=o.r.slice(0,4).map(q=>[q[0]+q[2]/2,q[1]]).concat([[300,o.h-100],[o.w-300,o.h-100]]).slice(0,Math.max(2,o.r.length));return o}
function install(o,code,sel){const m={n:'Carte perso',e:'🛠️',d:'Carte créée dans l’éditeur de cartes. Code de partage : '+(code||enc(o)),tg:['Perso','Code'],m:0,w:o.w,h:o.h,t:o.t,pit:o.pit?1:0,r:o.r,sp:o.sp};
 if(X.ci==null){X.ci=MAPS.length;MAPS.push(m);const b=document.createElement('button');b.className='th';b.innerHTML='<canvas width="208" height="117"></canvas><em>'+(X.ci+1)+'</em><b>🛠️ Carte perso</b>';b.onclick=()=>selectMap(X.ci);$('ths').appendChild(b)}else MAPS[X.ci]=m;
 preview(document.querySelectorAll('.th')[X.ci].firstChild,X.ci);if(sel)selectMap(X.ci);LS('mgMap',code||enc(o))}
const E={w:2400,h:1200,t:0,pit:0,r:[],sp:[],tool:'p',d:null},SZ=[[2400,1200],[2800,1300],[3200,1500]];let ec,ex,es=1,eox=0,eoy=0;
function eOpen(){const m=X.ci!=null?MAPS[X.ci]:null;if(m){E.w=m.w;E.h=m.h;E.t=m.t;E.pit=m.pit|0;E.r=m.r.map(q=>q.slice());E.sp=m.sp.map(q=>q.slice())}
 else{E.w=2400;E.h=1200;E.t=0;E.pit=0;E.r=[[200,900,400,20],[900,760,300,20],[1500,900,400,20],[800,420,300,20]];E.sp=[[300,900],[1700,900],[1000,760],[950,420]]}
 $('xe').style.display='flex';eRs()}
function eRs(){ec=$('xcv');const r=ec.getBoundingClientRect();ec.width=r.width;ec.height=r.height;ex=ec.getContext('2d');es=Math.min(ec.width/E.w,ec.height/E.h);eox=(ec.width-E.w*es)/2;eoy=(ec.height-E.h*es)/2;eDraw()}
function eDraw(){if(!ex)return;const c=ex;c.setTransform(1,0,0,1,0,0);sky(c,ec.width,ec.height,E.t,0,1);c.save();c.translate(eox,eoy);c.scale(es,es);
 if(E.pit)drawPit(c,E.t,0,E.w,E.h,0);else platAt(c,{x:0,y:E.h-100,w:E.w,h:100},E.t);E.r.forEach(q=>platAt(c,{x:q[0],y:q[1],w:q[2],h:q[3]},E.t));
 c.strokeStyle='rgba(255,255,255,.5)';c.lineWidth=3/es;c.strokeRect(0,0,E.w,E.h);
 for(const q of E.sp){c.fillStyle='#ffd23f';c.beginPath();c.arc(q[0],q[1]-20,16,0,7);c.fill();c.fillStyle='#111';c.font='bold 22px system-ui';c.textAlign='center';c.fillText('S',q[0],q[1]-12)}
 if(E.d){const d=E.d;c.strokeStyle='#4cc9f0';c.lineWidth=3/es;c.strokeRect(Math.min(d.x0,d.x1),Math.min(d.y0,d.y1),Math.abs(d.x1-d.x0),Math.abs(d.y1-d.y0))}
 c.restore();c.fillStyle='#fff';c.font='700 13px system-ui';c.textAlign='left';c.fillText(E.w+'×'+E.h+' · '+E.r.length+' plateformes · '+E.sp.length+' spawns · outil : '+({p:'plateforme',s:'spawn',e:'gomme'})[E.tool],10,ec.height-10)}
const ep=ev=>{const r=ec.getBoundingClientRect(),sn=v=>Math.round(v/20)*20;return[clamp(sn((ev.clientX-r.left-eox)/es),0,E.w),clamp(sn((ev.clientY-r.top-eoy)/es),0,E.h)]};
function eBind(){const c=$('xcv');
 c.onpointerdown=ev=>{c.setPointerCapture(ev.pointerId);const[x,y]=ep(ev);
  if(E.tool=='p')E.d={x0:x,y0:y,x1:x,y1:y};
  else if(E.tool=='e'){let i=-1;E.r.forEach((q,k)=>{if(x>=q[0]-10&&x<=q[0]+q[2]+10&&y>=q[1]-10&&y<=q[1]+q[3]+10)i=k});const s=E.sp.findIndex(q=>Math.hypot(q[0]-x,q[1]-20-y)<40);if(s>=0)E.sp.splice(s,1);else if(i>=0)E.r.splice(i,1)}
  else{let by=E.pit?1e9:E.h-100;for(const q of E.r)if(x>=q[0]&&x<=q[0]+q[2]&&q[1]>=y-40&&q[1]<by)by=q[1];if(by<1e9&&E.sp.length<24)E.sp.push([x,by])}eDraw()};
 c.onpointermove=ev=>{if(E.d){const[x,y]=ep(ev);E.d.x1=x;E.d.y1=y;eDraw()}};
 c.onpointerup=()=>{const d=E.d;E.d=null;if(d){let x=Math.min(d.x0,d.x1),y=Math.min(d.y0,d.y1),w=Math.abs(d.x1-d.x0),h=Math.abs(d.y1-d.y0);if(w>=40&&E.r.length<80){if(h<30)h=20;E.r.push([x,y,w,h])}}eDraw()}}
const cur=()=>({t:E.t,pit:E.pit,w:E.w,h:E.h,r:E.r.map(q=>q.slice()),sp:E.sp.map(q=>q.slice())});
function eAct(k){
 if(k=='th'){E.t=(E.t+1)%TH.length}
 else if(k=='sz'){const i=(SZ.findIndex(s=>s[0]==E.w)+1)%SZ.length;E.w=SZ[i][0];E.h=SZ[i][1];E.r=E.r.filter(q=>q[0]<E.w&&q[1]<E.h);E.sp=E.sp.filter(q=>q[0]<E.w&&q[1]<E.h);eRs();return}
 else if(k=='pt'){E.pit=E.pit?0:1}
 else if(k=='cl'){if(confirm('Tout effacer ?')){E.r=[];E.sp=[]}}
 else if(k=='code'){const c=enc(fix(cur()));try{navigator.clipboard.writeText(c)}catch(e){}prompt('Code de ta carte (copié si possible) — envoie-le à tes amis :',c)}
 else if(k=='imp'){const o=dec(prompt('Colle un code de carte :')||'');if(!o){alert('Code invalide.');return}E.w=o.w;E.h=o.h;E.t=o.t;E.pit=o.pit;E.r=o.r;E.sp=o.sp;eRs();return}
 else if(k=='save'||k=='test'){const o=fix(cur());if(!o.r.length){alert('Ajoute au moins une plateforme.');return}install(o,null,1);$('xe').style.display='none';if(k=='test')$('bs').click();return}
 else if(k=='x'){$('xe').style.display='none';return}
 eDraw()}

/* ---------- interface : menu, atelier d'armes, éditeur ---------- */
function ui(){
 const css=document.createElement('style');css.textContent='#xe,#xw{position:fixed;inset:0;z-index:95;display:none;flex-direction:column;background:#0b1020;color:#fff;font:600 13px system-ui,sans-serif}#xw{align-items:center;justify-content:center;background:rgba(3,6,16,.9)}#xw>div{background:#16213f;border-radius:14px;padding:18px;width:min(92vw,360px);display:grid;gap:10px}#xe .bar{display:flex;gap:6px;padding:6px;flex-wrap:wrap;background:#121a33}#xe .bar button,#xw button{padding:8px 10px;font-size:12px;border-radius:8px}#xe .bar button.on{background:#ffb020;color:#111}#xcv{flex:1;width:100%;touch-action:none;min-height:0}#xair{position:fixed;right:14px;bottom:130px;z-index:40;display:none;padding:12px 14px;border-radius:12px;font-weight:900;background:#ff9f1c;color:#111}';document.head.appendChild(css);
 const bs=$('bs'),sel=document.createElement('div');
 sel.innerHTML='<div class="fl">Mode de jeu</div><select id="gmode">'+MODES.map((m,i)=>'<option value="'+i+'">'+m+'</option>').join('')+'</select><div id="gmd" style="font-size:12px;color:#cdd6f4;margin:4px 0;min-height:28px"></div>'+
  '<div class="g2"><button id="xbw" class="s">🔫 Atelier d’armes</button></div>';
 bs.parentNode.insertBefore(sel,bs);
 const gm=$('gmode');gm.value=+LS('mgG')||0;const upd=()=>{$('gmd').textContent=MDESC[+gm.value]};gm.onchange=upd;upd();
 const w=document.createElement('div');w.id='xw';w.innerHTML='<div><b style="font-size:16px">🔫 Atelier d’armes</b><label>Skin d’arme<select id="xsk">'+SKINS.map((s,i)=>'<option value="'+i+'">'+s[0]+'</option>').join('')+'</select></label><label><input type="checkbox" id="xsi"> Silencieux (tirs presque muets)</label><label><input type="checkbox" id="xmg"> Chargeur étendu (+50 % de munitions)</label><small style="color:#aab">Séries de kills : 3 = 🛰️ drone espion · 5 et 10 = ✈️ frappe aérienne (touche H / bouton).</small><button id="xwo" class="big" style="margin:4px 0">OK</button></div>';document.body.appendChild(w);
 $('xsk').value=X.sk;$('xsi').checked=X.sil;$('xmg').checked=X.mag;
 $('xbw').onclick=()=>{w.style.display='flex'};$('xwo').onclick=()=>{X.sk=+$('xsk').value;X.sil=$('xsi').checked;X.mag=$('xmg').checked;LS('mgSk',X.sk);LS('mgSil',X.sil?1:0);LS('mgMag',X.mag?1:0);w.style.display='none'};
 const e=document.createElement('div');e.id='xe';e.innerHTML='<div class="bar"><button data-k="p" class="on">▭ Plateforme</button><button data-k="s">📍 Spawn</button><button data-k="e">🧽 Gomme</button><button data-a="th">🎨 Thème</button><button data-a="sz">📐 Taille</button><button data-a="pt">☠️ Vide</button><button data-a="cl">🗑️ Vider</button></div><canvas id="xcv"></canvas><div class="bar"><button data-a="test">▶ Tester</button><button data-a="save">💾 Utiliser</button><button data-a="code">📋 Code</button><button data-a="imp">📥 Importer</button><button data-a="x">✖ Fermer</button></div>';document.body.appendChild(e);
 e.querySelectorAll('button').forEach(b=>b.onclick=()=>{if(b.dataset.k){E.tool=b.dataset.k;e.querySelectorAll('[data-k]').forEach(q=>q.classList.toggle('on',q===b));eDraw()}else eAct(b.dataset.a)});
 eBind();addEventListener('resize',()=>{if(e.style.display=='flex')eRs()});
 
 const ba=document.createElement('button');ba.id='xair';ba.onclick=air;document.body.appendChild(ba);
 /* multijoueur : le mode et la carte perso font partie du nom de salle (tout le monde doit avoir les mêmes) */
 const bm=$('bm'),obm=bm.onclick,hs=s=>[...s].reduce((a,c)=>(a*31+c.charCodeAt(0))>>>0,7).toString(36);
 bm.onclick=async function(){const rc=$('rc'),v=rc.value;rc.value='g'+(+gm.value)+(X.ci!=null&&+$('mp').value===X.ci?'x'+hs(LS('mgMap')||''):'')+'-'+(v||'public');try{return await obm.apply(this,arguments)}finally{rc.value=v}};
 }
ui();
window.MGX={enc,dec,X};
})();
