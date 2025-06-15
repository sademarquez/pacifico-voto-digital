
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Eye, EyeOff, Terminal } from "lucide-react";
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

    try {
      const success = await login(email, password);
      
      if (success) {
        toast({
          title: "¡Bienvenido!",
          description: "Has iniciado sesión correctamente.",
        });
        navigate("/");
      } else {
        // El authError del contexto ya informa de problemas de conexión.
        // Este toast es para credenciales inválidas.
        if (!authError) {
          toast({
            title: "Error de Acceso",
            description: "Email o contraseña incorrectos.",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Error",
        description: "Ha ocurrido un error al iniciar sesión.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-blue-200 shadow-lg">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Shield className="text-white w-8 h-8" />
          </div>
          <CardTitle className="text-2xl font-bold text-blue-700">MI CAMPAÑA 2025</CardTitle>
          <p className="text-blue-600">Inicia sesión en tu cuenta</p>
        </CardHeader>
        <CardContent>
          {authError && (
            <Alert variant="destructive" className="mb-4">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error de Conexión</AlertTitle>
              <AlertDescription>
                {authError} Por favor, intenta refrescar la página.
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
                  placeholder="Tu contraseña"
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

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">¿No tienes una cuenta?</p>
            <Button variant="link" className="text-blue-600" onClick={() => navigate('/registro')}>
              Regístrate aquí
            </Button>
          </div>

          <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
             <h3 className="font-medium text-sm text-green-800 mb-2">🚀 ¡Sistema Actualizado y Funcionando!</h3>
             <p className="text-xs text-green-700">
               La aplicación ahora tiene una base de datos real y un sistema de usuarios completamente funcional. 
               Los usuarios master pueden crear candidatos, y los candidatos pueden crear votantes.
             </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
