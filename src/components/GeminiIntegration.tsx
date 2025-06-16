
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Settings, MessageSquare, BarChart3, Users, Brain, CheckCircle, AlertCircle } from 'lucide-react';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { useToast } from '@/hooks/use-toast';
import { premiumGeminiService } from '@/services/premiumGeminiService';

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
  analysis?: {
    sentiment: string;
    confidence: number;
  };
}

const GeminiIntegration = () => {
  const { user } = useSimpleAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showConfig, setShowConfig] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'connected' | 'error' | 'idle'>('idle');

  // Fetch configuración real de Gemini
  const { data: geminiConfig, isLoading, refetch } = useQuery({
    queryKey: ['gemini-config', user?.id],
    queryFn: async (): Promise<GeminiConfig | null> => {
      if (!user?.id) return null;

      try {
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
      } catch (error) {
        console.error('Error fetching Gemini config:', error);
        return null;
      }
    },
    enabled: !!user?.id
  });

  // Test de conexión real
  const testConnectionMutation = useMutation({
    mutationFn: async () => {
      setConnectionStatus('testing');
      const result = await premiumGeminiService.testConnection();
      setConnectionStatus(result.success ? 'connected' : 'error');
      return result;
    },
    onSuccess: (result) => {
      toast({
        title: result.success ? 'Conexión exitosa' : 'Error de conexión',
        description: result.message,
        variant: result.success ? 'default' : 'destructive'
      });
    }
  });

  // Configurar Gemini con API premium
  const configureGeminiMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('Usuario no autenticado');

      const { data, error } = await supabase
        .from('gemini_configs')
        .upsert({
          user_id: user.id,
          api_key_encrypted: 'AIzaSyDaq-_E5FQtTF0mfJsohXvT2OHMgldjq14', // Tu API premium
          model_preference: 'gemini-2.0-flash',
          custom_prompts: {
            electoral_analysis: 'Eres un experto analista electoral especializado en campañas políticas democráticas.',
            voter_engagement: 'Especialízate en estrategias de participación ciudadana.',
            data_insights: 'Analiza datos electorales y proporciona insights valiosos.'
          },
          usage_limits: {
            daily_requests: 1000,
            monthly_requests: 25000,
            max_tokens_per_request: 2048
          },
          is_active: true
        }, {
          onConflict: 'user_id'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Gemini Premium configurado',
        description: 'La integración con Gemini 2.0 Flash está activa',
      });
      setShowConfig(false);
      queryClient.invalidateQueries({ queryKey: ['gemini-config'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error de configuración',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Procesar mensaje con Gemini real
  const processMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const electoralPrompt = `Como asistente electoral experto, responde a: "${message}"
      
      Contexto: MI CAMPAÑA 2025 - Sistema electoral inteligente
      Usuario: ${user?.name}
      Rol: Análisis y estrategia electoral
      
      Proporciona una respuesta útil, práctica y específica para campañas electorales.`;

      const response = await premiumGeminiService.makeRequest(electoralPrompt);
      
      // Analizar sentimiento del mensaje del usuario
      const analysis = await premiumGeminiService.analyzeElectoralSentiment(message);
      
      return { response, analysis };
    },
    onSuccess: ({ response, analysis }) => {
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        analysis: {
          sentiment: analysis.sentiment,
          confidence: analysis.confidence
        }
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

  // Mensaje de bienvenida premium
  useEffect(() => {
    if (geminiConfig?.is_active && chatMessages.length === 0) {
      setChatMessages([{
        role: 'assistant',
        content: `🚀 **¡Gemini Premium activado para ${user?.name}!**

Tu asistente electoral con **Gemini 2.0 Flash Premium** está listo:

**🎯 Capacidades Premium:**
• **Análisis Electoral Avanzado** - Insights predictivos
• **Estrategias IA Personalizadas** - Tácticas optimizadas  
• **Sentiment Analysis** - Evaluación automática de mensajes
• **Optimización de Contenido** - Mensajes de alto impacto

**⚡ Ventajas Premium:**
• Mayor velocidad de respuesta
• Análisis más profundos
• Sin límites restrictivos
• Modelos más avanzados

¿En qué aspecto de tu campaña te puedo ayudar hoy?`,
        timestamp: new Date()
      }]);
    }
  }, [geminiConfig, user, chatMessages.length]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gemini AI Premium</h2>
          <p className="text-gray-600">Inteligencia artificial avanzada para análisis electoral</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => testConnectionMutation.mutate()} 
            variant="outline"
            disabled={testConnectionMutation.isPending}
          >
            {connectionStatus === 'testing' ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            ) : connectionStatus === 'connected' ? (
              <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
            ) : connectionStatus === 'error' ? (
              <AlertCircle className="w-4 h-4 mr-2 text-red-600" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            {testConnectionMutation.isPending ? 'Probando...' : 'Test Premium'}
          </Button>
          {!geminiConfig?.is_active && (
            <Button onClick={() => configureGeminiMutation.mutate()}>
              <Settings className="w-4 h-4 mr-2" />
              Activar Premium
            </Button>
          )}
        </div>
      </div>

      {/* Estado de configuración */}
      {!geminiConfig?.is_active && (
        <Card className="border-2 border-amber-200 bg-amber-50">
          <CardContent className="p-6 text-center">
            <Brain className="w-16 h-16 mx-auto mb-4 text-amber-600" />
            <h3 className="text-lg font-semibold text-amber-800 mb-2">
              Gemini Premium disponible
            </h3>
            <p className="text-amber-700 mb-4">
              API Premium lista para activar. Funcionalidades avanzadas incluidas.
            </p>
            <Button 
              onClick={() => configureGeminiMutation.mutate()}
              className="bg-amber-600 hover:bg-amber-700"
              disabled={configureGeminiMutation.isPending}
            >
              {configureGeminiMutation.isPending ? 'Activando...' : 'Activar Gemini Premium'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Chat interface premium */}
      {geminiConfig?.is_active && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat principal */}
          <div className="lg:col-span-2">
            <Card className="h-96">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <CardTitle className="text-lg">Chat Electoral Premium</CardTitle>
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white ml-auto">
                    Gemini 2.0 Flash Premium ⚡
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
                        {message.analysis && (
                          <div className="text-xs mt-2 opacity-75">
                            📊 Sentiment: {message.analysis.sentiment} ({Math.round(message.analysis.confidence * 100)}%)
                          </div>
                        )}
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
                          <span className="text-sm text-gray-600">Gemini Premium procesando...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Pregunta sobre estrategias electorales, análisis de datos..."
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

          {/* Panel de información premium */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Capacidades Premium
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">Análisis predictivo avanzado</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Métricas electorales en tiempo real</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-purple-600" />
                  <span className="text-sm">Optimización de mensajes IA</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span className="text-sm">Insights estratégicos premium</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Estado Premium</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Modelo:</span>
                    <span className="font-medium">Gemini 2.0 Flash</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Plan:</span>
                    <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                      Premium
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Estado:</span>
                    <Badge className={`${
                      connectionStatus === 'connected' ? 'bg-green-100 text-green-800' :
                      connectionStatus === 'error' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {connectionStatus === 'connected' ? 'Conectado' :
                       connectionStatus === 'error' ? 'Error' : 'Listo'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeminiIntegration;
