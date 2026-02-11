import { render, screen } from '@testing-library/react';
import UserMenu from '../../components/auth/UserMenu';
import { MockAuthProvider } from '../context/MockAuthProvider';

const withMockAuth = (children: React.ReactElement, user: any = null, token: string | null = null) => (
  <MockAuthProvider initialUser={user} initialToken={token}>
    {children}
  </MockAuthProvider>
);

describe('UserMenu', () => {
  it('returns null when no user is logged in', () => {
    const { container } = render(withMockAuth(<UserMenu />));
    expect(container.firstChild).toBeNull();
  });

  it('displays displayName when logged in with displayName', () => {
    const user = { id: 1, username: 'john', email: 'j@test.com', displayName: 'John Doe', createdAt: '2024-01-01' };
    render(withMockAuth(<UserMenu />, user, 'token'));
    expect(screen.getByText(/Salut, John Doe!/i)).toBeInTheDocument();
  });

  it('displays username when displayName is empty', () => {
    const user = { id: 1, username: 'john', email: 'j@test.com', displayName: '', createdAt: '2024-01-01' };
    render(withMockAuth(<UserMenu />, user, 'token'));
    expect(screen.getByText(/Salut, john!/i)).toBeInTheDocument();
  });
});
