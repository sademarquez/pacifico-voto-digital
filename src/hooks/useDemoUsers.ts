
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
      password: 'micampaña2025',
      name: 'Desarrollador',
      role: 'desarrollador'
    },
    {
      email: 'master1@demo.com',
      password: 'micampaña2025',
      name: 'Master Demo',
      role: 'master'
    },
    {
      email: 'candidato@demo.com',
      password: 'micampaña2025',
      name: 'Candidato Demo',
      role: 'candidato'
    },
    {
      email: 'lider@demo.com',
      password: 'micampaña2025',
      name: 'Líder Demo',
      role: 'lider'
    },
    {
      email: 'votante@demo.com',
      password: 'micampaña2025',
      name: 'Votante Demo',
      role: 'votante'
    }
  ];

  const createDemoUser = async (user: DemoUser): Promise<boolean> => {
    try {
      const success = await signUp(user.email, user.password, user.name, user.role);
      return success;
    } catch (error) {
      console.error(`Error creating demo user ${user.email}:`, error);
      return false;
    }
  };

  const createAllDemoUsers = async (): Promise<void> => {
    console.log('Creating demo users...');
    for (const user of demoUsers) {
      await createDemoUser(user);
      // Pequeña pausa entre creaciones
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    console.log('Demo users creation completed');
  };

  return {
    demoUsers,
    createDemoUser,
    createAllDemoUsers
  };
};
