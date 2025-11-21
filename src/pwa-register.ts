// PWA Service Worker Registration
import { registerSW } from 'virtual:pwa-register';

export const registerServiceWorker = () => {
  const updateSW = registerSW({
    onNeedRefresh() {
      if (confirm('New content available. Reload to update?')) {
        updateSW(true);
      }
    },
    onOfflineReady() {
      // Silently ready in production
    },
    onRegistered() {
      // Silently registered in production
    },
    onRegisterError() {
      // Silently failed in production
    },
  });
};
