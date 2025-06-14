
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'master' | 'candidato' | 'votante';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default users for demo purposes
const defaultUsers: User[] = [
  {
    id: '1',
    email: 'master@micampaña.com',
    name: 'Usuario Master',
    role: 'master'
  },
  {
    id: '2',
    email: 'candidato@micampaña.com',
    name: 'Usuario Candidato',
    role: 'candidato'
  },
  {
    id: '3',
    email: 'votante@micampaña.com',
    name: 'Usuario Votante',
    role: 'votante'
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Demo login - in real app this would be Firebase Auth
    if (password === 'micampaña2025') {
      const foundUser = defaultUsers.find(u => u.email === email);
      if (foundUser) {
        setUser(foundUser);
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
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
