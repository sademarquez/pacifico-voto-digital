
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
    console.log('🔧 AuthProvider inicializando v2...');
    
    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('🔍 Obteniendo sesión inicial...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error obteniendo sesión inicial:', error);
        } else if (session?.user) {
          console.log('✅ Sesión inicial encontrada:', session.user.email);
          setSession(session);
          await loadUserProfile(session.user);
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

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event, session?.user?.email || 'No user');
      
      if (session?.user) {
        setSession(session);
        // Usar setTimeout para evitar problemas de concurrencia
        setTimeout(async () => {
          try {
            await loadUserProfile(session.user);
          } catch (error) {
            console.error('❌ Error cargando perfil después de auth change:', error);
          }
        }, 100);
      } else {
        console.log('🚪 Usuario desconectado');
        setUser(null);
        setSession(null);
      }
    });

    return () => {
      console.log('🧹 Limpiando AuthProvider');
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      console.log('👤 Cargando perfil para usuario:', supabaseUser.id);
      
      // Primero verificar que el perfil existe
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
        
        // Crear perfil si no existe
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
      throw error;
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    console.log('🔐 Iniciando login para:', email);
    
    try {
      // Test de conectividad primero
      console.log('🧪 Testeando conectividad con Supabase...');
      const { data: testData, error: testError } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);
      
      if (testError) {
        console.error('❌ Error de conectividad:', testError);
        return { success: false, error: `Error de conectividad: ${testError.message}` };
      }
      
      console.log('✅ Conectividad OK, procediendo con login...');

      // Intentar el login
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      // Log detallado del error
      if (error) {
        console.error('❌ Error de login completo:', {
          message: error.message,
          status: error.status,
          name: error.name,
          stack: error.stack,
          details: error
        });

        // Clasificar tipos de errores
        let userFriendlyError = '';
        if (error.message.includes('Invalid login credentials')) {
          userFriendlyError = 'Credenciales incorrectas. Verifica email y contraseña.';
        } else if (error.message.includes('Email not confirmed')) {
          userFriendlyError = 'Email no confirmado. Verifica tu correo.';
        } else if (error.message.includes('Database error')) {
          userFriendlyError = 'Error de base de datos. El usuario puede no existir o hay un problema de configuración.';
        } else if (error.message.includes('confirmation_token')) {
          userFriendlyError = 'Error de esquema de base de datos. Contacta al administrador.';
        } else {
          userFriendlyError = `Error: ${error.message}`;
        }

        return { success: false, error: userFriendlyError };
      }

      if (data.user) {
        console.log('✅ Login exitoso para:', data.user.email);
        console.log('📊 Datos de usuario:', {
          id: data.user.id,
          email: data.user.email,
          created_at: data.user.created_at,
          email_confirmed_at: data.user.email_confirmed_at
        });
        return { success: true };
      }

      console.log('⚠️ Login sin error pero sin usuario');
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
