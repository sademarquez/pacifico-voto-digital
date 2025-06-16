import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import {
  Users,
  MapPin,
  Calendar,
  Target,
  TrendingUp,
  CheckCircle,
  MessageSquare,
  Zap,
  Heart,
  ArrowRight,
  Award,
  Globe,
  Newspaper,
  Code,
  Bug,
  Database,
  Server,
  Terminal,
  Cpu,
  Memory,
  Network,
  Cloud,
  Lock,
  Eye,
  Wifi,
  Battery,
  Monitor,
  Shield,
  Smartphone,
  Gauge,
  Layers
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ModernUserInterface = () => {
  const { user } = useSimpleAuth();
  const [systemStats, setSystemStats] = useState({
    cpuUsage: 65,
    memoryUsage: 78,
    networkTraffic: 120,
    databaseSize: 560,
    apiResponseTime: 0.045,
    activeUsers: 2840,
    openAlerts: 12
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStats(prev => ({
        cpuUsage: Math.min(100, prev.cpuUsage + Math.random() * 5 - 2.5),
        memoryUsage: Math.min(100, prev.memoryUsage + Math.random() * 4 - 2),
        networkTraffic: prev.networkTraffic + Math.random() * 20 - 10,
        databaseSize: prev.databaseSize + Math.random() * 50,
        apiResponseTime: Math.max(0.01, prev.apiResponseTime + Math.random() * 0.005 - 0.0025),
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10 - 5),
        openAlerts: Math.max(0, prev.openAlerts + Math.floor(Math.random() * 3 - 1.5))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getRoleBasedActions = () => {
    switch (user?.role) {
      case 'desarrollador':
        return [
          { title: 'Código Base', description: 'Acceder al código fuente', icon: Code, href: '/dashboard?tab=code' },
          { title: 'Logs del Sistema', description: 'Ver registros de actividad', icon: Terminal, href: '/dashboard?tab=logs' },
          { title: 'Base de Datos', description: 'Gestionar la base de datos', icon: Database, href: '/dashboard?tab=db' },
          { title: 'Configuración', description: 'Ajustes del sistema', icon: Settings, href: '/configuracion' }
        ];
      case 'master':
        return [
          { title: 'Estrategia', description: 'Planificar la campaña', icon: Target, href: '/dashboard?tab=strategy' },
          { title: 'Reportes', description: 'Ver informes de progreso', icon: BarChart3, href: '/informes' },
          { title: 'Red de Ayuda', description: 'Gestionar voluntarios', icon: Network, href: '/red-ayudantes' },
          { title: 'Alertas', description: 'Monitorear alertas críticas', icon: AlertTriangle, href: '/dashboard?tab=alerts' }
        ];
      case 'candidato':
        return [
          { title: 'Eventos', description: 'Programar eventos', icon: Calendar, href: '/dashboard?tab=events' },
          { title: 'Mensajes', description: 'Enviar mensajes al equipo', icon: MessageSquare, href: '/mensajes' },
          { title: 'Publicidad', description: 'Gestionar anuncios', icon: Newspaper, href: '/reporte-publicidad' },
          { title: 'Liderazgo', description: 'Gestionar el equipo', icon: Users, href: '/liderazgo' }
        ];
      case 'lider':
        return [
          { title: 'Votantes', description: 'Registrar votantes', icon: UserPlus, href: '/registro' },
          { title: 'Territorio', description: 'Gestionar territorio', icon: MapPin, href: '/dashboard?tab=territories' },
          { title: 'Alertas', description: 'Reportar alertas', icon: AlertTriangle, href: '/dashboard?tab=alerts' },
          { title: 'Lugar de Votación', description: 'Ver centros de votación', icon: Building2, href: '/lugar-votacion' }
        ];
      case 'votante':
        return [
          { title: 'Eventos', description: 'Ver eventos', icon: Calendar, href: '/dashboard?tab=events' },
          { title: 'Chat', description: 'Chatear con el equipo', icon: MessageSquare, href: '/mensajes' },
          { title: 'Progreso', description: 'Ver mi progreso', icon: TrendingUp, href: '/dashboard' },
          { title: 'Invitar', description: 'Invitar amigos', icon: Users, href: '/dashboard' }
        ];
      default:
        return [];
    }
  };

  const roleBasedActions = getRoleBasedActions();

  return (
    <div className="space-y-6">
      {/* Header con información del usuario */}
      <Card className="campaign-card p-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 border-2 border-blue-200 animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-modern-lg animate-pulse-glow">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold gradient-text-primary">
                ¡Bienvenido, {user?.name}! 🚀
              </h1>
              <p className="text-lg text-gray-700 font-medium">
                Panel de control - MI CAMPAÑA 2025
              </p>
              <div className="flex gap-2 mt-2">
                <Badge className="bg-green-100 text-green-800 border-green-300">
                  {user?.role?.toUpperCase()}
                </Badge>
                <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                  <Zap className="w-4 h-4 mr-1" />
                  IA Activada
                </Badge>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Button className="btn-modern-primary">
              <Globe className="w-4 h-4 mr-2" />
              Explorar Zona
            </Button>
            <Button variant="outline">
              <Heart className="w-4 h-4 mr-2" />
              Unirse Oficial
            </Button>
          </div>
        </div>

        {/* Estadísticas rápidas generales */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-blue-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">2,840</p>
              <p className="text-sm text-gray-600">Territorios</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">100K+</p>
              <p className="text-sm text-gray-600">Usuarios Activos</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">94%</p>
              <p className="text-sm text-gray-600">Éxito Rate</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Acciones rápidas personalizadas */}
      <Card className="campaign-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600" />
            Acciones Rápidas - {user?.role?.toUpperCase()}
          </CardTitle>
          <p className="text-sm text-gray-600">
            Herramientas específicas para tu rol en la campaña
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roleBasedActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link key={index} to={action.href}>
                  <div className="p-4 border rounded-lg hover:shadow-md transition-all duration-200 hover:scale-[1.02] cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-blue-600" />
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

      {/* Tabs para diferentes secciones */}
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="bg-transparent">
          <TabsTrigger value="general" className="data-[state=active]:text-blue-600 data-[state=active]:bg-blue-50">
            General
          </TabsTrigger>
          <TabsTrigger value="system" className="data-[state=active]:text-green-600 data-[state=active]:bg-green-50">
            Sistema
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:text-red-600 data-[state=active]:bg-red-50">
            Seguridad
          </TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="space-y-2">
          <Card className="campaign-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-600" />
                Información General
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Aquí puedes ver información general de la campaña.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="system" className="space-y-2">
          <Card className="campaign-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-green-600" />
                Estado del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-gray-600 text-sm">CPU Usage</p>
                <p className="text-2xl font-bold text-green-600">{systemStats.cpuUsage}%</p>
                <Progress value={systemStats.cpuUsage} className="mt-2" />
              </div>
              <div className="text-center">
                <p className="text-gray-600 text-sm">Memory Usage</p>
                <p className="text-2xl font-bold text-green-600">{systemStats.memoryUsage}%</p>
                <Progress value={systemStats.memoryUsage} className="mt-2" />
              </div>
              <div className="text-center">
                <p className="text-gray-600 text-sm">Network Traffic</p>
                <p className="text-2xl font-bold text-green-600">{systemStats.networkTraffic} MB</p>
              </div>
              <div className="text-center">
                <p className="text-gray-600 text-sm">Database Size</p>
                <p className="text-2xl font-bold text-green-600">{systemStats.databaseSize} MB</p>
              </div>
              <div className="text-center">
                <p className="text-gray-600 text-sm">API Response Time</p>
                <p className="text-2xl font-bold text-green-600">{systemStats.apiResponseTime}s</p>
              </div>
              <div className="text-center">
                <p className="text-gray-600 text-sm">Active Users</p>
                <p className="text-2xl font-bold text-green-600">{systemStats.activeUsers}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="security" className="space-y-2">
          <Card className="campaign-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-red-600" />
                Estado de Seguridad
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Firewall</p>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <p className="font-medium">Activo</p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Antivirus</p>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <p className="font-medium">Actualizado</p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Alertas de Seguridad</p>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <p className="font-medium">{systemStats.openAlerts} Alertas Abiertas</p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Último Escaneo</p>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-500" />
                    <p className="font-medium">Hace 2 horas</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ModernUserInterface;
