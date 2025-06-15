
import { useState } from "react";
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
  Navigation,
  Home,
  Building2,
  Star,
  Target,
  Calendar
} from "lucide-react";

interface LocationData {
  id: string;
  name: string;
  type: string;
  alerts: number;
  population: number;
  events: number;
}

const MapaAlertas = () => {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  
  const locations: LocationData[] = [
    { id: "bogota-centro", name: "Bogotá Centro", type: "zona", alerts: 3, population: 45000, events: 2 },
    { id: "chapinero", name: "Chapinero", type: "barrio", alerts: 1, population: 32000, events: 4 },
    { id: "suba", name: "Suba", type: "barrio", alerts: 2, population: 67000, events: 1 },
    { id: "usaquen", name: "Usaquén", type: "barrio", alerts: 0, population: 28000, events: 3 },
    { id: "kennedy", name: "Kennedy", type: "barrio", alerts: 4, population: 89000, events: 2 },
    { id: "engativa", name: "Engativá", type: "barrio", alerts: 1, population: 52000, events: 5 }
  ];

  const handleLocationSelect = (locationId: string) => {
    const location = locations.find(l => l.id === locationId);
    setSelectedLocation(location || null);
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

        {/* Mapa Interactivo */}
        {selectedLocation && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    Mapa Interactivo - {selectedLocation.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-6 min-h-[400px] border-2 border-dashed border-blue-200 relative">
                    <div className="grid grid-cols-3 gap-4 h-full">
                      {locations.map((location) => (
                        <div
                          key={location.id}
                          className={`rounded-lg p-4 cursor-pointer transition-all duration-300 hover:scale-105 border-2 ${
                            selectedLocation?.id === location.id 
                              ? 'border-blue-500 bg-blue-100 shadow-xl scale-110' 
                              : 'border-gray-300 bg-white hover:border-blue-300'
                          }`}
                          onClick={() => handleLocationSelect(location.id)}
                        >
                          <div className="text-center">
                            <div className="w-8 h-8 mx-auto mb-2 bg-blue-600 rounded-full flex items-center justify-center">
                              <Building2 className="w-4 h-4 text-white" />
                            </div>
                            <h4 className="font-medium text-sm">{location.name}</h4>
                            <p className="text-xs text-gray-500 mb-2">{location.population.toLocaleString()} hab.</p>
                            <div className="flex justify-center gap-1 mt-2">
                              {location.alerts > 0 && (
                                <Badge className="bg-red-100 text-red-800 text-xs">{location.alerts}</Badge>
                              )}
                              <Badge className="bg-blue-100 text-blue-800 text-xs">{location.events}</Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Información de ubicación seleccionada */}
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
                </CardContent>
              </Card>
            </div>

            {/* Panel de Información del Candidato */}
            <div className="space-y-4">
              <Card className="border-2 border-purple-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-lg">
                  <CardTitle className="text-center">Tu Candidata</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-purple-200">
                      <img 
                        src="/lovable-uploads/83527a7a-6d3b-4edb-bdfc-312894177818.png" 
                        alt="María González"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-purple-800">María González</h3>
                      <p className="text-purple-600 font-semibold">Alcaldía Local</p>
                      <p className="text-lg text-purple-700 mt-2 font-medium">"¡Juntos por el Cambio Real!"</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-800">Nuestras Propuestas:</h4>
                      <div className="space-y-1 text-left">
                        <p className="text-sm text-gray-700">🏥 Salud gratuita para todos</p>
                        <p className="text-sm text-gray-700">🎓 Educación de calidad</p>
                        <p className="text-sm text-gray-700">🚌 Transporte público eficiente</p>
                        <p className="text-sm text-gray-700">🌳 Espacios verdes en cada barrio</p>
                        <p className="text-sm text-gray-700">💼 Empleos dignos para jóvenes</p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t">
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => window.open('https://wa.me/573001234567', '_blank')}
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Contactar por WhatsApp
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        ¡Únete al Equipo!
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

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
    </div>
  );
};

export default MapaAlertas;
