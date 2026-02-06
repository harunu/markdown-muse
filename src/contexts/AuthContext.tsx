/**
 * Authentication Context Provider
 * Based on 10-frontend-integration.md
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient, { setTokens, clearTokens, getAccessToken } from '@/lib/api-client';
import { Kullanici, AuthResponse, LoginRequest } from '@/types/api';

interface AuthContextType {
  user: Kullanici | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest, remember?: boolean) => Promise<Kullanici>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<Kullanici>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Kullanici | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = getAccessToken();

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await apiClient.get<{ basarili: boolean; kullanici: Kullanici }>('/auth/me');
        if (response.data.basarili && response.data.kullanici) {
          setUser(response.data.kullanici);
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

  const login = useCallback(async (credentials: LoginRequest, remember: boolean = true): Promise<Kullanici> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);

    const { access_token, refresh_token, kullanici } = response.data;

    setTokens(access_token, refresh_token, remember);
    setUser(kullanici);
    return kullanici;
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Ignore errors during logout
    } finally {
      clearTokens();
      setUser(null);
      navigate('/login');
    }
  }, [navigate]);

  const updateUser = useCallback((updates: Partial<Kullanici>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
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
