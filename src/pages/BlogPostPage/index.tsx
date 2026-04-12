import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Separator } from '@heroui/react';
import DefaultLayout from '../../layout/DefaultLayout';
import { getPostById, getSortedPostsData } from '../../lib/posts';
import { useI18n } from '../../i18n';
import { setTitle } from '../../App';
import PostHeader from './PostHeader';
import MarkdownArticle from './MarkdownArticle';
import PostNavigation from './PostNavigation';

function BlogPost() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t } = useI18n();
    const post = id ? getPostById(id) : undefined;

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

    if (!post) {
        return (
            <DefaultLayout>
                <div className="container mx-auto px-4 py-12 text-center max-w-4xl">
                    <h1 className="text-4xl font-bold mb-4">404</h1>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">{t('blog.postNotFound')}</p>
                    <button
                        onClick={() => navigate('/blog')}
                        className="px-4 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black text-sm"
                    >
                        {t('blog.backToBlog')}
                    </button>
                </div>
            </DefaultLayout>
        );
    }

    const allPosts = getSortedPostsData();
    const currentIdx = allPosts.findIndex(p => p.id === post.id);
    const prevPost = currentIdx < allPosts.length - 1 ? allPosts[currentIdx + 1] : null;
    const nextPost = currentIdx > 0 ? allPosts[currentIdx - 1] : null;

    return (
        <DefaultLayout>
            <div className="container mx-auto px-4 py-6 max-w-6xl">
                <PostHeader post={post} />

                <Separator className="mb-6" />

                <MarkdownArticle content={post.content} />

                <Separator className="my-8" />

                <PostNavigation prevPost={prevPost} nextPost={nextPost} />
            </div>
        </DefaultLayout>
    );
}

export default BlogPost;
