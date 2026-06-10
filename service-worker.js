// Inchiostro UV — service worker (offline-first app shell)
const CACHE = 'inchiostro-uv-v3';
const CORE = [
  './','./index.html','./manifest.json',
  './icons/icon-192.png','./icons/icon-512.png','./icons/apple-touch.png','./icons/favicon-32.png'
];
// dipendenza esterna: JSZip (per Word/Excel). Cache best-effort.
const CDN = ['https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await c.addAll(CORE);
    await Promise.all(CDN.map(u => c.add(u).catch(() => {})));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached =>
      cached || fetch(e.request).then(resp => {
        const copy = resp.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
        return resp;
      }).catch(() => caches.match('./index.html'))
    )
  );
});
