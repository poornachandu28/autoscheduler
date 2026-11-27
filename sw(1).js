const C='autosched-v3';
const FILES=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
// Always try the newest version from the internet first; use the saved copy only when offline.
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(fetch(e.request,{cache:'no-cache'}).then(r=>{
    if(r.ok&&new URL(e.request.url).origin===location.origin){const copy=r.clone();caches.open(C).then(c=>c.put(e.request,copy))}
    return r}).catch(()=>caches.match(e.request)));
});
