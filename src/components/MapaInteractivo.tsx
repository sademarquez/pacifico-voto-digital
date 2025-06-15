
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, AlertTriangle, Users, Calendar, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../contexts/AuthContext";
import { useDataSegregation } from "../hooks/useDataSegregation";

interface MapaAlert {
  id: string;
  title: string;
  description: string;
  type: string;
  priority: string;
  territory_id: string;
  territories?: {
    name: string;
    type: string;
  };
  created_at: string;
}

interface Territory {
  id: string;
  name: string;
  type: string;
  population_estimate: number;
  voter_estimate: number;
  coordinates?: any;
}

const MapaInteractivo = () => {
  const { user } = useAuth();
  const { getTerritoryFilter, getAlertFilter } = useDataSegregation();
  const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(null);
  const [mapView, setMapView] = useState<'territories' | 'alerts'>('territories');

  // Query para territorios con datos reales
  const { data: territories = [], isLoading: loadingTerritories, refetch: refetchTerritories } = useQuery({
    queryKey: ['map-territories', user?.id],
    queryFn: async () => {
      if (!supabase || !user) return [];
      
      const filter = getTerritoryFilter();
      let query = supabase
        .from('territories')
        .select('*')
        .order('name');

      // Aplicar filtros según el rol
      if (filter && Object.keys(filter).length > 0) {
        if (filter.or) {
          query = query.or(filter.or);
        } else {
          Object.entries(filter).forEach(([key, value]) => {
            if (value !== null) {
              query = query.eq(key, value);
            }
          });
        }
      }

      const { data, error } = await query;
      if (error) {
        console.error('Error fetching territories:', error);
        return [];
      }
      return data || [];
    },
    enabled: !!supabase && !!user
  });

  // Query para alertas con datos reales
  const { data: alerts = [], isLoading: loadingAlerts, refetch: refetchAlerts } = useQuery({
    queryKey: ['map-alerts', user?.id],
    queryFn: async () => {
      if (!supabase || !user) return [];
      
      const filter = getAlertFilter();
      let query = supabase
        .from('alerts')
        .select(`
          *,
          territories(name, type)
        `)
        .eq('status', 'active')
        .order('priority', { ascending: false });

      // Aplicar filtros según el rol
      if (filter && Object.keys(filter).length > 0) {
        if (filter.or) {
          query = query.or(filter.or);
        } else {
          Object.entries(filter).forEach(([key, value]) => {
            if (value !== null) {
              query = query.eq(key, value);
            }
          });
        }
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

  const getAlertColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTerritoryColor = (type: string) => {
    switch (type) {
      case 'departamento': return 'bg-blue-600';
      case 'municipio': return 'bg-green-600';
      case 'corregimiento': return 'bg-purple-600';
      case 'vereda': return 'bg-yellow-600';
      case 'barrio': return 'bg-red-600';
      case 'sector': return 'bg-gray-600';
      default: return 'bg-gray-500';
    }
  };

  const handleRefresh = () => {
    refetchTerritories();
    refetchAlerts();
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Mapa Interactivo de Campaña
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant={mapView === 'territories' ? 'default' : 'outline'}
                onClick={() => setMapView('territories')}
                size="sm"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Territorios
              </Button>
              <Button
                variant={mapView === 'alerts' ? 'default' : 'outline'}
                onClick={() => setMapView('alerts')}
                size="sm"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Alertas
              </Button>
              <Button variant="outline" onClick={handleRefresh} size="sm">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel de información */}
        <div className="space-y-4">
          {/* Estadísticas rápidas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resumen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Territorios:</span>
                <Badge variant="outline">{territories.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Alertas Activas:</span>
                <Badge variant="destructive">{alerts.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Población Total:</span>
                <Badge variant="outline">
                  {territories.reduce((sum, t) => sum + (t.population_estimate || 0), 0).toLocaleString()}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Lista de elementos según vista */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {mapView === 'territories' ? 'Territorios' : 'Alertas Activas'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mapView === 'territories' ? (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {loadingTerritories ? (
                    <div className="text-center py-4 text-sm text-gray-500">
                      Cargando territorios...
                    </div>
                  ) : territories.length === 0 ? (
                    <div className="text-center py-4 text-sm text-gray-500">
                      No hay territorios disponibles
                    </div>
                  ) : (
                    territories.map((territory: Territory) => (
                      <div
                        key={territory.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                          selectedTerritory?.id === territory.id ? 'bg-blue-50 border-blue-300' : ''
                        }`}
                        onClick={() => setSelectedTerritory(territory)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-sm">{territory.name}</h4>
                            <p className="text-xs text-gray-500 capitalize">{territory.type}</p>
                          </div>
                          <div className={`w-3 h-3 rounded-full ${getTerritoryColor(territory.type)}`} />
                        </div>
                        {territory.population_estimate && (
                          <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                            <span>👥 {territory.population_estimate.toLocaleString()}</span>
                            {territory.voter_estimate && (
                              <span>🗳️ {territory.voter_estimate.toLocaleString()}</span>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {loadingAlerts ? (
                    <div className="text-center py-4 text-sm text-gray-500">
                      Cargando alertas...
                    </div>
                  ) : alerts.length === 0 ? (
                    <div className="text-center py-4 text-sm text-gray-500">
                      No hay alertas activas
                    </div>
                  ) : (
                    alerts.map((alert: MapaAlert) => (
                      <div key={alert.id} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm">{alert.title}</h4>
                          <div className={`w-3 h-3 rounded-full ${getAlertColor(alert.priority)}`} />
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{alert.description}</p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500 capitalize">{alert.type}</span>
                          {alert.territories && (
                            <span className="text-gray-500">{alert.territories.name}</span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Área del mapa */}
        <div className="lg:col-span-2">
          <Card className="h-[600px]">
            <CardContent className="p-0 h-full">
              <div className="w-full h-full bg-gradient-to-br from-blue-50 to-green-50 rounded-lg flex items-center justify-center relative overflow-hidden">
                {/* Simulación de mapa con elementos interactivos */}
                <div className="absolute inset-0 p-6">
                  {mapView === 'territories' ? (
                    <div className="grid grid-cols-3 gap-4 h-full">
                      {territories.slice(0, 9).map((territory: Territory, index) => (
                        <div
                          key={territory.id}
                          className={`rounded-lg border-2 p-4 cursor-pointer transition-all hover:scale-105 ${
                            selectedTerritory?.id === territory.id 
                              ? 'border-blue-500 bg-blue-100' 
                              : 'border-gray-300 bg-white'
                          }`}
                          style={{
                            backgroundColor: selectedTerritory?.id === territory.id 
                              ? undefined 
                              : `${getTerritoryColor(territory.type)}20`
                          }}
                          onClick={() => setSelectedTerritory(territory)}
                        >
                          <div className="text-center">
                            <div className={`w-6 h-6 mx-auto mb-2 rounded-full ${getTerritoryColor(territory.type)}`} />
                            <h3 className="font-medium text-sm">{territory.name}</h3>
                            <p className="text-xs text-gray-500 capitalize">{territory.type}</p>
                            {territory.population_estimate && (
                              <p className="text-xs mt-1">
                                {territory.population_estimate.toLocaleString()} hab.
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4 h-full">
                      {alerts.slice(0, 8).map((alert: MapaAlert, index) => (
                        <div
                          key={alert.id}
                          className="rounded-lg border-2 border-gray-300 bg-white p-4 hover:shadow-lg transition-shadow"
                        >
                          <div className="text-center">
                            <div className={`w-6 h-6 mx-auto mb-2 rounded-full ${getAlertColor(alert.priority)}`} />
                            <h3 className="font-medium text-sm">{alert.title}</h3>
                            <p className="text-xs text-gray-500 capitalize">{alert.type}</p>
                            {alert.territories && (
                              <p className="text-xs mt-1">{alert.territories.name}</p>
                            )}
                            <Badge className="mt-2 text-xs" variant="outline">
                              {alert.priority}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Información del elemento seleccionado */}
                {selectedTerritory && mapView === 'territories' && (
                  <div className="absolute bottom-4 left-4 right-4 bg-white p-4 rounded-lg shadow-lg border">
                    <h3 className="font-semibold">{selectedTerritory.name}</h3>
                    <p className="text-sm text-gray-600 capitalize mb-2">{selectedTerritory.type}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {selectedTerritory.population_estimate && (
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-blue-600" />
                          <span>{selectedTerritory.population_estimate.toLocaleString()} habitantes</span>
                        </div>
                      )}
                      {selectedTerritory.voter_estimate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-green-600" />
                          <span>{selectedTerritory.voter_estimate.toLocaleString()} votantes</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Overlay de carga */}
                {(loadingTerritories || loadingAlerts) && (
                  <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                    <div className="text-center">
                      <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
                      <p className="text-sm text-gray-600">Cargando datos del mapa...</p>
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

export default MapaInteractivo;
