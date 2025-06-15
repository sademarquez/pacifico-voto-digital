
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Eye, EyeOff, Terminal, Crown, Target, Users2, User } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, authError } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    console.log('Attempting login with:', { email, password: password ? '***' : 'empty' });

    try {
      const success = await login(email, password);
      
      console.log('Login result:', success);
      
      if (success) {
        toast({
          title: "¡Bienvenido!",
          description: "Has iniciado sesión correctamente.",
        });
        navigate("/dashboard");
      } else {
        toast({
          title: "Error de Acceso",
          description: "Email o contraseña incorrectos. Verifica las credenciales.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Error",
        description: "Ha ocurrido un error al iniciar sesión. Revisa la consola para más detalles.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Usuarios de demostración con sus credenciales
  const demoUsers = [
    {
      role: "Desarrollador",
      email: "dev@micampana.com",
      icon: Shield,
      color: "text-purple-600",
      description: "Control total del sistema"
    },
    {
      role: "Master",
      email: "master1@demo.com", 
      icon: Crown,
      color: "text-red-600",
      description: "Gestión de candidatos"
    },
    {
      role: "Candidato",
      email: "candidato@demo.com",
      icon: Target,
      color: "text-blue-600", 
      description: "Gestión territorial"
    },
    {
      role: "Líder",
      email: "lider@demo.com",
      icon: Users2,
      color: "text-orange-600",
      description: "Coordinación local"
    },
    {
      role: "Votante",
      email: "votante@demo.com",
      icon: User,
      color: "text-green-600",
      description: "Usuario base"
    }
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
            <p className="text-blue-600">Sistema Jerárquico de Gestión Electoral</p>
          </CardHeader>
          <CardContent>
            {authError && (
              <Alert variant="destructive" className="mb-4">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error de Conexión</AlertTitle>
                <AlertDescription>
                  {authError} 
                  <br />
                  <small className="text-xs mt-2 block">
                    Verifica la consola del navegador para más detalles técnicos.
                  </small>
                </AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-blue-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@demo.com"
                  className="border-blue-200 focus:border-blue-500"
                  required
                  disabled={!!authError}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-blue-700">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="micampaña2025"
                    className="border-blue-200 focus:border-blue-500"
                    required
                    disabled={!!authError}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={!!authError}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700" 
                disabled={isLoading || !!authError}
              >
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </form>
            
            {/* Información de debug */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
              <p><strong>Debug Info:</strong></p>
              <p>• URL Base: https://zecltlsdkbndhqimpjjo.supabase.co</p>
              <p>• Usuarios demo disponibles (contraseña: micampaña2025)</p>
              <p>• Si hay errores, revisa la consola del navegador</p>
            </div>
          </CardContent>
        </Card>

        {/* Panel de Usuarios Demo */}
        <Card className="w-full border-green-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-green-700 text-xl">🚀 Estructura Jerárquica</CardTitle>
            <p className="text-green-600">Usuarios de demostración disponibles</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-green-700 font-medium mb-4">
                Contraseña para todos: <span className="bg-green-100 px-2 py-1 rounded">micampaña2025</span>
              </p>
              
              {demoUsers.map((user, index) => {
                const Icon = user.icon;
                return (
                  <div key={index} className="flex items-center gap-3 p-3 border border-green-200 rounded-lg hover:bg-green-50 transition-colors">
                    <Icon className={`w-6 h-6 ${user.color}`} />
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{user.role}</div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                      <div className="text-xs text-gray-500">{user.description}</div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEmail(user.email);
                        setPassword("micampaña2025");
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
              <h3 className="font-medium text-sm text-blue-800 mb-2">📋 Jerarquía del Sistema</h3>
              <div className="text-xs text-blue-700 space-y-1">
                <div>• <strong>Desarrollador:</strong> Crea Masters</div>
                <div>• <strong>Master:</strong> Crea Candidatos</div>
                <div>• <strong>Candidato:</strong> Crea Líderes</div>
                <div>• <strong>Líder:</strong> Crea Votantes</div>
                <div>• <strong>Votante:</strong> Usuario base</div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-xs text-yellow-800">
                <strong>⚠️ Nota:</strong> Los usuarios demo se crearán automáticamente cuando intentes iniciar sesión.
                Si tienes problemas, revisa la consola del navegador para detalles.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
