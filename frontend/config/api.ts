/**
 * Configurare API - URL-ul backend-ului
 * În development, backend-ul rulează pe http://localhost:5000
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  users: `${API_BASE_URL}/api/users`,
  userDetail: (id: number) => `${API_BASE_URL}/api/users/${id}`,
  health: `${API_BASE_URL}/api/health`,
};

export default API_BASE_URL;
