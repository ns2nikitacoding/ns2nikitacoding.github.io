// Cache name
const CACHE_NAME = 'extracurricular-cache-v1';

// Files to cache
const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/manifest.json',
    '/icon-192x192.png',
    '/icon-512x512.png'
];

// Install event
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Caching files');
            return cache.addAll(FILES_TO_CACHE);
        })
    );
});

// Activate event
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch event
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Return cached response if found, otherwise fetch from network
            return response || fetch(event.request);
        })
    );
});

// Push notifications
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};
    const options = {
        body: data.body || 'Notifikasi baru!',
        icon: data.icon || 'icon-192x192.png',
        badge: data.badge || 'icon-192x192.png'
    };
    event.waitUntil(
        self.registration.showNotification(data.title || 'Ekstrakurikuler', options)
    );
});

navigator.serviceWorker.register('service-worker.js')
  .then(registration => {
    console.log('Service Worker registered with scope:', registration.scope);
  });

  Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      console.log('Permission granted for notifications');
    }
  });
  
  registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array('YOUR_PUBLIC_VAPID_KEY')
  }).then(subscription => {
    console.log('User  is subscribed:', subscription);
  });

  self.addEventListener('install', event => {
    event.waitUntil(
      caches.open('my-cache').then(cache => {
        return cache.addAll([
          '/',
          '/index.html',
          '/styles.css',
          '/script.js'
        ]);
      })
    );
  });

  self.addEventListener('fetch', event => {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  });  