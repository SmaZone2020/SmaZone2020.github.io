import { Card } from '@heroui/react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n';
import type { PostData } from '../../lib/posts';

interface PostNavigationProps {
    prevPost: PostData | null;
    nextPost: PostData | null;
}

function PostNavigation({ prevPost, nextPost }: PostNavigationProps) {
    const { t } = useI18n();

    if (!prevPost && !nextPost) return null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {prevPost ? (
                <Link to={`/blog/${prevPost.id}`} className="block">
                    <Card className="hover:shadow-md transition-shadow duration-200 h-full rounded-2xl">
                        <Card.Content>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                ← {t('blog.prevPost')}
                            </p>
                            <p className="text-sm font-medium line-clamp-2">
                                {prevPost.title}
                            </p>
                        </Card.Content>
                    </Card>
                </Link>
            ) : <div />}
            {nextPost ? (
                <Link to={`/blog/${nextPost.id}`} className="block">
                    <Card className="hover:shadow-md transition-shadow duration-200 h-full rounded-2xl">
                        <Card.Content className="text-right">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                {t('blog.nextPost')} →
                            </p>
                            <p className="text-sm font-medium line-clamp-2">
                                {nextPost.title}
                            </p>
                        </Card.Content>
                    </Card>
                </Link>
            ) : <div />}
        </div>
    );
}

export default PostNavigation;
