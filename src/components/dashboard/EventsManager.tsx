import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Plus, Clock } from "lucide-react";
import { useSimpleAuth } from "../../contexts/SimpleAuthContext";
import { useToast } from "@/hooks/use-toast";

interface Event {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
}

const EventsManager = () => {
  const { user } = useSimpleAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [newEvent, setNewEvent] = useState({
    name: '',
    description: '',
    location: '',
    start_date: '',
    end_date: ''
  });

  // Query para obtener eventos
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events', user?.id],
    queryFn: async () => {
      if (!supabase || !user) return [];
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: true });

      if (error) {
        console.error('Error fetching events:', error);
        return [];
      }
      return data || [];
    },
    enabled: !!supabase && !!user
  });

  // Mutación para crear evento
  const createEventMutation = useMutation({
    mutationFn: async (eventData: typeof newEvent) => {
      if (!supabase || !user) {
        throw new Error('Datos incompletos');
      }

      const { data, error } = await supabase
        .from('events')
        .insert({
          name: eventData.name,
          description: eventData.description || null,
          location: eventData.location || null,
          start_date: eventData.start_date || null,
          end_date: eventData.end_date || null,
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Evento creado",
        description: "El evento ha sido registrado exitosamente.",
      });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      setNewEvent({
        name: '',
        description: '',
        location: '',
        start_date: '',
        end_date: ''
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear el evento.",
        variant: "destructive",
      });
    }
  });

  // Mutación para eliminar evento
  const deleteEventMutation = useMutation({
    mutationFn: async (eventId: string) => {
      if (!supabase) throw new Error('No hay conexión');

      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Evento eliminado",
        description: "El evento ha sido eliminado exitosamente.",
      });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el evento.",
        variant: "destructive",
      });
    }
  });

  const handleCreateEvent = () => {
    if (!newEvent.name || !newEvent.start_date || !newEvent.end_date) {
      toast({
        title: "Error",
        description: "Por favor completa el nombre, fecha de inicio y fecha de fin del evento",
        variant: "destructive"
      });
      return;
    }
    createEventMutation.mutate(newEvent);
  };

  const handleDeleteEvent = (eventId: string) => {
    deleteEventMutation.mutate(eventId);
  };

  return (
    <div className="space-y-6">
      {/* Formulario para crear nuevo evento */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="bg-green-50">
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Plus className="w-5 h-5" />
            Nuevo Evento de Campaña
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700 font-medium">Nombre del Evento *</Label>
            <Input
              id="name"
              value={newEvent.name}
              onChange={(e) => setNewEvent({...newEvent, name: e.target.value})}
              placeholder="Ej: Reunión vecinal en la plaza central"
              className="border-gray-300 focus:border-green-500"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date" className="text-gray-700 font-medium">Fecha de Inicio *</Label>
              <Input
                id="start_date"
                type="datetime-local"
                value={newEvent.start_date}
                onChange={(e) => setNewEvent({...newEvent, start_date: e.target.value})}
                className="border-gray-300 focus:border-green-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date" className="text-gray-700 font-medium">Fecha de Fin *</Label>
              <Input
                id="end_date"
                type="datetime-local"
                value={newEvent.end_date}
                onChange={(e) => setNewEvent({...newEvent, end_date: e.target.value})}
                className="border-gray-300 focus:border-green-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-gray-700 font-medium">Ubicación</Label>
            <Input
              id="location"
              value={newEvent.location}
              onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
              placeholder="Ej: Plaza Central, Salón Comunal"
              className="border-gray-300 focus:border-green-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-700 font-medium">Descripción</Label>
            <Textarea
              id="description"
              value={newEvent.description}
              onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
              placeholder="Describe los detalles del evento..."
              className="min-h-[100px] border-gray-300 focus:border-green-500"
            />
          </div>

          <Button 
            onClick={handleCreateEvent} 
            disabled={createEventMutation.isPending}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            {createEventMutation.isPending ? "Creando..." : "Crear Evento"}
          </Button>
        </CardContent>
      </Card>

      {/* Lista de eventos */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="bg-gray-50">
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Calendar className="w-5 h-5" />
            Próximos Eventos ({events.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Cargando eventos...</div>
          ) : events.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay eventos programados
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg text-gray-800">{event.name}</h3>
                    <Button
                      onClick={() => handleDeleteEvent(event.id)}
                      disabled={deleteEventMutation.isPending}
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Eliminar
                    </Button>
                  </div>
                  
                  {event.description && (
                    <p className="text-gray-600 mb-3">{event.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      {event.start_date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(event.start_date).toLocaleDateString()}
                        </div>
                      )}
                      {event.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {event.location}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {/* Aquí podrías mostrar la cantidad de usuarios inscritos */}
                      {/* Por ahora, un valor estático */}
                      50+
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EventsManager;
