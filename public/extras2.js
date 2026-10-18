/* Mini Guerre v7 — progression, boutique, profil, chat/pings, modération, ELO/tournoi, killcam.
   Chargé après extras.js. Les pièces/XP/ELO sont stockés sur l'appareil (localStorage). */
(()=>{
'use strict';
const $=id=>document.getElementById(id),LS=(k,v)=>{try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}};
const hook=(n,f)=>{const o=window[n];window[n]=function(...a){return f.call(this,o,...a)}};
const MX=window.MGX.X,emit=(k,d)=>{if(room)room.emit(k,d).catch(()=>{})};
const X2={prof:{},pg:[],em:[],buf:[],rc:0,rk:0,rkNext:0,T:null,best:null,kc:null,ended:0,arm:0,pn:-1,ps:0};
const flag=c=>String.fromCodePoint(...[...c].map(x=>0x1F1E6+x.charCodeAt(0)-65));
const FL=['FR','BE','CH','CA','US','GB','DE','ES','IT','PT','BR','MA','DZ','TN','SN','CI','JP','KR','CN','IN','AU','MX','AR','NL','PL','TR','EG','NG','ZA','SE'];
const loc=(((navigator.language||'fr-FR').split('-')[1]||'FR').toUpperCase().slice(0,2));
/* ---------- catalogue : [libellé, prix, valeur] ---------- */
const SKN=window.MGSK.list.length;
const CAT={
 kk:['Personnages',window.MGSK.list.map(q=>[q[0],q[1]])],
 av:['Avatars',[['🪖',0,0],['😎',100,0],['🤖',150,1],['👽',200,1],['🐱',120,0],['🦊',120,0],['💀',250,2],['🐲',300,2],['👑',500,3],
  ['🐸',100,0],['🐼',150,0],['🦉',250,1],['🐙',300,1],['🐺',350,2],['🦅',350,2],['🦂',350,2],['🦈',400,2],['🧟',400,2],['🥷',450,2],['🏴‍☠️',450,2],['🧛',500,2],
  ['🦄',600,3],['🦖',600,3],['😈',700,3],['👹',700,3],['👾',800,3],['🐉',1200,4],['🛸',1500,4],['💎',2000,4]]],
 co:['Couleurs',[['Aléatoire',0,null],['Rouge vif',80,'#ff3b30'],['Bleu roi',80,'#2f6bff'],['Menthe',80,'#2ee6a6'],['Violet',100,'#a45cff'],['Rose',100,'#ff5fa2'],['Orange',100,'#ff9500'],['Onyx',200,'#2b2b33'],['Or',400,'#ffd23f']]],
 tr:['Traînées de dash',window.MGFX.TR.map(t=>t?[t.n,t.p,t.chip]:['Aucune',0])],
 em:['Emotes',[['👍',0],['😂',0],['😡',0],['🔥',0],['🫡',60],['💀',60],['🎉',80],['❤️',80],['😎',80],['🤡',100],['👋',60],['GG',60],['👀',80],['😭',80],['🥶',80],['💪',100],['WOW',100],['🤯',120],['🥳',120],['😈',150],['⚡',200],['🏆',250]]],
 sk:['Skins d’arme',['Standard','Néon','Or','Camouflage','Rubis','Arc-en-ciel'].map((n,i)=>[n,[0,100,200,150,250,400][i]]).concat(window.MGWS?MGWS.list.map(q=>[q[0],q[1]]):[])],
 ti:['Titres',[['Recrue',0],['Chasseur (25 kills)',0,()=>P.k>=25],['Vétéran (10 parties)',0,()=>P.g>=10],['Champion (3 victoires)',0,()=>P.w>=3],['Diamant (ELO 1500)',0,()=>P.elo>=1500],['Légende',600]]]};
const AVs=CAT.av[1].map(q=>q[0]),TIs=CAT.ti[1].map(q=>q[0].split(' (')[0]),EM=CAT.em[1].map(q=>q[0]),AVR=CAT.av[1].map(q=>q[2]|0);
let P;{const d={coins:50,xp:0,elo:1000,k:0,g:0,w:0,fl:FL.includes(loc)?loc:'FR',own:{kk:[0],av:[0],co:[0],tr:[0],em:[0,1,2,3],sk:[0],ti:[0]},eq:{kk:0,av:0,co:0,tr:0,em:[0,1,2,3],sk:0,ti:0}};
 let s=null;try{s=JSON.parse(LS('mgP2'))}catch(e){}P=Object.assign(d,s||{});
 if(!s&&MX.sk>0){P.own.sk.push(MX.sk);P.eq.sk=MX.sk}
 P.own.kk=P.own.kk||[0];P.eq.kk=clamp(P.eq.kk|0,0,SKN-1)}
window.MGSK.cur=()=>P.eq.kk|0;window.MGSK.of=id=>(X2.prof[id]||{}).k|0;
const save=()=>LS('mgP2',JSON.stringify(P)),lvl=()=>Math.floor(Math.sqrt(P.xp/60))+1,rank=()=>P.elo<900?'Bronze':P.elo<1100?'Argent':P.elo<1300?'Or':P.elo<1500?'Platine':'Diamant';
const owned=(k,i)=>P.own[k].includes(i)||(k=='ti'&&CAT.ti[1][i][2]&&CAT.ti[1][i][2]());
const c0=me.c0;
function applyEq(){const v=CAT.co[1][P.eq.co][2];me.c0=v||c0;if(!me.team)me.c=me.c0;MX.sk=P.eq.sk;LS('mgSk',P.eq.sk);const s=$('xsk');if(s)s.value=P.eq.sk}
function equip(k,i){if(k=='em'){P.eq.emc=((P.eq.emc==null?-1:P.eq.emc)+1)%4;P.eq.em[P.eq.emc]=i}else P.eq[k]=i;save();applyEq();sendProf();emBar()}
function buy(k,i){const it=CAT[k][1][i];if(P.coins<it[1])return;P.coins-=it[1];P.own[k].push(i);equip(k,i)}

/* ---------- profil partagé avec la salle ---------- */
const sendProf=()=>emit('xp',{a:P.eq.av,t:P.eq.ti,f:P.fl,e:P.elo,l:lvl(),r:P.eq.tr,s:P.eq.sk,k:P.eq.kk|0});
function trail(x,y,id,key){window.MGFX.trail(x,y,id,key)}

/* ---------- chat, emotes, pings, modération ---------- */
const QM=['Bien joué !','Aide !','Merci','Attention !','Par ici','À l’attaque !','GG','Oups'],MUTE=new Set();let lastSay=0;
function log(n,t){const L=$('xlog'),d=document.createElement('div');d.textContent=(n?n+' : ':'')+t;L.appendChild(d);while(L.children.length>6)L.firstChild.remove();setTimeout(()=>d.remove(),9000)}
function say(t){t=String(t).replace(/[\u0000-\u001f]/g,'').trim().slice(0,80);if(!t||Date.now()-lastSay<700)return;lastSay=Date.now();log(me.n,t);emit('xc',{m:t})}
function emote(k){const i=P.eq.em[k];if(i==null||Date.now()-(X2.le||0)<1200)return;X2.le=Date.now();MGFX.emote('me',EM[i]);emit('xm',{i})}
function ping(x,y){if(Date.now()-(X2.lp||0)<800)return;X2.lp=Date.now();X2.pg.push({x,y,t:6,n:me.n});snd(900,.15,.05,'triangle');emit('xg',{x:x|0,y:y|0})}
const w2s=(px,py)=>[camL+px/sc,camT+py/sc];
['pointerdown','mousedown','touchstart'].forEach(ev=>addEventListener(ev,e=>{
 const q=e.touches?e.touches[0]:e,mid=false;
 if(X2.arm||mid||(X2.eat&&Date.now()<X2.eat)){if(X2.arm||mid){const r=cv.getBoundingClientRect();if(q&&q.clientX>=r.left&&q.clientX<=r.right){const w=w2s(q.clientX-r.left,q.clientY-r.top);ping(w[0],w[1])}X2.arm=0;X2.eat=Date.now()+400;document.body.style.cursor=''}e.preventDefault();e.stopImmediatePropagation()}},true));
function wire(){room._x2=1;
 room.on('xp',m=>{if(m.isMe)return;const d=m.data||{};X2.prof[m.peer]={a:clamp(d.a|0,0,AVs.length-1),t:clamp(d.t|0,0,TIs.length-1),f:/^[A-Z]{2}$/.test(d.f)?d.f:'',e:clamp(d.e|0,0,5000),l:clamp(d.l|0,1,999),r:clamp(d.r|0,0,CAT.tr[1].length-1),s:clamp(d.s|0,0,5),k:clamp(d.k|0,0,SKN-1)}});
 room.on('xc',m=>{if(m.isMe||MUTE.has(m.peer))return;log(pn(m.peer),String((m.data||{}).m||'').slice(0,80))});
 room.on('xm',m=>{if(m.isMe||MUTE.has(m.peer))return;const e=EM[clamp((m.data||{}).i|0,0,EM.length-1)];MGFX.emote(m.peer,e)});
 room.on('xg',m=>{return;const d=m.data||{};if(m.isMe||MUTE.has(m.peer)||![d.x,d.y].every(isFinite))return;const r=RV[m.peer];if(me.team&&r&&r.team!==me.team)return;X2.pg.push({x:+d.x,y:+d.y,t:6,n:pn(m.peer)});snd(900,.15,.05,'triangle')});
 room.on('kicked',()=>{feed('⛔ Tu as été expulsé de la salle');alert('Tu as été expulsé de cette salle (par l’hôte ou par signalements).')});
 room.on('sys',()=>feed('⛔ Un joueur a été expulsé de la salle'));sendProf()}

/* ---------- récompenses, ELO, tournoi ---------- */
const PTS=[10,7,5,3,2,1],avg=a=>a.reduce((s,x)=>s+x,0)/a.length;
function onEnd(){const rows=endRes||[],win=!!(rows[0]&&rows[0].me);let c=5+(win?15:0),x=20+(win?50:0),extra='';
 if(MX.mode==5&&MX.Z)c+=MX.Z.w*3;P.g++;if(win)P.w++;
 if(X2.rk&&room){const el=k=>(X2.prof[k]||{e:1000}).e,K=Object.keys(RV),a=avg(K.filter(k=>RV[k].team===me.team).map(el).concat(P.elo)),o=K.filter(k=>RV[k].team!==me.team).map(el),b=o.length?avg(o):a,d=Math.round(24*((win?1:0)-1/(1+Math.pow(10,(b-a)/400))));P.elo=Math.max(0,P.elo+d);extra=' · ELO '+(d>=0?'+':'')+d+' → '+P.elo+' ('+rank()+')'}
 const T=X2.T;if(T){(room?[me,...Object.values(RV)]:[me,...bots]).slice().sort((a,b)=>b.k-a.k).forEach((e,i)=>T.pts[e.n]=(T.pts[e.n]||0)+(PTS[i]||0));T.r++;
  if(T.r>=T.n){T.fin=1;const top=Object.entries(T.pts).sort((a,b)=>b[1]-a[1])[0];if(top&&top[0]===me.n){c+=50;extra+=' · 🏆 CHAMPION DU TOURNOI +50'}}}
 P.coins+=c;P.xp+=x;save();feed('+'+c+' 🪙 · +'+x+' XP'+extra);if(extra.includes('ELO'))banner('🏅'+extra.split('·')[1],'#ffd23f');if(X2.best)X2.best.t0=performance.now();sendProf()}

/* ---------- killcam + meilleur moment ---------- */
const EN=()=>room?[['me',me],...Object.entries(RV)]:[['me',me],...bots.map(b=>[b.id,b])];
function pip(fr,fid,cap,t0,loop){const n=fr.length;if(!n)return;const i=Math.floor((performance.now()-t0)/50),f=fr[loop?i%n:Math.min(i,n-1)],w=300,TT=window.T4&&T4.on(),h=TT?134:170,x0=TT?(Wd-w)/2:12,y0=TT?108:Ht-h-14,s=.38,fo=f.find(q=>q[0]===fid)||f[0];
 g.save();g.translate(x0,y0);g.beginPath();g.rect(0,0,w,h);g.clip();sky(g,w,h,TI,fo[1]*s,time);g.translate(w/2-fo[1]*s,h/2-fo[2]*s);g.scale(s,s);BASE.forEach(q=>platAt(g,q,TI));
 for(const q of f){if(!q[4])continue;g.fillStyle=q[5]||'#999';g.fillRect(q[1]-10,q[2],20,38);g.strokeStyle=q[0]===fid?'#ffd23f':'#fff';g.lineWidth=q[0]===fid?5:2;g.strokeRect(q[1]-10,q[2],20,38);
  g.strokeStyle='#ffe28a';g.lineWidth=4;g.beginPath();g.moveTo(q[1],q[2]+16);g.lineTo(q[1]+Math.cos(q[3])*50,q[2]+16+Math.sin(q[3])*50);g.stroke()}
 g.restore();g.strokeStyle='rgba(255,255,255,.7)';g.lineWidth=2;g.strokeRect(x0,y0,w,h);pill(x0+w/2,y0-24,cap,'#fff',20)}
hook('die',function(o,e,s){o(e,s);if(e===me){const f=s&&s!=='me'&&s!=='zone'?s:null;X2.kc=f?{fr:X2.buf.slice(-50),fid:f,t0:performance.now(),n:nameOf(f)||'?'}:null}});
hook('myKill',function(o,n){o(n);P.coins+=2;P.xp+=10;P.k++;save();const sc=mkc*3+ks+(mkc>=2?5:0);
 if(!X2.best||sc>X2.best.sc)X2.best={sc,fr:X2.buf.slice(-40),t0:0,cap:mkc>=2?(['','','DOUBLE KILL','TRIPLE KILL','QUADRA KILL'][Math.min(mkc,4)]||'MULTI KILL'):ks>=3?'Série de '+ks+' kills':'Élimination de '+n}});
hook('newMatch',function(o){o();X2.best=null;X2.kc=null});
hook('begin',function(o,m){if(!m)X2.rk=0;applyEq();
 if(m&&X2.rk&&room){const c={1:0,2:0};room.peers().forEach(p=>{if(!p.sameTab&&c[p.presence.t]!=null)c[p.presence.t]++});$('tm').value=c[1]<c[2]?'1':c[2]<c[1]?'2':String(mp().charCodeAt(0)%2+1)}
 o(m);const t=+($('xtr')||{value:0}).value|0;X2.T=t?{n:t,r:0,pts:{},fin:0}:null;X2.best=null;X2.buf=[];X2.kc=null;X2.ended=0});
hook('ent',function(o,e,m){o(e,m);if(m||!e.al||!e.pid)return;const p=X2.prof[e.pid];if(!p)return;g.save();g.font='600 10px system-ui,sans-serif';const t=(p.f?flag(p.f)+' ':'')+TIs[p.t]+' · Niv '+p.l,w=g.measureText(t).width,tot=w+26,x0=e.x+10-tot/2;g.textAlign='left';g.fillStyle='rgba(10,14,28,.55)';g.beginPath();if(g.roundRect)g.roundRect(x0-3,e.y-42,tot+6,20,10);else g.rect(x0-3,e.y-42,tot+6,20);g.fill();MGFX.badge(g,x0+8,e.y-32,8,AVs[p.a],AVR[p.a],time);g.fillStyle='rgba(255,255,255,.9)';g.fillText(t,x0+22,e.y-28.5);g.restore()});

/* ---------- boucle ---------- */
hook('update',function(o,dt){o(dt);const on=run&&LD<=0;for(const k of['xem','xtb'])$(k).style.display=on?'flex':'none';if(!run)return;
 if(room&&room._x2!==1)wire();
 for(const k in RV){const r=RV[k];r.pid=k;const p=X2.prof[k];if(p&&p.r&&r.al&&r.px!=null&&Math.abs(r.x-r.px)>7)trail(r.x+10,r.y+19,p.r,k);r.px=r.x}
 if(me.al&&me.dash>0)trail(me.x+10,me.y+19,P.eq.tr,'me');
 if(room){const n=Object.keys(RV).length;if(n!==X2.pn||time-X2.ps>10){X2.pn=n;X2.ps=time;sendProf()}}
 for(const q of X2.em)q.t-=dt;X2.em=X2.em.filter(q=>q.t>0);for(const q of X2.pg)q.t-=dt;X2.pg=X2.pg.filter(q=>q.t>0);
 if(time-X2.rc>=.05){X2.rc=time;X2.buf.push(EN().map(([id,e])=>[id,e.x+10|0,e.y|0,+(e.a||0).toFixed(2),e.al?1:0,e.c]));if(X2.buf.length>120)X2.buf.shift()}
 if(endT>0&&!X2.ended){X2.ended=1;onEnd()}else if(endT<=0&&X2.ended){X2.ended=0;const T=X2.T;if(T&&T.fin){T.r=0;T.pts={};T.fin=0}}
 if(me.al)X2.kc=null});
hook('fxDraw',function(o){o();g.save();g.textAlign='center';
 for(const q of X2.pg){const k=(6-q.t)%1.2;g.globalAlpha=clamp(q.t,0,1)*.9;g.strokeStyle='#ffd23f';g.lineWidth=4;g.beginPath();g.arc(q.x,q.y,10+k*50,0,7);g.stroke();g.font='28px system-ui,sans-serif';g.fillText('📍',q.x,q.y-6);g.font='700 12px system-ui,sans-serif';g.fillStyle='#fff';g.fillText(String(q.n).slice(0,12),q.x,q.y-36)}
 g.restore()});
hook('hud',function(o){o();if(!run)return;pill(72,122,'🪙 '+P.coins+' · Niv '+lvl(),'#ffd27a',19);
 for(const q of X2.pg){const px=(q.x-camL)*sc,py=(q.y-camT)*sc;if(px<14||px>Wd-14||py<14||py>Ht-14){const a=Math.atan2(py-Ht/2,px-Wd/2),ex=clamp(Wd/2+Math.cos(a)*Wd,26,Wd-26),ey=clamp(Ht/2+Math.sin(a)*Ht,26,Ht-26);g.save();g.translate(ex,ey);g.rotate(a);g.fillStyle='#ffd23f';g.beginPath();g.moveTo(11,0);g.lineTo(-9,-9);g.lineTo(-9,9);g.fill();g.restore()}}
 const T=X2.T;if(T&&endT<=0)pill(Wd/2,Ht-44,'🏆 Tournoi · manche '+Math.min(T.r+1,T.n)+'/'+T.n,'#ffd27a',20);
 if(!me.al&&X2.kc)pip(X2.kc.fr,X2.kc.fid,'📹 Killcam — '+X2.kc.n,X2.kc.t0,0);
 if(endT>0){if(X2.best&&X2.best.fr.length)pip(X2.best.fr,'me','🎬 Meilleur moment — '+X2.best.cap,X2.best.t0,1);
  if(T){const top=Object.entries(T.pts).sort((a,b)=>b[1]-a[1]).slice(0,6),x=Wd-290,y=Ht*.3;panel(x,y,270,46+top.length*20,12);g.textAlign='left';g.font='800 13px system-ui,sans-serif';g.fillStyle='#ffd23f';
   g.fillText(T.fin?'🏆 TOURNOI TERMINÉ':'🏆 Tournoi · manche '+T.r+'/'+T.n,x+14,y+22);g.font='700 12px system-ui,sans-serif';top.forEach((q,i)=>{g.fillStyle=q[0]===me.n?'#ffb020':'#fff';g.fillText((i+1)+'. '+String(q[0]).slice(0,14),x+14,y+44+i*20);g.textAlign='right';g.fillText(q[1]+' pts',x+256,y+44+i*20);g.textAlign='left'})}}});

/* ---------- interface ---------- */
function btn(t,f,cls){const b=document.createElement('button');b.textContent=t;b.onclick=f;if(cls)b.className=cls;return b}
function emBar(){const b=$('xem');b.innerHTML='';P.eq.em.forEach((i,k)=>{const x=btn(EM[i],()=>emote(k));b.appendChild(x)})}
let tab='p',cat='kk';
const hh=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e};
const RB='linear-gradient(90deg,#f33,#fc3,#3f6,#39f,#a5f)',SKC=['#9aa3b8','#00ffcc','#ffd23f','#6b8e4e','#e0115f','rb'];
function pv(cat,i,it){
 if(cat=='kk')return '<img alt="" style="height:60px;image-rendering:auto" src="'+window.MGSK.thumb(i,128,116)+'">';
 if(cat=='sk'&&window.MGWS&&MGWS.thumb)return '<img alt="" style="height:50px;max-width:100%" src="'+MGWS.thumb(i)+'">';
 if(cat=='av')return MGFX.avDom(it[0],it[2]);
 if(cat=='em')return MGFX.emDom(it[0]);
 if(cat=='co')return '<span class="xsw" style="background:'+(it[2]||'conic-gradient(#f33,#fc3,#3f6,#39f,#a5f,#f33)')+'"></span>';
 if(cat=='tr'){const v=it[2];return '<span class="xtr" style="background:'+(!v?'#2b3a67':v=='rb'?RB:'linear-gradient(90deg,'+v[0]+','+v[1]+')')+'"></span>'}
 const c=SKC[i]||'#9aa3b8';return '<span class="xsk"><i style="background:'+(c=='rb'?RB:c)+'"></i></span>'}
function render(){const b=$('xsb');b.innerHTML='';
 $('xst').querySelectorAll('button[data-t]').forEach(x=>x.classList.toggle('on',x.dataset.t==tab));$('xcoin').textContent='🪙 '+P.coins;
 if(tab=='p'){const L=lvl(),base=60*(L-1)*(L-1),nx=60*L*L,pc=Math.max(0,Math.min(100,(P.xp-base)/(nx-base)*100)),ring=CAT.co[1][P.eq.co][2]||me.c0||'#ffb020';
  b.appendChild(hh('div','xhero','<div class="xbig" style="border:0;background:none;box-shadow:none">'+MGFX.avDom(AVs[P.eq.av],AVR[P.eq.av],1)+'</div><div class="xhi"><div class="xti">'+flag(P.fl)+' '+TIs[P.eq.ti]+'</div><div class="xlv">Niveau '+L+' · '+rank()+'</div><div class="xbar"><i style="width:'+pc+'%"></i></div><small>'+Math.floor(P.xp-base)+' / '+(nx-base)+' XP</small></div>'));
  b.appendChild(hh('div','xstat','<div><b>'+P.k+'</b><span>Kills</span></div><div><b>'+P.g+'</b><span>Parties</span></div><div><b>'+P.w+'</b><span>Victoires</span></div><div><b>'+P.elo+'</b><span>ELO</span></div>'));
  const n=document.createElement('input');n.maxLength=14;n.value=$('nm').value||me.n;n.placeholder='Pseudo';n.onchange=()=>{$('nm').value=n.value.trim().slice(0,14)};
  const f=document.createElement('select');FL.forEach(c=>{const o=document.createElement('option');o.value=c;o.textContent=flag(c)+' '+c;f.appendChild(o)});f.value=P.fl;f.onchange=()=>{P.fl=f.value;save();sendProf();render()};
  const t=document.createElement('select');CAT.ti[1].forEach((q,i)=>{if(!owned('ti',i))return;const o=document.createElement('option');o.value=i;o.textContent=q[0];t.appendChild(o)});t.value=P.eq.ti;t.onchange=()=>{equip('ti',+t.value);render()};
  const fs=hh('div','xfs');[['Pseudo',n],['Drapeau',f],['Titre',t]].forEach(([l,c])=>{const w=hh('label','xf','<span>'+l+'</span>');w.appendChild(c);fs.appendChild(w)});b.appendChild(fs)}
 else if(tab=='s'){const bar=hh('div','xcats');Object.keys(CAT).filter(k=>k!='ti').forEach(k=>{const x=btn(CAT[k][0],()=>{cat=k;render()});if(k==cat)x.classList.add('on');bar.appendChild(x)});b.appendChild(bar);
  b.appendChild(hh('p','xnote',cat=='em'?'4 emplacements (touches 7 8 9 0). Une emote équipée prend l’emplacement suivant.':'Les pièces se gagnent en jouant : kills, manches, victoires.'));
  const grid=hh('div','xgrid');
  CAT[cat][1].forEach((it,i)=>{const eq=cat=='em'?P.eq.em.includes(i):P.eq[cat]===i,ow=owned(cat,i),c=hh('div','xcard'+(eq?' eq':''),'<div class="xpv">'+pv(cat,i,it)+'</div>'+(cat=='av'?'<div class="xrar" style="color:'+(MGFX.RAR[it[2]|0].c=='rb'?'#ff9bf0':MGFX.RAR[it[2]|0].c)+'">'+MGFX.RAR[it[2]|0].n+'</div>':cat=='em'?'':'<div class="xnm">'+it[0]+'</div>'));
   let a;if(eq){a=btn('✓ Équipé',()=>{});a.className='ok';a.disabled=true}
   else if(ow){a=btn('Équiper',()=>{equip(cat,i);render()});a.className='eqb'}
   else{a=btn('🪙 '+it[1],()=>{buy(cat,i);render()});a.className='buy';if(P.coins<it[1]){a.disabled=true;a.textContent='🪙 '+it[1]+' · manque '+(it[1]-P.coins)}}
   c.appendChild(a);
   if(cat=='av'||cat=='em'||cat=='tr'){const tb=btn('👁 Aperçu',()=>MGFX.preview(cat,i,it[0],ow?null:()=>{buy(cat,i);render()},it[1],it[1]-P.coins,(cat=='av'?'Avatar ':cat=='tr'?'Traînée ':'Emote ')+it[0],it[2]|0,it[0]));tb.className='xtryb';c.appendChild(tb)}
   if(cat=='sk'&&window.MGWS&&MGWS.preview){const tb=btn('👁 Aperçu',()=>MGWS.preview(i,ow?null:()=>{buy('sk',i);render()},it[1],it[1]-P.coins));tb.className='xtryb';c.appendChild(tb)}
   if(cat=='kk'&&i>0&&!ow){const tb=btn('👁 Essayer',()=>window.MGSK.preview(i,()=>{buy('kk',i);render()},it[1]-P.coins));tb.className='xtryb';c.appendChild(tb)}
   grid.appendChild(c)});b.appendChild(grid)}
 else{if(!room){b.appendChild(hh('div','xempty','Rejoins une salle en ligne pour voir les joueurs.'));return}
  const h=room.host===mp();b.appendChild(hh('p','xnote',h?'👑 Tu es l’hôte : tu peux exclure des joueurs.':'👑 Hôte : '+(room.host?pn(room.host):'?')));
  const L=Object.keys(RV);if(!L.length)b.appendChild(hh('div','xempty','Personne d’autre dans la salle.'));
  L.forEach(id=>{const p=X2.prof[id]||{},r=hh('div','xrow','<span class="xa">'+(AVs[p.a|0]||'🙂')+'</span><span class="xn">'+RV[id].n+(room.host===id?' 👑':'')+'<small>'+(p.e?p.e+' ELO':'')+(p.l?' · Niv '+p.l:'')+'</small></span>');
   r.appendChild(btn(MUTE.has(id)?'🔊':'🔇',()=>{MUTE.has(id)?MUTE.delete(id):MUTE.add(id);render()}));
   r.appendChild(btn('🚩',()=>{if(confirm('Signaler '+RV[id].n+' ? Plusieurs signalements entraînent son exclusion.')){room.report(id);feed('Signalement envoyé')}}));
   if(h)r.appendChild(btn('👢',()=>{if(confirm('Exclure '+RV[id].n+' ?'))room.kick(id)}));b.appendChild(r)})}}
function ui(){
 const css=document.createElement('style');css.textContent='#xs{position:fixed;inset:0;z-index:96;display:none;flex-direction:column;background:#0b1020;color:#fff;font:600 13px system-ui,sans-serif}#xst{display:flex;gap:6px;padding:8px;background:#121a33}#xst button,.xr button{padding:8px 10px;font-size:12px;border-radius:8px}#xst button.on,.xr button.on{background:#ffb020;color:#111}#xsb{flex:1;overflow:auto;padding:12px;max-width:560px;width:100%;margin:0 auto}.xc{display:grid;gap:8px}.xr{display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin:4px 0}.xr button:disabled{opacity:.4}#xem{position:fixed;right:8px;top:42%;z-index:40;flex-direction:column;gap:6px;display:none}#xem button,#xtb button{width:40px;height:40px;font-size:20px;padding:0;border-radius:50%}#xtb{position:fixed;left:10px;top:150px;z-index:40;flex-direction:column;gap:6px;display:none}#xlog{position:fixed;left:10px;bottom:190px;z-index:40;pointer-events:none;font:600 12px system-ui,sans-serif;color:#fff;text-shadow:0 1px 3px #000;max-width:46vw}#xchat{position:fixed;left:0;right:0;bottom:0;z-index:97;display:none;gap:6px;padding:8px;background:rgba(8,12,28,.92);flex-wrap:wrap}#xchat input{flex:1;min-width:140px}#xchat button{padding:6px 9px;font-size:12px;border-radius:8px}';document.head.appendChild(css);
 const card=btn('',()=>{tab='p';$('xs').style.display='flex';render()},'s');card.id='xps';card.style.cssText='width:100%;margin:2px 0 6px';
 $('nm').previousElementSibling.insertAdjacentElement('beforebegin',card);
 const upd=()=>{card.textContent=AVs[P.eq.av]+' '+($('nm').value||me.n)+' · '+flag(P.fl)+' · Niv '+lvl()+' · 🪙 '+P.coins+' · 🏅 '+rank()+' — Profil & boutique'};upd();setInterval(upd,1500);
 const bm=$('bm'),tr=document.createElement('div');
 tr.innerHTML='<div class="fl">Tournoi (salle)</div><select id="xtr"><option value="0">Sans tournoi</option><option value="3">Tournoi : 3 manches</option><option value="5">Tournoi : 5 manches</option></select>';bm.parentNode.insertBefore(tr,bm);
 const rk=btn('🏅 PARTIE CLASSÉE (équipes + ELO)',()=>ranked(),'big mpb');bm.insertAdjacentElement('afterend',rk);
 const s=document.createElement('div');s.id='xs';s.innerHTML='<div id="xst"><button data-t="p">👤 Profil</button><button data-t="s">🛍️ Boutique</button><button data-t="r">👥 Salle</button><span id="xcoin"></span><button id="xsx">✖ Fermer</button></div><div id="xsb"></div>';document.body.appendChild(s);
 s.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{tab=b.dataset.t;render()});$('xsx').onclick=()=>{s.style.display='none';upd()};
 const em=document.createElement('div');em.id='xem';document.body.appendChild(em);emBar();
 const tb=document.createElement('div');tb.id='xtb';tb.append(btn('👥',()=>{tab='r';$('xs').style.display='flex';render()}));document.body.appendChild(tb);
 const lg=document.createElement('div');lg.id='xlog';document.body.appendChild(lg);
 const ch=document.createElement('div');ch.id='xchat';const inp=document.createElement('input');inp.maxLength=80;inp.placeholder='Message (Entrée = envoyer)';
 ch.append(inp,btn('Envoyer',()=>{say(inp.value);inp.value='';chat(0)}),...QM.map(q=>btn(q,()=>{say(q);chat(0)})),btn('✖',()=>chat(0)));document.body.appendChild(ch);
 ['keydown','keyup','keypress'].forEach(ev=>inp.addEventListener(ev,e=>{e.stopPropagation();if(ev=='keydown'){if(e.key=='Enter'){say(inp.value);inp.value='';chat(0)}if(e.key=='Escape')chat(0)}}));
 function chat(o){ch.style.display=o?'flex':'none';if(o)setTimeout(()=>inp.focus(),30);else inp.blur()}
 addEventListener('keydown',e=>{if(!run||/INPUT|SELECT|TEXTAREA/.test((document.activeElement||{}).tagName||''))return;
  const k={Digit7:0,Digit8:1,Digit9:2,Digit0:3}[e.code];if(k!=null&&!e.repeat)emote(k)});
 const old=$('xbw').onclick;$('xbw').onclick=()=>{old();document.querySelectorAll('#xsk option').forEach((o,i)=>{o.disabled=!owned('sk',i);o.textContent=CAT.sk[1][i][0]+(owned('sk',i)?'':' 🔒 (boutique)')})};
 const sx=$('xwo').onclick;$('xwo').onclick=()=>{const v=+$('xsk').value;if(!owned('sk',v))$('xsk').value=P.eq.sk;sx();P.eq.sk=MX.sk;save()};
 const inner=bm.onclick;bm.onclick=async function(){const rc=$('rc'),v=rc.value,t=+$('xtr').value|0;X2.rk=X2.rkNext;X2.rkNext=0;if(t)rc.value='t'+t+'-'+(v||'public');try{return await inner.apply(this,arguments)}finally{rc.value=v}};
 window.addEventListener('beforeunload',save);applyEq()}
async function ranked(){const ms=$('ms'),b=Math.min(5,Math.floor(P.elo/250)),day=Math.floor(Date.now()/864e5);
 $('mp').value=(b*5+day)%11;$('lm').value='30';$('gm').value='0';$('gmode').value='0';$('xtr').value='0';
 for(let n=1;n<=8;n++){$('rc').value='rk'+b+'-'+n;X2.rkNext=1;await $('bm').onclick();if(room)return;if(!/pleine/.test(ms.textContent))return}
 ms.textContent='Les salles classées de ton niveau sont pleines, réessaie.'}
ui();
})();
