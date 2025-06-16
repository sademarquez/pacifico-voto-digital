
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSecureAuth } from '@/contexts/SecureAuthContext';
import { 
  MapPin, 
  Users, 
  TrendingUp, 
  Target,
  Eye,
  MessageCircle,
  Share2,
  Zap,
  Filter,
  Search,
  Maximize2
} from 'lucide-react';

interface MapData {
  id: string;
  lat: number;
  lng: number;
  title: string;
  type: 'voter' | 'leader' | 'event' | 'zone';
  status: 'active' | 'pending' | 'completed';
  engagement: number;
  participants?: number;
}

const ModernInteractiveMap = () => {
  const { user } = useSecureAuth();
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [hoveredPoint, setHoveredPoint] = useState<MapData | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Datos simulados para demostración
  const mapData: MapData[] = [
    { id: '1', lat: 4.7110, lng: -74.0721, title: 'Centro de Bogotá', type: 'zone', status: 'active', engagement: 85, participants: 1250 },
    { id: '2', lat: 4.6890, lng: -74.0460, title: 'Chapinero', type: 'zone', status: 'active', engagement: 92, participants: 890 },
    { id: '3', lat: 4.6780, lng: -74.0830, title: 'Zona Rosa', type: 'event', status: 'pending', engagement: 78, participants: 450 },
    { id: '4', lat: 4.7200, lng: -74.0500, title: 'Líder Comunitario', type: 'leader', status: 'active', engagement: 96 },
    { id: '5', lat: 4.6950, lng: -74.0650, title: 'Votante Activo', type: 'voter', status: 'completed', engagement: 88 }
  ];

  const getPointColor = (point: MapData) => {
    switch (point.type) {
      case 'zone': return 'bg-blue-500';
      case 'leader': return 'bg-emerald-500';
      case 'event': return 'bg-purple-500';
      case 'voter': return 'bg-amber-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filterOptions = [
    { id: 'all', label: 'Todos', icon: Eye },
    { id: 'zone', label: 'Zonas', icon: MapPin },
    { id: 'leader', label: 'Líderes', icon: Users },
    { id: 'event', label: 'Eventos', icon: Target },
    { id: 'voter', label: 'Votantes', icon: MessageCircle }
  ];

  const filteredData = selectedFilter === 'all' 
    ? mapData 
    : mapData.filter(point => point.type === selectedFilter);

  return (
    <div className={`space-y-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-black bg-opacity-90 p-4' : ''}`}>
      {/* Header Interactivo */}
      <Card className="modern-glass-card animate-slide-elegant">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center animate-pulse-glow">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-gradient-primary text-xl">
                  Mapa Interactivo de Campaña
                </CardTitle>
                <p className="text-sm opacity-75">
                  Vista en tiempo real • {filteredData.length} puntos activos
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="modern-interactive-button text-xs"
              >
                <Maximize2 className="w-4 h-4 mr-1" />
                {isFullscreen ? 'Minimizar' : 'Pantalla Completa'}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Filtros Interactivos */}
      <Card className="modern-glass-card">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {filterOptions.map((filter) => {
              const Icon = filter.icon;
              const isActive = selectedFilter === filter.id;
              return (
                <Button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`modern-interactive-button transition-all duration-300 ${
                    isActive 
                      ? 'bg-gradient-primary text-white shadow-lg' 
                      : 'bg-white bg-opacity-80 text-gray-700 hover:bg-opacity-100'
                  }`}
                  size="sm"
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {filter.label}
                  {isActive && (
                    <Badge className="ml-2 bg-white bg-opacity-30 text-white">
                      {filter.id === 'all' ? mapData.length : mapData.filter(p => p.type === filter.id).length}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Mapa Principal */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="modern-glass-card h-96 md:h-[500px]">
            <CardContent className="p-0 relative h-full">
              {/* Simulación de mapa interactivo */}
              <div 
                ref={mapRef}
                className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg relative overflow-hidden"
                style={{
                  backgroundImage: `
                    radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                    radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
                    radial-gradient(circle at 40% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)
                  `
                }}
              >
                {/* Puntos interactivos en el mapa */}
                {filteredData.map((point, index) => (
                  <div
                    key={point.id}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-125 animate-float`}
                    style={{
                      left: `${(point.lng + 74.1) * 1000}%`,
                      top: `${(4.8 - point.lat) * 1000}%`,
                      animationDelay: `${index * 0.2}s`
                    }}
                    onMouseEnter={() => setHoveredPoint(point)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  >
                    <div className={`w-4 h-4 rounded-full ${getPointColor(point)} shadow-lg animate-pulse-glow`}>
                      <div className="absolute inset-0 rounded-full bg-white bg-opacity-50 animate-ping"></div>
                    </div>
                    {hoveredPoint?.id === point.id && (
                      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-95 backdrop-blur-sm rounded-lg p-3 shadow-xl z-10 min-w-48 animate-slide-elegant">
                        <h4 className="font-semibold text-gray-900">{point.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getStatusColor(point.status)}>
                            {point.status}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            {point.engagement}% engagement
                          </span>
                        </div>
                        {point.participants && (
                          <div className="flex items-center gap-1 mt-2 text-sm text-gray-600">
                            <Users className="w-3 h-3" />
                            <span>{point.participants} participantes</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {/* Conexiones entre puntos */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {filteredData.map((point, index) => {
                    const nextPoint = filteredData[index + 1];
                    if (!nextPoint) return null;
                    return (
                      <line
                        key={`connection-${point.id}-${nextPoint.id}`}
                        x1={`${(point.lng + 74.1) * 1000}%`}
                        y1={`${(4.8 - point.lat) * 1000}%`}
                        x2={`${(nextPoint.lng + 74.1) * 1000}%`}
                        y2={`${(4.8 - nextPoint.lat) * 1000}%`}
                        stroke="rgba(59, 130, 246, 0.3)"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                        className="animate-pulse"
                      />
                    );
                  })}
                </svg>
              </div>

              {/* Controles del mapa */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <Button size="sm" className="modern-interactive-button w-8 h-8 p-0">+</Button>
                <Button size="sm" className="modern-interactive-button w-8 h-8 p-0">-</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Panel de estadísticas */}
        <div className="space-y-4">
          <Card className="modern-glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                Métricas en Vivo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-gradient-surface rounded-lg">
                  <div className="text-2xl font-bold text-gradient-primary">
                    {mapData.reduce((sum, p) => sum + (p.participants || 0), 0)}
                  </div>
                  <div className="text-xs opacity-70">Total Participantes</div>
                </div>
                <div className="text-center p-3 bg-gradient-surface rounded-lg">
                  <div className="text-2xl font-bold text-gradient-primary">
                    {Math.round(mapData.reduce((sum, p) => sum + p.engagement, 0) / mapData.length)}%
                  </div>
                  <div className="text-xs opacity-70">Engagement Promedio</div>
                </div>
              </div>

              <div className="space-y-2">
                {mapData.slice(0, 3).map((point) => (
                  <div key={point.id} className="flex items-center justify-between p-2 bg-white bg-opacity-50 rounded-md">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getPointColor(point)}`}></div>
                      <span className="text-sm font-medium truncate">{point.title}</span>
                    </div>
                    <span className="text-xs font-semibold text-emerald-600">
                      {point.engagement}%
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button size="sm" className="modern-interactive-button flex-1">
                  <Share2 className="w-3 h-3 mr-1" />
                  Compartir
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Filter className="w-3 h-3 mr-1" />
                  Filtrar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Acciones rápidas */}
          <Card className="modern-glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                Acciones Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full modern-interactive-button justify-start">
                <MapPin className="w-4 h-4 mr-2" />
                Crear Nueva Zona
              </Button>
              <Button className="w-full modern-interactive-button justify-start">
                <Users className="w-4 h-4 mr-2" />
                Asignar Líder
              </Button>
              <Button className="w-full modern-interactive-button justify-start">
                <Target className="w-4 h-4 mr-2" />
                Programar Evento
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ModernInteractiveMap;
