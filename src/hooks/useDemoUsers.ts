
/*
 * Copyright © 2025 sademarquezDLL. Todos los derechos reservados.
 */

import { useAuth } from '@/contexts/AuthContext';

interface DemoUser {
  email: string;
  password: string;
  name: string;
  role: string;
  description: string;
  territory?: string;
  isDemo: boolean;
}

interface ProductionConfig {
  databaseMode: 'demo' | 'production';
  maxUsers: number;
  features: string[];
}

export const useDemoUsers = () => {
  const FIXED_PASSWORD = "MasterSecure2025!";
  
  // Configuración separada entre DEMO y PRODUCCIÓN
  const productionConfig: ProductionConfig = {
    databaseMode: 'production',
    maxUsers: 1000000, // 1M usuarios reales
    features: ['gemini_ai', 'automated_campaigns', 'real_leads', 'whatsapp_integration']
  };

  const demoConfig: ProductionConfig = {
    databaseMode: 'demo',
    maxUsers: 101025,
    features: ['demo_data', 'test_environment', 'limited_features']
  };

  // Usuarios DEMO claramente marcados
  const demoUsers: DemoUser[] = [
    {
      email: 'admin@micampana.com',
      password: 'AdminSecure2025!',
      name: 'Administrador DEMO',
      role: 'desarrollador',
      description: 'Control total del sistema DEMO - Acceso completo',
      isDemo: true
    },
    {
      email: 'master@micampana.com',
      password: 'MasterSecure2025!',
      name: 'Carlos Master Rodriguez DEMO',
      role: 'master',
      description: 'Gestión completa de campaña DEMO - Base con 100k usuarios simulados',
      isDemo: true
    },
    {
      email: 'maria.gonzalez@micampana.com',
      password: 'CandidatoSecure2025!',
      name: 'María González DEMO',
      role: 'candidato',
      description: 'Candidata a Alcalde DEMO - Bogotá (15,420 votos simulados)',
      territory: 'Bogotá',
      isDemo: true
    },
    {
      email: 'juan.martinez@micampana.com',
      password: 'CandidatoSecure2025!',
      name: 'Juan Martínez DEMO',
      role: 'candidato',
      description: 'Candidato a Concejal DEMO - Chapinero (8,932 votos simulados)',
      territory: 'Chapinero',
      isDemo: true
    },
    {
      email: 'ana.rodriguez@micampana.com',
      password: 'CandidatoSecure2025!',
      name: 'Ana Rodríguez DEMO',
      role: 'candidato',
      description: 'Candidata a Concejal DEMO - Suba (12,156 votos simulados)',
      territory: 'Suba',
      isDemo: true
    },
    {
      email: 'lider1@micampana.com',
      password: 'LiderSecure2025!',
      name: 'Líder Territorial DEMO',
      role: 'lider',
      description: 'Líder de base DEMO - Gestión territorial simulada',
      isDemo: true
    },
    {
      email: 'votante@demo.com',
      password: 'VotanteSecure2025!',
      name: 'Votante DEMO',
      role: 'votante',
      description: 'Usuario votante DEMO - Parte de base simulada',
      isDemo: true
    }
  ];

  // Usuarios PRODUCCIÓN reales (se crearán dinámicamente)
  const productionUserTemplate = {
    roles: ['master', 'candidato', 'lider', 'votante', 'visitante'],
    territories: [
      'Antioquia', 'Atlántico', 'Bogotá D.C.', 'Bolívar', 'Boyacá', 
      'Caldas', 'Caquetá', 'Casanare', 'Cauca', 'Cesar', 'Chocó',
      'Córdoba', 'Cundinamarca', 'Huila', 'La Guajira', 'Magdalena',
      'Meta', 'Nariño', 'Norte de Santander', 'Putumayo', 'Quindío',
      'Risaralda', 'San Andrés', 'Santander', 'Sucre', 'Tolima',
      'Valle del Cauca', 'Vaupés', 'Vichada'
    ]
  };

  // Estadísticas separadas
  const demoStats = {
    totalUsers: 101025,
    territories: 8,
    candidates: 5,
    leaders: 20,
    voters: 100000,
    alerts: 5,
    votes: 50000,
    activeInteractions: 0,
    mode: 'DEMO'
  };

  const productionStats = {
    totalUsers: 0, // Se incrementará dinámicamente
    territories: 32, // Todos los departamentos de Colombia
    candidates: 0,
    leaders: 0,
    voters: 0,
    alerts: 0,
    votes: 0,
    activeInteractions: 0,
    mode: 'PRODUCCION'
  };

  return {
    demoUsers,
    productionConfig,
    demoConfig,
    productionUserTemplate,
    FIXED_PASSWORD,
    demoStats,
    productionStats
  };
};
