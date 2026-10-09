import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ensureMswActive } from './mocks/browser'

async function prepareApp() {
  if (typeof window !== 'undefined') {
    try {
      // Check if Java Enterprise Backend is active on port 8080
      const javaBackendAlive = await fetch('http://localhost:8080/api/system/health', { 
        signal: AbortSignal.timeout(800) 
      }).then(r => r.ok).catch(() => false);

      if (javaBackendAlive) {
        console.log('[WIDA] Connected to Java Backend & SQLite Database on http://localhost:8080');
        // If a service worker was previously registered, unregister it so requests reach the Java backend
        if ('serviceWorker' in navigator) {
          const regs = await navigator.serviceWorker.getRegistrations();
          for (const reg of regs) {
            await reg.unregister();
          }
        }
        return;
      }

      // Fallback: If Java backend is not running, activate MSW
      await ensureMswActive();
      console.log('[MSW] Fallback: Mock Service Worker active.');
    } catch (err) {
      console.warn('[MSW/Java Backend] Status check skipped:', err);
    }
  }
}

prepareApp().finally(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
