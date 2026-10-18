/* Couche réseau de Mini Guerre : même interface que les « salles » de Claude, mais via WebSocket. */
(() => {
  const WS_URL = (location.protocol === 'https:' ? 'wss://' : 'ws://') + location.host + '/ws';
  try { fetch('/healthz').catch(() => {}); } catch (e) {} // réveille le serveur gratuit

  function join(name) {
    return new Promise((resolve, reject) => {
      let ws;
      try { ws = new WebSocket(WS_URL + '?room=' + encodeURIComponent(name)); }
      catch (e) { reject({ code: 'ws' }); return; }
      let me = null, ok = false, own = {}, pinger = null;
      const peers = new Map(), H = {};
      const fire = (k, m) => (H[k] || []).forEach(f => { try { f(m); } catch (e) { console.error(e); } });
      const send = o => { if (ws.readyState === 1) ws.send(JSON.stringify(o)); };
      const room = {
        on(k, f) { (H[k] = H[k] || []).push(f); },
        emit(k, d) { send({ t: 'e', k, d }); return Promise.resolve(); },
        presence(d) { own = d; send({ t: 'p', d }); return Promise.resolve(); },
        peers() {
          const a = [];
          if (me) a.push({ peer: me, presence: own, sameTab: true, kind: 'viewer' });
          peers.forEach((d, id) => a.push({ peer: id, presence: d, sameTab: false, kind: 'viewer' }));
          return a;
        },
        ping: 0, host: null,
        kick(id) { send({ t: 'k', id }); }, report(id) { send({ t: 'r', id }); },
        leave() { clearInterval(pinger); try { ws.close(); } catch (e) {} }
      };
      const timer = setTimeout(() => { if (!ok) { try { ws.close(); } catch (e) {} reject({ code: 'timeout' }); } }, 45000);
      ws.onmessage = ev => {
        let m; try { m = JSON.parse(ev.data); } catch (e) { return; }
        if (m.t === 'hi') {
          me = m.id; room.host = m.host; (m.peers || []).forEach(p => peers.set(p.id, p.d || {}));
          ok = true; clearTimeout(timer); resolve(room);
          const pg = () => send({ t: 'ping', ts: Date.now() }); pg(); pinger = setInterval(pg, 2000);
        } else if (m.t === 'p') peers.set(m.id, m.d || {});
        else if (m.t === 'l') peers.delete(m.id);
        else if (m.t === 'pong') room.ping = Math.max(0, Date.now() - m.ts);
        else if (m.t === 'e') fire(m.k, { peer: m.from, data: m.d, isMe: m.from === me });
        else if (m.t === 'host') room.host = m.id;
        else if (m.t === 'kicked') fire('kicked', {});
        else if (m.t === 'err') { if (!ok) { clearTimeout(timer); reject({ code: m.code }); } }
      };
      ws.onerror = () => { if (!ok) { clearTimeout(timer); reject({ code: 'reseau' }); } };
      ws.onclose = () => { clearInterval(pinger); peers.clear(); if (ok) fire('close', {}); else { clearTimeout(timer); reject({ code: 'ferme' }); } };
    });
  }
  window.claude = { use: async k => { if (k !== 'room') throw new Error('indisponible'); return { join }; } };
})();
