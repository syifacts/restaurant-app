
const CACHE_NAME = 'restaurant-app-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/styles/main.css',
  '/src/styles/responsive.css',
  '/src/scripts/index.js',
  '/src/scripts/detail.js',
  '/src/scripts/favorite.js',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap',
  '/manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)),
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }),
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        }),
      ),
    ),
  );
});
