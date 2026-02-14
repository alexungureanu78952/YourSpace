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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
            <form onSubmit={handleSubmit}>
                {/* Content Textarea */}
                <div className="mb-3">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="What's on your mind?"
                        rows={4}
                        maxLength={MAX_CONTENT_LENGTH}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        disabled={isSubmitting}
                    />
                    <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {content.length} / {MAX_CONTENT_LENGTH}
                        </span>
                    </div>
                </div>

                {/* Media URL Input */}
                <div className="mb-3">
                    <input
                        type="url"
                        value={mediaUrl}
                        onChange={(e) => setMediaUrl(e.target.value)}
                        placeholder="Media URL (optional) - YouTube, images, etc."
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     text-sm"
                        disabled={isSubmitting}
                    />
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-3 text-sm text-red-600 dark:text-red-400">
                        {error}
                    </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={!isContentValid || isSubmitting}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium
                     hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600
                     disabled:cursor-not-allowed transition-colors"
                    >
                        {isSubmitting ? 'Posting...' : 'Post'}
                    </button>
                </div>
            </form>
        </div>
    );
}
