import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSimpleAuth } from "../contexts/SimpleAuthContext";
import { 
  MapPin, 
  Users, 
  Target, 
  Zap, 
  TrendingUp, 
  MessageCircle, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Globe,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Layers,
  Eye,
  EyeOff,
  BarChart3,
  RefreshCw
} from "lucide-react";
import { geminiMCPService } from "../services/geminiMCPService";
import { geminiService } from "../services/geminiService";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Tipos para el controlador de mapa
interface MapLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'voter' | 'event' | 'alert' | 'territory';
  status?: 'active' | 'inactive' | 'pending';
  metrics?: {
    engagement: number;
    conversion: number;
    potential: number;
  };
  details?: {
    population?: number;
    registeredVoters?: number;
    supportLevel?: number;
    lastActivity?: string;
  };
}

interface MapFilter {
  type: string[];
  status: string[];
  engagement: [number, number];
  potential: [number, number];
}

interface MapAnalytics {
  totalLocations: number;
  activeVoters: number;
  pendingEvents: number;
  alertsCount: number;
  conversionRate: string;
  engagementScore: string;
}

interface MapSettings {
  showHeatmap: boolean;
  showClusters: boolean;
  showLabels: boolean;
  showMetrics: boolean;
  refreshInterval: number;
  zoomLevel: number;
}

const GeminiMCPMapController = () => {
  const { user } = useSimpleAuth();
  const { toast } = useToast();
  const mapRef = useRef<any>(null);
  
  // Estados para el controlador
  const [locations, setLocations] = useState<MapLocation[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<MapLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [filters, setFilters] = useState<MapFilter>({
    type: ['voter', 'event', 'alert', 'territory'],
    status: ['active', 'inactive', 'pending'],
    engagement: [0, 100],
    potential: [0, 100]
  });
  const [analytics, setAnalytics] = useState<MapAnalytics>({
    totalLocations: 0,
    activeVoters: 0,
    pendingEvents: 0,
    alertsCount: 0,
    conversionRate: '0%',
    engagementScore: '0%'
  });
  const [settings, setSettings] = useState<MapSettings>({
    showHeatmap: true,
    showClusters: true,
    showLabels: false,
    showMetrics: true,
    refreshInterval: 30,
    zoomLevel: 12
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState('map');
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Cargar datos iniciales
  useEffect(() => {
    loadMapData();
    initializeAI();
    
    // Simular progreso de carga
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        const next = prev + 5;
        if (next >= 100) {
          clearInterval(interval);
          return 100;
        }
        return next;
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, []);

  // Filtrar ubicaciones cuando cambian los filtros
  useEffect(() => {
    if (locations.length > 0) {
      filterLocations();
    }
  }, [filters, locations, searchQuery]);

  // Inicializar IA
  const initializeAI = async () => {
    try {
      const initResult = await geminiMCPService.initialize();
      
      if (initResult.success) {
        toast({
          title: "IA Inicializada",
          description: "Gemini MCP conectado correctamente",
        });
        
        // Generar insights iniciales
        generateMapInsights();
      } else {
        toast({
          title: "Error de Inicialización",
          description: initResult.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error inicializando IA:", error);
      toast({
        title: "Error de Conexión",
        description: "No se pudo conectar con Gemini MCP",
        variant: "destructive"
      });
    }
  };

  // Cargar datos del mapa
  const loadMapData = async () => {
    setIsLoading(true);
    
    try {
      // Simular carga de datos
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Datos de ejemplo
      const mockLocations: MapLocation[] = [
        {
          id: '1',
          name: 'Centro Comunitario Norte',
          lat: 19.4326,
          lng: -99.1332,
          type: 'event',
          status: 'active',
          metrics: {
            engagement: 85,
            conversion: 72,
            potential: 90
          },
          details: {
            population: 1200,
            registeredVoters: 850,
            supportLevel: 75,
            lastActivity: '2025-05-15'
          }
        },
        {
          id: '2',
          name: 'Zona Residencial Este',
          lat: 19.4361,
          lng: -99.1300,
          type: 'territory',
          status: 'active',
          metrics: {
            engagement: 65,
            conversion: 58,
            potential: 80
          },
          details: {
            population: 3500,
            registeredVoters: 2100,
            supportLevel: 62,
            lastActivity: '2025-05-12'
          }
        },
        {
          id: '3',
          name: 'Plaza Central',
          lat: 19.4338,
          lng: -99.1365,
          type: 'alert',
          status: 'pending',
          metrics: {
            engagement: 90,
            conversion: 45,
            potential: 95
          },
          details: {
            population: 5000,
            registeredVoters: 3200,
            supportLevel: 40,
            lastActivity: '2025-05-16'
          }
        },
        {
          id: '4',
          name: 'Coordinador Juan Pérez',
          lat: 19.4310,
          lng: -99.1340,
          type: 'voter',
          status: 'active',
          metrics: {
            engagement: 95,
            conversion: 85,
            potential: 90
          },
          details: {
            supportLevel: 95,
            lastActivity: '2025-05-17'
          }
        },
        {
          id: '5',
          name: 'Escuela Primaria Sur',
          lat: 19.4290,
          lng: -99.1350,
          type: 'event',
          status: 'inactive',
          metrics: {
            engagement: 40,
            conversion: 30,
            potential: 75
          },
          details: {
            population: 800,
            registeredVoters: 450,
            supportLevel: 35,
            lastActivity: '2025-04-20'
          }
        }
      ];
      
      setLocations(mockLocations);
      
      // Calcular analíticas
      const analytics: MapAnalytics = {
        totalLocations: mockLocations.length,
        activeVoters: mockLocations.filter(l => l.type === 'voter' && l.status === 'active').length,
        pendingEvents: mockLocations.filter(l => l.type === 'event' && l.status === 'pending').length,
        alertsCount: mockLocations.filter(l => l.type === 'alert').length,
        conversionRate: '68%',
        engagementScore: '75%'
      };
      
      setAnalytics(analytics);
      
    } catch (error) {
      console.error("Error cargando datos del mapa:", error);
      toast({
        title: "Error de Carga",
        description: "No se pudieron cargar los datos del mapa",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar ubicaciones
  const filterLocations = () => {
    const filtered = locations.filter(location => {
      // Filtrar por tipo
      if (!filters.type.includes(location.type)) return false;
      
      // Filtrar por estado
      if (location.status && !filters.status.includes(location.status)) return false;
      
      // Filtrar por engagement
      if (
        location.metrics && 
        (location.metrics.engagement < filters.engagement[0] || 
         location.metrics.engagement > filters.engagement[1])
      ) return false;
      
      // Filtrar por potencial
      if (
        location.metrics && 
        (location.metrics.potential < filters.potential[0] || 
         location.metrics.potential > filters.potential[1])
      ) return false;
      
      // Filtrar por búsqueda
      if (
        searchQuery && 
        !location.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) return false;
      
      return true;
    });
    
    setFilteredLocations(filtered);
  };

  // Generar insights con IA
  const generateMapInsights = async () => {
    try {
      // Simular análisis de IA
      setIsLoading(true);
      
      const territoryData = {
        territory: "Zona Metropolitana",
        demographics: {
          ageGroups: {
            "18-25": 22,
            "26-40": 35,
            "41-60": 28,
            "60+": 15
          },
          education: {
            "basic": 30,
            "high_school": 40,
            "university": 25,
            "postgrad": 5
          }
        },
        historicalData: {
          previousElections: {
            "2021": {
              participation: 65,
              results: {
                "party_a": 45,
                "party_b": 35,
                "others": 20
              }
            }
          }
        },
        currentTrends: {
          issues: ["seguridad", "economía", "educación"],
          sentiment: {
            "positive": 45,
            "neutral": 30,
            "negative": 25
          }
        }
      };
      
      const analysis = await geminiMCPService.analyzeElectoralData(territoryData);
      
      setAiInsights([
        ...analysis.insights,
        ...analysis.recommendations
      ]);
      
      toast({
        title: "Análisis Completado",
        description: "Nuevos insights disponibles",
      });
    } catch (error) {
      console.error("Error generando insights:", error);
      
      // Fallback a insights estáticos
      setAiInsights([
        "📈 Alto potencial de crecimiento en segmento joven (18-35 años)",
        "🎯 Zona urbana muestra 67% de intención de voto favorable",
        "📱 85% de votantes activos en redes sociales",
        "⚡ Horario óptimo de contacto: 7-9 PM con 86% engagement"
      ]);
      
      toast({
        title: "Análisis Local",
        description: "Usando datos de respaldo",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Optimizar mensaje con IA
  const optimizeMessage = async (message: string) => {
    try {
      const result = await geminiMCPService.optimizeElectoralMessage({
        originalMessage: message,
        targetAudience: "votantes indecisos",
        channel: "whatsapp",
        objectives: ["aumentar participación", "generar confianza"]
      });
      
      toast({
        title: "Mensaje Optimizado",
        description: "Mensaje mejorado con IA",
      });
      
      return result.optimizedMessage;
    } catch (error) {
      console.error("Error optimizando mensaje:", error);
      toast({
        title: "Error de Optimización",
        description: "No se pudo optimizar el mensaje",
        variant: "destructive"
      });
      return message;
    }
  };

  // Actualizar filtros
  const updateFilter = (key: keyof MapFilter, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Actualizar configuración
  const updateSetting = (key: keyof MapSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Seleccionar ubicación
  const handleSelectLocation = (location: MapLocation) => {
    setSelectedLocation(location);
    
    // Aquí se actualizaría el mapa para centrar en la ubicación
    if (mapRef.current) {
      // mapRef.current.setCenter({ lat: location.lat, lng: location.lng });
      console.log("Centrando mapa en:", location.name);
    }
  };

  // Refrescar datos
  const handleRefresh = () => {
    loadMapData();
    generateMapInsights();
    
    toast({
      title: "Datos Actualizados",
      description: "Información del mapa actualizada",
    });
  };

  // Renderizar tipo de ubicación
  const renderLocationType = (type: string) => {
    switch (type) {
      case 'voter':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Votante</Badge>;
      case 'event':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Evento</Badge>;
      case 'alert':
        return <Badge className="bg-red-100 text-red-800 border-red-300">Alerta</Badge>;
      case 'territory':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-300">Territorio</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  // Renderizar estado
  const renderStatus = (status?: string) => {
    if (!status) return null;
    
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Activo</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-300">Inactivo</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Pendiente</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Cabecera del controlador */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Globe className="w-6 h-6 text-blue-600" />
            Controlador de Mapa Electoral
          </h2>
          <p className="text-gray-600">
            Gestión avanzada de territorios con IA Gemini
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1"
          >
            <Filter className="w-4 h-4" />
            Filtros
            {showFilters ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-1"
          >
            <Layers className="w-4 h-4" />
            Capas
            {showSettings ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </Button>
          
          <Button
            variant="default"
            size="sm"
            onClick={handleRefresh}
            className="flex items-center gap-1"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </div>
      
      {/* Barra de búsqueda */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Buscar ubicaciones..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* Panel de filtros */}
      {showFilters && (
        <Card className="border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Filter className="w-4 h-4 text-blue-600" />
              Filtros Avanzados
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label className="text-xs font-medium mb-1 block">Tipo</Label>
                <Select
                  value={filters.type.join(',')}
                  onValueChange={(value) => updateFilter('type', value.split(','))}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Seleccionar tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="voter,event,alert,territory">Todos</SelectItem>
                    <SelectItem value="voter">Solo Votantes</SelectItem>
                    <SelectItem value="event">Solo Eventos</SelectItem>
                    <SelectItem value="alert">Solo Alertas</SelectItem>
                    <SelectItem value="territory">Solo Territorios</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-xs font-medium mb-1 block">Estado</Label>
                <Select
                  value={filters.status.join(',')}
                  onValueChange={(value) => updateFilter('status', value.split(','))}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Seleccionar estados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active,inactive,pending">Todos</SelectItem>
                    <SelectItem value="active">Solo Activos</SelectItem>
                    <SelectItem value="inactive">Solo Inactivos</SelectItem>
                    <SelectItem value="pending">Solo Pendientes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-xs font-medium mb-1 block">
                  Engagement: {filters.engagement[0]}% - {filters.engagement[1]}%
                </Label>
                <Slider
                  value={filters.engagement}
                  min={0}
                  max={100}
                  step={5}
                  onValueChange={(value) => updateFilter('engagement', value)}
                  className="py-2"
                />
              </div>
              
              <div>
                <Label className="text-xs font-medium mb-1 block">
                  Potencial: {filters.potential[0]}% - {filters.potential[1]}%
                </Label>
                <Slider
                  value={filters.potential}
                  min={0}
                  max={100}
                  step={5}
                  onValueChange={(value) => updateFilter('potential', value)}
                  className="py-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Panel de configuración */}
      {showSettings && (
        <Card className="border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-600" />
              Configuración de Capas
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="show-heatmap" className="text-xs font-medium cursor-pointer">
                  Mapa de Calor
                </Label>
                <Switch
                  id="show-heatmap"
                  checked={settings.showHeatmap}
                  onCheckedChange={(checked) => updateSetting('showHeatmap', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="show-clusters" className="text-xs font-medium cursor-pointer">
                  Agrupaciones
                </Label>
                <Switch
                  id="show-clusters"
                  checked={settings.showClusters}
                  onCheckedChange={(checked) => updateSetting('showClusters', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="show-labels" className="text-xs font-medium cursor-pointer">
                  Etiquetas
                </Label>
                <Switch
                  id="show-labels"
                  checked={settings.showLabels}
                  onCheckedChange={(checked) => updateSetting('showLabels', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="show-metrics" className="text-xs font-medium cursor-pointer">
                  Métricas
                </Label>
                <Switch
                  id="show-metrics"
                  checked={settings.showMetrics}
                  onCheckedChange={(checked) => updateSetting('showMetrics', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Panel izquierdo - Lista de ubicaciones */}
        <Card className="lg:col-span-1 border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                Ubicaciones ({filteredLocations.length})
              </div>
              <Badge variant="outline" className="text-xs">
                {isLoading ? 'Cargando...' : `${filteredLocations.length} de ${locations.length}`}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4">
                <Progress value={loadingProgress} className="h-2 mb-2" />
                <p className="text-xs text-center text-gray-500">Cargando ubicaciones...</p>
              </div>
            ) : filteredLocations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No se encontraron ubicaciones</p>
                <p className="text-xs mt-1">Intenta con otros filtros</p>
              </div>
            ) : (
              <div className="max-h-[400px] overflow-y-auto">
                {filteredLocations.map((location) => (
                  <div
                    key={location.id}
                    className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                      selectedLocation?.id === location.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => handleSelectLocation(location)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-sm">{location.name}</h3>
                        <div className="flex items-center gap-1 mt-1">
                          {renderLocationType(location.type)}
                          {location.status && renderStatus(location.status)}
                        </div>
                      </div>
                      {location.metrics && (
                        <div className="text-right">
                          <span className="text-xs font-medium text-blue-600">
                            {location.metrics.engagement}%
                          </span>
                          <p className="text-xs text-gray-500">Engagement</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Panel central y derecho - Mapa y detalles */}
        <Card className="lg:col-span-2 border-gray-200">
          <CardHeader className="pb-2">
            <Tabs defaultValue="map" onValueChange={setActiveTab}>
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="map" className="text-xs">
                    <Globe className="w-3 h-3 mr-1" />
                    Mapa
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="text-xs">
                    <BarChart3 className="w-3 h-3 mr-1" />
                    Analíticas
                  </TabsTrigger>
                  <TabsTrigger value="insights" className="text-xs">
                    <Zap className="w-3 h-3 mr-1" />
                    IA Insights
                  </TabsTrigger>
                </TabsList>
                
                <Badge variant="outline" className="text-xs">
                  {activeTab === 'map' ? 'Vista Geográfica' : 
                   activeTab === 'analytics' ? 'Métricas' : 'Gemini AI'}
                </Badge>
              </div>
            </Tabs>
          </CardHeader>
          <CardContent className="p-0">
            <TabsContent value="map" className="m-0">
              <div className="relative">
                {/* Aquí iría el componente de mapa real */}
                <div className="h-[400px] bg-gray-100 flex items-center justify-center">
                  {isLoading ? (
                    <div className="text-center">
                      <RefreshCw className="w-8 h-8 mx-auto mb-2 text-blue-600 animate-spin" />
                      <p className="text-gray-600">Cargando mapa...</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Globe className="w-12 h-12 mx-auto mb-2 text-blue-600" />
                      <p className="text-gray-600">Mapa Electoral Interactivo</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {filteredLocations.length} ubicaciones visibles
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Controles del mapa */}
                <div className="absolute top-2 right-2 bg-white rounded-md shadow-sm border border-gray-200 p-1">
                  <div className="flex flex-col gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Layers className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Detalles de ubicación seleccionada */}
              {selectedLocation && (
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{selectedLocation.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {renderLocationType(selectedLocation.type)}
                        {selectedLocation.status && renderStatus(selectedLocation.status)}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Coordenadas: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="h-8 text-xs">
                        <Eye className="w-3 h-3 mr-1" />
                        Detalles
                      </Button>
                      <Button size="sm" className="h-8 text-xs bg-blue-600 hover:bg-blue-700">
                        <MessageCircle className="w-3 h-3 mr-1" />
                        Contactar
                      </Button>
                    </div>
                  </div>
                  
                  {selectedLocation.details && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      {selectedLocation.details.population && (
                        <div>
                          <p className="text-xs text-gray-500">Población</p>
                          <p className="font-medium">{selectedLocation.details.population.toLocaleString()}</p>
                        </div>
                      )}
                      
                      {selectedLocation.details.registeredVoters && (
                        <div>
                          <p className="text-xs text-gray-500">Votantes Registrados</p>
                          <p className="font-medium">{selectedLocation.details.registeredVoters.toLocaleString()}</p>
                        </div>
                      )}
                      
                      {selectedLocation.details.supportLevel && (
                        <div>
                          <p className="text-xs text-gray-500">Nivel de Apoyo</p>
                          <p className="font-medium">{selectedLocation.details.supportLevel}%</p>
                        </div>
                      )}
                      
                      {selectedLocation.details.lastActivity && (
                        <div>
                          <p className="text-xs text-gray-500">Última Actividad</p>
                          <p className="font-medium">{new Date(selectedLocation.details.lastActivity).toLocaleDateString()}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="analytics" className="m-0 p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <p className="text-xs text-blue-600 font-medium">Total Ubicaciones</p>
                  <p className="text-2xl font-bold text-blue-700">{analytics.totalLocations}</p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                  <p className="text-xs text-green-600 font-medium">Votantes Activos</p>
                  <p className="text-2xl font-bold text-green-700">{analytics.activeVoters}</p>
                </div>
                
                <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-100">
                  <p className="text-xs text-yellow-600 font-medium">Eventos Pendientes</p>
                  <p className="text-2xl font-bold text-yellow-700">{analytics.pendingEvents}</p>
                </div>
                
                <div className="bg-red-50 rounded-lg p-3 border border-red-100">
                  <p className="text-xs text-red-600 font-medium">Alertas</p>
                  <p className="text-2xl font-bold text-red-700">{analytics.alertsCount}</p>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
                  <p className="text-xs text-purple-600 font-medium">Tasa de Conversión</p>
                  <p className="text-2xl font-bold text-purple-700">{analytics.conversionRate}</p>
                </div>
                
                <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-100">
                  <p className="text-xs text-indigo-600 font-medium">Engagement</p>
                  <p className="text-2xl font-bold text-indigo-700">{analytics.engagementScore}</p>
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  Distribución por Tipo
                </h3>
                
                <div className="h-8 bg-gray-100 rounded-full overflow-hidden flex">
                  <div className="bg-blue-500 h-full" style={{ width: '40%' }}></div>
                  <div className="bg-green-500 h-full" style={{ width: '30%' }}></div>
                  <div className="bg-red-500 h-full" style={{ width: '10%' }}></div>
                  <div className="bg-purple-500 h-full" style={{ width: '20%' }}></div>
                </div>
                
                <div className="flex justify-between mt-2 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Votantes (40%)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Eventos (30%)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Alertas (10%)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Territorios (20%)</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  Engagement por Zona
                </h3>
                
                <div className="h-40 bg-gray-50 border border-gray-200 rounded-lg flex items-end justify-around p-2">
                  <div className="flex flex-col items-center">
                    <div className="bg-blue-500 w-8" style={{ height: '60%' }}></div>
                    <span className="text-xs mt-1">Norte</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="bg-blue-500 w-8" style={{ height: '80%' }}></div>
                    <span className="text-xs mt-1">Sur</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="bg-blue-500 w-8" style={{ height: '40%' }}></div>
                    <span className="text-xs mt-1">Este</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="bg-blue-500 w-8" style={{ height: '70%' }}></div>
                    <span className="text-xs mt-1">Oeste</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="bg-blue-500 w-8" style={{ height: '90%' }}></div>
                    <span className="text-xs mt-1">Centro</span>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="insights" className="m-0 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium flex items-center gap-1">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  Insights Generados por IA
                </h3>
                
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs"
                  onClick={generateMapInsights}
                  disabled={isLoading}
                >
                  <RefreshCw className={`w-3 h-3 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                  Regenerar
                </Button>
              </div>
              
              {isLoading ? (
                <div className="text-center py-8">
                  <RefreshCw className="w-8 h-8 mx-auto mb-2 text-blue-600 animate-spin" />
                  <p className="text-gray-600">Generando insights con IA...</p>
                </div>
              ) : aiInsights.length === 0 ? (
                <div className="text-center py-8">
                  <Zap className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                  <p className="text-gray-600">No hay insights disponibles</p>
                  <Button
                    size="sm"
                    className="mt-2"
                    onClick={generateMapInsights}
                  >
                    Generar Insights
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {aiInsights.map((insight, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100"
                    >
                      <p className="text-sm text-gray-800">{insight}</p>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="text-sm font-medium text-yellow-800 mb-2">
                  Recomendación IA
                </h4>
                <p className="text-sm text-yellow-700">
                  Basado en los datos actuales, se recomienda enfocar esfuerzos en la zona Centro 
                  que muestra 90% de engagement y tiene el mayor potencial de conversión.
                </p>
                <div className="mt-3 flex justify-end">
                  <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 h-8 text-xs">
                    <Target className="w-3 h-3 mr-1" />
                    Aplicar Estrategia
                  </Button>
                </div>
              </div>
            </TabsContent>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GeminiMCPMapController;

function Minus(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
    </svg>
  )
}
