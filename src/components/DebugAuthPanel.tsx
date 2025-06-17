
import { useAuth } from '@/contexts/AuthContext';
import { useDataSegregation } from '@/hooks/useDataSegregation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, User, Shield, Bug } from 'lucide-react';
import { SystemDiagnostics } from './SystemDiagnostics';
import { useState } from 'react';

export const DebugAuthPanel = () => {
  const { user, isAuthenticated } = useAuth();
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const {
    canCreateCandidatos,
    canCreateLideres, 
    canCreateVotantes,
    canManageUsers
  } = useDataSegregation();

  const testCredentials = [
    { email: 'admin@micampana.com', password: 'AdminSecure2025!', role: 'Desarrollador' },
    { email: 'master@micampana.com', password: 'MasterSecure2025!', role: 'Master' },
    { email: 'candidato@micampana.com', password: 'CandidatoSecure2025!', role: 'Candidato' },
    { email: 'lider@micampana.com', password: 'LiderSecure2025!', role: 'Líder Territorial' }
  ];

  const permissions = [
    { name: 'Crear Candidatos', value: canCreateCandidatos },
    { name: 'Crear Líderes', value: canCreateLideres },
    { name: 'Crear Votantes', value: canCreateVotantes },
    { name: 'Gestionar Usuarios', value: canManageUsers }
  ];

  return (
    <div className="fixed bottom-4 left-4 z-50 space-y-2 max-w-xs">
      <Card className="bg-white/95 backdrop-blur">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Debug Auth
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDiagnostics(!showDiagnostics)}
              className="ml-auto h-6 px-2"
            >
              <Bug className="w-3 h-3" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span className="text-sm">
              {isAuthenticated ? user?.name : 'No autenticado'}
            </span>
          </div>
          
          {user && (
            <Badge variant="outline" className="text-xs">
              {user.role}
            </Badge>
          )}

          <div className="space-y-1">
            <p className="text-xs font-medium">Permisos:</p>
            {permissions.map((perm, idx) => (
              <div key={idx} className="flex items-center gap-1 text-xs">
                {perm.value ? (
                  <CheckCircle className="w-3 h-3 text-green-500" />
                ) : (
                  <XCircle className="w-3 h-3 text-red-500" />
                )}
                <span>{perm.name}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-2">
            <p className="text-xs font-medium mb-1">Estado Sistema:</p>
            <div className="text-xs space-y-1">
              <div>Auth: {isAuthenticated ? '✅' : '❌'}</div>
              <div>User: {user ? '✅' : '❌'}</div>
              <div>Role: {user?.role || 'N/A'}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {showDiagnostics && (
        <div className="max-w-lg">
          <SystemDiagnostics />
        </div>
      )}

      <Card className="bg-blue-50/95 backdrop-blur">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs">Credenciales de Prueba</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {testCredentials.map((cred, idx) => (
              <div key={idx} className="text-xs">
                <p className="font-medium">{cred.role}</p>
                <p className="text-gray-600">{cred.email}</p>
                <p className="text-gray-600 mb-2">{cred.password}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
