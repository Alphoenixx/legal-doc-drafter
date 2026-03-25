import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './theme/tokens.css';
import './index.css';

console.log('[main.jsx] Starting app mount...');

async function bootstrap() {
  try {
    const { default: App } = await import('./App.jsx');
    console.log('[main.jsx] App imported successfully, mounting...');
    createRoot(document.getElementById('root')).render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
    console.log('[main.jsx] Render called.');
  } catch (err) {
    console.error('[main.jsx] Fatal error during bootstrap:', err);
    document.getElementById('root').innerHTML = `
      <div style="color: #ef4444; padding: 40px; font-family: monospace;">
        <h2>App Failed to Load</h2>
        <pre>${err.message}\n${err.stack}</pre>
      </div>
    `;
  }
}

// Detect reduced motion preference early
if (typeof window !== 'undefined') {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mq.matches) {
    document.documentElement.classList.add('reduced-motion');
  }
  mq.addEventListener('change', (e) => {
    document.documentElement.classList.toggle('reduced-motion', e.matches);
  });
}

bootstrap();
