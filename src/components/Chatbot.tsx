
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "../contexts/AuthContext";
import { 
  MessageSquare, 
  Send, 
  Bot,
  User,
  Loader2,
  Minimize2,
  Maximize2,
  X,
  Crown,
  Building2,
  Users,
  UserCheck,
  Star
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
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('gemini-api-key') || '');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mensajes de bienvenida personalizados por rol
  const getWelcomeMessage = () => {
    const baseMessage = '¡Hola! Soy tu asistente inteligente de MI CAMPAÑA 2025.';
    
    switch (user?.role) {
      case 'desarrollador':
        return `${baseMessage} Como desarrollador, puedo ayudarte con aspectos técnicos del sistema, configuraciones N8N, análisis de datos y optimización del ecosistema de campaña.`;
      case 'master':
        return `${baseMessage} Como Master de Campaña, tengo acceso completo a estadísticas estratégicas, análisis de rendimiento territorial, coordinación de candidatos y métricas de engagement. ¿En qué estrategia te puedo asesorar?`;
      case 'candidato':
        return `${baseMessage} Como candidato, puedo ayudarte con estrategias de comunicación, análisis de tu territorio, coordinación con líderes, preparación de eventos y seguimiento de objetivos de campaña.`;
      case 'lider':
        return `${baseMessage} Como líder territorial, puedo asistirte con gestión de votantes, organización de actividades locales, reportes de progreso y coordinación con tu candidato.`;
      case 'votante':
        return `${baseMessage} Como votante activo, puedo ayudarte con tus tareas de campaña, eventos próximos, formas de participar más activamente y conectarte con tu comunidad.`;
      default:
        return `${baseMessage} Estoy aquí para ayudarte con información sobre nuestras propuestas, transparencia y honestidad. ¿En qué puedo ayudarte?`;
    }
  };

  // Quick replies personalizados por rol
  const getQuickReplies = () => {
    const baseReplies = ["Propuestas de campaña", "Información del candidato"];
    
    switch (user?.role) {
      case 'desarrollador':
        return [...baseReplies, "Estado del sistema", "Configurar N8N", "Analytics técnicos"];
      case 'master':
        return [...baseReplies, "Estrategia general", "Métricas de candidatos", "ROI de campaña", "Análisis territorial"];
      case 'candidato':
        return [...baseReplies, "Mi equipo territorial", "Próximos eventos", "Estrategia local", "Reportes de progreso"];
      case 'lider':
        return [...baseReplies, "Gestionar votantes", "Organizar evento", "Reportar actividades", "Contactar candidato"];
      case 'votante':
        return [...baseReplies, "Mis tareas", "Eventos próximos", "Cómo ayudar más", "Mi progreso"];
      default:
        return [...baseReplies, "Cómo puedo ayudar", "Eventos próximos", "Denuncias y reportes"];
    }
  };

  const getRoleIcon = () => {
    switch (user?.role) {
      case 'desarrollador': return Star;
      case 'master': return Crown;
      case 'candidato': return Building2;
      case 'lider': return Users;
      case 'votante': return UserCheck;
      default: return Bot;
    }
  };

  const getRoleColor = () => {
    switch (user?.role) {
      case 'desarrollador': return 'from-yellow-600 to-yellow-700';
      case 'master': return 'from-purple-600 to-purple-700';
      case 'candidato': return 'from-blue-600 to-blue-700';
      case 'lider': return 'from-green-600 to-green-700';
      case 'votante': return 'from-gray-600 to-gray-700';
      default: return 'from-blue-600 to-blue-700';
    }
  };

  const getRoleTitle = () => {
    switch (user?.role) {
      case 'desarrollador': return 'Asistente Técnico';
      case 'master': return 'Asistente Estratégico Master';
      case 'candidato': return 'Asistente de Candidato';
      case 'lider': return 'Asistente Territorial';
      case 'votante': return 'Asistente Personal';
      default: return 'Asistente MI CAMPAÑA';
    }
  };

  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: '1',
        content: getWelcomeMessage(),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [user?.role]);

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
      const roleContext = {
        desarrollador: "Eres un asistente técnico especializado en sistemas de campaña, N8N, análisis de datos y optimización técnica.",
        master: "Eres un asistente estratégico de alta gerencia, especializado en análisis territorial, coordinación de candidatos, métricas de campaña y ROI político.",
        candidato: "Eres un asistente de candidato, especializado en estrategia local, comunicación política, gestión de equipo territorial y eventos de campaña.",
        lider: "Eres un asistente territorial, especializado en gestión de votantes, organización comunitaria, reportes locales y coordinación con candidatos.",
        votante: "Eres un asistente personal de campaña, especializado en motivar participación, explicar tareas, conectar con la comunidad y gamificación."
      };

      const prompt = `${roleContext[user?.role as keyof typeof roleContext] || roleContext.votante}
      
      Contexto de la campaña:
      - Usuario actual: ${user?.name} (${user?.role})
      - Lema: "MI CAMPAÑA 2025 - Transparencia y Honestidad"
      - Sistema integrado con N8N para automatización
      - Enfoque en datos en tiempo real y métricas estratégicas
      - Ecosistema completo: Master > Candidatos > Líderes > Votantes
      
      Información adicional por rol:
      - Desarrollador: Acceso total al sistema, configuración N8N, análisis técnico
      - Master: Visión estratégica completa, métricas de todos los candidatos, ROI
      - Candidato: Gestión de territorio específico, equipo de líderes, eventos locales
      - Líder: Base de datos de votantes, actividades territoriales, reportes
      - Votante: Tareas personales, eventos próximos, progreso individual
      
      Responde como el asistente especializado para este rol específico.
      Pregunta del usuario: ${userMessage}
      
      Responde máximo en 150 palabras con un enfoque profesional pero motivador:`;

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

  const RoleIcon = getRoleIcon();

  if (isMinimized) {
    return (
      <Card className={`fixed bottom-4 right-4 w-16 h-16 cursor-pointer shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105`} onClick={onToggleMinimize}>
        <CardContent className={`p-0 h-full flex items-center justify-center bg-gradient-to-r ${getRoleColor()} rounded-lg`}>
          <RoleIcon className="w-8 h-8 text-white" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 h-[500px] shadow-2xl border-blue-200 bg-white z-50">
      <CardHeader className={`bg-gradient-to-r ${getRoleColor()} text-white rounded-t-lg p-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <RoleIcon className="w-6 h-6" />
            <div>
              <CardTitle className="text-lg">{getRoleTitle()}</CardTitle>
              <p className="text-xs opacity-90">{user?.name}</p>
            </div>
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
                className={`bg-gradient-to-r ${getRoleColor()}`}
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
                      ? `bg-gradient-to-r ${getRoleColor()} text-white`
                      : 'bg-gray-100 text-gray-800'
                  } shadow-sm`}
                >
                  <div className="flex items-start space-x-2">
                    {message.sender === 'bot' && <RoleIcon className="w-4 h-4 mt-1 text-gray-600" />}
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
                    <RoleIcon className="w-4 h-4 text-gray-600" />
                    <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                    <span className="text-sm text-gray-600">Analizando...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>

        <div className="p-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2 mb-3">
            {getQuickReplies().map((reply, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleQuickReply(reply)}
                className={`text-xs border-blue-300 text-blue-700 hover:bg-gradient-to-r hover:${getRoleColor()} hover:text-white`}
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
              className={`bg-gradient-to-r ${getRoleColor()}`}
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
