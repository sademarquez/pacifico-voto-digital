
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User as SupabaseUser } from '@supabase/supabase-js';

// Nuestra interfaz de usuario personalizada, que incluye el rol y el nombre.
interface User {
  id: string;
  email: string;
  name: string;
  role: 'master' | 'candidato' | 'votante';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password:string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// NOTA: Los perfiles de usuario con roles aún no se guardan en la base de datos.
// Esta es una función temporal para crear un perfil para la UI.
// En el siguiente paso, crearemos una tabla `profiles` en Supabase para almacenar estos datos.
const createTemporaryUserProfile = (supabaseUser: SupabaseUser): User => {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    // Por ahora, el nombre será el email y el rol será 'votante' para evitar que la UI se rompa.
    name: supabaseUser.email || 'Usuario',
    role: 'votante' 
  };
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const supabaseUser = session?.user ?? null;
        if (supabaseUser) {
          // En el futuro, aquí obtendremos el perfil de la base de datos.
          // Por ahora, creamos uno temporal.
          const userProfile = createTemporaryUserProfile(supabaseUser);
          setUser(userProfile);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Error de login en Supabase:', error.message);
      return false;
    }
    
    return true;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error de logout en Supabase:', error.message);
    }
    // El listener onAuthStateChange se encargará de poner el user a null.
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading
  };

  // No renderizar los componentes hijos hasta que sepamos el estado de autenticación.
  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

