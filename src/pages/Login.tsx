
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Vote, Eye, EyeOff, LogIn, MapPin, Users, Heart, ArrowRight } from 'lucide-react';

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

  // Credenciales para equipos de campaña (sin visitante)
  const teamCredentials = [
    { email: 'admin@micampana.com', password: 'AdminSecure2025!', role: 'Desarrollador', description: 'Control total del sistema' },
    { email: 'master@micampana.com', password: 'MasterSecure2025!', role: 'Master', description: 'Gestión de candidatos y campañas' },
    { email: 'candidato@micampana.com', password: 'CandidatoSecure2025!', role: 'Candidato', description: 'Liderazgo territorial y equipos' },
    { email: 'lider@micampana.com', password: 'LiderSecure2025!', role: 'Líder', description: 'Coordinación local y votantes' },
    { email: 'votante@micampana.com', password: 'VotanteSecure2025!', role: 'Votante', description: 'Participación en el proceso electoral' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.03"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* CTA Hero Section - Candidato */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  <Vote className="w-4 h-4" />
                  CAMPAÑA 2025
                </div>
                
                <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                  Conoce a tu
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent block">
                    Candidato
                  </span>
                </h1>
                
                <p className="text-xl text-blue-100 leading-relaxed">
                  Descubre las propuestas que transformarán tu comunidad. 
                  <strong className="text-white"> Tu voz importa, tu voto decide.</strong>
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button 
                    onClick={() => navigate('/candidato-funnel')}
                    size="lg"
                    className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-bold py-4 px-8 rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-0"
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    CONOCE TUS PROPUESTAS
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  
                  <Button 
                    onClick={() => navigate('/mapa-alertas')}
                    variant="outline"
                    size="lg"
                    className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur font-semibold py-4 px-8 rounded-xl shadow-xl transition-all duration-300"
                  >
                    <MapPin className="w-5 h-5 mr-2" />
                    VER MI ZONA
                  </Button>
                </div>
                
                <div className="flex items-center justify-center lg:justify-start gap-6 pt-6 text-blue-200">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span className="text-sm">+15,000 vecinos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    <span className="text-sm">12 sectores</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <div className="order-1 lg:order-2">
            <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur">
              <CardHeader className="space-y-2 text-center">
                <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  <Vote className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">Mi Campaña</CardTitle>
                <p className="text-gray-600">Acceso para Equipo de Campaña</p>
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
                      className="h-12"
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
                        className="pr-10 h-12"
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

                  <Button type="submit" className="w-full h-12" disabled={isLoading}>
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

                  {/* Panel de credenciales solo para equipo */}
                  <div className="border-t pt-6 mt-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-gray-800 mb-3 text-center">
                        🔑 Acceso para Equipo de Campaña
                      </h3>
                      <div className="space-y-2">
                        {teamCredentials.map((cred, index) => (
                          <div key={index} className="bg-white rounded border p-2">
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="font-medium text-xs text-gray-800">{cred.role}</span>
                                <p className="text-xs text-gray-500">{cred.email}</p>
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
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
