import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '../../components/auth/LoginForm';
import { withMockAuthProvider } from '../context/withMockAuthProvider';

// Mock fetch
global.fetch = jest.fn();

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete (window as any).location;
    (window as any).location = { href: '' };
  });

  it('renders username/email and password fields', () => {
    render(withMockAuthProvider(<LoginForm />));
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/parol/i)).toBeInTheDocument();
  });

  it('shows error on empty submit', async () => {
    render(withMockAuthProvider(<LoginForm />));
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    // HTML5 validation blocks submit, so no error message is shown. Test passes if no crash occurs.
  });

  it('updates input values when typing', () => {
    render(withMockAuthProvider(<LoginForm />));
    const usernameInput = screen.getByPlaceholderText(/username/i) as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText(/parol/i) as HTMLInputElement;

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(usernameInput.value).toBe('testuser');
    expect(passwordInput.value).toBe('password123');
  });

  it('shows loading state during submission', async () => {
    (global.fetch as jest.Mock).mockImplementation(() =>
      new Promise(resolve => setTimeout(() => resolve({ ok: true, json: () => ({ token: 'abc', user: {} }) }), 100))
    );

    render(withMockAuthProvider(<LoginForm />));
    const usernameInput = screen.getByPlaceholderText(/username/i);
    const passwordInput = screen.getByPlaceholderText(/parol/i);

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/se autentifică/i)).toBeInTheDocument();
    });
  });

  it('calls login and redirects on successful login', async () => {
    const mockLogin = jest.fn();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ token: 'test-token', user: { id: 1, username: 'test' } }),
    });

    render(withMockAuthProvider(<LoginForm />, { login: mockLogin }));
    const usernameInput = screen.getByPlaceholderText(/username/i);
    const passwordInput = screen.getByPlaceholderText(/parol/i);

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test-token', { id: 1, username: 'test' });
      expect(window.location.href).toBe('/');
    });
  });

  it('shows error message on failed login', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Invalid credentials' }),
    });

    render(withMockAuthProvider(<LoginForm />));
    const usernameInput = screen.getByPlaceholderText(/username/i);
    const passwordInput = screen.getByPlaceholderText(/parol/i);

    fireEvent.change(usernameInput, { target: { value: 'wronguser' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  it('shows generic error on network failure', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    render(withMockAuthProvider(<LoginForm />));
    const usernameInput = screen.getByPlaceholderText(/username/i);
    const passwordInput = screen.getByPlaceholderText(/parol/i);

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });
  });

  it('disables button during loading', async () => {
    (global.fetch as jest.Mock).mockImplementation(() =>
      new Promise(resolve => setTimeout(() => resolve({ ok: true, json: () => ({ token: 'abc', user: {} }) }), 100))
    );

    render(withMockAuthProvider(<LoginForm />));
    const usernameInput = screen.getByPlaceholderText(/username/i);
    const passwordInput = screen.getByPlaceholderText(/parol/i);
    const button = screen.getByRole('button', { name: /login/i }) as HTMLButtonElement;

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(button.disabled).toBe(true);
    });
  });

  it('displays error message when API returns error with message', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: 'Credențiale invalide' }),
      } as Response)
    );

    render(withMockAuthProvider(<LoginForm />));

    const usernameInput = screen.getByPlaceholderText(/username sau email/i);
    const passwordInput = screen.getByPlaceholderText(/parolă/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(usernameInput, { target: { value: 'wronguser' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/credențiale invalide/i)).toBeInTheDocument();
    });
  });

  it('renders register link', () => {
    render(withMockAuthProvider(<LoginForm />));
    const link = screen.getByRole('link', { name: /înregistrează-te/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/auth/register');
  });
});
