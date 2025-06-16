
import { useState } from 'react';
import { useSecureAuth } from '@/contexts/SecureAuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useDemoUsers } from '@/hooks/useDemoUsers';
import { 
  Vote, 
  Eye, 
  EyeOff, 
  LogIn, 
  ArrowRight, 
  Map,
  Shield,
  Sparkles,
  Globe,
  Crown,
  TrendingUp,
  Users
} from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  const { login, isAuthenticated } = useSecureAuth();
  const navigate = useNavigate();
  const { demoUsers, databaseStats, FIXED_PASSWORD } = useDemoUsers();

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
      
      if (result) {
        console.log('✅ Login exitoso, redirigiendo...');
        navigate('/dashboard');
      } else {
        setError('Credenciales incorrectas. Verifica tu email y contraseña.');
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

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'desarrollador': return <Shield className="w-4 h-4 text-purple-600" />;
      case 'master': return <Crown className="w-4 h-4 text-blue-600" />;
      case 'candidato': return <Vote className="w-4 h-4 text-green-600" />;
      case 'lider': return <Users className="w-4 h-4 text-orange-600" />;
      case 'votante': return <Globe className="w-4 h-4 text-indigo-600" />;
      default: return <Users className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background elegante */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(59,130,246,0.05)_120deg,transparent_240deg)]"></div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Panel izquierdo - Presentación elegante */}
          <div className="hidden lg:flex flex-col justify-center space-y-8 text-white">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Crown className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                    MI CAMPAÑA
                  </h1>
                  <p className="text-2xl font-semibold text-blue-200">2025</p>
                  <p className="text-lg opacity-90">Automatización Electoral con IA</p>
                </div>
              </div>
              
              <div className="space-y-6 mt-12">
                <div className="flex items-center space-x-4 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                  <TrendingUp className="w-8 h-8 text-green-300" />
                  <div>
                    <h3 className="text-xl font-bold">Resultados Garantizados</h3>
                    <p className="text-blue-200">ROI +280% • Engagement +340%</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                  <Sparkles className="w-8 h-8 text-yellow-300" />
                  <div>
                    <h3 className="text-xl font-bold">IA Generativa Avanzada</h3>
                    <p className="text-blue-200">Gemini + N8N • Automatización Total</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                  <Users className="w-8 h-8 text-blue-300" />
                  <div>
                    <h3 className="text-xl font-bold">Base Masiva</h3>
                    <p className="text-blue-200">{databaseStats.demo.users.toLocaleString()} usuarios activos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Panel derecho - Login elegante */}
          <div className="flex items-center justify-center">
            <Card className="w-full max-w-lg bg-white/95 backdrop-blur-xl border-0 shadow-2xl">
              <CardHeader className="space-y-4 text-center pb-8">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-xl">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent mb-2">
                    Acceso Seguro
                  </CardTitle>
                  <p className="text-gray-600">Plataforma Electoral Empresarial</p>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Botón principal de Visitante */}
                <div className="text-center">
                  <Button 
                    onClick={() => navigate('/visitor-funnel')}
                    size="lg"
                    className="w-full h-14 text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Map className="w-6 h-6 mr-3" />
                    <div className="flex flex-col">
                      <span>DESCUBRE TU ZONA</span>
                      <span className="text-sm opacity-90">Mapa Inteligente + IA</span>
                    </div>
                    <ArrowRight className="w-6 h-6 ml-3" />
                  </Button>
                </div>

                {/* Divisor */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm uppercase">
                    <span className="bg-white px-4 text-gray-500 font-medium">Acceso Administrativo</span>
                  </div>
                </div>

                {/* Formulario de login */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-medium">Email Corporativo</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="usuario@micampana.com"
                      required
                      disabled={isLoading}
                      className="h-12 border-2 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700 font-medium">Contraseña</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Contraseña segura"
                        required
                        disabled={isLoading}
                        className="h-12 border-2 focus:border-blue-500 pr-12 transition-colors"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  {error && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertDescription className="text-sm text-red-700">{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Verificando...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <LogIn className="w-5 h-5" />
                        Iniciar Sesión
                      </div>
                    )}
                  </Button>
                </form>

                {/* Enlace discreto para credenciales */}
                <div className="text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCredentials(!showCredentials)}
                    className="text-gray-500 hover:text-gray-700 text-sm"
                  >
                    {showCredentials ? 'Ocultar' : 'Ver'} credenciales de prueba
                  </Button>
                </div>

                {/* Panel de credenciales - Solo visible cuando se solicita */}
                {showCredentials && (
                  <div className="bg-gray-50 rounded-xl p-4 border">
                    <h4 className="font-semibold text-gray-800 mb-3 text-sm">Credenciales de Prueba</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {demoUsers.slice(0, 5).map((user, index) => (
                        <div key={index} className="bg-white rounded-lg p-3 border hover:border-blue-200 transition-colors">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center space-x-2">
                              {getRoleIcon(user.role)}
                              <span className="font-medium text-sm text-gray-800">{user.name}</span>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => quickLogin(user.email, FIXED_PASSWORD)}
                              disabled={isLoading}
                              className="text-xs h-7 px-3"
                            >
                              Usar
                            </Button>
                          </div>
                          <div className="text-xs text-gray-600 mb-1">{user.role}</div>
                          <div className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {user.email}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
