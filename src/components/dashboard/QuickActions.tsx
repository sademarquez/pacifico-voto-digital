
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  MessageSquare, 
  MapPin, 
  Calendar, 
  Users,
  Phone,
  Share2,
  FileText,
  Award
} from "lucide-react";

const QuickActions = () => {
  const actions = [
    {
      title: "Centro de Mensajes",
      description: "Chat del equipo y comunicaciones",
      icon: MessageSquare,
      color: "text-blue-600",
      bgColor: "bg-blue-50 hover:bg-blue-100",
      borderColor: "border-blue-200",
      link: "/mensajes",
      notifications: 3
    },
    {
      title: "Mi Mesa de Votación",
      description: "Información de tu lugar de votación",
      icon: MapPin,
      color: "text-green-600",
      bgColor: "bg-green-50 hover:bg-green-100",
      borderColor: "border-green-200",
      link: "/lugar-votacion"
    },
    {
      title: "Calendario de Eventos",
      description: "Próximas actividades y reuniones",
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-50 hover:bg-purple-100",
      borderColor: "border-purple-200",
      link: "/eventos",
      notifications: 2
    },
    {
      title: "Mi Barrio",
      description: "Comunidad local y territorio",
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-50 hover:bg-orange-100",
      borderColor: "border-orange-200",
      link: "/mi-territorio"
    },
    {
      title: "Contacto Directo",
      description: "Línea directa con líderes",
      icon: Phone,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50 hover:bg-indigo-100",
      borderColor: "border-indigo-200",
      link: "/contacto"
    },
    {
      title: "Compartir Campaña",
      description: "Difunde nuestro mensaje",
      icon: Share2,
      color: "text-pink-600",
      bgColor: "bg-pink-50 hover:bg-pink-100",
      borderColor: "border-pink-200",
      link: "/compartir"
    },
    {
      title: "Mis Informes",
      description: "Reportes de actividad personal",
      icon: FileText,
      color: "text-slate-600",
      bgColor: "bg-slate-50 hover:bg-slate-100",
      borderColor: "border-slate-200",
      link: "/mis-informes"
    },
    {
      title: "Sistema de Logros",
      description: "Reconocimientos y medallas",
      icon: Award,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 hover:bg-yellow-100",
      borderColor: "border-yellow-200",
      link: "/logros"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Acciones Rápidas
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Accede rápidamente a todas las herramientas y funciones que necesitas para 
          maximizar tu participación en nuestra campaña electoral.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Link key={index} to={action.link}>
              <Card className={`${action.bgColor} ${action.borderColor} border-2 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer relative overflow-hidden`}>
                <CardContent className="p-4 text-center relative">
                  {action.notifications && (
                    <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">
                      {action.notifications}
                    </Badge>
                  )}
                  
                  <div className="mb-3">
                    <div className="w-12 h-12 mx-auto bg-white rounded-full shadow-md flex items-center justify-center">
                      <Icon className={`w-6 h-6 ${action.color}`} />
                    </div>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                    {action.title}
                  </h3>
                  
                  <p className="text-xs text-gray-600 leading-tight">
                    {action.description}
                  </p>

                  <Button 
                    className={`mt-3 w-full text-xs py-2 h-8 ${action.color.replace('text', 'bg').replace('600', '600')} hover:${action.color.replace('text', 'bg').replace('600', '700')} text-white shadow-sm`}
                    size="sm"
                  >
                    Acceder
                  </Button>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Sección de ayuda */}
      <Card className="bg-gradient-to-r from-gray-50 to-white border-gray-200 mt-8">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <MessageSquare className="w-6 h-6 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              ¿Necesitas Ayuda?
            </h3>
          </div>
          <p className="text-gray-600 mb-4">
            Si tienes dudas sobre cómo usar alguna función o necesitas asistencia, 
            nuestro equipo está aquí para apoyarte en cada paso.
          </p>
          <div className="flex gap-3 justify-center">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Phone className="w-4 h-4 mr-2" />
              Contactar Soporte
            </Button>
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
              <FileText className="w-4 h-4 mr-2" />
              Guía de Usuario
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickActions;
