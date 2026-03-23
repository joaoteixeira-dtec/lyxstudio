import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthState {
  token: string | null;
  isAdmin: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('vanguard-admin-token');
  });

  const isAdmin = !!token;

  useEffect(() => {
    if (token) {
      localStorage.setItem('vanguard-admin-token', token);
    } else {
      localStorage.removeItem('vanguard-admin-token');
    }
  }, [token]);

  const login = (t: string) => setToken(t);
  const logout = () => setToken(null);

  return (
    <AuthContext.Provider value={{ token, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
