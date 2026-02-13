import { render, screen } from '@testing-library/react';
import Navbar from '../../components/Navbar';
import { withMockAuthProvider } from '../context/withMockAuthProvider';

describe('Navbar', () => {
  it('renders logo and navigation', () => {
    render(withMockAuthProvider(<Navbar />));
    expect(screen.getByText(/yourspace/i)).toBeInTheDocument();
  });

  describe('Navbar authentication states', () => {
    it('shows Login/Register when not authenticated', () => {
      render(withMockAuthProvider(<Navbar />, { user: null, token: null }));
      expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /register/i })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /my profile/i })).not.toBeInTheDocument();
    });

    it('shows only Profile button when authenticated', () => {
      render(withMockAuthProvider(<Navbar />, {
        user: {
          id: 1,
          username: 'testuser',
          displayName: 'Test User',
          email: 'test@email.com',
          createdAt: '2026-02-11',
        },
        token: 'mock-token',
      }));
      expect(screen.getByRole('button', { name: /my profile/i })).toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /login/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /register/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /edit profile/i })).not.toBeInTheDocument();
    });
  });
});
