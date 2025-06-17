
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
          color: "bg-gradient-elegant",
          description: "Acceso completo a todas las funcionalidades"
        };
      case 'master':
        return {
          icon: Shield,
          title: "Administrador Master",
          subtitle: "Gestión Completa de Campaña",
          color: "bg-gradient-elegant",
          description: "Supervisión total de la estrategia electoral"
        };
      case 'candidato':
        return {
          icon: Crown,
          title: `Candidato ${user.name}`,
          subtitle: "Liderazgo y Coordinación",
          color: "bg-gradient-blue",
          description: "Dirección estratégica de la campaña"
        };
      case 'lider':
        return {
          icon: Star,
          title: `Líder Territorial`,
          subtitle: "Gestión de Zona Electoral",
          color: "bg-gradient-gold",
          description: "Coordinación local y territorial"
        };
      case 'votante':
        return {
          icon: Users,
          title: "Colaborador Activo",
          subtitle: "Participación y Apoyo",
          color: "bg-gradient-blue",
          description: "Contribución valiosa al equipo"
        };
      
      case 'visitante':
        return {
          icon: MapPin,
          title: "Visitante Bienvenido",
          subtitle: "Explora tu Comunidad",
          color: "bg-gradient-black",
          description: "Descubre información pública de tu zona"
        };
      
      default:
        return {
          icon: Users,
          title: "Usuario",
          subtitle: "Mi Campaña 2025",
          color: "bg-gradient-elegant",
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
      <div className={`${roleInfo.color} text-white shadow-elegant relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-20 decorative-lines"></div>
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-xl overflow-hidden shadow-gold mb-4 bg-white/10 border-4 border-gold/30 flex items-center justify-center backdrop-blur-sm">
              <img 
                src="/lovable-uploads/83527a7a-6d3b-4edb-bdfc-312894177818.png" 
                alt="MI CAMPAÑA Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center gap-3 mb-3">
              <RoleIcon className="w-8 h-8 text-gold animate-glow-gold" />
              <h1 className="text-3xl font-bold text-gold">{roleInfo.title}</h1>
            </div>
            <p className="text-xl opacity-90 mb-2">{roleInfo.subtitle}</p>
            <p className="text-lg opacity-80 mb-4">{roleInfo.description}</p>
            <Badge className="bg-gold/20 text-gold border-gold/30 text-lg px-4 py-2 font-bold">
              MI CAMPAÑA 2025 - {user.role.toUpperCase()}
            </Badge>
          </div>
        </div>
      </div>

      {/* Módulos personalizados */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-black-elegant mb-2 text-center">
          Panel Personalizado
        </h2>
        <p className="text-black-soft text-center mb-8">
          Herramientas específicas para tu rol en la campaña
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {modules.map((module, index) => (
            <Link key={index} to={module.href}>
              <Card className="h-full hover:shadow-elegant transition-all duration-300 hover:scale-[1.02] cursor-pointer border border-gold/20 shadow-sm group card-elegant">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-lg ${module.color} flex items-center justify-center shadow-gold group-hover:shadow-gold-dark transition-shadow animate-float`}>
                      <module.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-black-elegant group-hover:text-gold transition-colors">
                        {module.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-black-soft group-hover:text-black-elegant transition-colors">
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
            <Button size="lg" className="rounded-lg bg-black-elegant hover:bg-black-soft text-gold shadow-elegant hover:shadow-gold transition-all hover-glow">
              <Facebook className="w-6 h-6" />
            </Button>
          </a>
          <a 
            href="https://www.instagram.com/micampanaia/" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button size="lg" className="rounded-lg bg-blue-primary hover:bg-blue-secondary text-gold shadow-elegant hover:shadow-blue-glow transition-all hover-glow">
              <Instagram className="w-6 h-6" />
            </Button>
          </a>
          <Button size="lg" className="rounded-lg bg-gold hover:bg-gold-dark text-white shadow-elegant hover:shadow-gold-dark transition-all hover-glow">
            <Music className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
