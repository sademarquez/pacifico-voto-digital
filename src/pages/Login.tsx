
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DebugAuthPanel } from '@/components/DebugAuthPanel';
import { Vote, Eye, EyeOff, LogIn, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const testConnection = async () => {
    try {
      console.log('🧪 Testing Supabase connection...');
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      
      setDebugInfo({
        connection: error ? 'ERROR' : 'OK',
        error: error?.message || null,
        timestamp: new Date().toISOString()
      });
      
      if (error) {
        console.error('❌ Connection test failed:', error);
        setError(`Error de conexión: ${error.message}`);
      } else {
        console.log('✅ Connection test passed');
        setError('');
      }
    } catch (error) {
      console.error('💥 Critical connection error:', error);
      setError(`Error crítico de conexión: ${error}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    console.log('🚀 Iniciando proceso de login...');

    try {
      // Test de conexión primero
      await testConnection();
      
      const success = await login(email, password);
      if (success) {
        console.log('✅ Login exitoso, redirigiendo...');
        navigate('/dashboard');
      } else {
        setError('Credenciales incorrectas o error del sistema. Revisa los logs de consola.');
      }
    } catch (error) {
      console.error('💥 Error en handleSubmit:', error);
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

  const testCredentials = [
    { email: 'admin@micampana.com', password: 'AdminSecure2025!', role: 'Desarrollador' },
    { email: 'master@micampana.com', password: 'MasterSecure2025!', role: 'Master' },
    { email: 'candidato@micampana.com', password: 'CandidatoSecure2025!', role: 'Candidato' },
    { email: 'lider@micampana.com', password: 'LiderSecure2025!', role: 'Líder Territorial' }
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
            <p className="text-gray-600">Sistema Electoral - Test de Conexión</p>
          </CardHeader>
          
          <CardContent>
            {/* Test de conexión */}
            <div className="mb-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={testConnection}
                className="w-full mb-2"
              >
                🧪 Test Conexión Supabase
              </Button>
              
              {debugInfo && (
                <Alert variant={debugInfo.connection === 'OK' ? 'default' : 'destructive'}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Conexión:</strong> {debugInfo.connection}<br/>
                    {debugInfo.error && <span><strong>Error:</strong> {debugInfo.error}<br/></span>}
                    <strong>Timestamp:</strong> {debugInfo.timestamp}
                  </AlertDescription>
                </Alert>
              )}
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
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-2 gap-2 text-xs">
                {testCredentials.map((cred, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => quickLogin(cred.email, cred.password)}
                    disabled={isLoading}
                  >
                    {cred.role.split(' ')[0]}
                  </Button>
                ))}
              </div>

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
            </form>
          </CardContent>
        </Card>
      </div>
      
      <DebugAuthPanel />
    </div>
  );
};

export default Login;
