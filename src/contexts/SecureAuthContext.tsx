
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { useSystemLogger } from '@/hooks/useSystemLogger';
import { useErrorHandler } from '@/hooks/useErrorHandler';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'desarrollador' | 'master' | 'candidato' | 'lider' | 'votante' | 'visitante';
}

interface SecureAuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  clearAuthError: () => void;
  systemHealth: 'healthy' | 'warning' | 'error';
}

const SecureAuthContext = createContext<SecureAuthContextType | undefined>(undefined);

export const SecureAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [systemHealth, setSystemHealth] = useState<'healthy' | 'warning' | 'error'>('healthy');

  const { logInfo, logError, logWarning } = useSystemLogger();
  const { handleError, handleAsyncError } = useErrorHandler();

  const clearAuthError = () => {
    setAuthError(null);
    logInfo('auth', 'Error de autenticación limpiado por usuario');
  };

  // Diagnóstico de salud del sistema
  const checkSystemHealth = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('system_config')
        .select('key, value')
        .eq('key', 'maintenance_mode')
        .single();

      if (error) {
        setSystemHealth('warning');
        logWarning('system', 'No se pudo verificar estado del sistema', { error: error.message });
        return;
      }

      if (data?.value === true) {
        setSystemHealth('warning');
        logWarning('system', 'Sistema en modo mantenimiento');
      } else {
        setSystemHealth('healthy');
      }
    } catch (error) {
      setSystemHealth('error');
      logError('system', 'Error crítico verificando salud del sistema', error as Error);
    }
  }, [logWarning, logError]);

  useEffect(() => {
    logInfo('auth', 'Inicializando SecureAuthProvider v2.0');
    
    // Verificar salud del sistema
    checkSystemHealth();

    // Configurar listener de autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      logInfo('auth', `Evento de autenticación: ${event}`, { 
        hasSession: !!session,
        userEmail: session?.user?.email || 'No user'
      });

      if (session?.user) {
        setSession(session);

        // Obtener perfil del usuario con manejo de errores
        setTimeout(async () => {
          try {
            await loadUserProfile(session.user);
          } catch (error) {
            handleError(error as Error, 'Carga de perfil de usuario', {
              category: 'auth'
            });
          }
        }, 0);
      } else {
        setUser(null);
        setSession(null);
        logInfo('auth', 'Usuario desconectado');
      }
    });

    // Obtener sesión inicial
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          handleError(error, 'Obtención de sesión inicial', { category: 'auth' });
        } else if (session?.user) {
          setSession(session);
          await loadUserProfile(session.user);
          logInfo('auth', 'Sesión inicial restaurada', { userEmail: session.user.email });
        }
      } catch (error) {
        handleError(error as Error, 'Inicialización de sesión', { category: 'auth' });
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    return () => {
      authListener?.subscription.unsubscribe();
      logInfo('auth', 'SecureAuthProvider limpiado');
    };
  }, []);

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      logInfo('auth', 'Cargando perfil de usuario', { userId: supabaseUser.id });
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, name, role')
        .eq('id', supabaseUser.id)
        .maybeSingle();

      if (error) {
        throw new Error(`Error cargando perfil: ${error.message}`);
      }

      if (profile) {
        const userData: User = {
          id: profile.id,
          name: profile.name || supabaseUser.email || 'Usuario',
          role: profile.role as User['role'],
          email: supabaseUser.email || '',
        };

        setUser(userData);
        setAuthError(null);
        
        logInfo('auth', 'Perfil de usuario cargado exitosamente', {
          userId: userData.id,
          role: userData.role,
          name: userData.name
        });
      } else {
        throw new Error('Perfil de usuario no encontrado');
      }
    } catch (error) {
      const errorMsg = `Error cargando perfil: ${(error as Error).message}`;
      setAuthError(errorMsg);
      logError('auth', 'Error cargando perfil de usuario', error as Error);
      throw error;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    logInfo('auth', 'Intento de login iniciado', { email });
    setAuthError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        let errorMsg = 'Error de autenticación: ';
        
        if (error.message.includes('Invalid login credentials')) {
          errorMsg = 'Credenciales incorrectas. Verifica email y contraseña.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMsg = 'Email no confirmado. Revisa tu correo para activar tu cuenta.';
        } else {
          errorMsg += error.message;
        }
        
        setAuthError(errorMsg);
        logError('auth', 'Error en login', error);
        return false;
      }

      if (data.user) {
        logInfo('auth', 'Login exitoso', { 
          userId: data.user.id,
          email: data.user.email 
        });
        return true;
      }

      return false;
    } catch (error) {
      const errorMsg = 'Error inesperado durante el login';
      setAuthError(errorMsg);
      logError('auth', 'Error crítico en login', error as Error);
      return false;
    }
  };

  const logout = async () => {
    logInfo('auth', 'Cerrando sesión de usuario', { userId: user?.id });
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        handleError(error, 'Cierre de sesión', { category: 'auth' });
      } else {
        setUser(null);
        setSession(null);
        setAuthError(null);
        logInfo('auth', 'Sesión cerrada exitosamente');
      }
    } catch (error) {
      handleError(error as Error, 'Cierre de sesión', { category: 'auth' });
    }
  };

  const value = {
    user,
    session,
    login,
    logout,
    isAuthenticated: !!user && !!session,
    isLoading,
    authError,
    clearAuthError,
    systemHealth,
  };

  return (
    <SecureAuthContext.Provider value={value}>
      {children}
    </SecureAuthContext.Provider>
  );
};

export const useSecureAuth = () => {
  const context = useContext(SecureAuthContext);
  if (context === undefined) {
    throw new Error('useSecureAuth debe ser usado dentro de un SecureAuthProvider');
  }
  return context;
};
