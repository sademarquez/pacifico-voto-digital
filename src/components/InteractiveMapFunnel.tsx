
/*
 * Copyright © 2025 sademarquezDLL. Todos los derechos reservados.
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  MapPin, 
  AlertTriangle, 
  Users, 
  Vote,
  Navigation,
  Zap,
  Globe,
  Sparkles,
  TrendingUp,
  ZoomIn,
  ZoomOut,
  MapIcon,
  Target,
  Trophy,
  Phone,
  MessageCircle
} from 'lucide-react';
import { geminiService } from '@/services/geminiService';

interface MapLevel {
  id: string;
  name: string;
  type: 'ciudad' | 'localidad' | 'barrio';
  coordinates: { lat: number; lng: number };
  population: number;
  alerts: Alert[];
  children?: MapLevel[];
  parent?: string;
}

interface Alert {
  id: string;
  title: string;
  description: string;
  type: 'opportunity' | 'campaign' | 'issue' | 'event';
  priority: 'low' | 'medium' | 'high';
  coordinates: { lat: number; lng: number };
  visible_to: string[];
  created_at: string;
  gemini_insight?: string;
}

interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
}

interface VoterProfile {
  nombre?: string;
  age_range?: string;
  political_interest?: string;
  engagement_level?: string;
  location?: string;
  contact_readiness?: string;
}

const InteractiveMapFunnel = () => {
  const [currentLevel, setCurrentLevel] = useState<MapLevel | null>(null);
  const [zoomLevel, setZoomLevel] = useState<'ciudad' | 'localidad' | 'barrio'>('ciudad');
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [leadData, setLeadData] = useState({
    sessionId: `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    engagementScore: 0,
    interactions: [] as string[]
  });
  const [geminiInsights, setGeminiInsights] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Mock hierarchical data for Colombia
  const mapHierarchy: MapLevel[] = [
    {
      id: 'bogota',
      name: 'Bogotá D.C.',
      type: 'ciudad',
      coordinates: { lat: 4.7110, lng: -74.0721 },
      population: 7412566,
      alerts: [
        {
          id: 'bg-1',
          title: 'Oportunidad Electoral Masiva',
          description: 'Gran concentración de votantes indecisos en zona norte',
          type: 'opportunity',
          priority: 'high',
          coordinates: { lat: 4.7500, lng: -74.0500 },
          visible_to: ['público', 'visitante'],
          created_at: new Date().toISOString(),
          gemini_insight: 'IA detecta 73% probabilidad de conversión en esta zona'
        }
      ],
      children: [
        {
          id: 'suba',
          name: 'Suba',
          type: 'localidad',
          coordinates: { lat: 4.7500, lng: -74.0500 },
          population: 1311102,
          alerts: [
            {
              id: 'sb-1',
              title: 'Evento Comunitario Activo',
              description: 'Reunión vecinal en curso - momento ideal para contacto',
              type: 'event',
              priority: 'medium',
              coordinates: { lat: 4.7500, lng: -74.0500 },
              visible_to: ['público'],
              created_at: new Date().toISOString()
            }
          ],
          parent: 'bogota',
          children: [
            {
              id: 'niza',
              name: 'La Niza',
              type: 'barrio',
              coordinates: { lat: 4.7600, lng: -74.0450 },
              population: 45000,
              alerts: [
                {
                  id: 'nz-1',
                  title: 'Alta Concentración Demográfica',
                  description: 'Perfil socioeconómico ideal para propuestas educativas',
                  type: 'opportunity',
                  priority: 'high',
                  coordinates: { lat: 4.7600, lng: -74.0450 },
                  visible_to: ['público'],
                  created_at: new Date().toISOString(),
                  gemini_insight: 'Zona de profesionales jóvenes, alta receptividad a innovación'
                }
              ],
              parent: 'suba'
            }
          ]
        },
        {
          id: 'chapinero',
          name: 'Chapinero',
          type: 'localidad',
          coordinates: { lat: 4.6700, lng: -74.0600 },
          population: 139701,
          alerts: [],
          parent: 'bogota',
          children: [
            {
              id: 'zona-rosa',
              name: 'Zona Rosa',
              type: 'barrio',
              coordinates: { lat: 4.6650, lng: -74.0550 },
              population: 25000,
              alerts: [
                {
                  id: 'zr-1',
                  title: 'Sector Empresarial Activo',
                  description: 'Alto tráfico de profesionales y empresarios',
                  type: 'opportunity',
                  priority: 'medium',
                  coordinates: { lat: 4.6650, lng: -74.0550 },
                  visible_to: ['público'],
                  created_at: new Date().toISOString()
                }
              ],
              parent: 'chapinero'
            }
          ]
        }
      ]
    }
  ];

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
          captureInteraction('location_granted');
        },
        (error) => {
          console.log('Geolocation error:', error);
          // Default to Bogotá
          setCurrentLevel(mapHierarchy[0]);
        }
      );
    }
  }, []);

  // Auto-select closest location based on user coordinates
  useEffect(() => {
    if (userLocation && !currentLevel) {
      // Find closest city/area
      const bogota = mapHierarchy[0];
      setCurrentLevel(bogota);
      captureInteraction('auto_location_detected');
    }
  }, [userLocation, currentLevel]);

  const captureInteraction = async (type: string, data: any = {}) => {
    const voterProfile: VoterProfile = {
      nombre: 'Visitante',
      age_range: '25-54',
      political_interest: 'high',
      engagement_level: leadData.engagementScore > 50 ? 'high' : 'medium',
      location: currentLevel?.name,
      contact_readiness: leadData.engagementScore > 70 ? 'high' : 'medium'
    };

    const newInteraction = {
      type,
      timestamp: new Date().toISOString(),
      data: {
        currentLevel: currentLevel?.name,
        zoomLevel,
        userLocation: userLocation ? 'granted' : 'denied',
        voterProfile,
        ...data
      }
    };

    setLeadData(prev => ({
      ...prev,
      engagementScore: Math.min(prev.engagementScore + 5, 100),
      interactions: [...prev.interactions, type]
    }));

    console.log('🎯 Map Interaction:', newInteraction);

    // Trigger Gemini analysis for meaningful interactions
    if (['zoom_in', 'alert_click', 'location_change'].includes(type)) {
      await analyzeWithGemini(type, newInteraction);
    }
  };

  const analyzeWithGemini = async (interactionType: string, interactionData: any) => {
    setIsAnalyzing(true);
    try {
      const voterProfile: VoterProfile = {
        nombre: 'Visitante',
        location: currentLevel?.name || 'No definida'
      };

      const insight = await geminiService.generateWelcomeMessage(voterProfile);
      setGeminiInsights(insight);
      
      console.log('🤖 Gemini Analysis:', insight);
    } catch (error) {
      console.error('Error analyzing with Gemini:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleZoomIn = () => {
    if (zoomLevel === 'ciudad' && currentLevel?.children) {
      setZoomLevel('localidad');
      captureInteraction('zoom_in', { from: 'ciudad', to: 'localidad' });
    } else if (zoomLevel === 'localidad' && currentLevel?.children) {
      setZoomLevel('barrio');
      captureInteraction('zoom_in', { from: 'localidad', to: 'barrio' });
    }
  };

  const handleZoomOut = () => {
    if (zoomLevel === 'barrio') {
      setZoomLevel('localidad');
      captureInteraction('zoom_out', { from: 'barrio', to: 'localidad' });
    } else if (zoomLevel === 'localidad') {
      setZoomLevel('ciudad');
      captureInteraction('zoom_out', { from: 'localidad', to: 'ciudad' });
    }
  };

  const handleLocationSelect = (location: MapLevel) => {
    setCurrentLevel(location);
    captureInteraction('location_change', { 
      new_location: location.name, 
      type: location.type 
    });
  };

  const handleAlertClick = (alert: Alert) => {
    setSelectedAlert(alert);
    captureInteraction('alert_click', { 
      alert_id: alert.id, 
      alert_type: alert.type, 
      priority: alert.priority 
    });
  };

  const getVisibleLocations = () => {
    if (!currentLevel) return [];
    
    if (zoomLevel === 'ciudad') {
      return mapHierarchy;
    } else if (zoomLevel === 'localidad' && currentLevel.children) {
      return currentLevel.children;
    } else if (zoomLevel === 'barrio' && currentLevel.children) {
      return currentLevel.children;
    }
    
    return [currentLevel];
  };

  const getVisibleAlerts = () => {
    if (!currentLevel) return [];
    
    const locations = getVisibleLocations();
    return locations.reduce((alerts: Alert[], location) => {
      return [...alerts, ...location.alerts];
    }, []);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4">
      {/* Header with Location Status */}
      <div className="relative bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 rounded-2xl p-6 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"4\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
        }}></div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                <MapIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Mapa Electoral Inteligente</h1>
                <p className="opacity-90">
                  {currentLevel ? `📍 ${currentLevel.name}` : 'Detectando tu ubicación...'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge className="bg-white/20 text-white">
                <TrendingUp className="w-4 h-4 mr-1" />
                {leadData.engagementScore}% Engagement
              </Badge>
              <Badge className="bg-white/20 text-white">
                <Sparkles className="w-4 h-4 mr-1" />
                Gemini IA
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Interactive Map */}
        <div className="lg:col-span-3">
          <Card className="shadow-2xl border-2 border-blue-200">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  Vista: {zoomLevel.charAt(0).toUpperCase() + zoomLevel.slice(1)}
                </CardTitle>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={handleZoomOut}
                    disabled={zoomLevel === 'ciudad'}
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={handleZoomIn}
                    disabled={zoomLevel === 'barrio' || !currentLevel?.children}
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              {/* Interactive Map Visualization */}
              <div className="relative bg-gradient-to-br from-blue-100 via-green-50 to-blue-50 rounded-xl border-2 border-blue-200 min-h-[400px] overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
                    {Array.from({ length: 48 }).map((_, i) => (
                      <div key={i} className="border border-blue-300"></div>
                    ))}
                  </div>
                </div>

                {/* Location Markers */}
                <div className="relative z-10 h-full p-6">
                  <div className="grid grid-cols-3 gap-4 h-full">
                    {getVisibleLocations().map((location, index) => (
                      <div
                        key={location.id}
                        className={`relative rounded-lg p-4 cursor-pointer transition-all duration-300 border-2 ${
                          currentLevel?.id === location.id
                            ? 'bg-blue-600 text-white border-blue-800 shadow-2xl scale-105'
                            : 'bg-white/90 hover:bg-blue-50 border-blue-300 hover:border-blue-500 hover:scale-102'
                        }`}
                        onClick={() => handleLocationSelect(location)}
                        style={{
                          gridColumn: Math.floor(index % 3) + 1,
                          gridRow: Math.floor(index / 3) + 1
                        }}
                      >
                        <div className="text-center">
                          <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
                            currentLevel?.id === location.id ? 'bg-white/20' : 'bg-blue-600'
                          }`}>
                            <MapPin className={`w-4 h-4 ${
                              currentLevel?.id === location.id ? 'text-white' : 'text-white'
                            }`} />
                          </div>
                          
                          <h4 className="font-bold text-sm mb-1">{location.name}</h4>
                          <p className="text-xs opacity-75 capitalize">{location.type}</p>
                          <p className="text-xs opacity-75">{location.population.toLocaleString()}</p>
                          
                          {/* Alert indicators */}
                          {location.alerts.length > 0 && (
                            <div className="absolute -top-2 -right-2">
                              <Badge className="bg-red-500 text-white text-xs animate-pulse">
                                {location.alerts.length}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* User location indicator if available */}
                  {userLocation && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs animate-pulse">
                      📍 Tu ubicación detectada
                    </div>
                  )}
                </div>
              </div>

              {/* Current Level Info */}
              {currentLevel && (
                <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-blue-900">{currentLevel.name}</h3>
                      <p className="text-blue-700 capitalize">
                        {currentLevel.type} • {currentLevel.population.toLocaleString()} habitantes
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className="bg-blue-100 text-blue-800">
                        {currentLevel.alerts.length} alertas
                      </Badge>
                      {currentLevel.children && (
                        <Badge className="bg-green-100 text-green-800">
                          {currentLevel.children.length} sub-zonas
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar with Alerts and Gemini Insights */}
        <div className="space-y-6">
          {/* Gemini AI Insights */}
          <Card className="border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-800">
                <Sparkles className="w-5 h-5" />
                Análisis IA
                {isAnalyzing && (
                  <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {geminiInsights ? (
                <div className="bg-white/60 p-3 rounded-lg border border-purple-200">
                  <p className="text-sm text-purple-900">{geminiInsights}</p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <Zap className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <p className="text-sm text-purple-600">
                    Interactúa con el mapa para obtener insights de IA
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active Alerts */}
          <Card className="border-2 border-orange-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <AlertTriangle className="w-5 h-5" />
                Alertas Activas
                <Badge className="bg-orange-100 text-orange-800 ml-auto">
                  {getVisibleAlerts().length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="max-h-80 overflow-y-auto space-y-3">
              {getVisibleAlerts().length === 0 ? (
                <div className="text-center py-8">
                  <Trophy className="w-12 h-12 text-orange-400 mx-auto mb-3" />
                  <p className="text-orange-600">¡Zona sin alertas!</p>
                  <p className="text-sm text-orange-500">Perfecto para nuevas oportunidades</p>
                </div>
              ) : (
                getVisibleAlerts().map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedAlert?.id === alert.id
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-orange-200 bg-white hover:border-orange-400'
                    }`}
                    onClick={() => handleAlertClick(alert)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-sm text-gray-900">{alert.title}</h4>
                      <Badge className={`text-xs ${
                        alert.priority === 'high' ? 'bg-red-100 text-red-800' :
                        alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {alert.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{alert.description}</p>
                    {alert.gemini_insight && (
                      <div className="bg-purple-50 p-2 rounded text-xs text-purple-800 border border-purple-200">
                        🤖 {alert.gemini_insight}
                      </div>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Target className="w-5 h-5" />
                Acciones Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={() => captureInteraction('contact_request', { method: 'whatsapp' })}
              >
                <Phone className="w-4 h-4 mr-2" />
                Contactar WhatsApp
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full border-green-600 text-green-600 hover:bg-green-50"
                onClick={() => captureInteraction('info_request')}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Solicitar Información
              </Button>
              
              <div className="text-center text-xs text-green-600 mt-3">
                💡 Basado en tu ubicación y engagement
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMapFunnel;
