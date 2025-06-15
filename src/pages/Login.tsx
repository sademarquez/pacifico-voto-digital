
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Eye, EyeOff, Crown, Target, Users2, User, Plus, AlertCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useDemoUsers } from "@/hooks/useDemoUsers";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("12345678");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingUsers, setIsCreatingUsers] = useState(false);
  
  const { login, authError, clearAuthError, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createAllDemoUsers, FIXED_PASSWORD } = useDemoUsers();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // Limpiar error cuando el usuario modifica campos
  useEffect(() => {
    if (authError && (email || password !== "12345678")) {
      clearAuthError();
    }
  }, [email, password, authError, clearAuthError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Campo requerido",
        description: "Por favor ingresa tu nombre de usuario.",
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

    console.log('[LOGIN-UI] Iniciando login:', email);

    try {
      const success = await login(email.trim(), password);
      
      if (success) {
        toast({
          title: "¡Bienvenido!",
          description: `Login exitoso como ${email}.`,
        });
        // La redirección se maneja automáticamente por el useEffect
      }
    } catch (error) {
      console.error('[LOGIN-UI] Error durante login:', error);
      toast({
        title: "Error",
        description: "Error inesperado. Revisa la consola.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateDemoUsers = async () => {
    setIsCreatingUsers(true);
    try {
      await createAllDemoUsers();
      toast({
        title: "Usuarios creados",
        description: `Usuarios demo creados con contraseña: ${FIXED_PASSWORD}`,
      });
    } catch (error) {
      console.error('[LOGIN-UI] Error creando usuarios demo:', error);
      toast({
        title: "Error",
        description: "Error al crear usuarios demo.",
        variant: "destructive"
      });
    } finally {
      setIsCreatingUsers(false);
    }
  };

  const demoUsersDisplay = [
    { role: "Desarrollador", name: "Desarrollador", icon: Shield, color: "text-purple-600" },
    { role: "Master", name: "Master", icon: Crown, color: "text-red-600" },
    { role: "Candidato", name: "Candidato", icon: Target, color: "text-blue-600" },
    { role: "Líder", name: "Lider", icon: Users2, color: "text-orange-600" },
    { role: "Votante", name: "Votante", icon: User, color: "text-green-600" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl w-full">
        {/* Panel de Login */}
        <Card className="w-full border-blue-200 shadow-lg">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="text-white w-8 h-8" />
            </div>
            <CardTitle className="text-2xl font-bold text-blue-700">MI CAMPAÑA 2025</CardTitle>
            <p className="text-blue-600">Sistema de Gestión Electoral</p>
          </CardHeader>
          <CardContent>
            {authError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error de Acceso</AlertTitle>
                <AlertDescription>
                  {authError}
                  <br />
                  <small className="text-xs mt-2 block">
                    Contraseña fija: <strong>12345678</strong>
                  </small>
                </AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-blue-700">Nombre de Usuario</Label>
                <Input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Desarrollador"
                  className="border-blue-200 focus:border-blue-500"
                  required
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500">Usa: "Desarrollador", "Master", "Candidato", "Lider" o "Votante"</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-blue-700">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="12345678"
                    className="border-blue-200 focus:border-blue-500"
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                <p className="text-xs text-green-600 font-medium">
                  Contraseña fija: <span className="bg-green-100 px-1 rounded">12345678</span>
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700" 
                disabled={isLoading}
              >
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </form>
            
            <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
              <p><strong>Info del Sistema:</strong></p>
              <p>• Contraseña fija: <strong>12345678</strong></p>
              <p>• Login por nombre habilitado</p>
              {authError && <p className="text-red-600 mt-1">• Error: {authError}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Panel de Usuarios Demo */}
        <Card className="w-full border-green-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-green-700 text-xl">🚀 Usuarios Demo</CardTitle>
            <p className="text-green-600">Usuarios disponibles para pruebas</p>
            <Button
              onClick={handleCreateDemoUsers}
              disabled={isCreatingUsers}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              {isCreatingUsers ? "Creando usuarios..." : "Crear usuarios demo"}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-green-700 font-medium mb-4">
                Contraseña para todos: <span className="bg-green-100 px-2 py-1 rounded font-bold">12345678</span>
              </p>
              
              {demoUsersDisplay.map((user, index) => {
                const Icon = user.icon;
                return (
                  <div key={index} className="flex items-center gap-3 p-3 border border-green-200 rounded-lg hover:bg-green-50 transition-colors">
                    <Icon className={`w-6 h-6 ${user.color}`} />
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{user.role}</div>
                      <div className="text-sm text-gray-600">Usuario: {user.name}</div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEmail(user.name);
                        setPassword("12345678");
                        clearAuthError();
                      }}
                      className="text-green-600 border-green-300 hover:bg-green-100"
                    >
                      Usar
                    </Button>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-medium text-sm text-blue-800 mb-2">📋 Estructura del Sistema</h3>
              <div className="text-xs text-blue-700 space-y-1">
                <div>• <strong>Desarrollador:</strong> Control total</div>
                <div>• <strong>Master:</strong> Gestión candidatos</div>
                <div>• <strong>Candidato:</strong> Gestión territorial</div>
                <div>• <strong>Líder:</strong> Coordinación local</div>
                <div>• <strong>Votante:</strong> Usuario base</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
