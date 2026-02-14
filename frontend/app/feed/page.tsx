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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-2xl mx-auto px-4 py-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Feed
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Posts from people you follow and others
                    </p>
                </div>

                {/* Create Post */}
                <CreatePost onPostCreated={handlePostCreated} />

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                        <p className="text-red-600 dark:text-red-400">{error}</p>
                    </div>
                )}

                {/* Loading State (Initial) */}
                {loading && posts.length === 0 && (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">Loading feed...</p>
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
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                            />
                        </svg>
                        <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                            No posts yet
                        </h3>
                        <p className="mt-1 text-gray-500 dark:text-gray-400">
                            Start following people to see their posts here!
                        </p>
                    </div>
                )}

                {/* Load More Button */}
                {hasMore && posts.length > 0 && (
                    <div className="mt-6 text-center">
                        <button
                            onClick={handleLoadMore}
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium
                       hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600
                       disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'Loading...' : 'Load More'}
                        </button>
                    </div>
                )}

                {/* End of Feed */}
                {!hasMore && posts.length > 0 && (
                    <div className="mt-6 text-center text-gray-500 dark:text-gray-400 text-sm">
                        You've reached the end of the feed
                    </div>
                )}
            </div>
        </div>
    );
}
