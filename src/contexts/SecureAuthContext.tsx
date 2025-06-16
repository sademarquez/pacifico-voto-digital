
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
  const { handleError } = useErrorHandler();

  const clearAuthError = () => {
    setAuthError(null);
    logInfo('auth', 'Error de autenticación limpiado');
  };

  // Configuración mejorada de detección de modo
  const detectDatabaseMode = useCallback(async () => {
    try {
      const isDemoEnvironment = window.location.hostname.includes('lovable') || 
                               window.location.hostname.includes('localhost') ||
                               process.env.NODE_ENV === 'development';

      setDatabaseMode(isDemoEnvironment ? 'demo' : 'production');
      logInfo('system', `Modo ${isDemoEnvironment ? 'DEMO' : 'PRODUCCIÓN'} activado`);
    } catch (error) {
      logError('system', 'Error detectando modo de base de datos', error as Error);
      setDatabaseMode('demo');
    }
  }, [logInfo, logError]);

  const checkSystemHealth = useCallback(async () => {
    try {
      // Test de conexión básica a Supabase
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      
      if (error) {
        setSystemHealth('warning');
        logWarning('system', 'Advertencia en conectividad de base de datos', { error: error.message });
      } else {
        setSystemHealth('healthy');
        logInfo('system', 'Sistema de base de datos operativo');
      }
    } catch (error) {
      setSystemHealth('error');
      logError('system', 'Error crítico en sistema', error as Error);
    }
  }, [logWarning, logError, logInfo]);

  useEffect(() => {
    logInfo('auth', 'Inicializando SecureAuthProvider v4.0 - Sistema Electoral Optimizado');
    
    detectDatabaseMode();
    checkSystemHealth();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      logInfo('auth', `Evento: ${event}`, { 
        hasSession: !!session,
        userEmail: session?.user?.email 
      });

      if (session?.user) {
        setSession(session);
        // Defer la carga del perfil para evitar loops
        setTimeout(async () => {
          try {
            await loadUserProfile(session.user);
          } catch (error) {
            handleError(error as Error, 'Carga de perfil', { category: 'auth' });
          }
        }, 100);
      } else {
        setUser(null);
        setSession(null);
        logInfo('auth', 'Usuario desconectado');
      }
    });

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          logError('auth', 'Error obteniendo sesión inicial', error);
        } else if (session?.user) {
          setSession(session);
          await loadUserProfile(session.user);
          logInfo('auth', 'Sesión inicial restaurada');
        }
      } catch (error) {
        logError('auth', 'Error en inicialización', error as Error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      authListener?.subscription.unsubscribe();
      logInfo('auth', 'SecureAuthProvider limpiado');
    };
  }, [detectDatabaseMode, checkSystemHealth, handleError, logInfo, logError]);

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      logInfo('auth', 'Cargando perfil de usuario', { userId: supabaseUser.id });
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, name, role')
        .eq('id', supabaseUser.id)
        .maybeSingle();

      if (error) {
        logWarning('auth', 'Error cargando perfil,usando datos base', { error: error.message });
        
        // Fallback: crear usuario con datos básicos
        const fallbackUser: User = {
          id: supabaseUser.id,
          name: supabaseUser.email?.split('@')[0] || 'Usuario',
          role: 'visitante',
          email: supabaseUser.email || '',
          isDemoUser: true,
          territory: 'DEMO'
        };
        
        setUser(fallbackUser);
        setAuthError(null);
        return;
      }

      if (profile) {
        const isDemoUser = supabaseUser.email?.includes('micampana.com') || 
                          supabaseUser.email?.includes('demo.com') ||
                          databaseMode === 'demo';

        const userData: User = {
          id: profile.id,
          name: profile.name || supabaseUser.email?.split('@')[0] || 'Usuario',
          role: profile.role as User['role'] || 'visitante',
          email: supabaseUser.email || '',
          isDemoUser,
          territory: isDemoUser ? 'DEMO' : 'NACIONAL'
        };

        setUser(userData);
        setAuthError(null);
        
        logInfo('auth', 'Perfil cargado exitosamente', {
          userId: userData.id,
          role: userData.role,
          name: userData.name,
          isDemoUser: userData.isDemoUser
        });
      } else {
        // Crear perfil automáticamente si no existe
        const newProfile = {
          id: supabaseUser.id,
          name: supabaseUser.email?.split('@')[0] || 'Usuario',
          role: 'visitante',
          email: supabaseUser.email
        };

        const { error: insertError } = await supabase
          .from('profiles')
          .insert([newProfile]);

        if (insertError) {
          logWarning('auth', 'No se pudo crear perfil automático', { error: insertError.message });
        } else {
          logInfo('auth', 'Perfil creado automáticamente');
        }

        // Usar el perfil recién creado
        const userData: User = {
          id: newProfile.id,
          name: newProfile.name,
          role: newProfile.role as User['role'],
          email: newProfile.email || '',
          isDemoUser: true,
          territory: 'DEMO'
        };

        setUser(userData);
        setAuthError(null);
      }
    } catch (error) {
      const errorMsg = `Error cargando perfil: ${(error as Error).message}`;
      setAuthError(errorMsg);
      logError('auth', 'Error crítico cargando perfil', error as Error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    logInfo('auth', 'Intento de login iniciado', { email });
    setAuthError(null);
    setIsLoading(true);

    try {
      // Limpiar cualquier sesión previa
      await supabase.auth.signOut();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        let errorMsg = 'Error de autenticación: ';
        
        if (error.message.includes('Invalid login credentials')) {
          errorMsg = 'Credenciales incorrectas. Verifica email y contraseña.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMsg = 'Por favor confirma tu email antes de iniciar sesión.';
        } else if (error.message.includes('Too many requests')) {
          errorMsg = 'Demasiados intentos. Espera un momento e intenta de nuevo.';
        } else {
          errorMsg += error.message;
        }
        
        setAuthError(errorMsg);
        logError('auth', 'Error en login', error);
        return false;
      }

      if (data.user && data.session) {
        logInfo('auth', 'Login exitoso', { 
          userId: data.user.id,
          email: data.user.email
        });
        return true;
      }

      setAuthError('Login exitoso pero sin datos de usuario');
      return false;
    } catch (error) {
      const errorMsg = 'Error inesperado durante el login';
      setAuthError(errorMsg);
      logError('auth', 'Error crítico en login', error as Error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    logInfo('auth', 'Cerrando sesión', { userId: user?.id });
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        logError('auth', 'Error en logout', error);
      } else {
        setUser(null);
        setSession(null);
        setAuthError(null);
        logInfo('auth', 'Sesión cerrada exitosamente');
      }
    } catch (error) {
      logError('auth', 'Error crítico en logout', error as Error);
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
