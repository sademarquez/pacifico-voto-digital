
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Plus, MapPin, Clock, User } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useDataSegregation } from "../hooks/useDataSegregation";
import { useToast } from "@/hooks/use-toast";

type AlertType = 'security' | 'logistics' | 'political' | 'emergency' | 'information';
type AlertPriority = 'low' | 'medium' | 'high' | 'urgent';

interface Alert {
  id: string;
  title: string;
  description: string;
  type: AlertType;
  priority: AlertPriority;
  territory_id: string | null;
  created_at: string;
  created_by: string;
  territories?: {
    name: string;
  };
  profiles?: {
    name: string;
  };
}

interface Territory {
  id: string;
  name: string;
  type: string;
}

const AlertSystem = () => {
  const { user } = useAuth();
  const { getAlertFilter } = useDataSegregation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [newAlert, setNewAlert] = useState({
    title: '',
    description: '',
    type: '' as AlertType | '',
    priority: 'medium' as AlertPriority,
    territory_id: ''
  });

  // Query para obtener alertas
  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ['alerts', user?.id],
    queryFn: async () => {
      if (!supabase || !user) return [];
      
      console.log('Fetching alerts for user:', user.id);
      
      try {
        let query = supabase
          .from('alerts')
          .select(`
            *,
            territories(name),
            profiles!alerts_created_by_fkey(name)
          `)
          .order('created_at', { ascending: false });

        const { data, error } = await query;
        if (error) {
          console.error('Error fetching alerts:', error);
          return [];
        }
        return data || [];
      } catch (error) {
        console.error('Exception fetching alerts:', error);
        return [];
      }
    },
    enabled: !!supabase && !!user
  });

  // Query para obtener territorios
  const { data: territories = [] } = useQuery({
    queryKey: ['territories-for-alerts', user?.id],
    queryFn: async () => {
      if (!supabase || !user) return [];
      
      try {
        const { data, error } = await supabase
          .from('territories')
          .select('id, name, type')
          .order('name');

        if (error) {
          console.error('Error fetching territories:', error);
          return [];
        }
        return data || [];
      } catch (error) {
        console.error('Exception fetching territories:', error);
        return [];
      }
    },
    enabled: !!supabase && !!user
  });

  // Mutación para crear nueva alerta
  const createAlertMutation = useMutation({
    mutationFn: async (alertData: typeof newAlert) => {
      if (!supabase || !user || !alertData.type) {
        throw new Error('Datos incompletos');
      }

      const { data, error } = await supabase
        .from('alerts')
        .insert({
          title: alertData.title,
          description: alertData.description,
          type: alertData.type as AlertType,
          priority: alertData.priority,
          territory_id: alertData.territory_id || null,
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
        description: "La alerta ha sido registrada exitosamente.",
      });
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      setNewAlert({
        title: '',
        description: '',
        type: '',
        priority: 'medium',
        territory_id: ''
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear la alerta.",
        variant: "destructive",
      });
    }
  });

  const handleCreateAlert = () => {
    if (!newAlert.title || !newAlert.type) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive"
      });
      return;
    }
    createAlertMutation.mutate(newAlert);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'security': return 'bg-red-50 text-red-700';
      case 'emergency': return 'bg-red-50 text-red-700';
      case 'political': return 'bg-blue-50 text-blue-700';
      case 'logistics': return 'bg-purple-50 text-purple-700';
      case 'information': return 'bg-gray-50 text-gray-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Formulario para crear nueva alerta */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Crear Nueva Alerta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={newAlert.title}
                onChange={(e) => setNewAlert({...newAlert, title: e.target.value})}
                placeholder="Título de la alerta"
              />
            </div>
            <div className="space-y-2">
              <Label>Tipo *</Label>
              <Select 
                value={newAlert.type} 
                onValueChange={(value) => setNewAlert({...newAlert, type: value as AlertType})}
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
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Prioridad</Label>
              <Select 
                value={newAlert.priority} 
                onValueChange={(value) => setNewAlert({...newAlert, priority: value as AlertPriority})}
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
              <Label>Territorio</Label>
              <Select 
                value={newAlert.territory_id} 
                onValueChange={(value) => setNewAlert({...newAlert, territory_id: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona territorio" />
                </SelectTrigger>
                <SelectContent>
                  {territories.map((territory) => (
                    <SelectItem key={territory.id} value={territory.id}>
                      {territory.name} ({territory.type})
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
              placeholder="Describe la alerta..."
              className="min-h-[100px]"
            />
          </div>

          <Button 
            onClick={handleCreateAlert} 
            disabled={createAlertMutation.isPending}
            className="w-full"
          >
            {createAlertMutation.isPending ? "Creando..." : "Crear Alerta"}
          </Button>
        </CardContent>
      </Card>

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
            <div className="text-center py-8">Cargando alertas...</div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay alertas registradas
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg">{alert.title}</h3>
                    <div className="flex gap-2">
                      <Badge className={getPriorityColor(alert.priority)}>
                        {alert.priority.toUpperCase()}
                      </Badge>
                      <Badge className={getTypeColor(alert.type)}>
                        {alert.type}
                      </Badge>
                    </div>
                  </div>
                  
                  {alert.description && (
                    <p className="text-gray-600 mb-3">{alert.description}</p>
                  )}
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    {alert.territories && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {alert.territories.name}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(alert.created_at).toLocaleDateString()}
                    </div>
                    {alert.profiles && (
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {alert.profiles.name}
                      </div>
                    )}
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

export default AlertSystem;
