import { TagGroup, Tag } from '@heroui/react';
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
                    <TagGroup 
                        aria-label="Tags"
                        selectionMode="single"
                        selectedKeys={selectedTag ? new Set([selectedTag]) : new Set([])}
                        onSelectionChange={(keys) => {
                            const selected = Array.from(keys)[0] as string | undefined;
                            onSelectTag(selected || null);
                        }}
                    >
                        <TagGroup.List>
                            <Tag id="all-posts">
                                {t('blog.allPosts')}
                                <span className="ml-1 text-xs opacity-60">{totalCount}</span>
                            </Tag>
                            {allTags.map((tag) => (
                                <Tag key={tag} id={tag}>
                                    {tag}
                                    <span className="ml-1 text-xs opacity-60">{tagCounts[tag]}</span>
                                </Tag>
                            ))}
                        </TagGroup.List>
                    </TagGroup>
                </div>
            )}

            {selectedTag && (
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {t('blog.filteredBy')}
                    </span>
                    <span className="px-2 py-0.5 text-xs bg-default-100 text-default-700 rounded-md">
                        {selectedTag}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        · {filteredCount} {t('blog.postsCount')}
                    </span>
                </div>
            )}
        </>
    );
}

export default TagFilterBar;


