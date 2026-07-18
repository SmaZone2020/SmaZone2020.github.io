import { useState, useEffect, useMemo } from 'react';
import { Separator } from '@heroui/react';
import DefaultLayout from '../../layout/DefaultLayout';
import { posts, getAllTags } from '../../lib/data';
import type { PostData } from '../../lib/posts';
import { useI18n } from '../../i18n';
import { setTitle } from '../../App';
import TagFilterBar from './TagFilterBar';
import PostCard from '../../components/PostCard';
import PaginationBar from '../../components/PaginationBar';
import DebugCardOverlay from '../../components/DebugCardOverlay';
import DebugAddButton from '../../components/DebugAddButton';
import DebugFormModal from '../../components/DebugFormModal';

const POSTS_PER_PAGE = 15;

type FormMode = { mode: 'add' } | { mode: 'edit'; data: PostData } | null;

function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        || String(Date.now());
}

function BlogList() {
    const IS_DEV = import.meta.env.DEV;
    const { t } = useI18n();
    const allPosts = useMemo(() => [...posts].sort((a, b) => b.date.localeCompare(a.date)), []);
    const allTags = useMemo(() => getAllTags(), []);
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [formMode, setFormMode] = useState<FormMode>(null);

    useEffect(() => {
        setTitle(t('nav.blog'));
    }, [t]);

    const tagCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        for (const post of allPosts) {
            for (const tag of post.tags) {
                counts[tag] = (counts[tag] || 0) + 1;
            }
        }
        return counts;
    }, [allPosts]);

    const filteredPosts = useMemo(() => {
        if (!selectedTag) return allPosts;
        return allPosts.filter(p => p.tags.includes(selectedTag));
    }, [allPosts, selectedTag]);

    const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
    const paginatedPosts = filteredPosts.slice(
        (currentPage - 1) * POSTS_PER_PAGE,
        currentPage * POSTS_PER_PAGE
    );

    const handleSelectTag = (tag: string | null) => {
        setSelectedTag(tag);
        setCurrentPage(1);
    };

    const handleSave = async (data: Record<string, any>) => {
        let postData: Record<string, any>;
        if (formMode?.mode === 'edit' && formMode.data) {
            postData = { ...formMode.data, ...data, tags: Array.isArray(data.tags) ? data.tags : formMode.data.tags };
        } else {
            postData = {
                id: slugify(data.title || ''),
                ...data,
                tags: Array.isArray(data.tags) ? data.tags : [],
            };
        }
        await fetch('/api/posts', { method: 'PUT', body: JSON.stringify(postData) });
        window.location.reload();
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm(t('debug.confirmDelete'))) return;
        await fetch('/api/posts', { method: 'DELETE', body: JSON.stringify({ id }) });
        window.location.reload();
    };

    return (
        <DefaultLayout>
            <div className="container mx-auto px-4 py-6 max-w-4xl">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold libre mb-2">{t('blog.title')}</h1>
                    <p className="text-gray-500 dark:text-gray-400 libre">
                        {t('blog.totalPosts').replace('{count}', String(allPosts.length))}
                    </p>
                </div>

                <TagFilterBar
                    allTags={allTags}
                    tagCounts={tagCounts}
                    selectedTag={selectedTag}
                    totalCount={allPosts.length}
                    filteredCount={filteredPosts.length}
                    onSelectTag={handleSelectTag}
                />

                <Separator className="mb-6" />

                <div className="space-y-4">
                    {paginatedPosts.map((post) => (
                        <div key={post.id} className="relative group">
                            <PostCard post={post} />
                            {IS_DEV && (
                                <DebugCardOverlay
                                    onEdit={() => setFormMode({ mode: 'edit', data: post })}
                                    onDelete={() => handleDelete(post.id)}
                                />
                            )}
                        </div>
                    ))}
                    {paginatedPosts.length === 0 && (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                            <p className="text-lg">{t('blog.noPosts')}</p>
                        </div>
                    )}
                </div>

                <PaginationBar
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />

                {IS_DEV && (
                    <>
                        <DebugAddButton label={t('debug.addPost')} onPress={() => setFormMode({ mode: 'add' })} />
                        <DebugFormModal
                            type="post"
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

export default BlogList;
