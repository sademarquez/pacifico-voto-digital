
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session, AuthError } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'desarrollador' | 'master' | 'candidato' | 'lider' | 'votante';
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('🔧 AuthProvider inicializando v3...');
    
    // Listen for auth changes FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event, session?.user?.email || 'No user');
      
      setSession(session);
      
      if (session?.user) {
        // Use setTimeout to defer profile loading and avoid blocking auth flow
        setTimeout(async () => {
          try {
            await loadUserProfile(session.user);
          } catch (error) {
            console.error('❌ Error cargando perfil:', error);
            // Don't clear session on profile load error
          }
        }, 100);
      } else {
        console.log('🚪 Usuario desconectado');
        setUser(null);
      }
    });

    // Get initial session AFTER setting up listener
    const getInitialSession = async () => {
      try {
        console.log('🔍 Obteniendo sesión inicial...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error obteniendo sesión inicial:', error);
        } else if (session?.user) {
          console.log('✅ Sesión inicial encontrada:', session.user.email);
          setSession(session);
          // Load profile in background
          setTimeout(async () => {
            try {
              await loadUserProfile(session.user);
            } catch (error) {
              console.error('❌ Error cargando perfil inicial:', error);
            }
          }, 100);
        } else {
          console.log('ℹ️ No hay sesión inicial');
        }
      } catch (error) {
        console.error('💥 Error crítico obteniendo sesión:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    return () => {
      console.log('🧹 Limpiando AuthProvider');
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      console.log('👤 Cargando perfil para usuario:', supabaseUser.id);
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, name, role')
        .eq('id', supabaseUser.id)
        .maybeSingle();

      if (error) {
        console.error('❌ Error consultando perfil:', error);
        throw error;
      }

      if (profile) {
        const userData: User = {
          id: profile.id,
          name: profile.name || supabaseUser.email || 'Usuario',
          role: profile.role || 'votante',
          email: supabaseUser.email || '',
        };

        setUser(userData);
        console.log('✅ Perfil cargado exitosamente:', {
          id: userData.id,
          name: userData.name,
          role: userData.role,
          email: userData.email
        });
      } else {
        console.warn('⚠️ Perfil no encontrado, creando uno nuevo...');
        
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([
            {
              id: supabaseUser.id,
              name: supabaseUser.email || 'Usuario',
              role: 'votante'
            }
          ])
          .select()
          .single();

        if (createError) {
          console.error('❌ Error creando perfil:', createError);
          throw createError;
        }

        const userData: User = {
          id: newProfile.id,
          name: newProfile.name || 'Usuario',
          role: newProfile.role || 'votante',
          email: supabaseUser.email || '',
        };

        setUser(userData);
        console.log('✅ Perfil creado y cargado:', userData);
      }
    } catch (error) {
      console.error('💥 Error en loadUserProfile:', error);
      // Don't throw error to avoid breaking auth flow
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    console.log('🔐 Iniciando login para:', email);
    
    try {
      // Clear any existing state
      setUser(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        console.error('❌ Error de login:', error);
        
        let userFriendlyError = '';
        if (error.message.includes('Invalid login credentials')) {
          userFriendlyError = 'Credenciales incorrectas. Verifica email y contraseña.';
        } else if (error.message.includes('Email not confirmed')) {
          userFriendlyError = 'Email no confirmado. Verifica tu correo.';
        } else {
          userFriendlyError = `Error: ${error.message}`;
        }

        return { success: false, error: userFriendlyError };
      }

      if (data.user && data.session) {
        console.log('✅ Login exitoso para:', data.user.email);
        // Session will be handled by onAuthStateChange
        return { success: true };
      }

      return { success: false, error: 'Login sin usuario devuelto' };
    } catch (error) {
      console.error('💥 Error crítico en login:', error);
      return { success: false, error: `Error crítico: ${error}` };
    }
  };

  const logout = async () => {
    console.log('🚪 Cerrando sesión...');
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      console.log('✅ Sesión cerrada exitosamente');
    } catch (error) {
      console.error('❌ Error cerrando sesión:', error);
    }
  };

  const value = {
    user,
    session,
    login,
    logout,
    isAuthenticated: !!user && !!session,
    isLoading,
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
