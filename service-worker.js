

self.addEventListener('install', (event) => {
    self.skipWaiting();
  });
  
  self.addEventListener('activate', (event) => {
    return self.clients.claim();
  });
  
  self.addEventListener('push', (event) => {
    if (!event.data) return;
  
    const notificationData = event.data.json();
    
    const notificationOptions = {
      body: notificationData.options.body,
      icon: '/icon.png',
      badge: '/badge.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      },
      actions: [
        {
          action: 'view',
          title: 'View Story'
        }
      ]
    };
  
    event.waitUntil(
      self.registration.showNotification(notificationData.title, notificationOptions)
    );
  });
  
  self.addEventListener('notificationclick', (event) => {
    event.notification.close();
  
    if (event.action === 'view') {
      
      event.waitUntil(
        clients.openWindow('/#/')
      );
    } else {
      
      event.waitUntil(
        clients.openWindow('/#/')
      );
    }
  });

  importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

workbox.precaching.precacheAndRoute([
  { url: '/src/index.html', revision: '1' },
  { url: '/src/styles.css', revision: '1' },
  { url: '/src/index.js', revision: '1' },
  { url: 'manifest.json', revision: '1' }
]);

workbox.routing.registerRoute(
  ({ request }) => request.destination === 'image',
  new workbox.strategies.CacheFirst({
    cacheName: 'image-cache',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 5, 
        maxAgeSeconds: 24 * 60 * 60 
      })
    ]
  })
);

workbox.routing.registerRoute(
  new RegExp('https://story-api.dicoding.dev/v1/stories'),
  new workbox.strategies.NetworkFirst({
    cacheName: 'stories-cache',
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({ statuses: [0, 200] })
    ]
  })
);
