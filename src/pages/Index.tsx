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
  Network,
  Crown,
  Shield,
  Star,
  AlertTriangle,
  Calendar
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const getPersonalizedModules = () => {
    const baseModules = [
      {
        title: "Dashboard",
        description: "Panel de control personalizado",
        icon: BarChart3,
        href: "/dashboard",
        color: "bg-blue-600",
        priority: 1
      }
    ];

    switch (user.role) {
      case 'desarrollador':
      case 'master':
        return [
          ...baseModules,
          {
            title: "Gestión de Usuarios",
            description: "Administrar perfiles y permisos del sistema",
            icon: Users,
            href: "/dashboard?tab=users",
            color: "bg-purple-600",
            priority: 2
          },
          {
            title: "Territorios",
            description: "Configuración completa de zonas electorales",
            icon: MapPin,
            href: "/dashboard?tab=territories",
            color: "bg-green-600",
            priority: 3
          },
          {
            title: "Sistema de Alertas",
            description: "Monitoreo y gestión de eventos críticos",
            icon: AlertTriangle,
            href: "/dashboard?tab=alerts",
            color: "bg-red-600",
            priority: 4
          },
          {
            title: "Informes Avanzados",
            description: "Reportes completos y análisis detallados",
            icon: FileText,
            href: "/informes",
            color: "bg-indigo-600",
            priority: 5
          },
          {
            title: "Configuración del Sistema",
            description: "Ajustes avanzados y configuraciones",
            icon: Settings,
            href: "/configuracion",
            color: "bg-gray-600",
            priority: 6
          }
        ];

      case 'candidato':
        return [
          ...baseModules,
          {
            title: "Red de Ayudantes",
            description: "Coordinación y gestión de estructura territorial",
            icon: Network,
            href: "/red-ayudantes",
            color: "bg-blue-700",
            priority: 2
          },
          {
            title: "Mi Equipo",
            description: "Gestionar colaboradores y líderes de campaña",
            icon: Users,
            href: "/dashboard?tab=users",
            color: "bg-indigo-600",
            priority: 3
          },
          {
            title: "Territorios de Campaña",
            description: "Supervisar zonas y estrategias electorales",
            icon: MapPin,
            href: "/dashboard?tab=territories",
            color: "bg-purple-600",
            priority: 4
          },
          {
            title: "Reportes de Campaña",
            description: "Análisis de progreso y resultados",
            icon: FileText,
            href: "/informes",
            color: "bg-cyan-600",
            priority: 5
          },
          {
            title: "Reporte de Publicidad",
            description: "Gestión de material promocional",
            icon: Camera,
            href: "/reporte-publicidad",
            color: "bg-orange-600",
            priority: 6
          }
        ];

      case 'lider':
        return [
          ...baseModules,
          {
            title: "Registrar Votante",
            description: "Incorporar nuevos colaboradores al equipo",
            icon: Users,
            href: "/registro",
            color: "bg-green-600",
            priority: 2
          },
          {
            title: "Mi Territorio",
            description: "Administrar zona electoral asignada",
            icon: MapPin,
            href: "/dashboard?tab=territories",
            color: "bg-purple-600",
            priority: 3
          },
          {
            title: "Ubicación Votantes",
            description: "Mapeo y seguimiento geográfico",
            icon: Navigation,
            href: "/ubicacion-votantes",
            color: "bg-indigo-700",
            priority: 4
          },
          {
            title: "Mensajería",
            description: "Comunicación con equipo y coordinadores",
            icon: MessageSquare,
            href: "/mensajes",
            color: "bg-blue-500",
            priority: 5
          },
          {
            title: "Lugar de Votación",
            description: "Información de puestos electorales",
            icon: Building2,
            href: "/lugar-votacion",
            color: "bg-sky-600",
            priority: 6
          }
        ];

      case 'votante':
        return [
          ...baseModules,
          {
            title: "Mis Actividades",
            description: "Tareas y eventos asignados",
            icon: FileText,
            href: "/dashboard",
            color: "bg-green-600",
            priority: 2
          },
          {
            title: "Mensajes",
            description: "Comunicación con coordinadores",
            icon: MessageSquare,
            href: "/mensajes",
            color: "bg-blue-500",
            priority: 3
          },
          {
            title: "Lugar de Votación",
            description: "Información electoral importante",
            icon: Building2,
            href: "/lugar-votacion",
            color: "bg-purple-600",
            priority: 4
          },
          {
            title: "Red de Colaboradores",
            description: "Conecta con otros miembros del equipo",
            icon: Network,
            href: "/red-ayudantes",
            color: "bg-indigo-600",
            priority: 5
          }
        ];
      case 'visitante':
        return [
          ...baseModules,
          {
            title: "Mapa de Alertas",
            description: "Información en tiempo real de tu comunidad",
            icon: MapPin,
            href: "/dashboard",
            color: "bg-orange-600",
            priority: 2
          },
          {
            title: "Conoce al Candidato",
            description: "Propuestas y contacto directo",
            icon: Users,
            href: "/candidato",
            color: "bg-purple-600",
            priority: 3
          },
          {
            title: "Tu Comunidad",
            description: "Conecta con vecinos y participa",
            icon: Network,
            href: "/comunidad",
            color: "bg-green-600",
            priority: 4
          },
          {
            title: "Eventos Públicos",
            description: "Actividades y encuentros ciudadanos",
            icon: Calendar,
            href: "/eventos-publicos",
            color: "bg-blue-600",
            priority: 5
          }
        ];

      default:
        return baseModules;
    }
  };

  const getRoleDisplayInfo = () => {
    switch (user.role) {
      case 'desarrollador':
        return {
          icon: Shield,
          title: "Desarrollador del Sistema",
          subtitle: "Control Total y Administración",
          color: "bg-red-600",
          description: "Acceso completo a todas las funcionalidades"
        };
      case 'master':
        return {
          icon: Shield,
          title: "Administrador Master",
          subtitle: "Gestión Completa de Campaña",
          color: "bg-purple-600",
          description: "Supervisión total de la estrategia electoral"
        };
      case 'candidato':
        return {
          icon: Crown,
          title: `Candidato ${user.name}`,
          subtitle: "Liderazgo y Coordinación",
          color: "bg-blue-600",
          description: "Dirección estratégica de la campaña"
        };
      case 'lider':
        return {
          icon: Star,
          title: `Líder Territorial`,
          subtitle: "Gestión de Zona Electoral",
          color: "bg-green-600",
          description: "Coordinación local y territorial"
        };
      case 'votante':
        return {
          icon: Users,
          title: "Colaborador Activo",
          subtitle: "Participación y Apoyo",
          color: "bg-indigo-600",
          description: "Contribución valiosa al equipo"
        };
      
      case 'visitante':
        return {
          icon: MapPin,
          title: "Visitante Bienvenido",
          subtitle: "Explora tu Comunidad",
          color: "bg-orange-600",
          description: "Descubre información pública de tu zona"
        };
      
      default:
        return {
          icon: Users,
          title: "Usuario",
          subtitle: "Mi Campaña 2025",
          color: "bg-gray-600",
          description: "Participante del sistema electoral"
        };
    }
  };

  const modules = getPersonalizedModules().sort((a, b) => a.priority - b.priority);
  const roleInfo = getRoleDisplayInfo();
  const RoleIcon = roleInfo.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      {/* Header personalizado del usuario */}
      <div className={`bg-gradient-to-r ${roleInfo.color} to-opacity-90 text-white shadow-lg`}>
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-xl overflow-hidden shadow-lg mb-4 bg-white border-4 border-white/20 flex items-center justify-center">
              <img 
                src="/lovable-uploads/83527a7a-6d3b-4edb-bdfc-312894177818.png" 
                alt="MI CAMPAÑA Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center gap-3 mb-3">
              <RoleIcon className="w-8 h-8 text-white" />
              <h1 className="text-3xl font-bold">{roleInfo.title}</h1>
            </div>
            <p className="text-xl opacity-90 mb-2">{roleInfo.subtitle}</p>
            <p className="text-lg opacity-80 mb-4">{roleInfo.description}</p>
            <Badge className="bg-white/20 text-white border-white/30 text-lg px-4 py-2">
              MI CAMPAÑA 2025 - {user.role.toUpperCase()}
            </Badge>
          </div>
        </div>
      </div>

      {/* Módulos personalizados */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          Panel Personalizado
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Herramientas específicas para tu rol en la campaña
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {modules.map((module, index) => (
            <Link key={index} to={module.href}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer border border-gray-200 shadow-sm group">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-lg ${module.color} flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow`}>
                      <module.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-gray-800 group-hover:text-gray-900 transition-colors">
                        {module.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 group-hover:text-gray-700 transition-colors">
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
            <Button size="lg" className={`rounded-lg ${roleInfo.color} hover:opacity-90 shadow-sm hover:shadow-md transition-all`}>
              <Facebook className="w-6 h-6" />
            </Button>
          </a>
          <a 
            href="https://www.instagram.com/micampanaia/" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button size="lg" className={`rounded-lg ${roleInfo.color} hover:opacity-90 shadow-sm hover:shadow-md transition-all`}>
              <Instagram className="w-6 h-6" />
            </Button>
          </a>
          <Button size="lg" className={`rounded-lg ${roleInfo.color} hover:opacity-90 shadow-sm hover:shadow-md transition-all`}>
            <Music className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
