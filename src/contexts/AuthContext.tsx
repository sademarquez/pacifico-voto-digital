import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'desarrollador' | 'master' | 'candidato' | 'lider' | 'votante';
  created_by?: string | null;
}

interface AuthContextType {
  user: User | null;
  login: (nameOrEmail: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  signUp: (email: string, password: string, name: string, role: string) => Promise<boolean>;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  clearAuthError: () => void;
}

interface AuthDebugInfo {
  phase: string;
  incomingUser: any;
  mappedEmail: string | null;
  loginPayload?: any;
  profile?: any;
  errorContext?: string;
  latestError?: string | null;
  loginResult?: boolean;
}

const AuthContext = createContext<AuthContextType & { debugInfo: AuthDebugInfo } | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const [debugInfo, setDebugInfo] = useState<AuthDebugInfo>({
    phase: 'inicio',
    incomingUser: null,
    mappedEmail: null,
    errorContext: '',
    latestError: null,
    profile: null,
    loginResult: undefined,
  });

  const clearAuthError = () => {
    setAuthError(null);
    setDebugInfo((prev) => ({ ...prev, latestError: null, errorContext: '' }));
  };

  useEffect(() => {
    if (!supabase) {
      setAuthError("Fallo la conexión con el backend (Supabase). Revisa la consola del navegador para más detalles.");
      setIsLoading(false);
      setDebugInfo((prev) => ({
        ...prev,
        phase: 'supabase-client-missing',
        latestError: 'Supabase client not initialized'
      }));
      return;
    }

    setIsLoading(true);
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setDebugInfo((prev) => ({
          ...prev,
          phase: 'onAuthStateChange',
          incomingUser: session?.user,
        }));

        console.log('[AUTH] State change:', event, session?.user?.email);
        const supabaseUser = session?.user ?? null;
        if (supabaseUser) {
          setDebugInfo((prev) => ({
            ...prev,
            phase: 'fetch-profile',
            incomingUser: supabaseUser,
          }));

          const { data: profile, error } = await supabase
            .from('profiles')
            .select('id, name, role, created_by')
            .eq('id', supabaseUser.id)
            .maybeSingle();

          setDebugInfo((prev) => ({
            ...prev,
            profile,
            phase: profile ? 'profile-found' : 'profile-not-found',
            latestError: error?.message || null,
            errorContext: error ? JSON.stringify(error) : '',
          }));

          if (error && error.code !== 'PGRST116') {
            console.error("[AUTH] Error fetching profile:", error);
            setAuthError("Error al cargar el perfil de usuario.");
            setUser(null);
          } else if (profile) {
            console.log('[AUTH] Usuario autenticado (profile):', profile.name, 'Rol:', profile.role);
            setUser({
              id: profile.id,
              name: profile.name || supabaseUser.email || 'Usuario',
              role: profile.role as User['role'],
              email: supabaseUser.email || '',
              created_by: profile.created_by
            });
            setAuthError(null); // Limpiar errores al autenticar exitosamente
          } else {
            console.warn("[AUTH] No profile found for user, signing them out.");
            setAuthError("No se encontró perfil asociado. Contacta a soporte.");
            await supabase.auth.signOut();
            setUser(null);
          }
        } else {
          console.log('[AUTH] Usuario desconectado');
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const login = async (nameOrEmail: string, password: string): Promise<boolean> => {
    if (!supabase) {
      const errorMsg = "No se puede iniciar sesión. La conexión con el backend no está disponible.";
      setAuthError(errorMsg);
      setDebugInfo((prev) => ({
        ...prev,
        phase: 'login-supabase-client-missing',
        latestError: 'Supabase client not initialized'
      }));
      return false;
    }

    setDebugInfo((prev) => ({
      ...prev,
      phase: 'login-start',
      incomingUser: nameOrEmail,
      mappedEmail: null,
      latestError: null,
      loginPayload: { nameOrEmail, password },
    }));

    // Limpiar errores previos al iniciar nuevo intento
    setAuthError(null);

    let email = nameOrEmail;

    if (!nameOrEmail.includes('@')) {
      const emailMap: { [key: string]: string } = {
        'Desarrollador': 'dev@demo.com',
        'Master': 'master@demo.com',
        'Candidato': 'candidato@demo.com',
        'Lider': 'lider@demo.com',
        'Votante': 'votante@demo.com'
      };

      email = emailMap[nameOrEmail];
      setDebugInfo((prev) => ({
        ...prev,
        phase: 'map-username-to-email',
        mappedEmail: email || null,
      }));

      if (!email) {
        const errorMsg = `Usuario "${nameOrEmail}" no encontrado. Usa: Desarrollador, Master, Candidato, Lider o Votante.`;
        setAuthError(errorMsg);
        setDebugInfo((prev) => ({
          ...prev,
          phase: 'username-mapping-fail',
          latestError: errorMsg
        }));
        return false;
      }
      console.log('[LOGIN] Email mapeado:', email);
    }

    setDebugInfo((prev) => ({
      ...prev,
      phase: 'login-attempt-supabase',
      mappedEmail: email,
    }));

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password,
    });

    setDebugInfo((prev) => ({
      ...prev,
      phase: error ? 'login-error' : 'login-success',
      latestError: error?.message || null,
      loginResult: !error,
    }));

    if (error) {
      console.error('[LOGIN] Error de login en Supabase:', error);
      let errorMsg = 'Error de login: ';

      if (error.message.includes('Invalid login credentials')) {
        errorMsg = 'Credenciales incorrectas. Verifica tu usuario y contraseña (12345678).';
      } else if (error.message.includes('Email not confirmed')) {
        errorMsg = 'Email no confirmado. Revisa tu correo o contacta al administrador.';
      } else {
        errorMsg += error.message;
      }

      setAuthError(errorMsg);
      setDebugInfo((prev) => ({
        ...prev,
        phase: 'login-final-error',
        latestError: errorMsg,
      }));
      return false;
    }

    console.log('[LOGIN] === LOGIN EXITOSO ===');
    console.log('[LOGIN] Usuario autenticado:', data.user?.email);

    setDebugInfo((prev) => ({
      ...prev,
      phase: 'login-final-success',
      loginResult: true,
      incomingUser: data.user,
    }));
    return true;
  };

  const signUp = async (email: string, password: string, name: string, role: string): Promise<boolean> => {
    if (!supabase) {
      console.error('[SIGNUP] Error: Supabase client no está inicializado.');
      const errorMsg = "No se puede registrar usuario. Conexión no disponible.";
      setAuthError(errorMsg);
      return false;
    }

    console.log('[SIGNUP] Creando usuario:', { email, name, role, password });
    setAuthError(null);
    
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password,
      options: {
        data: {
          name: name,
          role: role
        }
      }
    });
    
    if (error) {
      console.error('[SIGNUP] Error:', error.message);
      if (error.message.includes('User already registered')) {
        console.log('[SIGNUP] Usuario ya existe, esto es normal en demo');
        return true;
      }
      setAuthError(`Error al crear usuario: ${error.message}`);
      return false;
    }
    
    console.log('[SIGNUP] Usuario creado exitosamente:', email);
    return true;
  };

  const logout = async () => {
    if (!supabase) {
      console.error('[LOGOUT] Error: Supabase client no está inicializado.');
      return;
    }
    
    console.log('[LOGOUT] Cerrando sesión...');
    setAuthError(null); // Limpiar errores al cerrar sesión
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('[LOGOUT] Error:', error.message);
      setAuthError(`Error al cerrar sesión: ${error.message}`);
    } else {
      console.log('[LOGOUT] Sesión cerrada exitosamente');
    }
  };

  const value = {
    user,
    login,
    logout,
    signUp,
    isAuthenticated: !!user,
    isLoading,
    authError,
    clearAuthError,
    debugInfo,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
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
