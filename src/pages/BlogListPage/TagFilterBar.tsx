import { Chip } from '@heroui/react';
import { useI18n } from '../../i18n';

interface TagFilterBarProps {
    allTags: string[];
    tagCounts: Record<string, number>;
    selectedTag: string | null;
    totalCount: number;
    filteredCount: number;
    onSelectTag: (tag: string | null) => void;
}

function TagFilterBar({ allTags, tagCounts, selectedTag, totalCount, filteredCount, onSelectTag }: TagFilterBarProps) {
    const { t } = useI18n();

    return (
        <>
            {allTags.length > 0 && (
                <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                        <Chip
                            size="lg"
                            variant={selectedTag === null ? 'primary' : 'soft'}
                            className="cursor-pointer py-[3px] px-[6px]"
                            onClick={() => onSelectTag(null)}
                        >
                            {t('blog.allPosts')}
                            <span className="ml-1 text-xs opacity-60">{totalCount}</span>
                        </Chip>
                        {allTags.map((tag) => (
                            <Chip
                                key={tag}
                                size="lg"
                                variant={selectedTag === tag ? 'primary' : 'soft'}
                                className="cursor-pointer py-[3px] px-[6px]"
                                onClick={() => onSelectTag(selectedTag === tag ? null : tag)}
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
                        · {filteredCount} {t('blog.postsCount')}
                    </span>
                </div>
            )}
        </>
    );
}

export default TagFilterBar;
