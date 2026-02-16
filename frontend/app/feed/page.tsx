'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { FeedPost } from '@/types/post';
import { API_ENDPOINTS } from '@/config/api';
import CreatePost from '@/components/CreatePost';
import PostCard from '@/components/PostCard';

export default function FeedPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [posts, setPosts] = useState<FeedPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);

    const POSTS_PER_PAGE = 20;

    useEffect(() => {
        if (!user) {
            router.push('/auth/login');
            return;
        }

        if (!isInitialized) {
            fetchFeed(true);
            setIsInitialized(true);
        }
    }, [user, router, isInitialized]);

    const fetchFeed = async (reset = false, pageNum = page) => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('token');
            const currentPage = reset ? 0 : pageNum;

            const response = await fetch(
                API_ENDPOINTS.posts.feed(currentPage * POSTS_PER_PAGE, POSTS_PER_PAGE),
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 401) {
                router.push('/auth/login');
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to fetch feed');
            }

            const data: FeedPost[] = await response.json();

            if (reset) {
                setPosts(data);
                setPage(0);
            } else {
                setPosts((prev) => [...prev, ...data]);
            }

            setHasMore(data.length === POSTS_PER_PAGE);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error loading feed');
            console.error('Fetch feed error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePostCreated = () => {
        // Refresh the feed to get the new post with correct structure
        fetchFeed(true);
    };

    const handlePostDeleted = (postId: number) => {
        // Remove the deleted post from the feed
        setPosts((prev) => prev.filter((post) => post.id !== postId));
    };

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchFeed(false, nextPage);
    };

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-black py-8 px-4" style={{
            backgroundImage: `
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(57, 255, 20, 0.03) 2px,
                rgba(57, 255, 20, 0.03) 4px
              )
            `,
        }}>
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8 pb-6 border-b-2" style={{ borderColor: '#39ff14' }}>
                    <h1 className="y2k-heading y2k-heading-lg mb-2">FEED</h1>
                    <p className="text-sm" style={{
                        color: '#00ffff',
                        textShadow: '0 0 5px rgba(0, 255, 255, 0.6)',
                        letterSpacing: '1px',
                    }}>
                        Posts from people you follow and others
                    </p>
                </div>

                {/* Create Post */}
                <CreatePost onPostCreated={handlePostCreated} />

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-4 border-2 border-red-500 font-bold"
                         style={{
                             background: 'rgba(255, 0, 0, 0.1)',
                             color: '#ff0000',
                             textShadow: '0 0 5px rgba(255, 0, 0, 0.6)',
                         }}>
                        {error}
                    </div>
                )}

                {/* Loading State (Initial) */}
                {loading && posts.length === 0 && (
                    <div className="text-center py-12">
                        <div className="inline-block animate-pulse rounded-full h-12 w-12 border-4" style={{
                            borderColor: '#39ff14',
                            boxShadow: '0 0 15px rgba(57, 255, 20, 0.6)',
                        }}></div>
                        <p className="mt-4 text-sm font-bold" style={{
                            color: '#39ff14',
                            textShadow: '0 0 5px rgba(57, 255, 20, 0.6)',
                            letterSpacing: '1px',
                        }}>
                            LOADING FEED...
                        </p>
                    </div>
                )}

                {/* Posts */}
                {posts.length > 0 && (
                    <div>
                        {posts.map((post) => (
                            <PostCard
                                key={post.id}
                                post={post}
                                currentUserId={user.id}
                                onDelete={handlePostDeleted}
                            />
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && posts.length === 0 && (
                    <div className="y2k-card text-center py-12" style={{
                        background: 'rgba(26, 26, 26, 0.8)',
                        borderColor: '#1a4d2e',
                    }}>
                        <div style={{
                            fontSize: '3rem',
                            marginBottom: '10px',
                        }}>
                            📭
                        </div>
                        <h3 className="y2k-heading y2k-heading-md mb-2">NO POSTS YET</h3>
                        <p style={{
                            color: '#888888',
                            fontSize: '0.95rem',
                        }}>
                            Start following people to see their posts here!
                        </p>
                    </div>
                )}

                {/* Load More Button */}
                {hasMore && posts.length > 0 && (
                    <div className="mt-8 text-center">
                        <button
                            onClick={handleLoadMore}
                            disabled={loading}
                            className="y2k-button py-3"
                            style={{
                                opacity: loading ? 0.5 : 1,
                                cursor: loading ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {loading ? 'LOADING...' : 'LOAD MORE'}
                        </button>
                    </div>
                )}

                {/* End of Feed */}
                {!hasMore && posts.length > 0 && (
                    <div className="mt-8 text-center text-sm font-bold" style={{
                        color: '#888888',
                        textShadow: '0 0 5px rgba(136, 136, 136, 0.4)',
                    }}>
                        ▼ END OF FEED ▼
                    </div>
                )}
            </div>
        </div>
    );
}
