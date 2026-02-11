import { render, screen, waitFor, renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth, AuthContext } from '../../context/AuthContext';

describe('AuthContext', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('provides initial null user and token', () => {
        const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
        expect(result.current.user).toBeNull();
        expect(result.current.token).toBeNull();
    });

    it('restores user and token from localStorage on mount', async () => {
        const mockUser = { id: 1, username: 'test', email: 'test@test.com', displayName: 'Test User', createdAt: '2024-01-01' };
        localStorage.setItem('token', 'stored-token');
        localStorage.setItem('user', JSON.stringify(mockUser));

        const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

        await waitFor(() => {
            expect(result.current.token).toBe('stored-token');
            expect(result.current.user).toEqual(mockUser);
        });
    });

    it('login sets user and token in state and localStorage', () => {
        const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
        const mockUser = { id: 2, username: 'newuser', email: 'new@test.com', displayName: 'New User', createdAt: '2024-01-01' };

        act(() => {
            result.current.login('new-token', mockUser);
        });

        expect(result.current.token).toBe('new-token');
        expect(result.current.user).toEqual(mockUser);
        expect(localStorage.getItem('token')).toBe('new-token');
        expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser));
    });

    it('logout clears user and token from state and localStorage', () => {
        const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
        const mockUser = { id: 3, username: 'logout', email: 'logout@test.com', displayName: 'Logout User', createdAt: '2024-01-01' };

        act(() => {
            result.current.login('logout-token', mockUser);
        });

        expect(result.current.token).toBe('logout-token');
        expect(result.current.user).toEqual(mockUser);

        act(() => {
            result.current.logout();
        });

        expect(result.current.token).toBeNull();
        expect(result.current.user).toBeNull();
        expect(localStorage.getItem('token')).toBeNull();
        expect(localStorage.getItem('user')).toBeNull();
    });

    it('throws error when useAuth is used outside AuthProvider', () => {
        // Suppress console.error for this test
        const originalError = console.error;
        console.error = jest.fn();

        expect(() => {
            renderHook(() => useAuth());
        }).toThrow('useAuth must be used within an AuthProvider');

        console.error = originalError;
    });

    it('handles invalid JSON in localStorage', () => {
        localStorage.setItem('token', 'valid-token');
        localStorage.setItem('user', 'invalid-json{');

        // Should not crash, but won't restore user
        const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

        // AuthContext should handle invalid JSON gracefully by not restoring user
        expect(result.current.user).toBeNull();
    });

    it('provides correct context value to children', () => {
        const TestComponent = () => {
            const { user, token, login, logout } = useAuth();
            return (
                <div>
                    <div data-testid="user">{user ? user.username : 'null'}</div>
                    <div data-testid="token">{token || 'null'}</div>
                    <button onClick={() => login('test-token', { id: 1, username: 'test', email: 'test@test.com', displayName: 'Test', createdAt: '2024-01-01' })}>
                        Login
                    </button>
                    <button onClick={logout}>Logout</button>
                </div>
            );
        };

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        expect(screen.getByTestId('user')).toHaveTextContent('null');
        expect(screen.getByTestId('token')).toHaveTextContent('null');
    });
});
