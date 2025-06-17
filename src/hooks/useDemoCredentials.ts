
export interface DemoCredential {
  name: string;
  email: string;
  password: string;
  role: string;
  description: string;
  territory?: string;
  verified: boolean;
}

export const useDemoCredentials = () => {
  // CREDENCIALES DEMO OPTIMIZADAS - SISTEMA UNIFICADO
  const verifiedCredentials: DemoCredential[] = [
    {
      name: 'Desarrollador',
      email: 'dev@demo.com',
      password: '12345678',
      role: 'desarrollador',
      description: 'Acceso completo de desarrollador - Control total del sistema',
      territory: 'Nacional',
      verified: true
    },
    {
      name: 'Master',
      email: 'master@demo.com', 
      password: '12345678',
      role: 'master',
      description: 'Gestión completa de campaña electoral y coordinación',
      territory: 'Regional',
      verified: true
    },
    {
      name: 'Candidato',
      email: 'candidato@demo.com',
      password: '12345678',
      role: 'candidato', 
      description: 'Gestión territorial especializada y estrategia política',
      territory: 'Local',
      verified: true
    },
    {
      name: 'Lider',
      email: 'lider@demo.com',
      password: '12345678',
      role: 'lider',
      description: 'Coordinación territorial local y gestión de equipos',
      territory: 'Barrial',
      verified: true
    },
    {
      name: 'Votante',
      email: 'votante@demo.com',
      password: '12345678',
      role: 'votante',
      description: 'Usuario final del sistema electoral y participación',
      territory: 'Individual',
      verified: true
    }
  ];

  // Mapeo optimizado de nombres a emails
  const nameToEmailMap = new Map<string, string>([
    // Desarrollador
    ['Desarrollador', 'dev@demo.com'],
    ['desarrollador', 'dev@demo.com'],
    ['DESARROLLADOR', 'dev@demo.com'],
    ['dev', 'dev@demo.com'],
    ['Dev', 'dev@demo.com'],
    ['DEV', 'dev@demo.com'],
    
    // Master
    ['Master', 'master@demo.com'],
    ['master', 'master@demo.com'],
    ['MASTER', 'master@demo.com'],
    
    // Candidato
    ['Candidato', 'candidato@demo.com'],
    ['candidato', 'candidato@demo.com'],
    ['CANDIDATO', 'candidato@demo.com'],
    
    // Líder
    ['Líder', 'lider@demo.com'],
    ['líder', 'lider@demo.com'],
    ['Lider', 'lider@demo.com'],
    ['lider', 'lider@demo.com'],
    ['LÍDER', 'lider@demo.com'],
    ['LIDER', 'lider@demo.com'],
    
    // Votante
    ['Votante', 'votante@demo.com'],
    ['votante', 'votante@demo.com'],
    ['VOTANTE', 'votante@demo.com']
  ]);

  const getEmailFromName = (name: string): string | null => {
    const cleanName = name.trim();
    const email = nameToEmailMap.get(cleanName);
    
    if (email) {
      console.log(`✅ Email encontrado para "${cleanName}": ${email}`);
    } else {
      console.log(`❌ No se encontró email para "${cleanName}"`);
    }
    
    return email || null;
  };

  const getCredentialByEmail = (email: string): DemoCredential | null => {
    return verifiedCredentials.find(cred => cred.email === email) || null;
  };

  const validateCredential = (email: string, password: string): boolean => {
    const credential = getCredentialByEmail(email);
    const isValid = credential ? credential.password === password && credential.verified : false;
    
    console.log(`🔐 Validando credencial: ${email} - ${isValid ? 'VÁLIDA' : 'INVÁLIDA'}`);
    
    return isValid;
  };

  const getAllCredentials = (): DemoCredential[] => {
    return verifiedCredentials;
  };

  const quickLogin = (roleName: string) => {
    const email = getEmailFromName(roleName);
    if (email) {
      const credential = getCredentialByEmail(email);
      return credential ? { email: credential.email, password: credential.password } : null;
    }
    return null;
  };

  return {
    verifiedCredentials,
    getEmailFromName,
    getCredentialByEmail,
    getAllCredentials,
    validateCredential,
    quickLogin
  };
};
