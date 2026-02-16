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
        <div className="y2k-card" style={{
            background: 'rgba(26, 26, 26, 0.8)',
            borderColor: '#39ff14',
        }}>
            <div className="flex items-center gap-4 mb-6 pb-6 border-b" style={{ borderColor: '#1a4d2e' }}>
                <img
                    src={imgSrc}
                    alt="avatar"
                    className="w-20 h-20 rounded-full border-2"
                    style={{ borderColor: '#39ff14' }}
                    onError={() => setImgSrc('/default-avatar.png')}
                />
                <div className="flex-1">
                    <h2 className="font-bold text-2xl" style={{
                        color: '#39ff14',
                        textShadow: '0 0 10px rgba(57, 255, 20, 0.8)',
                    }}>
                        {displayName}
                    </h2>
                    <p className="text-sm" style={{
                        color: '#00ffff',
                        textShadow: '0 0 5px rgba(0, 255, 255, 0.6)',
                    }}>
                        @{user.username}
                    </p>
                    <div style={{ marginTop: '8px' }}>
                        <FollowStats userId={user.id} />
                    </div>
                </div>
            </div>

            {bio && (
                <p className="mb-4" style={{
                    color: '#cccccc',
                }}>
                    {bio}
                </p>
            )}

            <p className="text-xs mb-4" style={{
                color: '#888888',
            }}>
                JOINED: {new Date(user.createdAt).toLocaleDateString()}
            </p>

            {/* Custom HTML Section */}
            {profile.customHtml && (
                <div className="mt-4 p-4 border" style={{
                    borderColor: '#39ff14',
                    background: 'rgba(57, 255, 20, 0.05)',
                }}>
                    <div dangerouslySetInnerHTML={{ __html: profile.customHtml }} />
                </div>
            )}

            {/* Custom CSS */}
            {profile.customCss && (
                <style dangerouslySetInnerHTML={{ __html: profile.customCss }} />
            )}

            {isOwnProfile ? (
                <button
                    className="y2k-button mt-6 w-full py-3"
                    onClick={() => window.location.href = '/profile/edit'}
                >
                    EDIT PROFILE
                </button>
            ) : (
                <div className="mt-6 flex gap-4">
                    <div style={{ flex: 1 }}>
                        <FollowButton
                            targetUserId={user.id}
                            currentUserId={currentUser?.id || null}
                        />
                    </div>
                    <button
                        className="y2k-button-secondary flex-1 py-2"
                        onClick={() => window.location.href = `/messages/${user.id}`}
                        style={{
                            background: 'rgba(0, 255, 255, 0.1)',
                        }}
                    >
                        MESSAGE
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
