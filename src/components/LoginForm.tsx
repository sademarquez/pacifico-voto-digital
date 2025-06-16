
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
  authError: string | null;
  clearAuthError: () => void;
}

interface DemoCredential {
  name: string;
  email: string;
  password: string;
  role: string;
  description: string;
}

const DEMO_CREDENTIALS: DemoCredential[] = [
  {
    name: 'Desarrollador',
    email: 'dev@demo.com',
    password: '12345678',
    role: 'desarrollador',
    description: 'Acceso completo de desarrollador'
  },
  {
    name: 'Master',
    email: 'master@demo.com', 
    password: '12345678',
    role: 'master',
    description: 'Gestión completa de campaña'
  },
  {
    name: 'Candidato',
    email: 'candidato@demo.com',
    password: '12345678',
    role: 'candidato', 
    description: 'Gestión territorial especializada'
  },
  {
    name: 'Líder',
    email: 'lider@demo.com',
    password: '12345678',
    role: 'lider',
    description: 'Coordinación territorial local'
  },
  {
    name: 'Votante',
    email: 'votante@demo.com',
    password: '12345678',
    role: 'votante',
    description: 'Usuario final del sistema'
  }
];

const LoginForm = ({ onLogin, isLoading, authError, clearAuthError }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
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
        title: "¡Login exitoso!",
        description: `Bienvenido ${email}`,
      });
    }
  };

  const useCredential = (credential: DemoCredential) => {
    setEmail(credential.email);
    setPassword(credential.password);
    clearAuthError();
    toast({
      title: "Credenciales cargadas",
      description: `Listo para login como ${credential.name}`,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl w-full">
      {/* Panel de Login */}
      <Card className="w-full border-2 border-blue-200 shadow-2xl">
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
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (authError) clearAuthError();
                }}
                placeholder="dev@demo.com"
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
                  placeholder="12345678"
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
                {isLoading ? "Autenticando..." : "Iniciar Sesión"}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCredentials(!showCredentials)}
                className="w-full border-2 border-green-500 text-green-700 hover:bg-green-50"
                disabled={isLoading}
              >
                {showCredentials ? "Ocultar" : "Ver"} Credenciales Demo
              </Button>
            </div>
          </form>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs text-blue-700 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <strong className="text-blue-900">✅ Sistema Demo Funcional</strong>
            </div>
            <p>• ✅ Base de datos Supabase conectada</p>
            <p>• ✅ Usuarios demo creados</p>
            <p>• ✅ Contraseña: <strong>12345678</strong></p>
            <p>• ✅ Login automático al dashboard</p>
          </div>
        </CardContent>
      </Card>

      {/* Panel de Credenciales */}
      {showCredentials && (
        <Card className="w-full border-2 border-green-200 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-green-800 text-xl flex items-center gap-2">
              <CheckCircle className="w-6 h-6" />
              Credenciales Demo Verificadas
            </CardTitle>
            <p className="text-green-600">Sistema con base de datos real</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {DEMO_CREDENTIALS.map((cred, index) => (
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
                      disabled={isLoading}
                    >
                      Usar
                    </Button>
                  </div>
                  <div className="bg-gray-100 p-2 rounded text-xs font-mono border">
                    <div><strong>Email:</strong> {cred.email}</div>
                    <div><strong>Contraseña:</strong> {cred.password}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LoginForm;
