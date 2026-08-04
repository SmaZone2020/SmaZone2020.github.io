import type { Plugin } from 'vite';
import fs from 'fs';
import path from 'path';
import { marked } from 'marked';

function readJson(filePath: string): Record<string, any> {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return {};
  }
}

function getRssConfig() {
  const site = readJson(path.resolve(__dirname, 'src', 'data', 'site.json'));
  const seo = readJson(path.resolve(__dirname, 'src', 'data', 'seo.json'));
  return {
    siteUrl: seo.siteUrl || `https://${site.siteUrl || 'sma.zone'}`,
    title: seo.rssTitle || site.title || 'Sma.Zone',
    description: seo.rssDescription || site.description || '',
    language: seo.language || site.language || 'zh-cn',
  };
}

function getSite(): Record<string, any> {
  return readJson(path.resolve(__dirname, 'src', 'data', 'site.json'));
}

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
  contentHtml: string;
}

function parseFrontMatter(raw: string): { data: Record<string, any>; content: string } {
  const normalized = raw.replace(/\r\n/g, '\n');
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { data: {}, content: normalized };
  const data: Record<string, any> = {};
  for (const line of match[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) continue;
    const key = kv[1];
    let value: any = kv[2].trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    data[key] = value;
  }
  return { data, content: match[2].trim() };
}

function markdownToHtml(markdown: string): string {
  try {
    return marked.parse(markdown, { gfm: true, async: false });
  } catch {
    return escapeXml(markdown);
  }
}

function getPosts(): RssPost[] {
  const posts: RssPost[] = [];
  if (!fs.existsSync(POSTS_DIR)) return posts;
  for (const entry of fs.readdirSync(POSTS_DIR, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
    const id = entry.name.replace(/\.md$/, '');
    const raw = fs.readFileSync(path.join(POSTS_DIR, entry.name), 'utf-8');
    const { data, content } = parseFrontMatter(raw);
    posts.push({
      id,
      title: data.title || id,
      date: data.date || '',
      description: data.description || '',
      contentHtml: content ? markdownToHtml(content) : '',
    });
  }
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

function generateRssXml(): string {
  const cfg = getRssConfig();
  const posts = getPosts();
  if (posts.length === 0) return '';
  const lastBuildDate = toRfc822(posts[0].date);

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
<channel>
<title>${escapeXml(cfg.title)}</title>
<link>${escapeXml(cfg.siteUrl)}</link>
<description>${escapeXml(cfg.description)}</description>
<language>${escapeXml(cfg.language)}</language>
<lastBuildDate>${lastBuildDate}</lastBuildDate>
<atom:link href="${escapeXml(cfg.siteUrl)}/rss.xml" rel="self" type="application/rss+xml"/>
`;

  for (const post of posts) {
    const link = `${cfg.siteUrl}/blog/${post.id}`;
    const pubDate = toRfc822(post.date);
    xml += `
<item>
<title>${escapeXml(post.title)}</title>
<link>${escapeXml(link)}</link>
<guid isPermaLink="true">${escapeXml(link)}</guid>
<pubDate>${pubDate}</pubDate>
<description>${escapeXml(post.description || post.contentHtml)}</description>
<content:encoded><![CDATA[
${post.contentHtml}
]]></content:encoded>
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
