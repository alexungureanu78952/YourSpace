import React, { useState, useEffect } from 'react';

export interface FollowButtonProps {
    targetUserId: number;
    currentUserId: number | null;
    onFollowChange?: (isFollowing: boolean) => void;
}

/**
 * FollowButton component for following/unfollowing users
 */
const FollowButton: React.FC<FollowButtonProps> = ({
    targetUserId,
    currentUserId,
    onFollowChange
}) => {
    const [isFollowing, setIsFollowing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (currentUserId && currentUserId !== targetUserId) {
            checkFollowStatus();
        }
    }, [currentUserId, targetUserId]);

    const checkFollowStatus = async () => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/follows/is-following?followerId=${currentUserId}&followedId=${targetUserId}`
            );
            if (response.ok) {
                const data = await response.json();
                setIsFollowing(data.isFollowing);
            }
        } catch (err) {
            console.error('Error checking follow status:', err);
        }
    };

    const handleFollow = async () => {
        if (!currentUserId) {
            setError('Please login to follow users');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `http://localhost:5000/api/follows/${targetUserId}`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.ok) {
                setIsFollowing(true);
                if (onFollowChange) {
                    onFollowChange(true);
                }
            } else {
                const data = await response.json();
                setError(data.message || 'Failed to follow user');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
            console.error('Follow error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUnfollow = async () => {
        if (!currentUserId) {
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `http://localhost:5000/api/follows/${targetUserId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.ok) {
                setIsFollowing(false);
                if (onFollowChange) {
                    onFollowChange(false);
                }
            } else {
                const data = await response.json();
                setError(data.message || 'Failed to unfollow user');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
            console.error('Unfollow error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Don't show button if not logged in or viewing own profile
    if (!currentUserId || currentUserId === targetUserId) {
        return null;
    }

    return (
        <div className="inline-block">
            <button
                onClick={isFollowing ? handleUnfollow : handleFollow}
                disabled={isLoading}
                className={`px-4 py-2 rounded font-medium transition-colors ${isFollowing
                        ? 'bg-gray-600 hover:bg-gray-700 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {isLoading ? 'Loading...' : isFollowing ? 'Unfollow' : 'Follow'}
            </button>
            {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
        </div>
    );
};

export default FollowButton;
