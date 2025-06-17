import { useState, useEffect } from "react";
import { useSecureAuth } from "../contexts/SecureAuthContext";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MasterDashboard from "../components/MasterDashboard";
import DashboardVotante from "../components/DashboardVotante";
import TerritoryManager from "../components/TerritoryManager";
import AlertSystem from "../components/AlertSystem";
import UserManagement from "../components/UserManagement";
import UserHeader from "../components/UserHeader";
import RoleBasedStats from "../components/RoleBasedStats";
import PersonalizedActions from "../components/PersonalizedActions";
import { 
  LayoutDashboard, 
  MapPin, 
  AlertTriangle, 
  Users,
  Calendar,
  BarChart3,
  Zap,
  Sparkles,
  Target
} from "lucide-react";
import DashboardVisitante from "../components/DashboardVisitante";
import ElectoralDashboard from "../components/ElectoralDashboard";
import AutomatedVisitorWindow from "../components/AutomatedVisitorWindow";
import ModernInteractiveMap from "../components/ModernInteractiveMap";
import ModernUserInterface from "../components/ModernUserInterface";

const Dashboard = () => {
  const { user, isLoading: authLoading } = useSecureAuth();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("overview");

  // Leer tab de la URL si existe
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  // Mostrar loading moderno mientras se verifica la autenticación
  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center space-y-6 animate-fade-in-up">
          <div className="w-20 h-20 gradient-bg-primary rounded-2xl flex items-center justify-center mx-auto shadow-modern-xl animate-pulse">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold gradient-text-primary">MI CAMPAÑA 2025</h2>
            <p className="text-gray-600 text-lg">Cargando panel personalizado...</p>
            <p className="text-gray-500 text-sm">Automatización Electoral con IA</p>
          </div>
          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  // Si no hay usuario después de cargar, mostrar error moderno
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
        <div className="text-center space-y-6 animate-scale-in">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto shadow-modern-lg">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">Error de Autenticación</h2>
            <p className="text-gray-600">No se pudo cargar la información del usuario.</p>
          </div>
          <button 
            onClick={() => window.location.href = '/login'} 
            className="btn-modern-primary"
          >
            Ir al Login
          </button>
        </div>
      </div>
    );
  }

  const getAvailableTabs = () => {
    const baseTabs = [
      { id: "overview", label: "Dashboard", icon: LayoutDashboard }
    ];

    if (user.role === 'master' || user.role === 'desarrollador') {
      return [
        ...baseTabs,
        { id: "electoral", label: "IA Electoral", icon: Zap },
        { id: "visitor", label: "Visitantes", icon: Users },
        { id: "territories", label: "Territorios", icon: MapPin },
        { id: "alerts", label: "Alertas", icon: AlertTriangle },
        { id: "users", label: "Usuarios", icon: Users },
        { id: "events", label: "Eventos", icon: Calendar }
      ];
    }

    if (user.role === 'candidato') {
      return [
        ...baseTabs,
        { id: "electoral", label: "IA Electoral", icon: Zap },
        { id: "visitor", label: "Visitantes", icon: Users },
        { id: "territories", label: "Territorios", icon: MapPin },
        { id: "alerts", label: "Alertas", icon: AlertTriangle },
        { id: "users", label: "Mi Equipo", icon: Users },
        { id: "events", label: "Eventos", icon: Calendar }
      ];
    }

    if (user.role === 'lider') {
      return [
        ...baseTabs,
        { id: "electoral", label: "IA Electoral", icon: Zap },
        { id: "territories", label: "Mi Territorio", icon: MapPin },
        { id: "alerts", label: "Alertas", icon: AlertTriangle }
      ];
    }

    if (user.role === 'votante') {
      return [
        ...baseTabs,
        { id: "visitor", label: "Participar", icon: Users }
      ];
    }

    return baseTabs;
  };

  const availableTabs = getAvailableTabs();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto container-mobile py-6 space-y-6">
        {/* Header personalizado moderno */}
        <div className="animate-fade-in-up">
          <UserHeader />
        </div>

        {/* Estadísticas personalizadas modernas */}
        <div className="animate-scale-in">
          <RoleBasedStats />
        </div>

        {/* Navegación por tabs moderna */}
        <div className="animate-slide-up">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            {availableTabs.length > 1 && (
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 bg-white bg-opacity-90 backdrop-blur-sm shadow-modern-sm border border-gray-200 rounded-xl p-1">
                {availableTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <TabsTrigger 
                      key={tab.id} 
                      value={tab.id} 
                      className="flex items-center gap-2 data-[state=active]:gradient-bg-primary data-[state=active]:text-white data-[state=active]:shadow-modern-md rounded-lg transition-all duration-300"
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline font-medium">{tab.label}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            )}

            <TabsContent value="overview" className="space-y-6">
              {user.role === 'master' || user.role === 'desarrollador' ? (
                <div className="space-y-6">
                  <div className="campaign-card p-6 animate-fade-in-up">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 gradient-bg-primary rounded-xl flex items-center justify-center">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold gradient-text-primary">
                          🎯 Control Central de Campaña
                        </h2>
                        <p className="text-gray-600">
                          Automatización avanzada con IA para máxima eficiencia electoral
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">IA Gemini</span>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">Automatización</span>
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">Control Total</span>
                    </div>
                  </div>
                  <MasterDashboard />
                  <PersonalizedActions />
                </div>
              ) : user.role === 'visitante' ? (
                <DashboardVisitante />
              ) : user.role === 'votante' ? (
                <DashboardVotante />
              ) : user.role === 'candidato' ? (
                <div className="space-y-6">
                  <div className="campaign-card p-6 animate-fade-in-up">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 gradient-bg-success rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-blue-800">
                          🎯 Panel de Liderazgo de Campaña
                        </h2>
                        <p className="text-gray-600">
                          Coordina todos los aspectos de tu campaña electoral desde un solo lugar
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">Liderazgo</span>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">Estrategia</span>
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">Movilización</span>
                    </div>
                  </div>
                  <PersonalizedActions />
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="campaign-card p-6 animate-fade-in-up">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 gradient-bg-accent rounded-xl flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-green-800">
                          🌟 Panel de Liderazgo Territorial
                        </h2>
                        <p className="text-gray-600">
                          Administra tu territorio y coordina las actividades de campaña
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">Territorio</span>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">Coordinación</span>
                      <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">Comunidad</span>
                    </div>
                  </div>
                  <PersonalizedActions />
                </div>
              )}
            </TabsContent>

            {/* Nuevo tab Electoral IA moderno con mapa interactivo */}
            {availableTabs.find(tab => tab.id === 'electoral') && (
              <TabsContent value="electoral">
                <div className="space-y-6">
                  <div className="campaign-card p-6 animate-scale-in">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 gradient-bg-primary rounded-xl flex items-center justify-center animate-pulse-glow">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold gradient-text-primary">IA Electoral + Mapa Interactivo</h2>
                        <p className="text-gray-600">Automatización con Gemini AI y visualización geográfica avanzada</p>
                      </div>
                    </div>
                    <ModernInteractiveMap />
                  </div>
                  <ElectoralDashboard />
                </div>
              </TabsContent>
            )}

            {/* Nuevo tab Visitantes con interfaz moderna */}
            {availableTabs.find(tab => tab.id === 'visitor') && (
              <TabsContent value="visitor">
                <div className="space-y-6">
                  <ModernUserInterface />
                  <AutomatedVisitorWindow />
                </div>
              </TabsContent>
            )}

            {availableTabs.find(tab => tab.id === 'territories') && (
              <TabsContent value="territories">
                <TerritoryManager />
              </TabsContent>
            )}

            {availableTabs.find(tab => tab.id === 'alerts') && (
              <TabsContent value="alerts">
                <AlertSystem />
              </TabsContent>
            )}

            {availableTabs.find(tab => tab.id === 'users') && (
              <TabsContent value="users">
                <UserManagement />
              </TabsContent>
            )}

            {availableTabs.find(tab => tab.id === 'events') && (
              <TabsContent value="events">
                <div className="campaign-card p-6 text-center animate-scale-in">
                  <div className="w-16 h-16 gradient-bg-success rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Sistema de Eventos Avanzado</h3>
                  <p className="text-gray-700 mb-4">
                    Gestión completa de eventos de campaña con automatización IA
                  </p>
                  <p className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                    🚧 Próximamente: Crear eventos, asignar responsables, seguimiento automático y más
                  </p>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
