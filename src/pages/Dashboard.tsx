import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSimpleAuth } from "@/contexts/SimpleAuthContext";
import PageLayout from "@/components/PageLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Database, Brain, Activity } from "lucide-react";
import ElectoralDashboard from "@/components/ElectoralDashboard";
import ApiControlPanel from "@/components/ApiControlPanel";
import MobileAppAuditComplete from "@/components/MobileAppAuditComplete";
import SystemFinalReport from "@/components/SystemFinalReport";
import UserHeader from "@/components/UserHeader";
import RoleBasedStats from "@/components/RoleBasedStats";

interface DashboardProps {
  // No props needed for now
}

const Dashboard = () => {
  const { user, logout } = useSimpleAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!user) {
      console.warn('⚠️ No hay usuario autenticado, redirigiendo a login...');
      navigate('/simplelogin');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <PageLayout 
      borderVariant="gradient" 
      borderColor="gold"
      className="bg-gradient-to-br from-white/98 via-amber-50/95 to-yellow-50/90 min-h-screen"
    >
      <div className="relative">
        {/* Efectos de fondo elegantes */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.08),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[conic-gradient(from_45deg_at_70%_80%,transparent_0deg,rgba(184,134,11,0.03)_120deg,transparent_240deg)]"></div>
        
        <div className="relative z-10">
          {/* Header del usuario */}
          <UserHeader user={user} onLogout={logout} />
          
          <div className="max-w-7xl mx-auto p-4 space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold gradient-text-gold mb-2">MI CAMPAÑA 2025</h1>
              <p className="text-xl text-amber-800">Dashboard Ejecutivo Premium</p>
              <div className="w-32 h-1 bg-gradient-to-r from-amber-400 via-amber-600 to-amber-400 mx-auto mt-4 rounded-full"></div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-5 bg-white/80 backdrop-blur-md border border-amber-200 shadow-lg">
                <TabsTrigger value="overview" className="text-amber-800 data-[state=active]:bg-amber-100">
                  Vista General
                </TabsTrigger>
                <TabsTrigger value="electoral" className="text-amber-800 data-[state=active]:bg-amber-100">
                  Electoral
                </TabsTrigger>
                <TabsTrigger value="apis" className="text-amber-800 data-[state=active]:bg-amber-100">
                  APIs
                </TabsTrigger>
                <TabsTrigger value="mobile" className="text-amber-800 data-[state=active]:bg-amber-100">
                  Móvil
                </TabsTrigger>
                <TabsTrigger value="report" className="text-amber-800 data-[state=active]:bg-amber-100">
                  Informe
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Métricas principales */}
                  <Card className="elegant-card">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-amber-700">Usuarios Registrados</p>
                          <p className="text-3xl font-bold text-amber-900">6</p>
                        </div>
                        <Users className="h-8 w-8 text-amber-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="elegant-card">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-amber-700">Base de Datos</p>
                          <p className="text-3xl font-bold text-amber-900">100K+</p>
                        </div>
                        <Database className="h-8 w-8 text-amber-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="elegant-card">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-amber-700">IA Gemini</p>
                          <p className="text-3xl font-bold text-green-600">ACTIVA</p>
                        </div>
                        <Brain className="h-8 w-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="elegant-card">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-amber-700">Sistema</p>
                          <p className="text-3xl font-bold text-green-600">95%</p>
                        </div>
                        <Activity className="h-8 w-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <RoleBasedStats userRole={user?.role || 'votante'} />
              </TabsContent>

              <TabsContent value="electoral">
                <ElectoralDashboard />
              </TabsContent>

              <TabsContent value="apis">
                <ApiControlPanel />
              </TabsContent>

              <TabsContent value="mobile">
                <MobileAppAuditComplete />
              </TabsContent>

              <TabsContent value="report">
                <SystemFinalReport />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
