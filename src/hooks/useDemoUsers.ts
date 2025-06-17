
import { useAuth } from '@/contexts/AuthContext';

interface DemoUser {
  email: string;
  password: string;
  name: string;
  role: string;
  description: string;
  territory?: string;
}

export const useDemoUsers = () => {
  const FIXED_PASSWORD = "MasterSecure2025!";

  const demoUsers: DemoUser[] = [
    {
      email: 'admin@micampana.com',
      password: 'AdminSecure2025!',
      name: 'Administrador Principal',
      role: 'desarrollador',
      description: 'Control total del sistema - Acceso completo'
    },
    {
      email: 'master@micampana.com',
      password: 'MasterSecure2025!',
      name: 'Carlos Master Rodriguez',
      role: 'master',
      description: 'Gestión completa de campaña - Base demo con 100k usuarios'
    },
    {
      email: 'maria.gonzalez@micampana.com',
      password: 'CandidatoSecure2025!',
      name: 'María González',
      role: 'candidato',
      description: 'Candidata a Alcalde - Bogotá (15,420 votos)',
      territory: 'Bogotá'
    },
    {
      email: 'juan.martinez@micampana.com',
      password: 'CandidatoSecure2025!',
      name: 'Juan Martínez',
      role: 'candidato',
      description: 'Candidato a Concejal - Chapinero (8,932 votos)',
      territory: 'Chapinero'
    },
    {
      email: 'ana.rodriguez@micampana.com',
      password: 'CandidatoSecure2025!',
      name: 'Ana Rodríguez',
      role: 'candidato',
      description: 'Candidata a Concejal - Suba (12,156 votos)',
      territory: 'Suba'
    },
    {
      email: 'carlos.lopez@micampana.com',
      password: 'CandidatoSecure2025!',
      name: 'Carlos López',
      role: 'candidato',
      description: 'Candidato a Edil - Kennedy (6,743 votos)',
      territory: 'Kennedy'
    },
    {
      email: 'lucia.torres@micampana.com',
      password: 'CandidatoSecure2025!',
      name: 'Lucía Torres',
      role: 'candidato',
      description: 'Candidata a Concejal - Usaquén (9,287 votos)',
      territory: 'Usaquén'
    },
    {
      email: 'lider1@micampana.com',
      password: 'LiderSecure2025!',
      name: 'Líder Territorial 1',
      role: 'lider',
      description: 'Líder de base - Gestión territorial específica'
    },
    {
      email: 'votante@demo.com',
      password: 'VotanteSecure2025!',
      name: 'Votante Demo',
      role: 'votante',
      description: 'Usuario votante - Parte de base de 100k usuarios'
    }
  ];

  // Estadísticas de la base demo
  const databaseStats = {
    totalUsers: 101025, // 1 master + 5 candidatos + 20 líderes + 1000 votantes demo (representando 100k)
    territories: 8,
    candidates: 5,
    leaders: 20,
    voters: 100000, // Simulados
    alerts: 5,
    votes: 50000, // Simulados
    activeInteractions: 0
  };

  return {
    demoUsers,
    FIXED_PASSWORD,
    databaseStats
  };
};
