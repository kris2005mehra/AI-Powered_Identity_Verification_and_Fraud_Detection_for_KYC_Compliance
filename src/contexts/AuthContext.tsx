import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  email: string;
  role: 'user' | 'admin';
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('verifix_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    if (email === 'admin@verifix.com' && password === 'admin123') {
      const adminUser = { email, role: 'admin' as const, name: 'Admin User' };
      setUser(adminUser);
      localStorage.setItem('verifix_user', JSON.stringify(adminUser));
      return true;
    } else if (email === 'user@test.com' && password === 'user123') {
      const normalUser = { email, role: 'user' as const, name: 'Test User' };
      setUser(normalUser);
      localStorage.setItem('verifix_user', JSON.stringify(normalUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('verifix_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
