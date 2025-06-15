
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
      email: 'dev@micampana.co', // Cambiado .com por .co para evitar problemas con ñ
      password: 'micampana2025', // Sin ñ para evitar problemas
      name: 'Desarrollador',
      role: 'desarrollador'
    },
    {
      email: 'master1@demo.com',
      password: 'micampana2025',
      name: 'Master Demo',
      role: 'master'
    },
    {
      email: 'candidato@demo.com',
      password: 'micampana2025',
      name: 'Candidato Demo',
      role: 'candidato'
    },
    {
      email: 'lider@demo.com',
      password: 'micampana2025',
      name: 'Líder Demo',
      role: 'lider'
    },
    {
      email: 'votante@demo.com',
      password: 'micampana2025',
      name: 'Votante Demo',
      role: 'votante'
    }
  ];

  const createDemoUser = async (user: DemoUser): Promise<boolean> => {
    try {
      console.log(`Creando usuario: ${user.email}`);
      const success = await signUp(user.email, user.password, user.name, user.role);
      console.log(`Resultado para ${user.email}:`, success);
      return success;
    } catch (error) {
      console.error(`Error creating demo user ${user.email}:`, error);
      return false;
    }
  };

  const createAllDemoUsers = async (): Promise<void> => {
    console.log('Iniciando creación de usuarios demo...');
    
    for (const user of demoUsers) {
      try {
        await createDemoUser(user);
        // Pausa entre creaciones para evitar rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Error procesando usuario ${user.email}:`, error);
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
