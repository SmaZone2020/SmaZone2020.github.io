import { useState, useMemo, useEffect } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import { siteConfig } from '../../config/site';
import { useI18n } from '../../i18n';
import { setTitle } from '../../App';
import ProjectCard from './ProjectCard';
import PaginationBar from '../../components/PaginationBar';

const ITEMS_PER_PAGE = 30;

function Portfolio() {
    const { t } = useI18n();
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setTitle(t('nav.portfolio'));
    }, [t]);

    const totalPages = Math.ceil(siteConfig.projects.length / ITEMS_PER_PAGE);
    const paginatedProjects = useMemo(
        () => siteConfig.projects.slice(
            (currentPage - 1) * ITEMS_PER_PAGE,
            currentPage * ITEMS_PER_PAGE
        ),
        [currentPage]
    );

    return (
        <DefaultLayout>
            <div className="container mx-auto px-4 py-6 max-w-6xl">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold libre mb-2">{t('portfolio.title')}</h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        {t('portfolio.subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {paginatedProjects.map((project) => (
                        <ProjectCard key={project.href} project={project} />
                    ))}
                </div>

                <PaginationBar
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />

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

