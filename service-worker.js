const CACHE_NAME = 'grid-farming-game-v1';
const urlsToCache = [
    '/index.html',
    '/lib/phaser.js',
    '/src/main.js',
    '/assets/grass.png',
    '/assets/character.png',
    '/assets/cabbage_1.png',
    '/assets/cabbage_2.png',
    '/assets/cabbage_3.png',
    // Add all assets and scripts you need to cache
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});