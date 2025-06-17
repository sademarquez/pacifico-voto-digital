import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Bot, Settings, Zap, TrendingUp, Users, Target } from 'lucide-react';
import { geminiService } from '../services/geminiService';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

const SellerChatIntegration = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    // Simular mensaje de bienvenida del bot
    const initialBotMessage = {
      id: 'bot-welcome',
      text: '¡Hola! ¿En qué puedo ayudarte hoy?',
      sender: 'bot' as const,
    };
    setMessages([initialBotMessage]);
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    // Agregar mensaje del usuario
    const userMessage = {
      id: `user-${Date.now()}`,
      text: newMessage,
      sender: 'user' as const,
    };
    setMessages([...messages, userMessage]);

    // Simular respuesta del bot (aquí se integraría con Gemini)
    setTimeout(() => {
      const botResponse = {
        id: `bot-${Date.now()}`,
        text: 'Gracias por tu mensaje. Estoy procesando tu solicitud...',
        sender: 'bot' as const,
      };
      setMessages([...messages, botResponse]);
    }, 1500);

    setNewMessage('');
  };

  const testConnection = async () => {
    try {
      const result = await geminiService.testConnection();
      console.log('Connection test:', result);
    } catch (error) {
      console.error('Error testing connection:', error);
    }
  };

  const getModelInfo = async () => {
    try {
      const info = await geminiService.getModelInfo();
      console.log('Model info:', info);
    } catch (error) {
      console.error('Error getting model info:', error);
    }
  };

  const generateAutomatedResponse = async (context: any) => {
    try {
      const response = await geminiService.generateAutomatedResponse(context);
      console.log('Automated response:', response);
    } catch (error) {
      console.error('Error generating automated response:', error);
    }
  };

  const analyzeSentiment = async (text: string) => {
    try {
      const sentiment = await geminiService.analyzeSentiment(text);
      console.log('Sentiment analysis:', sentiment);
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-600" />
          Chat IA - MI CAMPAÑA 2025
        </CardTitle>
        <Button variant="outline" size="icon" onClick={() => setIsSettingsOpen(!isSettingsOpen)}>
          <Settings className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto">
        {/* Área de mensajes */}
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`px-4 py-2 rounded-lg shadow-md ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'
                  }`}
              >
                {message.text}
              </div>
              <span className="text-xs text-gray-500 mt-1">
                {message.sender === 'user' ? 'Tú' : 'Asistente IA'}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
      <div className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Escribe tu mensaje..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          <Button onClick={handleSendMessage}>Enviar</Button>
        </div>
      </div>

      {/* Panel de configuración (oculto por defecto) */}
      {isSettingsOpen && (
        <div className="p-4 bg-gray-50 border-t">
          <h4 className="text-lg font-semibold mb-2">Configuración del Chat IA</h4>
          <Button variant="outline" onClick={testConnection} className="w-full mb-2">
            Probar Conexión
          </Button>
          <Button variant="outline" onClick={getModelInfo} className="w-full mb-2">
            Obtener Info del Modelo
          </Button>
          <Button
            variant="outline"
            onClick={() => generateAutomatedResponse({ userMessage: 'test' })}
            className="w-full mb-2"
          >
            Generar Respuesta Automática
          </Button>
          <Button variant="outline" onClick={() => analyzeSentiment('Este mensaje es genial')} className="w-full">
            Analizar Sentimiento
          </Button>
        </div>
      )}
    </Card>
  );
};

export default SellerChatIntegration;
