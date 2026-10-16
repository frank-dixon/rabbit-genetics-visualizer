import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// Dev server (vite / vite serve) runs at the root; the GitHub Pages build lives at /rabbit/.
export default defineConfig(({ command, isPreview }) => {
  // `vite preview` also reports command 'serve'; it must serve the /rabbit/ build.
  const base = command === 'serve' && !isPreview ? '/' : '/rabbit/';
  return {
    base,
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        scope: base,
        base,
        includeAssets: ['icon.svg', 'favicon.svg', 'apple-touch-icon.png'],
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          cleanupOutdatedCaches: true,
        },
        manifest: {
          name: 'Rabbit Progeny Predictor',
          short_name: 'Progeny Predictor',
          description: 'Predict meat rabbit progeny coat and eye colors from parent crosses.',
          theme_color: '#13203B',
          background_color: '#FFFDF7',
          display: 'standalone',
          orientation: 'any',
          // Follow the Vite base (/ in dev, /rabbit/ in the Pages build)
          start_url: base,
          scope: base,
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
      }),
    ],
  };
});
