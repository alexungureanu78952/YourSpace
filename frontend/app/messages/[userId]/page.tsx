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
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
                <div className="text-white text-xl">Invalid user ID</div>
            </div>
        );
    }

    const messageGroups = groupMessagesByDate(messages);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
            <div className="container mx-auto px-4 py-8 h-screen flex flex-col">
                <div className="max-w-4xl mx-auto w-full flex flex-col h-full">
                    <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-xl border border-white/20 overflow-hidden flex flex-col h-full">
                        {/* Header */}
                        <div className="bg-white/5 border-b border-white/20 px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/messages"
                                    className="text-white/80 hover:text-white transition-colors"
                                >
                                    ← Back
                                </Link>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                                        {otherUsername.charAt(0).toUpperCase()}
                                    </div>
                                    <Link
                                        href={`/profile/${otherUserId}`}
                                        className="text-xl font-bold text-white hover:text-blue-300 transition-colors"
                                    >
                                        {otherUsername}
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                            {loading && messages.length === 0 ? (
                                <div className="text-center text-white/60 py-8">Loading messages...</div>
                            ) : error && messages.length === 0 ? (
                                <div className="bg-red-500/20 border border-red-500 text-white px-4 py-3 rounded-lg">
                                    {error}
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="text-center text-white/60 py-8">
                                    <p>No messages yet</p>
                                    <p className="text-sm mt-2">Start the conversation!</p>
                                </div>
                            ) : (
                                Object.keys(messageGroups).map((dateKey) => (
                                    <div key={dateKey}>
                                        {/* Date separator */}
                                        <div className="flex items-center justify-center my-4">
                                            <div className="bg-white/10 px-3 py-1 rounded-full text-white/60 text-xs">
                                                {formatMessageDate(messageGroups[dateKey][0].sentAt)}
                                            </div>
                                        </div>
                                        {/* Messages for this date */}
                                        {messageGroups[dateKey].map((message) => {
                                            const isOwn = message.senderId === currentUserId;
                                            return (
                                                <div
                                                    key={message.id}
                                                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3`}
                                                >
                                                    <div
                                                        className={`max-w-[70%] px-4 py-2 rounded-lg ${isOwn
                                                            ? 'bg-blue-500 text-white'
                                                            : 'bg-white/10 text-white'
                                                            }`}
                                                    >
                                                        <p className="break-words">{message.content}</p>
                                                        <div
                                                            className={`text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-white/50'
                                                                }`}
                                                        >
                                                            {formatMessageTime(message.sentAt)}
                                                            {isOwn && message.isRead && ' • Read'}
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
                            <div className="px-6 py-2">
                                <div className="bg-red-500/20 border border-red-500 text-white px-3 py-2 rounded text-sm">
                                    {error}
                                </div>
                            </div>
                        )}

                        {/* Message Input */}
                        <div className="bg-white/5 border-t border-white/20 px-6 py-4">
                            <form onSubmit={sendMessage} className="flex gap-3">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={sending}
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim() || sending}
                                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                                >
                                    {sending ? 'Sending...' : 'Send'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
