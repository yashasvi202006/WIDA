// WIDA Mock Service Worker Browser Setup
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';
export const worker = setupWorker(...handlers);
let startPromise = null;
export async function ensureMswActive() {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
        return undefined;
    }
    if (!startPromise) {
        startPromise = worker.start({
            onUnhandledFrame: 'bypass',
            serviceWorker: {
                url: '/mockServiceWorker.js'
            }
        });
    }
    return startPromise;
}
