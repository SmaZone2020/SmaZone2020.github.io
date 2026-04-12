export interface PostData {
    id: string;
    title: string;
    date: string;
    tags: string[];
    description: string;
    image?: string;
    content: string;
}

interface FrontMatter {
    title?: string;
    date?: string | Date;
    tags?: string[];
    description?: string;
    image?: string;
}

function parseFrontMatter(raw: string): { data: FrontMatter; content: string } {
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
    if (!match) {
        return { data: {}, content: raw };
    }

    const yamlStr = match[1];
    const content = match[2];
    const data: Record<string, any> = {};

    for (const line of yamlStr.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;

        const colonIdx = trimmed.indexOf(':');
        if (colonIdx === -1) continue;

        const key = trimmed.slice(0, colonIdx).trim();
        let value: any = trimmed.slice(colonIdx + 1).trim();

        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }

        if (value.startsWith('[') && value.endsWith(']')) {
            const inner = value.slice(1, -1);
            value = inner
                .split(',')
                .map((s: string) => s.trim().replace(/^["']|["']$/g, ''))
                .filter((s: string) => s.length > 0);
        }

        data[key] = value;
    }

    return { data: data as FrontMatter, content };
}

function formatDate(date: string | Date | undefined): string {
    if (!date) return '';
    if (date instanceof Date) {
        return date.toISOString().split('T')[0];
    }
    const d = new Date(date);
    if (isNaN(d.getTime())) return String(date);
    return d.toISOString().split('T')[0];
}

const postModules = import.meta.glob('/src/posts/*.md', {
    query: '?raw',
    import: 'default',
    eager: true,
}) as Record<string, string>;

export function getSortedPostsData(): PostData[] {
    const posts: PostData[] = [];

    for (const [path, raw] of Object.entries(postModules)) {
        const match = path.match(/\/([^/]+)\.md$/);
        if (!match) continue;
        const id = match[1];

        const { data, content } = parseFrontMatter(raw);

        posts.push({
            id,
            title: data.title || id,
            date: formatDate(data.date),
            tags: Array.isArray(data.tags) ? data.tags : [],
            description: data.description || '',
            image: data.image,
            content,
        });
    }

    posts.sort((a, b) => (a.date > b.date ? -1 : a.date < b.date ? 1 : 0));

    return posts;
}

export function getPostById(id: string): PostData | undefined {
    const allPosts = getSortedPostsData();
    return allPosts.find(p => p.id === id);
}

export function getAllTags(): string[] {
    const allPosts = getSortedPostsData();
    const tagSet = new Set<string>();
    for (const post of allPosts) {
        for (const tag of post.tags) {
            tagSet.add(tag);
        }
    }
    return Array.from(tagSet);
}
