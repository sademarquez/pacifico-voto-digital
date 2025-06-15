
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "../contexts/AuthContext";
import { useDataSegregation } from "../hooks/useDataSegregation";
import { Link } from "react-router-dom";
import { 
  Plus, 
  Users, 
  MapPin, 
  AlertTriangle,
  Calendar,
  MessageSquare,
  Settings,
  BarChart3,
  FileText,
  Network
} from "lucide-react";

const PersonalizedActions = () => {
  const { user } = useAuth();
  const { getPermissions } = useDataSegregation();

  const permissions = getPermissions();

  const getActionsConfig = () => {
    switch (user?.role) {
      case 'desarrollador':
      case 'master':
        return [
          { title: 'Gestionar Usuarios', description: 'Administrar perfiles y permisos', icon: Users, href: '/dashboard?tab=users', color: 'bg-blue-600' },
          { title: 'Territorios', description: 'Configurar zonas electorales', icon: MapPin, href: '/dashboard?tab=territories', color: 'bg-purple-600' },
          { title: 'Sistema de Alertas', description: 'Monitorear eventos críticos', icon: AlertTriangle, href: '/dashboard?tab=alerts', color: 'bg-red-600' },
          { title: 'Configuración', description: 'Ajustes del sistema', icon: Settings, href: '/configuracion', color: 'bg-gray-600' }
        ];
      case 'candidato':
        return [
          { title: 'Mi Equipo', description: 'Gestionar colaboradores', icon: Users, href: '/dashboard?tab=users', color: 'bg-blue-600' },
          { title: 'Red de Ayudantes', description: 'Coordinar estructura territorial', icon: Network, href: '/red-ayudantes', color: 'bg-indigo-600' },
          { title: 'Crear Evento', description: 'Programar actividades', icon: Calendar, href: '/dashboard?tab=events', color: 'bg-green-600' },
          { title: 'Reportes', description: 'Análisis de campaña', icon: BarChart3, href: '/informes', color: 'bg-orange-600' }
        ];
      case 'lider':
        return [
          { title: 'Registrar Votante', description: 'Añadir nuevos colaboradores', icon: Plus, href: '/registro', color: 'bg-green-600' },
          { title: 'Mi Territorio', description: 'Gestionar zona asignada', icon: MapPin, href: '/dashboard?tab=territories', color: 'bg-purple-600' },
          { title: 'Mensajes', description: 'Comunicación con equipo', icon: MessageSquare, href: '/mensajes', color: 'bg-blue-600' },
          { title: 'Crear Alerta', description: 'Reportar situaciones', icon: AlertTriangle, href: '/dashboard?tab=alerts', color: 'bg-red-600' }
        ];
      case 'votante':
        return [
          { title: 'Mis Tareas', description: 'Ver actividades asignadas', icon: FileText, href: '/dashboard', color: 'bg-blue-600' },
          { title: 'Eventos', description: 'Próximas actividades', icon: Calendar, href: '/dashboard', color: 'bg-green-600' },
          { title: 'Mensajes', description: 'Comunicación', icon: MessageSquare, href: '/mensajes', color: 'bg-purple-600' },
          { title: 'Mi Progreso', description: 'Ver contribuciones', icon: BarChart3, href: '/dashboard', color: 'bg-orange-600' }
        ];
      default:
        return [];
    }
  };

  const actionsConfig = getActionsConfig();

  if (actionsConfig.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Acciones Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {actionsConfig.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link key={index} to={action.href}>
                <div className="p-4 border rounded-lg hover:shadow-md transition-all duration-200 hover:scale-[1.02] cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{action.title}</h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalizedActions;
