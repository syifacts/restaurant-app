import 'regenerator-runtime';
import CacheHelper from './cache-helper';
import {registerRoute} from 'workbox-routing';
import {CacheFirst} from 'workbox-strategies';
import {precaching} from 'workbox-precaching';

precaching.precacheAndRoute(self.__WB_MANIFEST || []);

registerRoute(
  ({request}) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'restaurant-images',
    plugins: [
      {
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
      {
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        },
      },
    ],
  }),
);

const assetsToCache = [
  './',
  './index.html',
  './logo.png',
  './app.bundle.js',
  './app.manifest',
  './sw.bundle.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(CacheHelper.cachingAppShell(assetsToCache));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(CacheHelper.deleteOldCache());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(CacheHelper.revalidateCache(event.request));
});
