import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FollowButton from './FollowButton';

describe('FollowButton', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Mock localStorage
        Storage.prototype.getItem = jest.fn((key) => {
            if (key === 'token') return 'mock-token';
            return null;
        });
    });

    it('does not render when currentUserId is null', () => {
        const { container } = render(
            <FollowButton targetUserId={2} currentUserId={null} />
        );
        expect(container.firstChild).toBeNull();
    });

    it('does not render when viewing own profile', () => {
        const { container } = render(
            <FollowButton targetUserId={1} currentUserId={1} />
        );
        expect(container.firstChild).toBeNull();
    });

    it('renders Follow button when not following', async () => {
        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: true,
            json: async () => ({ isFollowing: false })
        });

        render(<FollowButton targetUserId={2} currentUserId={1} />);

        await waitFor(() => {
            const button = screen.getByRole('button');
            expect(button).toHaveTextContent('Follow');
        });
    });

    it('renders Unfollow button when already following', async () => {
        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: true,
            json: async () => ({ isFollowing: true })
        });

        render(<FollowButton targetUserId={2} currentUserId={1} />);

        await waitFor(() => {
            const button = screen.getByRole('button');
            expect(button).toHaveTextContent('Unfollow');
        });
    });

    it('calls follow API when Follow button is clicked', async () => {
        const mockFetch = jest.fn()
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ isFollowing: false })
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({})
            });

        global.fetch = mockFetch;

        render(<FollowButton targetUserId={2} currentUserId={1} />);

        await waitFor(() => screen.getByRole('button'));

        const button = screen.getByRole('button');
        fireEvent.click(button);

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith(
                'http://localhost:5000/api/follows/2',
                expect.objectContaining({
                    method: 'POST',
                    headers: expect.objectContaining({
                        'Authorization': 'Bearer mock-token'
                    })
                })
            );
        });
    });

    it('calls unfollow API when Unfollow button is clicked', async () => {
        const mockFetch = jest.fn()
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ isFollowing: true })
            })
            .mockResolvedValueOnce({
                ok: true
            });

        global.fetch = mockFetch;

        render(<FollowButton targetUserId={2} currentUserId={1} />);

        await waitFor(() => screen.getByRole('button'));

        const button = screen.getByRole('button');
        fireEvent.click(button);

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith(
                'http://localhost:5000/api/follows/2',
                expect.objectContaining({
                    method: 'DELETE',
                    headers: expect.objectContaining({
                        'Authorization': 'Bearer mock-token'
                    })
                })
            );
        });
    });

    it('changes button text from Follow to Unfollow after successful follow', async () => {
        const mockFetch = jest.fn()
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ isFollowing: false })
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({})
            });

        global.fetch = mockFetch;

        render(<FollowButton targetUserId={2} currentUserId={1} />);

        await waitFor(() => screen.getByRole('button'));

        const button = screen.getByRole('button');
        expect(button).toHaveTextContent('Follow');

        fireEvent.click(button);

        await waitFor(() => {
            expect(button).toHaveTextContent('Unfollow');
        });
    });

    it('displays error message when follow fails', async () => {
        const mockFetch = jest.fn()
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ isFollowing: false })
            })
            .mockResolvedValueOnce({
                ok: false,
                json: async () => ({ message: 'Follow failed' })
            });

        global.fetch = mockFetch;

        render(<FollowButton targetUserId={2} currentUserId={1} />);

        await waitFor(() => screen.getByRole('button'));

        const button = screen.getByRole('button');
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.getByText('Follow failed')).toBeInTheDocument();
        });
    });

    it('calls onFollowChange callback when follow status changes', async () => {
        const mockCallback = jest.fn();
        const mockFetch = jest.fn()
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ isFollowing: false })
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({})
            });

        global.fetch = mockFetch;

        render(<FollowButton targetUserId={2} currentUserId={1} onFollowChange={mockCallback} />);

        await waitFor(() => screen.getByRole('button'));

        const button = screen.getByRole('button');
        fireEvent.click(button);

        await waitFor(() => {
            expect(mockCallback).toHaveBeenCalledWith(true);
        });
    });

    it('disables button while loading', async () => {
        const mockFetch = jest.fn()
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ isFollowing: false })
            })
            .mockImplementationOnce(() => new Promise(() => { })); // Never resolves

        global.fetch = mockFetch;

        render(<FollowButton targetUserId={2} currentUserId={1} />);

        await waitFor(() => screen.getByRole('button'));

        const button = screen.getByRole('button');
        fireEvent.click(button);

        await waitFor(() => {
            expect(button).toBeDisabled();
            expect(button).toHaveTextContent('Loading...');
        });
    });
});
