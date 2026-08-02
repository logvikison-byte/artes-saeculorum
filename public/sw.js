/*
 * Offline support for Stillpoint.
 *
 * Vite hashes built asset filenames, so the build injects the emitted asset
 * list into PRECACHE below (see the stillpointPrecache plugin in
 * vite.config.ts). That means a first-time visitor who loses connection right
 * after loading still has the whole app — everything runs client-side against
 * localStorage, so sessions work with no network at all.
 */
const CACHE = 'stillpoint-v1';
const PRECACHE = [/* __PRECACHE__ */];
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon.svg'];

async function precache() {
  const cache = await caches.open(CACHE);
  // Add individually: one missing URL shouldn't fail the whole install.
  await Promise.allSettled([...SHELL, ...PRECACHE].map((url) => cache.add(url)));
}

self.addEventListener('install', (event) => {
  event.waitUntil(precache().then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));

      // Drop build assets from previous deploys — filenames are hashed, so
      // anything not in the current precache list is dead weight.
      if (PRECACHE.length > 0) {
        const cache = await caches.open(CACHE);
        const wanted = new Set(PRECACHE.map((p) => new URL(p, self.location.href).href));
        for (const request of await cache.keys()) {
          if (request.url.includes('/assets/') && !wanted.has(request.url)) {
            await cache.delete(request);
          }
        }
      }
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

  // SPA navigations: try the network, fall back to the cached shell offline.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put('./index.html', copy));
          return response;
        })
        .catch(() => caches.match('./index.html').then((r) => r ?? caches.match('./'))),
    );
    return;
  }

  // Assets: serve from cache first, refreshing the entry in the background.
  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached ?? network;
    }),
  );
});
