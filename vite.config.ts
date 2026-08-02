import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * Injects the emitted (hash-named) asset list into the service worker so it can
 * precache them. Without this the SW only holds the HTML shell, and a visitor
 * who goes offline after one visit gets a blank page.
 */
function stillpointPrecache(): Plugin {
  let assets: string[] = [];
  return {
    name: 'stillpoint-precache',
    apply: 'build',
    generateBundle(_options, bundle) {
      assets = Object.keys(bundle)
        .filter((name) => name !== 'index.html')
        .map((name) => `./${name}`);
    },
    closeBundle() {
      const swPath = resolve(__dirname, 'dist/sw.js');
      if (!existsSync(swPath)) return;
      const source = readFileSync(swPath, 'utf8');
      writeFileSync(swPath, source.replace('/* __PRECACHE__ */', assets.map((a) => JSON.stringify(a)).join(', ')));
    },
  };
}

export default defineConfig({
  // Relative asset URLs so the built site works from any path — including the
  // /<repo>/ subpath GitHub Pages serves from. Safe because routing is hash-based.
  base: './',
  plugins: [react(), tailwindcss(), stillpointPrecache()],
});
