import React, { createContext, useContext, useState } from 'react';
import { User } from '../../types';
import { apiFetch } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = async (email: string, pass: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const data = await apiFetch('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password: pass }),
      });

      if (data.access_token && data.user) {
        setToken(data.access_token);
        setUser({
          id: String(data.user.id),
          name: data.user.name,
          email: data.user.email,
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
          role: data.user.role || 'Customer',
        });
        return { success: true };
      }
      return { success: false, message: 'Invalid response from server' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Login failed' };
    }
  };

  const register = async (name: string, email: string, pass: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const data = await apiFetch('/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password: pass }),
      });

      if (data.access_token && data.user) {
        setToken(data.access_token);
        setUser({
          id: String(data.user.id),
          name: data.user.name,
          email: data.user.email,
          avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
          role: data.user.role || 'Customer',
        });
        return { success: true };
      }
      return { success: false, message: 'Invalid response from server' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    if (token) {
      try {
        await apiFetch('/logout', { method: 'POST' }, token);
      } catch (err) {
        // Ignore logout network errors
      }
    }
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
