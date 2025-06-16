
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Users, 
  TrendingUp, 
  Zap,
  Send,
  Bot,
  Heart,
  Star
} from 'lucide-react';
import { geminiService } from '@/services/geminiService';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface VisitorData {
  nombre?: string;
  telefono?: string;
  email?: string;
  barrio?: string;
  intereses?: string;
  sessionId: string;
}

const AutomatedVisitorWindow = () => {
  const { toast } = useToast();
  const [visitorData, setVisitorData] = useState<VisitorData>({
    sessionId: crypto.randomUUID()
  });
  const [currentStep, setCurrentStep] = useState<'welcome' | 'collecting' | 'engaging' | 'converting'>('welcome');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{
    type: 'bot' | 'user';
    message: string;
    timestamp: Date;
  }>>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversionScore, setConversionScore] = useState(0);

  // Generar mensaje de bienvenida automático al cargar
  useEffect(() => {
    generateWelcomeMessage();
  }, []);

  const generateWelcomeMessage = async () => {
    try {
      const message = await geminiService.generateWelcomeMessage();
      setWelcomeMessage(message);
      setChatHistory([{
        type: 'bot',
        message: message,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Error generating welcome message:', error);
      setWelcomeMessage('¡Bienvenido! Estamos aquí para escucharte y conocer tus ideas para mejorar nuestra comunidad.');
    }
  };

  const handleUserInput = async (field: keyof VisitorData, value: string) => {
    setVisitorData(prev => ({ ...prev, [field]: value }));
    
    // Análisis automático con Gemini cuando se proporciona información
    if (value.length > 10) {
      await analyzeUserSentiment(value);
    }
  };

  const analyzeUserSentiment = async (message: string) => {
    try {
      const analysis = await geminiService.analyzeSentiment(message);
      
      // Actualizar score de conversión basado en sentiment
      const newScore = Math.max(0, Math.min(100, 
        conversionScore + (analysis.score * 20) + (analysis.engagementLevel * 5)
      ));
      setConversionScore(newScore);

      // Registrar interacción en la base de datos
      await supabase.from('electoral_interactions').insert({
        voter_id: null, // Visitante anónimo
        candidate_id: null,
        user_id: null,
        tipo_interaccion: 'web',
        canal: 'plataforma_web',
        mensaje: message,
        sentiment_score: analysis.score,
        sentiment_level: analysis.level,
        efectividad: newScore / 100,
        exitosa: newScore > 60
      });

    } catch (error) {
      console.error('Error analyzing sentiment:', error);
    }
  };

  const sendMessage = async () => {
    if (!userMessage.trim()) return;

    setIsProcessing(true);
    
    // Agregar mensaje del usuario al historial
    const newUserMessage = {
      type: 'user' as const,
      message: userMessage,
      timestamp: new Date()
    };
    setChatHistory(prev => [...prev, newUserMessage]);

    try {
      // Analizar sentiment del mensaje
      await analyzeUserSentiment(userMessage);

      // Generar respuesta automática con Gemini
      const candidateInfo = {
        nombre: 'Nuestro Candidato',
        cargo: 'Alcalde',
        propuestas: {
          educacion: 'Mejorar la calidad educativa',
          salud: 'Ampliar cobertura en salud',
          seguridad: 'Fortalecer la seguridad ciudadana',
          empleo: 'Generar oportunidades de empleo'
        }
      };

      const botResponse = await geminiService.generateAutomatedResponse(userMessage, candidateInfo);
      
      // Agregar respuesta del bot
      const newBotMessage = {
        type: 'bot' as const,
        message: botResponse,
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, newBotMessage]);

      // Avanzar en el flujo según el score de conversión
      if (conversionScore > 70 && currentStep === 'welcome') {
        setCurrentStep('engaging');
      } else if (conversionScore > 85 && currentStep === 'engaging') {
        setCurrentStep('converting');
      }

    } catch (error) {
      console.error('Error processing message:', error);
      toast({
        title: "Error",
        description: "Hubo un problema procesando tu mensaje. Intenta nuevamente.",
        variant: "destructive"
      });
    } finally {
      setUserMessage('');
      setIsProcessing(false);
    }
  };

  const handleConversion = async () => {
    try {
      // Guardar el visitante como votante potencial
      const { data, error } = await supabase.from('electoral_voters').insert({
        nombre: visitorData.nombre || 'Visitante Web',
        apellido: '',
        telefono: visitorData.telefono,
        email: visitorData.email,
        barrio: visitorData.barrio,
        canal_contacto: 'web',
        status: 'contactado',
        probabilidad_voto: conversionScore / 100,
        notas: `Sesión automatizada. Intereses: ${visitorData.intereses}. Score: ${conversionScore}`
      });

      if (error) throw error;

      toast({
        title: "¡Gracias por tu interés!",
        description: "Hemos registrado tu información. Nos pondremos en contacto contigo pronto.",
      });

      setCurrentStep('converting');
    } catch (error) {
      console.error('Error saving visitor:', error);
      toast({
        title: "Error",
        description: "Hubo un problema guardando tu información.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header con métricas en tiempo real */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Bot className="w-6 h-6" />
            Sistema Electoral Automatizado
            <Badge className="bg-green-100 text-green-800">
              <Zap className="w-3 h-3 mr-1" />
              100% IA
            </Badge>
          </CardTitle>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span>Score: {conversionScore}%</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Paso: {currentStep}</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Panel de Chat Automatizado */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Conversación Automatizada
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Historial de chat */}
            <div className="h-64 overflow-y-auto space-y-3 p-3 bg-gray-50 rounded-lg">
              {chatHistory.map((entry, index) => (
                <div key={index} className={`flex ${entry.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs p-3 rounded-lg ${
                    entry.type === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white border border-gray-200'
                  }`}>
                    <p className="text-sm">{entry.message}</p>
                    <span className="text-xs opacity-70">
                      {entry.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Input de mensaje */}
            <div className="flex gap-2">
              <Input
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="Escribe tu mensaje..."
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                disabled={isProcessing}
              />
              <Button 
                onClick={sendMessage} 
                disabled={isProcessing || !userMessage.trim()}
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Panel de Información del Visitante */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              Tu Información
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Tu nombre"
              value={visitorData.nombre || ''}
              onChange={(e) => handleUserInput('nombre', e.target.value)}
            />
            
            <Input
              placeholder="Tu teléfono (opcional)"
              value={visitorData.telefono || ''}
              onChange={(e) => handleUserInput('telefono', e.target.value)}
            />
            
            <Input
              placeholder="Tu email (opcional)"
              type="email"
              value={visitorData.email || ''}
              onChange={(e) => handleUserInput('email', e.target.value)}
            />
            
            <Input
              placeholder="Tu barrio o zona"
              value={visitorData.barrio || ''}
              onChange={(e) => handleUserInput('barrio', e.target.value)}
            />
            
            <Textarea
              placeholder="¿Qué temas te interesan más?"
              value={visitorData.intereses || ''}
              onChange={(e) => handleUserInput('intereses', e.target.value)}
              className="min-h-[80px]"
            />

            {/* Barra de progreso de conversión */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Interés detectado</span>
                <span>{conversionScore}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${conversionScore}%` }}
                />
              </div>
            </div>

            {/* Botón de conversión */}
            {conversionScore > 60 && (
              <Button 
                onClick={handleConversion}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Heart className="w-4 h-4 mr-2" />
                ¡Quiero participar!
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Panel de estadísticas en tiempo real */}
      <Card>
        <CardHeader>
          <CardTitle>Métricas de Engagement en Tiempo Real</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{chatHistory.length}</div>
              <div className="text-sm text-gray-600">Mensajes</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{conversionScore}%</div>
              <div className="text-sm text-gray-600">Conversión</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{currentStep}</div>
              <div className="text-sm text-gray-600">Etapa</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {Object.keys(visitorData).filter(key => key !== 'sessionId' && visitorData[key as keyof VisitorData]).length}
              </div>
              <div className="text-sm text-gray-600">Datos</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutomatedVisitorWindow;
