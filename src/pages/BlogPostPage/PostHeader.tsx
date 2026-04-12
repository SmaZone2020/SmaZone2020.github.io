import { Chip, Breadcrumbs } from '@heroui/react';
import { useI18n } from '../../i18n';
import type { PostData } from '../../lib/posts';

interface PostHeaderProps {
    post: PostData;
}

function PostHeader({ post }: PostHeaderProps) {
    const { t } = useI18n();

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

                <div className="flex items-center gap-3 mb-4">

                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t('blog.publishedOn')} {post.date}
                    </p>
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
