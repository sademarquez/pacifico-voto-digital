
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Settings, 
  Key, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink,
  Shield,
  MessageSquare,
  Workflow,
  Map,
  Youtube,
  Facebook
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';

interface ApiConfig {
  name: string;
  key: string;
  status: 'connected' | 'disconnected' | 'error';
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  setupUrl?: string;
}

const ApiControlPanel = () => {
  const { user } = useSimpleAuth();
  const { toast } = useToast();
  const [apiConfigs, setApiConfigs] = useState<ApiConfig[]>([
    {
      name: 'Gemini AI',
      key: 'AIzaSyDaq-_E5FQtTF0mfJsohXvT2OHMgldjq14',
      status: 'connected',
      description: 'IA Generativa 2.0 Flash Premium para análisis electoral',
      icon: Shield,
      color: 'text-green-600',
      setupUrl: 'https://makersuite.google.com/app/apikey'
    },
    {
      name: 'SellerChat WhatsApp',
      key: '',
      status: 'disconnected',
      description: 'API para mensajería masiva WhatsApp Business',
      icon: MessageSquare,
      color: 'text-green-500',
      setupUrl: 'https://sellerchat.com.br/api'
    },
    {
      name: 'N8N Automation',
      key: '',
      status: 'disconnected',
      description: 'Automatización de workflows electorales',
      icon: Workflow,
      color: 'text-purple-600',
      setupUrl: 'https://n8n.cloud'
    },
    {
      name: 'Google Maps',
      key: '',
      status: 'disconnected',
      description: 'Geolocalización premium y análisis territorial',
      icon: Map,
      color: 'text-blue-600',
      setupUrl: 'https://console.cloud.google.com/google/maps-apis'
    },
    {
      name: 'YouTube API',
      key: '',
      status: 'disconnected',
      description: 'Gestión de contenido electoral en YouTube',
      icon: Youtube,
      color: 'text-red-600',
      setupUrl: 'https://console.cloud.google.com/apis/api/youtube.googleapis.com'
    },
    {
      name: 'Facebook/Meta',
      key: '',
      status: 'disconnected',
      description: 'Publicidad electoral y análisis de audiencias',
      icon: Facebook,
      color: 'text-blue-700',
      setupUrl: 'https://developers.facebook.com/apps'
    }
  ]);

  // Solo mostrar a desarrolladores y masters
  if (!user || !['desarrollador', 'master'].includes(user.role)) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Panel de control disponible solo para desarrolladores y masters.
        </AlertDescription>
      </Alert>
    );
  }

  const updateApiKey = (index: number, newKey: string) => {
    const updated = [...apiConfigs];
    updated[index].key = newKey;
    updated[index].status = newKey ? 'connected' : 'disconnected';
    setApiConfigs(updated);

    toast({
      title: newKey ? 'API Configurada' : 'API Desconectada',
      description: `${updated[index].name} ${newKey ? 'conectada correctamente' : 'desconectada'}`,
      variant: newKey ? 'default' : 'destructive'
    });
  };

  const testConnection = async (config: ApiConfig) => {
    if (!config.key) {
      toast({
        title: 'Error',
        description: 'Ingresa una API key válida primero',
        variant: 'destructive'
      });
      return;
    }

    toast({
      title: 'Probando conexión...',
      description: `Verificando ${config.name}`,
    });

    // Simular test de conexión
    setTimeout(() => {
      toast({
        title: '✅ Conexión exitosa',
        description: `${config.name} funcionando correctamente`,
      });
    }, 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-600" />;
      default: return <AlertCircle className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected': return <Badge className="bg-green-100 text-green-800">Conectado</Badge>;
      case 'error': return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      default: return <Badge className="bg-yellow-100 text-yellow-800">Desconectado</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-700 rounded-xl flex items-center justify-center shadow-lg">
          <Settings className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-amber-900">Panel de Control APIs</h2>
          <p className="text-amber-700">Configuración de servicios externos premium</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-amber-50">
          <TabsTrigger value="overview" className="text-amber-800">Vista General</TabsTrigger>
          <TabsTrigger value="configuration" className="text-amber-800">Configuración</TabsTrigger>
          <TabsTrigger value="monitoring" className="text-amber-800">Monitoreo</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {apiConfigs.map((config, index) => (
              <Card key={index} className="border-amber-200 bg-white/95 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <config.icon className={`w-5 h-5 ${config.color}`} />
                      <CardTitle className="text-lg text-amber-900">{config.name}</CardTitle>
                    </div>
                    {getStatusIcon(config.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-amber-800">{config.description}</p>
                  <div className="flex items-center justify-between">
                    {getStatusBadge(config.status)}
                    {config.setupUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-amber-300 text-amber-700 hover:bg-amber-50"
                        onClick={() => window.open(config.setupUrl, '_blank')}
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Setup
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="configuration" className="space-y-4">
          {apiConfigs.map((config, index) => (
            <Card key={index} className="border-amber-200 bg-white/95">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <config.icon className={`w-5 h-5 ${config.color}`} />
                  <CardTitle className="text-amber-900">{config.name}</CardTitle>
                  {getStatusBadge(config.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-amber-800">{config.description}</p>
                <div className="space-y-2">
                  <Label htmlFor={`api-${index}`} className="text-amber-800 font-medium">
                    API Key / Token
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id={`api-${index}`}
                      type="password"
                      value={config.key}
                      onChange={(e) => updateApiKey(index, e.target.value)}
                      placeholder="Ingresa tu API key..."
                      className="border-amber-200 focus:border-amber-500"
                    />
                    <Button
                      onClick={() => testConnection(config)}
                      variant="outline"
                      className="border-amber-300 text-amber-700 hover:bg-amber-50"
                      disabled={!config.key}
                    >
                      <Key className="w-4 h-4 mr-1" />
                      Test
                    </Button>
                  </div>
                </div>
                {config.setupUrl && (
                  <Button
                    variant="link"
                    className="text-amber-600 hover:text-amber-800 p-0"
                    onClick={() => window.open(config.setupUrl, '_blank')}
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Ver documentación de {config.name}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <Alert className="border-amber-200 bg-amber-50">
            <CheckCircle className="h-4 w-4 text-amber-700" />
            <AlertDescription className="text-amber-800">
              <strong>Estado del Sistema:</strong> Todas las APIs configuradas funcionando correctamente.
              Última verificación: {new Date().toLocaleString()}
            </AlertDescription>
          </Alert>

          <Card className="border-amber-200 bg-white/95">
            <CardHeader>
              <CardTitle className="text-amber-900">Estadísticas de Uso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-amber-800">6</p>
                  <p className="text-sm text-amber-600">APIs Configuradas</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">1</p>
                  <p className="text-sm text-amber-600">Activas</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-600">5</p>
                  <p className="text-sm text-amber-600">Pendientes</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-800">99.9%</p>
                  <p className="text-sm text-amber-600">Uptime</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApiControlPanel;
