
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Circle } from 'lucide-react';

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
  const [mapCenter, setMapCenter] = useState({ lat: 4.60971, lng: -74.08175 }); // Centro de Colombia
  const [zoomLevel, setZoomLevel] = useState(6);

  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ['alerts-map'],
    queryFn: async (): Promise<Alert[]> => {
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
        return [];
      }

      // Filtrar alertas que no tienen territorio o coordenadas
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
    height: '600px',
    width: '100%'
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Mapa de Alertas</CardTitle>
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

      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Listado de Alertas</h2>
        {isLoading ? (
          <div>Cargando alertas...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {alerts.map((alert) => (
              <Card key={alert.id}>
                <CardHeader>
                  <CardTitle>{alert.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">{alert.description}</p>
                  <div className="mt-2">
                    <Badge className={getAlertTypeColor(alert.type)}>
                      {alert.type}
                    </Badge>
                    <div className="flex items-center gap-2 mt-1">
                      <Circle className={`w-3 h-3 ${getAlertPriorityColor(alert.priority)}`} />
                      Prioridad: {alert.priority}
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Creado: {new Date(alert.created_at).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MapaAlertas;
