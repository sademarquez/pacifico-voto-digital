
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Star,
  Navigation,
  Home,
  Building2,
  UserPlus,
  Mail,
  CheckCircle
} from "lucide-react";

interface LocationData {
  id: string;
  name: string;
  type: string;
  alerts: number;
  population: number;
  events: number;
  coordinates: { lat: number; lng: number };
}

const MapaAlertas = () => {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [showCandidateInfo, setShowCandidateInfo] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [voterData, setVoterData] = useState({
    name: "",
    email: "",
    phone: "",
    location: ""
  });
  
  const locations: LocationData[] = [
    { 
      id: "bogota-centro", 
      name: "Bogotá Centro", 
      type: "zona", 
      alerts: 3, 
      population: 45000, 
      events: 2,
      coordinates: { lat: 4.5981, lng: -74.0758 }
    },
    { 
      id: "chapinero", 
      name: "Chapinero", 
      type: "barrio", 
      alerts: 1, 
      population: 32000, 
      events: 4,
      coordinates: { lat: 4.6097, lng: -74.0648 }
    },
    { 
      id: "suba", 
      name: "Suba", 
      type: "barrio", 
      alerts: 2, 
      population: 67000, 
      events: 1,
      coordinates: { lat: 4.7110, lng: -74.0721 }
    },
    { 
      id: "usaquen", 
      name: "Usaquén", 
      type: "barrio", 
      alerts: 0, 
      population: 28000, 
      events: 3,
      coordinates: { lat: 4.6944, lng: -74.0306 }
    },
    { 
      id: "kennedy", 
      name: "Kennedy", 
      type: "barrio", 
      alerts: 4, 
      population: 89000, 
      events: 2,
      coordinates: { lat: 4.6292, lng: -74.1375 }
    },
    { 
      id: "engativa", 
      name: "Engativá", 
      type: "barrio", 
      alerts: 1, 
      population: 52000, 
      events: 5,
      coordinates: { lat: 4.6947, lng: -74.1045 }
    }
  ];

  // Query para alertas según ubicación seleccionada
  const { data: locationAlerts = [], isLoading } = useQuery({
    queryKey: ['visitor-alerts', selectedLocation?.id],
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

  const handleLocationSelect = (locationId: string) => {
    const location = locations.find(l => l.id === locationId);
    setSelectedLocation(location || null);
    
    // Mostrar info del candidato después de seleccionar ubicación
    if (location) {
      setTimeout(() => {
        setShowCandidateInfo(true);
      }, 2000);
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

  const handleVoterRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Aquí se podría integrar con Supabase para guardar los datos
      console.log('Registrando votante:', voterData);
      
      // Simulación de registro exitoso
      alert('¡Gracias por unirte! Te contactaremos pronto.');
      setShowRegistrationForm(false);
      setVoterData({ name: "", email: "", phone: "", location: "" });
    } catch (error) {
      console.error('Error registrando votante:', error);
      alert('Error al registrar. Inténtalo nuevamente.');
    }
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header de Bienvenida */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white p-6">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl font-bold mb-2">¡Bienvenido a MI CAMPAÑA!</h1>
          <p className="text-lg opacity-90 mb-4">
            Descubre lo que está pasando en tu comunidad
          </p>
          <div className="flex justify-center items-center gap-2">
            <Star className="w-6 h-6 text-yellow-300" />
            <span className="text-yellow-300 font-semibold">Tu voz cuenta, tu voto transforma</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Selector de Ubicación */}
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Navigation className="w-6 h-6" />
              Selecciona tu Ubicación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select onValueChange={handleLocationSelect}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="¿Dónde vives? Selecciona tu zona..." />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      <div className="flex items-center gap-2">
                        <Home className="w-4 h-4 text-blue-600" />
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
                      Ubicación seleccionada: {selectedLocation.name}
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

        {/* Contenido Principal */}
        {selectedLocation && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Mapa Visual Interactivo */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    Mapa Interactivo - {selectedLocation.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-6 min-h-[400px] border-2 border-dashed border-blue-200 relative overflow-hidden">
                    {/* Efecto de mapa con animaciones */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-100/50 to-green-100/50 animate-pulse"></div>
                    
                    <div className="relative z-10 grid grid-cols-3 gap-4 h-full">
                      {locations.map((location) => (
                        <div
                          key={location.id}
                          className={`rounded-lg p-4 cursor-pointer transition-all duration-300 hover:scale-105 border-2 transform hover:rotate-1 ${
                            selectedLocation?.id === location.id 
                              ? 'border-blue-500 bg-blue-100 shadow-xl scale-110 rotate-2' 
                              : 'border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50'
                          }`}
                          onClick={() => handleLocationSelect(location.id)}
                        >
                          <div className="text-center">
                            <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center transition-colors ${
                              selectedLocation?.id === location.id 
                                ? 'bg-blue-600 shadow-lg' 
                                : 'bg-gray-500 hover:bg-blue-500'
                            }`}>
                              <Building2 className="w-4 h-4 text-white" />
                            </div>
                            <h4 className="font-medium text-sm">{location.name}</h4>
                            <p className="text-xs text-gray-500 mb-2">{location.population.toLocaleString()} hab.</p>
                            <div className="flex justify-center gap-1 mt-2">
                              {location.alerts > 0 && (
                                <Badge className="bg-red-100 text-red-800 text-xs animate-bounce">{location.alerts}</Badge>
                              )}
                              <Badge className="bg-blue-100 text-blue-800 text-xs">{location.events}</Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Información detallada de la ubicación seleccionada */}
                    {selectedLocation && (
                      <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg border">
                        <h3 className="font-semibold text-lg text-gray-800 mb-2 flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-blue-600" />
                          📍 {selectedLocation.name}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-blue-600" />
                            <span>{selectedLocation.population.toLocaleString()} habitantes</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-orange-600" />
                            <span>{selectedLocation.alerts} alertas</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-purple-600" />
                            <span>{selectedLocation.events} eventos</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-green-600" />
                            <span>Zona {selectedLocation.type}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Alertas */}
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-orange-600" />
                      Alertas en {selectedLocation.name}
                    </h3>
                    
                    {isLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-gray-600">Cargando alertas...</p>
                      </div>
                    ) : locationAlerts.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Trophy className="w-8 h-8 text-green-600" />
                        </div>
                        <h4 className="text-lg font-semibold text-green-800 mb-2">¡Zona Tranquila!</h4>
                        <p className="text-green-600">No hay alertas activas en tu zona.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {locationAlerts.slice(0, 3).map((alert) => (
                          <div key={alert.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3 flex-1">
                                <div className="p-2 bg-gray-100 rounded-lg">
                                  {getAlertIcon(alert.type)}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                                  <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
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
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Panel de Candidato y Registro */}
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

                      {/* Llamadas a Acción para Capturar Votantes */}
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
                          onClick={() => setShowRegistrationForm(true)}
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          ¡Únete al Equipo!
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
                    Tu Comunidad - {selectedLocation.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Población:</span>
                      <Badge variant="outline">{selectedLocation.population.toLocaleString()}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Alertas activas:</span>
                      <Badge className={selectedLocation.alerts > 2 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}>
                        {selectedLocation.alerts}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Eventos este mes:</span>
                      <Badge className="bg-purple-100 text-purple-800">{selectedLocation.events}</Badge>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => setShowRegistrationForm(true)}
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      Únete a la Comunidad
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Footer motivacional */}
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
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => setShowRegistrationForm(true)}
                  >
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

      {/* Modal de Registro de Votantes */}
      {showRegistrationForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
              <CardTitle className="text-center flex items-center gap-2 justify-center">
                <UserPlus className="w-6 h-6" />
                ¡Únete a Nuestro Equipo!
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleVoterRegistration} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={voterData.name}
                    onChange={(e) => setVoterData({...voterData, name: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tu nombre completo"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={voterData.email}
                    onChange={(e) => setVoterData({...voterData, email: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="tu.email@ejemplo.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    required
                    value={voterData.phone}
                    onChange={(e) => setVoterData({...voterData, phone: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+57 300 123 4567"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tu zona
                  </label>
                  <input
                    type="text"
                    value={selectedLocation?.name || ""}
                    onChange={(e) => setVoterData({...voterData, location: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                    placeholder="Tu ubicación"
                    readOnly
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowRegistrationForm(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Registrarme
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MapaAlertas;
