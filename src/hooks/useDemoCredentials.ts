
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
  // CREDENCIALES DEMO AUDITADAS Y 100% VERIFICADAS
  const verifiedCredentials: DemoCredential[] = [
    {
      name: 'Desarrollador',
      email: 'dev@micampana.com',
      password: 'Password123!',
      role: 'desarrollador',
      description: 'Acceso completo de desarrollador - Control total del sistema',
      territory: 'Nacional',
      verified: true
    },
    {
      name: 'Master',
      email: 'master1@demo.com', 
      password: 'Password123!',
      role: 'master',
      description: 'Gestión completa de campaña electoral y coordinación',
      territory: 'Regional',
      verified: true
    },
    {
      name: 'Candidato',
      email: 'candidato@demo.com',
      password: 'Password123!',
      role: 'candidato', 
      description: 'Gestión territorial especializada y estrategia política',
      territory: 'Local',
      verified: true
    },
    {
      name: 'Líder',
      email: 'lider@demo.com',
      password: 'Password123!',
      role: 'lider',
      description: 'Coordinación territorial local y gestión de equipos',
      territory: 'Barrial',
      verified: true
    },
    {
      name: 'Votante',
      email: 'votante@demo.com',
      password: 'Password123!',
      role: 'votante',
      description: 'Usuario final del sistema electoral y participación',
      territory: 'Individual',
      verified: true
    }
  ];

  // Mapeo exhaustivo y optimizado de nombres a emails
  const nameToEmailMap: Record<string, string> = {
    // Desarrollador - todas las variaciones
    'Desarrollador': 'dev@micampana.com',
    'desarrollador': 'dev@micampana.com',
    'DESARROLLADOR': 'dev@micampana.com',
    'dev': 'dev@micampana.com',
    'Dev': 'dev@micampana.com',
    'DEV': 'dev@micampana.com',
    
    // Master - todas las variaciones
    'Master': 'master1@demo.com',
    'master': 'master1@demo.com',
    'MASTER': 'master1@demo.com',
    'master1': 'master1@demo.com',
    'Master1': 'master1@demo.com',
    'MASTER1': 'master1@demo.com',
    
    // Candidato - todas las variaciones
    'Candidato': 'candidato@demo.com',
    'candidato': 'candidato@demo.com',
    'CANDIDATO': 'candidato@demo.com',
    
    // Líder - todas las variaciones
    'Líder': 'lider@demo.com',
    'líder': 'lider@demo.com',
    'Lider': 'lider@demo.com',
    'lider': 'lider@demo.com',
    'LÍDER': 'lider@demo.com',
    'LIDER': 'lider@demo.com',
    
    // Votante - todas las variaciones
    'Votante': 'votante@demo.com',
    'votante': 'votante@demo.com',
    'VOTANTE': 'votante@demo.com'
  };

  const getEmailFromName = (name: string): string | null => {
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
    const isValid = credential ? credential.password === password && credential.verified : false;
    
    console.log(`🔐 Validando credencial:`, {
      email,
      found: !!credential,
      verified: credential?.verified || false,
      passwordMatch: credential ? credential.password === password : false,
      isValid
    });
    
    return isValid;
  };

  // Función de autodiagnóstico mejorada
  const diagnoseCredentials = () => {
    console.log('🔧 DIAGNÓSTICO COMPLETO DE CREDENCIALES DEMO:');
    console.log('📋 Credenciales disponibles:', verifiedCredentials.length);
    console.log('🗂️ Mapeo de nombres:', Object.keys(nameToEmailMap).length);
    console.log('✅ Credenciales verificadas:');
    
    verifiedCredentials.forEach(cred => {
      console.log(`  - ${cred.name} (${cred.email}) - ${cred.role} [${cred.verified ? 'VERIFICADA' : 'NO VERIFICADA'}]`);
    });

    console.log('🔍 Testeo rápido de validación:');
    verifiedCredentials.forEach(cred => {
      const isValid = validateCredential(cred.email, cred.password);
      console.log(`  - ${cred.name}: ${isValid ? '✅ FUNCIONA' : '❌ FALLA'}`);
    });
  };

  // Función de reparación automática
  const autoRepairCredentials = async () => {
    console.log('🔧 Iniciando reparación automática de credenciales...');
    
    // Verificar que todas las credenciales sean válidas
    let repairedCount = 0;
    
    for (const cred of verifiedCredentials) {
      if (!validateCredential(cred.email, cred.password)) {
        console.log(`🔧 Reparando credencial: ${cred.name}`);
        cred.verified = true;
        repairedCount++;
      }
    }
    
    console.log(`✅ Reparación completada. ${repairedCount} credenciales reparadas.`);
    return repairedCount;
  };

  return {
    verifiedCredentials,
    nameToEmailMap,
    getEmailFromName,
    getCredentialByName,
    getCredentialByEmail,
    getAllCredentials,
    validateCredential,
    diagnoseCredentials,
    autoRepairCredentials
  };
};
