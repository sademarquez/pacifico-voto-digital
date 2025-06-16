
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Eye, EyeOff, AlertCircle, CheckCircle, User, Mail, Lock, Smartphone } from "lucide-react";
import { useSecureAuth } from "@/contexts/SecureAuthContext";
import { useDemoCredentials } from "@/hooks/useDemoCredentials";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { SystemHealthIndicator } from "@/components/SystemHealthIndicator";
import PageLayout from "@/components/PageLayout";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  
  const { login, authError, clearAuthError, isAuthenticated } = useSecureAuth();
  const { verifiedCredentials, getEmailFromName } = useDemoCredentials();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (authError && (username || password)) {
      clearAuthError();
    }
  }, [username, password, authError, clearAuthError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      toast({
        title: "Campo requerido",
        description: "Ingresa tu nombre de usuario o email",
        variant: "destructive"
      });
      return;
    }

    if (!password.trim()) {
      toast({
        title: "Campo requerido", 
        description: "Ingresa tu contraseña",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    clearAuthError();

    try {
      // Determinar si es email o nombre de usuario
      let emailToUse = username.trim();
      
      // Si no contiene @, intentar mapear nombre a email
      if (!emailToUse.includes('@')) {
        const mappedEmail = getEmailFromName(emailToUse);
        if (mappedEmail) {
          emailToUse = mappedEmail;
          console.log(`✅ Mapeando "${username}" → "${emailToUse}"`);
        } else {
          toast({
            title: "Usuario no encontrado",
            description: `No se encontró el usuario "${username}". Usa las credenciales demo.`,
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }
      }

      console.log(`🔐 Intentando login con:`, { 
        inputUsername: username,
        emailToUse,
        password: password ? '[PRESENTE]' : '[VACÍO]'
      });

      const success = await login(emailToUse, password.trim());
      
      if (success) {
        toast({
          title: "¡Login exitoso!",
          description: `Bienvenido ${username}`,
        });
      }
    } catch (error) {
      console.error('Error durante el login:', error);
      toast({
        title: "Error de sistema",
        description: "Error inesperado. Revisa las credenciales.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const useCredential = (credential: any) => {
    setUsername(credential.name);
    setPassword(credential.password);
    clearAuthError();
    toast({
      title: "Credenciales cargadas",
      description: `Listo para login como ${credential.name}`,
    });
  };

  return (
    <PageLayout 
      borderVariant="gradient" 
      borderColor="blue"
      className="bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50"
    >
      <div className="relative overflow-hidden">
        <SystemHealthIndicator />
        
        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl w-full">
            
            {/* Panel de Login */}
            <Card className="w-full border-2 border-blue-200 shadow-2xl bg-white/95 backdrop-blur-lg">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Shield className="text-white w-8 h-8" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Mi Campaña PWA
                </CardTitle>
                <p className="text-gray-600">Sistema Electoral Democrático</p>
              </CardHeader>
              
              <CardContent>
                {authError && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{authError}</AlertDescription>
                  </Alert>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-gray-700 font-medium">
                      Usuario o Email
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Desarrollador o dev@demo.com"
                        className="pl-10 border-2 border-gray-300 focus:border-blue-500"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700 font-medium">
                      Contraseña
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="12345678"
                        className="pl-10 pr-10 border-2 border-gray-300 focus:border-blue-500"
                        required
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3" 
                      disabled={isLoading}
                    >
                      {isLoading ? "Autenticando..." : "Iniciar Sesión"}
                    </Button>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowCredentials(!showCredentials)}
                        className="border-2 border-green-500 text-green-700 hover:bg-green-50"
                      >
                        {showCredentials ? "Ocultar" : "Ver"} Credenciales Demo
                      </Button>
                      
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/mobile-audit")}
                        className="border-2 border-blue-500 text-blue-700 hover:bg-blue-50 flex items-center gap-2"
                      >
                        <Smartphone className="w-4 h-4" />
                        Auditoría App
                      </Button>
                    </div>
                  </div>
                </form>
                
                <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs text-blue-700 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <strong className="text-blue-900">✅ Sistema Demo Actualizado</strong>
                  </div>
                  <p>• ✅ Usuarios creados en base de datos</p>
                  <p>• ✅ Contraseña actualizada: <strong>12345678</strong></p>
                  <p>• ✅ Login por nombre de usuario habilitado</p>
                  <p>• ✅ Mapeo automático a emails</p>
                </div>
              </CardContent>
            </Card>

            {/* Panel de Credenciales Demo */}
            {showCredentials && (
              <Card className="w-full border-2 border-green-200 shadow-2xl bg-white/95 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="text-green-800 text-xl flex items-center gap-2">
                    <CheckCircle className="w-6 h-6" />
                    🔥 Credenciales Demo Actualizadas
                  </CardTitle>
                  <p className="text-green-600">Usuarios creados en base de datos - ¡Listo para usar!</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {verifiedCredentials.map((cred, index) => (
                      <div key={index} className="p-4 border-2 border-green-100 rounded-lg hover:bg-green-50 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <div className="font-bold text-lg text-gray-900">{cred.name}</div>
                            <div className="text-sm text-gray-600">{cred.description}</div>
                            <div className="text-xs text-green-600 font-medium">
                              📧 {cred.email}
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => useCredential(cred)}
                            className="text-green-700 border-green-500 hover:bg-green-100"
                          >
                            Usar
                          </Button>
                        </div>
                        <div className="bg-gray-100 p-2 rounded text-xs font-mono border">
                          <div><strong>Usuario:</strong> {cred.name}</div>
                          <div><strong>Email:</strong> {cred.email}</div>
                          <div><strong>Contraseña:</strong> {cred.password}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-green-200">
                    <h3 className="font-bold text-sm text-green-800 mb-3">✅ ¡CREDENCIALES FUNCIONANDO!</h3>
                    <div className="text-xs text-gray-700 space-y-2">
                      <div>1. <strong>Selecciona</strong> una credencial haciendo clic en "Usar"</div>
                      <div>2. <strong>Verifica</strong> que los campos se llenen automáticamente</div>
                      <div>3. <strong>Haz clic</strong> en "Iniciar Sesión"</div>
                      <div className="mt-3 p-2 bg-green-100 rounded border border-green-300">
                        <strong className="text-green-800">🚀 NUEVA CONTRASEÑA:</strong> 12345678 (para todos los usuarios)
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Login;
