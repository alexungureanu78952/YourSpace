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
        <div className="w-full">
            <button
                onClick={isFollowing ? handleUnfollow : handleFollow}
                disabled={isLoading}
                className="y2k-button w-full py-2"
                style={{
                    opacity: isLoading ? 0.5 : 1,
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    borderColor: isFollowing ? '#00ffff' : '#39ff14',
                    color: isFollowing ? '#00ffff' : '#39ff14',
                    textShadow: isFollowing ? '0 0 5px rgba(0, 255, 255, 0.6)' : '0 0 5px rgba(57, 255, 20, 0.6)',
                    background: isFollowing ? 'rgba(0, 255, 255, 0.1)' : 'rgba(13, 59, 26, 0.3)',
                }}
            >
                {isLoading ? 'PROCESSING...' : isFollowing ? 'UNFOLLOW' : 'FOLLOW'}
            </button>
            {error && (
                <p className="text-xs font-bold mt-2" style={{
                    color: '#ff0000',
                    textShadow: '0 0 5px rgba(255, 0, 0, 0.6)',
                }}>
                    {error}
                </p>
            )}
        </div>
    );
};

export default FollowButton;
