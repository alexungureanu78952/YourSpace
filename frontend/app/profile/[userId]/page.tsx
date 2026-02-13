import { redirect } from 'next/navigation';
import UserProfileClient from '../../../components/UserProfileClient';
import API_BASE_URL from '../../../config/api';

interface PageProps {
    params: Promise<{ userId: string }>;
}

async function getUserById(userId: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        return null;
    }
}

export default async function UserProfilePage({ params }: PageProps) {
    const { userId } = await params;
    const user = await getUserById(userId);

    if (!user) {
        return (
            <main className="max-w-2xl mx-auto py-8">
                <div className="bg-red-500/20 border border-red-500 text-red-700 dark:text-red-300 px-6 py-4 rounded-lg">
                    User not found
                </div>
            </main>
        );
    }

    return (
        <main className="max-w-2xl mx-auto py-8">
            <UserProfileClient user={user} />
        </main>
    );
}
