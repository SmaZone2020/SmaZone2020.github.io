import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import type { ReactNode } from 'react';
import FadeImg from '../../components/FadeImg';

interface MarkdownArticleProps {
    content: string;
}

function slugify(text: ReactNode): string {
    return String(text)
        .toLowerCase()
        .trim()
        .replace(/[\s]+/g, '-')
        .replace(/[^\w\u4e00-\u9fa5-]/g, '')
        .replace(/--+/g, '-');
}

function HeadingWithAnchor({ level, children }: { level: 1 | 2 | 3 | 4 | 5 | 6; children: ReactNode }) {
    const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    const id = slugify(children);

    return (
        <Tag id={id}>
            {children}
            <a
                href={`#${id}`}
                className="heading-anchor"
                aria-label={`Link to section: ${String(children)}`}
                onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById(id);
                    if (el) {
                        el.scrollIntoView({ behavior: 'smooth' });
                        window.history.pushState(null, '', `#${id}`);
                    }
                }}
            >
                #
            </a>
        </Tag>
    );
}

function MarkdownArticle({ content }: MarkdownArticleProps) {
    return (
        <article className="prose-article">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeHighlight]}
                components={{
                    h1: ({ children }) => <HeadingWithAnchor level={1}>{children}</HeadingWithAnchor>,
                    h2: ({ children }) => <HeadingWithAnchor level={2}>{children}</HeadingWithAnchor>,
                    h3: ({ children }) => <HeadingWithAnchor level={3}>{children}</HeadingWithAnchor>,
                    h4: ({ children }) => <HeadingWithAnchor level={4}>{children}</HeadingWithAnchor>,
                    h5: ({ children }) => <HeadingWithAnchor level={5}>{children}</HeadingWithAnchor>,
                    h6: ({ children }) => <HeadingWithAnchor level={6}>{children}</HeadingWithAnchor>,
                    img: ({ node: _node, src, alt, ...props }) => (
                        <FadeImg
                            src={src}
                            alt={alt || ''}
                            className="rounded-2xl max-w-full h-auto my-4"
                            loading="lazy"
                            {...props}
                        />
                    ),
                    a: ({ href, children, ...props }) => (
                        <a
                            href={href}
                            target={href?.startsWith('http') ? '_blank' : undefined}
                            rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                            className="text-blue-500 hover:text-blue-600 dark:text-blue-400 underline"
                            {...props}
                        >
                            {children}
                        </a>
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </article>
    );
}

export default MarkdownArticle;
