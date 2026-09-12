import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/rabbit/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'favicon.svg', 'apple-touch-icon.png'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        cleanupOutdatedCaches: true,
      },
      manifest: {
        name: 'Rabbit Progeny Predictor',
        short_name: 'Progeny Predictor',
        description: 'Predict meat rabbit progeny coat and eye colors from parent crosses.',
        theme_color: '#0B8A8F',
        background_color: '#F3EEE4',
        display: 'standalone',
        orientation: 'any',
        // Absolute under hub subpath (matches Vite base '/rabbit/')
        start_url: '/rabbit/',
        scope: '/rabbit/',
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
});
