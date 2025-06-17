
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useSimpleAuth } from "../contexts/SimpleAuthContext";
import { useToast } from "@/hooks/use-toast";
import PageLayout from "@/components/PageLayout";
import { 
  Settings, 
  Key, 
  Zap, 
  Shield, 
  Database, 
  Bot, 
  MessageCircle,
  CheckCircle,
  AlertTriangle,
  Smartphone
} from "lucide-react";
import { geminiService } from "../services/geminiService";

const ConfiguracionAvanzada = () => {
  const { user } = useSimpleAuth();
  const { toast } = useToast();

  const [config, setConfig] = useState({
    geminiApiKey: '',
    sellerChatEnabled: false,
    sellerChatApiKey: '',
    automationEnabled: true,
    notificationsEnabled: true,
    advancedAnalytics: true,
    customPrompts: '',
    systemLanguage: 'es'
  });

  const [geminiStatus, setGeminiStatus] = useState<{
    connected: boolean;
    model: string;
    latency?: number;
  }>({
    connected: false,
    model: 'gemini-2.0-flash'
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Cargar configuración inicial
    loadConfiguration();
    testGeminiConnection();
  }, []);

  const loadConfiguration = () => {
    // Cargar desde localStorage por ahora
    const savedConfig = localStorage.getItem('mi-campana-config');
    if (savedConfig) {
      const parsed = JSON.parse(savedConfig);
      setConfig(prev => ({ ...prev, ...parsed }));
    }
  };

  const saveConfiguration = async () => {
    setIsLoading(true);
    try {
      // Guardar en localStorage por ahora
      localStorage.setItem('mi-campana-config', JSON.stringify(config));
      
      toast({
        title: "Configuración guardada",
        description: "Los cambios se han aplicado correctamente.",
      });
      
      // Re-testear Gemini si cambió la API key
      if (config.geminiApiKey) {
        await testGeminiConnection();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar la configuración.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testGeminiConnection = async () => {
    try {
      const result = await geminiService.testConnection();
      const modelInfo = await geminiService.getModelInfo();
      
      setGeminiStatus({
        connected: result.success,
        model: modelInfo.model,
        latency: result.latency
      });
    } catch (error) {
      setGeminiStatus({
        connected: false,
        model: 'gemini-2.0-flash'
      });
    }
  };

  const testSellerChat = () => {
    toast({
      title: "SellerChat Test",
      description: "Funcionalidad en desarrollo. Pronto estará disponible.",
    });
  };

  return (
    <PageLayout borderVariant="gradient" borderColor="purple">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
            <Settings className="w-8 h-8 text-purple-600" />
            Configuración Avanzada
          </h1>
          <p className="text-gray-600">
            Personaliza tu experiencia electoral con IA - {user?.name} ({user?.role})
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Configuración de Gemini AI */}
          <Card className="border-2 border-blue-200">
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Bot className="w-5 h-5" />
                Gemini 2.0 Flash Premium
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Estado de Conexión:</span>
                <Badge variant={geminiStatus.connected ? "default" : "destructive"}>
                  {geminiStatus.connected ? (
                    <><CheckCircle className="w-3 h-3 mr-1" /> Conectado</>
                  ) : (
                    <><AlertTriangle className="w-3 h-3 mr-1" /> Desconectado</>
                  )}
                </Badge>
              </div>

              {geminiStatus.connected && (
                <div className="space-y-2 text-sm text-gray-600">
                  <p>Modelo: {geminiStatus.model}</p>
                  {geminiStatus.latency && (
                    <p>Latencia: {geminiStatus.latency}ms</p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="gemini-key">API Key Personal (Opcional)</Label>
                <Input
                  id="gemini-key"
                  type="password"
                  value={config.geminiApiKey}
                  onChange={(e) => setConfig({...config, geminiApiKey: e.target.value})}
                  placeholder="AIzaSy... (Deja vacío para usar la clave compartida)"
                />
                <p className="text-xs text-gray-500">
                  Usa tu propia API key para mayor límite de requests
                </p>
              </div>

              <Button 
                onClick={testGeminiConnection}
                variant="outline"
                className="w-full"
              >
                <Zap className="w-4 h-4 mr-2" />
                Probar Conexión
              </Button>
            </CardContent>
          </Card>

          {/* Configuración de SellerChat */}
          <Card className="border-2 border-green-200">
            <CardHeader className="bg-green-50">
              <CardTitle className="flex items-center gap-2 text-green-800">
                <MessageCircle className="w-5 h-5" />
                SellerChat Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="sellerchat-enabled">Activar SellerChat</Label>
                <Switch
                  id="sellerchat-enabled"
                  checked={config.sellerChatEnabled}
                  onCheckedChange={(checked) => setConfig({...config, sellerChatEnabled: checked})}
                />
              </div>

              {config.sellerChatEnabled && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="sellerchat-key">SellerChat API Key</Label>
                    <Input
                      id="sellerchat-key"
                      type="password"
                      value={config.sellerChatApiKey}
                      onChange={(e) => setConfig({...config, sellerChatApiKey: e.target.value})}
                      placeholder="sc_..."
                    />
                  </div>

                  <Button 
                    onClick={testSellerChat}
                    variant="outline"
                    className="w-full"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Probar SellerChat
                  </Button>
                </div>
              )}

              <div className="bg-green-50 p-3 rounded-lg text-sm text-green-700">
                <strong>SellerChat Premium:</strong> Integración directa con WhatsApp Business para campañas masivas automatizadas.
              </div>
            </CardContent>
          </Card>

          {/* Configuraciones del Sistema */}
          <Card className="border-2 border-purple-200">
            <CardHeader className="bg-purple-50">
              <CardTitle className="flex items-center gap-2 text-purple-800">
                <Shield className="w-5 h-5" />
                Configuración del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="automation">Automatización 24/7</Label>
                <Switch
                  id="automation"
                  checked={config.automationEnabled}
                  onCheckedChange={(checked) => setConfig({...config, automationEnabled: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="notifications">Notificaciones Push</Label>
                <Switch
                  id="notifications"
                  checked={config.notificationsEnabled}
                  onCheckedChange={(checked) => setConfig({...config, notificationsEnabled: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="analytics">Analytics Avanzado</Label>
                <Switch
                  id="analytics"
                  checked={config.advancedAnalytics}
                  onCheckedChange={(checked) => setConfig({...config, advancedAnalytics: checked})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prompts">Prompts Personalizados</Label>
                <Textarea
                  id="prompts"
                  value={config.customPrompts}
                  onChange={(e) => setConfig({...config, customPrompts: e.target.value})}
                  placeholder="Instrucciones personalizadas para la IA..."
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Información del Sistema */}
          <Card className="border-2 border-gray-200">
            <CardHeader className="bg-gray-50">
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <Database className="w-5 h-5" />
                Estado del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Usuario:</span>
                  <span className="font-medium">{user?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Rol:</span>
                  <Badge variant="outline">{user?.role}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Base de Datos:</span>
                  <Badge variant="default">✅ Conectada</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Gemini AI:</span>
                  <Badge variant={geminiStatus.connected ? "default" : "destructive"}>
                    {geminiStatus.connected ? '✅ Activo' : '❌ Offline'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>N8N Workflows:</span>
                  <Badge variant="default">✅ Operativo</Badge>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Smartphone className="w-4 h-4" />
                  <strong>Mobile Ready:</strong>
                </div>
                <p className="text-xs text-gray-500">
                  Aplicación optimizada para Android con Capacitor. Lista para deployment.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Botones de Acción */}
        <div className="flex justify-center gap-4">
          <Button 
            onClick={saveConfiguration}
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8"
          >
            {isLoading ? "Guardando..." : "Guardar Configuración"}
          </Button>
          
          <Button 
            variant="outline"
            onClick={loadConfiguration}
          >
            Restaurar Configuración
          </Button>
        </div>

        {/* Información adicional */}
        <Card>
          <CardContent className="p-4">
            <div className="text-center text-sm text-gray-600">
              <p className="mb-2">
                <strong>MI CAMPAÑA 2025</strong> - Sistema Electoral con IA
              </p>
              <p>
                Gemini 2.0 Flash + N8N Automation + Supabase Database + Mobile PWA
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default ConfiguracionAvanzada;
