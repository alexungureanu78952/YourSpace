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
            <div className="min-h-screen bg-black flex items-center justify-center py-20" style={{
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
                <div className="text-center">
                    <div className="inline-block animate-pulse rounded-full h-12 w-12 border-4 mb-4" style={{
                        borderColor: '#39ff14',
                        boxShadow: '0 0 15px rgba(57, 255, 20, 0.6)',
                    }}></div>
                    <p className="font-bold text-sm" style={{
                        color: '#39ff14',
                        textShadow: '0 0 5px rgba(57, 255, 20, 0.6)',
                        letterSpacing: '1px',
                    }}>
                        LOADING USERS...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center py-20" style={{
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
                <div className="p-6 border-2 border-red-500 font-bold text-center"
                     style={{
                         background: 'rgba(255, 0, 0, 0.1)',
                         color: '#ff0000',
                         textShadow: '0 0 5px rgba(255, 0, 0, 0.6)',
                         boxShadow: '0 0 10px rgba(255, 0, 0, 0.4)',
                     }}>
                    ERROR: {error}
                </div>
            </div>
        );
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
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 pb-6 border-b-2" style={{ borderColor: '#39ff14' }}>
                        <h1 className="y2k-heading y2k-heading-lg mb-2">DISCOVER USERS</h1>
                        <p style={{
                            color: '#00ffff',
                            fontSize: '0.95rem',
                            textShadow: '0 0 5px rgba(0, 255, 255, 0.6)',
                            letterSpacing: '1px',
                        }}>
                            Find and connect with other members of YourSpace. Browse profiles, follow your friends, and explore!
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-8">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder=">>> SEARCH USERS..."
                            className="y2k-input w-full py-3"
                            style={{
                                borderColor: '#39ff14',
                            }}
                        />
                    </div>

                    {/* Users Grid */}
                    {filteredUsers.length === 0 ? (
                        <div className="text-center py-12">
                            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>❌</div>
                            <p className="font-bold text-sm" style={{
                                color: '#888888',
                                letterSpacing: '1px',
                            }}>
                                {searchQuery ? 'NO USERS FOUND' : 'NO USERS AVAILABLE'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredUsers.map((user) => (
                                <Link
                                    key={user.id}
                                    href={`/profile/${user.id}`}
                                    className="y2k-card hover:scale-105 transition-transform"
                                    style={{
                                        background: 'rgba(26, 26, 26, 0.8)',
                                        borderColor: '#1a4d2e',
                                    }}
                                >
                                    <div className="flex items-center gap-4 mb-4 pb-4 border-b" style={{ borderColor: '#1a4d2e' }}>
                                        <img
                                            src={getAvatarUrl(user)}
                                            alt={`${user.username} avatar`}
                                            className="w-16 h-16 rounded-full border-2"
                                            style={{ borderColor: '#39ff14' }}
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = '/default-avatar.png';
                                            }}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold truncate" style={{
                                                color: '#39ff14',
                                                textShadow: '0 0 5px rgba(57, 255, 20, 0.6)',
                                                fontSize: '1.1rem',
                                            }}>
                                                {getDisplayName(user)}
                                            </h3>
                                            <p className="text-sm truncate" style={{
                                                color: '#00ffff',
                                                textShadow: '0 0 5px rgba(0, 255, 255, 0.6)',
                                            }}>
                                                @{user.username}
                                            </p>
                                            <div style={{ marginTop: '4px' }}>
                                                <FollowStats userId={user.id} />
                                            </div>
                                        </div>
                                    </div>

                                    {user.profile?.bio && (
                                        <p className="text-sm line-clamp-2 mb-3" style={{
                                            color: '#888888',
                                        }}>
                                            {user.profile.bio}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between text-xs pt-3 border-t" style={{
                                        borderColor: '#1a4d2e',
                                        color: '#888888',
                                    }}>
                                        <span>
                                            {new Date(user.createdAt).toLocaleDateString('en-US')}
                                        </span>
                                        <span style={{
                                            color: '#00ffff',
                                            textShadow: '0 0 5px rgba(0, 255, 255, 0.6)',
                                            fontWeight: 'bold',
                                        }}>
                                            VIEW →
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Results count */}
                    {searchQuery && (
                        <div className="mt-8 text-center text-sm font-bold" style={{
                            color: '#888888',
                            letterSpacing: '1px',
                        }}>
                            {filteredUsers.length} {filteredUsers.length === 1 ? 'RESULT' : 'RESULTS'} FOUND
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
