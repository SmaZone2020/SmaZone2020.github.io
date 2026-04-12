import { Card, Chip } from '@heroui/react';
import { Link } from 'react-router-dom';
import DefaultLayout from '../../layout/DefaultLayout';
import { getSortedPostsData } from '../../lib/posts';
import { siteConfig } from '../../config/site';
import { useI18n } from '../../i18n';
import { setTitle } from '../../App';
import { useEffect } from 'react';
import AdaptiveAvatar from '../../components/AdaptiveAvatar';

function Home() {
    const posts = getSortedPostsData();
    const latestPosts = posts.slice(0, 3);
    const { t } = useI18n();

    useEffect(() => {
        setTitle('');
    }, []);

    return (
        <DefaultLayout>
            <div className="relative mb-8 h-64 sm:h-80 w-full">
                <img
                    src={siteConfig.heroImage}
                    alt="Hero"
                    className="w-full h-full object-cover rounded-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-center gap-4 mb-3">
                        <AdaptiveAvatar
                            src={siteConfig.avatar}
                            alt={siteConfig.author}
                            size="xl"
                            className="shadow-xl rounded-[30px]"
                        />
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold libre">
                                {siteConfig.title}
                            </h1>
                            <p className="text-sm text-white/80">{siteConfig.handle}</p>
                        </div>
                    </div>
                    <p className="text-sm text-white/90 line-clamp-2">
                        {t('site.description')}
                    </p>
                </div>
            </div>
            <div className="container mx-auto px-4 py-6 max-w-4xl">

                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">{t('blog.latestPosts')}</h2>
                        <Link
                            to="/blog"
                            className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                        >
                            {t('blog.viewAll')} →
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {latestPosts.map((post) => (
                            <Link key={post.id} to={`/blog/${post.id}`} className="block">
                                <Card className="hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden rounded-2xl">
                                    <div className="flex flex-col sm:flex-row">
                                        {post.image && (
                                            <div className="sm:w-48 sm:min-w-48 h-40 sm:h-auto">
                                                <img
                                                    src={post.image}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover rounded-none"
                                                />
                                            </div>
                                        )}
                                        <div className="flex-1 p-4">
                                            <Card.Header className="p-0 mb-2">
                                                <Card.Title className="text-lg font-semibold line-clamp-1">
                                                    {post.title}
                                                </Card.Title>
                                                <Card.Description className="text-xs text-gray-500 dark:text-gray-400">
                                                    {post.date} · {siteConfig.author}
                                                </Card.Description>
                                            </Card.Header>
                                            <Card.Content className="p-0 mb-3">
                                                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                                                    {post.description}
                                                </p>
                                            </Card.Content>
                                            <Card.Footer className="p-0 gap-2 flex-wrap">
                                                {post.tags.map((tag) => (
                                                    <Chip key={tag} size="sm" variant="soft">
                                                        {tag}
                                                    </Chip>
                                                ))}
                                            </Card.Footer>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>

            </div>
        </DefaultLayout>
    );
}

export default Home;
