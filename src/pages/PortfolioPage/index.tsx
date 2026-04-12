import { useEffect } from 'react';
import { Card } from '@heroui/react';
import DefaultLayout from '../../layout/DefaultLayout';
import { siteConfig } from '../../config/site';
import { useI18n } from '../../i18n';
import { setTitle } from '../../App';
import { LogoGithub, Globe, ArrowUpRightFromSquare, CirclePlay, TvRetro } from '@gravity-ui/icons';

const platformIcon: Record<string, React.ReactNode> = {
    github: <LogoGithub className="w-4 h-4" />,
    web: <Globe className="w-4 h-4" />,
    douyin: <CirclePlay className="w-4 h-4" />,
    bilibili: <TvRetro className="w-4 h-4" />,
};

const platformLabel: Record<string, string> = {
    github: 'GitHub',
    web: 'Web',
    douyin: '抖音',
    bilibili: 'Bilibili',
};

function Portfolio() {
    const { t } = useI18n();

    useEffect(() => {
        setTitle(t('nav.portfolio'));
    }, [t]);

    return (
        <DefaultLayout>
            <div className="container mx-auto px-4 py-6 max-w-4xl">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold libre mb-2">{t('portfolio.title')}</h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        {t('portfolio.subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {siteConfig.projects.map((project) => (
                        <a
                            key={project.href}
                            href={project.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block group"
                        >
                            <Card className="h-full overflow-hidden rounded-2xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                                <div className="h-40 overflow-hidden">
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className="w-full h-full object-cover rounded-none group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>

                                <Card.Content className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-semibold text-base line-clamp-1">
                                            {project.title}
                                        </h3>
                                        <ArrowUpRightFromSquare className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>

                                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                                        {project.description}
                                    </p>

                                    <span className="flex items-center gap-1.5">
                                        {platformIcon[project.platform] || <Globe className="w-4 h-4" />}
                                        {platformLabel[project.platform] || project.platform}
                                    </span>
                                </Card.Content>
                            </Card>
                        </a>
                    ))}
                </div>

                {siteConfig.projects.length === 0 && (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        <p className="text-lg">{t('portfolio.empty')}</p>
                    </div>
                )}
            </div>
        </DefaultLayout>
    );
}

export default Portfolio;
