
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
  MapPin, 
  Users, 
  ArrowRight, 
  Map,
  Zap,
  Shield,
  Sparkles,
  Target,
  Globe,
  Crown,
  Star,
  TrendingUp,
  Database
} from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useSecureAuth();
  const navigate = useNavigate();
  const { demoUsers, databaseStats } = useDemoUsers();

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
        setError('Error de autenticación. Verifica tus credenciales.');
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
      case 'candidato': return <Star className="w-4 h-4 text-green-600" />;
      case 'lider': return <Target className="w-4 h-4 text-orange-600" />;
      case 'votante': return <Vote className="w-4 h-4 text-indigo-600" />;
      default: return <Users className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'desarrollador': return 'border-purple-300 hover:bg-purple-50';
      case 'master': return 'border-blue-300 hover:bg-blue-50';
      case 'candidato': return 'border-green-300 hover:bg-green-50';
      case 'lider': return 'border-orange-300 hover:bg-orange-50';
      case 'votante': return 'border-indigo-300 hover:bg-indigo-50';
      default: return 'border-gray-300 hover:bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background moderno con gradientes */}
      <div className="absolute inset-0 gradient-bg-primary"></div>
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 1px, transparent 1px),
                           radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }}
      ></div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Panel izquierdo - Presentación moderna */}
          <div className="hidden lg:flex flex-col justify-center space-y-8 text-white">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold">MI CAMPAÑA 2025</h1>
                  <p className="text-xl opacity-90">Automatización Electoral con IA</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-white bg-opacity-10 rounded-xl backdrop-blur-sm">
                  <Database className="w-6 h-6 text-green-300" />
                  <div>
                    <h3 className="font-semibold">Base Demo Completa</h3>
                    <p className="text-sm opacity-80">{databaseStats.totalUsers.toLocaleString()} usuarios, {databaseStats.territories} territorios</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-white bg-opacity-10 rounded-xl backdrop-blur-sm">
                  <TrendingUp className="w-6 h-6 text-blue-300" />
                  <div>
                    <h3 className="font-semibold">Métricas en Tiempo Real</h3>
                    <p className="text-sm opacity-80">{databaseStats.votes.toLocaleString()} votos simulados</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-white bg-opacity-10 rounded-xl backdrop-blur-sm">
                  <Zap className="w-6 h-6 text-yellow-300" />
                  <div>
                    <h3 className="font-semibold">IA + N8N Integrado</h3>
                    <p className="text-sm opacity-80">Análisis predictivo y automatización avanzada</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Panel derecho - Login moderno optimizado */}
          <div className="flex items-center justify-center">
            <Card className="campaign-card w-full max-w-lg bg-white bg-opacity-95 backdrop-blur-xl border-0 shadow-modern-xl">
              <CardHeader className="space-y-4 text-center pb-6">
                <div className="mx-auto w-20 h-20 gradient-bg-primary rounded-2xl flex items-center justify-center shadow-modern-lg">
                  <Vote className="w-10 h-10 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold gradient-text-primary mb-2">
                    Acceso Demo Completo
                  </CardTitle>
                  <p className="text-gray-600 font-medium">Base de Datos Electoral con {databaseStats.totalUsers.toLocaleString()} usuarios</p>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Botón principal de Visitante - Funnel con mapa IA */}
                <div className="text-center space-y-4">
                  <Button 
                    onClick={() => navigate('/visitor-funnel')}
                    size="lg"
                    className="w-full btn-modern-primary h-16 text-lg font-bold shadow-modern-md hover:shadow-modern-lg bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700"
                  >
                    <Map className="w-6 h-6 mr-3" />
                    <div className="flex flex-col">
                      <span>DESCUBRE TU ZONA</span>
                      <span className="text-sm opacity-90">Mapa + IA + Alertas Georreferenciadas</span>
                    </div>
                    <ArrowRight className="w-6 h-6 ml-3" />
                  </Button>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-800">
                      🤖 <strong>Funnel Inteligente:</strong> {databaseStats.territories} territorios, {databaseStats.alerts} alertas activas, candidatos con propuestas reales
                    </p>
                  </div>
                </div>

                {/* Divisor elegante */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-4 text-blue-600 font-bold">Acceso Administrativo</span>
                  </div>
                </div>

                {/* Formulario de login moderno */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-bold">Email Demo</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="usuario@micampana.com"
                      required
                      disabled={isLoading}
                      className="h-12 border-2 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700 font-bold">Contraseña Demo</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="*Secure2025!"
                        required
                        disabled={isLoading}
                        className="h-12 border-2 focus:border-blue-500 pr-12"
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

                  <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Iniciando sesión...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <LogIn className="w-4 h-4" />
                        Acceso Demo
                      </div>
                    )}
                  </Button>
                </form>

                {/* Panel de credenciales demo mejorado */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-4 border-2 border-blue-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-blue-800">Base Demo Completa - 100K+ Usuarios</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2 max-h-80 overflow-y-auto">
                    {demoUsers.map((user, index) => (
                      <div key={index} className={`bg-white rounded-lg p-3 border-2 transition-all shadow-sm hover:shadow-md ${getRoleColor(user.role)}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {getRoleIcon(user.role)}
                            <div>
                              <span className="font-semibold text-sm text-gray-800">{user.name}</span>
                              {user.territory && (
                                <div className="text-xs text-gray-600">📍 {user.territory}</div>
                              )}
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => quickLogin(user.email, user.password)}
                            disabled={isLoading}
                            className="text-xs h-7 px-2"
                          >
                            Usar
                          </Button>
                        </div>
                        <div className="text-xs text-gray-600 mb-1">{user.description}</div>
                        <div className="text-xs font-mono bg-gray-100 px-2 py-1 rounded border">
                          {user.email}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-600 text-white rounded-lg">
                    <div className="text-sm font-bold mb-2">📊 Estadísticas de la Base Demo:</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>👥 {databaseStats.totalUsers.toLocaleString()} usuarios</div>
                      <div>🗳️ {databaseStats.votes.toLocaleString()} votos</div>
                      <div>🏛️ {databaseStats.candidates} candidatos</div>
                      <div>🗺️ {databaseStats.territories} territorios</div>
                      <div>⚠️ {databaseStats.alerts} alertas</div>
                      <div>👑 {databaseStats.leaders} líderes</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
