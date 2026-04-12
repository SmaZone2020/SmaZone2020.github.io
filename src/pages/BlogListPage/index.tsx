import { useState, useEffect, useMemo } from 'react';
import { Separator } from '@heroui/react';
import DefaultLayout from '../../layout/DefaultLayout';
import { getSortedPostsData, getAllTags } from '../../lib/posts';
import { useI18n } from '../../i18n';
import { setTitle } from '../../App';
import TagFilterBar from './TagFilterBar';
import PostCardList from './PostCardList';
import PaginationBar from '../../components/PaginationBar';

const POSTS_PER_PAGE = 15;

function BlogList() {
    const { t } = useI18n();
    const allPosts = getSortedPostsData();
    const allTags = getAllTags();
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

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

    return (
        <DefaultLayout>
            <div className="container mx-auto px-4 py-6 max-w-4xl">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold libre mb-2">{t('blog.title')}</h1>
                    <p className="text-gray-500 dark:text-gray-400">
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

                <PostCardList posts={paginatedPosts} emptyMessage={t('blog.noPosts')} />

                <PaginationBar
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>
        </DefaultLayout>
    );
}

export default BlogList;
