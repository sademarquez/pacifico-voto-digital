
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Vote, Eye, EyeOff, LogIn, MapPin, Users } from 'lucide-react';

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

  // Acceso directo como visitante (sin credenciales)
  const handleVisitorAccess = () => {
    navigate('/mapa-alertas');
  };

  // Credenciales reales que funcionan con la base de datos
  const realCredentials = [
    { email: 'admin@micampana.com', password: 'AdminSecure2025!', role: 'Desarrollador', description: 'Control total del sistema' },
    { email: 'master@micampana.com', password: 'MasterSecure2025!', role: 'Master', description: 'Gestión de candidatos y campañas' },
    { email: 'candidato@micampana.com', password: 'CandidatoSecure2025!', role: 'Candidato', description: 'Liderazgo territorial y equipos' },
    { email: 'lider@micampana.com', password: 'LiderSecure2025!', role: 'Líder', description: 'Coordinación local y votantes' },
    { email: 'votante@micampana.com', password: 'VotanteSecure2025!', role: 'Votante', description: 'Colaborador activo de campaña' }
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
            {/* Botón especial para visitantes */}
            <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg">
              <div className="text-center mb-3">
                <MapPin className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <h3 className="font-semibold text-orange-800">¿Eres Visitante?</h3>
                <p className="text-sm text-orange-700 mb-3">
                  Explora tu comunidad sin necesidad de registrarte
                </p>
              </div>
              <Button 
                onClick={handleVisitorAccess}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                disabled={isLoading}
              >
                <Users className="w-4 h-4 mr-2" />
                Acceder como Visitante
              </Button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">O inicia sesión</span>
              </div>
            </div>

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
