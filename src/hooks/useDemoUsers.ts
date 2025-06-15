
import { useAuth } from '@/contexts/AuthContext';

interface DemoUser {
  email: string;
  password: string;
  name: string;
  role: string;
}

export const useDemoUsers = () => {
  const { signUp } = useAuth();

  const demoUsers: DemoUser[] = [
    {
      email: 'dev@micampana.com',
      password: 'micampana2025',
      name: 'Desarrollador',
      role: 'desarrollador'
    },
    {
      email: 'master1@demo.com',
      password: 'micampana2025',
      name: 'Master',
      role: 'master'
    },
    {
      email: 'candidato@demo.com',
      password: 'micampana2025',
      name: 'Candidato',
      role: 'candidato'
    },
    {
      email: 'lider@demo.com',
      password: 'micampana2025',
      name: 'Lider',
      role: 'lider'
    },
    {
      email: 'votante@demo.com',
      password: 'micampana2025',
      name: 'Votante',
      role: 'votante'
    }
  ];

  const createDemoUser = async (user: DemoUser): Promise<boolean> => {
    try {
      console.log(`Creando usuario: ${user.name} (${user.email})`);
      const success = await signUp(user.email, user.password, user.name, user.role);
      console.log(`Resultado para ${user.name}:`, success);
      return success;
    } catch (error) {
      console.error(`Error creating demo user ${user.name}:`, error);
      return false;
    }
  };

  const createAllDemoUsers = async (): Promise<void> => {
    console.log('Iniciando creación de usuarios demo...');
    
    for (const user of demoUsers) {
      try {
        await createDemoUser(user);
        // Pausa para evitar rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Error procesando usuario ${user.name}:`, error);
        // Continúa con el siguiente usuario incluso si hay error
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    console.log('Proceso de creación de usuarios demo completado');
  };

  return {
    demoUsers,
    createDemoUser,
    createAllDemoUsers
  };
};
