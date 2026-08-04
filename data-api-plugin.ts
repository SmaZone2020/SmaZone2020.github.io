import type { Plugin } from 'vite';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.resolve(__dirname, 'src', 'data');
const POSTS_DIR = path.resolve(__dirname, 'src', 'posts');
const PUBLIC_DIR = path.resolve(__dirname, 'public');
const IMAGE_EXT = /\.(png|jpg|jpeg|gif|webp|svg|ico|bmp)$/i;

const VALID_FILES = ['site', 'projects', 'friends', 'goals', 'tech', 'navigation', 'seo', 'appearance'];

function walkDir(dir: string): string[] {
  const results: string[] = [];
  try {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        results.push(...walkDir(full));
      } else {
        results.push(full);
      }
    }
  } catch { /* dir may not exist */ }
  return results;
}

function postToMarkdown(post: Record<string, any>): string {
  const frontmatter: string[] = [];
  frontmatter.push(`title: "${post.title || ''}"`);
  frontmatter.push(`date: ${post.date || ''}`);
  if (Array.isArray(post.tags) && post.tags.length > 0) {
    const tags = post.tags.map((t: string) => `"${t}"`).join(', ');
    frontmatter.push(`tags: [${tags}]`);
  }
  frontmatter.push(`description: "${post.description || ''}"`);
  if (post.image) {
    frontmatter.push(`image: "${post.image}"`);
  }
  if (Array.isArray(post.author) && post.author.length > 0) {
    const authors = post.author.map((a: string) => `"${a}"`).join(', ');
    frontmatter.push(`author: [${authors}]`);
  }
  return `---\n${frontmatter.join('\n')}\n---\n\n${post.content || ''}`;
}

export function dataApiPlugin(): Plugin {
  return {
    name: 'data-api',
    apply: 'serve',
    configureServer(server) {
      // JSON data API
      server.middlewares.use('/api/data', (req, res, next) => {
        const file = req.url?.split('/').pop()?.split('?')[0];
        if (!file || file === 'data') { next(); return; }
        if (!VALID_FILES.includes(file)) {
          next();
          return;
        }

        res.setHeader('Content-Type', 'application/json');

        if (req.method === 'GET') {
          try {
            const filePath = path.join(DATA_DIR, file + '.json');
            if (fs.existsSync(filePath)) {
              res.end(fs.readFileSync(filePath, 'utf-8'));
            } else {
              res.statusCode = 404;
              res.end(JSON.stringify({ error: 'Not found' }));
            }
          } catch (err: any) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
          }
          return;
        }

        if (req.method === 'PUT') {
          let body = '';
          req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
          req.on('end', () => {
            try {
              const parsed = JSON.parse(body);
              const filePath = path.join(DATA_DIR, file + '.json');
              if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
              fs.writeFileSync(filePath, JSON.stringify(parsed, null, 2), 'utf-8');
              res.end(JSON.stringify({ ok: true }));
            } catch (err: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        res.statusCode = 405;
        res.end();
      });

      // Markdown posts API
      server.middlewares.use('/api/posts', (req, res) => {
        if (req.method === 'PUT') {
          let body = '';
          req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
          req.on('end', () => {
            try {
              const post = JSON.parse(body);
              const id = post.id || String(Date.now());
              const filePath = path.join(POSTS_DIR, `${id}.md`);
              if (!fs.existsSync(POSTS_DIR)) fs.mkdirSync(POSTS_DIR, { recursive: true });
              fs.writeFileSync(filePath, postToMarkdown(post), 'utf-8');
              res.end(JSON.stringify({ ok: true, id }));
            } catch (err: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        if (req.method === 'DELETE') {
          let body = '';
          req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
          req.on('end', () => {
            try {
              const { id } = JSON.parse(body);
              if (!id) { res.statusCode = 400; res.end(JSON.stringify({ error: 'Missing id' })); return; }
              const filePath = path.join(POSTS_DIR, `${id}.md`);
              if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                res.end(JSON.stringify({ ok: true }));
              } else {
                res.statusCode = 404;
                res.end(JSON.stringify({ error: 'Not found' }));
              }
            } catch (err: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        res.statusCode = 405;
        res.end();
      });

      // Image API
      server.middlewares.use('/api/images/upload', (req, res) => {
        if (req.method !== 'POST') { res.statusCode = 405; res.end(); return; }
        let body = '';
        req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
        req.on('end', () => {
          try {
            const { filename, data } = JSON.parse(body);
            const base64Data = data.replace(/^data:image\/\w+;base64,/, '');
            const buf = Buffer.from(base64Data, 'base64');
            const destDir = path.join(PUBLIC_DIR, 'images');
            if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
            const safeName = path.basename(filename);
            fs.writeFileSync(path.join(destDir, safeName), buf);
            res.end(JSON.stringify({ path: `/images/${safeName}` }));
          } catch (err: any) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
          }
        });
      });

      server.middlewares.use('/api/images', (_req, res) => {
        const files = walkDir(PUBLIC_DIR).filter(f => IMAGE_EXT.test(f));
        const relative = files
          .map(f => '/' + path.relative(PUBLIC_DIR, f).replace(/\\/g, '/'))
          .sort();
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(relative));
      });
    },
  };
}
