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
        <div className="y2k-card mb-4" style={{
            background: 'rgba(26, 26, 26, 0.8)',
            borderColor: '#1a4d2e',
        }}>
            {/* Header: Avatar + User Info */}
            <div className="flex items-start gap-3 mb-3 pb-3 border-b border-green-900">
                {/* Avatar */}
                <div className="flex-shrink-0">
                    {post.avatarUrl ? (
                        <Image
                            src={post.avatarUrl}
                            alt={post.displayName}
                            width={48}
                            height={48}
                            className="rounded-full border-2"
                            style={{ borderColor: '#39ff14' }}
                        />
                    ) : (
                        <UserCircleIcon
                            className="w-12 h-12"
                            style={{ color: '#39ff14' }}
                            data-testid="default-avatar"
                        />
                    )}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold" style={{ color: '#39ff14', textShadow: '0 0 5px rgba(57, 255, 20, 0.6)' }}>
                            {post.displayName}
                        </h3>
                        <button
                            onClick={handleUsernameClick}
                            className="text-sm hover:brightness-150 transition-all"
                            style={{
                                color: '#00ffff',
                                textShadow: '0 0 5px rgba(0, 255, 255, 0.6)',
                                cursor: 'pointer',
                            }}
                        >
                            @{post.username}
                        </button>
                        {post.isFollowing && (
                            <span className="text-xs font-bold px-2 py-1 border border-green-600"
                                  style={{
                                      color: '#39ff14',
                                      textShadow: '0 0 5px rgba(57, 255, 20, 0.6)',
                                  }}>
                                FOLLOWING
                            </span>
                        )}
                        <span className="text-xs" style={{ color: '#888888' }}>
                            · {formatTimestamp(post.createdAt)}
                        </span>
                    </div>
                </div>

                {/* Delete Button (for own posts) */}
                {isOwnPost && (
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="text-sm font-bold uppercase px-2 py-1 border transition-all"
                        style={{
                            color: isDeleting ? '#888888' : '#ff00ff',
                            borderColor: isDeleting ? '#888888' : '#ff00ff',
                            textShadow: isDeleting ? 'none' : '0 0 5px rgba(255, 0, 255, 0.6)',
                            opacity: isDeleting ? 0.5 : 1,
                        }}
                        aria-label="Delete post"
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="mb-3">
                <p className="whitespace-pre-wrap" style={{ color: '#cccccc' }}>
                    {post.content}
                </p>
            </div>

            {/* Media (if present) */}
            {post.mediaUrl && (
                <div className="mb-3 p-2 border border-dashed" style={{
                    borderColor: '#39ff14',
                    background: 'rgba(57, 255, 20, 0.05)',
                }} data-testid="post-media">
                    <a
                        href={post.mediaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-bold hover:brightness-150 transition-all"
                        style={{
                            color: '#00ffff',
                            textShadow: '0 0 5px rgba(0, 255, 255, 0.6)',
                        }}
                    >
                        ▶ VIEW MEDIA →
                    </a>
                </div>
            )}

            {/* Footer: Likes */}
            <div className="flex items-center gap-4 pt-3 mt-3 border-t" style={{
                borderColor: '#1a4d2e',
            }}>
                <div className="flex items-center gap-2 font-bold" style={{
                    color: '#ff00ff',
                    textShadow: '0 0 5px rgba(255, 0, 255, 0.6)',
                }}>
                    <span>❤</span>
                    <span>{post.likesCount}</span>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mt-2 p-2 text-sm font-bold border border-red-500"
                     style={{
                         color: '#ff0000',
                         background: 'rgba(255, 0, 0, 0.1)',
                         textShadow: '0 0 5px rgba(255, 0, 0, 0.6)',
                     }}>
                    {error}
                </div>
            )}
        </div>
    );
}
