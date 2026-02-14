'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import API_BASE_URL from '@/config/api';

interface User {
    id: number;
    username: string;
    displayName: string;
    profile?: {
        displayName?: string;
        bio?: string;
        avatarUrl?: string;
    };
}

export default function FollowingPage() {
    const params = useParams();
    const router = useRouter();
    const userId = parseInt(params.userId as string);
    const [following, setFollowing] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [username, setUsername] = useState('');

    useEffect(() => {
        fetchFollowing();
    }, [userId]);

    const fetchFollowing = async () => {
        try {
            setLoading(true);
            setError(null);

            // First, get the user's info
            const userResponse = await fetch(`${API_BASE_URL}/api/users/${userId}`);
            if (userResponse.ok) {
                const userData = await userResponse.json();
                setUsername(userData.username);
            }

            // Get following list from backend
            const response = await fetch(`${API_BASE_URL}/api/follows/following/${userId}`);

            if (!response.ok) {
                throw new Error('Failed to fetch following');
            }

            const data = await response.json();
            setFollowing(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const getDisplayName = (user: User) => {
        return user.profile?.displayName || user.displayName || user.username;
    };

    const getAvatarUrl = (user: User) => {
        return user.profile?.avatarUrl || '/default-avatar.png';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
                <div className="text-gray-800 dark:text-white text-xl">Loading following...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
                <div className="bg-red-500/20 border border-red-500 text-red-700 dark:text-red-300 px-6 py-4 rounded-lg">
                    Error: {error}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <Link
                            href={`/profile/${userId}`}
                            className="text-blue-600 dark:text-blue-400 hover:underline mb-2 inline-block"
                        >
                            ← Back to profile
                        </Link>
                        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
                            {username ? `@${username}'s ` : ''}Following
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            People that {username || 'this user'} follows
                        </p>
                    </div>

                    {/* Following List */}
                    {following.length === 0 ? (
                        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
                            <p className="text-gray-600 dark:text-gray-400 text-lg">
                                Not following anyone yet
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {following.map((user) => (
                                <Link
                                    key={user.id}
                                    href={`/profile/${user.id}`}
                                    className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow p-4 border border-gray-200 dark:border-gray-700 flex items-center gap-4"
                                >
                                    <img
                                        src={getAvatarUrl(user)}
                                        alt={`${user.username} avatar`}
                                        className="w-14 h-14 rounded-full border-2 border-purple-500"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = '/default-avatar.png';
                                        }}
                                    />
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                                            {getDisplayName(user)}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            @{user.username}
                                        </p>
                                        {user.profile?.bio && (
                                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-1">
                                                {user.profile.bio}
                                            </p>
                                        )}
                                    </div>
                                    <span className="text-blue-600 dark:text-blue-400">
                                        View profile →
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
