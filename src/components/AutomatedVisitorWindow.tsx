import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Bot, User, Zap, TrendingUp, Target } from 'lucide-react';
import { geminiService } from '../services/geminiService';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

const AutomatedVisitorWindow = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      generateWelcomeMessage();
    }
  }, [isOpen, messages.length]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
    };
    setMessages([...messages, userMessage]);
    setNewMessage('');

    await analyzeSentiment(newMessage);
    const automatedResponse = await geminiService.generateAutomatedResponse({ userMessage: newMessage });
    const botMessage: ChatMessage = {
      id: Date.now().toString() + '-bot',
      text: automatedResponse,
      sender: 'bot',
    };
    setMessages([...messages, botMessage]);
  };

  const analyzeSentiment = async (text: string) => {
    try {
      const sentiment = await geminiService.analyzeSentiment(text);
      // Handle sentiment analysis result
      console.log('Sentiment analysis:', sentiment);
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
    }
  };

  const generateWelcomeMessage = async () => {
    try {
      const welcomeMsg = await geminiService.generateWelcomeMessage();
      // Handle welcome message
      console.log('Welcome message:', welcomeMsg);
      const botMessage: ChatMessage = {
        id: Date.now().toString() + '-welcome',
        text: welcomeMsg,
        sender: 'bot',
      };
      setMessages([...messages, botMessage]);
    } catch (error) {
      console.error('Error generating welcome message:', error);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg z-50"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>

      {isOpen && (
        <Card className="fixed bottom-6 right-24 w-96 h-96 shadow-lg z-50">
          <CardHeader className="p-3 bg-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                <CardTitle className="text-sm">Asistente IA</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-blue-500"
              >
                Cerrar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-3 flex flex-col h-full">
            <div className="flex-1 overflow-y-auto mb-3 space-y-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-2 rounded-lg text-sm ${
                      message.sender === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Escribe tu mensaje..."
                className="flex-1 px-3 py-2 border rounded-lg"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
              />
              <Button
                onClick={handleSendMessage}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Enviar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default AutomatedVisitorWindow;
