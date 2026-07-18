import { useState, useMemo, useEffect } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import { projects } from '../../lib/data';
import type { ProjectConfig } from '../../config/site';
import { useI18n } from '../../i18n';
import { setTitle } from '../../App';
import ProjectCard from './ProjectCard';
import PaginationBar from '../../components/PaginationBar';
import DebugCardOverlay from '../../components/DebugCardOverlay';
import DebugAddButton from '../../components/DebugAddButton';
import DebugFormModal from '../../components/DebugFormModal';

const ITEMS_PER_PAGE = 30;

type FormMode = { mode: 'add' } | { mode: 'edit'; data: ProjectConfig } | null;

function Portfolio() {
    const IS_DEV = import.meta.env.DEV;
    const { t } = useI18n();
    const [currentPage, setCurrentPage] = useState(1);
    const [formMode, setFormMode] = useState<FormMode>(null);

    useEffect(() => {
        setTitle(t('nav.portfolio'));
    }, [t]);

    const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);
    const paginatedProjects = useMemo(
        () => projects.slice(
            (currentPage - 1) * ITEMS_PER_PAGE,
            currentPage * ITEMS_PER_PAGE
        ),
        [currentPage]
    );

    const handleSave = async (data: Record<string, any>) => {
        let updated: ProjectConfig[];
        if (formMode?.mode === 'edit' && formMode.data) {
            updated = projects.map(p => p.href === formMode.data.href ? { ...p, ...data } : p);
        } else {
            updated = [data as ProjectConfig, ...projects];
        }
        await fetch('/api/data/projects', { method: 'PUT', body: JSON.stringify(updated) });
        window.location.reload();
    };

    const handleDelete = async (href: string) => {
        if (!window.confirm(t('debug.confirmDelete'))) return;
        const updated = projects.filter(p => p.href !== href);
        await fetch('/api/data/projects', { method: 'PUT', body: JSON.stringify(updated) });
        window.location.reload();
    };

    return (
        <DefaultLayout>
            <div className="container mx-auto px-4 py-6 max-w-6xl">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold libre mb-2">{t('portfolio.title')}</h1>
                    <p className="text-gray-500 dark:text-gray-400 libre">
                        {t('portfolio.subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {paginatedProjects.map((project) => (
                        <div key={project.href} className="relative group">
                            <ProjectCard project={project} />
                            {IS_DEV && (
                                <DebugCardOverlay
                                    onEdit={() => setFormMode({ mode: 'edit', data: project })}
                                    onDelete={() => handleDelete(project.href)}
                                />
                            )}
                        </div>
                    ))}
                </div>

                <PaginationBar
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />

                {projects.length === 0 && (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        <p className="text-lg">{t('portfolio.empty')}</p>
                    </div>
                )}

                {IS_DEV && (
                    <>
                        <DebugAddButton label={t('debug.addProject')} onPress={() => setFormMode({ mode: 'add' })} />
                        <DebugFormModal
                            type="project"
                            initialData={formMode?.mode === 'edit' ? formMode.data : null}
                            isOpen={formMode !== null}
                            onOpenChange={(open) => { if (!open) setFormMode(null); }}
                            onSave={handleSave}
                        />
                    </>
                )}
            </div>
        </DefaultLayout>
    );
}

export default Portfolio;
