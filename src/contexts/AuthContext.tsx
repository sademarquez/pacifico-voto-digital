
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

// Demo users with functional credentials - usando emails simples sin caracteres especiales
const demoUsers: User[] = [
  {
    id: '1',
    email: 'master@demo.com',
    name: 'Usuario Master',
    role: 'master'
  },
  {
    id: '2',
    email: 'candidato@demo.com',
    name: 'Usuario Candidato',
    role: 'candidato'
  },
  {
    id: '3',
    email: 'votante@demo.com',
    name: 'Usuario Votante',
    role: 'votante'
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('Attempting login with:', email, password);
    
    // Check if password is correct
    if (password !== 'demo2025') {
      console.log('Invalid password');
      return false;
    }

    // Find user by email (case insensitive and trim whitespace)
    const foundUser = demoUsers.find(u => 
      u.email.toLowerCase().trim() === email.toLowerCase().trim()
    );
    
    if (foundUser) {
      console.log('User found:', foundUser);
      setUser(foundUser);
      return true;
    }
    
    console.log('User not found for email:', email);
    console.log('Available emails:', demoUsers.map(u => u.email));
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
