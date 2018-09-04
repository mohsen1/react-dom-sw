const swUrl = new URL("service-worker.js", window.location.href);

navigator.serviceWorker.register(swUrl.toString(), { scope: "/" });
