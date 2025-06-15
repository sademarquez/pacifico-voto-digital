
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useDataSegregation } from "@/hooks/useDataSegregation";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertTriangle, 
  Plus, 
  MapPin, 
  Clock,
  CheckCircle,
  XCircle,
  Shield,
  Truck,
  Users,
  Info
} from "lucide-react";

const AlertSystem = () => {
  const { user } = useAuth();
  const { getAlertFilter } = useDataSegregation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [newAlert, setNewAlert] = useState({
    title: '',
    description: '',
    type: '' as 'security' | 'logistics' | 'political' | 'emergency' | 'information' | '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    territory_id: '',
    affected_user_id: ''
  });

  // Query para obtener alertas
  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ['alerts'],
    queryFn: async () => {
      if (!supabase) return [];
      
      const { data, error } = await supabase
        .from('alerts')
        .select(`
          *,
          territory:territories(name),
          affected_user:profiles!alerts_affected_user_id_fkey(name),
          created_by_user:profiles!alerts_created_by_fkey(name),
          resolved_by_user:profiles!alerts_resolved_by_fkey(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!supabase && !!user
  });

  // Query para obtener territorios
  const { data: territories = [] } = useQuery({
    queryKey: ['territories-for-alerts'],
    queryFn: async () => {
      if (!supabase) return [];
      const { data } = await supabase
        .from('territories')
        .select('id, name, type')
        .order('name');
      return data || [];
    },
    enabled: !!supabase
  });

  // Query para obtener usuarios
  const { data: users = [] } = useQuery({
    queryKey: ['users-for-alerts'],
    queryFn: async () => {
      if (!supabase) return [];
      const { data } = await supabase
        .from('profiles')
        .select('id, name, role')
        .order('name');
      return data || [];
    },
    enabled: !!supabase
  });

  // Mutation para crear alerta
  const createAlertMutation = useMutation({
    mutationFn: async (alertData: typeof newAlert) => {
      if (!supabase || !user) throw new Error("No disponible");

      const { data, error } = await supabase
        .from('alerts')
        .insert({
          title: alertData.title,
          description: alertData.description,
          type: alertData.type,
          priority: alertData.priority,
          territory_id: alertData.territory_id || null,
          affected_user_id: alertData.affected_user_id || null,
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Alerta creada",
        description: "La alerta ha sido creada exitosamente",
      });
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      setNewAlert({
        title: '',
        description: '',
        type: '',
        priority: 'medium',
        territory_id: '',
        affected_user_id: ''
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear la alerta",
        variant: "destructive",
      });
    }
  });

  // Mutation para resolver alerta
  const resolveAlertMutation = useMutation({
    mutationFn: async (alertId: string) => {
      if (!supabase || !user) throw new Error("No disponible");

      const { data, error } = await supabase
        .from('alerts')
        .update({
          status: 'resolved',
          resolved_by: user.id,
          resolved_at: new Date().toISOString()
        })
        .eq('id', alertId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Alerta resuelta",
        description: "La alerta ha sido marcada como resuelta",
      });
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    }
  });

  const handleCreateAlert = () => {
    if (!newAlert.title || !newAlert.type) {
      toast({
        title: "Error",
        description: "Título y tipo son requeridos",
        variant: "destructive"
      });
      return;
    }
    createAlertMutation.mutate(newAlert);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'security': return Shield;
      case 'logistics': return Truck;
      case 'political': return Users;
      case 'emergency': return AlertTriangle;
      case 'information': return Info;
      default: return AlertTriangle;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'security': return 'bg-red-100 text-red-800 border-red-300';
      case 'logistics': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'political': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'emergency': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'information': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return Clock;
      case 'resolved': return CheckCircle;
      case 'dismissed': return XCircle;
      default: return Clock;
    }
  };

  const activeAlerts = alerts.filter(alert => alert.status === 'active');
  const resolvedAlerts = alerts.filter(alert => alert.status === 'resolved');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sistema de Alertas</h1>
          <p className="text-gray-600">Gestiona alertas y notificaciones de la campaña</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-red-50">
            {activeAlerts.length} Activas
          </Badge>
          <Badge variant="outline" className="bg-green-50">
            {resolvedAlerts.length} Resueltas
          </Badge>
        </div>
      </div>

      {/* Formulario para crear alerta */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Crear Nueva Alerta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título de la Alerta</Label>
              <Input
                id="title"
                value={newAlert.title}
                onChange={(e) => setNewAlert({...newAlert, title: e.target.value})}
                placeholder="Ej: Problema de seguridad en evento"
                disabled={createAlertMutation.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Alerta</Label>
              <Select 
                value={newAlert.type} 
                onValueChange={(value) => setNewAlert({...newAlert, type: value as any})}
                disabled={createAlertMutation.isPending}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="security">Seguridad</SelectItem>
                  <SelectItem value="logistics">Logística</SelectItem>
                  <SelectItem value="political">Política</SelectItem>
                  <SelectItem value="emergency">Emergencia</SelectItem>
                  <SelectItem value="information">Información</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Prioridad</Label>
              <Select 
                value={newAlert.priority} 
                onValueChange={(value) => setNewAlert({...newAlert, priority: value as any})}
                disabled={createAlertMutation.isPending}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baja</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="territory">Territorio Afectado</Label>
              <Select 
                value={newAlert.territory_id} 
                onValueChange={(value) => setNewAlert({...newAlert, territory_id: value})}
                disabled={createAlertMutation.isPending}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona territorio (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  {territories.map((territory: any) => (
                    <SelectItem key={territory.id} value={territory.id}>
                      {territory.name} ({territory.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="affected-user">Usuario Afectado</Label>
              <Select 
                value={newAlert.affected_user_id} 
                onValueChange={(value) => setNewAlert({...newAlert, affected_user_id: value})}
                disabled={createAlertMutation.isPending}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona usuario (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user: any) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={newAlert.description}
              onChange={(e) => setNewAlert({...newAlert, description: e.target.value})}
              placeholder="Describe la situación detalladamente..."
              rows={3}
              disabled={createAlertMutation.isPending}
            />
          </div>

          <Button 
            onClick={handleCreateAlert} 
            className="w-full"
            disabled={createAlertMutation.isPending}
          >
            {createAlertMutation.isPending ? "Creando..." : "Crear Alerta"}
          </Button>
        </CardContent>
      </Card>

      {/* Alertas activas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            Alertas Activas ({activeAlerts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeAlerts.map((alert: any) => {
              const TypeIcon = getTypeIcon(alert.type);
              const StatusIcon = getStatusIcon(alert.status);
              
              return (
                <div key={alert.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(alert.type)}`}>
                        <TypeIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium">{alert.title}</h3>
                          <Badge className={getPriorityColor(alert.priority)}>
                            {alert.priority.toUpperCase()}
                          </Badge>
                        </div>
                        
                        {alert.description && (
                          <p className="text-sm text-gray-600 mb-3">{alert.description}</p>
                        )}
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          {alert.territory && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {alert.territory.name}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(alert.created_at).toLocaleString()}
                          </div>
                          {alert.created_by_user && (
                            <span>Por: {alert.created_by_user.name}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={getTypeColor(alert.type)}>
                        {alert.type}
                      </Badge>
                      <Button
                        size="sm"
                        onClick={() => resolveAlertMutation.mutate(alert.id)}
                        disabled={resolveAlertMutation.isPending}
                      >
                        Resolver
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}

            {activeAlerts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No hay alertas activas
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Alertas resueltas - mostrar solo las últimas 5 */}
      {resolvedAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Alertas Resueltas Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {resolvedAlerts.slice(0, 5).map((alert: any) => {
                const TypeIcon = getTypeIcon(alert.type);
                
                return (
                  <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                    <div className="flex items-center gap-3">
                      <TypeIcon className="w-4 h-4 text-green-600" />
                      <div>
                        <h4 className="font-medium text-sm">{alert.title}</h4>
                        <p className="text-xs text-gray-500">
                          Resuelto por {alert.resolved_by_user?.name} - {new Date(alert.resolved_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AlertSystem;
