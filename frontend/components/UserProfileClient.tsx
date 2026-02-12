"use client";
import UserProfile from './UserProfile';

export default function UserProfileClient({ user }: { user: any }) {
    return <UserProfile user={user} />;
}
