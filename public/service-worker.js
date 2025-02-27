const CACHE_NAME = 'pwa-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

let deferredEvent;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredEvent = e;
});

const installButton = document.getElementById('installButton');
installButton.addEventListener('click', () => {
  if (deferredEvent) {
    deferredEvent.prompt();
  }
});
