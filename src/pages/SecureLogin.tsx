
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Eye, EyeOff, AlertCircle, CheckCircle, Settings } from "lucide-react";
import { useSecureAuth } from "@/contexts/SecureAuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SystemHealthIndicator } from "@/components/SystemHealthIndicator";
import { useSystemLogger } from "@/hooks/useSystemLogger";

const SecureLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, authError, clearAuthError, isAuthenticated, systemHealth } = useSecureAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { logInfo } = useSystemLogger();

  // Credenciales seguras predefinidas
  const secureCredentials = [
    { 
      email: "admin@micampana.com", 
      password: "AdminSecure2025!",
      role: "Desarrollador",
      description: "Control total del sistema"
    },
    { 
      email: "master@micampana.com", 
      password: "MasterSecure2025!",
      role: "Master",
      description: "Gestión de campaña"
    },
    { 
      email: "candidato@micampana.com", 
      password: "CandidatoSecure2025!",
      role: "Candidato",
      description: "Gestión territorial"
    }
  ];

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      logInfo('ui', 'Usuario autenticado, redirigiendo a dashboard');
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate, logInfo]);

  // Limpiar error cuando el usuario modifica campos
  useEffect(() => {
    if (authError && (email || password)) {
      clearAuthError();
    }
  }, [email, password, authError, clearAuthError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Campo requerido",
        description: "Por favor ingresa tu email.",
        variant: "destructive"
      });
      return;
    }

    if (!password.trim()) {
      toast({
        title: "Campo requerido", 
        description: "Por favor ingresa tu contraseña.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    clearAuthError();

    logInfo('ui', 'Intento de login desde UI', { 
      email: email.trim(),
      hasPassword: !!password 
    });

    try {
      const success = await login(email.trim(), password);
      
      if (success) {
        toast({
          title: "¡Bienvenido!",
          description: `Acceso seguro concedido para ${email}.`,
        });
      }
    } catch (error) {
      logInfo('ui', 'Error durante proceso de login', { error });
      toast({
        title: "Error de Sistema",
        description: "Error inesperado. Revisa los logs del sistema.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const useCredentials = (cred: typeof secureCredentials[0]) => {
    setEmail(cred.email);
    setPassword(cred.password);
    clearAuthError();
    logInfo('ui', 'Credenciales predefinidas seleccionadas', { 
      email: cred.email,
      role: cred.role 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
      <SystemHealthIndicator />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl w-full">
        {/* Panel de Login Seguro */}
        <Card className="w-full border-slate-200 shadow-xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="text-white w-8 h-8" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-700">
              MI CAMPAÑA PWA SEGURA
            </CardTitle>
            <p className="text-slate-600">Sistema Electoral Empresarial v2.0</p>
            
            {/* Indicador de salud del sistema */}
            <div className="flex items-center justify-center gap-2 mt-2">
              {systemHealth === 'healthy' && (
                <>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-green-600">Sistema Operativo</span>
                </>
              )}
              {systemHealth === 'warning' && (
                <>
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  <span className="text-xs text-yellow-600">Sistema con Advertencias</span>
                </>
              )}
              {systemHealth === 'error' && (
                <>
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-xs text-red-600">Sistema con Errores</span>
                </>
              )}
            </div>
          </CardHeader>
          
          <CardContent>
            {authError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error de Acceso Seguro</AlertTitle>
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700">Email Corporativo</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@micampana.com"
                  className="border-slate-200 focus:border-slate-500"
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700">Contraseña Segura</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña empresarial"
                    className="border-slate-200 focus:border-slate-500"
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-600"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-slate-600 hover:bg-slate-700" 
                disabled={isLoading}
              >
                {isLoading ? "Autenticando..." : "Acceso Seguro"}
              </Button>
            </form>
            
            <div className="mt-4 p-3 bg-slate-50 rounded-lg text-xs text-slate-600">
              <div className="flex items-center gap-2 mb-2">
                <Settings className="w-4 h-4" />
                <strong>Sistema PWA Empresarial</strong>
              </div>
              <p>• Autenticación segura habilitada</p>
              <p>• Logging automático activo</p>
              <p>• Diagnósticos en tiempo real</p>
              <p>• Escalabilidad empresarial</p>
            </div>
          </CardContent>
        </Card>

        {/* Panel de Credenciales Seguras */}
        <Card className="w-full border-emerald-200 shadow-xl">
          <CardHeader>
            <CardTitle className="text-emerald-700 text-xl">🔐 Credenciales Corporativas</CardTitle>
            <p className="text-emerald-600">Accesos predefinidos del sistema</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {secureCredentials.map((cred, index) => (
                <div key={index} className="p-4 border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-medium text-slate-800">{cred.role}</div>
                      <div className="text-sm text-slate-600">{cred.description}</div>
                      <div className="text-xs text-slate-500 mt-1">
                        Email: {cred.email}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => useCredentials(cred)}
                      className="text-emerald-600 border-emerald-300 hover:bg-emerald-100"
                    >
                      Usar
                    </Button>
                  </div>
                  <div className="text-xs font-mono bg-slate-100 p-2 rounded">
                    Contraseña: {cred.password}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-medium text-sm text-blue-800 mb-2">📋 Arquitectura Empresarial</h3>
              <div className="text-xs text-blue-700 space-y-1">
                <div>• <strong>Desarrollador:</strong> Arquitectura y sistema</div>
                <div>• <strong>Master:</strong> Gestión de campaña completa</div>
                <div>• <strong>Candidato:</strong> Gestión territorial especializada</div>
                <div>• Logging automático de todas las operaciones</div>
                <div>• Diagnósticos en tiempo real</div>
                <div>• Escalabilidad macroempresarial</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SecureLogin;
