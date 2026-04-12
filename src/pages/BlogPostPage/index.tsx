import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import { Card, Chip, Separator, Breadcrumbs } from '@heroui/react';
import DefaultLayout from '../../layout/DefaultLayout';
import { getPostById, getSortedPostsData } from '../../lib/posts';
import { siteConfig } from '../../config/site';
import { useI18n } from '../../i18n';
import { setTitle } from '../../App';
import AdaptiveAvatar from '../../components/AdaptiveAvatar';

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

                <Separator className="mb-6" />

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
                        {post.content}
                    </ReactMarkdown>
                </article>

                <Separator className="my-8" />

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
            </div>
        </DefaultLayout>
    );
}

export default BlogPost;
