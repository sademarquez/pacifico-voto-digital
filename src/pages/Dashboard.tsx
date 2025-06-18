
import { useSimpleAuth } from "@/contexts/SimpleAuthContext";
import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Crown, 
  Database, 
  Brain, 
  Users, 
  BarChart3, 
  Settings,
  LogOut,
  Sparkles,
  Upload,
  Download,
  Shield,
  Key
} from "lucide-react";
import DatabaseManager from "@/components/DatabaseManager";
import GeminiIntegration from "@/components/GeminiIntegration";
import UserManagement from "@/components/UserManagement";
import ApiControlPanel from "@/components/ApiControlPanel";

const Dashboard = () => {
  const { user, logout } = useSimpleAuth();

  const handleLogout = async () => {
    await logout();
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      desarrollador: { color: 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-300', icon: Crown, label: 'Desarrollador Principal' },
      master: { color: 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-300', icon: Settings, label: 'Master Campaña' },
      candidato: { color: 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border-blue-300', icon: Users, label: 'Candidato Electoral' },
      lider: { color: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-300', icon: BarChart3, label: 'Líder Territorial' },
      votante: { color: 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-300', icon: Users, label: 'Votante Demo' }
    };
    
    return roleConfig[role as keyof typeof roleConfig] || roleConfig.votante;
  };

  const roleInfo = getRoleBadge(user?.role || 'votante');

  return (
    <PageLayout borderVariant="gradient" borderColor="blue">
      <div className="container mx-auto p-6 space-y-6 bg-gradient-to-br from-white/95 via-amber-50/90 to-yellow-50/85 min-h-screen backdrop-blur-sm">
        {/* Header Elegante */}
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-700 rounded-2xl flex items-center justify-center shadow-lg">
                <roleInfo.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold gradient-text-gold">
                  Bienvenido, {user?.name}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={`${roleInfo.color} shadow-sm`}>
                    {roleInfo.label}
                  </Badge>
                  {user?.role === 'desarrollador' && (
                    <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-white shadow-sm">
                      <Crown className="w-3 h-3 mr-1" />
                      Acceso Completo
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <p className="text-amber-800">
              {user?.email} • Sistema Electoral Premium 2025
            </p>
          </div>
          
          <Button 
            onClick={handleLogout} 
            variant="outline" 
            className="border-amber-300 text-amber-700 hover:bg-amber-50 shadow-sm"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>

        {/* Métricas principales con tema dorado */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="elegant-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Database className="w-8 h-8 text-amber-600" />
                <div>
                  <p className="text-2xl font-bold text-amber-800">Active</p>
                  <p className="text-sm text-amber-600">Base de Datos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="elegant-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-amber-800">100K+</p>
                  <p className="text-sm text-amber-600">Registros Electorales</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="elegant-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-amber-800">AI 2.0</p>
                  <p className="text-sm text-amber-600">Gemini Premium</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="elegant-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-amber-800">95%</p>
                  <p className="text-sm text-amber-600">Sistema Óptimo</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs principales con diseño elegante */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200">
            <TabsTrigger value="overview" className="text-amber-800 data-[state=active]:bg-white data-[state=active]:text-amber-900">Vista General</TabsTrigger>
            <TabsTrigger value="databases" className="text-amber-800 data-[state=active]:bg-white data-[state=active]:text-amber-900">Bases de Datos</TabsTrigger>
            <TabsTrigger value="gemini" className="text-amber-800 data-[state=active]:bg-white data-[state=active]:text-amber-900">Asistente AI</TabsTrigger>
            <TabsTrigger value="apis" className="text-amber-800 data-[state=active]:bg-white data-[state=active]:text-amber-900">APIs</TabsTrigger>
            <TabsTrigger value="users" className="text-amber-800 data-[state=active]:bg-white data-[state=active]:text-amber-900">Usuarios</TabsTrigger>
            <TabsTrigger value="analytics" className="text-amber-800 data-[state=active]:bg-white data-[state=active]:text-amber-900">Análisis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="elegant-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-900">
                    <Database className="w-5 h-5 text-amber-600" />
                    Gestión Electoral
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-amber-800">
                    Sistema completo de gestión electoral con captura de votos en tiempo real.
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" className="btn-elegant-primary">
                      <Upload className="w-4 h-4 mr-2" />
                      Importar Datos
                    </Button>
                    <Button size="sm" variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-50">
                      <Download className="w-4 h-4 mr-2" />
                      Exportar
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="elegant-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-900">
                    <Brain className="w-5 h-5 text-purple-600" />
                    Inteligencia Artificial
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-amber-800">
                    Gemini 2.0 Flash Premium para análisis predictivo y automatización electoral.
                  </p>
                  <Button size="sm" className="btn-elegant-primary">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Analizar con IA
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Panel especial para desarrollador */}
            {user?.role === 'desarrollador' && (
              <Card className="elegant-card border-2 border-amber-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-900">
                    <Crown className="w-5 h-5 text-amber-600" />
                    Panel del Desarrollador Principal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-amber-800 mb-4">
                    Control total del ecosistema electoral MI CAMPAÑA 2025 con todas las integraciones premium.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" className="justify-start border-amber-300 text-amber-700 hover:bg-amber-50">
                      <Key className="w-4 h-4 mr-2" />
                      Gestionar APIs
                    </Button>
                    <Button variant="outline" className="justify-start border-amber-300 text-amber-700 hover:bg-amber-50">
                      <Settings className="w-4 h-4 mr-2" />
                      Configuración Avanzada
                    </Button>
                    <Button variant="outline" className="justify-start border-amber-300 text-amber-700 hover:bg-amber-50">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Analytics Completo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="databases">
            <DatabaseManager />
          </TabsContent>

          <TabsContent value="gemini">
            <GeminiIntegration />
          </TabsContent>

          <TabsContent value="apis">
            <ApiControlPanel />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="elegant-card">
              <CardContent className="p-12 text-center">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 text-amber-600" />
                <h3 className="text-lg font-semibold text-amber-900 mb-2">
                  Análisis Electoral Avanzado
                </h3>
                <p className="text-amber-700">
                  Dashboard completo con métricas en tiempo real, predicciones electorales y análisis de sentimiento.
                </p>
                <Button className="mt-4 btn-elegant-primary">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Ver Analytics Completo
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
