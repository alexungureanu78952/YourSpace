import { getServerCurrentUser } from '../../../config/getServerCurrentUser';
import EditProfileForm from '../../../components/EditProfileForm';
import { redirect } from 'next/navigation';

export default async function EditProfilePage() {
    const user = await getServerCurrentUser();
    if (!user) redirect('/auth/login');
    return <EditProfileForm user={user} />;
}
