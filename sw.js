const CACHE = 'snapit-v30';

// Core app shell
const CORE_ASSETS = [
  './',
  './index.html',
  './shots.json',
  './manifest.json'
];

// All 58 overlay images — match the ?v=1 query string used in index.html
const OVERLAY_ASSETS = [];
for (let i = 1; i <= 58; i++) {
  OVERLAY_ASSETS.push(`./overlays/photo_${i}.jpg?v=1`);
}

const ASSETS = [...CORE_ASSETS, ...OVERLAY_ASSETS];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache =>
      // Individual .add() with per-asset catch so one missing overlay
      // doesn't fail the entire install
      Promise.all(
        ASSETS.map(url =>
          cache.add(url).catch(err => {
            console.warn('[SW] Precache miss:', url, err.message);
          })
        )
      )
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;

  // Only handle GETs
  if (req.method !== 'GET') return;

  // Never intercept Cloudinary uploads or any cross-origin API traffic
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  e.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;

      return fetch(req).then(resp => {
        // Runtime cache for overlays (belt-and-braces if precache missed any)
        // and for any other same-origin asset that loaded successfully
        if (resp.ok && resp.type === 'basic') {
          const isOverlay = url.pathname.includes('/overlays/');
          if (isOverlay) {
            const clone = resp.clone();
            caches.open(CACHE).then(c => c.put(req, clone));
          }
        }
        return resp;
      }).catch(() => {
        // Network failed and nothing in cache — return a clean error
        // rather than undefined (which makes <img> render as broken)
        return new Response('', { status: 504, statusText: 'Offline' });
      });
    })
  );
});
