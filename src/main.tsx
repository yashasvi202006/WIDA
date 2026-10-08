import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ensureMswActive } from './mocks/browser'

async function prepareApp() {
  if (typeof window !== 'undefined') {
    try {
      await ensureMswActive();
      console.log('[MSW] Mock Service Worker registered and active.');
    } catch (err) {
      console.warn('[MSW] Worker registration skipped or failed:', err);
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
