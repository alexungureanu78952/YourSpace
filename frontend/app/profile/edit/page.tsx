"use client";

import EditProfileForm from '../../../components/EditProfileForm';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import API_BASE_URL from '../../../config/api';

export default function EditProfilePage() {
    const { user: authUser, token } = useAuth();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authUser || !token) {
            // Save current URL to redirect back after login
            const currentUrl = window.location.pathname;
            router.replace(`/auth/login?redirect=${encodeURIComponent(currentUrl)}`);
            return;
        }

        // Fetch full user details with profile
        const fetchUser = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/users/${authUser.id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [authUser, token, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return <EditProfileForm user={user} />;
}
