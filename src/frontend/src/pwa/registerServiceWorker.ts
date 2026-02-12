export function registerServiceWorker(): void {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration.scope);

          // Handle updates - when a new service worker is waiting, activate it immediately
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New service worker available, send skip waiting message
                  newWorker.postMessage({ type: 'SKIP_WAITING' });
                  console.log('New service worker installed, activating...');
                }
              });
            }
          });

          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 60000); // Check every minute
        })
        .catch((error) => {
          console.warn('Service Worker registration failed:', error);
        });

      // Reload page when new service worker takes control
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          console.log('New service worker activated, reloading page...');
          // Small delay to ensure the new worker is fully active
          setTimeout(() => {
            window.location.reload();
          }, 100);
        }
      });

      // Revalidate on visibility change to ensure fresh content
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({ type: 'CHECK_UPDATE' });
        }
      });
    });
  }
}
