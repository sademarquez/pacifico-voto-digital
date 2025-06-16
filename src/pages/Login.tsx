
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Vote, Eye, EyeOff, LogIn, MapPin, Users, Heart, ArrowRight, Map } from 'lucide-react';

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

  // Credenciales para equipos de campaña
  const teamCredentials = [
    { email: 'admin@micampana.com', password: 'AdminSecure2025!', role: 'Desarrollador', description: 'Control total del sistema' },
    { email: 'master@micampana.com', password: 'MasterSecure2025!', role: 'Master', description: 'Gestión de candidatos y campañas' },
    { email: 'candidato@micampana.com', password: 'CandidatoSecure2025!', role: 'Candidato', description: 'Liderazgo territorial y equipos' },
    { email: 'lider@micampana.com', password: 'LiderSecure2025!', role: 'Líder', description: 'Coordinación local y votantes' },
    { email: 'votante@micampana.com', password: 'VotanteSecure2025!', role: 'Votante', description: 'Participación en el proceso electoral' }
  ];

  return (
    <div className="min-h-screen bg-gradient-elegant relative overflow-hidden">
      {/* Background decoration mejorado */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='0.1'%3E%3Cpath d='M40 40v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V6h-2v4h-4v2h4v4h2v-4h4v-2h-4zM6 40v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 10V6H4v4H0v2h4v4h2v-4h4v-2H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-5xl">
          
          {/* Panel Unificado Centrado */}
          <div className="max-w-md mx-auto">
            <Card className="card-elegant border-0 bg-white/95 backdrop-blur-lg shadow-elegant">
              <CardHeader className="space-y-4 text-center pb-6">
                <div className="mx-auto w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center shadow-gold">
                  <Vote className="w-10 h-10 text-white" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-bold text-slate-800 mb-2">Plataforma Zona Segura</CardTitle>
                  <p className="text-slate-600 font-medium">Tu espacio de participación ciudadana</p>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Botón principal de Mapa */}
                <div className="text-center space-y-4">
                  <Button 
                    onClick={() => navigate('/mapa-alertas')}
                    size="lg"
                    className="w-full btn-primary h-14 text-lg font-bold shadow-elegant hover:scale-105 transition-all duration-300"
                  >
                    <Map className="w-6 h-6 mr-3" />
                    EXPLORAR MAPA
                    <ArrowRight className="w-6 h-6 ml-3" />
                  </Button>
                  
                  <p className="text-sm text-slate-600">
                    Descubre propuestas, alertas y participa en tu zona
                  </p>
                </div>

                {/* Divisor elegante */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-4 text-slate-500 font-medium">Equipo de Campaña</span>
                  </div>
                </div>

                {/* Formulario de login para equipo */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-700 font-medium">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="usuario@micampana.com"
                      required
                      disabled={isLoading}
                      className="input-elegant h-12"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-700 font-medium">Contraseña</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Contraseña segura"
                        required
                        disabled={isLoading}
                        className="input-elegant pr-12 h-12"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 p-0 text-slate-500"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive" className="alert-elegant">
                      <AlertDescription className="text-sm">{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full btn-secondary h-12" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Iniciando sesión...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <LogIn className="w-4 h-4" />
                        Acceso Equipo
                      </div>
                    )}
                  </Button>

                  {/* Panel de credenciales compacto */}
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-200/50">
                    <h3 className="text-sm font-semibold text-slate-700 mb-3 text-center">
                      🔑 Credenciales de Prueba
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                      {teamCredentials.map((cred, index) => (
                        <div key={index} className="flex justify-between items-center bg-white rounded-lg p-2 border border-slate-200/50">
                          <div>
                            <span className="font-medium text-xs text-slate-800">{cred.role}</span>
                            <p className="text-xs text-slate-500">{cred.email}</p>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => quickLogin(cred.email, cred.password)}
                            disabled={isLoading}
                            className="text-xs h-7 px-3 btn-outline-elegant"
                          >
                            Usar
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </form>

                {/* Estadísticas de la plataforma */}
                <div className="flex items-center justify-center gap-6 pt-4 text-slate-600 border-t border-slate-200/50">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">+15,000 ciudadanos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gold" />
                    <span className="text-sm font-medium">12 zonas</span>
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
