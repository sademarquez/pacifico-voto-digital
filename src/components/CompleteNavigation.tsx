
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Users, 
  MapPin, 
  BarChart3, 
  Calendar, 
  MessageSquare, 
  Settings, 
  Shield, 
  UserPlus,
  TrendingUp,
  Bell,
  FileText,
  Zap,
  ChevronRight,
  Crown
} from 'lucide-react';
import { useSecureAuth } from '@/contexts/SecureAuthContext';
import { useToast } from '@/hooks/use-toast';

export const CompleteNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSecureAuth();
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);

  const navigationItems = [
    {
      id: 'dashboard',
      title: 'Dashboard Principal',
      description: 'Vista general del sistema electoral',
      icon: Home,
      path: '/dashboard',
      roles: ['desarrollador', 'master', 'candidato', 'lider', 'votante'],
      color: 'bg-verde-sistema-600'
    },
    {
      id: 'registro',
      title: 'Registro de Votantes',
      description: 'Gestión completa de base de datos electoral',
      icon: UserPlus,
      path: '/registro',
      roles: ['desarrollador', 'master', 'candidato', 'lider'],
      color: 'bg-negro-800'
    },
    {
      id: 'mapa-alertas',
      title: 'Mapa y Alertas',
      description: 'Monitoreo territorial en tiempo real',
      icon: MapPin,
      path: '/mapa-alertas',
      roles: ['desarrollador', 'master', 'candidato', 'lider'],
      color: 'bg-rojo-acento-600'
    },
    {
      id: 'mensajeria',
      title: 'Centro de Mensajería',
      description: 'WhatsApp, Email y SMS masivos',
      icon: MessageSquare,
      path: '/mensajeria',
      roles: ['desarrollador', 'master', 'candidato'],
      color: 'bg-verde-sistema-700'
    },
    {
      id: 'analytics',
      title: 'Analytics Avanzado',
      description: 'Reportes y métricas electorales',
      icon: BarChart3,
      path: '/analytics',
      roles: ['desarrollador', 'master', 'candidato', 'lider'],
      color: 'bg-negro-700'
    },
    {
      id: 'eventos',
      title: 'Coordinación de Eventos',
      description: 'Gestión de actividades de campaña',
      icon: Calendar,
      path: '/eventos',
      roles: ['desarrollador', 'master', 'candidato', 'lider'],
      color: 'bg-rojo-acento-700'
    },
    {
      id: 'liderazgo',
      title: 'Estructura de Liderazgo',
      description: 'Jerarquía y gestión de equipos',
      icon: Crown,
      path: '/liderazgo',
      roles: ['desarrollador', 'master', 'candidato'],
      color: 'bg-verde-sistema-800'
    },
    {
      id: 'reportes',
      title: 'Centro de Reportes',
      description: 'Informes ejecutivos y operativos',
      icon: FileText,
      path: '/reportes',
      roles: ['desarrollador', 'master', 'candidato'],
      color: 'bg-negro-600'
    },
    {
      id: 'n8n-manager',
      title: 'Gestor N8N',
      description: 'Configuración de automatizaciones',
      icon: Zap,
      path: '/n8n-manager',
      roles: ['desarrollador', 'master'],
      color: 'bg-rojo-acento-800'
    },
    {
      id: 'configuracion',
      title: 'Configuración Sistema',
      description: 'Ajustes generales y administración',
      icon: Settings,
      path: '/configuracion',
      roles: ['desarrollador', 'master'],
      color: 'bg-negro-900'
    }
  ];

  const handleNavigate = (path: string, title: string) => {
    console.log(`🎯 NAVEGANDO A: ${path} - ${title}`);
    navigate(path);
    toast({
      title: "Navegación",
      description: `Accediendo a ${title}`,
    });
  };

  const hasAccess = (roles: string[]) => {
    return user?.role && roles.includes(user.role);
  };

  const availableItems = navigationItems.filter(item => hasAccess(item.roles));
  const currentPath = location.pathname;

  return (
    <div className="space-y-6">
      <Card className="border-2 border-verde-sistema-200 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-negro-900">
            <Shield className="w-6 h-6 text-verde-sistema-600" />
            Sistema de Navegación Completo
            <Badge className="bg-verde-sistema-600 text-white">
              {availableItems.length} módulos disponibles
            </Badge>
          </CardTitle>
          <p className="text-negro-600">
            Acceso completo para rol: <strong>{user?.role}</strong> - {user?.name}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              
              return (
                <Button
                  key={item.id}
                  onClick={() => handleNavigate(item.path, item.title)}
                  className={`${item.color} hover:opacity-90 text-white p-6 h-auto flex flex-col items-start justify-start space-y-3 text-left transition-all duration-300 ${
                    isActive ? 'ring-4 ring-verde-sistema-400 scale-105' : 'hover:scale-105'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <Icon className="w-8 h-8" />
                    <ChevronRight className="w-5 h-5 opacity-70" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-lg">{item.title}</p>
                    <p className="text-sm opacity-90 leading-relaxed">{item.description}</p>
                  </div>
                  {isActive && (
                    <Badge className="bg-white/20 text-white text-xs">
                      Página Actual
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-verde-sistema-50 rounded-lg border-2 border-verde-sistema-200">
            <h3 className="font-bold text-verde-sistema-800 mb-2">🎯 Estado del Sistema</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-verde-sistema-500 rounded-full"></div>
                <span className="text-negro-700">Autenticación: ✅</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-verde-sistema-500 rounded-full"></div>
                <span className="text-negro-700">Base Datos: ✅</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-rojo-acento-500 rounded-full"></div>
                <span className="text-negro-700">N8N: ⚙️ Config</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-verde-sistema-500 rounded-full"></div>
                <span className="text-negro-700">Navegación: ✅</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompleteNavigation;
