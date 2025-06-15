import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Vote, Eye, EyeOff, LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirigir si ya está autenticado
  if (isAuthenticated) {
    navigate('/dashboard');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(email, password);
      
      if (result.success) {
        console.log('✅ Login exitoso, redirigiendo...');
        navigate('/dashboard');
      } else {
        setError(result.error || 'Error desconocido en el login');
      }
    } catch (error) {
      console.error('💥 Error crítico en handleSubmit:', error);
      setError('Error de conexión. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = (testEmail: string, testPassword: string) => {
    setEmail(testEmail);
    setPassword(testPassword);
    setError('');
  };

  // Credenciales reales que funcionan con la base de datos + nueva credencial visitante
  const realCredentials = [
    { email: 'admin@micampana.com', password: 'AdminSecure2025!', role: 'Desarrollador', description: 'Control total del sistema' },
    { email: 'master@micampana.com', password: 'MasterSecure2025!', role: 'Master', description: 'Gestión de candidatos y campañas' },
    { email: 'candidato@micampana.com', password: 'CandidatoSecure2025!', role: 'Candidato', description: 'Liderazgo territorial y equipos' },
    { email: 'lider@micampana.com', password: 'LiderSecure2025!', role: 'Líder', description: 'Coordinación local y votantes' },
    { email: 'visitante@micampana.com', password: 'VisitanteSecure2025!', role: 'Visitante', description: 'Acceso público a información comunitaria' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0">
          <CardHeader className="space-y-2 text-center">
            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <Vote className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Mi Campaña</CardTitle>
            <p className="text-gray-600">Sistema Electoral 2025</p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@micampana.com"
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
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña segura"
                    required
                    disabled={isLoading}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription className="text-sm">{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Iniciando sesión...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn className="w-4 h-4" />
                    Iniciar Sesión
                  </div>
                )}
              </Button>

              {/* Panel de credenciales de acceso */}
              <div className="border-t pt-6 mt-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-800 mb-3 text-center">
                    🔑 Credenciales de Acceso Demo
                  </h3>
                  <div className="space-y-3">
                    {realCredentials.map((cred, index) => (
                      <div key={index} className="bg-white rounded border p-3">
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <span className="font-medium text-sm text-gray-800">{cred.role}</span>
                            <p className="text-xs text-gray-500">{cred.description}</p>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => quickLogin(cred.email, cred.password)}
                            disabled={isLoading}
                            className="text-xs h-6 px-2"
                          >
                            Usar
                          </Button>
                        </div>
                        <div className="text-xs text-gray-600 space-y-1">
                          <div><strong>Email:</strong> {cred.email}</div>
                          <div><strong>Pass:</strong> {cred.password}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 text-xs text-gray-500 text-center">
                    Haz clic en "Usar" para completar automáticamente los campos
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
