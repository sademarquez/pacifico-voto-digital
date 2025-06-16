
import React, { useState, useEffect } from 'react';
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
  WhatsappIcon as Phone2,
  Send,
  Sparkles
} from 'lucide-react';
import { geminiService } from '@/services/geminiService';

interface SellerChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot' | 'gemini';
  timestamp: Date;
  whatsapp_number?: string;
  voter_profile?: any;
}

interface VoterProfile {
  nombre?: string;
  telefono?: string;
  ubicacion?: string;
  interes_politico?: string;
  engagement_level?: number;
}

const SellerChatIntegration = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<SellerChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [activeConversations, setActiveConversations] = useState(0);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Simular conexión SellerChat
  useEffect(() => {
    const connectToSellerChat = () => {
      console.log('🤖 Conectando a SellerChat...');
      setTimeout(() => {
        setIsConnected(true);
        setActiveConversations(Math.floor(Math.random() * 25) + 5);
        toast({
          title: "SellerChat Conectado",
          description: "Sistema de chatbots activo y funcionando",
        });
      }, 2000);
    };

    connectToSellerChat();
  }, []);

  // Procesar mensaje con Gemini + SellerChat
  const processMessageWithAI = async (userMessage: string, voterProfile?: VoterProfile) => {
    setIsProcessing(true);
    try {
      // 1. Analizar con Gemini
      const geminiResponse = await geminiService.generateWelcomeMessage(voterProfile || {
        nombre: 'Ciudadano',
        ubicacion: 'Bogotá',
        interes_politico: 'medio'
      });

      // 2. Simular respuesta SellerChat
      const sellerChatResponse = {
        id: `sc_${Date.now()}`,
        content: geminiResponse,
        sender: 'bot' as const,
        timestamp: new Date()
      };

      // 3. Agregar a conversación
      setMessages(prev => [...prev, {
        id: `user_${Date.now()}`,
        content: userMessage,
        sender: 'user',
        timestamp: new Date(),
        whatsapp_number: whatsappNumber
      }, sellerChatResponse]);

      // 4. Simular envío por WhatsApp
      if (whatsappNumber) {
        await sendWhatsAppMessage(whatsappNumber, geminiResponse);
      }

      return geminiResponse;
    } catch (error) {
      console.error('Error procesando mensaje:', error);
      toast({
        title: "Error",
        description: "No se pudo procesar el mensaje con IA",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Simular envío WhatsApp Business API
  const sendWhatsAppMessage = async (phoneNumber: string, message: string) => {
    console.log('📱 Enviando WhatsApp a:', phoneNumber);
    console.log('💬 Mensaje:', message);
    
    // Aquí iría la integración real con WhatsApp Business API
    // Por ahora simulamos el envío
    toast({
      title: "WhatsApp Enviado",
      description: `Mensaje enviado a ${phoneNumber}`,
    });
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

  return (
    <div className="space-y-6">
      {/* Header de Estado */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                isConnected ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                <MessageSquare className={`w-6 h-6 ${
                  isConnected ? 'text-green-600' : 'text-gray-400'
                }`} />
              </div>
              <div>
                <h3 className="text-xl font-bold">SellerChat + WhatsApp + Gemini IA</h3>
                <p className="text-sm text-gray-600">
                  Ecosistema de chatbots inteligentes para campañas políticas
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={isConnected ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                {isConnected ? '🟢 Conectado' : '⚫ Desconectado'}
              </Badge>
              <Badge className="bg-blue-100 text-blue-800">
                <Users className="w-3 h-3 mr-1" />
                {activeConversations} activas
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Panel de Chat */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                Chat Inteligente (Gemini + SellerChat)
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {/* Área de Mensajes */}
              <div className="flex-1 overflow-y-auto space-y-3 mb-4 p-4 bg-gray-50 rounded-lg">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Inicia una conversación con el chatbot inteligente</p>
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
                            : 'bg-white border shadow-sm'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p className={`text-xs mt-1 ${
                          msg.sender === 'user' ? 'text-blue-200' : 'text-gray-500'
                        }`}>
                          {msg.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                {isProcessing && (
                  <div className="flex justify-start">
                    <div className="bg-white border shadow-sm p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 animate-spin text-blue-600" />
                        <span className="text-sm text-gray-600">Gemini está pensando...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input de WhatsApp */}
              <div className="mb-3">
                <Input
                  placeholder="Número WhatsApp (ej: +57 300 123 4567)"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="text-sm"
                />
              </div>

              {/* Input de Mensaje */}
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

        {/* Panel de Control */}
        <div className="space-y-6">
          {/* Respuestas Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Respuestas Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start text-sm h-auto p-3"
                onClick={() => handleQuickResponse('welcome')}
              >
                👋 Mensaje de Bienvenida
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-sm h-auto p-3"
                onClick={() => handleQuickResponse('info')}
              >
                📅 Información de Eventos
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-sm h-auto p-3"
                onClick={() => handleQuickResponse('volunteer')}
              >
                🤝 Ser Voluntario
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-sm h-auto p-3"
                onClick={() => handleQuickResponse('meeting')}
              >
                📞 Agendar Reunión
              </Button>
            </CardContent>
          </Card>

          {/* Métricas en Tiempo Real */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Métricas en Vivo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Conversaciones Activas</span>
                <Badge className="bg-green-100 text-green-800">{activeConversations}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Respuestas por IA</span>
                <Badge className="bg-blue-100 text-blue-800">98%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tiempo Respuesta</span>
                <Badge className="bg-purple-100 text-purple-800">2.3s</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Satisfacción</span>
                <Badge className="bg-yellow-100 text-yellow-800">94%</Badge>
              </div>
            </CardContent>
          </Card>

          {/* WhatsApp Business */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Phone2 className="w-4 h-4 text-green-600" />
                WhatsApp Business
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  Estado: <span className="text-green-600 font-medium">✅ Conectado</span>
                </div>
                <div className="text-sm text-gray-600">
                  Mensajes Enviados Hoy: <span className="font-medium">247</span>
                </div>
                <div className="text-sm text-gray-600">
                  Tasa de Entrega: <span className="text-green-600 font-medium">99.2%</span>
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
