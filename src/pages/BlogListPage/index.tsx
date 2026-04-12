import { useState, useEffect, useMemo } from 'react';
import { Card, Chip, Separator } from '@heroui/react';
import { Link } from 'react-router-dom';
import DefaultLayout from '../../layout/DefaultLayout';
import { getSortedPostsData, getAllTags } from '../../lib/posts';
import { siteConfig } from '../../config/site';
import { useI18n } from '../../i18n';
import { setTitle } from '../../App';

const POSTS_PER_PAGE = 6;

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

    const handleTagClick = (tag: string) => {
        setSelectedTag(prev => prev === tag ? null : tag);
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

                {allTags.length > 0 && (
                    <div className="mb-6">
                        <div className="flex flex-wrap gap-2">
                            <Chip
                                size="sm"
                                variant={selectedTag === null ? 'primary' : 'soft'}
                                className="cursor-pointer py-[3px] px-[6px]"
                                onClick={() => { setSelectedTag(null); setCurrentPage(1); }}
                            >
                                {t('blog.allPosts')}
                                <span className="ml-1 text-xs opacity-60">{allPosts.length}</span>
                            </Chip>
                            {allTags.map((tag) => (
                                <Chip
                                    key={tag}
                                    size="sm"
                                    variant={selectedTag === tag ? 'primary' : 'soft'}
                                    className="cursor-pointer"
                                    onClick={() => handleTagClick(tag)}
                                >
                                    {tag}
                                    <span className="ml-1 text-xs opacity-60">{tagCounts[tag]}</span>
                                </Chip>
                            ))}
                        </div>
                    </div>
                )}

                {selectedTag && (
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {t('blog.filteredBy')}
                        </span>
                        <Chip size="sm" variant="primary">{selectedTag}</Chip>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            · {filteredPosts.length} {t('blog.postsCount')}
                        </span>
                    </div>
                )}

                <Separator className="mb-6" />

                <div className="space-y-4">
                    {paginatedPosts.map((post) => (
                        <Link key={post.id} to={`/blog/${post.id}`} className="block">
                            <Card className="hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden rounded-2xl">
                                <div className="flex flex-col sm:flex-row">
                                    {post.image && (
                                        <div className="sm:w-52 sm:min-w-52 h-44 sm:h-auto">
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className="w-full h-full object-cover rounded-none"
                                            />
                                        </div>
                                    )}
                                    <div className="flex-1 p-5">
                                        <Card.Header className="p-0 mb-2">
                                            <Card.Title className="text-lg font-semibold line-clamp-1">
                                                {post.title}
                                            </Card.Title>
                                            <Card.Description className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                {post.date} · {siteConfig.author}
                                            </Card.Description>
                                        </Card.Header>
                                        <Card.Content className="p-0 mb-3">
                                            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                                                {post.description}
                                            </p>
                                        </Card.Content>
                                        <Card.Footer className="p-0 gap-2 flex-wrap">
                                            {post.tags.map((tag) => (
                                                <Chip key={tag} size="sm" variant="soft">
                                                    {tag}
                                                </Chip>
                                            ))}
                                        </Card.Footer>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))}

                    {paginatedPosts.length === 0 && (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                            <p className="text-lg">{t('blog.noPosts')}</p>
                        </div>
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-8 mb-4">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => p - 1)}
                            className="px-3 py-1.5 rounded-lg text-sm bg-gray-100 dark:bg-gray-800 disabled:opacity-40 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            ← {t('blog.prev')}
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-8 h-8 rounded-lg text-sm transition-colors ${
                                    page === currentPage
                                        ? 'bg-black text-white dark:bg-white dark:text-black'
                                        : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(p => p + 1)}
                            className="px-3 py-1.5 rounded-lg text-sm bg-gray-100 dark:bg-gray-800 disabled:opacity-40 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            {t('blog.next')} →
                        </button>
                    </div>
                )}
            </div>
        </DefaultLayout>
    );
}

export default BlogList;
