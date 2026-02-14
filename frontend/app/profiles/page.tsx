'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import API_BASE_URL from '@/config/api';
import { useAuth } from '@/context/AuthContext';
import FollowStats from '@/components/FollowStats';

interface User {
    id: number;
    username: string;
    displayName: string;
    email: string;
    createdAt: string;
    profile?: {
        displayName?: string;
        bio?: string;
        avatarUrl?: string;
    };
}

export default function ProfilesPage() {
    const { user } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredUsers(users);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = users.filter(
                (user) =>
                    user.username.toLowerCase().includes(query) ||
                    user.displayName.toLowerCase().includes(query) ||
                    (user.profile?.displayName?.toLowerCase().includes(query) || false) ||
                    (user.profile?.bio?.toLowerCase().includes(query) || false)
            );
            setFilteredUsers(filtered);
        }
    }, [searchQuery, users]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            const headers: HeadersInit = {
                'Content-Type': 'application/json',
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_BASE_URL}/api/users`, {
                credentials: 'include',
                headers,
            });

            if (response.status === 401) {
                router.push('/auth/login');
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }

            const data = await response.json();
            setUsers(data);
            setFilteredUsers(data);
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
                <div className="text-gray-800 dark:text-white text-xl">Loading users...</div>
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
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
                            Discover Users
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Find and connect with other members of YourSpace. Browse profiles, follow your friends, and explore the community!
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-6">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name or username..."
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Users Grid */}
                    {filteredUsers.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-600 dark:text-gray-400 text-lg">
                                {searchQuery ? 'No users found' : 'No users available'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredUsers.map((user) => (
                                <Link
                                    key={user.id}
                                    href={`/profile/${user.id}`}
                                    className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6 border border-gray-200 dark:border-gray-700"
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <img
                                            src={getAvatarUrl(user)}
                                            alt={`${user.username} avatar`}
                                            className="w-16 h-16 rounded-full border-2 border-purple-500"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = '/default-avatar.png';
                                            }}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-bold text-gray-800 dark:text-white truncate">
                                                {getDisplayName(user)}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                                @{user.username}
                                            </p>
                                            <FollowStats userId={user.id} className="mt-1" />
                                        </div>
                                    </div>

                                    {user.profile?.bio && (
                                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                                            {user.profile.bio}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                        <span>
                                            Member from {new Date(user.createdAt).toLocaleDateString('en-US')}
                                        </span>
                                        <span className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                                            View profile →
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Results count */}
                    {searchQuery && (
                        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                            {filteredUsers.length} {filteredUsers.length === 1 ? 'result' : 'results'} found
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
