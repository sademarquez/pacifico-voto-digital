
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
      const start = Date.now();
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      const duration = Date.now() - start;
      
      setDebugInfo({
        connection: error ? 'ERROR' : 'OK',
        error: error?.message || null,
        timestamp: new Date().toISOString(),
        duration: `${duration}ms`
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

  const testDirectLogin = async () => {
    console.log('🧪 Testing direct Supabase auth...');
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'lider@micampana.com',
        password: 'LiderSecure2025!',
      });

      console.log('📊 Direct login result:', {
        hasData: !!data,
        hasUser: !!data?.user,
        hasSession: !!data?.session,
        error: error ? {
          message: error.message,
          status: error.status,
          name: error.name
        } : null
      });

      if (error) {
        setError(`Test directo falló: ${error.message}`);
      } else if (data.user) {
        setError('Test directo exitoso - La conexión funciona');
        console.log('✅ Direct test successful, signing out...');
        await supabase.auth.signOut();
      }
    } catch (error) {
      console.error('💥 Direct test error:', error);
      setError(`Error en test directo: ${error}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    console.log('🚀 Iniciando proceso de login...');

    try {
      const result = await login(email, password);
      if (result.success) {
        console.log('✅ Login exitoso, redirigiendo...');
        // Small delay to ensure state is updated
        setTimeout(() => {
          navigate('/dashboard');
        }, 100);
      } else {
        setError(result.error || 'Error desconocido');
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
            <p className="text-gray-600">Sistema Electoral - Mejorado v3</p>
          </CardHeader>
          
          <CardContent>
            {/* Test de conexión y debug */}
            <div className="mb-4 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={testConnection}
                >
                  🧪 Test DB
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={testDirectLogin}
                >
                  🔐 Test Auth
                </Button>
              </div>
              
              {debugInfo && (
                <Alert variant={debugInfo.connection === 'OK' ? 'default' : 'destructive'}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    <strong>Estado:</strong> {debugInfo.connection}<br/>
                    <strong>Tiempo:</strong> {debugInfo.duration}<br/>
                    {debugInfo.error && <span><strong>Error:</strong> {debugInfo.error}<br/></span>}
                    <strong>Hora:</strong> {new Date(debugInfo.timestamp).toLocaleTimeString()}
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
                <Alert variant={error.includes('exitoso') ? 'default' : 'destructive'}>
                  <AlertDescription className="text-sm">{error}</AlertDescription>
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
                    className="text-xs p-2"
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
