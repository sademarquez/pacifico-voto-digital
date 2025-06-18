
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Eye, EyeOff, AlertCircle, User, Crown, Users, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDemoCredentials } from "@/hooks/useDemoCredentials";

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
  const { verifiedCredentials } = useDemoCredentials();

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
        title: "¡Acceso Concedido!",
        description: `Bienvenido ${email}`,
      });
    }
  };

  const fillCredentials = (userEmail: string, userName: string) => {
    setEmail(userEmail);
    setPassword('12345678');
    clearAuthError();
    toast({
      title: "Credenciales Cargadas",
      description: `Listo para acceso como ${userName}`,
    });
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'desarrollador': return <Crown className="w-4 h-4 text-amber-600" />;
      case 'master': return <Shield className="w-4 h-4 text-purple-600" />;
      case 'candidato': return <Users className="w-4 h-4 text-blue-600" />;
      case 'lider': return <User className="w-4 h-4 text-green-600" />;
      default: return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="max-w-md w-full mx-auto">
      <Card className="border-2 border-amber-200/50 shadow-2xl bg-white/95 backdrop-blur-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-700 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Sparkles className="text-white w-8 h-8" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-amber-700 to-amber-900 bg-clip-text text-transparent">
            MI CAMPAÑA 2025
          </CardTitle>
          <p className="text-amber-800">Sistema Electoral Premium</p>
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
              <Label htmlFor="email" className="text-amber-800 font-medium">Email Corporativo</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (authError) clearAuthError();
                }}
                placeholder="tu@campana.com"
                className="border-2 border-amber-200 focus:border-amber-500 bg-white/90"
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-amber-800 font-medium">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (authError) clearAuthError();
                  }}
                  placeholder="12345678"
                  className="pr-10 border-2 border-amber-200 focus:border-amber-500 bg-white/90"
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-amber-600 hover:text-amber-800"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-white font-bold py-3 shadow-lg" 
              disabled={isLoading}
            >
              {isLoading ? "Autenticando..." : "Acceder al Sistema"}
            </Button>
          </form>

          {/* Usuarios de prueba con diseño elegante */}
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-amber-700" />
              <strong className="text-amber-900">Credenciales Premium:</strong>
            </div>
            
            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
              {verifiedCredentials.map((user, index) => (
                <Button
                  key={index}
                  type="button"
                  variant="outline"
                  onClick={() => fillCredentials(user.email, user.name)}
                  className="justify-start text-left p-3 h-auto border border-amber-200 hover:bg-amber-50 hover:border-amber-400 transition-all duration-200"
                  disabled={isLoading}
                >
                  <div className="flex items-center gap-2 w-full">
                    {getRoleIcon(user.role)}
                    <div className="flex-1">
                      <div className="font-medium text-sm text-amber-900">{user.name}</div>
                      <div className="text-xs text-amber-600">{user.email}</div>
                    </div>
                    <div className="text-xs text-amber-500 capitalize font-medium">{user.role}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-amber-700" />
              <strong className="text-amber-900">Sistema Premium Activo</strong>
            </div>
            <p className="text-sm text-amber-800">• ✅ Gemini AI 2.0 Flash integrado</p>
            <p className="text-sm text-amber-800">• ✅ Base de datos empresarial</p>
            <p className="text-sm text-amber-800">• ✅ Gestión multi-usuario completa</p>
            <p className="text-sm text-amber-800">• ✅ Tema elegante dorado premium</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
