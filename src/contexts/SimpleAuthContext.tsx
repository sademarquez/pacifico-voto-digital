
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'desarrollador' | 'master' | 'candidato' | 'lider' | 'votante' | 'visitante';
  phone?: string;
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
      
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('id, name, role')
        .eq('id', supabaseUser.id)
        .single();

      if (error) {
        console.error('❌ Error cargando perfil:', error);
        
        // Si no existe perfil, crear uno básico
        if (error.code === 'PGRST116') {
          console.log('📝 Creando perfil básico...');
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: supabaseUser.id,
              name: supabaseUser.email?.split('@')[0] || 'Usuario',
              role: 'votante' as const,
              created_at: new Date().toISOString()
            });

          if (insertError) {
            console.error('❌ Error creando perfil:', insertError);
            throw insertError;
          }

          // Intentar cargar el perfil recién creado
          const { data: newProfile, error: newError } = await supabase
            .from('profiles')
            .select('id, name, role')
            .eq('id', supabaseUser.id)
            .single();

          if (newError) throw newError;
          profileData = newProfile;
        } else {
          throw error;
        }
      }

      const userData: User = {
        id: supabaseUser.id,
        name: profileData?.name || supabaseUser.email?.split('@')[0] || 'Usuario',
        role: (profileData?.role as User['role']) || 'votante',
        email: supabaseUser.email || '',
        phone: supabaseUser.user_metadata?.phone,
        territory: 'PRINCIPAL'
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        let errorMsg = 'Error de autenticación';
        
        if (error.message.includes('Invalid login credentials')) {
          errorMsg = 'Credenciales incorrectas. Verifica email y contraseña.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMsg = 'Email no confirmado. Contacta al administrador.';
        } else if (error.message.includes('Too many requests')) {
          errorMsg = 'Demasiados intentos. Espera un momento.';
        }
        
        console.error('❌ Error de login:', error);
        setAuthError(errorMsg);
        setIsLoading(false);
        return { success: false, error: errorMsg };
      }

      if (data.user && data.session) {
        console.log('✅ Login exitoso para:', email);
        return { success: true };
      }

      setAuthError('Login sin datos válidos');
      setIsLoading(false);
      return { success: false, error: 'Login sin datos válidos' };
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
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ Error en logout:', error);
      }
      setUser(null);
      setSession(null);
      setAuthError(null);
      console.log('👋 Logout exitoso');
    } catch (error) {
      console.error('❌ Error crítico en logout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('🚀 Inicializando SimpleAuthProvider');

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`🔔 AUTH EVENT: ${event}`, { hasSession: !!session, userEmail: session?.user?.email });

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
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error obteniendo sesión:', error);
          setIsLoading(false);
          return;
        }
        
        if (session?.user) {
          console.log('✅ Sesión inicial encontrada para:', session.user.email);
          setSession(session);
          await loadUserProfile(session.user);
        } else {
          console.log('ℹ️ No hay sesión inicial');
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
    login: async (email: string, password: string) => {
      console.log('🔐 Iniciando login:', { email });
      setIsLoading(true);
      setAuthError(null);

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        });

        if (error) {
          let errorMsg = 'Error de autenticación';
          
          if (error.message.includes('Invalid login credentials')) {
            errorMsg = 'Credenciales incorrectas. Verifica email y contraseña.';
          } else if (error.message.includes('Email not confirmed')) {
            errorMsg = 'Email no confirmado. Contacta al administrador.';
          } else if (error.message.includes('Too many requests')) {
            errorMsg = 'Demasiados intentos. Espera un momento.';
          }
          
          console.error('❌ Error de login:', error);
          setAuthError(errorMsg);
          setIsLoading(false);
          return { success: false, error: errorMsg };
        }

        if (data.user && data.session) {
          console.log('✅ Login exitoso para:', email);
          return { success: true };
        }

        setAuthError('Login sin datos válidos');
        setIsLoading(false);
        return { success: false, error: 'Login sin datos válidos' };
      } catch (error) {
        console.error('❌ Error crítico en login:', error);
        const errorMsg = 'Error inesperado durante el login';
        setAuthError(errorMsg);
        setIsLoading(false);
        return { success: false, error: errorMsg };
      }
    },
    logout: async () => {
      try {
        setIsLoading(true);
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error('❌ Error en logout:', error);
        }
        setUser(null);
        setSession(null);
        setAuthError(null);
        console.log('👋 Logout exitoso');
      } catch (error) {
        console.error('❌ Error crítico en logout:', error);
      } finally {
        setIsLoading(false);
      }
    },
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
