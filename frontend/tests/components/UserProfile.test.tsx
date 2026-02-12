
import { render, screen } from '@testing-library/react';
import UserProfile from '../../components/UserProfile';
import { withMockAuthProvider } from '../context/withMockAuthProvider';

describe('UserProfile', () => {
    it('renders user profile info', () => {
        render(withMockAuthProvider(
            <UserProfile user={{
                id: 1,
                username: 'testuser',
                displayName: 'Test User',
                email: 'test@email.com',
                bio: 'This is my bio',
                avatarUrl: '/avatar.png',
                theme: 'dark',
                createdAt: '2026-02-11',
            }} />, {
            user: {
                id: 1,
                username: 'testuser',
                displayName: 'Test User',
                email: 'test@email.com',
                createdAt: '2026-02-11',
            },
            token: 'mock-token',
        }
        ));
        expect(screen.getByText(/Test User/i)).toBeInTheDocument();
        expect(screen.getByText(/This is my bio/i)).toBeInTheDocument();
        expect(screen.getByAltText(/avatar/i)).toBeInTheDocument();
    });

    it('shows Edit Profile button only for own profile', () => {
        render(withMockAuthProvider(
            <UserProfile user={{
                id: 1,
                username: 'testuser',
                displayName: 'Test User',
                email: 'test@email.com',
                createdAt: '2026-02-11',
            }} />, {
            user: {
                id: 1,
                username: 'testuser',
                displayName: 'Test User',
                email: 'test@email.com',
                createdAt: '2026-02-11',
            },
            token: 'mock-token',
        }
        ));
        expect(screen.getByRole('button', { name: /edit profile/i })).toBeInTheDocument();
    });

    it('does not show Edit Profile button for other profiles', () => {
        render(withMockAuthProvider(
            <UserProfile user={{
                id: 2,
                username: 'otheruser',
                displayName: 'Other User',
                email: 'other@email.com',
                createdAt: '2026-02-11',
            }} />, {
            user: {
                id: 1,
                username: 'testuser',
                displayName: 'Test User',
                email: 'test@email.com',
                createdAt: '2026-02-11',
            },
            token: 'mock-token',
        }
        ));
        expect(screen.queryByRole('button', { name: /edit profile/i })).not.toBeInTheDocument();
    });
});
