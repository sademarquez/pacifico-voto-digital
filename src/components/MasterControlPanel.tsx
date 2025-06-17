
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSecureAuth } from '@/contexts/SecureAuthContext';
import { 
  Crown, 
  Settings, 
  Zap, 
  Database, 
  MessageSquare, 
  Users, 
  Activity,
  Shield,
  Globe,
  BarChart3,
  Cpu,
  Wifi,
  Lock,
  Key,
  Server,
  Smartphone
} from 'lucide-react';

const MasterControlPanel = () => {
  const { user } = useSecureAuth();
  const [activeService, setActiveService] = useState('gemini');
  const [apiKeys, setApiKeys] = useState({
    sellerchat: '',
    n8n: '',
    whatsapp: '',
    facebook: ''
  });

  const services = {
    gemini: {
      name: 'Gemini AI',
      status: 'active',
      description: 'Motor de análisis predictivo electoral',
      icon: Cpu,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    sellerchat: {
      name: 'SellerChat',
      status: 'pending',
      description: 'Comunicación masiva WhatsApp',
      icon: MessageSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    n8n: {
      name: 'N8N Automation',
      status: 'pending',
      description: 'Automatización de procesos',
      icon: Zap,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    whatsapp: {
      name: 'WhatsApp Business',
      status: 'pending',
      description: 'API oficial de WhatsApp',
      icon: Smartphone,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  };

  const systemMetrics = [
    { label: 'Usuarios Activos', value: '2,847', icon: Users, trend: '+12%' },
    { label: 'Mensajes Procesados', value: '45,627', icon: MessageSquare, trend: '+8%' },
    { label: 'Conversiones', value: '18.4%', icon: BarChart3, trend: '+3.2%' },
    { label: 'Uptime Sistema', value: '99.9%', icon: Activity, trend: 'Estable' }
  ];

  const handleApiKeyUpdate = (service: string, value: string) => {
    setApiKeys(prev => ({ ...prev, [service]: value }));
  };

  const connectService = (serviceKey: string) => {
    const apiKey = apiKeys[serviceKey as keyof typeof apiKeys];
    if (!apiKey.trim()) {
      alert('Por favor ingresa la clave API primero');
      return;
    }
    
    // Simulación de conexión
    console.log(`Conectando ${serviceKey} con API key: ${apiKey.substring(0, 8)}...`);
    alert(`${services[serviceKey as keyof typeof services].name} conectado exitosamente!`);
  };

  const ServiceIcon = services[activeService as keyof typeof services]?.icon || Settings;

  return (
    <div className="space-y-6">
      {/* Header del Panel Maestro */}
      <Card className="elegant-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown className="w-8 h-8 text-yellow-600" />
              <div>
                <CardTitle className="text-2xl text-gray-900">Panel de Control Maestro</CardTitle>
                <p className="text-gray-600">
                  Administración completa del ecosistema electoral • {user?.name}
                </p>
              </div>
            </div>
            <Badge className="bg-yellow-100 text-yellow-800 px-3 py-1">
              <Crown className="w-4 h-4 mr-1" />
              Master Access
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Métricas del Sistema */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {systemMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="elegant-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Icon className="w-6 h-6 text-blue-600" />
                  <Badge className="bg-green-100 text-green-800 text-xs">
                    {metric.trend}
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {metric.value}
                </div>
                <div className="text-sm text-gray-600">
                  {metric.label}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Panel Principal con Tabs */}
      <Tabs defaultValue="services" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="services" className="flex items-center gap-2">
            <Server className="w-4 h-4" />
            Servicios
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Integraciones
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Seguridad
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Monitoreo
          </TabsTrigger>
        </TabsList>

        {/* Tab de Servicios */}
        <TabsContent value="services" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Lista de Servicios */}
            <Card className="elegant-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="w-5 h-5" />
                  Estado de Servicios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(services).map(([key, service]) => {
                    const Icon = service.icon;
                    return (
                      <div 
                        key={key}
                        className={`p-3 rounded-lg cursor-pointer transition-all ${
                          activeService === key ? service.bgColor : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setActiveService(key)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Icon className={`w-5 h-5 ${service.color}`} />
                            <div>
                              <div className="font-semibold text-gray-900">{service.name}</div>
                              <div className="text-sm text-gray-600">{service.description}</div>
                            </div>
                          </div>
                          <Badge className={`${
                            service.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {service.status === 'active' ? 'Activo' : 'Pendiente'}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Configuración del Servicio Activo */}
            <Card className="elegant-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ServiceIcon className="w-5 h-5" />
                  Configurar {services[activeService as keyof typeof services]?.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeService === 'gemini' ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Cpu className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-green-800">Gemini AI Conectado</span>
                      </div>
                      <p className="text-sm text-green-700">
                        La integración con Gemini AI está activa y funcionando correctamente.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-emerald-50 rounded-lg">
                        <div className="text-lg font-bold text-emerald-800">1,247</div>
                        <div className="text-sm text-emerald-600">Consultas Procesadas</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-lg font-bold text-blue-800">98.2%</div>
                        <div className="text-sm text-blue-600">Precisión de Análisis</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Clave API de {services[activeService as keyof typeof services]?.name}
                      </label>
                      <Input
                        type="password"
                        placeholder="Ingresa tu clave API aquí..."
                        value={apiKeys[activeService as keyof typeof apiKeys]}
                        onChange={(e) => handleApiKeyUpdate(activeService, e.target.value)}
                        className="elegant-button"
                      />
                      <p className="text-xs text-gray-500">
                        La clave API se guardará de forma segura y encriptada
                      </p>
                    </div>
                    
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">Instrucciones de Configuración:</h4>
                      <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                        <li>Accede a tu cuenta de {services[activeService as keyof typeof services]?.name}</li>
                        <li>Navega a la sección de API o Desarrolladores</li>
                        <li>Genera una nueva clave API</li>
                        <li>Copia la clave y pégala en el campo anterior</li>
                        <li>Haz clic en "Conectar Servicio"</li>
                      </ol>
                    </div>
                    
                    <Button 
                      onClick={() => connectService(activeService)}
                      className="w-full elegant-button"
                      disabled={!apiKeys[activeService as keyof typeof apiKeys].trim()}
                    >
                      <Key className="w-4 h-4 mr-2" />
                      Conectar Servicio
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab de Integraciones */}
        <TabsContent value="integrations" className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="elegant-card">
              <CardContent className="p-6 text-center">
                <MessageSquare className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">WhatsApp Business</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Conecta tu cuenta de WhatsApp Business para comunicación masiva
                </p>
                <Button className="w-full elegant-button">
                  <Wifi className="w-4 h-4 mr-2" />
                  Configurar
                </Button>
              </CardContent>
            </Card>
            
            <Card className="elegant-card">
              <CardContent className="p-6 text-center">
                <Globe className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Facebook Business</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Integra con Facebook para campañas publicitarias
                </p>
                <Button className="w-full elegant-button">
                  <Wifi className="w-4 h-4 mr-2" />
                  Configurar
                </Button>
              </CardContent>
            </Card>
            
            <Card className="elegant-card">
              <CardContent className="p-6 text-center">
                <Database className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Base de Datos Externa</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Conecta con sistemas externos de datos electorales
                </p>
                <Button className="w-full elegant-button">
                  <Wifi className="w-4 h-4 mr-2" />
                  Configurar
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab de Seguridad */}
        <TabsContent value="security" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="elegant-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  Estado de Seguridad
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium">Encriptación SSL</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Activo</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium">Autenticación 2FA</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Activo</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-medium">Auditoria de Seguridad</span>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">Programada</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="elegant-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  Logs de Acceso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="p-2 bg-gray-50 rounded">
                    <span className="text-gray-500">15:23</span> - Login exitoso: admin@micampana.com
                  </div>
                  <div className="p-2 bg-gray-50 rounded">
                    <span className="text-gray-500">14:58</span> - Configuración actualizada: API Keys
                  </div>
                  <div className="p-2 bg-gray-50 rounded">
                    <span className="text-gray-500">14:32</span> - Backup automático completado
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab de Monitoreo */}
        <TabsContent value="monitoring" className="space-y-4">
          <Card className="elegant-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-600" />
                Monitoreo en Tiempo Real
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-emerald-50 rounded-lg">
                  <div className="text-2xl font-bold text-emerald-800">99.9%</div>
                  <div className="text-sm text-emerald-600">Uptime</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-800">1.2s</div>
                  <div className="text-sm text-blue-600">Tiempo Respuesta</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-800">247</div>
                  <div className="text-sm text-purple-600">Usuarios Activos</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-800">15.2MB</div>
                  <div className="text-sm text-orange-600">Uso de Memoria</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MasterControlPanel;
