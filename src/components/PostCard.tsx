import { Card, Chip } from '@heroui/react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../config/site';
import type { PostData } from '../lib/posts';

interface PostCardProps {
    post: PostData;
    variant?: 'default' | 'compact';
}

function PostCard({ post, variant = 'default' }: PostCardProps) {
    const isCompact = variant === 'compact';
    const imageSize = isCompact ? 'sm:w-48 sm:min-w-48 h-40' : 'sm:w-52 sm:min-w-52 h-44';
    const padding = isCompact ? 'p-4' : 'p-5';

    return (
        <Link to={`/blog/${post.id}`} className="block">
            <Card className="hover:shadow-md hover:-translate-y-1 transition-all duration-200 overflow-hidden rounded-2xl">
                <div className="flex flex-col sm:flex-row">
                    {post.image && (
                        <div className={`${imageSize} sm:h-auto`}>
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-full object-cover rounded-none"
                            />
                        </div>
                    )}
                    <div className={`flex-1 ${padding}`}>
                        <Card.Header className="p-0 mb-2">
                            <Card.Title className="text-lg font-semibold line-clamp-1">
                                {post.title}
                            </Card.Title>
                            <Card.Description className={`text-xs text-gray-500 dark:text-gray-400${isCompact ? '' : ' mt-1'}`}>
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
    );
}

export default PostCard;
