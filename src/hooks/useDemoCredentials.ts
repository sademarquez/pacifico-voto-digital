
/*
 * Copyright © 2025 sademarquezDLL. Todos los derechos reservados.
 */

export interface DemoCredential {
  name: string;
  email: string;
  password: string;
  role: string;
  description: string;
  territory?: string;
}

export const useDemoCredentials = () => {
  // CREDENCIALES REALES VERIFICADAS - Estas SÍ existen en la base de datos
  const verifiedCredentials: DemoCredential[] = [
    {
      name: 'Desarrollador',
      email: 'dev@micampana.com',
      password: 'Password123!',
      role: 'desarrollador',
      description: 'Control total del sistema - Acceso completo',
      territory: 'Nacional'
    },
    {
      name: 'Master',
      email: 'master1@demo.com',
      password: 'Password123!',
      role: 'master',
      description: 'Gestión completa de campaña electoral',
      territory: 'Regional'
    },
    {
      name: 'Candidato',
      email: 'candidato@demo.com',
      password: 'Password123!',
      role: 'candidato',
      description: 'Gestión territorial especializada',
      territory: 'Local'
    },
    {
      name: 'Líder',
      email: 'lider@demo.com',
      password: 'Password123!',
      role: 'lider',
      description: 'Coordinación territorial local',
      territory: 'Barrial'
    },
    {
      name: 'Votante',
      email: 'votante@demo.com',
      password: 'Password123!',
      role: 'votante',
      description: 'Usuario final del sistema',
      territory: 'Individual'
    }
  ];

  // Mapeo de nombres a emails para el login
  const nameToEmailMap: Record<string, string> = {
    'Desarrollador': 'dev@micampana.com',
    'Master': 'master1@demo.com',
    'Candidato': 'candidato@demo.com',
    'Líder': 'lider@demo.com',
    'Lider': 'lider@demo.com', // Variante sin acento
    'Votante': 'votante@demo.com'
  };

  const getEmailFromName = (name: string): string | null => {
    return nameToEmailMap[name] || null;
  };

  const getCredentialByName = (name: string): DemoCredential | null => {
    return verifiedCredentials.find(cred => cred.name === name) || null;
  };

  const getCredentialByEmail = (email: string): DemoCredential | null => {
    return verifiedCredentials.find(cred => cred.email === email) || null;
  };

  const getAllCredentials = (): DemoCredential[] => {
    return verifiedCredentials;
  };

  // Validar que una credencial existe
  const validateCredential = (email: string, password: string): boolean => {
    const credential = getCredentialByEmail(email);
    return credential ? credential.password === password : false;
  };

  return {
    verifiedCredentials,
    nameToEmailMap,
    getEmailFromName,
    getCredentialByName,
    getCredentialByEmail,
    getAllCredentials,
    validateCredential
  };
};
