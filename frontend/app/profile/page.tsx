import { redirect } from 'next/navigation';
import UserProfileClient from '../../components/UserProfileClient';
import { getServerCurrentUser } from '../../config/getServerCurrentUser';

export default async function ProfilePage() {
    const user = await getServerCurrentUser();
    if (!user) {
        redirect('/auth/login');
    }
    return (
        <main className="min-h-screen bg-black py-8 px-4" style={{
            backgroundImage: `
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(57, 255, 20, 0.03) 2px,
                rgba(57, 255, 20, 0.03) 4px
              )
            `,
        }}>
            <div className="max-w-2xl mx-auto">
                <UserProfileClient user={user} />
            </div>
        </main>
    );
}
