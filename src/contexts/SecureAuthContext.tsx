
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

  const loadUserProfile = useCallback(async (supabaseUser: SupabaseUser) => {
    try {
      logInfo('auth', 'Cargando perfil de usuario', { userId: supabaseUser.id });
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, name, role')
        .eq('id', supabaseUser.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        logError('auth', 'Error cargando perfil de base de datos', error);
        throw error;
      }

      if (profile) {
        const isDemoUser = supabaseUser.email?.includes('demo.com') || 
                          databaseMode === 'demo';

        const userData: User = {
          id: profile.id,
          name: profile.name || 'Usuario Demo',
          role: profile.role as User['role'] || 'votante',
          email: supabaseUser.email || '',
          isDemoUser,
          territory: isDemoUser ? 'DEMO' : 'NACIONAL'
        };

        setUser(userData);
        setAuthError(null);
        
        logInfo('auth', 'Perfil cargado exitosamente desde BD', {
          userId: userData.id,
          role: userData.role,
          name: userData.name,
          isDemoUser: userData.isDemoUser
        });
      } else {
        // Si no existe perfil, crear uno básico
        const fallbackUser: User = {
          id: supabaseUser.id,
          name: supabaseUser.email?.split('@')[0] || 'Usuario Demo',
          role: 'votante',
          email: supabaseUser.email || '',
          isDemoUser: true,
          territory: 'DEMO'
        };
        
        setUser(fallbackUser);
        setAuthError(null);
        
        logInfo('auth', 'Usuario sin perfil en BD, usando datos básicos', {
          userId: fallbackUser.id,
          email: fallbackUser.email
        });
      }
    } catch (error) {
      const errorMsg = `Error cargando perfil: ${(error as Error).message}`;
      setAuthError(errorMsg);
      logError('auth', 'Error crítico cargando perfil', error as Error);
    }
  }, [databaseMode, logInfo, logError]);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('🔐 INICIANDO LOGIN DEMO:', { email, password: password ? '[PRESENTE]' : '[VACÍO]' });
    logInfo('auth', 'Intento de login iniciado', { email });
    setAuthError(null);
    setIsLoading(true);

    try {
      // Limpiar sesión previa
      await supabase.auth.signOut();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        let errorMsg = '❌ Error de autenticación: ';
        
        if (error.message.includes('Invalid login credentials')) {
          errorMsg = '❌ Credenciales incorrectas.\n🔑 Verifica: dev@demo.com / 12345678';
        } else if (error.message.includes('Email not confirmed')) {
          errorMsg = '📧 Email no confirmado. Usando modo demo.';
        } else if (error.message.includes('Too many requests')) {
          errorMsg = '⏱️ Demasiados intentos. Espera un momento.';
        } else {
          errorMsg += error.message;
        }
        
        setAuthError(errorMsg);
        logError('auth', 'Error en login', error);
        setIsLoading(false);
        return false;
      }

      if (data.user && data.session) {
        console.log('✅ LOGIN EXITOSO:', { 
          userId: data.user.id,
          email: data.user.email,
          hasSession: !!data.session 
        });
        
        logInfo('auth', 'Login exitoso', { 
          userId: data.user.id,
          email: data.user.email
        });
        
        // El perfil se cargará automáticamente en onAuthStateChange
        return true;
      }

      setAuthError('Login exitoso pero sin datos de usuario');
      setIsLoading(false);
      return false;
    } catch (error) {
      const errorMsg = 'Error inesperado durante el login';
      setAuthError(errorMsg);
      logError('auth', 'Error crítico en login', error as Error);
      setIsLoading(false);
      return false;
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

  useEffect(() => {
    console.log('🚀 INICIALIZANDO SECURE AUTH PROVIDER v6.0');
    logInfo('auth', 'Inicializando SecureAuthProvider v6.0 - Sistema Demo Mejorado');
    
    detectDatabaseMode();
    checkSystemHealth();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`🔔 AUTH EVENT: ${event}`, { 
        hasSession: !!session,
        userEmail: session?.user?.email,
        userId: session?.user?.id
      });
      
      logInfo('auth', `Evento de autenticación: ${event}`, { 
        hasSession: !!session,
        userEmail: session?.user?.email 
      });

      setIsLoading(true);

      if (session?.user && event !== 'SIGNED_OUT') {
        setSession(session);
        
        // Cargar perfil del usuario
        try {
          await loadUserProfile(session.user);
          console.log('✅ PERFIL CARGADO CORRECTAMENTE');
        } catch (error) {
          console.error('❌ ERROR CARGANDO PERFIL:', error);
          handleError(error as Error, 'Carga de perfil', { category: 'auth' });
        }
      } else {
        setUser(null);
        setSession(null);
        console.log('👋 USUARIO DESCONECTADO');
        logInfo('auth', 'Usuario desconectado');
      }
      
      setIsLoading(false);
    });

    const initializeAuth = async () => {
      try {
        console.log('🔍 VERIFICANDO SESIÓN INICIAL...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ ERROR SESIÓN INICIAL:', error);
          logError('auth', 'Error obteniendo sesión inicial', error);
        } else if (session?.user) {
          console.log('✅ SESIÓN INICIAL ENCONTRADA:', { 
            userId: session.user.id,
            email: session.user.email 
          });
          setSession(session);
          await loadUserProfile(session.user);
          logInfo('auth', 'Sesión inicial restaurada');
        } else {
          console.log('ℹ️ NO HAY SESIÓN INICIAL');
        }
      } catch (error) {
        console.error('❌ ERROR INICIALIZACIÓN:', error);
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
  }, [detectDatabaseMode, checkSystemHealth, handleError, logInfo, logError, loadUserProfile]);

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
