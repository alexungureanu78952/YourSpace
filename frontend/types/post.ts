/**
 * Post-related TypeScript types
 */

export interface Post {
    id: number;
    userId: number;
    username: string;
    displayName: string;
    avatarUrl?: string;
    content: string;
    mediaUrl?: string;
    likesCount: number;
    createdAt: string;
}

export interface FeedPost extends Post {
    isFollowing: boolean;
}

export interface CreatePostDto {
    content: string;
    mediaUrl?: string;
}
