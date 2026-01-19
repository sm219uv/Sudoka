const CACHE_NAME = 'sudoka-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/main.js',
    '/js/grid.js',
    '/js/solver.js',
    '/js/generator.js',
    '/js/storage.js',
    '/manifest.json',
    '/icons/icon-192.png',
    '/icons/icon-512.png'
];

// Inštalácia Service Worker
self.addEventListener('install', (event) => {
    console.log('[SW] Inštalujem Service Worker...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Cachujem súbory');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => self.skipWaiting())
    );
});

// Aktivácia - vymaž staré cache
self.addEventListener('activate', (event) => {
    console.log('[SW] Aktivujem Service Worker...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[SW] Mažem starú cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch - cache first, then network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Vráť z cache ak existuje
                if (response) {
                    return response;
                }
                
                // Inak stiahni z internetu
                return fetch(event.request).then((response) => {
                    // Nekešuj ak nie je validná odpoveď
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    
                    // Kešuj novú odpoveď
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                    
                    return response;
                });
            })
            .catch(() => {
                // Offline fallback
                if (event.request.destination === 'document') {
                    return caches.match('/index.html');
                }
            })
    );
});
