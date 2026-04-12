import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';

interface MarkdownArticleProps {
    content: string;
}

function MarkdownArticle({ content }: MarkdownArticleProps) {
    return (
        <article className="prose-article">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeHighlight]}
                components={{
                    img: ({ src, alt, ...props }) => (
                        <img
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
