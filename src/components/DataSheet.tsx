
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useSecureAuth } from '@/contexts/SecureAuthContext';
import { 
  Database, 
  Shield, 
  Zap, 
  Globe, 
  Users, 
  BarChart3, 
  Download,
  FileText,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Activity
} from 'lucide-react';

interface SystemMetrics {
  totalUsers: number;
  activeConnections: number;
  dataProcessed: number;
  systemUptime: number;
  securityScore: number;
  performanceScore: number;
}

const DataSheet = () => {
  const { user } = useSecureAuth();
  const [metrics] = useState<SystemMetrics>({
    totalUsers: 15420,
    activeConnections: 247,
    dataProcessed: 2.8,
    systemUptime: 99.9,
    securityScore: 98,
    performanceScore: 95
  });

  const systemComponents = [
    {
      name: 'Gemini AI Engine',
      status: 'active',
      description: 'Sistema de análisis predictivo electoral',
      uptime: 99.9,
      performance: 98,
      color: 'bg-emerald-500'
    },
    {
      name: 'SellerChat Integration',
      status: 'ready',
      description: 'Comunicación masiva WhatsApp',
      uptime: 100,
      performance: 96,
      color: 'bg-blue-500'
    },
    {
      name: 'N8N Automation',
      status: 'standby',
      description: 'Automatización de procesos electorales',
      uptime: 99.8,
      performance: 94,
      color: 'bg-purple-500'
    },
    {
      name: 'Security Layer',
      status: 'active',
      description: 'Protección de datos y privacidad',
      uptime: 100,
      performance: 99,
      color: 'bg-red-500'
    }
  ];

  const dataCategories = [
    {
      category: 'Datos de Votantes',
      records: '15,420',
      quality: 96,
      privacy: 'GDPR Compliant',
      icon: Users
    },
    {
      category: 'Análisis Predictivo',
      records: '2,847',
      quality: 98,
      privacy: 'Anonimizado',
      icon: TrendingUp
    },
    {
      category: 'Comunicaciones',
      records: '45,627',
      quality: 94,
      privacy: 'Encriptado',
      icon: Activity
    },
    {
      category: 'Métricas Sistema',
      records: '∞',
      quality: 99,
      privacy: 'Interno',
      icon: BarChart3
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'ready': return 'bg-blue-500';
      case 'standby': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const exportDataSheet = () => {
    const data = {
      timestamp: new Date().toISOString(),
      system: 'MI CAMPAÑA 2025',
      version: '2.0.0',
      metrics,
      components: systemComponents,
      dataCategories,
      user: user?.name || 'Sistema'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mi-campana-datasheet-${new Date().getTime()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header del DataSheet */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Database className="w-10 h-10 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">DataSheet Sistema Electoral</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Reporte completo del ecosistema MI CAMPAÑA 2025 - Sistema electoral con IA avanzada
        </p>
        <div className="flex items-center justify-center gap-4">
          <Badge className="bg-green-100 text-green-800">
            Sistema Activo
          </Badge>
          <Badge className="bg-blue-100 text-blue-800">
            Versión 2.0.0
          </Badge>
          <Badge className="bg-purple-100 text-purple-800">
            {new Date().toLocaleDateString()}
          </Badge>
        </div>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="elegant-card">
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{metrics.totalUsers.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Usuarios Totales</div>
          </CardContent>
        </Card>
        
        <Card className="elegant-card">
          <CardContent className="p-4 text-center">
            <Activity className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{metrics.activeConnections}</div>
            <div className="text-sm text-gray-600">Conexiones Activas</div>
          </CardContent>
        </Card>
        
        <Card className="elegant-card">
          <CardContent className="p-4 text-center">
            <Database className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{metrics.dataProcessed}TB</div>
            <div className="text-sm text-gray-600">Datos Procesados</div>
          </CardContent>
        </Card>
        
        <Card className="elegant-card">
          <CardContent className="p-4 text-center">
            <Globe className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{metrics.systemUptime}%</div>
            <div className="text-sm text-gray-600">Uptime Sistema</div>
          </CardContent>
        </Card>
        
        <Card className="elegant-card">
          <CardContent className="p-4 text-center">
            <Shield className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{metrics.securityScore}%</div>
            <div className="text-sm text-gray-600">Seguridad</div>
          </CardContent>
        </Card>
        
        <Card className="elegant-card">
          <CardContent className="p-4 text-center">
            <Zap className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{metrics.performanceScore}%</div>
            <div className="text-sm text-gray-600">Rendimiento</div>
          </CardContent>
        </Card>
      </div>

      {/* Componentes del Sistema */}
      <Card className="elegant-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Estado de Componentes del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {systemComponents.map((component, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(component.status)}`}></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{component.name}</h3>
                    <p className="text-sm text-gray-600">{component.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    {component.uptime}% uptime
                  </div>
                  <div className="text-xs text-gray-500">
                    {component.performance}% performance
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Categorías de Datos */}
      <Card className="elegant-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Inventario de Datos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {dataCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <Icon className="w-6 h-6 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">{category.category}</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Registros:</span>
                      <span className="font-semibold">{category.records}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Calidad:</span>
                      <span className="font-semibold">{category.quality}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Privacidad:</span>
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        {category.privacy}
                      </Badge>
                    </div>
                    <Progress value={category.quality} className="h-2" />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Cumplimiento Legal */}
      <Card className="elegant-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Cumplimiento Legal y Normativo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium">GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium">Ley de Protección de Datos</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium">Código Electoral</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium">Transparencia Electoral</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium">Seguridad Informática</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <span className="text-sm font-medium">Auditoria Pendiente</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Acciones de Exportación */}
      <Card className="elegant-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Exportar Información
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button onClick={exportDataSheet} className="elegant-button">
              <Download className="w-4 h-4 mr-2" />
              Exportar DataSheet JSON
            </Button>
            <Button variant="outline" className="elegant-button">
              <FileText className="w-4 h-4 mr-2" />
              Generar Reporte PDF
            </Button>
            <Button variant="outline" className="elegant-button">
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard Ejecutivo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataSheet;
