
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Smartphone, 
  Wifi, 
  Database,
  Shield,
  Zap,
  Navigation,
  Palette,
  Users,
  MessageSquare
} from 'lucide-react';
import { useSecureAuth } from '@/contexts/SecureAuthContext';
import { useDemoCredentials } from '@/hooks/useDemoCredentials';

interface AuditResult {
  category: string;
  test: string;
  status: 'working' | 'broken' | 'partial';
  message: string;
  details?: any;
  icon: any;
}

export const MobileAppAudit = () => {
  const [results, setResults] = useState<AuditResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const { user, systemHealth } = useSecureAuth();
  const { verifiedCredentials } = useDemoCredentials();

  const runFullAudit = async () => {
    setIsRunning(true);
    const auditResults: AuditResult[] = [];

    // 1. AUTENTICACIÓN Y SEGURIDAD
    auditResults.push({
      category: 'Autenticación',
      test: 'Sistema de Login',
      status: user ? 'working' : 'broken',
      message: user ? `Usuario autenticado: ${user.name}` : 'No hay usuario autenticado',
      icon: Shield,
      details: { userRole: user?.role, systemHealth }
    });

    auditResults.push({
      category: 'Autenticación',
      test: 'Credenciales Demo',
      status: verifiedCredentials.length > 0 ? 'working' : 'broken',
      message: `${verifiedCredentials.length} credenciales demo disponibles`,
      icon: Users,
      details: { credentials: verifiedCredentials.map(c => c.name) }
    });

    // 2. NAVEGACIÓN MÓVIL
    const isMobile = window.innerWidth <= 768;
    auditResults.push({
      category: 'Navegación',
      test: 'Detección Móvil',
      status: isMobile ? 'working' : 'partial',
      message: isMobile ? 'Interfaz móvil detectada' : 'Interfaz de escritorio',
      icon: Smartphone,
      details: { screenWidth: window.innerWidth, isMobile }
    });

    // 3. CONECTIVIDAD
    const isOnline = navigator.onLine;
    auditResults.push({
      category: 'Conectividad',
      test: 'Estado de Red',
      status: isOnline ? 'working' : 'broken',
      message: isOnline ? 'Conexión activa' : 'Sin conexión a internet',
      icon: Wifi,
      details: { online: isOnline }
    });

    // 4. CAPACITOR (PWA/MOBILE)
    const isCapacitor = !!(window as any).Capacitor;
    auditResults.push({
      category: 'Capacitor',
      test: 'Capacitor Runtime',
      status: isCapacitor ? 'working' : 'partial',
      message: isCapacitor ? 'Ejecutándose en Capacitor' : 'Ejecutándose como PWA web',
      icon: Zap,
      details: { isCapacitor, platform: (window as any).Capacitor?.getPlatform?.() }
    });

    // 5. ALMACENAMIENTO LOCAL
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      auditResults.push({
        category: 'Almacenamiento',
        test: 'LocalStorage',
        status: 'working',
        message: 'LocalStorage funcional',
        icon: Database,
        details: { available: true }
      });
    } catch (error) {
      auditResults.push({
        category: 'Almacenamiento',
        test: 'LocalStorage',
        status: 'broken',
        message: 'LocalStorage no disponible',
        icon: Database,
        details: { error: error }
      });
    }

    // 6. SERVICEWORKER (PWA)
    const hasServiceWorker = 'serviceWorker' in navigator;
    auditResults.push({
      category: 'PWA',
      test: 'Service Worker',
      status: hasServiceWorker ? 'working' : 'partial',
      message: hasServiceWorker ? 'Service Worker soportado' : 'Service Worker no soportado',
      icon: Zap,
      details: { supported: hasServiceWorker }
    });

    // 7. GEOLOCALIZACIÓN
    const hasGeolocation = 'geolocation' in navigator;
    auditResults.push({
      category: 'Geolocalización',
      test: 'GPS/Ubicación',
      status: hasGeolocation ? 'working' : 'broken',
      message: hasGeolocation ? 'Geolocalización disponible' : 'Geolocalización no soportada',
      icon: Navigation,
      details: { supported: hasGeolocation }
    });

    // 8. INTERFAZ MÓVIL
    const hasModernMobileNav = document.querySelector('.mobile-nav-modern');
    auditResults.push({
      category: 'UI/UX',
      test: 'Navegación Móvil',
      status: hasModernMobileNav ? 'working' : 'broken',
      message: hasModernMobileNav ? 'Navegación móvil implementada' : 'Navegación móvil no encontrada',
      icon: Palette,
      details: { element: !!hasModernMobileNav }
    });

    // 9. BORDES TOP ANIMADOS
    const hasTopBorder = document.querySelector('[class*="top-border"]');
    auditResults.push({
      category: 'UI/UX',
      test: 'Bordes Superiores',
      status: hasTopBorder ? 'working' : 'partial',
      message: hasTopBorder ? 'Bordes superiores implementados' : 'Bordes superiores no encontrados',
      icon: Palette,
      details: { element: !!hasTopBorder }
    });

    // 10. CHATBOT/IA
    const hasChatbot = document.querySelector('[class*="chatbot"], [class*="gemini"]');
    auditResults.push({
      category: 'IA/Chatbot',
      test: 'Asistente IA',
      status: hasChatbot ? 'working' : 'partial',
      message: hasChatbot ? 'Chatbot IA disponible' : 'Chatbot IA no encontrado en DOM',
      icon: MessageSquare,
      details: { element: !!hasChatbot }
    });

    setResults(auditResults);
    setIsRunning(false);
  };

  useEffect(() => {
    // Ejecutar auditoría automática al cargar
    setTimeout(runFullAudit, 1000);
  }, []);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'working':
        return { icon: CheckCircle, color: 'bg-green-100 text-green-800', bgColor: 'bg-green-50' };
      case 'broken':
        return { icon: XCircle, color: 'bg-red-100 text-red-800', bgColor: 'bg-red-50' };
      case 'partial':
        return { icon: AlertTriangle, color: 'bg-yellow-100 text-yellow-800', bgColor: 'bg-yellow-50' };
      default:
        return { icon: AlertTriangle, color: 'bg-gray-100 text-gray-800', bgColor: 'bg-gray-50' };
    }
  };

  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.category]) {
      acc[result.category] = [];
    }
    acc[result.category].push(result);
    return acc;
  }, {} as Record<string, AuditResult[]>);

  const getSummary = () => {
    const working = results.filter(r => r.status === 'working').length;
    const broken = results.filter(r => r.status === 'broken').length;
    const partial = results.filter(r => r.status === 'partial').length;
    
    return { working, broken, partial, total: results.length };
  };

  const summary = getSummary();

  return (
    <div className="space-y-6 p-4">
      <Card className="border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Smartphone className="w-6 h-6 text-blue-600" />
            Auditoría Completa - Aplicación Móvil
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 mb-4">
            <Button 
              onClick={runFullAudit} 
              disabled={isRunning}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isRunning ? 'Auditando...' : 'Ejecutar Auditoría Completa'}
            </Button>
          </div>

          {results.length > 0 && (
            <Alert className="mb-6">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="font-semibold mb-2">Resumen de Auditoría:</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-green-700">✅ Funcionando: {summary.working}</div>
                  <div className="text-red-700">❌ Roto: {summary.broken}</div>
                  <div className="text-yellow-700">⚠️ Parcial: {summary.partial}</div>
                  <div className="text-gray-700">📊 Total: {summary.total}</div>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Resultados por categoría */}
      {Object.entries(groupedResults).map(([category, categoryResults]) => (
        <Card key={category} className="border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg">{category}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categoryResults.map((result, index) => {
                const config = getStatusConfig(result.status);
                const StatusIcon = config.icon;
                const TestIcon = result.icon;
                
                return (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${config.bgColor}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <TestIcon className="w-5 h-5 text-gray-600" />
                        <span className="font-medium">{result.test}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusIcon className="w-4 h-4" />
                        <Badge className={config.color}>
                          {result.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{result.message}</p>
                    {result.details && (
                      <details className="text-xs text-gray-600">
                        <summary className="cursor-pointer font-medium">Detalles técnicos</summary>
                        <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                          {JSON.stringify(result.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MobileAppAudit;
