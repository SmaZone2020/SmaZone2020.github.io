export interface PostData {
    id: string;
    title: string;
    date: string;
    tags: string[];
    description: string;
    image?: string;
    author?: string[];
    content: string;
}

const postModules = import.meta.glob('../posts/*.md', { eager: true, query: '?raw', import: 'default' });

function parseFrontMatter(raw: string): { data: Record<string, any>; content: string } {
    const normalized = (raw as string).replace(/\r\n/g, '\n');
    const match = normalized.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) return { data: {}, content: raw };
    const data: Record<string, any> = {};
    for (const line of match[1].split('\n')) {
        const kv = line.match(/^(\w+):\s*(.*)$/);
        if (!kv) continue;
        const key = kv[1];
        let value: any = kv[2].trim();
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        if (key === 'tags' || key === 'author') {
            const arrMatch = line.match(/^(?:tags|author):\s*\[(.*)\]$/);
            if (arrMatch) {
                value = arrMatch[1].split(',').map((s: string) => s.trim().replace(/^"|"$/g, '')).filter((s: string) => s.length > 0);
            } else if (key === 'author' && value) {
                value = [value];
            } else {
                value = [];
            }
        }
        data[key] = value;
    }
    return { data, content: match[2].trim() };
}

export function getSortedPostsData(): PostData[] {
    const posts: PostData[] = [];
    for (const [filepath, raw] of Object.entries(postModules)) {
        const id = filepath.replace(/^.*[\\/]/, '').replace(/\.md$/, '');
        const { data, content } = parseFrontMatter(raw as string);
        posts.push({
            id,
            title: data.title || id,
            date: data.date || '',
            tags: Array.isArray(data.tags) ? data.tags : [],
            description: data.description || '',
            image: data.image,
            author: Array.isArray(data.author) && data.author.length > 0 ? data.author : undefined,
            content,
        });
    }
    return posts.sort((a, b) => b.date.localeCompare(a.date));
}

export function getPostById(id: string): PostData | undefined {
    return getSortedPostsData().find(p => p.id === id);
}

export function getAllTags(): string[] {
    const tagSet = new Set<string>();
    for (const post of getSortedPostsData()) {
        for (const tag of post.tags) {
            tagSet.add(tag);
        }
    }
    return Array.from(tagSet);
}
