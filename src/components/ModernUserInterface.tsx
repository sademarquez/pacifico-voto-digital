
import { useState, useEffect } from 'react';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  MapPin, 
  AlertTriangle, 
  Calendar,
  Target,
  TrendingUp,
  CheckCircle,
  MessageSquare,
  Zap,
  Settings,
  BarChart3,
  UserPlus,
  Building2,
  Clock
} from 'lucide-react';

const ModernUserInterface = () => {
  const { user } = useSimpleAuth();
  const [activeStats, setActiveStats] = useState({
    totalUsers: 0,
    activeAlerts: 0,
    completedTasks: 0,
    upcomingEvents: 0
  });

  useEffect(() => {
    // Simular carga de estadísticas
    const loadStats = async () => {
      // En producción estas vendrían de la API
      setActiveStats({
        totalUsers: 125,
        activeAlerts: 3,
        completedTasks: 47,
        upcomingEvents: 8
      });
    };

    loadStats();
  }, []);

  const getRoleSpecificActions = () => {
    if (!user) return [];

    const commonActions = [
      { icon: MessageSquare, label: 'Mensajes', color: 'bg-blue-500', path: '/mensajes' },
      { icon: Calendar, label: 'Eventos', color: 'bg-green-500', path: '/events' },
    ];

    switch (user.role) {
      case 'desarrollador':
        return [
          ...commonActions,
          { icon: Settings, label: 'Configuración', color: 'bg-purple-500', path: '/configuracion' },
          { icon: BarChart3, label: 'Analytics', color: 'bg-indigo-500', path: '/analytics' },
          { icon: AlertTriangle, label: 'Logs', color: 'bg-red-500', path: '/logs' }
        ];
      
      case 'master':
        return [
          ...commonActions,
          { icon: UserPlus, label: 'Usuarios', color: 'bg-orange-500', path: '/usuarios' },
          { icon: AlertTriangle, label: 'Alertas', color: 'bg-red-500', path: '/alertas' },
          { icon: Building2, label: 'Territorios', color: 'bg-teal-500', path: '/territorios' }
        ];
      
      case 'candidato':
      case 'lider':
        return [
          ...commonActions,
          { icon: Target, label: 'Objetivos', color: 'bg-yellow-500', path: '/objetivos' },
          { icon: TrendingUp, label: 'Progreso', color: 'bg-green-600', path: '/progreso' },
          { icon: Users, label: 'Equipos', color: 'bg-blue-600', path: '/equipos' }
        ];
      
      default:
        return commonActions;
    }
  };

  const getWelcomeMessage = () => {
    if (!user) return "Bienvenido";
    
    const timeOfDay = new Date().getHours();
    let greeting = "Buen día";
    
    if (timeOfDay >= 12 && timeOfDay < 18) {
      greeting = "Buenas tardes";
    } else if (timeOfDay >= 18 || timeOfDay < 6) {
      greeting = "Buenas noches";
    }
    
    return `${greeting}, ${user.name}`;
  };

  const roleSpecificActions = getRoleSpecificActions();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header de bienvenida */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            {getWelcomeMessage()}
          </h1>
          <p className="text-slate-600 text-lg">
            Panel de control - MI CAMPAÑA 2025
          </p>
          <Badge className="mt-2 bg-blue-100 text-blue-800 border-blue-300 capitalize">
            {user?.role}
          </Badge>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Total Usuarios</p>
                  <p className="text-3xl font-bold text-slate-800">{activeStats.totalUsers}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Alertas Activas</p>
                  <p className="text-3xl font-bold text-slate-800">{activeStats.activeAlerts}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Tareas Completadas</p>
                  <p className="text-3xl font-bold text-slate-800">{activeStats.completedTasks}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Próximos Eventos</p>
                  <p className="text-3xl font-bold text-slate-800">{activeStats.upcomingEvents}</p>
                </div>
                <Calendar className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Acciones rápidas específicas por rol */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Acciones Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {roleSpecificActions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center gap-2 hover:shadow-md transition-all"
                    onClick={() => {
                      // Aquí se implementaría la navegación
                      console.log(`Navegando a ${action.path}`);
                    }}
                  >
                    <div className={`w-8 h-8 rounded-full ${action.color} flex items-center justify-center`}>
                      <IconComponent className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium">{action.label}</span>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Panel de actividad reciente */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Actividad Reciente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Tarea completada</p>
                    <p className="text-xs text-slate-500">Hace 2 horas</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Nuevo mensaje recibido</p>
                    <p className="text-xs text-slate-500">Hace 4 horas</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-purple-500 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Evento programado</p>
                    <p className="text-xs text-slate-500">Hace 6 horas</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Métricas de Rendimiento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Objetivos Completados</span>
                    <span className="text-sm text-slate-500">78%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Participación del Equipo</span>
                    <span className="text-sm text-slate-500">85%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Efectividad de Campaña</span>
                    <span className="text-sm text-slate-500">92%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ModernUserInterface;
