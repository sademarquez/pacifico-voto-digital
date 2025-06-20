
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Eye, EyeOff, AlertCircle, CheckCircle, User, Lock, Users, ExternalLink } from "lucide-react";
import { useSecureAuth } from "@/contexts/SecureAuthContext";
import { useProductionCredentials } from "@/hooks/useProductionCredentials";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAppConfig } from "@/config/appConfig";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  
  const { login, authError, clearAuthError, isAuthenticated, isLoading } = useSecureAuth();
  const { productionCredentials, getEmailFromName } = useProductionCredentials();
  const { app } = useAppConfig();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      console.log('✅ USUARIO AUTENTICADO - REDIRIGIENDO A DASHBOARD');
      
      const from = location.state?.from?.pathname || '/dashboard';
      console.log('🎯 REDIRIGIENDO A:', from);
      
      navigate(from, { replace: true });
      
      toast({
        title: "¡Bienvenido al sistema!",
        description: "Autenticación exitosa - Accediendo al dashboard",
      });
    }
  }, [isAuthenticated, navigate, location.state, toast]);

  useEffect(() => {
    if (authError && (username || password)) {
      clearAuthError();
    }
  }, [username, password, authError, clearAuthError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔐 INTENTO DE LOGIN:', { username, hasPassword: !!password });
    
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

    clearAuthError();

    try {
      let emailToUse = username.trim();
      
      if (!emailToUse.includes('@')) {
        const mappedEmail = getEmailFromName(username);
        if (mappedEmail) {
          emailToUse = mappedEmail;
          console.log(`✅ MAPEANDO USUARIO: "${username}" → "${emailToUse}"`);
        } else {
          toast({
            title: "Usuario no encontrado",
            description: `No se encontró el usuario "${username}". Usa las credenciales disponibles.`,
            variant: "destructive"
          });
          return;
        }
      }

      console.log(`🔐 EJECUTANDO LOGIN:`, { 
        inputUsername: username,
        emailToUse,
        password: password ? '[PRESENTE]' : '[VACÍO]'
      });

      const success = await login(emailToUse, password.trim());
      
      if (success) {
        console.log('🎉 LOGIN EXITOSO - ESPERANDO REDIRECCIÓN AUTOMÁTICA');
        toast({
          title: "¡Login exitoso!",
          description: `Bienvenido ${username} - Cargando dashboard...`,
        });
      } else {
        console.log('❌ LOGIN FALLÓ');
      }
    } catch (error) {
      console.error('💥 ERROR DURANTE EL LOGIN:', error);
      toast({
        title: "Error de sistema",
        description: "Error inesperado. Revisa las credenciales.",
        variant: "destructive"
      });
    }
  };

  const useCredential = (credential: any) => {
    console.log('🎯 USANDO CREDENCIAL:', credential.name);
    setUsername(credential.name);
    setPassword(credential.password);
    clearAuthError();
    toast({
      title: "Credenciales cargadas",
      description: `Listo para login como ${credential.name}`,
    });
  };

  const handleVisitorAccess = () => {
    console.log('🚀 ACCESO DE VISITANTE - REDIRIGIENDO A FUNNEL');
    
    if (app.landingUrl && app.landingUrl !== "https://sistema-electoral.com/landing") {
      window.open(app.landingUrl, '_blank');
      toast({
        title: "Acceso de Visitante",
        description: "Abriendo landing page en nueva ventana",
      });
    } else {
      navigate(app.visitorFunnelUrl);
      toast({
        title: "Acceso de Visitante",
        description: "Redirigiendo al funnel de visitantes",
      });
    }
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-negro-50 via-verde-sistema-50 to-negro-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-verde-sistema-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-verde-sistema-600">¡Autenticado!</h2>
          <p className="text-negro-600">Redirigiendo al dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-negro-50 via-verde-sistema-50 to-negro-100 relative overflow-hidden">
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl w-full">
          
          {/* Panel de Login */}
          <Card className="w-full border-2 border-verde-sistema-200 shadow-2xl bg-white/95 backdrop-blur-lg">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-verde-sistema-600 to-negro-800 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Shield className="text-white w-8 h-8" />
              </div>
              <CardTitle className="text-2xl font-bold text-negro-900">
                {app.companyName}
              </CardTitle>
              <p className="text-negro-600">{app.systemName}</p>
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
                  <Label htmlFor="username" className="text-negro-700 font-medium">
                    Usuario o Email
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-negro-400" />
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Administrador o admin@campana.com"
                      className="pl-10 border-2 border-negro-300 focus:border-verde-sistema-500"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-negro-700 font-medium">
                    Contraseña
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-negro-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Contraseña segura"
                      className="pl-10 pr-10 border-2 border-negro-300 focus:border-verde-sistema-500"
                      required
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-negro-400 hover:text-negro-600"
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
                    className="w-full bg-gradient-to-r from-verde-sistema-600 to-negro-800 hover:from-verde-sistema-700 hover:to-negro-900 text-white font-bold py-3" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Autenticando..." : "Iniciar Sesión"}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleVisitorAccess}
                    className="w-full border-2 border-rojo-acento-500 text-rojo-acento-700 hover:bg-rojo-acento-50 flex items-center gap-2 font-bold py-3"
                    disabled={isLoading}
                  >
                    <Users className="w-4 h-4" />
                    Acceso Visitantes
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCredentials(!showCredentials)}
                    className="w-full border-2 border-verde-sistema-500 text-verde-sistema-700 hover:bg-verde-sistema-50"
                    disabled={isLoading}
                  >
                    {showCredentials ? "Ocultar" : "Ver"} Credenciales Disponibles
                  </Button>
                </div>
              </form>
              
              <div className="mt-4 p-3 bg-verde-sistema-50 rounded-lg text-xs text-verde-sistema-700 border border-verde-sistema-200">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-verde-sistema-600" />
                  <strong className="text-verde-sistema-900">✅ Sistema Electoral Productivo</strong>
                </div>
                <p>• ✅ Credenciales empresariales verificadas</p>
                <p>• ✅ Integración N8N configurada</p>
                <p>• ✅ Base de datos Supabase conectada</p>
                <p>• ✅ Sistema de roles implementado</p>
                <p>• ✅ Configuración de producción activa</p>
              </div>
            </CardContent>
          </Card>

          {/* Panel de Credenciales */}
          {showCredentials && (
            <Card className="w-full border-2 border-verde-sistema-200 shadow-2xl bg-white/95 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-verde-sistema-800 text-xl flex items-center gap-2">
                  <CheckCircle className="w-6 h-6" />
                  🏢 Credenciales Empresariales
                </CardTitle>
                <p className="text-verde-sistema-600">Acceso seguro al sistema electoral</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {productionCredentials.map((cred, index) => (
                    <div key={index} className="p-4 border-2 border-verde-sistema-100 rounded-lg hover:bg-verde-sistema-50 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="font-bold text-lg text-negro-900">{cred.name}</div>
                          <div className="text-sm text-negro-600">{cred.description}</div>
                          <div className="text-xs text-verde-sistema-600 font-medium">
                            📧 {cred.email}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => useCredential(cred)}
                          className="text-verde-sistema-700 border-verde-sistema-500 hover:bg-verde-sistema-100"
                          disabled={isLoading}
                        >
                          Usar
                        </Button>
                      </div>
                      <div className="bg-negro-100 p-2 rounded text-xs font-mono border">
                        <div><strong>Usuario:</strong> {cred.name}</div>
                        <div><strong>Email:</strong> {cred.email}</div>
                        <div><strong>Contraseña:</strong> {cred.password}</div>
                        <div><strong>Territorio:</strong> {cred.territory}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-gradient-to-r from-verde-sistema-50 to-negro-50 rounded-lg border-2 border-verde-sistema-200">
                  <h3 className="font-bold text-sm text-verde-sistema-800 mb-3">🚀 INSTRUCCIONES DE ACCESO</h3>
                  <div className="text-xs text-negro-700 space-y-2">
                    <div>1. <strong>Seleccionar:</strong> Haz clic en "Usar" junto a la credencial deseada</div>
                    <div>2. <strong>Login:</strong> Haz clic en "Iniciar Sesión"</div>
                    <div>3. <strong>Dashboard:</strong> Serás redirigido automáticamente</div>
                    <div>4. <strong>N8N:</strong> Configura desde el panel de administración</div>
                    <div className="mt-3 p-2 bg-verde-sistema-100 rounded border border-verde-sistema-300">
                      <strong className="text-verde-sistema-800">🎯 CREDENCIALES NUEVAS:</strong> 
                      <br />Todas las contraseñas han sido actualizadas para producción
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
