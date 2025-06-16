
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GoogleMap, LoadScript, Marker, InfoWindow, Circle } from '@react-google-maps/api';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Circle as CircleIcon, MapPin, AlertTriangle, Users, Navigation, Eye, Heart, ArrowRight } from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";
import VisitorSession from "@/components/VisitorSession";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const [mapCenter, setMapCenter] = useState({ lat: 4.60971, lng: -74.08175 });
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [zoomLevel, setZoomLevel] = useState(12);
  const [selectedTerritory, setSelectedTerritory] = useState("");
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [radiusFilter, setRadiusFilter] = useState(2000); // 2km por defecto

  // Datos enriquecidos para visitantes con enfoque en candidato
  const candidateAlerts: Alert[] = [
    {
      id: '1',
      title: '🏗️ Nueva Propuesta: Centro Comunitario',
      description: 'Juan Carlos propone construir un moderno centro comunitario con biblioteca, salas de capacitación y espacios deportivos para el sector.',
      type: 'social',
      status: 'active',
      priority: 'high',
      created_at: new Date().toISOString(),
      territory: {
        id: '1',
        name: 'Chapinero',
        coordinates: { lat: 4.6497, lng: -74.0647 }
      }
    },
    {
      id: '2',
      title: '🚨 Plan de Seguridad Integral',
      description: 'Instalación programada de 50 nuevas cámaras HD y creación de la app comunitaria de alertas tempranas.',
      type: 'security',
      status: 'active',
      priority: 'high',
      created_at: new Date().toISOString(),
      territory: {
        id: '2',
        name: 'Suba',
        coordinates: { lat: 4.7588, lng: -74.0608 }
      }
    },
    {
      id: '3',
      title: '💼 Feria de Empleo Comunitaria',
      description: 'Este sábado: gran feria de empleo con más de 200 vacantes disponibles y capacitaciones gratuitas.',
      type: 'social',
      status: 'active',
      priority: 'medium',
      created_at: new Date().toISOString(),
      territory: {
        id: '3',
        name: 'Kennedy',
        coordinates: { lat: 4.6276, lng: -74.1378 }
      }
    },
    {
      id: '4',
      title: '🏠 Proyecto Vivienda Digna',
      description: 'Lanzamiento del programa de subsidios habitacionales: hasta 50% de descuento para familias trabajadoras.',
      type: 'social',
      status: 'active',
      priority: 'high',
      created_at: new Date().toISOString(),
      territory: {
        id: '4',
        name: 'Usaquén',
        coordinates: { lat: 4.6951, lng: -74.0308 }
      }
    },
    {
      id: '5',
      title: '🌐 Internet Gratuito Comunitario',
      description: 'Habilitación de zonas WiFi gratuitas en parques y centros comunitarios del sector.',
      type: 'logistics',
      status: 'active',
      priority: 'medium',
      created_at: new Date().toISOString(),
      territory: {
        id: '5',
        name: 'Engativá',
        coordinates: { lat: 4.6776, lng: -74.1024 }
      }
    }
  ];

  // Obtener geolocalización del usuario
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          setMapCenter(location);
          setZoomLevel(14); // Zoom más cercano cuando tenemos ubicación real
        },
        (error) => {
          console.log('Geolocation error:', error);
          // Mantener ubicación por defecto
        }
      );
    }
  }, []);

  const { data: alerts = candidateAlerts, isLoading } = useQuery({
    queryKey: ['alerts-map'],
    queryFn: async (): Promise<Alert[]> => {
      if (!isAuthenticated) {
        return candidateAlerts;
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
        return candidateAlerts;
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

  // Filtrar alertas por proximidad si tenemos ubicación del usuario
  const filteredAlerts = userLocation 
    ? alerts.filter(alert => {
        if (!alert.territory?.coordinates) return false;
        const distance = calculateDistance(
          userLocation.lat, 
          userLocation.lng,
          (alert.territory.coordinates as any).lat,
          (alert.territory.coordinates as any).lng
        );
        return distance <= radiusFilter;
      })
    : alerts;

  // Calcular distancia entre dos puntos
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lng2-lng1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  };

  const territories = [
    { id: "chapinero", name: "Chapinero" },
    { id: "suba", name: "Suba" },
    { id: "usaquen", name: "Usaquén" },
    { id: "kennedy", name: "Kennedy" },
    { id: "engativa", name: "Engativá" }
  ];

  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case 'security': return 'bg-red-100 text-red-800 border-red-200';
      case 'logistics': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'social': return 'bg-green-100 text-green-800 border-green-200';
      case 'political': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'security': return '#ef4444';
      case 'logistics': return '#3b82f6';
      case 'social': return '#10b981';
      case 'political': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const mapStyles = {
    height: '500px',
    width: '100%'
  };

  const mapOptions = {
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: true,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: true,
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header mejorado */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                <MapPin className="w-8 h-8" />
                Tu Comunidad en Acción
              </h1>
              <p className="text-blue-100 mt-1">
                Descubre las propuestas y proyectos de tu candidato en tu zona
              </p>
            </div>
            {(!isAuthenticated || user?.role === 'visitante') && (
              <Button 
                onClick={() => navigate('/candidato-funnel')}
                className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-bold shadow-lg"
              >
                <Heart className="w-4 h-4 mr-2" />
                Conocer Propuestas
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4 space-y-6">
        {/* Sesión de Visitante mejorada */}
        {(!isAuthenticated || user?.role === 'visitante') && (
          <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  🗳️ ¡Tu Voto Transforma tu Comunidad!
                </h2>
                <p className="text-lg opacity-90">
                  Explora las propuestas específicas para tu sector y conoce cómo puedes ser parte del cambio.
                </p>
              </div>
              <Button 
                onClick={() => navigate('/candidato-funnel')}
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 font-bold shadow-lg"
              >
                Ver Propuestas
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Controles del Mapa */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Navigation className="w-5 h-5 text-blue-600" />
                Filtros de Zona
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedTerritory} onValueChange={setSelectedTerritory}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona tu barrio..." />
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

          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CircleIcon className="w-5 h-5 text-purple-600" />
                Radio de Búsqueda
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={radiusFilter.toString()} onValueChange={(value) => setRadiusFilter(Number(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1000">1 km</SelectItem>
                  <SelectItem value="2000">2 km</SelectItem>
                  <SelectItem value="5000">5 km</SelectItem>
                  <SelectItem value="10000">10 km</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="w-5 h-5 text-green-600" />
                Estadísticas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{filteredAlerts.length}</div>
                <div className="text-sm text-gray-600">
                  {userLocation ? 'Propuestas cerca de ti' : 'Propuestas totales'}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mapa Interactivo Mejorado */}
        <Card className="shadow-2xl border-0 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <CardTitle className="flex items-center gap-2 text-xl">
              <AlertTriangle className="w-6 h-6" />
              Mapa Interactivo de Propuestas
            </CardTitle>
            <p className="text-blue-100">
              Haz clic en los marcadores para ver detalles de cada propuesta
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}>
              <GoogleMap
                mapContainerStyle={mapStyles}
                center={mapCenter}
                zoom={zoomLevel}
                options={mapOptions}
              >
                {/* Marcadores de alertas */}
                {filteredAlerts.map((alert) => (
                  <Marker
                    key={alert.id}
                    position={{
                      lat: (alert.territory?.coordinates as any).lat,
                      lng: (alert.territory?.coordinates as any).lng
                    }}
                    title={alert.title}
                    icon={{
                      path: google.maps.SymbolPath.CIRCLE,
                      scale: 12,
                      fillColor: getMarkerColor(alert.type),
                      fillOpacity: 0.8,
                      strokeColor: '#ffffff',
                      strokeWeight: 2,
                    }}
                    onClick={() => setSelectedAlert(alert)}
                  />
                ))}

                {/* Círculo de ubicación del usuario */}
                {userLocation && (
                  <>
                    <Marker
                      position={userLocation}
                      icon={{
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 8,
                        fillColor: '#4f46e5',
                        fillOpacity: 1,
                        strokeColor: '#ffffff',
                        strokeWeight: 3,
                      }}
                      title="Tu ubicación"
                    />
                    <Circle
                      center={userLocation}
                      radius={radiusFilter}
                      options={{
                        fillColor: '#4f46e5',
                        fillOpacity: 0.1,
                        strokeColor: '#4f46e5',
                        strokeOpacity: 0.3,
                        strokeWeight: 2,
                      }}
                    />
                  </>
                )}

                {/* InfoWindow para alertas seleccionadas */}
                {selectedAlert && (
                  <InfoWindow
                    position={{
                      lat: (selectedAlert.territory?.coordinates as any).lat,
                      lng: (selectedAlert.territory?.coordinates as any).lng
                    }}
                    onCloseClick={() => setSelectedAlert(null)}
                  >
                    <div className="p-3 max-w-xs">
                      <h3 className="font-bold text-gray-900 mb-2">{selectedAlert.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{selectedAlert.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge className={getAlertTypeColor(selectedAlert.type)}>
                          {selectedAlert.type}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <CircleIcon className={`w-3 h-3 ${getAlertPriorityColor(selectedAlert.priority)}`} />
                          <span className="text-xs text-gray-500">
                            {selectedAlert.territory?.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </LoadScript>
          </CardContent>
        </Card>

        {/* Lista de Propuestas Mejorada */}
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
            <CardTitle className="text-xl">
              🎯 Propuestas Activas en tu Área
            </CardTitle>
            <p className="text-green-100">
              {userLocation 
                ? `Mostrando ${filteredAlerts.length} propuestas en un radio de ${radiusFilter/1000}km`
                : `Mostrando todas las ${alerts.length} propuestas disponibles`
              }
            </p>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600 text-lg">Cargando propuestas...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAlerts.map((alert) => (
                  <Card key={alert.id} className="border-2 hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer bg-gradient-to-br from-white to-gray-50">
                    <CardContent className="p-5">
                      <div className="space-y-3">
                        <h3 className="font-bold text-gray-900 text-lg leading-tight">{alert.title}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{alert.description}</p>
                        <div className="flex items-center justify-between pt-2">
                          <Badge className={`${getAlertTypeColor(alert.type)} font-medium`}>
                            {alert.type === 'social' ? 'Social' : 
                             alert.type === 'security' ? 'Seguridad' :
                             alert.type === 'logistics' ? 'Servicios' : 'Político'}
                          </Badge>
                          <div className="flex items-center gap-2">
                            <CircleIcon className={`w-4 h-4 ${getAlertPriorityColor(alert.priority)}`} />
                            <span className="text-xs text-gray-500 font-medium">
                              {alert.territory?.name}
                            </span>
                          </div>
                        </div>
                        {userLocation && alert.territory?.coordinates && (
                          <div className="text-xs text-blue-600 font-medium">
                            📍 {(calculateDistance(
                              userLocation.lat, 
                              userLocation.lng,
                              (alert.territory.coordinates as any).lat,
                              (alert.territory.coordinates as any).lng
                            ) / 1000).toFixed(1)} km de tu ubicación
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* CTA Final para visitantes */}
        {(!isAuthenticated || user?.role === 'visitante') && (
          <Card className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white shadow-2xl border-0">
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl font-bold mb-4">
                🚀 ¿Te Gustaron Nuestras Propuestas?
              </h2>
              <p className="text-xl mb-6 opacity-90">
                Únete a miles de vecinos que ya apoyan nuestro proyecto de transformación comunitaria
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => navigate('/candidato-funnel')}
                  size="lg"
                  className="bg-white text-orange-600 hover:bg-gray-100 font-bold shadow-lg"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Registrarme como Partidario
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-2 border-white text-white hover:bg-white/10 font-bold"
                >
                  <Eye className="w-5 h-5 mr-2" />
                  Seguir Explorando
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MapaAlertas;
