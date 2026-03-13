'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      navigator.serviceWorker?.getRegistrations().then((registrations) => {
        registrations.forEach((r) => r.unregister());
      });
      return;
    }

    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker.getRegistrations().then((registrations) => {
      if (registrations.length > 0) return;
      navigator.serviceWorker.register('/sw.js');
    });
  }, []);

  return null;
}
