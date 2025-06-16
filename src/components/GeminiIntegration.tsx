
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Settings, MessageSquare, BarChart3, Users, Brain } from 'lucide-react';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { useToast } from '@/hooks/use-toast';
import { geminiService } from '@/services/geminiService';

interface GeminiConfig {
  id: string;
  api_key_encrypted: string;
  model_preference: string;
  custom_prompts: any;
  usage_limits: any;
  is_active: boolean;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const GeminiIntegration = () => {
  const { user } = useSimpleAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [showConfig, setShowConfig] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch Gemini configuration
  const { data: geminiConfig, isLoading } = useQuery({
    queryKey: ['gemini-config', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('gemini_configs')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching Gemini config:', error);
        return null;
      }
      return data;
    },
    enabled: !!user?.id
  });

  // Save Gemini configuration
  const saveConfigMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id || !apiKey) throw new Error('Datos incompletos');

      const configData = {
        user_id: user.id,
        api_key_encrypted: apiKey, // En producción esto debe ser encriptado
        model_preference: 'gemini-2.0-flash',
        custom_prompts: {
          electoral_analysis: 'Eres un experto analista electoral especializado en campañas políticas democráticas. Analiza datos, tendencias y proporciona insights estratégicos.',
          voter_engagement: 'Especialízate en estrategias de participación ciudadana y comunicación política efectiva.',
          data_insights: 'Analiza datos electorales y proporciona insights valiosos para la toma de decisiones estratégicas.'
        },
        usage_limits: {
          daily_requests: 1000,
          monthly_requests: 25000,
          max_tokens_per_request: 2048
        },
        is_active: true
      };

      const { data, error } = await supabase
        .from('gemini_configs')
        .upsert(configData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Configuración guardada',
        description: 'Gemini AI ha sido configurado exitosamente.',
      });
      setShowConfig(false);
      setApiKey('');
      queryClient.invalidateQueries({ queryKey: ['gemini-config'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error al configurar Gemini',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Process message with Gemini
  const processMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await geminiService.generateAutomatedResponse({
        userMessage: message,
        userProfile: user,
        conversationHistory: chatMessages.slice(-5).map(m => `${m.role}: ${m.content}`)
      });
      return response;
    },
    onSuccess: (response) => {
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }]);
      setIsProcessing(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Error procesando mensaje',
        description: error.message,
        variant: 'destructive',
      });
      setIsProcessing(false);
    }
  });

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    processMessageMutation.mutate(currentMessage);
    setCurrentMessage('');
  };

  const testConnection = async () => {
    try {
      const result = await geminiService.testConnection();
      toast({
        title: result.success ? 'Conexión exitosa' : 'Error de conexión',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
      });
    } catch (error) {
      toast({
        title: 'Error de prueba',
        description: 'No se pudo probar la conexión',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    if (geminiConfig?.is_active && chatMessages.length === 0) {
      // Mensaje de bienvenida
      setChatMessages([{
        role: 'assistant',
        content: `¡Hola ${user?.name}! 👋 

Soy tu asistente electoral con Gemini 2.0 Flash. Estoy aquí para ayudarte con:

📊 **Análisis Electoral:** Evaluación de datos y tendencias
🎯 **Estrategia de Campaña:** Optimización de recursos y targeting
👥 **Participación Ciudadana:** Estrategias de engagement
📈 **Insights de Datos:** Análisis predictivo y métricas

¿En qué puedo ayudarte hoy?`,
        timestamp: new Date()
      }]);
    }
  }, [geminiConfig, user]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Asistente Gemini AI</h2>
          <p className="text-gray-600">Inteligencia artificial especializada en análisis electoral</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={testConnection} variant="outline">
            <Sparkles className="w-4 h-4 mr-2" />
            Probar Conexión
          </Button>
          <Button onClick={() => setShowConfig(true)}>
            <Settings className="w-4 h-4 mr-2" />
            Configurar
          </Button>
        </div>
      </div>

      {/* Estado de configuración */}
      {!geminiConfig?.is_active && (
        <Card className="border-2 border-amber-200 bg-amber-50">
          <CardContent className="p-6 text-center">
            <Brain className="w-16 h-16 mx-auto mb-4 text-amber-600" />
            <h3 className="text-lg font-semibold text-amber-800 mb-2">
              Gemini AI no configurado
            </h3>
            <p className="text-amber-700 mb-4">
              Configura tu API key de Google Gemini para activar el asistente de IA.
            </p>
            <Button onClick={() => setShowConfig(true)} className="bg-amber-600 hover:bg-amber-700">
              Configurar Gemini AI
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Chat interface */}
      {geminiConfig?.is_active && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat principal */}
          <div className="lg:col-span-2">
            <Card className="h-96">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <CardTitle className="text-lg">Chat Electoral</CardTitle>
                  <Badge className="bg-green-100 text-green-800 ml-auto">
                    Gemini 2.0 Flash Activo
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto mb-4 space-y-3">
                  {chatMessages.map((message, index) => (
                    <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.role === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isProcessing && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 px-4 py-2 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                          <span className="text-sm text-gray-600">Gemini está pensando...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Pregunta sobre análisis electoral, estrategias, datos..."
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={isProcessing}
                  />
                  <Button onClick={handleSendMessage} disabled={isProcessing || !currentMessage.trim()}>
                    Enviar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Panel de información */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Capacidades
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">Análisis de votantes</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Métricas electorales</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-purple-600" />
                  <span className="text-sm">Estrategias de comunicación</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span className="text-sm">Insights predictivos</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Uso del Modelo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Modelo:</span>
                    <span className="font-medium">{geminiConfig?.model_preference}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Límite diario:</span>
                    <span className="font-medium">{geminiConfig?.usage_limits?.daily_requests || 1000}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Estado:</span>
                    <Badge className="bg-green-100 text-green-800">Activo</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Modal de configuración */}
      {showConfig && (
        <Card>
          <CardHeader>
            <CardTitle>Configurar Gemini AI</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="api-key">Google Gemini API Key</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="AIzaSy..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Obtén tu API key desde <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google AI Studio</a>
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Funcionalidades incluidas:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Análisis electoral inteligente</li>
                <li>• Generación de estrategias de campaña</li>
                <li>• Insights predictivos basados en datos</li>
                <li>• Optimización de recursos electorales</li>
                <li>• Asistente 24/7 especializado</li>
              </ul>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowConfig(false)}>
                Cancelar
              </Button>
              <Button onClick={() => saveConfigMutation.mutate()} disabled={saveConfigMutation.isPending || !apiKey}>
                {saveConfigMutation.isPending ? "Guardando..." : "Activar Gemini AI"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GeminiIntegration;
