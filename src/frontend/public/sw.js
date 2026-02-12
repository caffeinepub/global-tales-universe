const CACHE_NAME = 'global-tales-v6';
const APP_SHELL = [
  '/',
  '/index.html',
  '/assets/generated/gtu-app-icon.dim_192x192.png',
  '/assets/generated/gtu-app-icon.dim_512x512.png',
  '/assets/generated/gtu-app-icon-maskable.dim_512x512.png',
  '/assets/generated/gtu-app-icon.dim_180x180.png',
  '/assets/generated/gtu-favicon.dim_32x32.png',
  '/assets/generated/gtu-splash-bg.dim_1080x1920.png',
  '/assets/generated/gtu-placeholder-avatar.dim_256x256.png',
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

// Handle skip waiting message
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Fetch event - network first with cache fallback for navigation
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

  // For navigation requests (HTML pages), always serve fresh from network or cached app shell
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Always serve the app shell for client-side routing
          // Don't cache individual navigation responses to avoid stale routes
          if (response.ok) {
            return response;
          }
          // If network fails or returns non-OK, serve cached app shell
          return caches.match('/index.html').then((cachedResponse) => {
            return cachedResponse || response;
          });
        })
        .catch(() => {
          // Network failure - serve cached app shell
          return caches.match('/index.html');
        })
    );
    return;
  }

  // For static assets, use stale-while-revalidate strategy
  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          const fetchPromise = fetch(request).then((networkResponse) => {
            // Cache successful responses
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => cachedResponse);

          // Return cached response immediately if available, otherwise wait for network
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // For everything else, network first with cache fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful responses for app resources
        if (response.ok && (url.pathname.endsWith('.js') || url.pathname.endsWith('.css'))) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, response.clone());
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(request);
      })
  );
});
