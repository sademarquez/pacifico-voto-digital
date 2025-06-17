
/*
 * Copyright © 2025 sademarquezDLL. Todos los derechos reservados.
 */

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
import NavigationHelper from "../components/NavigationHelper";
import { 
  LayoutDashboard, 
  MapPin, 
  AlertTriangle, 
  Users,
  Calendar,
  BarChart3,
  Zap,
  Sparkles,
  Target,
  Rocket,
  Brain,
  TrendingUp,
  Award
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

  // Loading elegante y simplificado
  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="text-center space-y-6 animate-fade-in-up">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl flex items-center justify-center mx-auto shadow-2xl animate-pulse">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">MI CAMPAÑA 2025</h2>
            <p className="text-gray-600 text-lg">Cargando panel personalizado...</p>
            <p className="text-gray-500 text-sm">Sistema Electoral Inteligente</p>
          </div>
          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error simplificado
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
        <div className="text-center space-y-6 animate-scale-in">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto shadow-modern-lg">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">Error de Acceso</h2>
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
      { 
        id: "overview", 
        label: "Inicio", 
        icon: LayoutDashboard, 
        description: "Panel principal",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200"
      }
    ];

    if (user.role === 'master' || user.role === 'desarrollador') {
      return [
        ...baseTabs,
        { 
          id: "electoral", 
          label: "IA Electoral", 
          icon: Zap, 
          description: "Inteligencia artificial",
          color: "text-purple-600",
          bgColor: "bg-purple-50",
          borderColor: "border-purple-200"
        },
        { 
          id: "visitor", 
          label: "Visitantes", 
          icon: Users, 
          description: "Gestión de audiencia",
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200"
        },
        { 
          id: "territories", 
          label: "Territorios", 
          icon: MapPin, 
          description: "Control territorial",
          color: "text-orange-600",
          bgColor: "bg-orange-50",
          borderColor: "border-orange-200"
        },
        { 
          id: "users", 
          label: "Usuarios", 
          icon: Users, 
          description: "Gestión de equipo",
          color: "text-indigo-600",
          bgColor: "bg-indigo-50",
          borderColor: "border-indigo-200"
        }
      ];
    }

    if (user.role === 'candidato') {
      return [
        ...baseTabs,
        { 
          id: "electoral", 
          label: "IA Electoral", 
          icon: Zap, 
          description: "Inteligencia artificial",
          color: "text-purple-600",
          bgColor: "bg-purple-50",
          borderColor: "border-purple-200"
        },
        { 
          id: "visitor", 
          label: "Visitantes", 
          icon: Users, 
          description: "Gestión de audiencia",
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200"
        },
        { 
          id: "territories", 
          label: "Territorios", 
          icon: MapPin, 
          description: "Control territorial",
          color: "text-orange-600",
          bgColor: "bg-orange-50",
          borderColor: "border-orange-200"
        },
        { 
          id: "users", 
          label: "Mi Equipo", 
          icon: Users, 
          description: "Gestión de equipo",
          color: "text-indigo-600",
          bgColor: "bg-indigo-50",
          borderColor: "border-indigo-200"
        }
      ];
    }

    if (user.role === 'lider') {
      return [
        ...baseTabs,
        { 
          id: "electoral", 
          label: "IA Electoral", 
          icon: Zap, 
          description: "Inteligencia artificial",
          color: "text-purple-600",
          bgColor: "bg-purple-50",
          borderColor: "border-purple-200"
        },
        { 
          id: "territories", 
          label: "Mi Territorio", 
          icon: MapPin, 
          description: "Control territorial",
          color: "text-orange-600",
          bgColor: "bg-orange-50",
          borderColor: "border-orange-200"
        }
      ];
    }

    if (user.role === 'votante') {
      return [
        ...baseTabs,
        { 
          id: "visitor", 
          label: "Participar", 
          icon: Users, 
          description: "Gestión de participación",
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200"
        }
      ];
    }

    return baseTabs;
  };

  const availableTabs = getAvailableTabs();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto container-mobile py-6 space-y-8">
        {/* Navegación helper para escritorio */}
        <NavigationHelper customTitle="Panel de Control" />

        {/* Header personalizado */}
        <div className="animate-fade-in-up">
          <UserHeader />
        </div>

        {/* Estadísticas personalizadas */}
        <div className="animate-scale-in">
          <RoleBasedStats />
        </div>

        {/* Navegación por tabs simplificada */}
        <div className="animate-slide-up">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            {availableTabs.length > 1 && (
              <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-3 shadow-xl border border-white/30">
                <TabsList className="grid w-full bg-transparent gap-2 p-1" style={{ gridTemplateColumns: `repeat(${availableTabs.length}, 1fr)` }}>
                  {availableTabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <TabsTrigger 
                        key={tab.id} 
                        value={tab.id} 
                        className={`group relative flex flex-col items-center gap-3 p-4 rounded-xl transition-all duration-300 hover:scale-105 ${
                          isActive 
                            ? `bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-2xl` 
                            : `hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100 text-gray-700 hover:shadow-lg border-2 border-transparent hover:border-gray-200`
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          isActive 
                            ? 'bg-white/20 shadow-lg' 
                            : `bg-gradient-to-br ${tab.bgColor} group-hover:shadow-md`
                        }`}>
                          <Icon className={`w-6 h-6 ${isActive ? 'text-white' : tab.color}`} />
                        </div>
                        <div className="text-center">
                          <span className="font-bold text-sm block">{tab.label}</span>
                          <span className={`text-xs opacity-80 block ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                            {tab.description}
                          </span>
                        </div>
                        {isActive && (
                          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-lg animate-pulse"></div>
                        )}
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </div>
            )}

            <TabsContent value="overview" className="space-y-8">
              {user.role === 'master' || user.role === 'desarrollador' ? (
                <div className="space-y-8">
                  {/* Panel principal simplificado */}
                  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-blue-50/30 to-purple-50/40 border-2 border-blue-100/50 shadow-2xl backdrop-blur-sm animate-fade-in-up">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.08),transparent_50%)]"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.06),transparent_50%)]"></div>
                    
                    <div className="relative p-8">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-6">
                          <div className="relative">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-2xl">
                              <Target className="w-8 h-8 text-white" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <Sparkles className="w-3 h-3 text-white" />
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-700 to-purple-700 bg-clip-text text-transparent">
                              🎯 Centro de Control Electoral
                            </h2>
                            <p className="text-lg text-gray-700 font-medium leading-relaxed max-w-2xl">
                              Sistema inteligente para maximizar la efectividad de tu campaña electoral
                            </p>
                            
                            {/* Beneficios principales */}
                            <div className="flex flex-wrap gap-3 mt-4">
                              <div className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-semibold shadow-lg flex items-center gap-2">
                                <Brain className="w-4 h-4" />
                                IA Inteligente
                              </div>
                              <div className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-sm font-semibold shadow-lg flex items-center gap-2">
                                <Rocket className="w-4 h-4" />
                                Automatizado
                              </div>
                              <div className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full text-sm font-semibold shadow-lg flex items-center gap-2">
                                <Award className="w-4 h-4" />
                                Resultados Garantizados
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Métricas simplificadas */}
                        <div className="hidden lg:flex flex-col gap-4">
                          <div className="text-center p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-blue-100 shadow-lg">
                            <TrendingUp className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-gray-900">94%</div>
                            <div className="text-sm text-gray-600">Efectividad</div>
                          </div>
                          <div className="text-center p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-green-100 shadow-lg">
                            <Target className="w-6 h-6 text-green-600 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-gray-900">2.8k</div>
                            <div className="text-sm text-gray-600">Conversiones</div>
                          </div>
                        </div>
                      </div>

                      {/* Guía práctica */}
                      <div className="mt-6 p-6 bg-gradient-to-r from-blue-50/80 to-purple-50/80 rounded-2xl border border-blue-200/50 backdrop-blur-sm">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <Sparkles className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                              🚀 Tu Centro de Comando Electoral
                            </h3>
                            <p className="text-gray-700 leading-relaxed">
                              Desde aquí controlas toda tu estrategia: 
                              <strong className="text-blue-700"> IA Electoral</strong> para análisis inteligente, 
                              <strong className="text-green-700"> Visitantes</strong> para captar votos, 
                              <strong className="text-orange-700"> Territorios</strong> para dominio geográfico.
                            </p>
                          </div>
                        </div>
                      </div>
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
                          Coordina todos los aspectos de tu campaña electoral
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">Liderazgo</span>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">Estrategia</span>
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">Resultados</span>
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
                          🌟 Panel Territorial
                        </h2>
                        <p className="text-gray-600">
                          Administra tu territorio y coordina actividades
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

            {/* IA Electoral simplificada */}
            {availableTabs.find(tab => tab.id === 'electoral') && (
              <TabsContent value="electoral">
                <div className="space-y-6">
                  <div className="campaign-card p-6 animate-scale-in">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 gradient-bg-primary rounded-xl flex items-center justify-center animate-pulse-glow">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold gradient-text-primary">IA Electoral Inteligente</h2>
                        <p className="text-gray-600">Sistema automatizado para maximizar tu alcance electoral</p>
                      </div>
                    </div>
                    <ModernInteractiveMap />
                  </div>
                  <ElectoralDashboard />
                </div>
              </TabsContent>
            )}

            {/* Visitantes simplificado */}
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

            {availableTabs.find(tab => tab.id === 'users') && (
              <TabsContent value="users">
                <UserManagement />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
