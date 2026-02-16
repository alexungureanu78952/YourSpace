'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { MessageDto } from '@/types/message';
import { API_ENDPOINTS } from '@/config/api';
import { useAuth } from '@/context/AuthContext';
import { useChatHub } from '@/hooks/useChatHub';

export default function ChatPage() {
    const { user, token: authToken } = useAuth();
    const params = useParams();
    const otherUserId = params?.userId ? parseInt(params.userId as string) : null;

    const [messages, setMessages] = useState<MessageDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [otherUsername, setOtherUsername] = useState<string>('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Callback pentru mesaje primite prin SignalR
    const handleMessageReceived = useCallback((message: MessageDto) => {
        // Adaugă mesajul doar dacă este de la/către user-ul curent în această conversație
        if (
            (message.senderId === otherUserId && message.receiverId === user?.id) ||
            (message.receiverId === otherUserId && message.senderId === user?.id)
        ) {
            setMessages((prev) => {
                // Verifică dacă mesajul nu există deja (evită duplicate)
                if (prev.some((m) => m.id === message.id)) {
                    return prev;
                }
                return [...prev, message];
            });
        }
    }, [otherUserId, user?.id]);

    // Conectare la SignalR Hub
    const { isConnected, sendTypingIndicator } = useChatHub(user?.id ?? null, handleMessageReceived);

    useEffect(() => {
        if (otherUserId && authToken) {
            fetchMessages();
        }
    }, [otherUserId, authToken]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchMessages = async () => {
        if (!otherUserId || !authToken) return;

        try {
            setLoading(true);
            setError(null);

            const headers: HeadersInit = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            };

            const response = await fetch(API_ENDPOINTS.messages.withUser(otherUserId), {
                credentials: 'include',
                headers,
            });

            console.log('📥 [Chat] Response status:', response.status);

            if (response.status === 401) {

                router.push('/auth/login');
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to fetch messages');
            }

            const data: MessageDto[] = await response.json();
            setMessages(data);

            // Set current user ID from auth context
            if (user) {
                setCurrentUserId(user.id);
            }

            // Set other username from first message
            if (data.length > 0) {
                const firstMsg = data[0];
                setOtherUsername(firstMsg.senderId === otherUserId ? firstMsg.senderUsername : firstMsg.receiverUsername);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !otherUserId || sending || !authToken) return;

        try {
            setSending(true);
            setError(null);

            const headers: HeadersInit = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            };

            const response = await fetch(API_ENDPOINTS.messages.send, {
                method: 'POST',
                credentials: 'include',
                headers,
                body: JSON.stringify({
                    receiverId: otherUserId,
                    content: newMessage.trim(),
                }),
            });

            if (response.status === 401) {
                // Token expirat sau invalid - logout și redirect
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                alert('Sesiunea ta a expirat. Te rugăm să te autentifici din nou.');
                router.push('/auth/login');
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            const sentMessage: MessageDto = await response.json();
            setMessages([...messages, sentMessage]);
            setNewMessage('');

            // Set current user ID if not set
            if (!currentUserId) {
                setCurrentUserId(sentMessage.senderId);
            }
            if (!otherUsername) {
                setOtherUsername(sentMessage.receiverUsername);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to send message');
        } finally {
            setSending(false);
        }
    };

    const formatMessageTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' });
    };

    const formatMessageDate = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' });
        }
    };

    const groupMessagesByDate = (messages: MessageDto[]) => {
        const groups: { [key: string]: MessageDto[] } = {};
        messages.forEach((msg) => {
            const dateKey = new Date(msg.sentAt).toDateString();
            if (!groups[dateKey]) {
                groups[dateKey] = [];
            }
            groups[dateKey].push(msg);
        });
        return groups;
    };

    if (!otherUserId) {
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
                <div className="font-bold text-center" style={{
                    color: '#ff0000',
                    textShadow: '0 0 5px rgba(255, 0, 0, 0.6)',
                }}>
                    INVALID USER ID
                </div>
            </div>
        );
    }

    const messageGroups = groupMessagesByDate(messages);

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
            <div className="container mx-auto px-4 h-full flex flex-col">
                <div className="max-w-3xl mx-auto w-full flex flex-col h-screen">
                    <div className="y2k-card flex flex-col h-full" style={{
                        background: 'rgba(26, 26, 26, 0.9)',
                        borderColor: '#00ffff',
                    }}>
                        {/* Header */}
                        <div className="pb-4 mb-4 border-b" style={{ borderColor: '#1a4d2e' }}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Link
                                        href="/messages"
                                        className="font-bold text-sm uppercase"
                                        style={{
                                            color: '#00ffff',
                                            textShadow: '0 0 5px rgba(0, 255, 255, 0.6)',
                                        }}
                                    >
                                        ← BACK
                                    </Link>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-md"
                                             style={{
                                                 borderColor: '#39ff14',
                                                 background: 'rgba(57, 255, 20, 0.1)',
                                                 color: '#39ff14',
                                             }}>
                                            {otherUsername.charAt(0).toUpperCase()}
                                        </div>
                                        <Link
                                            href={`/profile/${otherUserId}`}
                                            className="font-bold text-lg"
                                            style={{
                                                color: '#39ff14',
                                                textShadow: '0 0 5px rgba(57, 255, 20, 0.6)',
                                            }}
                                        >
                                            {otherUsername}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                            {loading && messages.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="animate-pulse rounded-full h-8 w-8 border-4 inline-block mb-2" style={{
                                        borderColor: '#39ff14',
                                        boxShadow: '0 0 10px rgba(57, 255, 20, 0.6)',
                                    }}></div>
                                    <p className="font-bold text-xs" style={{
                                        color: '#39ff14',
                                        textShadow: '0 0 5px rgba(57, 255, 20, 0.6)',
                                    }}>
                                        LOADING MESSAGES...
                                    </p>
                                </div>
                            ) : error && messages.length === 0 ? (
                                <div className="p-3 border-2 border-red-500 text-center font-bold" style={{
                                    background: 'rgba(255, 0, 0, 0.1)',
                                    color: '#ff0000',
                                    textShadow: '0 0 5px rgba(255, 0, 0, 0.6)',
                                }}>
                                    {error}
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="text-center py-8">
                                    <div style={{ fontSize: '2rem', marginBottom: '10px' }}>💬</div>
                                    <p className="font-bold text-sm" style={{
                                        color: '#888888',
                                        letterSpacing: '1px',
                                    }}>
                                        NO MESSAGES YET
                                    </p>
                                    <p className="text-xs mt-2" style={{
                                        color: '#666666',
                                    }}>
                                        Start the conversation!
                                    </p>
                                </div>
                            ) : (
                                Object.keys(messageGroups).map((dateKey) => (
                                    <div key={dateKey}>
                                        {/* Date separator */}
                                        <div className="flex items-center justify-center my-2">
                                            <div className="px-3 py-1 border text-xs font-bold" style={{
                                                borderColor: '#1a4d2e',
                                                background: 'rgba(13, 59, 26, 0.3)',
                                                color: '#888888',
                                            }}>
                                                {formatMessageDate(messageGroups[dateKey][0].sentAt)}
                                            </div>
                                        </div>
                                        {/* Messages for this date */}
                                        {messageGroups[dateKey].map((message) => {
                                            const isOwn = message.senderId === currentUserId;
                                            return (
                                                <div
                                                    key={message.id}
                                                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}
                                                >
                                                    <div
                                                        className="max-w-[70%] px-3 py-2 border"
                                                        style={{
                                                            borderColor: isOwn ? '#39ff14' : '#1a4d2e',
                                                            background: isOwn ? 'rgba(57, 255, 20, 0.1)' : 'rgba(13, 59, 26, 0.3)',
                                                            color: isOwn ? '#39ff14' : '#00ffff',
                                                            textShadow: isOwn ? '0 0 5px rgba(57, 255, 20, 0.6)' : '0 0 5px rgba(0, 255, 255, 0.6)',
                                                        }}
                                                    >
                                                        <p className="break-words text-sm">{message.content}</p>
                                                        <div
                                                            className="text-xs mt-1"
                                                            style={{
                                                                color: isOwn ? '#888888' : '#666666',
                                                            }}
                                                        >
                                                            {formatMessageTime(message.sentAt)}
                                                            {isOwn && message.isRead && ' ✓✓'}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Error message if any */}
                        {error && messages.length > 0 && (
                            <div className="px-4 py-2">
                                <div className="p-2 border-2 border-red-500 text-xs font-bold" style={{
                                    background: 'rgba(255, 0, 0, 0.1)',
                                    color: '#ff0000',
                                    textShadow: '0 0 5px rgba(255, 0, 0, 0.6)',
                                }}>
                                    {error}
                                </div>
                            </div>
                        )}

                        {/* Message Input */}
                        <div className="pt-4 mt-4 border-t" style={{ borderColor: '#1a4d2e' }}>
                            <form onSubmit={sendMessage} className="flex gap-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder=">>> TYPE MESSAGE"
                                    className="y2k-input flex-1"
                                    disabled={sending}
                                    style={{
                                        borderColor: '#39ff14',
                                    }}
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim() || sending}
                                    className="y2k-button px-6"
                                    style={{
                                        opacity: (!newMessage.trim() || sending) ? 0.5 : 1,
                                        cursor: (!newMessage.trim() || sending) ? 'not-allowed' : 'pointer',
                                    }}
                                >
                                    {sending ? 'SENDING' : 'SEND'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
