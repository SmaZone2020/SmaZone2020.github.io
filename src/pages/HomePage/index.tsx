import { Link } from 'react-router-dom';
import DefaultLayout from '../../layout/DefaultLayout';
import { posts } from '../../lib/data';
import { useI18n } from '../../i18n';
import { setTitle } from '../../App';
import { useEffect, useMemo } from 'react';
import HeroSection from './HeroSection';
import PostCard from '../../components/PostCard';
import TechStack from '../../components/TechStack';
import GolaList from '../../components/GoalList';
import GithubHeatmap from '../../components/GithubHeatmap';

function Home() {
    const { t } = useI18n();
    const latestPosts = useMemo(
        () => [...posts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4),
        []
    );

    useEffect(() => {
        setTitle('');
    }, []);

    return (
        <DefaultLayout>
            <HeroSection />
            <div className="flex justify-center gap-4">
                <div className="min-w-0 flex-1 px-4 py-6 max-w-4xl">
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
                <div className='hidden sm:block w-64 flex-shrink-0 mr-4'>
                    <div className="mb-4">
                        <GithubHeatmap />
                    </div>
                    <TechStack />
                    <GolaList />
                </div>
            </div>
        </DefaultLayout>
    );
}

export default Home;
