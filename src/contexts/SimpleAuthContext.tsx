
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'desarrollador' | 'master' | 'candidato' | 'lider' | 'votante' | 'visitante';
  isDemoUser?: boolean;
  territory?: string;
}

interface SimpleAuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  clearAuthError: () => void;
}

const SimpleAuthContext = createContext<SimpleAuthContextType | undefined>(undefined);

export const SimpleAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const clearAuthError = () => setAuthError(null);

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      console.log('🔄 Cargando perfil para:', supabaseUser.email);
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, name, role')
        .eq('id', supabaseUser.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Error cargando perfil:', error);
        throw error;
      }

      const userData: User = {
        id: supabaseUser.id,
        name: profile?.name || supabaseUser.email?.split('@')[0] || 'Usuario Demo',
        role: (profile?.role as User['role']) || 'votante',
        email: supabaseUser.email || '',
        isDemoUser: supabaseUser.email?.includes('demo.com') || false,
        territory: 'DEMO'
      };

      setUser(userData);
      console.log('✅ Perfil cargado:', userData);
    } catch (error) {
      console.error('❌ Error crítico cargando perfil:', error);
      setAuthError('Error cargando perfil de usuario');
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    console.log('🔐 Iniciando login:', { email });
    setIsLoading(true);
    setAuthError(null);

    try {
      // Limpiar sesión anterior
      await supabase.auth.signOut();

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        let errorMsg = 'Error de autenticación';
        
        if (error.message.includes('Invalid login credentials')) {
          errorMsg = 'Credenciales incorrectas. Verifica email y contraseña.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMsg = 'Email no confirmado';
        } else if (error.message.includes('Too many requests')) {
          errorMsg = 'Demasiados intentos. Espera un momento.';
        }
        
        setAuthError(errorMsg);
        setIsLoading(false);
        return { success: false, error: errorMsg };
      }

      if (data.user && data.session) {
        console.log('✅ Login exitoso');
        // El perfil se cargará automáticamente en onAuthStateChange
        setIsLoading(false);
        return { success: true };
      }

      setAuthError('Login sin datos de usuario');
      setIsLoading(false);
      return { success: false, error: 'Login sin datos de usuario' };
    } catch (error) {
      console.error('❌ Error crítico en login:', error);
      const errorMsg = 'Error inesperado durante el login';
      setAuthError(errorMsg);
      setIsLoading(false);
      return { success: false, error: errorMsg };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setAuthError(null);
      console.log('👋 Logout exitoso');
    } catch (error) {
      console.error('❌ Error en logout:', error);
    }
  };

  useEffect(() => {
    console.log('🚀 Inicializando SimpleAuthProvider');

    // Configurar listener de cambios de auth
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`🔔 AUTH EVENT: ${event}`, { hasSession: !!session });

      if (session?.user && event !== 'SIGNED_OUT') {
        setSession(session);
        await loadUserProfile(session.user);
      } else {
        setUser(null);
        setSession(null);
      }
      
      setIsLoading(false);
    });

    // Verificar sesión inicial
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log('✅ Sesión inicial encontrada');
          setSession(session);
          await loadUserProfile(session.user);
        }
      } catch (error) {
        console.error('❌ Error inicialización auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    session,
    login,
    logout,
    isAuthenticated: !!user && !!session,
    isLoading,
    authError,
    clearAuthError,
  };

  return (
    <SimpleAuthContext.Provider value={value}>
      {children}
    </SimpleAuthContext.Provider>
  );
};

export const useSimpleAuth = () => {
  const context = useContext(SimpleAuthContext);
  if (context === undefined) {
    throw new Error('useSimpleAuth debe ser usado dentro de SimpleAuthProvider');
  }
  return context;
};
