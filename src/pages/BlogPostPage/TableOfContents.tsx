import { useEffect, useState, useRef } from 'react';

interface Heading {
    id: string;
    text: string;
    level: number;
}

function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[\s]+/g, '-')
        .replace(/[^\w一-龥-]/g, '')
        .replace(/--+/g, '-');
}

function parseHeadings(markdown: string): Heading[] {
    const headings: Heading[] = [];
    const lines = markdown.split('\n');
    let inFence = false;
    for (const line of lines) {
        if (line.startsWith('```') || line.startsWith('~~~')) {
            inFence = !inFence;
            continue;
        }
        if (inFence) continue;
        const match = line.match(/^(#{1,6})\s+(.+)$/);
        if (!match) continue;
        const level = match[1].length;
        const text = match[2].replace(/\*\*?([^*]+)\*\*?/g, '$1').replace(/`([^`]+)`/g, '$1').trim();
        headings.push({ id: slugify(text), text, level });
    }
    return headings;
}

interface TableOfContentsProps {
    content: string;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
    const headings = parseHeadings(content);
    const [activeId, setActiveId] = useState<string>('');
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        if (headings.length === 0) return;
        const root = document.getElementById('root');

        observerRef.current?.disconnect();
        observerRef.current = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                        break;
                    }
                }
            },
            { root, rootMargin: '-10% 0px -80% 0px', threshold: 0 }
        );

        for (const h of headings) {
            const el = document.getElementById(h.id);
            if (el) observerRef.current.observe(el);
        }

        return () => observerRef.current?.disconnect();
    }, [content]);

    if (headings.length < 2) return null;

    const minLevel = Math.min(...headings.map(h => h.level));

    return (
        <nav aria-label="Table of contents" className="hidden xl:block w-56 shrink-0">
            <div className="sticky top-8 max-h-[calc(100vh-8rem)] overflow-y-auto">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">目录</p>
                <ul className="space-y-1">
                    {headings.map((h) => {
                        const indent = (h.level - minLevel) * 12;
                        const isActive = activeId === h.id;
                        return (
                            <li key={`${h.id}-${h.level}`} style={{ paddingLeft: indent }}>
                                <a
                                    href={`#${h.id}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const el = document.getElementById(h.id);
                                        if (el) {
                                            el.scrollIntoView({ behavior: 'smooth' });
                                            window.history.pushState(null, '', `#${h.id}`);
                                            setActiveId(h.id);
                                        }
                                    }}
                                    className={`block text-sm leading-snug py-0.5 transition-colors truncate ${isActive
                                        ? 'text-blue-500 dark:text-blue-400 font-medium'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                                    }`}
                                >
                                    {h.text}
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </nav>
    );
}
