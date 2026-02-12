import { redirect } from 'next/navigation';
import UserProfileClient from '../../../components/UserProfileClient';
import API_BASE_URL from '../../../config/api';
import { cookies } from 'next/headers';

interface PageProps {
    params: Promise<{ username: string }>;
}

async function getUserByUsername(username: string) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) {
        return null;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/users/by-username/${username}`, {
            headers: {
                'Cookie': `token=${token.value}`,
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching user by username:', error);
        return null;
    }
}

export default async function UserProfilePage({ params }: PageProps) {
    const { username } = await params;
    const user = await getUserByUsername(username);

    if (!user) {
        return (
            <main className="max-w-2xl mx-auto py-8">
                <div className="bg-red-500/20 border border-red-500 text-red-700 dark:text-red-300 px-6 py-4 rounded-lg">
                    Utilizatorul nu a fost găsit
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
