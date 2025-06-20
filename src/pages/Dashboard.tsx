
/*
 * Copyright © 2025 Daniel Lopez - Sademarquez. Todos los derechos reservados.
 */

import { useSecureAuth } from "../contexts/SecureAuthContext";
import Navigation from "../components/Navigation";
import { CompleteNavigation } from "../components/CompleteNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  MapPin, 
  BarChart3, 
  Calendar,
  MessageSquare,
  Zap,
  CheckCircle,
  TrendingUp,
  Shield,
  Database,
  Crown,
  Bell,
  Activity
} from "lucide-react";
import { useComponentFunctions } from "@/config/componentFunctions";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { user } = useSecureAuth();
  const { executeFunction } = useComponentFunctions();
  const { toast } = useToast();

  const handleQuickAction = async (functionId: string, actionName: string) => {
    console.log(`🎯 EJECUTANDO ACCIÓN: ${functionId} - ${actionName}`);
    
    try {
      const result = await executeFunction(functionId, {
        timestamp: new Date().toISOString(),
        userRole: user?.role,
        actionType: 'dashboard_quick_action'
      }, user?.role);
      
      toast({
        title: "Acción Ejecutada",
        description: `${actionName} completada exitosamente`,
      });
      
      console.log('✅ RESULTADO:', result);
    } catch (error) {
      console.error('❌ ERROR EN ACCIÓN:', error);
      toast({
        title: "Error",
        description: `Error al ejecutar ${actionName}`,
        variant: "destructive"
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-negro-50 to-verde-sistema-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-verde-sistema-600 mx-auto mb-4"></div>
          <p className="text-negro-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Votantes Registrados",
      value: "12,543",
      change: "+8.2%",
      icon: Users,
      color: "verde-sistema",
      action: () => handleQuickAction('voter-create', 'Registro de Votantes')
    },
    {
      title: "Territorios Activos",
      value: "45",
      change: "+2",
      icon: MapPin,
      color: "negro",
      action: () => handleQuickAction('territory-create', 'Gestión Territorial')
    },
    {
      title: "Eventos Programados",
      value: "23",
      change: "+5",
      icon: Calendar,
      color: "rojo-acento",
      action: () => handleQuickAction('event-create', 'Coordinación de Eventos')
    },
    {
      title: "Tasa de Compromiso",
      value: "87.5%",
      change: "+3.2%",
      icon: TrendingUp,
      color: "verde-sistema",
      action: () => handleQuickAction('analytics-dashboard', 'Analytics Avanzado')
    }
  ];

  const quickActions = [
    {
      title: "Registrar Votante",
      description: "Agregar nuevo votante al sistema",
      icon: Users,
      functionId: "voter-create",
      color: "bg-verde-sistema-600 hover:bg-verde-sistema-700"
    },
    {
      title: "Enviar Mensaje",
      description: "Comunicación masiva a territorios",
      icon: MessageSquare,
      functionId: "message-whatsapp",
      color: "bg-negro-800 hover:bg-negro-900"
    },
    {
      title: "Crear Evento",
      description: "Programar actividad de campaña",
      icon: Calendar,
      functionId: "event-create",
      color: "bg-rojo-acento-600 hover:bg-rojo-acento-700"
    },
    {
      title: "Ver Reportes",
      description: "Análisis y métricas del sistema",
      icon: BarChart3,
      functionId: "analytics-dashboard",
      color: "bg-verde-sistema-700 hover:bg-verde-sistema-800"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-negro-50 via-white to-verde-sistema-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        {/* Header Mejorado */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-negro-950 mb-2 flex items-center gap-3">
                <Crown className="w-8 h-8 text-verde-sistema-600" />
                Panel de Control Electoral v3.0
              </h1>
              <p className="text-negro-600">
                Bienvenido, <strong>{user.name}</strong> - Rol: <Badge className="bg-negro-800 text-white">{user.role}</Badge>
              </p>
              <p className="text-sm text-verde-sistema-700 mt-1">
                Copyright © 2025 Daniel Lopez - Sademarquez. Sistema Electoral Productivo.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-verde-sistema-600 text-white px-4 py-2">
                <Shield className="w-4 h-4 mr-2" />
                Sistema Activo
              </Badge>
              <Badge className="bg-rojo-acento-600 text-white px-4 py-2">
                <Activity className="w-4 h-4 mr-2" />
                Producción
              </Badge>
            </div>
          </div>
        </div>

        {/* Estadísticas Interactivas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={index} 
                className="sistema-card cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105"
                onClick={stat.action}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-negro-600">
                        {stat.title}
                      </p>
                      <div className="flex items-center mt-2">
                        <p className="text-2xl font-bold text-negro-900">
                          {stat.value}
                        </p>
                        <Badge 
                          variant="secondary" 
                          className="ml-2 bg-verde-sistema-100 text-verde-sistema-700"
                        >
                          {stat.change}
                        </Badge>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${
                      stat.color === 'verde-sistema' ? 'bg-verde-sistema-100' :
                      stat.color === 'negro' ? 'bg-negro-100' :
                      'bg-rojo-acento-100'
                    }`}>
                      <Icon className={`w-6 h-6 ${
                        stat.color === 'verde-sistema' ? 'text-verde-sistema-600' :
                        stat.color === 'negro' ? 'text-negro-600' :
                        'text-rojo-acento-600'
                      }`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Acciones Rápidas Funcionales */}
        <Card className="sistema-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-negro-900">
              <Zap className="w-5 h-5 mr-2 text-verde-sistema-600" />
              Acciones Rápidas - Funcionales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={index}
                    onClick={() => handleQuickAction(action.functionId, action.title)}
                    className={`${action.color} text-white p-6 h-auto flex flex-col items-center justify-center space-y-2 hover:transform hover:scale-105 transition-all duration-300`}
                  >
                    <Icon className="w-8 h-8" />
                    <div className="text-center">
                      <p className="font-semibold">{action.title}</p>
                      <p className="text-xs opacity-90">{action.description}</p>
                    </div>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Navegación Completa */}
        <CompleteNavigation />

        {/* Estado del Sistema */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <Card className="sistema-card">
            <CardHeader>
              <CardTitle className="flex items-center text-negro-900">
                <Database className="w-5 h-5 mr-2 text-verde-sistema-600" />
                Estado de Conexiones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Base de Datos Supabase", status: "Conectado", color: "text-verde-sistema-600" },
                { name: "Sistema N8N", status: "Configurado", color: "text-verde-sistema-600" },
                { name: "Autenticación", status: "Activo", color: "text-verde-sistema-600" },
                { name: "Navegación", status: "Funcional", color: "text-verde-sistema-600" }
              ].map((connection, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-negro-50 rounded-lg">
                  <span className="font-medium text-negro-800">{connection.name}</span>
                  <div className="flex items-center">
                    <CheckCircle className={`w-4 h-4 mr-2 ${connection.color}`} />
                    <span className={`text-sm ${connection.color}`}>{connection.status}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="sistema-card">
            <CardHeader>
              <CardTitle className="flex items-center text-negro-900">
                <BarChart3 className="w-5 h-5 mr-2 text-verde-sistema-600" />
                Resumen de Actividad
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-negro-600">Votantes registrados hoy</span>
                  <span className="font-bold text-verde-sistema-600">+127</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-negro-600">Mensajes enviados</span>
                  <span className="font-bold text-negro-800">2,543</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-negro-600">Eventos completados</span>
                  <span className="font-bold text-rojo-acento-600">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-negro-600">Tasa de respuesta</span>
                  <span className="font-bold text-verde-sistema-600">92.1%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
