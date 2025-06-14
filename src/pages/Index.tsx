
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, MapPin, AlertTriangle, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [memberCount] = useState(1247); // This will come from API later
  const [alertsCount] = useState(23);
  const { toast } = useToast();

  const handleJoinCampaign = () => {
    toast({
      title: "¡Bienvenido a Mi Campaña!",
      description: "Pronto podrás registrarte y ser parte del cambio.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Mi Campaña
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Construyendo juntos el futuro del Pacífico colombiano. 
            Una plataforma para la organización comunitaria y la respuesta ante emergencias.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Badge variant="secondary" className="text-lg px-4 py-2 bg-white/20 hover:bg-white/30">
              <Users className="w-5 h-5 mr-2" />
              {memberCount.toLocaleString()} Miembros Activos
            </Badge>
            <Badge variant="secondary" className="text-lg px-4 py-2 bg-white/20 hover:bg-white/30">
              <AlertTriangle className="w-5 h-5 mr-2" />
              {alertsCount} Alertas Atendidas
            </Badge>
          </div>
          <Button 
            onClick={handleJoinCampaign}
            size="lg" 
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Heart className="w-5 h-5 mr-2" />
            Únete a la Campaña
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Herramientas para el Cambio
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-blue-500">
            <CardHeader>
              <Users className="w-12 h-12 text-blue-600 mb-4" />
              <CardTitle className="text-xl">Organización Territorial</CardTitle>
              <CardDescription>
                Conecta líderes comunitarios desde veredas hasta municipios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Sistema jerárquico que permite la coordinación efectiva entre diferentes niveles de liderazgo territorial.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-green-500">
            <CardHeader>
              <MapPin className="w-12 h-12 text-green-600 mb-4" />
              <CardTitle className="text-xl">Mapa de Alertas</CardTitle>
              <CardDescription>
                Reporta y visualiza emergencias en tiempo real
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Herramienta vital para la respuesta rápida ante desastres naturales y necesidades comunitarias urgentes.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-red-500">
            <CardHeader>
              <AlertTriangle className="w-12 h-12 text-red-600 mb-4" />
              <CardTitle className="text-xl">Comunicación Directa</CardTitle>
              <CardDescription>
                WhatsApp integrado para coordinación inmediata
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Notificaciones instantáneas a líderes territoriales para una respuesta coordinada y efectiva.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* News/Updates Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Últimas Noticias
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <Badge className="w-fit bg-blue-100 text-blue-800">Organización</Badge>
                <CardTitle className="text-lg">Nueva Red de Líderes en Buenaventura</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Se conformó una nueva red de 15 líderes comunitarios que cubrirán 8 barrios de la zona oriental.
                </p>
                <p className="text-sm text-gray-500">Hace 2 días</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <Badge className="w-fit bg-green-100 text-green-800">Emergencia</Badge>
                <CardTitle className="text-lg">Respuesta Rápida ante Inundaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Nuestros líderes coordinaron la ayuda humanitaria para 200 familias afectadas en menos de 4 horas.
                </p>
                <p className="text-sm text-gray-500">Hace 1 semana</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <Badge className="w-fit bg-red-100 text-red-800">Campaña</Badge>
                <CardTitle className="text-lg">Propuestas para el Desarrollo Social</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Presentamos nuestro plan integral para víctimas del conflicto y desarrollo del Pacífico colombiano.
                </p>
                <p className="text-sm text-gray-500">Hace 3 días</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            El Cambio Empieza Contigo
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Cada voz cuenta, cada líder importa, cada alerta salva vidas. 
            Únete a nuestra red de transformación social.
          </p>
          <Button 
            onClick={handleJoinCampaign}
            size="lg" 
            className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Comienza Ahora
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
