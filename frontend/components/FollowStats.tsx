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
            <div className={`flex gap-3 text-xs font-bold ${className}`} style={{
                color: '#888888',
            }}>
                <span>LOADING...</span>
            </div>
        );
    }

    return (
        <div className={`flex gap-4 text-xs font-bold ${className}`}>
            <Link
                href={`/profile/${userId}/followers`}
                className="hover:brightness-150 transition-all"
                style={{
                    color: '#39ff14',
                    textShadow: '0 0 5px rgba(57, 255, 20, 0.6)',
                }}
            >
                <span style={{ fontSize: '1.1em' }}>{stats.followersCount}</span> {stats.followersCount === 1 ? 'FOLLOWER' : 'FOLLOWERS'}
            </Link>
            <Link
                href={`/profile/${userId}/following`}
                className="hover:brightness-150 transition-all"
                style={{
                    color: '#00ffff',
                    textShadow: '0 0 5px rgba(0, 255, 255, 0.6)',
                }}
            >
                <span style={{ fontSize: '1.1em' }}>{stats.followingCount}</span> FOLLOWING
            </Link>
        </div>
    );
};

export default FollowStats;
