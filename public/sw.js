/* Service worker de Mini Guerre — hors-ligne fiable.
   - le marqueur de version ci-dessous est remplacé par le serveur (empreinte des fichiers) : chaque déploiement = nouveau cache.
   - Tous les fichiers du jeu sont pré-téléchargés à l'installation, puis servis depuis le cache (démarrage instantané, même sans réseau).
   - Une nouvelle version attend que le joueur clique « Mettre à jour » (pas de rechargement en pleine partie). */
const V = 'mg-__VERSION__';
const CORE = ['/', '/index.html', '/net.js', '/arsenal.js', '/extras.js', '/sons.js', '/skins.js', '/fx.js', '/extras2.js', '/extras3.js', '/extras4.js', '/extras5.js', '/extras6.js', '/pro.js', '/manifest.webmanifest',
  '/icon-192.png', '/icon-512.png', '/icon-maskable-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => Promise.all(CORE.map(u =>
    fetch(new Request(u, { cache: 'reload' })).then(r => { if (!r.ok) throw new Error(u + ' ' + r.status); return c.put(u, r); })))));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('message', e => { if (e.data === 'SKIP_WAITING') self.skipWaiting(); });

self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin || u.pathname === '/healthz' || u.pathname === '/ws' || u.pathname === '/sw.js') return;
  e.respondWith((async () => {
    const c = await caches.open(V);
    let hit = await c.match(r, { ignoreSearch: true });
    if (!hit && r.mode === 'navigate') hit = await c.match('/index.html');
    if (hit) return hit;
    try {
      const res = await fetch(r);
      if (res.ok && res.type === 'basic') c.put(r, res.clone());
      return res;
    } catch (err) {
      return new Response('Hors-ligne', { status: 503, statusText: 'Hors-ligne', headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    }
  })());
});
