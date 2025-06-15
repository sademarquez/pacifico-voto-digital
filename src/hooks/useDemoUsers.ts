
import { useAuth } from '@/contexts/AuthContext';

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
      console.log(`[DEMO] Creando usuario: ${user.name} (${user.email}) con contraseña: ${FIXED_PASSWORD}`);
      const success = await signUp(user.email, user.password, user.name, user.role);
      // Verificar perfil creado
      if (success) {
        const { data: profile, error } = await window.supabase
          .from('profiles')
          .select('id, name, role')
          .eq('name', user.name)
          .maybeSingle();
        if (profile && !error) {
          console.log(`[DEMO-VERIFICATOR] Perfil OK:`, profile);
        } else {
          console.warn(`[DEMO-VERIFICATOR] PERFIL FALTANTE para: ${user.email}, error:`, error);
        }
      }
      console.log(`[DEMO] Resultado para ${user.name}:`, success);
      return success;
    } catch (error) {
      console.error(`[DEMO] Error creating user ${user.name}:`, error);
      return false;
    }
  };

  const createAllDemoUsers = async (): Promise<void> => {
    console.log('[DEMO] === INICIANDO CREACIÓN DE USUARIOS DEMO ===');
    console.log(`[DEMO] Contraseña fija para todos: ${FIXED_PASSWORD}`);

    for (const user of demoUsers) {
      try {
        console.log(`[DEMO] Procesando: ${user.name}...`);
        await createDemoUser(user);
        await new Promise(resolve => setTimeout(resolve, 1500));
      } catch (error) {
        console.error(`[DEMO] Error procesando ${user.name}:`, error);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    console.log('[DEMO] === PROCESO COMPLETADO ===');
    console.log('[DEMO] Usuarios disponibles para login:');
    demoUsers.forEach(user => {
      console.log(`[DEMO] - Nombre: "${user.name}" | Email: "${user.email}" | Contraseña: "${FIXED_PASSWORD}"`);
    });
  };

  return {
    demoUsers,
    createDemoUser,
    createAllDemoUsers,
    FIXED_PASSWORD
  };
};
