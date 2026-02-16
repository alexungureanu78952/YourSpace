'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ConversationDto } from '@/types/message';
import { API_ENDPOINTS } from '@/config/api';
import { useAuth } from '@/context/AuthContext';

export default function MessagesPage() {
    const { user, token: authToken } = useAuth();
    const [conversations, setConversations] = useState<ConversationDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (authToken) {
            fetchConversations();
        } else {
            router.push('/auth/login');
        }
    }, [authToken]);

    const fetchConversations = async () => {
        if (!authToken) return;

        try {
            setLoading(true);
            setError(null);

            const headers: HeadersInit = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            };

            const response = await fetch(API_ENDPOINTS.messages.conversations, {
                credentials: 'include',
                headers,
            });

            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                alert('Your session expired. Please log in again.');
                router.push('/auth/login');
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to fetch conversations');
            }

            const data = await response.json();
            setConversations(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'now';
        if (diffMins < 60) return `${diffMins}m`;
        if (diffHours < 24) return `${diffHours}h`;
        if (diffDays < 7) return `${diffDays}d`;
        return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
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
                    }}>
                        LOADING CONVERSATIONS...
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
                <div className="max-w-3xl mx-auto">
                    <div className="y2k-card" style={{
                        background: 'rgba(26, 26, 26, 0.9)',
                        borderColor: '#00ffff',
                    }}>
                        {/* Header */}
                        <div className="pb-6 mb-6 border-b" style={{ borderColor: '#1a4d2e' }}>
                            <h1 className="y2k-heading y2k-heading-lg" style={{
                                color: '#00ffff',
                                marginBottom: 0,
                            }}>
                                MESSAGES
                            </h1>
                        </div>

                        {/* Conversations List */}
                        <div className="space-y-3">
                            {conversations.length === 0 ? (
                                <div className="text-center py-12">
                                    <div style={{
                                        fontSize: '2.5rem',
                                        marginBottom: '10px',
                                    }}>
                                        💬
                                    </div>
                                    <p className="font-bold text-sm" style={{
                                        color: '#888888',
                                        letterSpacing: '1px',
                                    }}>
                                        NO CONVERSATIONS YET
                                    </p>
                                    <p className="text-xs mt-2" style={{
                                        color: '#666666',
                                    }}>
                                        Start a conversation by visiting a user profile!
                                    </p>
                                </div>
                            ) : (
                                conversations.map((conversation) => (
                                    <Link
                                        key={conversation.otherUserId}
                                        href={`/messages/${conversation.otherUserId}`}
                                        className="block p-4 border transition-all hover:scale-102"
                                        style={{
                                            borderColor: '#1a4d2e',
                                            background: 'rgba(13, 59, 26, 0.3)',
                                        }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1 flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold text-lg"
                                                     style={{
                                                         borderColor: '#39ff14',
                                                         background: 'rgba(57, 255, 20, 0.1)',
                                                         color: '#39ff14',
                                                     }}>
                                                    {conversation.otherUsername.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-bold truncate" style={{
                                                            color: '#39ff14',
                                                            textShadow: '0 0 5px rgba(57, 255, 20, 0.6)',
                                                        }}>
                                                            {conversation.otherUsername}
                                                        </h3>
                                                        {conversation.unreadCount > 0 && (
                                                            <span className="font-bold text-xs px-2 py-0.5 border" style={{
                                                                color: '#ff00ff',
                                                                borderColor: '#ff00ff',
                                                                background: 'rgba(255, 0, 255, 0.1)',
                                                                boxShadow: '0 0 5px rgba(255, 0, 255, 0.4)',
                                                            }}>
                                                                {conversation.unreadCount}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {conversation.lastMessage && (
                                                        <p className="text-xs truncate mt-1" style={{
                                                            color: '#888888',
                                                        }}>
                                                            {conversation.lastMessage}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            {conversation.lastMessageAt && (
                                                <div className="text-xs ml-4" style={{
                                                    color: '#666666',
                                                }}>
                                                    {formatDate(conversation.lastMessageAt)}
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Back to Home */}
                    <div className="mt-6 text-center">
                        <Link
                            href="/"
                            className="font-bold text-sm uppercase"
                            style={{
                                color: '#00ffff',
                                textShadow: '0 0 5px rgba(0, 255, 255, 0.6)',
                            }}
                        >
                            ← BACK TO HOME
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
