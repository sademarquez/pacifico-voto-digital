
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
  authError: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      setAuthError("Fallo la conexión con el backend (Supabase). Revisa la consola del navegador para más detalles.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const supabaseUser = session?.user ?? null;
        if (supabaseUser) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('id, name, role')
            .eq('id', supabaseUser.id)
            .single();
          
          if (error && error.code !== 'PGRST116') {
            console.error("Error fetching profile:", error);
            setAuthError("Error al cargar el perfil de usuario.");
            setUser(null);
          } else if (profile) {
            setUser({
              id: profile.id,
              name: profile.name || supabaseUser.email || 'Usuario',
              role: profile.role as User['role'],
              email: supabaseUser.email || '',
            });
          } else {
             // This can happen if the user existed before the profiles table/trigger was created
            console.warn("No profile found for user, signing them out.");
            await supabase.auth.signOut();
            setUser(null);
          }
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    if (!supabase) {
      setAuthError("No se puede iniciar sesión. La conexión con el backend no está disponible.");
      console.error('Error de login: Supabase client no está inicializado.');
      return false;
    }

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
    if (!supabase) {
      setAuthError("No se puede cerrar sesión. La conexión con el backend no está disponible.");
      console.error('Error de logout: Supabase client no está inicializado.');
      return;
    }
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
    isLoading,
    authError,
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
