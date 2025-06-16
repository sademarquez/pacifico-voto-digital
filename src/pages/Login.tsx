import { useState } from 'react';
import { useSecureAuth } from '@/contexts/SecureAuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  Globe
} from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useSecureAuth();
  const navigate = useNavigate();

  // Redirigir si ya está autenticado
  if (isAuthenticated) {
    navigate('/dashboard');
    return null;
  }

  // handleSubmit function
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

  // quickLogin function
  const quickLogin = (testEmail: string, testPassword: string) => {
    setEmail(testEmail);
    setPassword(testPassword);
    setError('');
  };

  // teamCredentials array
  const teamCredentials = [
    { email: 'admin@micampana.com', password: 'AdminSecure2025!', role: 'Desarrollador', description: 'Control total del sistema', icon: Shield, color: 'text-purple-600' },
    { email: 'master@micampana.com', password: 'MasterSecure2025!', role: 'Master', description: 'Gestión completa', icon: Target, color: 'text-blue-600' },
    { email: 'candidato@micampana.com', password: 'CandidatoSecure2025!', role: 'Candidato', description: 'Liderazgo territorial', icon: Users, color: 'text-green-600' },
    { email: 'lider@micampana.com', password: 'LiderSecure2025!', role: 'Líder', description: 'Coordinación local', icon: MapPin, color: 'text-orange-600' },
    { email: 'votante@micampana.com', password: 'VotanteSecure2025!', role: 'Votante', description: 'Participación ciudadana', icon: Vote, color: 'text-indigo-600' }
  ];

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
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
          
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
                  <Zap className="w-6 h-6 text-yellow-300" />
                  <div>
                    <h3 className="font-semibold">Automatización 120%</h3>
                    <p className="text-sm opacity-80">IA Gemini integrada para máxima eficiencia</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-white bg-opacity-10 rounded-xl backdrop-blur-sm">
                  <Globe className="w-6 h-6 text-green-300" />
                  <div>
                    <h3 className="font-semibold">Cobertura Nacional</h3>
                    <p className="text-sm opacity-80">La mejor plataforma electoral de Colombia</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-white bg-opacity-10 rounded-xl backdrop-blur-sm">
                  <Target className="w-6 h-6 text-blue-300" />
                  <div>
                    <h3 className="font-semibold">Precisión Avanzada</h3>
                    <p className="text-sm opacity-80">Análisis predictivo y métricas en tiempo real</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Panel derecho - Login moderno */}
          <div className="flex items-center justify-center">
            <Card className="campaign-card w-full max-w-md bg-white bg-opacity-95 backdrop-blur-xl border-0 shadow-modern-xl">
              <CardHeader className="space-y-4 text-center pb-6">
                <div className="mx-auto w-20 h-20 gradient-bg-primary rounded-2xl flex items-center justify-center shadow-modern-lg">
                  <Vote className="w-10 h-10 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold gradient-text-primary mb-2">
                    Acceso Seguro
                  </CardTitle>
                  <p className="text-gray-600 font-medium">Plataforma Electoral Avanzada</p>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Botón principal de Mapa - Versión móvil mejorada */}
                <div className="text-center space-y-4">
                  <Button 
                    onClick={() => navigate('/mapa-alertas')}
                    size="lg"
                    className="w-full btn-modern-primary h-14 text-lg font-bold shadow-modern-md hover:shadow-modern-lg"
                  >
                    <Map className="w-6 h-6 mr-3" />
                    EXPLORAR MAPA
                    <ArrowRight className="w-6 h-6 ml-3" />
                  </Button>
                  
                  <p className="text-sm text-gray-600">
                    Descubre propuestas, alertas y participa en tu zona
                  </p>
                </div>

                {/* Divisor elegante */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-4 text-blue-600 font-bold">Equipo de Campaña</span>
                  </div>
                </div>

                {/* Formulario de login moderno */}
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
                      className="input-modern h-12"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700 font-medium">Contraseña Segura</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Contraseña segura"
                        required
                        disabled={isLoading}
                        className="input-modern pr-12 h-12"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 p-0 text-blue-600 hover:text-blue-700"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  {error && (
                    <Alert className="alert-error-modern">
                      <AlertDescription className="text-sm">{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full h-12 btn-modern-secondary" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        Iniciando sesión...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <LogIn className="w-4 h-4" />
                        Acceso Equipo
                      </div>
                    )}
                  </Button>

                  {/* Panel de credenciales compacto y moderno */}
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-800 mb-3 text-center flex items-center justify-center gap-2">
                      <Shield className="w-4 h-4" />
                      Credenciales de Acceso Rápido
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                      {teamCredentials.map((cred, index) => {
                        const Icon = cred.icon;
                        return (
                          <div key={index} className="flex justify-between items-center bg-white rounded-lg p-3 border border-gray-100 hover:border-blue-200 transition-all shadow-sm hover:shadow-md">
                            <div className="flex items-center space-x-3">
                              <Icon className={`w-4 h-4 ${cred.color}`} />
                              <div>
                                <span className="font-medium text-sm text-gray-800">{cred.role}</span>
                                <p className="text-xs text-gray-500">{cred.description}</p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => quickLogin(cred.email, cred.password)}
                              disabled={isLoading}
                              className="text-xs h-8 px-3 border-gray-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
                            >
                              Usar
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </form>

                {/* Estadísticas de la plataforma */}
                <div className="flex items-center justify-center gap-6 pt-4 text-gray-600 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">+25,000 usuarios</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">15 ciudades</span>
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
