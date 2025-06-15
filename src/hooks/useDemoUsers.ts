
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from "@/integrations/supabase/client";

interface DemoUser {
  email: string;
  password: string;
  name: string;
  role: string;
}

export const useDemoUsers = () => {
  const { signUp } = useAuth();
  const FIXED_PASSWORD = "12345678";

  const demoUsers: DemoUser[] = [
    {
      email: 'dev@demo.com',
      password: FIXED_PASSWORD,
      name: 'Desarrollador',
      role: 'desarrollador'
    },
    {
      email: 'master@demo.com',
      password: FIXED_PASSWORD,
      name: 'Master',
      role: 'master'
    },
    {
      email: 'candidato@demo.com',
      password: FIXED_PASSWORD,
      name: 'Candidato',
      role: 'candidato'
    },
    {
      email: 'lider@demo.com',
      password: FIXED_PASSWORD,
      name: 'Lider',
      role: 'lider'
    },
    {
      email: 'votante@demo.com',
      password: FIXED_PASSWORD,
      name: 'Votante',
      role: 'votante'
    }
  ];

  const createDemoUser = async (user: DemoUser): Promise<boolean> => {
    try {
      console.log(`[DEMO] Creando usuario: ${user.name} (${user.email})`);
      const success = await signUp(user.email, user.password, user.name, user.role);
      
      if (success) {
        console.log(`[DEMO] Usuario ${user.name} creado exitosamente`);
        
        // Verificar que el perfil se creó
        await new Promise(resolve => setTimeout(resolve, 1000)); // Esperar un poco
        
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('id, name, role')
          .eq('name', user.name)
          .maybeSingle();
        
        if (profile) {
          console.log(`[DEMO] Perfil verificado para ${user.name}:`, profile);
        } else {
          console.warn(`[DEMO] Perfil no encontrado para ${user.name}`, error);
        }
      }
      
      return success;
    } catch (error) {
      console.error(`[DEMO] Error creando usuario ${user.name}:`, error);
      return false;
    }
  };

  const createAllDemoUsers = async (): Promise<void> => {
    console.log('[DEMO] === INICIANDO CREACIÓN DE USUARIOS DEMO ===');
    console.log(`[DEMO] Contraseña para todos: ${FIXED_PASSWORD}`);

    for (const user of demoUsers) {
      try {
        console.log(`[DEMO] Procesando: ${user.name}...`);
        await createDemoUser(user);
        // Pausa entre creaciones para evitar problemas
        await new Promise(resolve => setTimeout(resolve, 1500));
      } catch (error) {
        console.error(`[DEMO] Error procesando ${user.name}:`, error);
      }
    }

    console.log('[DEMO] === PROCESO COMPLETADO ===');
    console.log('[DEMO] Usuarios disponibles:');
    demoUsers.forEach(user => {
      console.log(`[DEMO] - ${user.name}: ${user.email} | Contraseña: ${FIXED_PASSWORD}`);
    });
  };

  return {
    demoUsers,
    createDemoUser,
    createAllDemoUsers,
    FIXED_PASSWORD
  };
};
