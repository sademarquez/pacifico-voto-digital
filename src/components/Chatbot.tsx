
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
      content: '¡Hola! Soy tu asistente de campaña. Estoy aquí para mantener nuestro compromiso fuerte y responder tus dudas sobre nuestra propuesta política. ¿En qué puedo ayudarte?',
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
      return "Para usar el chatbot necesitas configurar tu API key de Google Gemini. Es gratuita y puedes obtenerla en https://makersuite.google.com/app/apikey";
    }

    try {
      const prompt = `Eres un asistente de campaña política comprometido con la transparencia y honestidad. 
      Tu candidato es "Candidato" con el lema "Wramba Fxiw 2024 - Transparencia y Honestidad".
      
      Contexto de la campaña:
      - Enfoque en transparencia y lucha contra la corrupción
      - Trabajo territorial con líderes comunitarios
      - Registro y seguimiento de votantes
      - Sistema de alertas y reportes ciudadanos
      - Red de ayudantes territoriales
      
      Responde de manera motivadora, política y comprometida. Mantén un tono profesional pero cercano.
      Si te preguntan sobre propuestas específicas, menciona temas como educación, salud, infraestructura, empleo y transparencia.
      
      Pregunta del usuario: ${userMessage}
      
      Responde máximo en 150 palabras:`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
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
        throw new Error('Error en la API de Gemini');
      }

      const data = await response.json();
      return data.candidates[0]?.content?.parts[0]?.text || "Disculpa, no pude procesar tu mensaje. ¿Puedes intentar de nuevo?";
    } catch (error) {
      console.error('Error calling Gemini API:', error);
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
        <CardContent className="p-0 h-full flex items-center justify-center bg-gradient-to-r from-slate-600 to-stone-600 rounded-lg">
          <MessageSquare className="w-8 h-8 text-white" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 h-[500px] shadow-2xl border-slate-200 bg-white z-50">
      <CardHeader className="bg-gradient-to-r from-slate-600 to-stone-600 text-white rounded-t-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="w-6 h-6" />
            <CardTitle className="text-lg">Asistente de Campaña</CardTitle>
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
          Transparencia y Honestidad
        </Badge>
      </CardHeader>

      <CardContent className="p-0 flex flex-col h-[400px]">
        {!apiKey && (
          <div className="p-4 bg-amber-50 border-b border-amber-200">
            <p className="text-sm text-amber-800 mb-2">
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
                className="bg-slate-600 hover:bg-slate-700"
              >
                Guardar
              </Button>
            </div>
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
                      ? 'bg-slate-600 text-white'
                      : 'bg-gray-100 text-slate-800'
                  } shadow-sm`}
                >
                  <div className="flex items-start space-x-2">
                    {message.sender === 'bot' && <Bot className="w-4 h-4 mt-1 text-slate-600" />}
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
                    <Bot className="w-4 h-4 text-slate-600" />
                    <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
                    <span className="text-sm text-slate-600">Escribiendo...</span>
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
                className="text-xs border-slate-300 text-slate-700 hover:bg-slate-100"
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
              className="bg-slate-600 hover:bg-slate-700"
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
