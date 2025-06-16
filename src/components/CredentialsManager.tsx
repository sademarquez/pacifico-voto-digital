
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Key, 
  MessageSquare, 
  Shield, 
  Save,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface CredentialConfig {
  geminiApiKey: string;
  sellerChatApiKey: string;
  sellerChatWebhook: string;
  sellerChatAccountId: string;
}

const CredentialsManager = () => {
  const { toast } = useToast();
  const [config, setConfig] = useState<CredentialConfig>({
    geminiApiKey: 'AIzaSyDaq-_E5FQtTF0mfJsohXvT2OHMgldjq14',
    sellerChatApiKey: '',
    sellerChatWebhook: '',
    sellerChatAccountId: ''
  });
  const [showKeys, setShowKeys] = useState({
    gemini: false,
    seller: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({
    gemini: 'unknown' as 'unknown' | 'success' | 'error',
    seller: 'unknown' as 'unknown' | 'success' | 'error'
  });

  useEffect(() => {
    loadSavedCredentials();
  }, []);

  const loadSavedCredentials = async () => {
    try {
      const { data } = await supabase
        .from('system_config')
        .select('key, value')
        .in('key', ['gemini_api_key', 'sellerchat_config']);

      if (data) {
        const geminiConfig = data.find(d => d.key === 'gemini_api_key');
        const sellerConfig = data.find(d => d.key === 'sellerchat_config');

        if (geminiConfig?.value) {
          setConfig(prev => ({ ...prev, geminiApiKey: geminiConfig.value as string }));
        }

        if (sellerConfig?.value) {
          const sellerData = sellerConfig.value as any;
          setConfig(prev => ({
            ...prev,
            sellerChatApiKey: sellerData.apiKey || '',
            sellerChatWebhook: sellerData.webhookUrl || '',
            sellerChatAccountId: sellerData.accountId || ''
          }));
        }
      }
    } catch (error) {
      console.error('Error cargando credenciales:', error);
    }
  };

  const saveCredentials = async () => {
    setIsLoading(true);
    
    try {
      // Guardar Gemini API Key
      const { error: geminiError } = await supabase
        .from('system_config')
        .upsert({
          key: 'gemini_api_key',
          value: config.geminiApiKey,
          category: 'api',
          description: 'Gemini AI API Key Premium',
          is_public: false
        });

      if (geminiError) throw geminiError;

      // Guardar SellerChat config
      const sellerChatConfig = {
        apiKey: config.sellerChatApiKey,
        webhookUrl: config.sellerChatWebhook,
        accountId: config.sellerChatAccountId
      };

      const { error: sellerError } = await supabase
        .from('system_config')
        .upsert({
          key: 'sellerchat_config',
          value: sellerChatConfig,
          category: 'api',
          description: 'SellerChat WhatsApp API Configuration',
          is_public: false
        });

      if (sellerError) throw sellerError;

      toast({
        title: 'Credenciales Guardadas',
        description: 'Todas las API keys han sido configuradas correctamente',
      });

      // Test conexiones después de guardar
      await testConnections();

    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error guardando credenciales: ' + (error as Error).message,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testConnections = async () => {
    // Test Gemini
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${config.geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Test connection' }] }]
          })
        }
      );

      setConnectionStatus(prev => ({
        ...prev,
        gemini: response.ok ? 'success' : 'error'
      }));
    } catch (error) {
      setConnectionStatus(prev => ({ ...prev, gemini: 'error' }));
    }

    // Test SellerChat
    if (config.sellerChatApiKey) {
      try {
        const response = await fetch('https://api.sellerchat.com/v1/account/info', {
          headers: {
            'Authorization': `Bearer ${config.sellerChatApiKey}`,
            'Content-Type': 'application/json'
          }
        });

        setConnectionStatus(prev => ({
          ...prev,
          seller: response.ok ? 'success' : 'error'
        }));
      } catch (error) {
        setConnectionStatus(prev => ({ ...prev, seller: 'error' }));
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-blue-200">
        <CardHeader className="bg-blue-50">
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Key className="w-6 h-6" />
            Gestión de Credenciales Premium
          </CardTitle>
          <p className="text-blue-600">
            Configure las API keys para acceso completo a todos los servicios
          </p>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Gemini API Configuration */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">🤖 Gemini 2.0 Flash Premium</h3>
              {getStatusIcon(connectionStatus.gemini)}
              <Badge variant={connectionStatus.gemini === 'success' ? 'default' : 'destructive'}>
                {connectionStatus.gemini === 'success' ? 'Conectado' : 'Desconectado'}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gemini-key">API Key de Gemini</Label>
              <div className="relative">
                <Input
                  id="gemini-key"
                  type={showKeys.gemini ? "text" : "password"}
                  value={config.geminiApiKey}
                  onChange={(e) => setConfig(prev => ({ ...prev, geminiApiKey: e.target.value }))}
                  placeholder="AIzaSy..."
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowKeys(prev => ({ ...prev, gemini: !prev.gemini }))}
                >
                  {showKeys.gemini ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                API Key premium configurada para acceso completo a Gemini 2.0 Flash
              </p>
            </div>
          </div>

          {/* SellerChat Configuration */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">📱 SellerChat WhatsApp Business</h3>
              {getStatusIcon(connectionStatus.seller)}
              <Badge variant={connectionStatus.seller === 'success' ? 'default' : 'destructive'}>
                {connectionStatus.seller === 'success' ? 'Conectado' : 'Desconectado'}
              </Badge>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seller-key">API Key de SellerChat</Label>
                <div className="relative">
                  <Input
                    id="seller-key"
                    type={showKeys.seller ? "text" : "password"}
                    value={config.sellerChatApiKey}
                    onChange={(e) => setConfig(prev => ({ ...prev, sellerChatApiKey: e.target.value }))}
                    placeholder="sc_..."
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowKeys(prev => ({ ...prev, seller: !prev.seller }))}
                  >
                    {showKeys.seller ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seller-webhook">Webhook URL</Label>
                <Input
                  id="seller-webhook"
                  value={config.sellerChatWebhook}
                  onChange={(e) => setConfig(prev => ({ ...prev, sellerChatWebhook: e.target.value }))}
                  placeholder="https://your-app.com/webhook/sellerchat"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seller-account">Account ID</Label>
                <Input
                  id="seller-account"
                  value={config.sellerChatAccountId}
                  onChange={(e) => setConfig(prev => ({ ...prev, sellerChatAccountId: e.target.value }))}
                  placeholder="Opcional - ID de cuenta SellerChat"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button 
              onClick={saveCredentials}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Guardando...' : 'Guardar Credenciales'}
            </Button>
            
            <Button 
              onClick={testConnections}
              variant="outline"
              disabled={isLoading}
            >
              <Shield className="w-4 h-4 mr-2" />
              Probar Conexiones
            </Button>
          </div>

          {/* Status Information */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              Estado de Servicios Premium
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">Gemini 2.0 Flash:</p>
                <p className="text-gray-600">
                  {connectionStatus.gemini === 'success' ? 
                    '✅ API Premium activa - Acceso completo' : 
                    '⚠️ Verificar API Key - Revisar configuración'}
                </p>
              </div>
              <div>
                <p className="font-medium">SellerChat WhatsApp:</p>
                <p className="text-gray-600">
                  {connectionStatus.seller === 'success' ? 
                    '✅ WhatsApp Business conectado' : 
                    config.sellerChatApiKey ? 
                      '⚠️ Verificar credenciales SellerChat' : 
                      '📝 Configurar API Key para activar'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CredentialsManager;
