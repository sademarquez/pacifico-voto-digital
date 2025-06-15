
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MasterDashboard from "../components/MasterDashboard";
import DashboardVotante from "../components/DashboardVotante";
import TerritoryManager from "../components/TerritoryManager";
import AlertSystem from "../components/AlertSystem";
import UserManagement from "../components/UserManagement";
import { 
  LayoutDashboard, 
  MapPin, 
  AlertTriangle, 
  Users,
  Crown,
  Shield
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div>Cargando...</div>
      </div>
    );
  }

  // Definir tabs según el rol del usuario
  const getAvailableTabs = () => {
    const baseTabs = [
      { id: "overview", label: "Dashboard", icon: LayoutDashboard }
    ];

    if (user.role === 'master') {
      return [
        ...baseTabs,
        { id: "territories", label: "Territorios", icon: MapPin },
        { id: "alerts", label: "Alertas", icon: AlertTriangle },
        { id: "users", label: "Usuarios", icon: Users }
      ];
    }

    if (user.role === 'candidato') {
      return [
        ...baseTabs,
        { id: "territories", label: "Territorios", icon: MapPin },
        { id: "alerts", label: "Alertas", icon: AlertTriangle },
        { id: "users", label: "Mi Equipo", icon: Users }
      ];
    }

    // Para votantes - vista limitada
    return [
      ...baseTabs,
      { id: "alerts", label: "Alertas", icon: AlertTriangle }
    ];
  };

  const availableTabs = getAvailableTabs();

  const getRoleIcon = () => {
    switch (user.role) {
      case 'master': return Shield;
      case 'candidato': return Crown;
      case 'votante': return Users;
      default: return Users;
    }
  };

  const RoleIcon = getRoleIcon();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header con información del usuario */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <RoleIcon className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Bienvenido, {user.name || user.email}
            </h1>
            <p className="text-gray-600 capitalize">
              Rol: {user.role} | MI CAMPAÑA 2025
            </p>
          </div>
        </div>
      </div>

      {/* Navegación por tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          {availableTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                {tab.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Contenido de los tabs */}
        <TabsContent value="overview" className="space-y-6">
          {user.role === 'master' ? (
            <MasterDashboard />
          ) : user.role === 'votante' ? (
            <DashboardVotante />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-blue-800 mb-2">
                  Panel de Candidato
                </h2>
                <p className="text-blue-600">
                  Gestiona tu territorio y equipo de campaña desde aquí.
                </p>
              </div>
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
      </Tabs>
    </div>
  );
};

export default Dashboard;
