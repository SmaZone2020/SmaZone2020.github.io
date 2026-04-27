import { Link } from 'react-router-dom';
import DefaultLayout from '../../layout/DefaultLayout';
import { getSortedPostsData } from '../../lib/posts';
import { useI18n } from '../../i18n';
import { setTitle } from '../../App';
import { useEffect } from 'react';
import HeroSection from './HeroSection';
import PostCard from '../../components/PostCard';
import { siteConfig } from '../../config/site';
import { Calendar, Card, CardHeader, Checkbox, CheckboxGroup, Description, Label, Meter } from '@heroui/react';
import { Check, Code, LogoMermaid } from '@gravity-ui/icons';
import TechStack from '../../components/TechStack';
import GolaList from '../../components/GoalList';

function Home() {
    const posts = getSortedPostsData();
    const latestPosts = posts.slice(0, 4);
    const { t } = useI18n();

    useEffect(() => {
        setTitle('');
    }, []);

    return (
        <DefaultLayout>
            <HeroSection />
            <div className="flex justify-center">
                <div className="container px-4 py-6 max-w-4xl">
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
                <div className='hidden sm:block'>
                    <Card className='mb-4'>
                        <Calendar aria-label="Event date" isReadOnly>
                            <Calendar.Header>
                                <Calendar.Heading />
                                <Calendar.NavButton slot="previous" />
                                <Calendar.NavButton slot="next" />
                            </Calendar.Header>
                            <Calendar.Grid>
                                <Calendar.GridHeader>
                                {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
                                </Calendar.GridHeader>
                                <Calendar.GridBody>{(date) => <Calendar.Cell date={date} />}</Calendar.GridBody>
                            </Calendar.Grid>
                        </Calendar>
                    </Card>
                    <TechStack />
                    <GolaList />
                </div>
            </div>
        </DefaultLayout>
    );
}

export default Home;
