// service-worker.js

const CACHE_NAME = 'sfx-cache-v2';

// Install event: cache only non-HTML assets (optional)
self.addEventListener('install', event => {
  // Skip waiting so new service worker activates immediately
  self.skipWaiting();
});

// Activate event: clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Take control of all pages immediately
      return clients.claim();
    })
  );
});

// Fetch handler: bypass cache for HTML documents
self.addEventListener('fetch', event => {
  // Never cache HTML — always fetch fresh
  if (event.request.destination === 'document') {
    return;
  }

  // Optionally cache static assets (mp3, images, etc.) if needed
  // For now, we just pass through
  event.respondWith(fetch(event.request));
});
