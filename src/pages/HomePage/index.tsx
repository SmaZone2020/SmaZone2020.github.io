import { Link } from 'react-router-dom';
import DefaultLayout from '../../layout/DefaultLayout';
import { getSortedPostsData } from '../../lib/posts';
import { useI18n } from '../../i18n';
import { setTitle } from '../../App';
import { useEffect } from 'react';
import HeroSection from './HeroSection';
import PostCard from '../../components/PostCard';

function Home() {
    const posts = getSortedPostsData();
    const latestPosts = posts.slice(0, 3);
    const { t } = useI18n();

    useEffect(() => {
        setTitle('');
    }, []);

    return (
        <DefaultLayout>
            <HeroSection />
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
                            <PostCard key={post.id} post={post} variant="compact" />
                        ))}
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
}

export default Home;
