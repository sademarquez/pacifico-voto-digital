
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
  // CREDENCIALES FINALES SIMPLIFICADAS - VERSION 3.0
  const verifiedCredentials: DemoCredential[] = [
    {
      name: 'Desarrollador Principal',
      email: 'admin@campana.com',
      password: '12345678',
      role: 'desarrollador',
      description: 'Control total del sistema - Acceso completo APIs y configuración',
      territory: 'Nacional',
      verified: true
    },
    {
      name: 'Master Campaña',
      email: 'master@campana.com', 
      password: '12345678',
      role: 'master',
      description: 'Gestión completa de campaña - Coordinación territorial avanzada',
      territory: 'Regional',
      verified: true
    },
    {
      name: 'Candidato Electoral',
      email: 'candidato@campana.com',
      password: '12345678',
      role: 'candidato', 
      description: 'Dashboard ejecutivo - Reportes y análisis estratégicos',
      territory: 'Local',
      verified: true
    },
    {
      name: 'Líder Territorial',
      email: 'lider@campana.com',
      password: '12345678',
      role: 'lider',
      description: 'Coordinación local - Gestión de equipos y territorialidad',
      territory: 'Barrial',
      verified: true
    },
    {
      name: 'Votante Demo',
      email: 'votante@campana.com',
      password: '12345678',
      role: 'votante',
      description: 'Usuario final - Captura de voto y participación ciudadana',
      territory: 'Individual',
      verified: true
    },
    {
      name: 'Daniel LLM Verificador',
      email: 'daniel.llm@campana.com',
      password: '12345678',
      role: 'desarrollador',
      description: 'Usuario de testing y verificación - Pruebas automatizadas del sistema',
      territory: 'Nacional',
      verified: true
    }
  ];

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
    const credential = verifiedCredentials.find(cred => 
      cred.role.toLowerCase().includes(roleName.toLowerCase()) ||
      cred.name.toLowerCase().includes(roleName.toLowerCase())
    );
    return credential ? { email: credential.email, password: credential.password } : null;
  };

  const getEmailFromName = (name: string): string | null => {
    const credential = verifiedCredentials.find(cred => 
      cred.name.toLowerCase().includes(name.toLowerCase()) ||
      name.toLowerCase().includes(cred.role.toLowerCase())
    );
    return credential?.email || null;
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
