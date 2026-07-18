import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { rssPlugin } from './rss-plugin'
import { dataApiPlugin } from './data-api-plugin'

export default defineConfig({
  plugins: [react(), rssPlugin(), dataApiPlugin()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
