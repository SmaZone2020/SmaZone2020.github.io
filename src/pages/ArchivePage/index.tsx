import { useEffect, useMemo } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import { posts } from '../../lib/data';
import { useI18n } from '../../i18n';
import { setTitle } from '../../App';
import ArchiveTimeline from './ArchiveTimeline';
import type { ArchiveGroup } from './ArchiveTimeline';

function Archive() {
    const { t } = useI18n();

    useEffect(() => {
        setTitle(t('nav.archive'));
    }, [t]);

    const grouped: ArchiveGroup[] = useMemo(() => {
        const map = new Map<string, ArchiveGroup['posts']>();
        const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));

        for (const post of sorted) {
            const [year, month] = post.date.split('-');
            const key = `${year}-${month}`;
            if (!map.has(key)) {
                map.set(key, []);
            }
            map.get(key)!.push({
                id: post.id,
                title: post.title,
                date: post.date,
                description: post.description,
            });
        }

        return Array.from(map.entries()).map(([key, posts]) => {
            const [year, month] = key.split('-');
            return {
                label: `${year} ${t('archive.year')} ${Number(month)} ${t('archive.month')}`,
                posts,
            };
        });
    }, [t]);

    return (
        <DefaultLayout>
            <div className="container mx-auto px-4 py-6 max-w-4xl">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold libre mb-2">{t('archive.title')}</h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        {t('archive.subtitle').replace('{count}', String(posts.length))}
                    </p>
                </div>

                <ArchiveTimeline groups={grouped} emptyMessage={t('blog.noPosts')} />
            </div>
        </DefaultLayout>
    );
}

export default Archive;
