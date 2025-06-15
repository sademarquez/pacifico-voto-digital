
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const clearAuthError = () => {
    setAuthError(null);
  };

  useEffect(() => {
    if (!supabase) {
      setAuthError("Fallo la conexión con el backend (Supabase). Revisa la consola del navegador para más detalles.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[AUTH] State change:', event, session?.user?.email);
        
        const supabaseUser = session?.user ?? null;
        if (supabaseUser) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('id, name, role, created_by')
            .eq('id', supabaseUser.id)
            .single();
          
          if (error && error.code !== 'PGRST116') {
            console.error("[AUTH] Error fetching profile:", error);
            setAuthError("Error al cargar el perfil de usuario.");
            setUser(null);
          } else if (profile) {
            console.log('[AUTH] Usuario autenticado:', profile.name, 'Rol:', profile.role);
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
      console.error('[LOGIN] Error: Supabase client no está inicializado.');
      return false;
    }

    console.log('[LOGIN] === INICIO DE SESIÓN ===');
    console.log('[LOGIN] Intentando login con:', nameOrEmail);
    console.log('[LOGIN] Contraseña recibida:', password);
    
    // Limpiar errores previos al iniciar nuevo intento
    setAuthError(null);
    
    let email = nameOrEmail;
    
    // Si no contiene @, buscar el email por nombre
    if (!nameOrEmail.includes('@')) {
      console.log('[LOGIN] Buscando email por nombre:', nameOrEmail);
      
      try {
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('id')
          .eq('name', nameOrEmail);
        
        if (error) {
          console.error('[LOGIN] Error buscando perfil:', error);
          const errorMsg = `Error buscando usuario: ${error.message}`;
          setAuthError(errorMsg);
          return false;
        }
        
        if (!profiles || profiles.length === 0) {
          console.error('[LOGIN] Usuario no encontrado por nombre:', nameOrEmail);
          const errorMsg = `Usuario "${nameOrEmail}" no encontrado. Verifica que el usuario exista.`;
          setAuthError(errorMsg);
          return false;
        }
        
        const profile = profiles[0];
        console.log('[LOGIN] Perfil encontrado:', profile.id);
        
        // Obtener el email del usuario desde auth.users usando RPC
        const { data: userData, error: userError } = await supabase.rpc('get_user_email', {
          user_id: profile.id
        });
        
        if (userError) {
          console.error('[LOGIN] Error obteniendo email:', userError);
          // Fallback: usar emails conocidos
          const emailMap: { [key: string]: string } = {
            'Desarrollador': 'dev@micampana.com',
            'Master': 'master1@demo.com',
            'Candidato': 'candidato@demo.com',
            'Lider': 'lider@demo.com',
            'Votante': 'votante@demo.com'
          };
          
          email = emailMap[nameOrEmail];
          if (!email) {
            const errorMsg = 'No se pudo determinar el email del usuario. Contacta al administrador.';
            setAuthError(errorMsg);
            return false;
          }
          console.log('[LOGIN] Usando email del mapa:', email);
        } else {
          email = userData;
        }
        
        console.log('[LOGIN] Email para login:', email);
      } catch (error) {
        console.error('[LOGIN] Error en búsqueda de usuario:', error);
        const errorMsg = 'Error al buscar usuario. Intenta de nuevo.';
        setAuthError(errorMsg);
        return false;
      }
    }
    
    console.log('[LOGIN] Intentando autenticación con email:', email);
    console.log('[LOGIN] Contraseña utilizada:', password);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password,
    });
    
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
      return false;
    }
    
    console.log('[LOGIN] === LOGIN EXITOSO ===');
    console.log('[LOGIN] Usuario autenticado:', data.user?.email);
    // No limpiar el error aqui, se limpiará en onAuthStateChange
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
