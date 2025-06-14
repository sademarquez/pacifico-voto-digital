
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

const Index = () => {
  const modules = [
    {
      title: "Reporte de publicidad",
      description: "Gestiona y reporta publicidad de campaña",
      icon: Camera,
      href: "/reporte-publicidad",
      color: "bg-slate-600"
    },
    {
      title: "Registrar votante",
      description: "Registro y seguimiento de votantes",
      icon: Users,
      href: "/registro",
      color: "bg-gray-600"
    },
    {
      title: "Estructura",
      description: "Organización de la estructura política",
      icon: Building2,
      href: "/estructura",
      color: "bg-stone-600"
    },
    {
      title: "Red de Ayudantes",
      description: "Sistema de comunicación y organización territorial",
      icon: Network,
      href: "/red-ayudantes",
      color: "bg-slate-700"
    },
    {
      title: "Informes",
      description: "Reportes y análisis de campaña",
      icon: FileText,
      href: "/informes",
      color: "bg-zinc-600"
    },
    {
      title: "Lugar de Votación",
      description: "Ubicación de puestos de votación",
      icon: MapPin,
      href: "/lugar-votacion",
      color: "bg-neutral-600"
    },
    {
      title: "Ubicación Votantes",
      description: "Mapeo geográfico de votantes",
      icon: Navigation,
      href: "/ubicacion-votantes",
      color: "bg-slate-700"
    },
    {
      title: "Dashboard",
      description: "Panel de control principal",
      icon: BarChart3,
      href: "/dashboard",
      color: "bg-gray-700"
    },
    {
      title: "Mensajes",
      description: "Sistema de mensajería",
      icon: MessageSquare,
      href: "/mensajes",
      color: "bg-stone-700"
    },
    {
      title: "Configuración",
      description: "Ajustes de la aplicación",
      icon: Settings,
      href: "/configuracion",
      color: "bg-zinc-700"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50">
      {/* Header del Candidato */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-xl overflow-hidden shadow-lg mb-4 bg-white border-4 border-white/20">
              <img 
                src="/lovable-uploads/1736829b-fe2c-45cd-9a94-59af97b2f33c.png" 
                alt="Candidato" 
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-3xl font-bold mb-2">Candidato</h1>
            <p className="text-xl opacity-90">¡Qué gusto que nos visites!</p>
            <Badge className="mt-3 bg-white/20 text-white border-white/30">
              MI CAMPAÑA 2024 - Transparencia y Honestidad
            </Badge>
          </div>
        </div>
      </div>

      {/* Lista de Módulos */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">
          Lista de módulos
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {modules.map((module, index) => (
            <Link key={index} to={module.href}>
              <Card className="h-full hover:shadow-md transition-all duration-300 hover:scale-[1.02] cursor-pointer border border-gray-200 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-lg ${module.color} flex items-center justify-center shadow-sm`}>
                      <module.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-slate-800">{module.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-600">
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
            <Button size="lg" className="rounded-lg bg-slate-600 hover:bg-slate-700 shadow-sm">
              <Facebook className="w-6 h-6" />
            </Button>
          </a>
          <a 
            href="https://www.instagram.com/micampanaia/" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button size="lg" className="rounded-lg bg-gray-600 hover:bg-gray-700 shadow-sm">
              <Instagram className="w-6 h-6" />
            </Button>
          </a>
          <Button size="lg" className="rounded-lg bg-zinc-700 hover:bg-zinc-800 shadow-sm">
            <Music className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
