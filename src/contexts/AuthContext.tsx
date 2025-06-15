import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User as SupabaseUser } from '@supabase/supabase-js';

// Nueva interfaz de usuario con la jerarquía actualizada
interface User {
  id: string;
  email: string;
  name: string;
  role: 'desarrollador' | 'master' | 'candidato' | 'lider' | 'votante';
  created_by?: string | null;
}

interface AuthContextType {
  user: User | null;
  login: (nameOrEmail: string, password:string) => Promise<boolean>;
  logout: () => Promise<void>;
  signUp: (email: string, password: string, name: string, role: string) => Promise<boolean>;
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
        console.log('Auth state change:', event, session?.user?.email);
        
        const supabaseUser = session?.user ?? null;
        if (supabaseUser) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('id, name, role, created_by')
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
              created_by: profile.created_by
            });
            setAuthError(null);
          } else {
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

  const login = async (nameOrEmail: string, password: string): Promise<boolean> => {
    if (!supabase) {
      setAuthError("No se puede iniciar sesión. La conexión con el backend no está disponible.");
      console.error('Error de login: Supabase client no está inicializado.');
      return false;
    }

    console.log('Intentando login con:', nameOrEmail);
    setAuthError(null);
    
    let email = nameOrEmail;
    
    // Si no contiene @, buscar el email por nombre
    if (!nameOrEmail.includes('@')) {
      console.log('Buscando email por nombre:', nameOrEmail);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('name', nameOrEmail)
        .single();
      
      if (error || !profile) {
        console.error('Usuario no encontrado por nombre:', nameOrEmail);
        setAuthError(`Usuario "${nameOrEmail}" no encontrado`);
        return false;
      }
      
      // Obtener el email del usuario desde auth.users
      const { data: { user: authUser }, error: authError } = await supabase.auth.admin.getUserById(profile.id);
      
      if (authError || !authUser) {
        console.error('Error obteniendo datos de auth:', authError);
        setAuthError('Error al obtener datos de autenticación');
        return false;
      }
      
      email = authUser.email || '';
      console.log('Email encontrado:', email);
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password,
    });
    
    if (error) {
      console.error('Error de login en Supabase:', error.message);
      setAuthError(`Error de login: ${error.message}`);
      return false;
    }
    
    console.log('Login exitoso para:', nameOrEmail);
    return true;
  };

  const signUp = async (email: string, password: string, name: string, role: string): Promise<boolean> => {
    if (!supabase) {
      setAuthError("No se puede registrar usuario. La conexión con el backend no está disponible.");
      console.error('Error de signup: Supabase client no está inicializado.');
      return false;
    }

    console.log('Intentando crear usuario:', email, 'con rol:', role);
    setAuthError(null);
    
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password,
      options: {
        data: {
          name: name,
          role: role
        }
      }
    });
    
    if (error) {
      console.error('Error de signup en Supabase:', error.message);
      if (error.message.includes('User already registered')) {
        console.log('Usuario ya existe, esto es normal en demo');
        return true; // Consideramos esto como éxito para usuarios demo
      }
      return false;
    }
    
    console.log('Signup exitoso para:', email);
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
  };

  const value = {
    user,
    login,
    logout,
    signUp,
    isAuthenticated: !!user,
    isLoading,
    authError,
  };

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
