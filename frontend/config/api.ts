/**
 * Configurare API - URL-ul backend-ului
 * În development, backend-ul rulează pe http://localhost:5000
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  users: `${API_BASE_URL}/api/users`,
  userDetail: (id: number) => `${API_BASE_URL}/api/users/${id}`,
  health: `${API_BASE_URL}/api/health`,
  messages: {
    send: `${API_BASE_URL}/api/messages`,
    conversations: `${API_BASE_URL}/api/messages/conversations`,
    withUser: (userId: number) => `${API_BASE_URL}/api/messages/${userId}`,
  },
  follows: {
    follow: (userId: number) => `${API_BASE_URL}/api/follows/${userId}`,
    unfollow: (userId: number) => `${API_BASE_URL}/api/follows/${userId}`,
    isFollowing: (followerId: number, followedId: number) =>
      `${API_BASE_URL}/api/follows/is-following?followerId=${followerId}&followedId=${followedId}`,
    stats: (userId: number) => `${API_BASE_URL}/api/follows/stats/${userId}`,
    followers: (userId: number) => `${API_BASE_URL}/api/follows/followers/${userId}`,
    following: (userId: number) => `${API_BASE_URL}/api/follows/following/${userId}`,
  },
  posts: {
    create: `${API_BASE_URL}/api/posts`,
    feed: (skip = 0, take = 20) => `${API_BASE_URL}/api/posts/feed?skip=${skip}&take=${take}`,
    byId: (postId: number) => `${API_BASE_URL}/api/posts/${postId}`,
    byUser: (userId: number, skip = 0, take = 20) =>
      `${API_BASE_URL}/api/posts/user/${userId}?skip=${skip}&take=${take}`,
    delete: (postId: number) => `${API_BASE_URL}/api/posts/${postId}`,
  },
};


/**
 * Returnează user-ul curent din localStorage (CSR) sau undefined dacă nu e autentificat.
 * Pentru SSR, va trebui adaptat la infrastructura reală (cookie/jwt etc).
 */
export async function getCurrentUser() {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return undefined;
      }
    }
  }
  // SSR: fallback mock (ar trebui înlocuit cu fetch la backend sau cookies)
  return undefined;
}

export default API_BASE_URL;
