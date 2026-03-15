const SW_VERSION = 'kz-sw-v1';
const OFFLINE_URL = '/offline.html';
const CACHE_STATIC = `${SW_VERSION}-static`;
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/index_pwa.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/pwa/pwa.css',
  '/pwa/pwa-app.js',
  '/offline.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_STATIC).then(cache => {
      return cache.addAll(PRECACHE_ASSETS).catch(()=>{/* ignore errors */});
    }).then(()=> self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_STATIC).map(k => caches.delete(k))
    )).then(()=> self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  if (req.method !== 'GET') return;

  if (req.headers.get('accept') && req.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE_STATIC).then(cache => cache.put(req, copy));
        return res;
      }).catch(() => caches.match(req).then(r => r || caches.match(OFFLINE_URL)))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(res => {
        if (!res || res.status !== 200 || res.type === 'opaque') return res;
        const copy = res.clone();
        caches.open(CACHE_STATIC).then(cache => cache.put(req, copy));
        return res;
      }).catch(()=> {
        if (req.destination === 'image') return new Response('', {status:404});
        return caches.match(OFFLINE_URL);
      });
    })
  );
});
