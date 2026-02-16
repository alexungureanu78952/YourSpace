'use client';

import { useState } from 'react';
import API_BASE_URL from '@/config/api';
interface CreatePostProps {
    onPostCreated: () => void;
}

const MAX_CONTENT_LENGTH = 5000;

/**
 * CreatePost - Component for creating new posts
 */
export default function CreatePost({ onPostCreated }: CreatePostProps) {
    const [content, setContent] = useState('');
    const [mediaUrl, setMediaUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isContentValid = content.trim().length > 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isContentValid) {
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${API_BASE_URL}/api/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    content: content.trim(),
                    mediaUrl: mediaUrl.trim() || '',
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to create post');
            }

            await response.json();

            // Clear form
            setContent('');
            setMediaUrl('');

            // Notify parent component
            onPostCreated();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error creating post. Please try again.');
            console.error('Create post error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="y2k-card mb-6" style={{
            background: 'rgba(26, 26, 26, 0.9)',
            borderColor: '#00ffff',
        }}>
            <div className="mb-4 pb-4 border-b" style={{ borderColor: '#1a4d2e' }}>
                <h3 style={{
                    color: '#00ffff',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    textShadow: '0 0 5px rgba(0, 255, 255, 0.6)',
                    letterSpacing: '1px',
                }}>
                    CREATE POST
                </h3>
            </div>
            <form onSubmit={handleSubmit}>
                {/* Content Textarea */}
                <div className="mb-4">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="What's on your mind?"
                        rows={4}
                        maxLength={MAX_CONTENT_LENGTH}
                        className="y2k-input w-full resize-none"
                        disabled={isSubmitting}
                        style={{
                            borderColor: '#39ff14',
                        }}
                    />
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-xs" style={{
                            color: '#888888',
                        }}>
                            {content.length} / {MAX_CONTENT_LENGTH}
                        </span>
                    </div>
                </div>

                {/* Media URL Input */}
                <div className="mb-4">
                    <input
                        type="url"
                        value={mediaUrl}
                        onChange={(e) => setMediaUrl(e.target.value)}
                        placeholder="Media URL (optional) - YouTube, images, etc."
                        className="y2k-input w-full text-sm"
                        disabled={isSubmitting}
                        style={{
                            borderColor: '#39ff14',
                        }}
                    />
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-2 text-sm font-bold border border-red-500"
                         style={{
                             color: '#ff0000',
                             background: 'rgba(255, 0, 0, 0.1)',
                             textShadow: '0 0 5px rgba(255, 0, 0, 0.6)',
                         }}>
                        {error}
                    </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={!isContentValid || isSubmitting}
                        className="y2k-button py-2"
                        style={{
                            opacity: (!isContentValid || isSubmitting) ? 0.5 : 1,
                            cursor: (!isContentValid || isSubmitting) ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {isSubmitting ? 'POSTING...' : 'POST'}
                    </button>
                </div>
            </form>
        </div>
    );
}
