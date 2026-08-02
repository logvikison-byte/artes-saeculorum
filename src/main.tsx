import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Offline support: sessions keep working with no network after the first visit.
if ('serviceWorker' in navigator && location.protocol !== 'blob:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {
      // Registration fails on unsupported/insecure origins — the app still works.
    });
  });
}
