import React from 'react';
import { useAuth } from '../context/AuthContext';
import FollowButton from './FollowButton';
import FollowStats from './FollowStats';

interface UserProfileProps {
    user: {
        id: number;
        username: string;
        displayName: string;
        email: string;
        createdAt: string;
        profile?: {
            displayName?: string;
            bio?: string;
            avatarUrl?: string;
            customHtml?: string;
            customCss?: string;
        };
    };
}

/**
 * UserProfile displays the user's profile info and customization options.
 */
const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
    const { user: currentUser } = useAuth();
    const isOwnProfile = currentUser && currentUser.id === user.id;
    const profile = user.profile || {};
    const displayName = profile.displayName || user.displayName || user.username;
    const bio = profile.bio || '';
    const avatarUrl = profile.avatarUrl || '/default-avatar.png';

    const [imgSrc, setImgSrc] = React.useState(avatarUrl);

    return (
        <div className="rounded-lg shadow-lg p-6 bg-white text-black">
            <div className="flex items-center gap-4 mb-4">
                <img
                    src={imgSrc}
                    alt="avatar"
                    className="w-16 h-16 rounded-full border"
                    onError={() => setImgSrc('/default-avatar.png')}
                />
                <div>
                    <h2 className="text-2xl font-bold">{displayName}</h2>
                    <p className="text-sm text-gray-400">@{user.username}</p>
                    <FollowStats userId={user.id} className="mt-2" />
                </div>
            </div>
            {bio && <p className="mb-2">{bio}</p>}
            <p className="text-xs text-gray-500">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>

            {/* Custom HTML Section */}
            {profile.customHtml && (
                <div className="mt-4 p-4 border rounded" dangerouslySetInnerHTML={{ __html: profile.customHtml }} />
            )}

            {/* Custom CSS */}
            {profile.customCss && (
                <style dangerouslySetInnerHTML={{ __html: profile.customCss }} />
            )}

            {isOwnProfile ? (
                <button
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    onClick={() => window.location.href = '/profile/edit'}
                >
                    Edit Profile
                </button>
            ) : (
                <div className="mt-4 flex gap-2">
                    <FollowButton
                        targetUserId={user.id}
                        currentUserId={currentUser?.id || null}
                    />
                    <button
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                        onClick={() => window.location.href = `/messages/${user.id}`}
                    >
                        Send Message
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
