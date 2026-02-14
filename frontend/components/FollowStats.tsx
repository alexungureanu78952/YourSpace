import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface FollowStatsProps {
    userId: number;
    className?: string;
}

interface FollowStats {
    followersCount: number;
    followingCount: number;
}

/**
 * FollowStats displays follower and following counts with links
 */
const FollowStats: React.FC<FollowStatsProps> = ({ userId, className = '' }) => {
    const [stats, setStats] = useState<FollowStats>({ followersCount: 0, followingCount: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, [userId]);

    const fetchStats = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/follows/stats/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setStats({
                    followersCount: data.followersCount,
                    followingCount: data.followingCount
                });
            }
        } catch (err) {
            console.error('Error fetching follow stats:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className={`flex gap-3 text-sm ${className}`}>
                <span className="text-gray-400">Loading...</span>
            </div>
        );
    }

    return (
        <div className={`flex gap-3 text-sm ${className}`}>
            <Link
                href={`/profile/${userId}/followers`}
                className="hover:underline text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
                <span className="font-bold">{stats.followersCount}</span> {stats.followersCount === 1 ? 'Follower' : 'Followers'}
            </Link>
            <Link
                href={`/profile/${userId}/following`}
                className="hover:underline text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
                <span className="font-bold">{stats.followingCount}</span> Following
            </Link>
        </div>
    );
};

export default FollowStats;
