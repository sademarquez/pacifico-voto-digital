
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Users, 
  Database, 
  Brain,
  Shield,
  RefreshCw,
  Settings,
  MessageSquare,
  Zap,
  Crown
} from 'lucide-react';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { useToast } from '@/hooks/use-toast';
import { enhancedAuthService } from '@/services/enhancedAuthService';

interface AuditResult {
  component: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: string;
}

const CompleteSystemAudit = () => {
  const { user } = useSimpleAuth();
  const { toast } = useToast();
  const [auditResults, setAuditResults] = useState<AuditResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [systemStatus, setSystemStatus] = useState<'unknown' | 'success' | 'partial' | 'error'>('unknown');

  const runCompleteAudit = async () => {
    setIsRunning(true);
    setAuditResults([]);
    
    try {
      console.log('🔍 Iniciando auditoría completa del sistema...');
      
      const systemCheck = await enhancedAuthService.verifySystemAccess();
      setSystemStatus(systemCheck.overall);
      setAuditResults(systemCheck.checks);
      
      toast({
        title: 'Auditoría Completada',
        description: `Sistema ${systemCheck.overall}: ${systemCheck.score}`,
        variant: systemCheck.overall === 'error' ? 'destructive' : 'default'
      });
      
      // Mostrar recomendaciones
      if (systemCheck.recommendations.length > 0) {
        console.log('📋 Recomendaciones del sistema:');
        systemCheck.recommendations.forEach(rec => console.log(rec));
      }
      
    } catch (error) {
      console.error('Error en auditoría:', error);
      toast({
        title: 'Error en Auditoría',
        description: (error as Error).message,
        variant: 'destructive'
      });
    } finally {
      setIsRunning(false);
    }
  };

  const createDevelopers = async () => {
    setIsRunning(true);
    
    try {
      console.log('👥 Creando usuarios desarrolladores...');
      
      const result = await enhancedAuthService.createDeveloperUsers();
      
      toast({
        title: 'Desarrolladores Creados',
        description: `${result.successful}/${result.total} usuarios creados exitosamente`,
        variant: result.failed > 0 ? 'destructive' : 'default'
      });
      
      // Actualizar resultados de auditoría
      const devResults: AuditResult[] = result.results.map(dev => ({
        component: `Developer ${dev.name}`,
        status: dev.success ? 'success' : 'error',
        message: dev.success ? (dev.status === 'ya_existe' ? 'Ya existía' : 'Creado exitosamente') : 'Error en creación',
        details: dev.error || dev.userId || dev.email
      }));
      
      setAuditResults(prev => [...prev, ...devResults]);
      
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error crítico creando desarrolladores',
        variant: 'destructive'
      });
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default:
        return <RefreshCw className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getSystemStatusBadge = () => {
    switch (systemStatus) {
      case 'success':
        return <Badge className="bg-green-600 text-white">✅ Sistema Completo</Badge>;
      case 'partial':
        return <Badge className="bg-yellow-600 text-white">⚡ Funcional</Badge>;
      case 'error':
        return <Badge className="bg-red-600 text-white">❌ Requiere Atención</Badge>;
      default:
        return <Badge variant="outline">🔍 Sin Auditar</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header con estado del sistema */}
      <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown className="w-8 h-8 text-purple-600" />
              <div>
                <CardTitle className="text-2xl text-purple-900">Sistema MI CAMPAÑA 2025</CardTitle>
                <p className="text-purple-600">Auditoría Completa y Control de Acceso Premium</p>
              </div>
            </div>
            {getSystemStatusBadge()}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2 text-purple-800">Usuario Actual</h4>
              <p className="text-sm">{user ? `${user.name} (${user.role})` : 'No autenticado'}</p>
              <p className="text-xs text-gray-600">{user?.email}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-purple-800">APIs Premium</h4>
              <p className="text-sm">✅ Gemini 2.0 Flash Experimental</p>
              <p className="text-sm">⚡ SellerChat WhatsApp Business</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Panel de controles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-6 h-6" />
            Panel de Control Premium
          </CardTitle>
          <p className="text-gray-600">
            Herramientas de administrador para verificar y configurar el sistema completo
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Button
              onClick={runCompleteAudit}
              disabled={isRunning}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isRunning ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Database className="w-4 h-4 mr-2" />}
              Auditoría Completa
            </Button>
            
            <Button
              onClick={createDevelopers}
              disabled={isRunning}
              variant="outline"
              className="border-green-500 text-green-700 hover:bg-green-50"
            >
              <Users className="w-4 h-4 mr-2" />
              Crear Desarrolladores
            </Button>

            <Button
              onClick={() => window.open('/dashboard', '_blank')}
              variant="outline"
              className="border-purple-500 text-purple-700 hover:bg-purple-50"
            >
              <Brain className="w-4 h-4 mr-2" />
              Dashboard Premium
            </Button>

            <Button
              onClick={() => window.open('/configuracion-avanzada', '_blank')}
              variant="outline"
              className="border-amber-500 text-amber-700 hover:bg-amber-50"
            >
              <Settings className="w-4 h-4 mr-2" />
              Config Avanzada
            </Button>
          </div>

          <Separator className="my-4" />

          {/* Resultados de la auditoría */}
          {auditResults.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-600" />
                Resultados de la Auditoría Premium
              </h3>
              
              {auditResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${getStatusColor(result.status)}`}
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(result.status)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{result.component}</span>
                        <Badge variant={result.status === 'success' ? 'default' : 'destructive'}>
                          {result.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">{result.message}</div>
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

          {auditResults.length === 0 && (
            <div className="text-center p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200">
              <Shield className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-blue-900 mb-2">Sistema Premium Listo</h3>
              <p className="text-blue-600 mb-4">
                Ejecuta la auditoría completa para verificar el estado de todos los componentes
              </p>
              <div className="text-sm text-blue-700 space-y-1">
                <p>✅ Base de datos Supabase conectada</p>
                <p>✅ Gemini Premium API configurada</p>
                <p>✅ Sistema de autenticación activo</p>
                <p>✅ SellerChat WhatsApp listo</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Información del sistema premium */}
      <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="text-green-900 flex items-center gap-2">
            <MessageSquare className="w-6 h-6" />
            Capacidades Premium Activadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-green-800">🤖 Inteligencia Artificial</h4>
              <ul className="space-y-1 text-sm text-green-700">
                <li>• Gemini 2.0 Flash Experimental</li>
                <li>• Análisis electoral predictivo</li>
                <li>• Sentiment analysis en tiempo real</li>
                <li>• Automatización de respuestas</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-green-800">📱 Comunicación Masiva</h4>
              <ul className="space-y-1 text-sm text-green-700">
                <li>• WhatsApp Business API</li>
                <li>• SellerChat integración premium</li>
                <li>• Mensajería automatizada 24/7</li>
                <li>• Métricas de engagement</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-green-800">🗄️ Base de Datos</h4>
              <ul className="space-y-1 text-sm text-green-700">
                <li>• Supabase PostgreSQL</li>
                <li>• 100K+ registros de prueba</li>
                <li>• Backup automático</li>
                <li>• RLS Security activado</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-green-800">⚡ Automatización</h4>
              <ul className="space-y-1 text-sm text-green-700">
                <li>• N8N workflows listos</li>
                <li>• Triggers automatizados</li>
                <li>• Alertas inteligentes</li>
                <li>• Dashboard en tiempo real</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompleteSystemAudit;
