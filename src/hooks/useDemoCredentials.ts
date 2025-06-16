
export interface DemoCredential {
  name: string;
  email: string;
  password: string;
  role: string;
  description: string;
  territory?: string;
}

export const useDemoCredentials = () => {
  // CREDENCIALES DEMO AUDITADAS Y VERIFICADAS
  const verifiedCredentials: DemoCredential[] = [
    {
      name: 'Desarrollador',
      email: 'dev@micampana.com',
      password: 'Password123!',
      role: 'desarrollador',
      description: 'Acceso completo de desarrollador - Control total',
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
      description: 'Usuario final del sistema electoral',
      territory: 'Individual'
    }
  ];

  // Mapeo exacto y auditado de nombres a emails
  const nameToEmailMap: Record<string, string> = {
    'Desarrollador': 'dev@micampana.com',
    'desarrollador': 'dev@micampana.com',
    'DESARROLLADOR': 'dev@micampana.com',
    'Master': 'master1@demo.com',
    'master': 'master1@demo.com',
    'MASTER': 'master1@demo.com',
    'Candidato': 'candidato@demo.com',
    'candidato': 'candidato@demo.com',
    'CANDIDATO': 'candidato@demo.com',
    'Líder': 'lider@demo.com',
    'Lider': 'lider@demo.com',
    'líder': 'lider@demo.com',
    'lider': 'lider@demo.com',
    'LÍDER': 'lider@demo.com',
    'LIDER': 'lider@demo.com',
    'Votante': 'votante@demo.com',
    'votante': 'votante@demo.com',
    'VOTANTE': 'votante@demo.com'
  };

  const getEmailFromName = (name: string): string | null => {
    // Limpiar espacios y buscar coincidencia exacta
    const cleanName = name.trim();
    const email = nameToEmailMap[cleanName];
    
    console.log(`🔍 Buscando email para "${cleanName}":`, email || 'NO ENCONTRADO');
    
    return email || null;
  };

  const getCredentialByName = (name: string): DemoCredential | null => {
    const email = getEmailFromName(name);
    if (!email) return null;
    
    return verifiedCredentials.find(cred => cred.email === email) || null;
  };

  const getCredentialByEmail = (email: string): DemoCredential | null => {
    return verifiedCredentials.find(cred => cred.email === email) || null;
  };

  const getAllCredentials = (): DemoCredential[] => {
    return verifiedCredentials;
  };

  const validateCredential = (email: string, password: string): boolean => {
    const credential = getCredentialByEmail(email);
    const isValid = credential ? credential.password === password : false;
    
    console.log(`🔐 Validando credencial:`, {
      email,
      found: !!credential,
      passwordMatch: isValid
    });
    
    return isValid;
  };

  // Función de diagnóstico
  const diagnoseCredentials = () => {
    console.log('🔧 DIAGNÓSTICO DE CREDENCIALES DEMO:');
    console.log('📋 Credenciales disponibles:', verifiedCredentials.length);
    console.log('🗂️ Mapeo de nombres:', Object.keys(nameToEmailMap).length);
    
    verifiedCredentials.forEach(cred => {
      console.log(`✅ ${cred.name} (${cred.email}) - ${cred.role}`);
    });
  };

  return {
    verifiedCredentials,
    nameToEmailMap,
    getEmailFromName,
    getCredentialByName,
    getCredentialByEmail,
    getAllCredentials,
    validateCredential,
    diagnoseCredentials
  };
};
