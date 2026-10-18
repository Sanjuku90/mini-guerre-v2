// Serveur Mini Guerre : sert le jeu (dossier public/) + relais WebSocket sur /ws. Aucune dépendance.
const http = require('http'), fs = require('fs'), path = require('path'), crypto = require('crypto');
const PORT = process.env.PORT || 3000, PUB = path.join(__dirname, 'public');
const MAX_PEERS = 16, MAX_MSG = 32 * 1024;
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png',
  '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };

// Version du jeu = empreinte de tous les fichiers publics. Elle est injectée dans sw.js : chaque déploiement
// change donc automatiquement le cache hors-ligne (plus besoin de numéroter à la main).
const BUILD = (() => { const h = crypto.createHash('sha1');
  (function walk(d) { for (const n of fs.readdirSync(d).sort()) { const f = path.join(d, n);
    if (fs.statSync(f).isDirectory()) walk(f); else h.update(n).update(fs.readFileSync(f)); } })(PUB);
  return h.digest('hex').slice(0, 10); })();

const server = http.createServer((req, res) => {
  let p;
  try { p = decodeURIComponent(new URL(req.url, 'http://x').pathname); } catch (e) { res.writeHead(400); return res.end(); }
  if (p === '/healthz') { res.writeHead(200, { 'Content-Type': 'text/plain' }); return res.end('ok'); }
  if (p === '/sw.js') return fs.readFile(path.join(PUB, 'sw.js'), 'utf8', (err, src) => {
    if (err) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': MIME['.js'], 'Cache-Control': 'no-cache', 'Service-Worker-Allowed': '/' });
    res.end(src.replace(/__VERSION__/g, BUILD)); });
  if (p === '/') p = '/index.html';
  const f = path.normalize(path.join(PUB, p));
  if (!f.startsWith(PUB + path.sep)) { res.writeHead(403); return res.end(); }
  fs.readFile(f, (err, data) => {
    if (err) { res.writeHead(404); return res.end('Introuvable'); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream',
      'Cache-Control': p === '/sw.js' || p === '/index.html' ? 'no-cache' : 'public, max-age=3600' });
    res.end(data);
  });
});

const rooms = new Map();
const frame = str => {
  const p = Buffer.from(str), n = p.length; let h;
  if (n < 126) h = Buffer.from([0x81, n]);
  else if (n < 65536) { h = Buffer.alloc(4); h[0] = 0x81; h[1] = 126; h.writeUInt16BE(n, 2); }
  else { h = Buffer.alloc(10); h[0] = 0x81; h[1] = 127; h.writeBigUInt64BE(BigInt(n), 2); }
  return Buffer.concat([h, p]);
};
const put = (c, buf, urgent) => { if (c.s.destroyed) return; if (!urgent && c.s.writableLength > 256e3) return; c.s.write(buf); };
const bcast = (room, obj, except, urgent) => { const b = frame(JSON.stringify(obj)); for (const c of room.peers.values()) if (c !== except) put(c, b, urgent); };

function drop(c) {
  if (c.gone) return; c.gone = true;
  const room = c.room;
  if (room) { room.peers.delete(c.id); if (!room.peers.size) rooms.delete(room.name); else { bcast(room, { t: 'l', id: c.id }, null, true);
    if (room.host === c.id) { room.host = [...room.peers.keys()][0]; bcast(room, { t: 'host', id: room.host }, null, true); } } }
  try { c.s.destroy(); } catch (e) {}
}

function kick(room, v) { // exclusion : le joueur est banni de la salle (par adresse) tant qu'elle existe
  room.ban.add(v.ip); put(v, frame(JSON.stringify({ t: 'kicked' })), true); setTimeout(() => drop(v), 150);
  bcast(room, { t: 'e', k: 'sys', d: { m: 'kick' }, from: '' }, null, true);
}
function onText(c, txt) {
  const now = Date.now();
  if (now - c.t0 > 1000) { c.t0 = now; c.n = 0; }
  if (++c.n > 150) return; // anti-spam
  let m; try { m = JSON.parse(txt); } catch (e) { return; }
  if (!m || !c.room) return;
  if (m.t === 'ping') { put(c, frame(JSON.stringify({ t: 'pong', ts: m.ts })), true); return; }
  if (m.t === 'k' && typeof m.id === 'string' && c.id === c.room.host) { const v = c.room.peers.get(m.id); if (v && v !== c) kick(c.room, v); return; }
  if (m.t === 'r' && typeof m.id === 'string') { // signalement : plusieurs signalements distincts = exclusion automatique
    const v = c.room.peers.get(m.id); if (!v || v === c) return;
    const s = c.room.rep.get(v.id) || new Set(); s.add(c.id); c.room.rep.set(v.id, s);
    if (s.size >= Math.max(2, Math.ceil(c.room.peers.size / 2))) kick(c.room, v); return; }
  if (m.t === 'p' && m.d && typeof m.d === 'object') { c.p = m.d; bcast(c.room, { t: 'p', id: c.id, d: m.d }, c, false); }
  else if (m.t === 'e' && typeof m.k === 'string' && m.k.length <= 16) bcast(c.room, { t: 'e', k: m.k, d: m.d, from: c.id }, null, true);
}

function parse(c) {
  for (;;) {
    const b = c.buf; if (b.length < 2) return;
    const op = b[0] & 15, fin = b[0] & 128, masked = b[1] & 128; let len = b[1] & 127, off = 2;
    if (len === 126) { if (b.length < 4) return; len = b.readUInt16BE(2); off = 4; }
    else if (len === 127) { if (b.length < 10) return; len = Number(b.readBigUInt64BE(2)); off = 10; }
    if (len > MAX_MSG) return drop(c);
    const hdr = off + (masked ? 4 : 0);
    if (b.length < hdr + len) return;
    let pl = Buffer.from(b.subarray(hdr, hdr + len));
    if (masked) { const k = b.subarray(off, off + 4); for (let i = 0; i < pl.length; i++) pl[i] ^= k[i & 3]; }
    c.buf = b.subarray(hdr + len);
    if (op === 8) return drop(c);
    if (op === 9) { const h = Buffer.from([0x8a, pl.length]); c.s.write(Buffer.concat([h, pl.subarray(0, 125)])); }
    else if (op === 10) c.alive = true;
    else if (op === 1 || op === 0) {
      if (op === 1) c.frag = [];
      if (!c.frag) continue;
      c.frag.push(pl); if (c.frag.reduce((a, x) => a + x.length, 0) > MAX_MSG) return drop(c);
      if (fin) { const t = Buffer.concat(c.frag).toString(); c.frag = null; onText(c, t); }
    }
  }
}

server.on('upgrade', (req, socket) => {
  const u = new URL(req.url, 'http://x'), key = req.headers['sec-websocket-key'];
  if (u.pathname !== '/ws' || !key) return socket.destroy();
  const acc = crypto.createHash('sha1').update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11').digest('base64');
  socket.write('HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: ' + acc + '\r\n\r\n');
  socket.setNoDelay(true);
  const name = (u.searchParams.get('room') || 'public').toLowerCase().replace(/[^a-z0-9_.-]/g, '').slice(0, 60) || 'public';
  const ip = String(req.headers['x-forwarded-for'] || socket.remoteAddress || '').split(',')[0].trim();
  const c = { ip, s: socket, id: crypto.randomBytes(4).toString('hex'), buf: Buffer.alloc(0), frag: null, room: null, p: {}, alive: true, t0: 0, n: 0 };
  socket.on('data', d => { c.buf = Buffer.concat([c.buf, d]); parse(c); });
  socket.on('close', () => drop(c)); socket.on('error', () => drop(c)); socket.on('end', () => drop(c));
  let room = rooms.get(name);
  if (!room) rooms.set(name, room = { name, peers: new Map(), host: null, ban: new Set(), rep: new Map() });
  if (room.peers.size >= MAX_PEERS) { put(c, frame(JSON.stringify({ t: 'err', code: 'full' })), true); return setTimeout(() => drop(c), 200); }
  if (room.ban.has(ip)) { put(c, frame(JSON.stringify({ t: 'err', code: 'banned' })), true); return setTimeout(() => drop(c), 200); }
  room.peers.set(c.id, c); c.room = room; if (!room.host || !room.peers.has(room.host)) room.host = c.id;
  put(c, frame(JSON.stringify({ t: 'hi', id: c.id, host: room.host, peers: [...room.peers.values()].filter(x => x !== c).map(x => ({ id: x.id, d: x.p })) })), true);
});

setInterval(() => { // ping + nettoyage des connexions mortes
  for (const room of rooms.values()) for (const c of [...room.peers.values()]) {
    if (!c.alive) { drop(c); continue; }
    c.alive = false; try { c.s.write(Buffer.from([0x89, 0])); } catch (e) {}
  }
}, 20000);

server.listen(PORT, () => console.log('Mini Guerre prêt : http://localhost:' + PORT + ' (version ' + BUILD + ')'));

// Anti-veille (Render gratuit) : le serveur se ping lui-même via son adresse publique toutes les 10 min.
// Render fournit RENDER_EXTERNAL_URL automatiquement ; on peut aussi définir KEEPALIVE_URL à la main.
const SELF = process.env.KEEPALIVE_URL || process.env.RENDER_EXTERNAL_URL;
if (SELF && typeof fetch === 'function') {
  const ping = () => fetch(SELF.replace(/\/$/, '') + '/healthz').then(r => console.log('keepalive', r.status)).catch(e => console.log('keepalive échec', e.message));
  setInterval(ping, 10 * 60 * 1000);
  setTimeout(ping, 30 * 1000);
}
