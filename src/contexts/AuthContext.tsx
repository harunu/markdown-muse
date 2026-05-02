/**
 * Authentication Context Provider
 * Based on 10-frontend-integration.md
 * Updated to use English API response keys
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient, { setTokens, clearTokens, getAccessToken, getRefreshToken } from '@/lib/api-client';
import { User, AuthResponse, LoginRequest } from '@/types/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest, remember?: boolean) => Promise<User>;
  demoLogin: (role?: 'professional' | 'admin' | 'super_admin') => void;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      // Playwright E2E test bypass — window.__PLAYWRIGHT_AUTH_USER set via addInitScript
      const e2eUser = (window as any).__PLAYWRIGHT_AUTH_USER;
      if (e2eUser) {
        setUser(e2eUser);
        setIsLoading(false);
        return;
      }

      const token = getAccessToken();

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await apiClient.get<{ success: boolean; user: User }>('/auth/me');
        if (response.data.success && response.data.user) {
          setUser(response.data.user);
        }
      } catch (error) {
        // Token invalid or expired, clear it
        clearTokens();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (credentials: LoginRequest, remember: boolean = true): Promise<User> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);

    const { access_token, refresh_token, user } = response.data;

    setTokens(access_token, refresh_token, remember);
    setUser(user);
    return user;
  }, []);

  const logout = useCallback(async () => {
    try {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        await apiClient.post('/auth/logout', { refresh_token: refreshToken });
      }
    } catch {
      // Ignore errors during logout
    } finally {
      clearTokens();
      setUser(null);
      navigate('/login');
    }
  }, [navigate]);

  const demoLogin = useCallback((role: 'professional' | 'admin' | 'super_admin' = 'professional') => {
    const demoUser: User = {
      id: 0,
      full_name: 'Demo User',
      email: 'demo@emlak.com',
      role: role,
    };
    setUser(demoUser);
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    demoLogin,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
