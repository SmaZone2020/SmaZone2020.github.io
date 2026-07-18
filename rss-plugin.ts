import type { Plugin } from 'vite';
import fs from 'fs';
import path from 'path';

const SITE_URL = 'https://sma.zone';
const SITE_TITLE = 'Sma.Zone';
const SITE_DESCRIPTION = "Maxwell Ma's Blog";
const POSTS_DIR = path.resolve(__dirname, 'src', 'posts');

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toRfc822(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return new Date().toUTCString();
  return d.toUTCString();
}

interface RssPost {
  id: string;
  title: string;
  date: string;
  description: string;
}

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

function getPosts(): RssPost[] {
  const posts: RssPost[] = [];
  if (!fs.existsSync(POSTS_DIR)) return posts;
  for (const entry of fs.readdirSync(POSTS_DIR, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
    const id = entry.name.replace(/\.md$/, '');
    const raw = fs.readFileSync(path.join(POSTS_DIR, entry.name), 'utf-8');
    const data = parseFrontMatter(raw);
    posts.push({
      id,
      title: data.title || id,
      date: data.date || '',
      description: data.description || '',
    });
  }
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

function generateRssXml(): string {
  const posts = getPosts();
  if (posts.length === 0) return '';
  const lastBuildDate = toRfc822(posts[0].date);

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${escapeXml(SITE_TITLE)}</title>
<link>${escapeXml(SITE_URL)}</link>
<description>${escapeXml(SITE_DESCRIPTION)}</description>
<language>zh-cn</language>
<lastBuildDate>${lastBuildDate}</lastBuildDate>
<atom:link href="${escapeXml(SITE_URL)}/rss.xml" rel="self" type="application/rss+xml"/>
`;

  for (const post of posts) {
    const link = `${SITE_URL}/blog/${post.id}`;
    const pubDate = toRfc822(post.date);
    xml += `
<item>
<title>${escapeXml(post.title)}</title>
<link>${escapeXml(link)}</link>
<guid isPermaLink="true">${escapeXml(link)}</guid>
<pubDate>${pubDate}</pubDate>
<description>${escapeXml(post.description)}</description>
</item>`;
  }

  xml += `
</channel>
</rss>`;
  return xml;
}

export function rssPlugin(): Plugin {
  return {
    name: 'rss-generator',
    closeBundle() {
      const xml = generateRssXml();
      if (!xml) return;
      const outDir = path.resolve(__dirname, 'dist');
      if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(path.join(outDir, 'rss.xml'), xml, 'utf-8');
      console.log('RSS feed generated: dist/rss.xml');
    },
    configureServer(server) {
      server.middlewares.use('/rss.xml', (_req, res) => {
        const xml = generateRssXml();
        res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
        res.end(xml);
      });
    },
  };
}
