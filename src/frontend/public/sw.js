const CACHE_NAME = 'global-tales-v3';
const APP_SHELL = [
  '/',
  '/index.html',
  '/assets/generated/gtu-app-icon.dim_192x192.png',
  '/assets/generated/gtu-app-icon.dim_512x512.png',
  '/assets/generated/gtu-app-icon-maskable.dim_512x512.png',
  '/assets/generated/gtu-app-icon.dim_180x180.png',
  '/assets/generated/gtu-favicon.dim_32x32.png',
  '/assets/generated/gtu-splash-bg.dim_1080x1920.png',
  '/assets/generated/cover-default.dim_1200x1600.png',
  '/assets/generated/cover-kids-default.dim_1200x1600.png',
  '/assets/generated/cover-romance.dim_1200x1600.png',
  '/assets/generated/cover-horror.dim_1200x1600.png',
  '/assets/generated/cover-comedy.dim_1200x1600.png',
  '/assets/generated/cover-mythology.dim_1200x1600.png',
  '/assets/generated/cover-educational.dim_1200x1600.png',
  '/assets/generated/cover-superhero.dim_1200x1600.png',
];

// Install event - cache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL).catch((err) => {
        console.warn('Cache addAll failed for some resources:', err);
        // Continue even if some resources fail to cache
      });
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // For navigation requests (HTML pages), try network first, fallback to cached app shell on any error or 404
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // If we get a 404 or other error status for a navigation request, serve the app shell
          // This allows the client-side router to handle the route
          if (!response.ok && response.status === 404) {
            return caches.match('/index.html').then((cachedResponse) => {
              return cachedResponse || response;
            });
          }
          return response;
        })
        .catch(() => {
          // Network failure - serve cached app shell
          return caches.match('/index.html');
        })
    );
    return;
  }

  // For static assets, try cache first, then network
  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((response) => {
          // Cache successful responses
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        });
      })
    );
    return;
  }

  // For everything else, network first
  event.respondWith(
    fetch(request).catch(() => {
      return caches.match(request);
    })
  );
});
