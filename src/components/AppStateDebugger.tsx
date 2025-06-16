
import { useSimpleAuth } from "@/contexts/SimpleAuthContext";
import { useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, User } from "lucide-react";

const AppStateDebugger = () => {
  const { user, session, isAuthenticated, isLoading, authError } = useSimpleAuth();
  const location = useLocation();

  // Solo mostrar en desarrollo
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <Card className="fixed top-4 left-4 w-80 max-h-96 overflow-y-auto bg-white/90 backdrop-blur z-50 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Debug - Estado de la App
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Badge variant={isAuthenticated ? "default" : "destructive"}>
              {isAuthenticated ? "Autenticado" : "No Auth"}
            </Badge>
          </div>
          <div>
            <Badge variant={isLoading ? "secondary" : "outline"}>
              {isLoading ? "Cargando" : "Listo"}
            </Badge>
          </div>
        </div>
        
        <div className="space-y-1">
          <div><strong>Ruta:</strong> {location.pathname}</div>
          <div><strong>Usuario:</strong> {user?.name || 'Ninguno'}</div>
          <div><strong>Rol:</strong> {user?.role || 'N/A'}</div>
          <div><strong>Email:</strong> {user?.email || 'N/A'}</div>
          <div><strong>Sesión:</strong> {session ? 'Activa' : 'Inactiva'}</div>
        </div>

        {authError && (
          <div className="bg-red-50 p-2 rounded border border-red-200">
            <strong className="text-red-800">Error:</strong>
            <div className="text-red-600">{authError}</div>
          </div>
        )}

        <div className="bg-blue-50 p-2 rounded border border-blue-200">
          <strong className="text-blue-800">Diagnóstico:</strong>
          <div className="text-blue-600">
            {!isAuthenticated && location.pathname !== '/simple-login' && 
              "Usuario debe ir a /simple-login"}
            {isAuthenticated && location.pathname === '/simple-login' && 
              "Redirigiendo al dashboard..."}
            {isAuthenticated && location.pathname !== '/simple-login' && 
              "✅ Estado correcto"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppStateDebugger;
