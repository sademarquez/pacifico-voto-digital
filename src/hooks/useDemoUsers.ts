
import { useAuth } from '@/contexts/AuthContext';

interface DemoUser {
  email: string;
  password: string;
  name: string;
  role: string;
}

export const useDemoUsers = () => {
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
      email: 'visitante@demo.com',
      password: FIXED_PASSWORD,
      name: 'Visitante',
      role: 'visitante'
    }
  ];

  return {
    demoUsers,
    FIXED_PASSWORD
  };
};
