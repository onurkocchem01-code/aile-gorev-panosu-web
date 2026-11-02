// Aile Görev Panosu: internetsiz açılış için basit önbellek.
const SURUM = "agp-20261102232236";
const DOSYALAR = ["./", "index.html", "fb-config.js", "fb/firebase-app-compat.js", "fb/firebase-firestore-compat.js",
  "manifest.webmanifest", "ikon/ikon-192.png", "ikon/ikon-512.png", "ikon/apple-touch-icon.png", "ikon/favicon-32.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(SURUM).then(c => c.addAll(DOSYALAR)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== SURUM).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return; // Firebase ve yazı tipleri doğrudan ağdan
  if (e.request.mode === "navigate") { // sayfa: önce ağ (güncel sürüm), yoksa önbellek
    e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(SURUM).then(x => x.put("index.html", c)); return r; })
      .catch(() => caches.match("index.html")));
    return;
  }
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request)));
});
