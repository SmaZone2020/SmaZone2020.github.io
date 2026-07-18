import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Separator } from '@heroui/react';
import { Pencil, TrashBin } from '@gravity-ui/icons';
import DefaultLayout from '../../layout/DefaultLayout';
import { posts, getPostById, siteData } from '../../lib/data';
import type { PostData } from '../../lib/posts';
import { useI18n } from '../../i18n';
import { setTitle } from '../../App';
import PostHeader from './PostHeader';
import MarkdownArticle from './MarkdownArticle';
import PostNavigation from './PostNavigation';
import DebugFormModal from '../../components/DebugFormModal';
import TableOfContents from './TableOfContents';

function BlogPost() {
    const IS_DEV = import.meta.env.DEV;
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t } = useI18n();
    const post = id ? getPostById(id) : undefined;
    const [viewCount, setViewCount] = useState<number | null>(null);
    const [formMode, setFormMode] = useState<{ mode: 'edit'; data: PostData } | null>(null);

    useEffect(() => {
        if (post) {
            setTitle(post.title);
        } else {
            setTitle('404');
        }
    }, [post]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    useEffect(() => {
        if (!post) return;
        setViewCount(null);
        fetch(`https://api.counterapi.dev/v1/${post.id}.${siteData.siteUrl}/visits/up`)
            .then(res => res.json())
            .then(data => setViewCount(data.count))
            .catch(() => {});
    }, [post?.id]);

    if (!post) {
        return (
            <DefaultLayout>
                <div className="container mx-auto px-4 py-12 text-center max-w-4xl">
                    <h1 className="text-4xl font-bold mb-4">404</h1>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">{t('blog.postNotFound')}</p>
                    <Button
                        onClick={() => navigate('/blog')}
                        className="bg-black text-white dark:bg-white dark:text-black text-sm"
                    >
                        {t('blog.backToBlog')}
                    </Button>
                </div>
            </DefaultLayout>
        );
    }

    const sortedPosts = [...posts].sort((a, b) => b.date.localeCompare(a.date));
    const currentIdx = sortedPosts.findIndex(p => p.id === post.id);
    const prevPost = currentIdx < sortedPosts.length - 1 ? sortedPosts[currentIdx + 1] : null;
    const nextPost = currentIdx > 0 ? sortedPosts[currentIdx - 1] : null;

    const handleSave = async (data: Record<string, any>) => {
        const postData = { ...post, ...data, tags: Array.isArray(data.tags) ? data.tags : post.tags };
        await fetch('/api/posts', { method: 'PUT', body: JSON.stringify(postData) });
        window.location.reload();
    };

    const handleDelete = async () => {
        if (!window.confirm(t('debug.confirmDelete'))) return;
        await fetch('/api/posts', { method: 'DELETE', body: JSON.stringify({ id: post.id }) });
        window.location.href = '/blog';
    };

    return (
        <DefaultLayout>
            <div className="container mx-auto px-4 py-6 max-w-6xl">
                {IS_DEV && post && (
                    <div className="flex gap-2 mb-4">
                        <Button
                            size="sm"
                            variant="secondary"
                            onPress={() => setFormMode({ mode: 'edit', data: post })}
                        >
                            <Pencil className="w-4 h-4" />
                            {t('debug.editPost')}
                        </Button>
                        <Button
                            size="sm"
                            variant="danger"
                            onPress={handleDelete}
                        >
                            <TrashBin className="w-4 h-4" />
                            {t('debug.delete')}
                        </Button>
                    </div>
                )}

                <PostHeader post={post} viewCount={viewCount} />

                <Separator className="mb-6" />

                <div className="flex gap-12 items-start">
                    <div className="min-w-0 flex-1">
                        <MarkdownArticle content={post.content} />

                        <Separator className="my-8" />

                        <PostNavigation prevPost={prevPost} nextPost={nextPost} />
                    </div>
                    <TableOfContents content={post.content} />
                </div>

                {IS_DEV && (
                    <DebugFormModal
                        type="post"
                        initialData={formMode?.data ?? null}
                        isOpen={formMode !== null}
                        onOpenChange={(open) => { if (!open) setFormMode(null); }}
                        onSave={handleSave}
                    />
                )}
            </div>
        </DefaultLayout>
    );
}

export default BlogPost;
