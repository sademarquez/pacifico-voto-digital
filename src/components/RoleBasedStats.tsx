
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "../contexts/AuthContext";
import { useDataSegregation } from "../hooks/useDataSegregation";
import { 
  Users, 
  MapPin, 
  AlertTriangle, 
  Calendar,
  Target,
  TrendingUp,
  CheckCircle,
  MessageSquare
} from "lucide-react";

const RoleBasedStats = () => {
  const { user } = useAuth();
  const { getPermissions } = useDataSegregation();

  const permissions = getPermissions();

  // Query para estadísticas específicas del usuario
  const { data: userStats } = useQuery({
    queryKey: ['user-stats', user?.id, user?.role],
    queryFn: async () => {
      if (!supabase || !user) return null;

      const stats: any = {};

      // Estadísticas según permisos
      if (permissions.canViewAllData) {
        const [territories, voters, alerts, users] = await Promise.all([
          supabase.from('territories').select('*'),
          supabase.from('voters').select('*'),
          supabase.from('alerts').select('*').eq('status', 'active'),
          supabase.from('profiles').select('*')
        ]);

        stats.territories = territories.data?.length || 0;
        stats.voters = voters.data?.length || 0;
        stats.alerts = alerts.data?.length || 0;
        stats.users = users.data?.length || 0;
      } else {
        // Estadísticas limitadas según el rol
        const [myTasks, myEvents] = await Promise.all([
          supabase.from('tasks').select('*').eq('assigned_to', user.id),
          supabase.from('events').select('*').gte('start_date', new Date().toISOString())
        ]);

        stats.tasks = myTasks.data?.length || 0;
        stats.events = myEvents.data?.length || 0;
      }

      return stats;
    },
    enabled: !!supabase && !!user
  });

  const getStatsConfig = () => {
    switch (user?.role) {
      case 'desarrollador':
      case 'master':
        return [
          { label: 'Total Usuarios', value: userStats?.users || 0, icon: Users, color: 'text-blue-600' },
          { label: 'Territorios', value: userStats?.territories || 0, icon: MapPin, color: 'text-purple-600' },
          { label: 'Votantes', value: userStats?.voters || 0, icon: Target, color: 'text-green-600' },
          { label: 'Alertas Activas', value: userStats?.alerts || 0, icon: AlertTriangle, color: 'text-red-600' }
        ];
      case 'candidato':
        return [
          { label: 'Mi Equipo', value: userStats?.users || 0, icon: Users, color: 'text-blue-600' },
          { label: 'Territorios', value: userStats?.territories || 0, icon: MapPin, color: 'text-purple-600' },
          { label: 'Eventos', value: userStats?.events || 0, icon: Calendar, color: 'text-green-600' },
          { label: 'Alertas', value: userStats?.alerts || 0, icon: AlertTriangle, color: 'text-orange-600' }
        ];
      case 'lider':
        return [
          { label: 'Mi Territorio', value: 1, icon: MapPin, color: 'text-purple-600' },
          { label: 'Votantes', value: userStats?.voters || 0, icon: Target, color: 'text-green-600' },
          { label: 'Tareas', value: userStats?.tasks || 0, icon: CheckCircle, color: 'text-blue-600' },
          { label: 'Eventos', value: userStats?.events || 0, icon: Calendar, color: 'text-orange-600' }
        ];
      case 'votante':
        return [
          { label: 'Mis Tareas', value: userStats?.tasks || 0, icon: CheckCircle, color: 'text-blue-600' },
          { label: 'Eventos', value: userStats?.events || 0, icon: Calendar, color: 'text-green-600' },
          { label: 'Mensajes', value: 0, icon: MessageSquare, color: 'text-purple-600' },
          { label: 'Progreso', value: 85, icon: TrendingUp, color: 'text-orange-600' }
        ];
      default:
        return [];
    }
  };

  const statsConfig = getStatsConfig();

  if (statsConfig.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {statsConfig.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <Icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default RoleBasedStats;
