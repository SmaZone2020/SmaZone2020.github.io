import type { Plugin } from 'vite';
import fs from 'fs';
import path from 'path';

function readJson(filePath: string): Record<string, any> {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return {};
  }
}

const POSTS_DIR = path.resolve(__dirname, 'src', 'posts');

function parseFrontMatter(raw: string): Record<string, any> {
  const normalized = raw.replace(/\r\n/g, '\n');
  const match = normalized.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const data: Record<string, any> = {};
  for (const line of match[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) continue;
    const key = kv[1];
    let value: any = kv[2].trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    data[key] = value;
  }
  return data;
}

interface SitemapPost {
  id: string;
  date: string;
}

function getPosts(): SitemapPost[] {
  const posts: SitemapPost[] = [];
  if (!fs.existsSync(POSTS_DIR)) return posts;
  for (const entry of fs.readdirSync(POSTS_DIR, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
    const id = entry.name.replace(/\.md$/, '');
    const raw = fs.readFileSync(path.join(POSTS_DIR, entry.name), 'utf-8');
    const data = parseFrontMatter(raw);
    posts.push({ id, date: data.date || '' });
  }
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

function toW3cDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return new Date().toISOString().split('T')[0];
  return d.toISOString().split('T')[0];
}

const STATIC_ROUTES = ['', '/blog', '/archive', '/portfolio', '/friends', '/about'];

function generateSitemapXml(): string {
  const seo = readJson(path.resolve(__dirname, 'src', 'data', 'seo.json'));
  const site = readJson(path.resolve(__dirname, 'src', 'data', 'site.json'));
  const siteUrl = (seo.siteUrl || `https://${site.siteUrl || 'sma.zone'}`).replace(/\/$/, '');

  const posts = getPosts();
  const today = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  for (const route of STATIC_ROUTES) {
    xml += `
  <url>
    <loc>${siteUrl}${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route === '' ? '1.0' : '0.8'}</priority>
  </url>`;
  }

  for (const post of posts) {
    xml += `
  <url>
    <loc>${siteUrl}/blog/${post.id}</loc>
    <lastmod>${toW3cDate(post.date)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
  }

  xml += `\n</urlset>`;
  return xml;
}

export function sitemapPlugin(): Plugin {
  return {
    name: 'sitemap-generator',
    closeBundle() {
      const xml = generateSitemapXml();
      const outDir = path.resolve(__dirname, 'dist');
      if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(path.join(outDir, 'sitemap.xml'), xml, 'utf-8');
      console.log('Sitemap generated: dist/sitemap.xml');
    },
    configureServer(server) {
      server.middlewares.use('/sitemap.xml', (_req, res) => {
        res.setHeader('Content-Type', 'application/xml; charset=utf-8');
        res.end(generateSitemapXml());
      });
    },
  };
}
