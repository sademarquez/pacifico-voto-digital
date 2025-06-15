
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, MapPin, Clock, User, Filter, RefreshCw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "../contexts/AuthContext";
import { useDataSegregation } from "../hooks/useDataSegregation";

interface MapaAlerta {
  id: string;
  title: string;
  description: string;
  type: string;
  priority: string;
  status: string;
  territory_id: string;
  territories?: {
    name: string;
    type: string;
  };
  profiles?: {
    name: string;
  };
  created_at: string;
}

const MapaAlertas = () => {
  const { user } = useAuth();
  const { getAlertFilter } = useDataSegregation();
  const [selectedAlert, setSelectedAlert] = useState<MapaAlerta | null>(null);
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  // Query para obtener alertas con filtros aplicados
  const { data: alerts = [], isLoading, refetch } = useQuery({
    queryKey: ['mapa-alerts', user?.id, filterPriority, filterType],
    queryFn: async () => {
      if (!supabase || !user) return [];
      
      const baseFilter = getAlertFilter();
      let query = supabase
        .from('alerts')
        .select(`
          *,
          territories(name, type),
          profiles!alerts_created_by_fkey(name)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      // Aplicar filtros de rol
      if (baseFilter && Object.keys(baseFilter).length > 0) {
        if (baseFilter.or) {
          query = query.or(baseFilter.or);
        } else {
          Object.entries(baseFilter).forEach(([key, value]) => {
            if (value !== null) {
              query = query.eq(key, value);
            }
          });
        }
      }

      // Aplicar filtros adicionales
      if (filterPriority !== 'all') {
        query = query.eq('priority', filterPriority);
      }
      if (filterType !== 'all') {
        query = query.eq('type', filterType);
      }

      const { data, error } = await query;
      if (error) {
        console.error('Error fetching alerts:', error);
        return [];
      }
      return data || [];
    },
    enabled: !!supabase && !!user
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
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

  const handleAlertClick = (alerta: MapaAlerta) => {
    setSelectedAlert(alerta);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-6 h-6" />
              Mapa de Alertas de Campaña
            </CardTitle>
            <Button variant="outline" onClick={() => refetch()} size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualizar
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filtros:</span>
            </div>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las prioridades</SelectItem>
                <SelectItem value="urgent">Urgente</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="medium">Media</SelectItem>
                <SelectItem value="low">Baja</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="security">Seguridad</SelectItem>
                <SelectItem value="logistics">Logística</SelectItem>
                <SelectItem value="political">Política</SelectItem>
                <SelectItem value="emergency">Emergencia</SelectItem>
                <SelectItem value="information">Información</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel de alertas */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Alertas Activas ({alerts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {isLoading ? (
                  <div className="text-center py-4 text-sm text-gray-500">
                    Cargando alertas...
                  </div>
                ) : alerts.length === 0 ? (
                  <div className="text-center py-4 text-sm text-gray-500">
                    No hay alertas activas
                  </div>
                ) : (
                  alerts.map((alerta: MapaAlerta) => (
                    <div
                      key={alerta.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                        selectedAlert?.id === alerta.id ? 'bg-blue-50 border-blue-300' : ''
                      }`}
                      onClick={() => handleAlertClick(alerta)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm">{alerta.title}</h4>
                        <div className={`w-3 h-3 rounded-full ${getPriorityColor(alerta.priority)}`} />
                      </div>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">{alerta.description}</p>
                      <div className="flex items-center justify-between text-xs">
                        <Badge className={getTypeColor(alerta.type)} variant="outline">
                          {alerta.type}
                        </Badge>
                        {alerta.territories && (
                          <span className="text-gray-500">{alerta.territories.name}</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Área del mapa */}
        <div className="lg:col-span-2">
          <Card className="h-[600px]">
            <CardContent className="p-0 h-full">
              <div className="w-full h-full bg-gradient-to-br from-red-50 to-orange-50 rounded-lg flex items-center justify-center relative overflow-hidden">
                {/* Simulación de mapa con alertas */}
                <div className="absolute inset-0 p-6">
                  <div className="grid grid-cols-3 gap-4 h-full">
                    {alerts.slice(0, 9).map((alerta: MapaAlerta, index) => (
                      <div
                        key={alerta.id}
                        className={`rounded-lg border-2 p-4 cursor-pointer transition-all hover:scale-105 ${
                          selectedAlert?.id === alerta.id 
                            ? 'border-blue-500 bg-blue-100' 
                            : 'border-gray-300 bg-white'
                        }`}
                        onClick={() => handleAlertClick(alerta)}
                      >
                        <div className="text-center">
                          <div className={`w-6 h-6 mx-auto mb-2 rounded-full ${getPriorityColor(alerta.priority)} animate-pulse`} />
                          <h3 className="font-medium text-sm line-clamp-1">{alerta.title}</h3>
                          <p className="text-xs text-gray-500 capitalize">{alerta.type}</p>
                          {alerta.territories && (
                            <p className="text-xs mt-1 text-gray-600">{alerta.territories.name}</p>
                          )}
                          <Badge className={`mt-2 text-xs ${getPriorityBadgeColor(alerta.priority)}`}>
                            {alerta.priority}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Información de alerta seleccionada */}
                {selectedAlert && (
                  <div className="absolute bottom-4 left-4 right-4 bg-white p-4 rounded-lg shadow-lg border">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold">{selectedAlert.title}</h3>
                      <Badge className={getPriorityBadgeColor(selectedAlert.priority)}>
                        {selectedAlert.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{selectedAlert.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {selectedAlert.territories && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-blue-600" />
                          <span>{selectedAlert.territories.name}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-green-600" />
                        <span>{new Date(selectedAlert.created_at).toLocaleDateString()}</span>
                      </div>
                      {selectedAlert.profiles && (
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-purple-600" />
                          <span>{selectedAlert.profiles.name}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Badge className={getTypeColor(selectedAlert.type)} variant="outline">
                          {selectedAlert.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}

                {/* Overlay de carga */}
                {isLoading && (
                  <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                    <div className="text-center">
                      <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
                      <p className="text-sm text-gray-600">Cargando alertas...</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MapaAlertas;
