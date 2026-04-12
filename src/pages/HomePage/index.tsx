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
import { Code, LogoMermaid } from '@gravity-ui/icons';

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
            <div className="flex">
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
                        <CardHeader>
                            <div className='flex items-center gap-2'>
                                <Code className='w-5 h-5'/>
                                {t("common.tech")}
                            </div>
                        </CardHeader>
                        {siteConfig.tech.map((tech) => (
                            <Meter aria-label={tech.name} color={tech.color} className="w-64" value={tech.proficiency}>
                                <Label>{tech.name}</Label>
                                <Meter.Output />
                                <Meter.Track>
                                    <Meter.Fill />
                                </Meter.Track>
                            </Meter>
                        ))}
                    </Card>
                    <Card className='mb-4'>
                        <CardHeader>
                            <div className='flex items-center gap-2'>
                                <LogoMermaid className='w-5 h-5'/>
                                {t("common.goal")}
                            </div>
                        </CardHeader>
                        <CheckboxGroup name="interests">
                            {siteConfig.goals.map((goal) => (
                                <Checkbox key={goal.name} value={goal.name} isSelected isReadOnly>
                                    <Checkbox.Control>
                                        <Checkbox.Indicator>
                                            {() =>
                                            goal.isOk ? (
                                                null
                                            ) : <svg
                                                    aria-hidden="true"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeWidth={2}
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            }
                                        </Checkbox.Indicator>
                                    </Checkbox.Control>
                                    <Checkbox.Content>
                                        <div className="flex flex-col">
                                            <Label>{goal.name}</Label>
                                            <Description>{goal.description}</Description>
                                        </div>
                                    </Checkbox.Content>
                                </Checkbox>
                            ))}
                        </CheckboxGroup>
                    </Card>
                    <Card>
                        <Calendar aria-label="Event date">
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
                </div>
            </div>
        </DefaultLayout>
    );
}

export default Home;
