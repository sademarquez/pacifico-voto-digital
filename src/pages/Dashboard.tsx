
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
  Download
} from "lucide-react";
import DatabaseManager from "@/components/DatabaseManager";
import GeminiIntegration from "@/components/GeminiIntegration";
import UserManagement from "@/components/UserManagement";

const Dashboard = () => {
  const { user, logout } = useSimpleAuth();

  const handleLogout = async () => {
    await logout();
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      desarrollador: { color: 'bg-red-100 text-red-800', icon: Crown, label: 'Creador del Sistema' },
      master: { color: 'bg-purple-100 text-purple-800', icon: Settings, label: 'Master' },
      candidato: { color: 'bg-blue-100 text-blue-800', icon: Users, label: 'Candidato' },
      lider: { color: 'bg-green-100 text-green-800', icon: BarChart3, label: 'Líder' },
      votante: { color: 'bg-yellow-100 text-yellow-800', icon: Users, label: 'Votante' }
    };
    
    return roleConfig[role as keyof typeof roleConfig] || roleConfig.votante;
  };

  const roleInfo = getRoleBadge(user?.role || 'votante');

  return (
    <PageLayout borderVariant="gradient" borderColor="blue">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <roleInfo.icon className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Bienvenido, {user?.name}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={roleInfo.color}>
                    {roleInfo.label}
                  </Badge>
                  {user?.role === 'desarrollador' && (
                    <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-white">
                      <Crown className="w-3 h-3 mr-1" />
                      Acceso Total
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <p className="text-gray-600">
              {user?.email} • Sistema Electoral Profesional
            </p>
          </div>
          
          <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </Button>
        </div>

        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Database className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-gray-600">Bases de Datos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-gray-600">Registros Importados</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">AI</p>
                  <p className="text-sm text-gray-600">Gemini Activo</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-amber-600" />
                <div>
                  <p className="text-2xl font-bold">100%</p>
                  <p className="text-sm text-gray-600">Sistema Operativo</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs principales */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Vista General</TabsTrigger>
            <TabsTrigger value="databases">Bases de Datos</TabsTrigger>
            <TabsTrigger value="gemini">Asistente AI</TabsTrigger>
            <TabsTrigger value="users">Usuarios</TabsTrigger>
            <TabsTrigger value="analytics">Análisis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Gestión de Datos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    Conecta y sincroniza tus bases de datos externas para crear un ecosistema integrado.
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Importar Datos
                    </Button>
                    <Button size="sm" variant="outline" className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Exportar
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    Inteligencia Artificial
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    Asistente electoral powered by Gemini 2.0 Flash para análisis avanzado y estrategias.
                  </p>
                  <Button size="sm" className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Activar Gemini AI
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Acciones rápidas para desarrollador */}
            {user?.role === 'desarrollador' && (
              <Card className="border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-800">
                    <Crown className="w-5 h-5" />
                    Panel del Creador
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-amber-700 mb-4">
                    Como creador del sistema, tienes acceso completo a todas las funcionalidades y configuraciones.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" className="justify-start border-amber-300">
                      <Users className="w-4 h-4 mr-2" />
                      Crear Desarrolladores
                    </Button>
                    <Button variant="outline" className="justify-start border-amber-300">
                      <Settings className="w-4 h-4 mr-2" />
                      Configuración Avanzada
                    </Button>
                    <Button variant="outline" className="justify-start border-amber-300">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Analytics del Sistema
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

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardContent className="p-12 text-center">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Análisis Avanzado
                </h3>
                <p className="text-gray-500">
                  Las métricas y análisis aparecerán aquí una vez que comiences a importar datos.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
