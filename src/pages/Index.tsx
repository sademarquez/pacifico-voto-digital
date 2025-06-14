
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Camera, 
  Users, 
  Building2, 
  FileText, 
  MapPin, 
  Navigation, 
  BarChart3, 
  MessageSquare, 
  Settings,
  Facebook,
  Instagram,
  Music
} from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const modules = [
    {
      title: "Reporte de publicidad",
      description: "Gestiona y reporta publicidad de campaña",
      icon: Camera,
      href: "/reporte-publicidad",
      color: "bg-blue-500"
    },
    {
      title: "Registrar votante",
      description: "Registro y seguimiento de votantes",
      icon: Users,
      href: "/registro",
      color: "bg-green-500"
    },
    {
      title: "Estructura",
      description: "Organización de la estructura política",
      icon: Building2,
      href: "/estructura",
      color: "bg-purple-500"
    },
    {
      title: "Informes",
      description: "Reportes y análisis de campaña",
      icon: FileText,
      href: "/informes",
      color: "bg-orange-500"
    },
    {
      title: "Lugar de Votación",
      description: "Ubicación de puestos de votación",
      icon: MapPin,
      href: "/lugar-votacion",
      color: "bg-red-500"
    },
    {
      title: "Ubicación Votantes",
      description: "Mapeo geográfico de votantes",
      icon: Navigation,
      href: "/ubicacion-votantes",
      color: "bg-teal-500"
    },
    {
      title: "Dashboard",
      description: "Panel de control principal",
      icon: BarChart3,
      href: "/dashboard",
      color: "bg-indigo-500"
    },
    {
      title: "Mensajes",
      description: "Sistema de mensajería",
      icon: MessageSquare,
      href: "/mensajes",
      color: "bg-pink-500"
    },
    {
      title: "Configuración",
      description: "Ajustes de la aplicación",
      icon: Settings,
      href: "/configuracion",
      color: "bg-gray-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-purple-50">
      {/* Header del Candidato */}
      <div className="bg-gradient-to-r from-cyan-400 to-cyan-500 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-xl mb-4 bg-white">
              <img 
                src="/lovable-uploads/1736829b-fe2c-45cd-9a94-59af97b2f33c.png" 
                alt="Candidato" 
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-3xl font-bold mb-2">Candidato</h1>
            <p className="text-xl opacity-90">¡Qué gusto que nos visites!</p>
            <Badge className="mt-3 bg-white/20 text-white border-white/30">
              Wramba Fxiw 2024
            </Badge>
          </div>
        </div>
      </div>

      {/* Lista de Módulos */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Lista de módulos
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {modules.map((module, index) => (
            <Link key={index} to={module.href}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-0 shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-lg ${module.color} flex items-center justify-center`}>
                      <module.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-gray-800">{module.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {module.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Redes Sociales */}
        <div className="mt-12 flex justify-center space-x-6">
          <Button size="lg" className="rounded-full bg-blue-600 hover:bg-blue-700">
            <Facebook className="w-6 h-6" />
          </Button>
          <Button size="lg" className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
            <Instagram className="w-6 h-6" />
          </Button>
          <Button size="lg" className="rounded-full bg-black hover:bg-gray-800">
            <Music className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
