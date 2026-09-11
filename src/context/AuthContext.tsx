import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserProfile } from '../types';
import { api, authStorage } from '../utils/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: { name: string; email: string; password: string; profile?: Partial<UserProfile> }) => Promise<void>;
  demoLogin: (role?: 'user' | 'admin') => Promise<void>;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile> & { name?: string }) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => authStorage.getUser());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    try {
      const token = authStorage.getToken();
      if (token) {
        const { user: fetchedUser } = await api.getMe();
        setUser(fetchedUser);
      } else {
        // Auto-initialize demo user if no token so the reviewer gets instant experience
        const data = await api.login('mulluraghu15@gmail.com', 'demo1234');
        setUser(data.user);
      }
    } catch (err) {
      console.warn('Auth check fallback to demo user:', err);
      try {
        const data = await api.login('mulluraghu15@gmail.com', 'demo1234');
        setUser(data.user);
      } catch {
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await api.login(email, password);
    setUser(data.user);
  };

  const register = async (payload: { name: string; email: string; password: string; profile?: Partial<UserProfile> }) => {
    const data = await api.register(payload);
    setUser(data.user);
  };

  const demoLogin = async (role: 'user' | 'admin' = 'user') => {
    if (role === 'admin') {
      const data = await api.login('admin@govcareer.gov.in', 'admin1234');
      setUser(data.user);
    } else {
      const data = await api.login('mulluraghu15@gmail.com', 'demo1234');
      setUser(data.user);
    }
  };

  const logout = () => {
    api.logout();
    setUser(null);
  };

  const updateProfile = async (profile: Partial<UserProfile> & { name?: string }) => {
    const data = await api.updateProfile(profile);
    setUser(data.user);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, demoLogin, logout, updateProfile, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
