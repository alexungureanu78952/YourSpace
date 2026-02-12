"use client";

import { useEffect, useRef, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import { MessageDto } from '@/types/message';

export function useChatHub(userId: number | null, onMessageReceived: (message: MessageDto) => void) {
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        if (!userId) return;

        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!token) {
            console.warn('[SignalR] No token found, skipping connection');
            return;
        }

        // Creează conexiunea SignalR
        const hubConnection = new signalR.HubConnectionBuilder()
            .withUrl('http://localhost:5000/hubs/chat', {
                accessTokenFactory: () => token,
            })
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();

        // Event handler pentru mesaje primite
        hubConnection.on('ReceiveMessage', (message: MessageDto) => {
            console.log('[SignalR] Message received:', message);
            onMessageReceived(message);
        });

        // Event handler pentru typing indicator
        hubConnection.on('UserTyping', (senderId: number) => {
            console.log(`[SignalR] User ${senderId} is typing...`);
            // Poți adăuga logică pentru typing indicator aici
        });

        // Pornește conexiunea
        hubConnection
            .start()
            .then(() => {
                console.log('[SignalR] Connected to ChatHub');
                setIsConnected(true);
            })
            .catch((err) => {
                console.error('[SignalR] Connection failed:', err);
                setIsConnected(false);
                // Retry după 5 secunde
                reconnectTimeoutRef.current = setTimeout(() => {
                    console.log('[SignalR] Attempting to reconnect...');
                    hubConnection.start();
                }, 5000);
            });

        // Event handlers pentru reconectare
        hubConnection.onreconnecting((error) => {
            console.warn('[SignalR] Reconnecting...', error);
            setIsConnected(false);
        });

        hubConnection.onreconnected((connectionId) => {
            console.log('[SignalR] Reconnected with connection ID:', connectionId);
            setIsConnected(true);
        });

        hubConnection.onclose((error) => {
            console.error('[SignalR] Connection closed:', error);
            setIsConnected(false);
        });

        setConnection(hubConnection);

        // Cleanup
        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (hubConnection) {
                hubConnection.stop().then(() => {
                    console.log('[SignalR] Disconnected from ChatHub');
                });
            }
        };
    }, [userId, onMessageReceived]);

    // Metodă pentru a trimite typing indicator
    const sendTypingIndicator = async (recipientId: number) => {
        if (connection && isConnected) {
            try {
                await connection.invoke('SendTypingIndicator', recipientId);
            } catch (err) {
                console.error('[SignalR] Failed to send typing indicator:', err);
            }
        }
    };

    return { connection, isConnected, sendTypingIndicator };
}
