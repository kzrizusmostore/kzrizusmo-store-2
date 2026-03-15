
const CACHE='kz-cache-v1';

self.addEventListener('install',e=>{
e.waitUntil(
caches.open(CACHE).then(c=>c.addAll([
'/',
'/index.html',
'/loader.js',
'/css/app.css',
'/core/app.enc'
]))
);
});

self.addEventListener('fetch',e=>{
e.respondWith(
caches.match(e.request).then(r=>r||fetch(e.request))
);
});
