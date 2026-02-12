import React from 'react';
import { useAuth } from '../context/AuthContext';

interface UserProfileProps {
    user: {
        id: number;
        username: string;
        displayName: string;
        email: string;
        bio?: string;
        avatarUrl?: string;
        theme?: string;
        createdAt: string;
    };
}

/**
 * UserProfile displays the user's profile info and customization options.
 */
const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
    const { user: currentUser } = useAuth();
    const isOwnProfile = currentUser && currentUser.id === user.id;
    return (
        <div className={`rounded-lg shadow-lg p-6 ${user.theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
            <div className="flex items-center gap-4 mb-4">
                <img
                    src={user.avatarUrl || '/default-avatar.png'}
                    alt="avatar"
                    className="w-16 h-16 rounded-full border"
                />
                <div>
                    <h2 className="text-2xl font-bold">{user.displayName || user.username}</h2>
                    <p className="text-sm text-gray-400">@{user.username}</p>
                </div>
            </div>
            {user.bio && <p className="mb-2">{user.bio}</p>}
            <p className="text-xs text-gray-500">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
            {isOwnProfile && (
                <button
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    onClick={() => window.location.href = '/profile/edit'}
                >
                    Edit Profile
                </button>
            )}
        </div>
    );
};

export default UserProfile;
