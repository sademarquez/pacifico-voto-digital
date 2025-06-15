
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

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
    console.log('🔧 AuthProvider inicializando...');
    
    let mounted = true;
    let loadingTimeout: NodeJS.Timeout;

    // Timeout de seguridad para evitar loading infinito
    const setLoadingTimeout = () => {
      loadingTimeout = setTimeout(() => {
        if (mounted) {
          console.log('⏱️ Timeout de loading alcanzado, desactivando loading');
          setIsLoading(false);
        }
      }, 5000); // 5 segundos máximo de loading
    };

    // Función para cargar perfil del usuario con timeout
    const loadUserProfile = async (supabaseUser: SupabaseUser): Promise<void> => {
      try {
        console.log('👤 Cargando perfil para:', supabaseUser.id);
        
        // Timeout para la consulta del perfil
        const profilePromise = supabase
          .from('profiles')
          .select('id, name, role')
          .eq('id', supabaseUser.id)
          .maybeSingle();

        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Profile query timeout')), 3000);
        });

        const { data: profile, error } = await Promise.race([
          profilePromise,
          timeoutPromise
        ]) as any;

        if (!mounted) return;

        if (error) {
          console.error('❌ Error consultando perfil:', error);
          // Si hay error, crear usuario básico
          const basicUser: User = {
            id: supabaseUser.id,
            name: supabaseUser.email || 'Usuario',
            role: 'votante',
            email: supabaseUser.email || '',
          };
          setUser(basicUser);
          return;
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
          console.log('⚠️ Perfil no encontrado, usando datos básicos');
          
          const basicUser: User = {
            id: supabaseUser.id,
            name: supabaseUser.email || 'Usuario',
            role: 'votante',
            email: supabaseUser.email || '',
          };
          setUser(basicUser);
        }
      } catch (error) {
        console.error('💥 Error en loadUserProfile:', error);
        if (mounted) {
          // En caso de error, crear usuario básico para no bloquear la app
          const basicUser: User = {
            id: supabaseUser.id,
            name: supabaseUser.email || 'Usuario',
            role: 'votante',
            email: supabaseUser.email || '',
          };
          setUser(basicUser);
        }
      }
    };

    // Configurar listener de cambios de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return;
      
      console.log('🔄 Auth state changed:', event, newSession?.user?.email || 'No user');
      
      // Limpiar timeout anterior
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
      
      setSession(newSession);
      
      if (newSession?.user && event !== 'SIGNED_OUT') {
        setLoadingTimeout(); // Iniciar timeout de seguridad
        await loadUserProfile(newSession.user);
      } else {
        console.log('🚪 Usuario desconectado');
        setUser(null);
      }
      
      // Desactivar loading después de procesar el cambio
      if (mounted) {
        setIsLoading(false);
        if (loadingTimeout) {
          clearTimeout(loadingTimeout);
        }
      }
    });

    // Verificar sesión inicial con timeout
    const initializeAuth = async () => {
      try {
        console.log('🔍 Verificando sesión inicial...');
        setLoadingTimeout(); // Iniciar timeout de seguridad
        
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Session query timeout')), 3000);
        });

        const { data: { session: initialSession }, error } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]) as any;
        
        if (!mounted) return;
        
        if (error) {
          console.error('❌ Error obteniendo sesión inicial:', error);
        } else if (initialSession?.user) {
          console.log('✅ Sesión inicial encontrada:', initialSession.user.email);
          setSession(initialSession);
          await loadUserProfile(initialSession.user);
        } else {
          console.log('ℹ️ No hay sesión inicial activa');
        }
      } catch (error) {
        console.error('💥 Error crítico inicializando sesión:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
          if (loadingTimeout) {
            clearTimeout(loadingTimeout);
          }
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
      console.log('🧹 Limpiando AuthProvider');
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    console.log('🔐 Iniciando login para:', email);
    setIsLoading(true);
    
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

        setIsLoading(false);
        return { success: false, error: userFriendlyError };
      }

      if (data.user && data.session) {
        console.log('✅ Login exitoso para:', data.user.email);
        // No desactivar loading aquí, se hará en onAuthStateChange
        return { success: true };
      }

      setIsLoading(false);
      return { success: false, error: 'Login sin datos de usuario' };
    } catch (error) {
      console.error('💥 Error crítico en login:', error);
      setIsLoading(false);
      return { success: false, error: `Error crítico: ${error}` };
    }
  };

  const logout = async () => {
    console.log('🚪 Cerrando sesión...');
    try {
      setUser(null);
      setSession(null);
      
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
