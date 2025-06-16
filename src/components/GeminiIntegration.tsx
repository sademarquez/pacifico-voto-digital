
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Settings, MessageSquare, BarChart3, Users, Brain, CheckCircle, AlertCircle } from 'lucide-react';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { useToast } from '@/hooks/use-toast';
import { realGeminiService } from '@/services/realGeminiService';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  analysis?: {
    sentiment: string;
    confidence: number;
    electoral_impact: string;
  };
}

const GeminiIntegration = () => {
  const { user } = useSimpleAuth();
  const { toast } = useToast();
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'connected' | 'error' | 'idle'>('idle');
  const [isGeminiActive, setIsGeminiActive] = useState(true);

  // Test de conexión real con Gemini
  const testConnectionMutation = async () => {
    setConnectionStatus('testing');
    try {
      const result = await realGeminiService.testConnection();
      setConnectionStatus(result.success ? 'connected' : 'error');
      
      toast({
        title: result.success ? 'Conexión exitosa' : 'Error de conexión', 
        description: result.message,
        variant: result.success ? 'default' : 'destructive'
      });
      
      return result;
    } catch (error) {
      setConnectionStatus('error');
      toast({
        title: 'Error crítico',
        description: (error as Error).message,
        variant: 'destructive'
      });
    }
  };

  // Procesar mensaje con Gemini real
  const processMessage = async (message: string) => {
    setIsProcessing(true);
    
    try {
      const electoralPrompt = `Como asistente electoral experto especializado en campañas políticas, resp a: "${message}"
      
      Contexto: MI CAMPAÑA 2025 - Sistema electoral inteligente
      Usuario: ${user?.name} (${user?.role})
      
      Proporciona una respuesta útil, práctica y específica para campañas electorales democráticas.
      Enfócate en estrategias éticas, análisis de datos y participación ciudadana.`;

      const response = await realGeminiService.makeRequest(electoralPrompt);
      
      // Analizar sentimiento del mensaje del usuario
      const analysis = await realGeminiService.analyzeElectoralSentiment(message);
      
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        analysis: {
          sentiment: analysis.sentiment,
          confidence: analysis.confidence,
          electoral_impact: analysis.electoral_impact
        }
      }]);
      
    } catch (error) {
      toast({
        title: 'Error procesando mensaje',
        description: (error as Error).message,
        variant: 'destructive'
      });
      
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Lo siento, ha ocurrido un error procesando tu mensaje. Por favor, inténtalo de nuevo.',
        timestamp: new Date()
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    const messageToProcess = currentMessage;
    setCurrentMessage('');
    
    await processMessage(messageToProcess);
  };

  // Mensaje de bienvenida premium
  useEffect(() => {
    if (isGeminiActive && chatMessages.length === 0 && user) {
      setChatMessages([{
        role: 'assistant',
        content: `🚀 **¡Gemini 2.0 Flash Premium activado para ${user.name}!**

Tu asistente electoral con **Gemini Premium** está listo:

**🎯 Capacidades Premium:**
• **Análisis Electoral Avanzado** - Insights predictivos con IA
• **Estrategias Personalizadas** - Tácticas optimizadas para tu campaña
• **Sentiment Analysis** - Evaluación automática de mensajes
• **Optimización de Contenido** - Mensajes de alto impacto electoral

**⚡ Ventajas Premium:**
• Modelo Gemini 2.0 Flash Experimental
• Respuestas más rápidas y precisas
• Análisis electoral especializado
• Sin límites restrictivos

**API Premium Activa:** AIzaSyDaq-_E5FQtTF0mfJsohXvT2OHMgldjq14

¿En qué aspecto de tu campaña electoral te puedo ayudar hoy?`,
        timestamp: new Date()
      }]);
    }
  }, [isGeminiActive, user, chatMessages.length]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gemini AI Premium</h2>
          <p className="text-gray-600">Inteligencia artificial avanzada para análisis electoral</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={testConnectionMutation} 
            variant="outline"
            disabled={connectionStatus === 'testing'}
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
            {connectionStatus === 'testing' ? 'Probando...' : 'Test Premium'}
          </Button>
        </div>
      </div>

      {/* Chat interface premium */}
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
                          <br />
                          🎯 Impacto: {message.analysis.electoral_impact}
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
                        <span className="text-sm text-gray-600">Gemini Premium analizando...</span>
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
                <span className="text-sm">Análisis predictivo electoral</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-green-600" />
                <span className="text-sm">Métricas en tiempo real</span>
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
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {connectionStatus === 'connected' ? 'Conectado' :
                     connectionStatus === 'error' ? 'Error' : 
                     connectionStatus === 'testing' ? 'Probando' : 'Listo'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">API Key:</span>
                  <span className="font-mono text-xs">...djq14</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GeminiIntegration;
