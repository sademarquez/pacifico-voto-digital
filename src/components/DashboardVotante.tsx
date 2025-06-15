
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "../contexts/AuthContext";
import { 
  AlertTriangle, 
  Calendar, 
  MapPin, 
  Users,
  MessageSquare,
  CheckCircle
} from "lucide-react";

const DashboardVotante = () => {
  const { user } = useAuth();

  // Query para alertas que afectan al votante
  const { data: myAlerts = [] } = useQuery({
    queryKey: ['votante-alerts', user?.id],
    queryFn: async () => {
      if (!supabase || !user) return [];
      
      const { data, error } = await supabase
        .from('alerts')
        .select(`
          *,
          territories(name)
        `)
        .eq('affected_user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching votante alerts:', error);
        return [];
      }
      return data || [];
    },
    enabled: !!supabase && !!user
  });

  // Query para eventos próximos donde el votante puede participar
  const { data: upcomingEvents = [] } = useQuery({
    queryKey: ['votante-events', user?.id],
    queryFn: async () => {
      if (!supabase || !user) return [];
      
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          territories(name)
        `)
        .gte('start_date', new Date().toISOString())
        .eq('status', 'confirmed')
        .order('start_date', { ascending: true })
        .limit(5);

      if (error) {
        console.error('Error fetching votante events:', error);
        return [];
      }
      return data || [];
    },
    enabled: !!supabase && !!user
  });

  // Query para tareas asignadas al votante
  const { data: myTasks = [] } = useQuery({
    queryKey: ['votante-tasks', user?.id],
    queryFn: async () => {
      if (!supabase || !user) return [];
      
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          territories(name),
          events(title)
        `)
        .eq('assigned_to', user.id)
        .in('status', ['pending', 'in_progress'])
        .order('due_date', { ascending: true })
        .limit(5);

      if (error) {
        console.error('Error fetching votante tasks:', error);
        return [];
      }
      return data || [];
    },
    enabled: !!supabase && !!user
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header personalizado para votante */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">Panel del Colaborador</h1>
        <p className="text-green-100">
          Bienvenido {user?.name}. Aquí tienes tu información personalizada de la campaña.
        </p>
      </div>

      {/* Métricas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-600">Alertas</p>
                <p className="text-xl font-bold text-gray-900">{myAlerts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Calendar className="h-6 w-6 text-blue-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-600">Eventos</p>
                <p className="text-xl font-bold text-gray-900">{upcomingEvents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-600">Tareas</p>
                <p className="text-xl font-bold text-gray-900">{myTasks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <MessageSquare className="h-6 w-6 text-purple-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-600">Mensajes</p>
                <p className="text-xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alertas personales */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Mis Alertas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {myAlerts.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No tienes alertas pendientes
                </p>
              ) : (
                myAlerts.map((alert: any) => (
                  <div key={alert.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{alert.title}</h4>
                      <Badge className={getPriorityColor(alert.priority)}>
                        {alert.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600">{alert.description}</p>
                    {alert.territories && (
                      <div className="flex items-center gap-1 mt-2">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{alert.territories.name}</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Eventos próximos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Eventos Próximos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingEvents.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No hay eventos programados
                </p>
              ) : (
                upcomingEvents.map((event: any) => (
                  <div key={event.id} className="border rounded-lg p-3">
                    <h4 className="font-medium text-sm">{event.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{event.description}</p>
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                      <span>{new Date(event.start_date).toLocaleDateString()}</span>
                      {event.territories && (
                        <span>{event.territories.name}</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mis tareas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Mis Tareas Pendientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {myTasks.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No tienes tareas pendientes
              </p>
            ) : (
              myTasks.map((task: any) => (
                <div key={task.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{task.title}</h4>
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600">{task.description}</p>
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                    {task.due_date && (
                      <span>Vence: {new Date(task.due_date).toLocaleDateString()}</span>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {task.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardVotante;
