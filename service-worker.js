importScripts(
  "https://unpkg.com/react@16.4.2/umd/react.development.js",
  "https://unpkg.com/react-dom@16.4.2/umd/react-dom-server.browser.development.js",
  "app.js"
);

const cacheName = "ReactSW";

// Add lib scripts to cache
self.addEventListener("install", async () => {
  const cache = await self.caches.open(cacheName);
  return cache.addAll([
    "//unpkg.com/react@16.0.0/umd/react.production.min.js",
    "//unpkg.com/react-dom@16.0.0/umd/react-dom.production.min.js"
  ]);
});

// Claim clients so we can respond to http://127.0.0.1:8080
self.addEventListener("activate", function(event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", async fetchEvent => {
  if (fetchEvent.request.method !== "GET") return;

  // Generate response for index.html
  if (fetchEvent.request.url === "http://127.0.0.1:8080/") {
    const headers = new Headers();
    headers.append("Content-Type", "text/html");
    const response = new Response(render(), {
      headers
    });
    return fetchEvent.respondWith(response);
  }

  // Read from existing cache
  const cache = await self.caches.open(cacheName);
  const response = await cache.match(fetchEvent.request);
  if (response) {
    return response;
  }

  // Read from network and store cache
  const networkResponse = await fetch(fetchEvent.request);
  await cache.put(fetchEvent.request, networkResponse.clone());
  return networkResponse;
});

function render() {
  const appString = ReactDOMServer.renderToString(App());
  return `
        <!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>(SW Rendered) React App</title>
            <script src="//unpkg.com/react@16.0.0/umd/react.development.js"></script>
            <script src="//unpkg.com/react-dom@16.0.0/umd/react-dom.development.js"></script>
        </head>
        <body>
          <div id="root">${appString}</div>
          <script src="./app.js"></script>
          <script src="./client.js"></script>
          <script src="./register-sw.js"></script>
        </body>
        </html>`;
}
