import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import type { ReactNode } from 'react';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FadeImg from '../../components/FadeImg';

interface MarkdownArticleProps {
    content: string;
}

function slugify(text: ReactNode): string {
    return String(text)
        .toLowerCase()
        .trim()
        .replace(/[\s]+/g, '-')
        .replace(/[^\w一-龥-]/g, '')
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

function CopyCodeBlock({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) {
    const [copied, setCopied] = useState(false);
    const preRef = useRef<HTMLPreElement>(null);

    const handleCopy = () => {
        const text = preRef.current?.querySelector('code')?.innerText ?? preRef.current?.innerText ?? '';
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch(() => {});
    };

    return (
        <div className="relative group">
            <pre ref={preRef} {...props}>{children}</pre>
            <button
                onClick={handleCopy}
                aria-label="Copy code"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 text-xs rounded bg-gray-700/80 text-gray-200 hover:bg-gray-600"
            >
                {copied ? '✓ Copied' : 'Copy'}
            </button>
        </div>
    );
}

function MarkdownArticle({ content }: MarkdownArticleProps) {
    const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

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
                    pre: ({ children, ...props }) => <CopyCodeBlock {...props}>{children}</CopyCodeBlock>,
                    img: ({ node: _node, src, alt, ...props }) => (
                        <FadeImg
                            src={src}
                            alt={alt || ''}
                            className="rounded-2xl max-w-full h-auto my-4 cursor-zoom-in"
                            loading="lazy"
                            onClick={() => src && setLightboxSrc(src)}
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

            <AnimatePresence>
                {lightboxSrc && (
                    <motion.div
                        key="lightbox"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm cursor-zoom-out p-4"
                        onClick={() => setLightboxSrc(null)}
                    >
                        <motion.img
                            src={lightboxSrc}
                            alt="Preview"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            className="max-w-full max-h-full object-contain rounded-2xl select-none"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </article>
    );
}

export default MarkdownArticle;
