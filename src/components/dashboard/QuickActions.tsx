
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Users, 
  MessageSquare, 
  Calendar, 
  BarChart3, 
  AlertTriangle,
  MapPin,
  UserPlus,
  Vote,
  Settings,
  FileText,
  Network,
  Zap,
  Target,
  TrendingUp,
  Crown,
  Shield,
  Building2,
  Mail
} from "lucide-react";
import { Link } from "react-router-dom";
import { useSimpleAuth } from "../../contexts/SimpleAuthContext";
import { useDataSegregation } from "../../hooks/useDataSegregation";

const QuickActions = () => {
  const { user } = useSimpleAuth();
  const { getPermissions } = useDataSegregation();

  const permissions = getPermissions();

  const getActionsConfig = () => {
    switch (user?.role) {
      case 'desarrollador':
        return [
          { title: 'Panel de Control', description: 'Administración completa del sistema', icon: Shield, href: '/dashboard?tab=users', color: 'bg-red-600', urgent: true },
          { title: 'Gestión de Usuarios', description: 'Crear y administrar perfiles', icon: Users, href: '/dashboard?tab=users', color: 'bg-purple-600', urgent: false },
          { title: 'Configuración Sistema', description: 'Ajustes avanzados y seguridad', icon: Settings, href: '/configuracion', color: 'bg-gray-600', urgent: false },
          { title: 'Logs y Monitoreo', description: 'Supervisión del sistema', icon: BarChart3, href: '/informes', color: 'bg-blue-600', urgent: false },
          { title: 'Base de Datos', description: 'Gestión de datos críticos', icon: FileText, href: '/dashboard?tab=territories', color: 'bg-indigo-600', urgent: false },
          { title: 'Sistema de Alertas', description: 'Monitoreo de eventos críticos', icon: AlertTriangle, href: '/dashboard?tab=alerts', color: 'bg-red-500', urgent: true }
        ];
        
      case 'master':
        return [
          { title: 'Gestión de Candidatos', description: 'Administrar candidatos y campañas', icon: Crown, href: '/dashboard?tab=users', color: 'bg-purple-600', urgent: true },
          { title: 'Estrategia General', description: 'Planificación y coordinación', icon: Target, href: '/dashboard?tab=territories', color: 'bg-blue-600', urgent: false },
          { title: 'Reportes Ejecutivos', description: 'Análisis y métricas globales', icon: BarChart3, href: '/informes', color: 'bg-green-600', urgent: false },
          { title: 'Red de Comunicación', description: 'Mensajería masiva y coordinación', icon: Network, href: '/red-ayudantes', color: 'bg-indigo-600', urgent: false },
          { title: 'Supervisión de Alertas', description: 'Monitoreo de situaciones críticas', icon: AlertTriangle, href: '/dashboard?tab=alerts', color: 'bg-red-600', urgent: true },
          { title: 'Eventos Estratégicos', description: 'Coordinación de eventos principales', icon: Calendar, href: '/dashboard?tab=events', color: 'bg-orange-600', urgent: false }
        ];
        
      case 'candidato':
        return [
          { title: 'Mi Equipo de Campaña', description: 'Gestionar líderes y colaboradores', icon: Users, href: '/dashboard?tab=users', color: 'bg-blue-600', urgent: true },
          { title: 'Red de Ayudantes', description: 'Coordinar estructura territorial', icon: Network, href: '/red-ayudantes', color: 'bg-indigo-600', urgent: true },
          { title: 'Eventos de Campaña', description: 'Programar actividades públicas', icon: Calendar, href: '/dashboard?tab=events', color: 'bg-green-600', urgent: false },
          { title: 'Reportes de Progreso', description: 'Analytics y métricas de campaña', icon: BarChart3, href: '/informes', color: 'bg-orange-600', urgent: false },
          { title: 'Comunicación Directa', description: 'Mensajes a líderes y votantes', icon: MessageSquare, href: '/mensajes', color: 'bg-purple-600', urgent: false },
          { title: 'Reporte de Publicidad', description: 'Gestionar contenido y medios', icon: Mail, href: '/reporte-publicidad', color: 'bg-pink-600', urgent: false }
        ];
        
      case 'lider':
        return [
          { title: 'Registrar Votantes', description: 'Añadir nuevos simpatizantes', icon: UserPlus, href: '/registro', color: 'bg-green-600', urgent: true },
          { title: 'Mi Territorio', description: 'Gestionar zona asignada', icon: MapPin, href: '/dashboard?tab=territories', color: 'bg-purple-600', urgent: true },
          { title: 'Ubicar Votantes', description: 'Mapear y organizar base electoral', icon: Vote, href: '/ubicacion-votantes', color: 'bg-blue-600', urgent: false },
          { title: 'Crear Alertas', description: 'Reportar situaciones importantes', icon: AlertTriangle, href: '/dashboard?tab=alerts', color: 'bg-red-600', urgent: false },
          { title: 'Mensajes del Equipo', description: 'Comunicación con coordinadores', icon: MessageSquare, href: '/mensajes', color: 'bg-indigo-600', urgent: false },
          { title: 'Lugar de Votación', description: 'Información de mesas electorales', icon: Building2, href: '/lugar-votacion', color: 'bg-orange-600', urgent: false }
        ];
        
      case 'votante':
        return [
          { title: 'Mis Tareas Activas', description: 'Ver y completar actividades', icon: FileText, href: '/dashboard', color: 'bg-blue-600', urgent: true },
          { title: 'Próximos Eventos', description: 'Actividades de la campaña', icon: Calendar, href: '/dashboard', color: 'bg-green-600', urgent: true },
          { title: 'Chat del Equipo', description: 'Comunicación con líderes', icon: MessageSquare, href: '/mensajes', color: 'bg-purple-600', urgent: false },
          { title: 'Mi Mesa Electoral', description: 'Información de votación', icon: Vote, href: '/lugar-votacion', color: 'bg-orange-600', urgent: false },
          { title: 'Mi Progreso', description: 'Ver contribuciones y logros', icon: BarChart3, href: '/dashboard', color: 'bg-indigo-600', urgent: false },
          { title: 'Invitar Amigos', description: 'Expandir la red de apoyo', icon: Users, href: '/dashboard', color: 'bg-pink-600', urgent: false }
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
          <Zap className="w-5 h-5 text-blue-600" />
          Acciones Rápidas - {user?.role?.toUpperCase()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {actionsConfig.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link key={index} to={action.href}>
                <div className={`p-4 border rounded-lg hover:shadow-md transition-all duration-200 hover:scale-[1.02] cursor-pointer relative ${action.urgent ? 'border-red-200 bg-red-50' : 'hover:bg-gray-50'}`}>
                  {action.urgent && (
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                  )}
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-lg ${action.color}  flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">{action.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{action.description}</p>
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

export default QuickActions;
