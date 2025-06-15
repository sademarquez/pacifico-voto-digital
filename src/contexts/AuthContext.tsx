
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'desarrollador' | 'master' | 'candidato' | 'lider' | 'votante';
}

interface AuthContextType {
  user: User | null;
  login: (nameOrEmail: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  signUp: (email: string, password: string, name: string, role: string) => Promise<boolean>;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const clearAuthError = () => setAuthError(null);

  useEffect(() => {
    console.log('[AUTH] Inicializando AuthProvider...');
    
    if (!supabase) {
      console.error('[AUTH] Supabase client no disponible');
      setAuthError("Error de conexión con la base de datos");
      setIsLoading(false);
      return;
    }

    // Obtener sesión actual
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('[AUTH] Sesión inicial:', session?.user?.email || 'No session');
        
        if (error) {
          console.error('[AUTH] Error obteniendo sesión:', error);
          setAuthError(`Error de sesión: ${error.message}`);
        } else if (session?.user) {
          await loadUserProfile(session.user);
        }
      } catch (error) {
        console.error('[AUTH] Error en getInitialSession:', error);
        setAuthError('Error cargando sesión inicial');
      } finally {
        setIsLoading(false);
      }
    };

    // Escuchar cambios de autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[AUTH] Cambio de estado:', event, session?.user?.email || 'No user');
      
      if (session?.user) {
        await loadUserProfile(session.user);
      } else {
        console.log('[AUTH] Usuario desconectado');
        setUser(null);
      }
    });

    getInitialSession();

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      console.log('[AUTH] Cargando perfil para:', supabaseUser.email);
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, name, role')
        .eq('id', supabaseUser.id)
        .maybeSingle();

      if (error) {
        console.error('[AUTH] Error cargando perfil:', error);
        setAuthError(`Error cargando perfil: ${error.message}`);
        return;
      }

      if (profile) {
        console.log('[AUTH] Perfil encontrado:', profile);
        setUser({
          id: profile.id,
          name: profile.name || supabaseUser.email || 'Usuario',
          role: profile.role,
          email: supabaseUser.email || '',
        });
        setAuthError(null);
      } else {
        console.warn('[AUTH] No se encontró perfil para el usuario');
        setAuthError('No se encontró perfil de usuario. Contacta al administrador.');
        await supabase.auth.signOut();
      }
    } catch (error) {
      console.error('[AUTH] Error en loadUserProfile:', error);
      setAuthError('Error cargando datos del usuario');
    }
  };

  const login = async (nameOrEmail: string, password: string): Promise<boolean> => {
    console.log('[AUTH] Iniciando login para:', nameOrEmail);
    setAuthError(null);
    
    let email = nameOrEmail;

    // Mapeo de nombres a emails
    if (!nameOrEmail.includes('@')) {
      const emailMap: { [key: string]: string } = {
        'Desarrollador': 'dev@demo.com',
        'Master': 'master@demo.com',
        'Candidato': 'candidato@demo.com',
        'Lider': 'lider@demo.com',
        'Votante': 'votante@demo.com'
      };

      email = emailMap[nameOrEmail];
      if (!email) {
        setAuthError(`Usuario "${nameOrEmail}" no encontrado`);
        return false;
      }
      console.log('[AUTH] Email mapeado:', email);
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        console.error('[AUTH] Error de login:', error);
        let errorMsg = 'Error de login: ';
        if (error.message.includes('Invalid login credentials')) {
          errorMsg = 'Credenciales incorrectas. Verifica usuario y contraseña.';
        } else {
          errorMsg += error.message;
        }
        setAuthError(errorMsg);
        return false;
      }

      console.log('[AUTH] Login exitoso para:', data.user?.email);
      return true;
    } catch (error) {
      console.error('[AUTH] Error en login:', error);
      setAuthError('Error inesperado durante el login');
      return false;
    }
  };

  const signUp = async (email: string, password: string, name: string, role: string): Promise<boolean> => {
    console.log('[AUTH] Creando usuario:', { email, name, role });
    
    try {
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
        console.error('[AUTH] Error en signUp:', error);
        if (error.message.includes('User already registered')) {
          console.log('[AUTH] Usuario ya existe - esto es normal en demo');
          return true;
        }
        setAuthError(`Error creando usuario: ${error.message}`);
        return false;
      }
      
      console.log('[AUTH] Usuario creado exitosamente:', email);
      return true;
    } catch (error) {
      console.error('[AUTH] Error en signUp:', error);
      setAuthError('Error inesperado creando usuario');
      return false;
    }
  };

  const logout = async () => {
    console.log('[AUTH] Cerrando sesión...');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('[AUTH] Error en logout:', error);
        setAuthError(`Error cerrando sesión: ${error.message}`);
      } else {
        console.log('[AUTH] Sesión cerrada exitosamente');
        setUser(null);
        setAuthError(null);
      }
    } catch (error) {
      console.error('[AUTH] Error en logout:', error);
      setAuthError('Error inesperado cerrando sesión');
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
    clearAuthError,
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
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
