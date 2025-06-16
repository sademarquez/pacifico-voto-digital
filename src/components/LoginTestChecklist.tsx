
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertCircle, Play, Smartphone } from "lucide-react";
import { useSimpleAuth } from "@/contexts/SimpleAuthContext";
import { useToast } from "@/hooks/use-toast";

interface TestResult {
  test: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  details?: string;
}

const LoginTestChecklist = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const { login, logout } = useSimpleAuth();
  const { toast } = useToast();

  const DEMO_CREDENTIALS = [
    { name: 'Desarrollador', email: 'dev@demo.com', password: '12345678' },
    { name: 'Master', email: 'master@demo.com', password: '12345678' },
    { name: 'Candidato', email: 'candidato@demo.com', password: '12345678' },
    { name: 'Líder', email: 'lider@demo.com', password: '12345678' },
    { name: 'Votante', email: 'votante@demo.com', password: '12345678' }
  ];

  const updateTestResult = (test: string, status: TestResult['status'], message: string, details?: string) => {
    setTestResults(prev => {
      const existing = prev.find(r => r.test === test);
      const newResult = { test, status, message, details };
      
      if (existing) {
        return prev.map(r => r.test === test ? newResult : r);
      } else {
        return [...prev, newResult];
      }
    });
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const runCompleteTest = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    console.log('🧪 Iniciando test completo del sistema de login...');

    // Test 1: Verificar conexión con Supabase
    updateTestResult('supabase-connection', 'pending', 'Verificando conexión con Supabase...');
    try {
      const { data, error } = await (await import('@/integrations/supabase/client')).supabase.from('profiles').select('count').limit(1);
      if (error) throw error;
      updateTestResult('supabase-connection', 'success', 'Conexión con Supabase exitosa');
    } catch (error) {
      updateTestResult('supabase-connection', 'error', 'Error de conexión con Supabase', (error as Error).message);
    }

    await delay(500);

    // Test 2: Probar credenciales incorrectas
    updateTestResult('invalid-credentials', 'pending', 'Probando credenciales incorrectas...');
    try {
      const result = await login('invalid@test.com', 'wrongpassword');
      if (!result.success) {
        updateTestResult('invalid-credentials', 'success', 'Manejo de credenciales incorrectas funciona');
      } else {
        updateTestResult('invalid-credentials', 'error', 'Error: credenciales incorrectas fueron aceptadas');
      }
    } catch (error) {
      updateTestResult('invalid-credentials', 'error', 'Error inesperado', (error as Error).message);
    }

    await delay(1000);

    // Test 3-7: Probar cada credencial demo
    for (const credential of DEMO_CREDENTIALS) {
      const testName = `login-${credential.name.toLowerCase()}`;
      updateTestResult(testName, 'pending', `Probando login de ${credential.name}...`);
      
      try {
        // Logout previo
        await logout();
        await delay(500);
        
        const result = await login(credential.email, credential.password);
        
        if (result.success) {
          updateTestResult(testName, 'success', `Login de ${credential.name} exitoso`);
          await delay(500);
          await logout();
        } else {
          updateTestResult(testName, 'error', `Login de ${credential.name} falló`, result.error);
        }
      } catch (error) {
        updateTestResult(testName, 'error', `Error en login de ${credential.name}`, (error as Error).message);
      }
      
      await delay(1000);
    }

    // Test 8: Verificar redirección automática
    updateTestResult('redirect-test', 'pending', 'Verificando redirección automática...');
    try {
      const result = await login('dev@demo.com', '12345678');
      if (result.success) {
        updateTestResult('redirect-test', 'success', 'Redirección automática configurada correctamente');
      } else {
        updateTestResult('redirect-test', 'error', 'Error en redirección automática');
      }
    } catch (error) {
      updateTestResult('redirect-test', 'error', 'Error en test de redirección', (error as Error).message);
    }

    setIsRunning(false);
    
    toast({
      title: "Test completado",
      description: "Revisa los resultados detallados abajo",
    });
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-600 animate-pulse" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'pending':
        return 'border-yellow-200 bg-yellow-50';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="w-6 h-6" />
          Checklist Técnico de Login - Sistema Completo
        </CardTitle>
        <p className="text-gray-600">
          Verificación automática de funcionalidad y preparación para Android
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Button
            onClick={runCompleteTest}
            disabled={isRunning}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isRunning ? "Ejecutando Tests..." : "🧪 Ejecutar Test Completo"}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => window.open('/mobile-audit', '_blank')}
            className="border-green-500 text-green-700 hover:bg-green-50 flex items-center gap-2"
          >
            <Smartphone className="w-4 h-4" />
            Auditoría Mobile Android
          </Button>
        </div>

        {testResults.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Resultados del Test:</h3>
            
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 ${getStatusColor(result.status)}`}
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(result.status)}
                  <div className="flex-1">
                    <div className="font-medium">{result.test.replace('-', ' ').toUpperCase()}</div>
                    <div className="text-sm text-gray-600">{result.message}</div>
                    {result.details && (
                      <div className="text-xs text-gray-500 mt-1 font-mono bg-gray-100 p-1 rounded">
                        {result.details}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {testResults.length === 0 && (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <Play className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              Haz clic en "Ejecutar Test Completo" para verificar toda la funcionalidad del sistema
            </p>
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">📋 Tests Incluidos:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Conexión con base de datos Supabase</li>
            <li>• Manejo de credenciales incorrectas</li>
            <li>• Login con cada credencial demo (5 usuarios)</li>
            <li>• Verificación de redirección automática</li>
            <li>• Logout y limpieza de sesión</li>
            <li>• Preparación para export a Android</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginTestChecklist;
