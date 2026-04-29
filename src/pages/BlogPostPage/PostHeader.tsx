import { Chip, Breadcrumbs } from '@heroui/react';
import { useI18n } from '../../i18n';
import type { PostData } from '../../lib/posts';
import { Clock, Eye, File } from '@gravity-ui/icons';

interface PostHeaderProps {
    post: PostData;
    viewCount: number | null;
}

function countWords(content: string): number {
    // Strip markdown syntax (front matter already removed by posts.ts)
    const plain = content
        .replace(/```[\s\S]*?```/g, '')   // fenced code blocks
        .replace(/`[^`]*`/g, '')           // inline code
        .replace(/!\[.*?\]\(.*?\)/g, '')   // images
        .replace(/\[.*?\]\(.*?\)/g, '')    // links
        .replace(/#{1,6}\s/g, '')          // headings
        .replace(/[*_~>|]/g, '')           // emphasis, blockquote, table chars
        .replace(/\s+/g, ' ')
        .trim();

    // CJK characters each count as one word
    const cjk = (plain.match(/[\u4e00-\u9fa5\u3040-\u30ff\uac00-\ud7af]/g) || []).length;
    // Non-CJK words
    const latin = (plain.replace(/[\u4e00-\u9fa5\u3040-\u30ff\uac00-\ud7af]/g, ' ').match(/\b\w+\b/g) || []).length;
    return cjk + latin;
}

function PostHeader({ post, viewCount }: PostHeaderProps) {
    const { t } = useI18n();

    const words = countWords(post.content);
    const readingMin = Math.max(1, Math.round(words / 300));

    return (
        <>
            <Breadcrumbs className="mb-4">
                <Breadcrumbs.Item href="/">{t('nav.home')}</Breadcrumbs.Item>
                <Breadcrumbs.Item href="/blog">{t('nav.blog')}</Breadcrumbs.Item>
                <Breadcrumbs.Item>{post.title}</Breadcrumbs.Item>
            </Breadcrumbs>

            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
                    {post.title}
                </h1>

                <div className="text-sm flex flex-wrap items-center gap-3 mb-4">
                    <p className="text-gray-500 dark:text-gray-400">
                        {t('blog.publishedOn')} {post.date}
                    </p>
                    <span className="text-gray-400 dark:text-gray-500 flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {viewCount === null ? '...' : viewCount}
                    </span>
                    <span className="text-gray-400 dark:text-gray-500 flex items-center gap-1">
                        <File className="w-4 h-4" />
                        {t('blog.wordCount').replace('{count}', words.toLocaleString())}
                    </span>
                    <span className="text-gray-400 dark:text-gray-500 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {t('blog.readingTime').replace('{min}', String(readingMin))}
                    </span>
                </div>

                <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                        <Chip key={tag} size="sm" variant="soft">
                            {tag}
                        </Chip>
                    ))}
                </div>
            </div>
        </>
    );
}

export default PostHeader;
