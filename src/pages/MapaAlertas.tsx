
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Circle, MapPin, AlertTriangle } from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";
import VisitorSession from "@/components/VisitorSession";

interface Alert {
  id: string;
  title: string;
  description: string;
  type: 'security' | 'logistics' | 'social' | 'political';
  status: 'active' | 'resolved' | 'archived';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  territory: {
    id: string;
    name: string;
    coordinates: { lat: number; lng: number };
  } | null;
}

const MapaAlertas = () => {
  const { user, isAuthenticated } = useAuth();
  const [mapCenter, setMapCenter] = useState({ lat: 4.60971, lng: -74.08175 });
  const [zoomLevel, setZoomLevel] = useState(6);
  const [selectedTerritory, setSelectedTerritory] = useState("");

  // Datos simulados para visitantes si no hay sesión autenticada
  const mockAlerts: Alert[] = [
    {
      id: '1',
      title: 'Reunión Comunitaria',
      description: 'Invitación a la reunión mensual de la comunidad para tratar temas importantes del barrio.',
      type: 'social',
      status: 'active',
      priority: 'medium',
      created_at: new Date().toISOString(),
      territory: {
        id: '1',
        name: 'Chapinero',
        coordinates: { lat: 4.6097, lng: -74.0817 }
      }
    },
    {
      id: '2',
      title: 'Mejoras en Seguridad',
      description: 'Instalación de nuevas cámaras de seguridad en el sector.',
      type: 'security',
      status: 'active',
      priority: 'high',
      created_at: new Date().toISOString(),
      territory: {
        id: '2',
        name: 'Suba',
        coordinates: { lat: 4.7588, lng: -74.0608 }
      }
    }
  ];

  const { data: alerts = mockAlerts, isLoading } = useQuery({
    queryKey: ['alerts-map'],
    queryFn: async (): Promise<Alert[]> => {
      if (!isAuthenticated) {
        return mockAlerts;
      }

      let { data, error } = await supabase
        .from('alerts')
        .select(`
          id,
          title,
          description,
          type,
          status,
          priority,
          created_at,
          territory:territories (
            id,
            name,
            coordinates
          )
        `);
      
      if (error) {
        console.error("Error fetching alerts for map:", error);
        return mockAlerts;
      }

      const validAlerts = data.filter(alert => 
        alert.territory && 
        alert.territory.coordinates &&
        typeof (alert.territory.coordinates as any).lat === 'number' &&
        typeof (alert.territory.coordinates as any).lng === 'number'
      );

      return validAlerts as Alert[];
    },
    refetchOnWindowFocus: false,
  });

  const territories = [
    { id: "chapinero", name: "Chapinero" },
    { id: "suba", name: "Suba" },
    { id: "usaquen", name: "Usaquén" },
    { id: "kennedy", name: "Kennedy" },
    { id: "engativa", name: "Engativá" }
  ];

  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case 'security': return 'bg-red-100 text-red-800';
      case 'logistics': return 'bg-blue-100 text-blue-800';
      case 'social': return 'bg-green-100 text-green-800';
      case 'political': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAlertPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'high': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const mapStyles = {
    height: '500px',
    width: '100%'
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Sesión de Visitante */}
      {(!isAuthenticated || user?.role === 'visitante') && (
        <VisitorSession />
      )}

      {/* Selector de Territorio */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            Selecciona tu Zona
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedTerritory} onValueChange={setSelectedTerritory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona tu barrio o zona..." />
            </SelectTrigger>
            <SelectContent>
              {territories.map((territory) => (
                <SelectItem key={territory.id} value={territory.id}>
                  {territory.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Mapa Interactivo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Mapa de Alertas Comunitarias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}>
            <GoogleMap
              mapContainerStyle={mapStyles}
              center={mapCenter}
              zoom={zoomLevel}
            >
              {alerts.map((alert) => (
                <Marker
                  key={alert.id}
                  position={{
                    lat: (alert.territory?.coordinates as any).lat,
                    lng: (alert.territory?.coordinates as any).lng
                  }}
                  title={alert.title}
                />
              ))}
            </GoogleMap>
          </LoadScript>
        </CardContent>
      </Card>

      {/* Lista de Alertas */}
      <Card>
        <CardHeader>
          <CardTitle>Información de tu Comunidad</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando información...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {alerts.map((alert) => (
                <Card key={alert.id} className="border hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                      <p className="text-sm text-gray-600">{alert.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge className={getAlertTypeColor(alert.type)}>
                          {alert.type}
                        </Badge>
                        <div className="flex items-center gap-2">
                          <Circle className={`w-3 h-3 ${getAlertPriorityColor(alert.priority)}`} />
                          <span className="text-xs text-gray-500">
                            {alert.territory?.name}
                          </span>
                        </div>
                      </div>
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

export default MapaAlertas;
