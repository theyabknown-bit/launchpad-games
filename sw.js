// sw.js – Service Worker to override CSP header
self.addEventListener('install', function(event) {
    console.log('✅ Service Worker installed');
    event.waitUntil(self.skipWaiting());
});
self.addEventListener('activate', function(event) {
    console.log('✅ Service Worker activated');
    event.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', function(event) {
    const request = event.request;
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request).then(function(response) {
                const clonedResponse = response.clone();
                const headers = new Headers(clonedResponse.headers);
                headers.set(
                    'Content-Security-Policy',
                    "default-src * 'self' data: 'unsafe-inline' 'unsafe-eval'; " +
                    "script-src * 'self' 'unsafe-inline' 'unsafe-eval' data:; " +
                    "style-src * 'self' 'unsafe-inline'; " +
                    "img-src * 'self' data: https:; " +
                    "connect-src * 'self' https:;"
                );
                return new Response(clonedResponse.body, {
                    status: clonedResponse.status,
                    statusText: clonedResponse.statusText,
                    headers: headers
                });
            }).catch(function(error) {
                console.error('Service Worker fetch error:', error);
                return fetch(request);
            })
        );
    } else {
        event.respondWith(fetch(request));
    }
});
