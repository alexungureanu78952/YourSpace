import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PostCard from '../PostCard';
import { FeedPost } from '@/types/post';

// Mock fetch
global.fetch = jest.fn();

// Mock useRouter
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

describe('PostCard', () => {
    const mockPost: FeedPost = {
        id: 1,
        userId: 2,
        username: 'testuser',
        displayName: 'Test User',
        avatarUrl: 'https://example.com/avatar.jpg',
        content: 'This is a test post',
        likesCount: 5,
        createdAt: '2024-02-15T12:00:00Z',
        isFollowing: true,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
        localStorage.setItem('token', 'fake-jwt-token');
    });

    it('renders post content correctly', () => {
        render(<PostCard post={mockPost} />);

        expect(screen.getByText('This is a test post')).toBeInTheDocument();
        expect(screen.getByText('Test User')).toBeInTheDocument();
        expect(screen.getByText('@testuser')).toBeInTheDocument();
    });

    it('displays (Following) indicator when isFollowing is true', () => {
        render(<PostCard post={mockPost} />);

        expect(screen.getByText('(Following)')).toBeInTheDocument();
    });

    it('does not display (Following) indicator when isFollowing is false', () => {
        const nonFollowedPost = { ...mockPost, isFollowing: false };
        render(<PostCard post={nonFollowedPost} />);

        expect(screen.queryByText('(Following)')).not.toBeInTheDocument();
    });

    it('displays avatar image when avatarUrl is provided', () => {
        render(<PostCard post={mockPost} />);

        const avatar = screen.getByRole('img', { name: /Test User/i });
        expect(avatar).toBeInTheDocument();
        expect(avatar).toHaveAttribute('src', expect.stringContaining('avatar.jpg'));
    });

    it('displays default avatar icon when avatarUrl is not provided', () => {
        const postWithoutAvatar = { ...mockPost, avatarUrl: undefined };
        render(<PostCard post={postWithoutAvatar} />);

        // Should render UserCircleIcon or similar fallback
        expect(screen.getByTestId('default-avatar')).toBeInTheDocument();
    });

    it('displays media when mediaUrl is provided', () => {
        const postWithMedia = {
            ...mockPost,
            mediaUrl: 'https://example.com/video.mp4',
        };
        render(<PostCard post={postWithMedia} />);

        const media = screen.getByTestId('post-media');
        expect(media).toBeInTheDocument();
    });

    it('does not display media section when mediaUrl is not provided', () => {
        render(<PostCard post={mockPost} />);

        expect(screen.queryByTestId('post-media')).not.toBeInTheDocument();
    });

    it('displays formatted timestamp', () => {
        render(<PostCard post={mockPost} />);

        // Should display something like "Feb 15, 2024" or "2 hours ago"
        expect(screen.getByText(/Feb|hour|day/i)).toBeInTheDocument();
    });

    it('displays likes count', () => {
        render(<PostCard post={mockPost} />);

        expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('navigates to user profile when clicking on username', () => {
        const { push } = require('next/navigation').useRouter();
        render(<PostCard post={mockPost} />);

        const username = screen.getByText('@testuser');
        fireEvent.click(username);

        expect(push).toHaveBeenCalledWith('/profile/2');
    });

    it('shows delete button for own posts', () => {
        localStorage.setItem('user', JSON.stringify({ id: 2 }));
        render(<PostCard post={mockPost} currentUserId={2} />);

        expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    });

    it('does not show delete button for other users posts', () => {
        localStorage.setItem('user', JSON.stringify({ id: 999 }));
        render(<PostCard post={mockPost} currentUserId={999} />);

        expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
    });

    it('calls delete API when delete button is clicked', async () => {
        const onDelete = jest.fn();
        localStorage.setItem('user', JSON.stringify({ id: 2 }));

        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            status: 204,
        });

        render(<PostCard post={mockPost} currentUserId={2} onDelete={onDelete} />);

        const deleteButton = screen.getByRole('button', { name: /delete/i });
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/posts/1'),
                expect.objectContaining({
                    method: 'DELETE',
                    headers: expect.objectContaining({
                        Authorization: 'Bearer fake-jwt-token',
                    }),
                })
            );
            expect(onDelete).toHaveBeenCalledWith(1);
        });
    });

    it('handles delete error gracefully', async () => {
        localStorage.setItem('user', JSON.stringify({ id: 2 }));

        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 403,
            json: async () => ({ message: 'Unauthorized' }),
        });

        render(<PostCard post={mockPost} currentUserId={2} />);

        const deleteButton = screen.getByRole('button', { name: /delete/i });
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(screen.getByText(/error|failed/i)).toBeInTheDocument();
        });
    });
});
