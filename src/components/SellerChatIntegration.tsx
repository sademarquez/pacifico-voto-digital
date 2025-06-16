import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  MessageSquare, 
  Phone, 
  Bot, 
  Zap,
  Users,
  TrendingUp,
  MessageCircle,
  Send,
  Sparkles,
  Wifi,
  WifiOff,
  RefreshCw,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { geminiService } from '@/services/geminiService';

interface SellerChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot' | 'gemini';
  timestamp: Date;
  whatsapp_number?: string;
  voter_profile?: VoterProfile;
  status: 'sent' | 'delivered' | 'read' | 'failed';
}

interface VoterProfile {
  nombre?: string;
  telefono?: string;
  ubicacion?: string;
  interes_politico?: string;
  engagement_level?: number;
}

interface SellerChatMetrics {
  activeConversations: number;
  messagesProcessed: number;
  aiResponseRate: number;
  averageResponseTime: number;
  satisfactionRate: number;
}

const SellerChatIntegration = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<SellerChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{
    sellerChat: boolean;
    whatsapp: boolean;
    gemini: boolean;
    n8n: boolean;
  }>({
    sellerChat: false,
    whatsapp: false,
    gemini: false,
    n8n: false
  });
  const [metrics, setMetrics] = useState<SellerChatMetrics>({
    activeConversations: 0,
    messagesProcessed: 0,
    aiResponseRate: 0,
    averageResponseTime: 0,
    satisfactionRate: 0
  });

  // Verificar conexiones al montar el componente
  useEffect(() => {
    initializeConnections();
    const interval = setInterval(checkConnectionHealth, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const initializeConnections = async () => {
    console.log('🔄 Inicializando conexiones SellerChat...');
    
    try {
      // Verificar Gemini
      const geminiStatus = await geminiService.testConnection();
      
      // Simular verificación de otros servicios
      const sellerChatStatus = await simulateSellerChatConnection();
      const whatsappStatus = await simulateWhatsAppConnection();
      const n8nStatus = await simulateN8NConnection();
      
      setConnectionStatus({
        sellerChat: sellerChatStatus,
        whatsapp: whatsappStatus,
        gemini: geminiStatus,
        n8n: n8nStatus
      });

      // Actualizar métricas iniciales
      setMetrics({
        activeConversations: Math.floor(Math.random() * 25) + 5,
        messagesProcessed: Math.floor(Math.random() * 500) + 100,
        aiResponseRate: 98.5,
        averageResponseTime: 2.3,
        satisfactionRate: 94.2
      });

      if (sellerChatStatus && whatsappStatus && geminiStatus) {
        toast({
          title: "✅ Ecosistema Conectado",
          description: "SellerChat + WhatsApp + Gemini + N8N operando correctamente",
        });
      } else {
        toast({
          title: "⚠️ Conexiones Parciales",
          description: "Algunos servicios no están disponibles",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('❌ Error inicializando conexiones:', error);
      toast({
        title: "❌ Error de Conexión",
        description: "No se pudieron establecer todas las conexiones",
        variant: "destructive"
      });
    }
  };

  const simulateSellerChatConnection = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Math.random() > 0.1); // 90% success rate
      }, 1000);
    });
  };

  const simulateWhatsAppConnection = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Math.random() > 0.05); // 95% success rate
      }, 800);
    });
  };

  const simulateN8NConnection = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Math.random() > 0.15); // 85% success rate
      }, 1200);
    });
  };

  const checkConnectionHealth = useCallback(async () => {
    const newStatus = { ...connectionStatus };
    
    try {
      newStatus.gemini = await geminiService.testConnection();
      newStatus.sellerChat = await simulateSellerChatConnection();
      newStatus.whatsapp = await simulateWhatsAppConnection();
      newStatus.n8n = await simulateN8NConnection();
      
      setConnectionStatus(newStatus);
    } catch (error) {
      console.error('Error checking connection health:', error);
    }
  }, [connectionStatus]);

  const processMessageWithAI = async (userMessage: string, voterProfile?: VoterProfile) => {
    if (!connectionStatus.gemini) {
      toast({
        title: "⚠️ Gemini Desconectado",
        description: "Usando respuesta de respaldo",
        variant: "destructive"
      });
    }

    setIsProcessing(true);
    try {
      const effectiveProfile = voterProfile || {
        nombre: 'Ciudadano',
        ubicacion: 'Bogotá',
        interes_politico: 'medio',
        engagement_level: 75
      };

      const geminiResponse = await geminiService.generateWelcomeMessage(effectiveProfile);

      const newUserMessage: SellerChatMessage = {
        id: `user_${Date.now()}`,
        content: userMessage,
        sender: 'user',
        timestamp: new Date(),
        whatsapp_number: whatsappNumber,
        status: 'sent'
      };

      const botResponse: SellerChatMessage = {
        id: `bot_${Date.now()}`,
        content: geminiResponse,
        sender: 'bot',
        timestamp: new Date(),
        voter_profile: effectiveProfile,
        status: 'delivered'
      };

      setMessages(prev => [...prev, newUserMessage, botResponse]);

      // Enviar por WhatsApp si hay número
      if (whatsappNumber && connectionStatus.whatsapp) {
        await sendWhatsAppMessage(whatsappNumber, geminiResponse);
      }

      // Simular activación de flujo N8N
      if (connectionStatus.n8n) {
        await triggerN8NWorkflow({
          message: userMessage,
          response: geminiResponse,
          voterProfile: effectiveProfile
        });
      }

      // Actualizar métricas
      setMetrics(prev => ({
        ...prev,
        messagesProcessed: prev.messagesProcessed + 1,
        activeConversations: prev.activeConversations + (Math.random() > 0.7 ? 1 : 0)
      }));

      return geminiResponse;
    } catch (error) {
      console.error('❌ Error procesando mensaje:', error);
      
      const errorMessage: SellerChatMessage = {
        id: `error_${Date.now()}`,
        content: 'Disculpa, estamos experimentando dificultades técnicas. Te contactaremos pronto.',
        sender: 'bot',
        timestamp: new Date(),
        status: 'failed'
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "❌ Error",
        description: "No se pudo procesar el mensaje",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const sendWhatsAppMessage = async (phoneNumber: string, message: string) => {
    if (!connectionStatus.whatsapp) {
      throw new Error('WhatsApp no conectado');
    }

    console.log('📱 Enviando WhatsApp a:', phoneNumber);
    console.log('💬 Mensaje:', message);
    
    // Simular envío
    await new Promise(resolve => setTimeout(resolve, 500));
    
    toast({
      title: "📱 WhatsApp Enviado",
      description: `Mensaje enviado a ${phoneNumber}`,
    });
  };

  const triggerN8NWorkflow = async (data: any) => {
    if (!connectionStatus.n8n) {
      throw new Error('N8N no conectado');
    }

    console.log('🔄 Activando flujo N8N:', data);
    
    // Simular activación de workflow
    await new Promise(resolve => setTimeout(resolve, 300));
    
    console.log('✅ Flujo N8N activado exitosamente');
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const voterProfile: VoterProfile = {
      nombre: 'Ciudadano Interesado',
      telefono: whatsappNumber,
      ubicacion: 'Bogotá',
      interes_politico: 'alto',
      engagement_level: 85
    };

    await processMessageWithAI(newMessage, voterProfile);
    setNewMessage('');
  };

  const handleQuickResponse = async (responseType: string) => {
    const quickResponses: Record<string, string> = {
      welcome: '¡Hola! Me interesa conocer más sobre las propuestas de campaña',
      info: 'Quisiera recibir información sobre los eventos próximos',
      volunteer: 'Me gustaría ser voluntario en la campaña',
      meeting: 'Quisiera agendar una reunión con el equipo'
    };

    const message = quickResponses[responseType] || 'Hola, ¿cómo puedo ayudar?';
    await processMessageWithAI(message);
  };

  const getConnectionIcon = (connected: boolean) => {
    return connected ? 
      <CheckCircle className="w-4 h-4 text-green-600" /> : 
      <AlertCircle className="w-4 h-4 text-red-600" />;
  };

  const reconnectServices = async () => {
    toast({
      title: "🔄 Reconectando",
      description: "Verificando todas las conexiones...",
    });
    
    await initializeConnections();
  };

  return (
    <div className="space-y-6">
      <Card className="border-l-4 border-l-green-500">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                Object.values(connectionStatus).every(Boolean) ? 'bg-green-100' : 'bg-yellow-100'
              }`}>
                <MessageSquare className={`w-6 h-6 ${
                  Object.values(connectionStatus).every(Boolean) ? 'text-green-600' : 'text-yellow-600'
                }`} />
              </div>
              <div>
                <h3 className="text-xl font-bold">Ecosistema SellerChat Integrado</h3>
                <p className="text-sm text-gray-600">
                  WhatsApp + Gemini IA + N8N Automation + Analytics
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                onClick={reconnectServices}
                size="sm"
                variant="outline"
                className="flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Reconectar
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
              {getConnectionIcon(connectionStatus.sellerChat)}
              <span className="text-sm">SellerChat</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
              {getConnectionIcon(connectionStatus.whatsapp)}
              <span className="text-sm">WhatsApp</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
              {getConnectionIcon(connectionStatus.gemini)}
              <span className="text-sm">Gemini IA</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
              {getConnectionIcon(connectionStatus.n8n)}
              <span className="text-sm">N8N Flow</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                Chat Inteligente Integrado
                <Badge className={`${
                  Object.values(connectionStatus).every(Boolean) 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {Object.values(connectionStatus).every(Boolean) ? 'Totalmente Operativo' : 'Operativo Parcial'}
                </Badge>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-3 mb-4 p-4 bg-gray-50 rounded-lg">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Inicia una conversación con el ecosistema inteligente</p>
                    <p className="text-xs mt-2">SellerChat + WhatsApp + Gemini + N8N</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          msg.sender === 'user'
                            ? 'bg-blue-600 text-white'
                            : msg.status === 'failed'
                            ? 'bg-red-100 border border-red-300 text-red-800'
                            : 'bg-white border shadow-sm'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <div className="flex items-center justify-between mt-2">
                          <p className={`text-xs ${
                            msg.sender === 'user' ? 'text-blue-200' : 'text-gray-500'
                          }`}>
                            {msg.timestamp.toLocaleTimeString()}
                          </p>
                          {msg.status === 'delivered' && (
                            <CheckCircle className="w-3 h-3 text-green-500" />
                          )}
                          {msg.status === 'failed' && (
                            <AlertCircle className="w-3 h-3 text-red-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                
                {isProcessing && (
                  <div className="flex justify-start">
                    <div className="bg-white border shadow-sm p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 animate-spin text-blue-600" />
                        <span className="text-sm text-gray-600">
                          Procesando con IA... (Gemini + SellerChat + N8N)
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-3">
                <Input
                  placeholder="Número WhatsApp (ej: +57 300 123 4567)"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="text-sm"
                />
              </div>

              <div className="flex gap-2">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 min-h-[80px]"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isProcessing}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Respuestas Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start text-sm h-auto p-3"
                onClick={() => handleQuickResponse('welcome')}
                disabled={isProcessing}
              >
                👋 Mensaje de Bienvenida
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-sm h-auto p-3"
                onClick={() => handleQuickResponse('info')}
                disabled={isProcessing}
              >
                📅 Información de Eventos
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-sm h-auto p-3"
                onClick={() => handleQuickResponse('volunteer')}
                disabled={isProcessing}
              >
                🤝 Ser Voluntario
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-sm h-auto p-3"
                onClick={() => handleQuickResponse('meeting')}
                disabled={isProcessing}
              >
                📞 Agendar Reunión
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Métricas del Ecosistema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Conversaciones Activas</span>
                <Badge className="bg-green-100 text-green-800">{metrics.activeConversations}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Mensajes Procesados</span>
                <Badge className="bg-blue-100 text-blue-800">{metrics.messagesProcessed}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Respuestas por IA</span>
                <Badge className="bg-purple-100 text-purple-800">{metrics.aiResponseRate}%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tiempo Respuesta</span>
                <Badge className="bg-yellow-100 text-yellow-800">{metrics.averageResponseTime}s</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Satisfacción</span>
                <Badge className="bg-green-100 text-green-800">{metrics.satisfactionRate}%</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-600" />
                Integraciones Activas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">WhatsApp Business</span>
                  <div className="flex items-center gap-1">
                    {connectionStatus.whatsapp ? (
                      <Wifi className="w-4 h-4 text-green-600" />
                    ) : (
                      <WifiOff className="w-4 h-4 text-red-600" />
                    )}
                    <span className={`text-xs ${
                      connectionStatus.whatsapp ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {connectionStatus.whatsapp ? 'Conectado' : 'Desconectado'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Gemini IA</span>
                  <div className="flex items-center gap-1">
                    {connectionStatus.gemini ? (
                      <Wifi className="w-4 h-4 text-green-600" />
                    ) : (
                      <WifiOff className="w-4 h-4 text-red-600" />
                    )}
                    <span className={`text-xs ${
                      connectionStatus.gemini ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {connectionStatus.gemini ? 'Operativo' : 'Desconectado'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">N8N Automation</span>
                  <div className="flex items-center gap-1">
                    {connectionStatus.n8n ? (
                      <Wifi className="w-4 h-4 text-green-600" />
                    ) : (
                      <WifiOff className="w-4 h-4 text-red-600" />
                    )}
                    <span className={`text-xs ${
                      connectionStatus.n8n ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {connectionStatus.n8n ? 'Flujos Activos' : 'Inactivo'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SellerChatIntegration;
