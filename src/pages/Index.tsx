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
  Music,
  Network
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();

  // ProtectedRoute en App.tsx ya maneja la redirección.
  // Podemos asumir con seguridad que 'user' existe aquí.
  if (!user) {
    // Esto se mostrará brevemente mientras se carga o redirige.
    return null;
  }

  const modules = [
    {
      title: "Reporte de publicidad",
      description: "Gestiona y reporta publicidad de campaña",
      icon: Camera,
      href: "/reporte-publicidad",
      color: "bg-blue-600"
    },
    {
      title: "Registrar votante",
      description: "Registro y seguimiento de votantes",
      icon: Users,
      href: "/registro",
      color: "bg-indigo-600"
    },
    {
      title: "Estructura",
      description: "Organización de la estructura política",
      icon: Building2,
      href: "/estructura",
      color: "bg-sky-600"
    },
    {
      title: "Red de Ayudantes",
      description: "Sistema de comunicación y organización territorial",
      icon: Network,
      href: "/red-ayudantes",
      color: "bg-blue-700"
    },
    {
      title: "Informes",
      description: "Reportes y análisis de campaña",
      icon: FileText,
      href: "/informes",
      color: "bg-cyan-600"
    },
    {
      title: "Lugar de Votación",
      description: "Ubicación de puestos de votación",
      icon: MapPin,
      href: "/lugar-votacion",
      color: "bg-blue-800"
    },
    {
      title: "Ubicación Votantes",
      description: "Mapeo geográfico de votantes",
      icon: Navigation,
      href: "/ubicacion-votantes",
      color: "bg-indigo-700"
    },
    {
      title: "Dashboard",
      description: "Panel de control principal",
      icon: BarChart3,
      href: "/dashboard",
      color: "bg-sky-700"
    },
    {
      title: "Mensajes",
      description: "Sistema de mensajería",
      icon: MessageSquare,
      href: "/mensajes",
      color: "bg-blue-500"
    },
    {
      title: "Configuración",
      description: "Ajustes de la aplicación",
      icon: Settings,
      href: "/configuracion",
      color: "bg-indigo-800"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header del Candidato */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-xl overflow-hidden shadow-lg mb-4 bg-white border-4 border-white/20">
              <img 
                src="/lovable-uploads/83527a7a-6d3b-4edb-bdfc-312894177818.png" 
                alt="MI CAMPAÑA Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-3xl font-bold mb-2">Bienvenido, {user.name}</h1>
            <p className="text-xl opacity-90">¡Gracias por ser parte de nuestro equipo!</p>
            <Badge className="mt-3 bg-white/20 text-white border-white/30">
              MI CAMPAÑA 2025 - Transparencia y Honestidad | Rol: {user.role.toUpperCase()}
            </Badge>
          </div>
        </div>
      </div>

      {/* Lista de Módulos */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-blue-800 mb-8 text-center">
          Lista de módulos
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {modules.map((module, index) => (
            <Link key={index} to={module.href}>
              <Card className="h-full hover:shadow-md transition-all duration-300 hover:scale-[1.02] cursor-pointer border border-blue-200 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-lg ${module.color} flex items-center justify-center shadow-sm`}>
                      <module.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-blue-800">{module.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-blue-600">
                    {module.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Redes Sociales */}
        <div className="mt-12 flex justify-center space-x-6">
          <a 
            href="https://www.facebook.com/profile.php?id=61575665316561" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button size="lg" className="rounded-lg bg-blue-600 hover:bg-blue-700 shadow-sm">
              <Facebook className="w-6 h-6" />
            </Button>
          </a>
          <a 
            href="https://www.instagram.com/micampanaia/" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button size="lg" className="rounded-lg bg-indigo-600 hover:bg-indigo-700 shadow-sm">
              <Instagram className="w-6 h-6" />
            </Button>
          </a>
          <Button size="lg" className="rounded-lg bg-sky-700 hover:bg-sky-800 shadow-sm">
            <Music className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
