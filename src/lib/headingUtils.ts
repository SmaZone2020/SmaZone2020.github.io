export function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[\s]+/g, '-')
        .replace(/[^\w一-龥-]/g, '')
        .replace(/--+/g, '-');
}

export interface HeadingEntry {
    id: string;
    text: string;
    level: number;
}

export function computeHeadings(markdown: string): HeadingEntry[] {
    const headings: HeadingEntry[] = [];
    const slugCount: Record<string, number> = {};
    let inFence = false;
    for (const line of markdown.split('\n')) {
        if (line.startsWith('```') || line.startsWith('~~~')) { inFence = !inFence; continue; }
        if (inFence) continue;
        const match = line.match(/^(#{1,6})\s+(.+)$/);
        if (!match) continue;
        const level = match[1].length;
        const text = match[2]
            .replace(/\*\*?([^*]+)\*\*?/g, '$1')
            .replace(/`([^`]+)`/g, '$1')
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
            .trim();
        const base = slugify(text);
        const n = (slugCount[base] = (slugCount[base] ?? 0) + 1);
        headings.push({ id: n === 1 ? base : `${base}-${n}`, text, level });
    }
    return headings;
}
