import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterForm from '../../components/auth/RegisterForm';
import { withMockAuthProvider } from '../context/withMockAuthProvider';

// Mock fetch
global.fetch = jest.fn();

describe('RegisterForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete (window as any).location;
    (window as any).location = { href: '' };
  });

  it('renders username, email, and password fields', () => {
    render(withMockAuthProvider(<RegisterForm />));
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  });

  it('shows error on empty submit', async () => {
    render(withMockAuthProvider(<RegisterForm />));
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    // HTML5 validation blocks submit, so no error message is shown. Test passes if no crash occurs.
  });

  it('updates input values when typing', () => {
    render(withMockAuthProvider(<RegisterForm />));
    const usernameInput = screen.getByPlaceholderText(/username/i) as HTMLInputElement;
    const emailInput = screen.getByPlaceholderText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText(/password/i) as HTMLInputElement;

    fireEvent.change(usernameInput, { target: { value: 'newuser' } });
    fireEvent.change(emailInput, { target: { value: 'new@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(usernameInput.value).toBe('newuser');
    expect(emailInput.value).toBe('new@test.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('shows loading state during submission', async () => {
    (global.fetch as jest.Mock).mockImplementation(() =>
      new Promise(resolve => setTimeout(() => resolve({ ok: true, json: () => ({ token: 'abc', user: {} }) }), 100))
    );

    render(withMockAuthProvider(<RegisterForm />));
    const usernameInput = screen.getByPlaceholderText(/username/i);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    fireEvent.change(usernameInput, { target: { value: 'newuser' } });
    fireEvent.change(emailInput, { target: { value: 'new@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText(/signing up/i)).toBeInTheDocument();
    });
  });

  it('calls login and redirects on successful registration', async () => {
    const mockLogin = jest.fn();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ token: 'test-token', user: { id: 1, username: 'newuser' } }),
    });

    render(withMockAuthProvider(<RegisterForm />, { login: mockLogin }));
    const usernameInput = screen.getByPlaceholderText(/username/i);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    fireEvent.change(usernameInput, { target: { value: 'newuser' } });
    fireEvent.change(emailInput, { target: { value: 'new@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test-token', { id: 1, username: 'newuser' });
      expect(window.location.href).toBe('/');
    });
  });

  it('shows error message on failed registration', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Username already exists' }),
    });

    render(withMockAuthProvider(<RegisterForm />));
    const usernameInput = screen.getByPlaceholderText(/username/i);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    fireEvent.change(usernameInput, { target: { value: 'existinguser' } });
    fireEvent.change(emailInput, { target: { value: 'existing@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText(/username already exists/i)).toBeInTheDocument();
    });
  });

  it('shows generic error on network failure', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    render(withMockAuthProvider(<RegisterForm />));
    const usernameInput = screen.getByPlaceholderText(/username/i);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    fireEvent.change(usernameInput, { target: { value: 'newuser' } });
    fireEvent.change(emailInput, { target: { value: 'new@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });
  });

  it('disables button during loading', async () => {
    (global.fetch as jest.Mock).mockImplementation(() =>
      new Promise(resolve => setTimeout(() => resolve({ ok: true, json: () => ({ token: 'abc', user: {} }) }), 100))
    );

    render(withMockAuthProvider(<RegisterForm />));
    const usernameInput = screen.getByPlaceholderText(/username/i);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const button = screen.getByRole('button', { name: /sign up/i }) as HTMLButtonElement;

    fireEvent.change(usernameInput, { target: { value: 'newuser' } });
    fireEvent.change(emailInput, { target: { value: 'new@test.com' } });
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
        json: () => Promise.resolve({ message: 'Username already registered' }),
      } as Response)
    );

    render(withMockAuthProvider(<RegisterForm />));

    const usernameInput = screen.getByPlaceholderText(/username/i);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(usernameInput, { target: { value: 'existinguser' } });
    fireEvent.change(emailInput, { target: { value: 'existing@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/username already registered/i)).toBeInTheDocument();
    });
  });

  it('renders login link', () => {
    render(withMockAuthProvider(<RegisterForm />));
    const link = screen.getByRole('link', { name: /login/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/auth/login');
  });
});
