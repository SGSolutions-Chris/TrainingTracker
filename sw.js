const CACHE = 'training-tracker-v2';
const SHELL = [
  './index.html'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = e.request.url;

  // Nur http/https verarbeiten
  if(!url.startsWith('http')) return;

  // Supabase, Auth, externe APIs immer ans Netzwerk
  if(url.includes('supabase.co') || url.includes('googleapis.com') || url.includes('jsdelivr.net')) {
    e.respondWith(fetch(e.request));
    return;
  }

  // App Shell: Network first, Cache als Fallback
  e.respondWith(
    fetch(e.request).then(res => {
      if(res && res.status === 200 && e.request.method === 'GET') {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
      }
      return res;
    }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
