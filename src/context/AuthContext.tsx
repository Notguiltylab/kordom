import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import * as authService from '../services/auth';
import type { AppUser } from '../types';

interface AuthContextValue {
  user: AppUser | null;
  login: (email: string, password: string) => AppUser;
  logout: () => void;
  refresh: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(() => authService.getCurrentUser());

  const refresh = useCallback(() => {
    setUser(authService.getCurrentUser());
  }, []);

  const login = useCallback((email: string, password: string) => {
    const u = authService.login(email, password);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, login, logout, refresh }), [user, login, logout, refresh]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
