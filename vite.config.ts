import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { rssPlugin } from './rss-plugin'
import { dataApiPlugin } from './data-api-plugin'
import fs from 'fs'
import path from 'path'

function readJson(filePath: string): Record<string, any> {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return {};
  }
}

export default defineConfig({
  plugins: [
    react(),
    rssPlugin(),
    dataApiPlugin(),
    {
      name: 'html-inject',
      transformIndexHtml(html) {
        const site = readJson(path.resolve(__dirname, 'src', 'data', 'site.json'));
        const seo = readJson(path.resolve(__dirname, 'src', 'data', 'seo.json'));

        const title = seo.title || site.title || 'SmaZone';
        const description = seo.description || site.description || '';
        const keywords = seo.keywords || '';
        const author = seo.author || site.author || '';

        return html
          .replace(/{{TITLE}}/g, title)
          .replace(/{{DESCRIPTION}}/g, description)
          .replace(/{{KEYWORDS}}/g, keywords)
          .replace(/{{AUTHOR}}/g, author);
      },
    },
  ],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
