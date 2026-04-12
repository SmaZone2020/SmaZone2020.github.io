import { Card } from '@heroui/react';
import { Link } from 'react-router-dom';

interface ArchivePost {
    id: string;
    title: string;
    date: string;
    description: string;
}

export interface ArchiveGroup {
    label: string;
    posts: ArchivePost[];
}

interface ArchiveTimelineProps {
    groups: ArchiveGroup[];
    emptyMessage: string;
}

function ArchiveTimeline({ groups, emptyMessage }: ArchiveTimelineProps) {
    return (
        <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block" />

            {groups.map((group, groupIdx) => (
                <div key={groupIdx} className="mb-8">
                    <div className="flex items-center gap-3 mb-4 sm:pl-10 relative">
                        <div className="absolute left-2.5 w-3 h-3 rounded-full bg-black dark:bg-white hidden sm:block" />
                        <h2 className="text-lg font-bold">{group.label}</h2>
                        <span className="text-sm text-gray-400 dark:text-gray-500">
                            ({group.posts.length})
                        </span>
                    </div>

                    <div className="space-y-3 sm:pl-10">
                        {group.posts.map((post) => (
                            <Link key={post.id} to={`/blog/${post.id}`} className="block">
                                <Card className="hover:shadow-md transition-shadow duration-200 rounded-2xl">
                                    <Card.Content className="p-4">
                                        <div className="flex items-start gap-4">
                                            <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap mt-0.5 font-mono">
                                                {post.date.slice(5)}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium line-clamp-1">{post.title}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 mt-1">
                                                    {post.description}
                                                </p>
                                            </div>
                                        </div>
                                    </Card.Content>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            ))}

            {groups.length === 0 && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <p className="text-lg">{emptyMessage}</p>
                </div>
            )}
        </div>
    );
}

export default ArchiveTimeline;
