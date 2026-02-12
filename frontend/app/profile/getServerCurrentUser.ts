import { cookies } from 'next/headers';
import { API_ENDPOINTS } from '../../config/api';

/**
 * Obține userul curent pe server folosind cookie JWT și backend API.
 * Returnează null dacă nu există autentificare validă.
 */
export async function getServerCurrentUser() {
    const cookieStore = await cookies();
    const token = Array.from(cookieStore).find(([name]) => name === 'token')?.[1]?.value;
    if (!token) return null;
    try {
        const res = await fetch(API_ENDPOINTS.users + '/me', {
            headers: { 'Authorization': `Bearer ${token}` },
            cache: 'no-store',
        });
        if (!res.ok) return null;
        return await res.json();
    } catch {
        return null;
    }
}
