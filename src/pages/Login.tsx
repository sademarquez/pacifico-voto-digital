
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    console.log('Login attempt with:', email, password);

    try {
      const success = await login(email, password);
      console.log('Login result:', success);
      
      if (success) {
        toast({
          title: "Bienvenido",
          description: "Has iniciado sesión correctamente",
        });
        navigate("/");
      } else {
        toast({
          title: "Error",
          description: "Email o contraseña incorrectos. Verifica las credenciales demo.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Error",
        description: "Ha ocurrido un error al iniciar sesión",
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-blue-700">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@micampaña.com"
                className="border-blue-200 focus:border-blue-500"
                required
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
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700" 
              disabled={isLoading}
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-medium text-sm text-blue-700 mb-2">👥 Usuarios Demo Funcionales:</h3>
            <div className="space-y-2 text-xs text-blue-600">
              <div className="bg-white p-2 rounded border-l-4 border-red-400">
                <p><strong>🔴 MASTER:</strong> master@micampaña.com</p>
                <p className="text-gray-600">• Puede crear usuarios Candidato</p>
              </div>
              <div className="bg-white p-2 rounded border-l-4 border-blue-400">
                <p><strong>🔵 CANDIDATO:</strong> candidato@micampaña.com</p>
                <p className="text-gray-600">• Puede crear usuarios Votante</p>
              </div>
              <div className="bg-white p-2 rounded border-l-4 border-green-400">
                <p><strong>🟢 VOTANTE:</strong> votante@micampaña.com</p>
                <p className="text-gray-600">• Usuario final del sistema</p>
              </div>
              <div className="mt-3 p-2 bg-yellow-100 rounded text-center">
                <p><strong>🔑 Contraseña para todos:</strong> <code className="bg-yellow-200 px-1 rounded">micampaña2025</code></p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
