  // REGISTER SERVICE WORKER
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then(function () {
          console.log("Pendaftaran ServiceWorker berhasil");
        })
        .catch(function () {
          console.log("Pendaftaran ServiceWorker gagal");
        });
    });
  } else {
    console.log("ServiceWorker belum didukung browser ini.");
  }

  const CACHE_NAME = "bwii";
  var urlsToCache = [
    "/",
    "/admin/admin.html",
    "/admin/admin.js",
    "/dist/bundle.js",
    "/pages/home.html",
    "/pages/about.html",
    "/pages/inventaris.html",
    "/banner.png",
    "/BMKG-02.png",
    "/details.html",
    "/index.html",
    "/nav.html",
    "/favicon.ico",
    "/manifest.json",
    "/icon.png"
  ];

  self.addEventListener("install", function (event) {
    event.waitUntil(
      caches.open(CACHE_NAME).then(function (cache) {
        return cache.addAll(urlsToCache);
      })
    );
  });

  self.addEventListener("fetch", function (event) {
    event.respondWith(
      caches
      .match(event.request, {
        cacheName: CACHE_NAME
      })
      .then(function (response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
    );
  });
  self.addEventListener("activate", function (event) {
    event.waitUntil(
      caches.keys().then(function (cacheNames) {
        return Promise.all(
          cacheNames.map(function (cacheName) {
            if (cacheName != CACHE_NAME) {
              console.log("ServiceWorker: cache " + cacheName + " dihapus");
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  });

  self.addEventListener('push', function(event) {
    var body;
    if (event.data) {
      body = event.data.text();
    } else {
      body = 'Push message no payload';
    }
    var options = {
      body: body,
      icon: 'BMKG-02.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      }
    };
    event.waitUntil(
      self.registration.showNotification('Push Notification', options)
    );
  });