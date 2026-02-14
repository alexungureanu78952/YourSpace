'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FeedPost } from '@/types/post';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import API_BASE_URL from '@/config/api';
import Image from 'next/image';

interface PostCardProps {
    post: FeedPost;
    currentUserId?: number;
    onDelete?: (postId: number) => void;
}

/**
 * PostCard - Displays a single post in the feed
 */
export default function PostCard({ post, currentUserId, onDelete }: PostCardProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isOwnPost = currentUserId === post.userId;

    const handleUsernameClick = () => {
        router.push(`/profile/${post.userId}`);
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this post?')) {
            return;
        }

        setIsDeleting(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/posts/${post.id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete post');
            }

            if (onDelete) {
                onDelete(post.id);
            }
        } catch (err) {
            setError('Error deleting post. Please try again.');
            console.error('Delete post error:', err);
        } finally {
            setIsDeleting(false);
        }
    };

    const formatTimestamp = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInMinutes = Math.floor(diffInMs / 60000);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
        if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
        if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;

        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
            {/* Header: Avatar + User Info */}
            <div className="flex items-start gap-3 mb-3">
                {/* Avatar */}
                <div className="flex-shrink-0">
                    {post.avatarUrl ? (
                        <Image
                            src={post.avatarUrl}
                            alt={post.displayName}
                            width={48}
                            height={48}
                            className="rounded-full"
                        />
                    ) : (
                        <UserCircleIcon
                            className="w-12 h-12 text-gray-400"
                            data-testid="default-avatar"
                        />
                    )}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                            {post.displayName}
                        </h3>
                        <button
                            onClick={handleUsernameClick}
                            className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                        >
                            @{post.username}
                        </button>
                        {post.isFollowing && (
                            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                                (Following)
                            </span>
                        )}
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            · {formatTimestamp(post.createdAt)}
                        </span>
                    </div>
                </div>

                {/* Delete Button (for own posts) */}
                {isOwnPost && (
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="text-red-600 hover:text-red-700 text-sm disabled:opacity-50"
                        aria-label="Delete post"
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="mb-3">
                <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                    {post.content}
                </p>
            </div>

            {/* Media (if present) */}
            {post.mediaUrl && (
                <div className="mb-3" data-testid="post-media">
                    <a
                        href={post.mediaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                    >
                        View Media →
                    </a>
                </div>
            )}

            {/* Footer: Likes */}
            <div className="flex items-center gap-4 pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                    </svg>
                    <span className="text-sm">{post.likesCount}</span>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {error}
                </div>
            )}
        </div>
    );
}
