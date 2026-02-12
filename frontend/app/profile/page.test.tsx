import { render, screen } from '@testing-library/react';
import UserProfileClient from '../../components/UserProfileClient';
import { withMockAuthProvider } from '../../tests/context/withMockAuthProvider';

describe('UserProfileClient', () => {
    it('renders user profile for authenticated user', () => {
        render(withMockAuthProvider(
            <UserProfileClient user={{
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
        expect(screen.getByText(/Test User/i)).toBeInTheDocument();
        expect(screen.getByText(/testuser/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /edit profile/i })).toBeInTheDocument();
    });
});
