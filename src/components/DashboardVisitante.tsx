
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "../contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  MapPin, 
  AlertTriangle, 
  Users, 
  Vote,
  Heart,
  Phone,
  MessageCircle,
  Share2,
  Calendar,
  Trophy,
  Target,
  Star
} from "lucide-react";

const DashboardVisitante = () => {
  const { user } = useAuth();
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showCandidateInfo, setShowCandidateInfo] = useState(false);

  // Ubicaciones geográficas predefinidas para evitar manipulación
  const locations = [
    { id: "bogota-centro", name: "Bogotá - Centro", type: "ciudad" },
    { id: "bogota-chapinero", name: "Bogotá - Chapinero", type: "barrio" },
    { id: "bogota-suba", name: "Bogotá - Suba", type: "barrio" },
    { id: "cundinamarca", name: "Cundinamarca", type: "departamento" },
    { id: "chia", name: "Chía", type: "municipio" },
    { id: "zipaquira", name: "Zipaquirá", type: "municipio" },
    { id: "soacha", name: "Soacha", type: "municipio" },
    { id: "madrid-cund", name: "Madrid - Cundinamarca", type: "municipio" }
  ];

  // Query para alertas según ubicación seleccionada
  const { data: locationAlerts = [], isLoading } = useQuery({
    queryKey: ['visitor-alerts', selectedLocation],
    queryFn: async () => {
      if (!selectedLocation) return [];
      
      const { data, error } = await supabase
        .from('alerts')
        .select(`
          *,
          territories(name, type)
        `)
        .eq('status', 'active')
        .order('priority', { ascending: false })
        .limit(6);

      if (error) {
        console.error('Error obteniendo alertas:', error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!selectedLocation
  });

  const getAlertColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'security': return <AlertTriangle className="w-4 h-4" />;
      case 'event': return <Calendar className="w-4 h-4" />;
      case 'campaign': return <Vote className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const candidateInfo = {
    name: "María González",
    position: "Alcaldía Local",
    photo: "/lovable-uploads/83527a7a-6d3b-4edb-bdfc-312894177818.png",
    slogan: "¡Juntos por el Cambio Real!",
    whatsapp: "+57 300 123 4567",
    proposals: [
      "🏥 Salud gratuita para todos",
      "🎓 Educación de calidad",
      "🚌 Transporte público eficiente",
      "🌳 Espacios verdes en cada barrio",
      "💼 Empleos dignos para jóvenes"
    ]
  };

  // Funnel de conversión progresivo
  useEffect(() => {
    if (selectedLocation && !showCandidateInfo) {
      const timer = setTimeout(() => {
        setShowCandidateInfo(true);
      }, 3000); // Mostrar info del candidato después de 3 segundos
      return () => clearTimeout(timer);
    }
  }, [selectedLocation, showCandidateInfo]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4">
      {/* Header de Bienvenida */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-lg p-6 text-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">¡Bienvenido a MI CAMPAÑA!</h1>
          <p className="text-lg opacity-90 mb-4">
            Descubre lo que está pasando en tu comunidad y conoce nuestras propuestas
          </p>
          <div className="flex justify-center items-center gap-2">
            <Star className="w-6 h-6 text-yellow-300" />
            <span className="text-yellow-300 font-semibold">Tu voz cuenta, tu voto transforma</span>
          </div>
        </div>
      </div>

      {/* Selector de Ubicación */}
      <Card className="border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <MapPin className="w-6 h-6" />
            Selecciona tu Ubicación
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="¿Dónde vives? Selecciona tu zona..." />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span>{location.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {location.type}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedLocation && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-800">
                  <Target className="w-5 h-5" />
                  <span className="font-semibold">
                    Ubicación seleccionada: {locations.find(l => l.id === selectedLocation)?.name}
                  </span>
                </div>
                <p className="text-green-700 text-sm mt-1">
                  Ahora puedes ver las alertas e información específica de tu zona
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Mapa de Alertas Georreferenciado */}
      {selectedLocation && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  Alertas en tu Zona
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando alertas de tu zona...</p>
                  </div>
                ) : locationAlerts.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Trophy className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-green-800 mb-2">¡Zona Tranquila!</h3>
                    <p className="text-green-600">No hay alertas activas en tu zona. ¡Sigamos trabajando juntos!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {locationAlerts.map((alert) => (
                      <div key={alert.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="p-2 bg-gray-100 rounded-lg">
                              {getAlertIcon(alert.type)}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                              {alert.territories && (
                                <p className="text-xs text-gray-500 mt-2">
                                  📍 {alert.territories.name}
                                </p>
                              )}
                            </div>
                          </div>
                          <Badge className={`${getAlertColor(alert.priority)} text-xs`}>
                            {alert.priority}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Panel de Candidato - Llamada a Acción */}
          <div className="space-y-4">
            {showCandidateInfo && (
              <Card className="border-2 border-purple-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-lg">
                  <CardTitle className="text-center">Tu Candidata</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-purple-200">
                      <img 
                        src={candidateInfo.photo} 
                        alt={candidateInfo.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-purple-800">{candidateInfo.name}</h3>
                      <p className="text-purple-600 font-semibold">{candidateInfo.position}</p>
                      <p className="text-lg text-purple-700 mt-2 font-medium">"{candidateInfo.slogan}"</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-800">Nuestras Propuestas:</h4>
                      <div className="space-y-1">
                        {candidateInfo.proposals.map((proposal, index) => (
                          <p key={index} className="text-sm text-gray-700 text-left">{proposal}</p>
                        ))}
                      </div>
                    </div>

                    {/* Llamadas a Acción */}
                    <div className="space-y-3 pt-4 border-t">
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => window.open(`https://wa.me/${candidateInfo.whatsapp.replace(/\s/g, '')}`, '_blank')}
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Contactar por WhatsApp
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                        onClick={() => setShowCandidateInfo(false)}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Enviar Mensaje
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full border-purple-600 text-purple-600 hover:bg-purple-50"
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Compartir con Amigos
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Información Comunitaria */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Users className="w-5 h-5" />
                  Tu Comunidad
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Vecinos registrados:</span>
                    <Badge className="bg-blue-100 text-blue-800">1,247</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Participación activa:</span>
                    <Badge className="bg-green-100 text-green-800">78%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Eventos este mes:</span>
                    <Badge className="bg-purple-100 text-purple-800">5</Badge>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Heart className="w-4 h-4 mr-2" />
                    Únete a la Comunidad
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Footer con Información de Contacto */}
      {selectedLocation && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                ¡Tu participación es clave para el cambio!
              </h3>
              <p className="text-blue-700 mb-4">
                Mantente informado sobre todo lo que pasa en tu comunidad y sé parte de la transformación.
              </p>
              <div className="flex justify-center gap-4">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Vote className="w-4 h-4 mr-2" />
                  Registrarme para Votar
                </Button>
                <Button variant="outline" className="border-purple-600 text-purple-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  Ver Próximos Eventos
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardVisitante;
