
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageSquare, 
  Send, 
  Bot,
  User,
  Loader2,
  Minimize2,
  Maximize2,
  X
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'quick-reply';
}

interface ChatbotProps {
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
  onClose?: () => void;
}

const Chatbot = ({ isMinimized = false, onToggleMinimize, onClose }: ChatbotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '¡Hola! Soy tu asistente de campaña de MI CAMPAÑA 2025. Estoy aquí para ayudarte con información sobre nuestras propuestas, transparencia y honestidad. ¿En qué puedo ayudarte?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('gemini-api-key') || '');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickReplies = [
    "Propuestas de campaña",
    "Cómo puedo ayudar",
    "Eventos próximos",
    "Información del candidato",
    "Denuncias y reportes"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const saveApiKey = (key: string) => {
    localStorage.setItem('gemini-api-key', key);
    setApiKey(key);
  };

  const generateBotResponse = async (userMessage: string): Promise<string> => {
    if (!apiKey) {
      return "Para usar el chatbot necesitas configurar tu API key de Google Gemini. Es gratuita y puedes obtenerla en https://aistudio.google.com/app/apikey";
    }

    try {
      const prompt = `Eres un asistente de campaña política de "MI CAMPAÑA 2025" comprometido con la transparencia y honestidad.
      
      Contexto de la campaña:
      - Lema: "MI CAMPAÑA 2025 - Transparencia y Honestidad"
      - Enfoque en transparencia y lucha contra la corrupción
      - Trabajo territorial con líderes comunitarios
      - Registro y seguimiento de votantes
      - Sistema de alertas y reportes ciudadanos
      - Red de ayudantes territoriales
      
      Responde de manera motivadora, política y comprometida. Mantén un tono profesional pero cercano.
      Si te preguntan sobre propuestas específicas, menciona temas como educación, salud, infraestructura, empleo y transparencia.
      
      Pregunta del usuario: ${userMessage}
      
      Responde máximo en 150 palabras:`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Gemini API Error:', errorData);
        
        if (response.status === 400) {
          return "Tu API key parece ser inválida. Por favor verifica que esté correcta en https://aistudio.google.com/app/apikey";
        }
        
        throw new Error(`Error ${response.status}: ${errorData.error?.message || 'Error desconocido'}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      } else {
        console.error('Respuesta inesperada de Gemini:', data);
        return "Disculpa, no pude procesar tu mensaje. ¿Puedes intentar de nuevo?";
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      if (error instanceof Error) {
        return `Error técnico: ${error.message}. Verifica tu conexión y API key.`;
      }
      return "Hubo un problema técnico. Por favor intenta más tarde o verifica tu conexión.";
    }
  };

  const handleSendMessage = async (message: string = inputMessage) => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const botResponse = await generateBotResponse(message);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Hubo un error al generar la respuesta. Por favor intenta de nuevo.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply);
  };

  if (isMinimized) {
    return (
      <Card className="fixed bottom-4 right-4 w-16 h-16 cursor-pointer shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105" onClick={onToggleMinimize}>
        <CardContent className="p-0 h-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg">
          <MessageSquare className="w-8 h-8 text-white" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 h-[500px] shadow-2xl border-blue-200 bg-white z-50">
      <CardHeader className="bg-gradient-to-r from-blue-700 to-blue-800 text-white rounded-t-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="w-6 h-6" />
            <CardTitle className="text-lg">Asistente MI CAMPAÑA</CardTitle>
          </div>
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onToggleMinimize}
              className="text-white hover:bg-white/20 p-1 h-8 w-8"
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="text-white hover:bg-white/20 p-1 h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <Badge className="bg-white/20 text-white w-fit">
          Transparencia y Honestidad 2025
        </Badge>
      </CardHeader>

      <CardContent className="p-0 flex flex-col h-[400px]">
        {!apiKey && (
          <div className="p-4 bg-blue-50 border-b border-blue-200">
            <p className="text-sm text-blue-800 mb-2">
              Configura tu API Key de Google Gemini (gratuita):
            </p>
            <div className="flex space-x-2">
              <Input
                placeholder="Ingresa tu API Key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="text-xs"
              />
              <Button
                size="sm"
                onClick={() => saveApiKey(apiKey)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Guardar
              </Button>
            </div>
            <p className="text-xs text-blue-600 mt-1">
              Obtén tu API key en: https://aistudio.google.com/app/apikey
            </p>
          </div>
        )}

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-blue-800'
                  } shadow-sm`}
                >
                  <div className="flex items-start space-x-2">
                    {message.sender === 'bot' && <Bot className="w-4 h-4 mt-1 text-blue-600" />}
                    {message.sender === 'user' && <User className="w-4 h-4 mt-1 text-white" />}
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <span className="text-xs opacity-70 block mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg shadow-sm">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-4 h-4 text-blue-600" />
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    <span className="text-sm text-blue-600">Escribiendo...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>

        <div className="p-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2 mb-3">
            {quickReplies.map((reply, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleQuickReply(reply)}
                className="text-xs border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                {reply}
              </Button>
            ))}
          </div>
          
          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Escribe tu mensaje..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isLoading}
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputMessage.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Chatbot;
