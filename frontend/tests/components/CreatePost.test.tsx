import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreatePost from '../CreatePost';

// Mock fetch
global.fetch = jest.fn();

describe('CreatePost', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
        localStorage.setItem('token', 'fake-jwt-token');
    });

    it('renders textarea and submit button', () => {
        render(<CreatePost onPostCreated={() => { }} />);

        expect(screen.getByPlaceholderText(/what's on your mind/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /post/i })).toBeInTheDocument();
    });

    it('renders media URL input field', () => {
        render(<CreatePost onPostCreated={() => { }} />);

        expect(screen.getByPlaceholderText(/media url/i)).toBeInTheDocument();
    });

    it('enables submit button when content is entered', () => {
        render(<CreatePost onPostCreated={() => { }} />);

        const textarea = screen.getByPlaceholderText(/what's on your mind/i);
        const submitButton = screen.getByRole('button', { name: /post/i });

        // Initially disabled
        expect(submitButton).toBeDisabled();

        // Type content
        fireEvent.change(textarea, { target: { value: 'Test post content' } });

        // Now enabled
        expect(submitButton).not.toBeDisabled();
    });

    it('keeps submit button disabled when content is only whitespace', () => {
        render(<CreatePost onPostCreated={() => { }} />);

        const textarea = screen.getByPlaceholderText(/what's on your mind/i);
        const submitButton = screen.getByRole('button', { name: /post/i });

        fireEvent.change(textarea, { target: { value: '   ' } });

        expect(submitButton).toBeDisabled();
    });

    it('displays character count', () => {
        render(<CreatePost onPostCreated={() => { }} />);

        const textarea = screen.getByPlaceholderText(/what's on your mind/i);

        // Initially 0
        expect(screen.getByText(/0/)).toBeInTheDocument();

        // Type content
        fireEvent.change(textarea, { target: { value: 'Hello' } });

        // Should show 5
        expect(screen.getByText(/5/)).toBeInTheDocument();
    });

    it('submits post with content only', async () => {
        const onPostCreated = jest.fn();
        const mockPost = {
            id: 1,
            userId: 1,
            username: 'testuser',
            displayName: 'Test User',
            content: 'Test post content',
            likesCount: 0,
            createdAt: new Date().toISOString(),
        };

        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            status: 201,
            json: async () => mockPost,
        });

        render(<CreatePost onPostCreated={onPostCreated} />);

        const textarea = screen.getByPlaceholderText(/what's on your mind/i);
        const submitButton = screen.getByRole('button', { name: /post/i });

        fireEvent.change(textarea, { target: { value: 'Test post content' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/posts'),
                expect.objectContaining({
                    method: 'POST',
                    headers: expect.objectContaining({
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer fake-jwt-token',
                    }),
                    body: JSON.stringify({
                        content: 'Test post content',
                        mediaUrl: '',
                    }),
                })
            );
            expect(onPostCreated).toHaveBeenCalledWith(mockPost);
        });
    });

    it('submits post with content and media URL', async () => {
        const onPostCreated = jest.fn();
        const mockPost = {
            id: 1,
            userId: 1,
            content: 'Test post with media',
            mediaUrl: 'https://example.com/video.mp4',
            likesCount: 0,
            createdAt: new Date().toISOString(),
        };

        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            status: 201,
            json: async () => mockPost,
        });

        render(<CreatePost onPostCreated={onPostCreated} />);

        const textarea = screen.getByPlaceholderText(/what's on your mind/i);
        const mediaInput = screen.getByPlaceholderText(/media url/i);
        const submitButton = screen.getByRole('button', { name: /post/i });

        fireEvent.change(textarea, { target: { value: 'Test post with media' } });
        fireEvent.change(mediaInput, { target: { value: 'https://example.com/video.mp4' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/posts'),
                expect.objectContaining({
                    body: JSON.stringify({
                        content: 'Test post with media',
                        mediaUrl: 'https://example.com/video.mp4',
                    }),
                })
            );
        });
    });

    it('clears form after successful submission', async () => {
        const onPostCreated = jest.fn();

        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            status: 201,
            json: async () => ({ id: 1, content: 'Test' }),
        });

        render(<CreatePost onPostCreated={onPostCreated} />);

        const textarea = screen.getByPlaceholderText(/what's on your mind/i) as HTMLTextAreaElement;
        const mediaInput = screen.getByPlaceholderText(/media url/i) as HTMLInputElement;
        const submitButton = screen.getByRole('button', { name: /post/i });

        fireEvent.change(textarea, { target: { value: 'Test post' } });
        fireEvent.change(mediaInput, { target: { value: 'https://example.com/video.mp4' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(textarea.value).toBe('');
            expect(mediaInput.value).toBe('');
        });
    });

    it('displays loading state while submitting', async () => {
        (global.fetch as jest.Mock).mockImplementationOnce(
            () => new Promise(resolve => setTimeout(resolve, 100))
        );

        render(<CreatePost onPostCreated={() => { }} />);

        const textarea = screen.getByPlaceholderText(/what's on your mind/i);
        const submitButton = screen.getByRole('button', { name: /post/i });

        fireEvent.change(textarea, { target: { value: 'Test post' } });
        fireEvent.click(submitButton);

        expect(screen.getByText(/posting/i)).toBeInTheDocument();
        expect(submitButton).toBeDisabled();
    });

    it('displays error message on submission failure', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 400,
            json: async () => ({ message: 'Content cannot be empty' }),
        });

        render(<CreatePost onPostCreated={() => { }} />);

        const textarea = screen.getByPlaceholderText(/what's on your mind/i);
        const submitButton = screen.getByRole('button', { name: /post/i });

        fireEvent.change(textarea, { target: { value: 'Test post' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/error|failed/i)).toBeInTheDocument();
        });
    });

    it('allows user to retry after error', async () => {
        (global.fetch as jest.Mock)
            .mockResolvedValueOnce({
                ok: false,
                status: 500,
            })
            .mockResolvedValueOnce({
                ok: true,
                status: 201,
                json: async () => ({ id: 1, content: 'Test' }),
            });

        render(<CreatePost onPostCreated={() => { }} />);

        const textarea = screen.getByPlaceholderText(/what's on your mind/i);
        const submitButton = screen.getByRole('button', { name: /post/i });

        // First attempt - fails
        fireEvent.change(textarea, { target: { value: 'Test post' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/error|failed/i)).toBeInTheDocument();
        });

        // Second attempt - succeeds
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.queryByText(/error|failed/i)).not.toBeInTheDocument();
        });
    });
});
