import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt'],
      manifest: {
        name: 'FSDAMS - Farm Safety & Distress Alert System',
        short_name: 'FSDAMS',
        description: 'Farmer Security & Distress Alert System',
        theme_color: '#16a34a',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        // Queues failed check-in/check-out requests while offline, syncs when back online
        runtimeCaching: [
          {
            urlPattern: /\/api\/checkins/,
            handler: 'NetworkOnly',
            options: {
              backgroundSync: {
                name: 'checkin-queue',
                options: { maxRetentionTime: 24 * 60 },
              },
            },
          },
        ],
      },
    }),
  ],
  server: {
    port: 5173,
  },
});
