
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useSecureAuth } from '../contexts/SecureAuthContext';
import { geminiService } from '@/services/geminiService';
import { 
  Sparkles, 
  MessageSquare, 
  Send, 
  Bot, 
  Zap,
  X,
  Minimize2,
  Maximize2,
  HelpCircle
} from 'lucide-react';
import { toast } from 'sonner';

const GeminiAssistant = () => {
  const { user } = useSecureAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions] = useState([
    "¿Cómo optimizar mi campaña?",
    "Analizar métricas de votantes",
    "Generar mensaje personalizado",
    "Estrategias de comunicación"
  ]);

  useEffect(() => {
    if (isOpen && conversation.length === 0) {
      // Mensaje de bienvenida personalizado
      const welcomeMessage = `¡Hola ${user?.name}! Soy tu asistente IA electoral. Como ${user?.role}, puedo ayudarte con estrategias de campaña, análisis de datos, generación de mensajes personalizados y optimización de recursos. ¿En qué puedo asistirte hoy?`;
      
      setConversation([
        { role: 'assistant', content: welcomeMessage }
      ]);
    }
  }, [isOpen, user, conversation.length]);

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage('');
    setIsLoading(true);

    // Agregar mensaje del usuario
    const newConversation = [...conversation, { role: 'user' as const, content: userMessage }];
    setConversation(newConversation);

    try {
      // Crear contexto para Gemini basado en el rol del usuario
      const contextPrompt = `
        Eres un asistente IA especializado en campañas electorales para MI CAMPAÑA 2025.
        Usuario actual: ${user?.name} (Rol: ${user?.role})
        
        Contexto del sistema:
        - Plataforma electoral con automatización IA
        - Funcionalidades: gestión de votantes, análisis de sentimientos, métricas en tiempo real
        - Capacidades: mensajes personalizados, optimización de campañas, análisis predictivo
        
        Pregunta del usuario: ${userMessage}
        
        Responde de manera profesional, específica para campañas electorales y adaptada al rol del usuario.
        Proporciona consejos prácticos y accionables. Mantén un tono profesional pero cercano.
        Máximo 200 palabras.
      `;

      // Llamar a Gemini con el contexto
      const response = await geminiService.makeRequest(contextPrompt);
      
      // Agregar respuesta del asistente
      setConversation(prev => [...prev, { role: 'assistant', content: response }]);
      
    } catch (error) {
      console.error('Error al comunicarse con Gemini:', error);
      toast.error('Error al conectar con el asistente IA');
      
      // Respuesta de fallback
      const fallbackResponse = "Disculpa, tengo problemas de conexión temporales. Mientras tanto, puedes explorar las funcionalidades de la plataforma o contactar al equipo de soporte.";
      setConversation(prev => [...prev, { role: 'assistant', content: fallbackResponse }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!user) return null;

  return (
    <>
      {/* Botón flotante del asistente */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-soft">
          <Button
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 rounded-full gradient-bg-primary shadow-modern-xl hover:shadow-modern-xl transform hover:scale-110 transition-all duration-300"
          >
            <Sparkles className="w-6 h-6 text-white" />
          </Button>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>
      )}

      {/* Ventana del asistente */}
      {isOpen && (
        <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
          isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
        }`}>
          <Card className="campaign-card h-full flex flex-col shadow-modern-xl border-2 border-blue-200">
            {/* Header del asistente */}
            <CardHeader className="gradient-bg-primary text-white p-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-bold text-white">
                      Asistente IA Electoral
                    </CardTitle>
                    {!isMinimized && (
                      <p className="text-xs text-blue-100">
                        Gemini AI • En línea
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="text-white hover:bg-white hover:bg-opacity-20 p-1 h-auto"
                  >
                    {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-white hover:bg-opacity-20 p-1 h-auto"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {!isMinimized && (
              <>
                {/* Conversación */}
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {conversation.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-3 rounded-lg ${
                        msg.role === 'user' 
                          ? 'gradient-bg-primary text-white' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        <div className="flex items-start space-x-2 mb-1">
                          {msg.role === 'assistant' && <Bot className="w-4 h-4 text-blue-600 mt-1" />}
                          <p className="text-sm font-medium">
                            {msg.role === 'user' ? 'Tú' : 'Asistente IA'}
                          </p>
                        </div>
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 p-3 rounded-lg max-w-[80%]">
                        <div className="flex items-center space-x-2">
                          <Bot className="w-4 h-4 text-blue-600" />
                          <p className="text-sm font-medium">Asistente IA</p>
                        </div>
                        <div className="flex space-x-1 mt-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>

                {/* Sugerencias rápidas */}
                {conversation.length <= 1 && (
                  <div className="p-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-2">Preguntas frecuentes:</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map((suggestion, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="cursor-pointer text-xs hover:bg-blue-50 hover:border-blue-300 transition-colors"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          <HelpCircle className="w-3 h-3 mr-1" />
                          {suggestion}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input de mensaje */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Escribe tu pregunta sobre campaña electoral..."
                      disabled={isLoading}
                      className="flex-1 input-modern"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!message.trim() || isLoading}
                      className="btn-modern-primary px-3"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Powered by Gemini AI
                  </p>
                </div>
              </>
            )}
          </Card>
        </div>
      )}
    </>
  );
};

export default GeminiAssistant;
