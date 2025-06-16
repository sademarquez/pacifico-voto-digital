
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Eye, EyeOff, AlertCircle, User, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
  authError: string | null;
  clearAuthError: () => void;
}

const LoginForm = ({ onLogin, isLoading, authError, clearAuthError }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Campo requerido",
        description: "Ingresa tu email",
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

    console.log('🔐 Enviando login desde formulario:', { email });
    const result = await onLogin(email.trim(), password.trim());
    
    if (result.success) {
      toast({
        title: "¡Bienvenido!",
        description: `Acceso concedido a ${email}`,
      });
    }
  };

  const fillCreatorCredentials = () => {
    setEmail('sademarquez@micampana.com');
    setPassword('majomariana1207');
    clearAuthError();
    toast({
      title: "Credenciales del Creador",
      description: "Listo para acceso como Santiago De Márquez",
    });
  };

  return (
    <div className="max-w-md w-full mx-auto">
      <Card className="border-2 border-blue-200 shadow-2xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Shield className="text-white w-8 h-8" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            MI CAMPAÑA 2025
          </CardTitle>
          <p className="text-gray-600">Sistema Electoral Profesional</p>
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
              <Label htmlFor="email">Email Corporativo</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (authError) clearAuthError();
                }}
                placeholder="tu@micampana.com"
                className="border-2 border-gray-300 focus:border-blue-500"
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (authError) clearAuthError();
                  }}
                  placeholder="Tu contraseña segura"
                  className="pr-10 border-2 border-gray-300 focus:border-blue-500"
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3" 
                disabled={isLoading}
              >
                {isLoading ? "Autenticando..." : "Acceder al Sistema"}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={fillCreatorCredentials}
                className="w-full border-2 border-amber-500 text-amber-700 hover:bg-amber-50 flex items-center gap-2"
                disabled={isLoading}
              >
                <Crown className="w-4 h-4" />
                Acceso del Creador
              </Button>
            </div>
          </form>
          
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-5 h-5 text-blue-600" />
              <strong className="text-blue-900">Sistema Profesional Activo</strong>
            </div>
            <p className="text-sm text-blue-700">• ✅ Base de datos empresarial</p>
            <p className="text-sm text-blue-700">• ✅ Integración Gemini AI</p>
            <p className="text-sm text-blue-700">• ✅ Importación masiva de datos</p>
            <p className="text-sm text-blue-700">• ✅ Gestión multi-usuario</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
