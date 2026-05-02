import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Login from '../../pages/Login';
import AuthContext from '../../contexts/AuthContext';

// Mock navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockLogin = vi.fn();

const authContextValue = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: mockLogin,
  demoLogin: vi.fn(),
  logout: vi.fn(),
  updateUser: vi.fn(),
};

const renderLogin = () =>
  render(
    <MemoryRouter>
      <AuthContext.Provider value={authContextValue}>
        <Login />
      </AuthContext.Provider>
    </MemoryRouter>
  );

describe('Login page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders email and password fields', () => {
    renderLogin();
    expect(screen.getByLabelText(/e-posta/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/şifre/i)).toBeInTheDocument();
  });

  test('shows error when submitting with empty fields', async () => {
    renderLogin();
    fireEvent.click(screen.getByRole('button', { name: /giriş yap/i }));
    await waitFor(() => {
      expect(screen.getByText(/lütfen e-posta ve şifre giriniz/i)).toBeInTheDocument();
    });
  });

  test('calls login with email and password on submit', async () => {
    mockLogin.mockResolvedValueOnce({ id: 1, role: 'professional', email: 'test@test.com', full_name: 'Test' });
    renderLogin();
    fireEvent.change(screen.getByLabelText(/e-posta/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText(/şifre/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /giriş yap/i }));
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({ email: 'test@test.com', password: 'password123' }, false);
    });
  });

  test('shows error message from API on failed login', async () => {
    const axiosError = {
      response: { data: { message: 'Invalid email or password.' } },
    };
    mockLogin.mockRejectedValueOnce(axiosError);
    renderLogin();
    fireEvent.change(screen.getByLabelText(/e-posta/i), { target: { value: 'wrong@test.com' } });
    fireEvent.change(screen.getByLabelText(/şifre/i), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByRole('button', { name: /giriş yap/i }));
    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
    });
  });
});
