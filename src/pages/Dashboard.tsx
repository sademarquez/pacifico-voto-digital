
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
  BarChart3
} from "lucide-react";
import DashboardVisitante from "../components/DashboardVisitante";

const Dashboard = () => {
  const { user, isLoading } = useSecureAuth();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("overview");

  // Leer tab de la URL si existe
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando panel personalizado...</p>
          <p className="text-gray-500 text-sm mt-2">MI CAMPAÑA 2025 - Preparando tu experiencia</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario después de cargar, mostrar error
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error de Autenticación</h2>
          <p className="text-gray-600 mb-4">No se pudo cargar la información del usuario.</p>
          <button 
            onClick={() => window.location.href = '/login'} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Ir al Login
          </button>
        </div>
      </div>
    );
  }

  // Definir tabs según el rol del usuario
  const getAvailableTabs = () => {
    const baseTabs = [
      { id: "overview", label: "Dashboard", icon: LayoutDashboard }
    ];

    if (user.role === 'master' || user.role === 'desarrollador') {
      return [
        ...baseTabs,
        { id: "territories", label: "Territorios", icon: MapPin },
        { id: "alerts", label: "Alertas", icon: AlertTriangle },
        { id: "users", label: "Usuarios", icon: Users },
        { id: "events", label: "Eventos", icon: Calendar }
      ];
    }

    if (user.role === 'candidato') {
      return [
        ...baseTabs,
        { id: "territories", label: "Territorios", icon: MapPin },
        { id: "alerts", label: "Alertas", icon: AlertTriangle },
        { id: "users", label: "Mi Equipo", icon: Users },
        { id: "events", label: "Eventos", icon: Calendar }
      ];
    }

    if (user.role === 'lider') {
      return [
        ...baseTabs,
        { id: "territories", label: "Mi Territorio", icon: MapPin },
        { id: "alerts", label: "Alertas", icon: AlertTriangle }
      ];
    }

    // Para votantes y visitantes - vista limitada
    return baseTabs;
  };

  const availableTabs = getAvailableTabs();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-4 py-6">
        {/* Header personalizado por usuario */}
        <UserHeader />

        {/* Estadísticas personalizadas */}
        <RoleBasedStats />

        {/* Navegación por tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {availableTabs.length > 1 && (
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 bg-white shadow-sm">
              {availableTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger 
                    key={tab.id} 
                    value={tab.id} 
                    className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          )}

          {/* Contenido de los tabs */}
          <TabsContent value="overview" className="space-y-6">
            {user.role === 'master' || user.role === 'desarrollador' ? (
              <div className="space-y-6">
                <MasterDashboard />
                <PersonalizedActions />
              </div>
            ) : user.role === 'visitante' ? (
              <DashboardVisitante />
            ) : user.role === 'votante' ? (
              <DashboardVotante />
            ) : user.role === 'candidato' ? (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                  <h2 className="text-xl font-semibold text-blue-800 mb-2">
                    🎯 Panel de Liderazgo de Campaña
                  </h2>
                  <p className="text-blue-600 mb-4">
                    Coordina todos los aspectos de tu campaña electoral desde un solo lugar. Tu liderazgo inspira a todo el equipo.
                  </p>
                  <div className="flex gap-2">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">Liderazgo</span>
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">Estrategia</span>
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">Movilización</span>
                  </div>
                </div>
                <PersonalizedActions />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                  <h2 className="text-xl font-semibold text-green-800 mb-2">
                    🌟 Panel de Liderazgo Territorial
                  </h2>
                  <p className="text-green-600 mb-4">
                    Administra tu territorio y coordina las actividades de campaña en tu zona. Eres el enlace directo con la comunidad.
                  </p>
                  <div className="flex gap-2">
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">Territorio</span>
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">Coordinación</span>
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">Comunidad</span>
                  </div>
                </div>
                <PersonalizedActions />
              </div>
            )}
          </TabsContent>

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
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                <Calendar className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Sistema de Eventos</h3>
                <p className="text-blue-700 mb-4">
                  Gestión completa de eventos de campaña, desde planificación hasta seguimiento post-evento.
                </p>
                <p className="text-sm text-blue-600">
                  🚧 Próximamente: Crear eventos, asignar responsables, seguimiento de asistencia y más.
                </p>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
