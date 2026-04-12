import { useEffect } from 'react';
import { Card, Chip } from '@heroui/react';
import DefaultLayout from '../../layout/DefaultLayout';
import { siteConfig } from '../../config/site';
import { useI18n } from '../../i18n';
import { setTitle } from '../../App';
import { Comments, Envelope, Hand, LogoGithub, TvRetro } from '@gravity-ui/icons';
import AdaptiveAvatar from '../../components/AdaptiveAvatar';
import { Link } from 'react-router-dom';

function About() {
    const { t } = useI18n();

    useEffect(() => {
        setTitle(t('nav.about'));
    }, [t]);

    return (
        <DefaultLayout>
            <div className="container mx-auto px-4 py-6 max-w-3xl">
                <Card className="mb-6 rounded-2xl">
                    <Card.Content className="p-6">
                        <div className="flex flex-col items-center text-center">
                            <AdaptiveAvatar
                                src={siteConfig.avatar}
                                alt={siteConfig.author}
                                size="xl"
                                className="mb-4 shadow-lg"
                            />
                            <h1 className="text-2xl font-bold libre mb-1">{siteConfig.author}</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                                {siteConfig.handle}
                            </p>
                            <p className="text-gray-600 dark:text-gray-300 max-w-md leading-relaxed">
                                {t('site.description')}
                            </p>
                        </div>
                    </Card.Content>
                </Card>

                <Card className="mb-6 rounded-2xl w-full">
                    <Card.Header>
                        <Card.Title>{t('about.interests')}</Card.Title>
                    </Card.Header>
                    <Card.Content>
                        <div className="flex flex-wrap gap-2">
                            {siteConfig.tags.map((tag) => (
                                <Chip key={tag} size="lg" variant="soft">
                                    {tag}
                                </Chip>
                            ))}
                        </div>
                    </Card.Content>
                </Card>

                <Card className="mb-6 rounded-2xl w-full">
                    <Card.Header>
                        <Card.Title>{t('about.socialLinks')}</Card.Title>
                    </Card.Header>
                    <Card.Content>
                        <div className="flex items-center gap-4">
                            {siteConfig.social.github && (
                                <Link
                                    to={siteConfig.social.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <LogoGithub className="w-5 h-5" />
                                </Link>
                            )}
                            {siteConfig.social.bili && (
                                <Link
                                    to={siteConfig.social.bili}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <TvRetro className="w-5 h-5" />
                                </Link>
                            )}
                            {siteConfig.social.email && (
                                <Link
                                    to={siteConfig.social.email}
                                    className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <Envelope className="w-5 h-5" />
                                </Link>
                            )}
                            {siteConfig.social.bonjour && (
                                <Link
                                    to={siteConfig.social.bonjour}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <Hand className="w-5 h-5 transform rotate-330" />
                                </Link>
                            )}
                            {siteConfig.social.wecom && (
                                <Link
                                    to={siteConfig.social.wecom}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <Comments className="w-5 h-5" />
                                </Link>
                            )}
                        </div>
                    </Card.Content>
                </Card>

            </div>
        </DefaultLayout>
    );
}

export default About;
