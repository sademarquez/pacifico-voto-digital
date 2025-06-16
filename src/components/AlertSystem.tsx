import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Clock, Eye, EyeOff } from 'lucide-react';
import { useSimpleAuth } from '../contexts/SimpleAuthContext';
import { useToast } from '@/hooks/use-toast';

interface Alert {
  id: string;
  title: string;
  description: string | null;
  status: 'active' | 'resolved' | 'pending';
  priority: 'high' | 'medium' | 'low';
  created_at: string;
  resolved_at: string | null;
  visible_to_voters: boolean;
}

const AlertSystem = () => {
  const { user } = useSimpleAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [visibleAlertsOnly, setVisibleAlertsOnly] = useState(false);

  // Query para obtener alertas
  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ['alerts', user?.id, visibleAlertsOnly],
    queryFn: async () => {
      if (!supabase || !user) return [];

      let query = supabase
        .from('alerts')
        .select('*')
        .order('created_at', { ascending: false });

      if (visibleAlertsOnly) {
        query = query.eq('visible_to_voters', true);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching alerts:', error);
        return [];
      }
      return data || [];
    },
    enabled: !!supabase && !!user,
  });

  // Mutación para resolver alerta
  const resolveAlertMutation = useMutation({
    mutationFn: async (alertId: string) => {
      if (!supabase) throw new Error('No Supabase client found');

      const { error } = await supabase
        .from('alerts')
        .update({ status: 'resolved', resolved_at: new Date().toISOString() })
        .eq('id', alertId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Alerta resuelta",
        description: "La alerta ha sido marcada como resuelta.",
      });
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo resolver la alerta.",
        variant: "destructive",
      });
    }
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'resolved': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header con switch de visibilidad */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Sistema de Alertas</h2>
          <p className="text-gray-600">Gestiona las alertas de tu campaña</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setVisibleAlertsOnly(!visibleAlertsOnly)}
            className="bg-white hover:bg-gray-50"
          >
            {visibleAlertsOnly ? (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Mostrar Todas
              </>
            ) : (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                Solo Visibles
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Lista de alertas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Alertas Activas ({alerts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Cargando alertas...</div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay alertas activas
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <Card key={alert.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-1">
                          {alert.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {alert.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        {getStatusIcon(alert.status)}
                        <Badge className={getPriorityColor(alert.priority)}>
                          {alert.priority}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>
                        Creado: {new Date(alert.created_at).toLocaleString()}
                      </span>
                      {alert.status === 'active' && (
                        <Button
                          onClick={() => resolveAlertMutation.mutate(alert.id)}
                          disabled={resolveAlertMutation.isLoading}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          Resolver
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

export default AlertSystem;
