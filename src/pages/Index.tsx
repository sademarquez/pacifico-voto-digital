
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, MapPin, AlertTriangle, Heart, Star, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [memberCount] = useState(1247);
  const [alertsCount] = useState(23);
  const { toast } = useToast();

  const handleJoinCampaign = () => {
    toast({
      title: "¡Bienvenido a Mi Campaña! 💜",
      description: "Juntos construimos un futuro lleno de esperanza y oportunidades.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden gradient-primary">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20"></div>
        <div className="relative container mx-auto px-4 py-20 text-center">
          <div className="flex justify-center mb-6">
            <Sparkles className="w-16 h-16 text-white animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-lg">
            Mi Campaña
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto text-white/90 leading-relaxed">
            Tejiendo esperanza en cada comunidad del Pacífico colombiano. 
            Unidos construimos un futuro próspero, inclusivo y lleno de oportunidades para todos.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-10">
            <Badge variant="secondary" className="text-lg px-6 py-3 bg-white/20 hover:bg-white/30 text-white border-white/30">
              <Users className="w-5 h-5 mr-2" />
              {memberCount.toLocaleString()} Corazones Unidos
            </Badge>
            <Badge variant="secondary" className="text-lg px-6 py-3 bg-white/20 hover:bg-white/30 text-white border-white/30">
              <Heart className="w-5 h-5 mr-2" />
              {alertsCount} Comunidades Apoyadas
            </Badge>
          </div>
          <Button 
            onClick={handleJoinCampaign}
            size="lg" 
            className="bg-white text-purple-600 hover:bg-purple-50 px-10 py-4 text-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 rounded-full"
          >
            <Heart className="w-6 h-6 mr-3" />
            Únete a la Esperanza
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <Star className="w-12 h-12 text-purple-500 mx-auto mb-4" />
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Herramientas de Transformación
          </h2>
          <p className="text-xl text-purple-600/80 max-w-2xl mx-auto">
            Cada herramienta diseñada con amor para empoderar nuestras comunidades
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="hover:shadow-2xl transition-all duration-500 border-0 gradient-secondary hover:scale-105">
            <CardHeader className="text-center">
              <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-purple-700">Organización Comunitaria</CardTitle>
              <CardDescription className="text-purple-600/80">
                Red de líderes que conecta corazones y fortalece comunidades
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-purple-600/70 leading-relaxed">
                Desde cada vereda hasta los municipios, construimos puentes de comunicación 
                que nos permiten actuar unidos ante cualquier desafío.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-2xl transition-all duration-500 border-0 gradient-secondary hover:scale-105">
            <CardHeader className="text-center">
              <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-purple-700">Guardian de Alertas</CardTitle>
              <CardDescription className="text-purple-600/80">
                Respuesta inmediata para proteger nuestras familias
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-purple-600/70 leading-relaxed">
                Tecnología al servicio de la solidaridad. Cada alerta es una oportunidad 
                de demostrar que nadie está solo en nuestra región.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-2xl transition-all duration-500 border-0 gradient-secondary hover:scale-105">
            <CardHeader className="text-center">
              <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-purple-700">Comunicación del Alma</CardTitle>
              <CardDescription className="text-purple-600/80">
                WhatsApp integrado para mantener viva la esperanza
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-purple-600/70 leading-relaxed">
                Mensajes que llegan directo al corazón. Coordinación instantánea 
                para hacer realidad los sueños de nuestra gente.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* News Section */}
      <div className="gradient-secondary py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-purple-700 mb-4">
              Historias de Esperanza
            </h2>
            <p className="text-xl text-purple-600/80">
              Cada día escribimos juntos un nuevo capítulo de transformación
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur">
              <CardHeader>
                <Badge className="w-fit bg-purple-100 text-purple-700 border-purple-200">💜 Organización</Badge>
                <CardTitle className="text-lg text-purple-800">Red de Esperanza en Buenaventura</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-600/80 mb-4">
                  15 líderes comunitarios se unieron para tejer una red de solidaridad 
                  que abraza 8 barrios con amor y determinación.
                </p>
                <p className="text-sm text-purple-500">✨ Hace 2 días</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur">
              <CardHeader>
                <Badge className="w-fit bg-pink-100 text-pink-700 border-pink-200">🌟 Solidaridad</Badge>
                <CardTitle className="text-lg text-purple-800">Milagro de la Solidaridad</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-600/80 mb-4">
                  En menos de 4 horas, nuestros guardianes de la esperanza coordinaron 
                  ayuda para 200 familias tras las inundaciones.
                </p>
                <p className="text-sm text-purple-500">🌈 Hace 1 semana</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur">
              <CardHeader>
                <Badge className="w-fit bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200">💫 Futuro</Badge>
                <CardTitle className="text-lg text-purple-800">Semillas de Transformación</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-600/80 mb-4">
                  Presentamos propuestas que florecerán en oportunidades reales 
                  para víctimas del conflicto y el desarrollo del Pacífico.
                </p>
                <p className="text-sm text-purple-500">🌸 Hace 3 días</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="gradient-primary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <Sparkles className="w-16 h-16 mx-auto mb-6 animate-bounce" />
          <h2 className="text-4xl font-bold mb-6">
            Tu Corazón es la Clave del Cambio
          </h2>
          <p className="text-xl mb-10 max-w-3xl mx-auto opacity-95 leading-relaxed">
            Cada voz que se suma es una nota más en la sinfonía de la transformación. 
            Cada líder que nace es una luz que ilumina el camino hacia un futuro próspero.
          </p>
          <Button 
            onClick={handleJoinCampaign}
            size="lg" 
            className="bg-white text-purple-600 hover:bg-purple-50 px-10 py-4 text-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 rounded-full"
          >
            <Star className="w-6 h-6 mr-3" />
            Ilumina el Camino
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
