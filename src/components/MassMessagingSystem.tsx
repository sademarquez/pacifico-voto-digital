
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  MessageSquare, 
  Send, 
  Users, 
  Target, 
  Calendar,
  Zap,
  BarChart3,
  CheckCircle,
  Clock
} from "lucide-react";

interface Territory {
  id: string;
  name: string;
  type: string;
}

interface MassMessage {
  id: string;
  subject: string;
  content: string;
  category: string;
  priority: string;
  status: string;
  territory_id: string | null;
  scheduled_for: string | null;
  sent_at: string | null;
  created_at: string;
}

const MassMessagingSystem = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [newMessage, setNewMessage] = useState({
    subject: '',
    content: '',
    category: 'general',
    priority: 'medium',
    territory_id: '',
    scheduled_for: ''
  });

  // Query territorios
  const { data: territories = [] } = useQuery({
    queryKey: ['territories'],
    queryFn: async (): Promise<Territory[]> => {
      const { data, error } = await supabase
        .from('territories')
        .select('id, name, type')
        .order('name');
      
      if (error) throw error;
      return data || [];
    }
  });

  // Query mensajes masivos
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['mass-messages'],
    queryFn: async (): Promise<MassMessage[]> => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Mutación para crear mensaje masivo
  const createMessageMutation = useMutation({
    mutationFn: async (messageData: typeof newMessage) => {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          subject: messageData.subject,
          content: messageData.content,
          category: messageData.category,
          priority: messageData.priority,
          territory_id: messageData.territory_id || null,
          scheduled_for: messageData.scheduled_for || null,
          sender_id: user?.id,
          status: messageData.scheduled_for ? 'scheduled' : 'draft'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Mensaje Creado",
        description: "El mensaje masivo ha sido programado exitosamente.",
      });
      queryClient.invalidateQueries({ queryKey: ['mass-messages'] });
      setNewMessage({
        subject: '',
        content: '',
        category: 'general',
        priority: 'medium',
        territory_id: '',
        scheduled_for: ''
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear el mensaje.",
        variant: "destructive",
      });
    }
  });

  // Mutación para enviar mensaje inmediatamente
  const sendMessageMutation = useMutation({
    mutationFn: async (messageId: string) => {
      // Simular envío a través de N8N webhook
      const n8nWebhook = 'https://your-n8n-instance.com/webhook/mass-messaging';
      
      await fetch(n8nWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message_id: messageId,
          action: 'send_now',
          sender: user?.id,
          timestamp: new Date().toISOString()
        })
      });

      // Actualizar estado en base de datos
      const { data, error } = await supabase
        .from('messages')
        .update({ 
          status: 'sent',
          sent_at: new Date().toISOString()
        })
        .eq('id', messageId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Mensaje Enviado",
        description: "El mensaje masivo ha sido enviado exitosamente.",
      });
      queryClient.invalidateQueries({ queryKey: ['mass-messages'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo enviar el mensaje.",
        variant: "destructive",
      });
    }
  });

  const handleCreateMessage = () => {
    if (!newMessage.subject || !newMessage.content) {
      toast({
        title: "Error",
        description: "Por favor completa el asunto y contenido del mensaje",
        variant: "destructive"
      });
      return;
    }
    createMessageMutation.mutate(newMessage);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-l-4 border-l-purple-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Sistema de Mensajería Masiva</h2>
              <p className="text-slate-600">Comunicación estratégica y automatizada</p>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Formulario de Nuevo Mensaje */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            Crear Mensaje Masivo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Asunto *</Label>
              <Input
                id="subject"
                value={newMessage.subject}
                onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
                placeholder="Asunto del mensaje masivo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Select value={newMessage.category} onValueChange={(value) => setNewMessage({...newMessage, category: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="campaign">Campaña</SelectItem>
                  <SelectItem value="event">Evento</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                  <SelectItem value="survey">Encuesta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Prioridad</Label>
              <Select value={newMessage.priority} onValueChange={(value) => setNewMessage({...newMessage, priority: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baja</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="territory">Territorio (Opcional)</Label>
              <Select value={newMessage.territory_id} onValueChange={(value) => setNewMessage({...newMessage, territory_id: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los territorios" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los territorios</SelectItem>
                  {territories.map((territory) => (
                    <SelectItem key={territory.id} value={territory.id}>
                      {territory.name} ({territory.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="scheduled_for">Programar Para (Opcional)</Label>
              <Input
                id="scheduled_for"
                type="datetime-local"
                value={newMessage.scheduled_for}
                onChange={(e) => setNewMessage({...newMessage, scheduled_for: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Contenido del Mensaje *</Label>
            <Textarea
              id="content"
              value={newMessage.content}
              onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
              placeholder="Escribe aquí el contenido de tu mensaje masivo..."
              rows={6}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button 
              variant="outline"
              onClick={() => setNewMessage({
                subject: '',
                content: '',
                category: 'general',
                priority: 'medium',
                territory_id: '',
                scheduled_for: ''
              })}
            >
              Limpiar
            </Button>
            <Button 
              onClick={handleCreateMessage}
              disabled={createMessageMutation.isPending}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {createMessageMutation.isPending ? "Creando..." : "Crear Mensaje"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Mensajes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Mensajes Programados y Enviados ({messages.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Cargando mensajes...</div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No hay mensajes masivos creados</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <Card key={message.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-800 mb-1">
                          {message.subject}
                        </h3>
                        <p className="text-sm text-slate-600 line-clamp-2">
                          {message.content}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Badge className={getStatusColor(message.status)}>
                          {message.status}
                        </Badge>
                        <Badge className={getPriorityColor(message.priority)}>
                          {message.priority}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Creado: {new Date(message.created_at).toLocaleDateString()}
                        </span>
                        {message.scheduled_for && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Programado: {new Date(message.scheduled_for).toLocaleDateString()}
                          </span>
                        )}
                        {message.sent_at && (
                          <span className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Enviado: {new Date(message.sent_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      {message.status === 'draft' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => sendMessageMutation.mutate(message.id)}
                          disabled={sendMessageMutation.isPending}
                          className="text-blue-600 border-blue-600 hover:bg-blue-50"
                        >
                          <Zap className="w-3 h-3 mr-1" />
                          Enviar Ahora
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MassMessagingSystem;
