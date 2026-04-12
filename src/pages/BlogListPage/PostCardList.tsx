import PostCard from '../../components/PostCard';
import type { PostData } from '../../lib/posts';

interface PostCardListProps {
    posts: PostData[];
    emptyMessage: string;
}

function PostCardList({ posts, emptyMessage }: PostCardListProps) {
    return (
        <div className="space-y-4">
            {posts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}

            {posts.length === 0 && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <p className="text-lg">{emptyMessage}</p>
                </div>
            )}
        </div>
    );
}

export default PostCardList;
