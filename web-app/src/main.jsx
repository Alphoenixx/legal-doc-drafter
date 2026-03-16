import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

console.log('[main.jsx] Starting app mount...');

// Wrap in try/catch to surface any import errors
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

bootstrap();
