
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
    console.log('🔧 AuthProvider inicializando v4...');
    
    let profileLoadingPromise: Promise<void> | null = null;

    // Configurar listener de cambios de auth PRIMERO
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('🔄 Auth state changed:', event, newSession?.user?.email || 'No user');
      
      // Actualizar sesión inmediatamente
      setSession(newSession);
      
      if (newSession?.user && event !== 'SIGNED_OUT') {
        console.log('👤 Usuario autenticado, cargando perfil...');
        
        // Cancelar carga de perfil anterior si existe
        if (profileLoadingPromise) {
          console.log('⏸️ Cancelando carga de perfil anterior');
        }
        
        // Crear nueva promesa de carga de perfil
        profileLoadingPromise = loadUserProfile(newSession.user);
        
        try {
          await profileLoadingPromise;
        } catch (error) {
          console.error('❌ Error cargando perfil después de auth change:', error);
          // No limpiar la sesión en caso de error de perfil
        }
      } else {
        console.log('🚪 Usuario desconectado o evento SIGNED_OUT');
        setUser(null);
        profileLoadingPromise = null;
      }
    });

    // Obtener sesión inicial DESPUÉS de configurar el listener
    const initializeSession = async () => {
      try {
        console.log('🔍 Verificando sesión inicial...');
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error obteniendo sesión inicial:', error);
        } else if (initialSession?.user) {
          console.log('✅ Sesión inicial encontrada:', initialSession.user.email);
          
          // Solo establecer sesión, el listener se encargará del perfil
          setSession(initialSession);
          
          // Cargar perfil para sesión inicial
          try {
            await loadUserProfile(initialSession.user);
          } catch (error) {
            console.error('❌ Error cargando perfil inicial:', error);
          }
        } else {
          console.log('ℹ️ No hay sesión inicial activa');
        }
      } catch (error) {
        console.error('💥 Error crítico inicializando sesión:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeSession();

    return () => {
      console.log('🧹 Limpiando AuthProvider');
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (supabaseUser: SupabaseUser): Promise<void> => {
    try {
      console.log('👤 Cargando perfil para:', supabaseUser.id);
      
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

        console.log('✅ Perfil cargado:', userData.name, userData.role);
        setUser(userData);
      } else {
        console.warn('⚠️ Perfil no encontrado, creando...');
        
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([{
            id: supabaseUser.id,
            name: supabaseUser.email || 'Usuario',
            role: 'votante'
          }])
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

        console.log('✅ Perfil creado:', userData.name, userData.role);
        setUser(userData);
      }
    } catch (error) {
      console.error('💥 Error crítico en loadUserProfile:', error);
      throw error; // Re-lanzar para manejo en el llamador
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    console.log('🔐 Iniciando login para:', email);
    
    try {
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
        // La sesión se manejará automáticamente por onAuthStateChange
        return { success: true };
      }

      return { success: false, error: 'Login sin datos de usuario' };
    } catch (error) {
      console.error('💥 Error crítico en login:', error);
      return { success: false, error: `Error crítico: ${error}` };
    }
  };

  const logout = async () => {
    console.log('🚪 Cerrando sesión...');
    try {
      // Limpiar estado local primero
      setUser(null);
      setSession(null);
      
      // Luego cerrar sesión en Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Error cerrando sesión:', error);
      } else {
        console.log('✅ Sesión cerrada exitosamente');
      }
    } catch (error) {
      console.error('💥 Error crítico cerrando sesión:', error);
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

  console.log('📊 Estado actual AuthContext:', {
    hasUser: !!user,
    hasSession: !!session,
    isAuthenticated: !!user && !!session,
    isLoading,
    userName: user?.name,
    userRole: user?.role
  });

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
