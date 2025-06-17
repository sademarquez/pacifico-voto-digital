
/*
 * Copyright © 2025 sademarquezDLL. Todos los derechos reservados.
 */

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
  isDemoUser?: boolean;
  territory?: string;
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
  databaseMode: 'demo' | 'production';
}

const SecureAuthContext = createContext<SecureAuthContextType | undefined>(undefined);

export const SecureAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [systemHealth, setSystemHealth] = useState<'healthy' | 'warning' | 'error'>('healthy');
  const [databaseMode, setDatabaseMode] = useState<'demo' | 'production'>('demo');

  const { logInfo, logError, logWarning } = useSystemLogger();
  const { handleError, handleAsyncError } = useErrorHandler();

  const clearAuthError = () => {
    setAuthError(null);
    logInfo('auth', 'Error de autenticación limpiado por usuario');
  };

  // Detectar modo de base de datos
  const detectDatabaseMode = useCallback(async () => {
    try {
      // Verificar si estamos en modo demo o producción
      const isDemoEnvironment = window.location.hostname.includes('lovable') || 
                               window.location.hostname.includes('localhost') ||
                               process.env.NODE_ENV === 'development';

      if (isDemoEnvironment) {
        setDatabaseMode('demo');
        logInfo('system', 'Modo DEMO detectado - Base de datos de demostración activa');
      } else {
        setDatabaseMode('production');
        logInfo('system', 'Modo PRODUCCIÓN detectado - Base de datos real activa');
      }
    } catch (error) {
      logError('system', 'Error detectando modo de base de datos', error as Error);
      setDatabaseMode('demo'); // Fallback a demo por seguridad
    }
  }, [logInfo, logError]);

  const checkSystemHealth = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('system_config')
        .select('key, value')
        .eq('key', 'maintenance_mode')
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
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
    logInfo('auth', `Inicializando SecureAuthProvider v3.0 - Sistema Electoral Colombia`);
    
    detectDatabaseMode();
    checkSystemHealth();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      logInfo('auth', `Evento de autenticación: ${event}`, { 
        hasSession: !!session,
        userEmail: session?.user?.email || 'No user',
        databaseMode
      });

      if (session?.user) {
        setSession(session);
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

    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          handleError(error, 'Obtención de sesión inicial', { category: 'auth' });
        } else if (session?.user) {
          setSession(session);
          await loadUserProfile(session.user);
          logInfo('auth', `Sesión inicial restaurada - Modo ${databaseMode}`, { 
            userEmail: session.user.email 
          });
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
  }, [databaseMode, detectDatabaseMode, checkSystemHealth, handleError, logInfo]);

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      logInfo('auth', `Cargando perfil de usuario - Modo ${databaseMode}`, { 
        userId: supabaseUser.id 
      });
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, name, role')
        .eq('id', supabaseUser.id)
        .maybeSingle();

      if (error) {
        throw new Error(`Error cargando perfil: ${error.message}`);
      }

      if (profile) {
        // Determinar si es usuario demo basado en el email
        const isDemoUser = supabaseUser.email?.includes('micampana.com') || 
                          supabaseUser.email?.includes('demo.com') ||
                          databaseMode === 'demo';

        const userData: User = {
          id: profile.id,
          name: profile.name || supabaseUser.email || 'Usuario',
          role: profile.role as User['role'],
          email: supabaseUser.email || '',
          isDemoUser,
          territory: isDemoUser ? 'DEMO' : undefined
        };

        setUser(userData);
        setAuthError(null);
        
        logInfo('auth', `Perfil cargado exitosamente - ${databaseMode.toUpperCase()}`, {
          userId: userData.id,
          role: userData.role,
          name: userData.name,
          isDemoUser: userData.isDemoUser,
          databaseMode
        });
      } else {
        throw new Error(`Perfil de usuario no encontrado en base ${databaseMode}`);
      }
    } catch (error) {
      const errorMsg = `Error cargando perfil ${databaseMode}: ${(error as Error).message}`;
      setAuthError(errorMsg);
      logError('auth', `Error cargando perfil de usuario ${databaseMode}`, error as Error);
      throw error;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    logInfo('auth', `Intento de login iniciado - Modo ${databaseMode}`, { email });
    setAuthError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        let errorMsg = `Error de autenticación en modo ${databaseMode}: `;
        
        if (error.message.includes('Invalid login credentials')) {
          errorMsg = databaseMode === 'demo' 
            ? 'Credenciales incorrectas. Usa las credenciales demo proporcionadas.'
            : 'Credenciales incorrectas. Verifica tu email y contraseña.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMsg = databaseMode === 'demo'
            ? 'Email no confirmado. Los usuarios demo están preconfigurados.'
            : 'Por favor confirma tu email antes de iniciar sesión.';
        } else {
          errorMsg += error.message;
        }
        
        setAuthError(errorMsg);
        logError('auth', `Error en login ${databaseMode}`, error);
        return false;
      }

      if (data.user) {
        logInfo('auth', `Login exitoso - ${databaseMode.toUpperCase()}`, { 
          userId: data.user.id,
          email: data.user.email,
          databaseMode
        });
        return true;
      }

      return false;
    } catch (error) {
      const errorMsg = `Error inesperado durante el login ${databaseMode}`;
      setAuthError(errorMsg);
      logError('auth', `Error crítico en login ${databaseMode}`, error as Error);
      return false;
    }
  };

  const logout = async () => {
    logInfo('auth', 'Cerrando sesión de usuario', { 
      userId: user?.id,
      databaseMode 
    });
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        handleError(error, 'Cierre de sesión', { category: 'auth' });
      } else {
        setUser(null);
        setSession(null);
        setAuthError(null);
        logInfo('auth', `Sesión cerrada exitosamente - ${databaseMode}`);
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
    databaseMode,
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
