import { redirect } from 'next/navigation';
import UserProfileClient from '../../components/UserProfileClient';
import { getServerCurrentUser } from '../../config/getServerCurrentUser';

export default async function ProfilePage() {
    const user = await getServerCurrentUser();
    if (!user) {
        redirect('/auth/login');
    }
    return (
        <main className="max-w-2xl mx-auto py-8">
            <UserProfileClient user={user} />
        </main>
    );
}
