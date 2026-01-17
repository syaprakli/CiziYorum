import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: '/CiziYorum/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'ÇiziYorum - Resim Atölyesi',
        short_name: 'ÇiziYorum',
        description: 'Çocuklar için eğlenceli çizim ve boyama uygulaması',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'img/logo_new.jpg',
            sizes: '512x512',
            type: 'image/jpeg'
          },
          {
            src: 'img/logo_new.jpg',
            sizes: '192x192',
            type: 'image/jpeg'
          }
        ]
      }
    })
  ],
})
