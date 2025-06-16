import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MapPin, AlertTriangle, CheckCircle, Plus, Search, Filter, Bell, Shield, X } from "lucide-react";
import { useSecureAuth } from "@/contexts/SecureAuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";

interface AlertData {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'active' | 'resolved' | 'dismissed';
  type: 'security' | 'logistics' | 'political' | 'emergency' | 'information';
  location_lat?: number;
  location_lng?: number;
  created_at: string;
  created_by?: string;
  affected_user_id?: string;
  territory_id?: string;
  resolved_at?: string;
  resolved_by?: string;
  updated_at: string;
  visible_to_voters: boolean;
}

interface SystemLog {
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  category: string;
  message: string;
  details?: any;
}

const MapaAlertas = () => {
  const { user } = useSecureAuth();
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    loadTime: 0,
    queryCount: 0,
    errorCount: 0,
    lastUpdate: new Date().toISOString()
  });

  const [newAlert, setNewAlert] = useState({
    title: "",
    description: "",
    priority: "medium" as const,
    type: "information" as const,
    location_lat: 0,
    location_lng: 0
  });

  // Configuración de Gemini AI
  const GEMINI_API_KEY = "AIzaSyB0EL5it0LTQOHChULpQSa7BGvdPQPzNkY";

  const logSystem = (level: SystemLog['level'], category: string, message: string, details?: any) => {
    const log: SystemLog = {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      details
    };
    
    setSystemLogs(prev => [...prev.slice(-99), log]);
    console.log(`[AUDIT-${level.toUpperCase()}] ${category}: ${message}`, details);
    
    if (level === 'error' || level === 'critical') {
      setPerformanceMetrics(prev => ({
        ...prev,
        errorCount: prev.errorCount + 1,
        lastUpdate: new Date().toISOString()
      }));
    }
  };

  // Función para obtener sugerencias inteligentes usando Gemini
  const getGeminiSuggestions = async (alertTitle: string, alertDescription: string) => {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Como experto en gestión de campañas políticas, analiza esta alerta y proporciona sugerencias estratégicas:
              
              Título: ${alertTitle}
              Descripción: ${alertDescription}
              Contexto: Sistema de campaña política "MI CAMPAÑA 2025 - Transparencia y Honestidad"
              
              Proporciona:
              1. Nivel de prioridad recomendado (low/medium/high/urgent)
              2. Tipo de alerta más apropiado (security/logistics/political/emergency/information)
              3. Acciones inmediatas recomendadas (máximo 3)
              4. Impacto potencial en la campaña
              
              Responde en formato JSON estructurado.`
            }]
          }]
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data.candidates[0]?.content?.parts[0]?.text;
      }
    } catch (error) {
      logSystem('error', 'ai', 'Error obteniendo sugerencias de Gemini', error);
    }
    return null;
  };

  useEffect(() => {
    const fetchAlerts = async () => {
      const startTime = performance.now();
      
      try {
        setLoading(true);
        logSystem('info', 'database', 'Iniciando carga de alertas', { userId: user?.id });

        const { data, error } = await supabase
          .from('alerts')
          .select('*')
          .order('created_at', { ascending: false });

        const endTime = performance.now();
        const loadTime = endTime - startTime;

        if (error) {
          logSystem('error', 'database', 'Error cargando alertas', { error: error.message, code: error.code });
          throw error;
        }

        setAlerts(data || []);
        setPerformanceMetrics(prev => ({
          ...prev,
          loadTime,
          queryCount: prev.queryCount + 1,
          lastUpdate: new Date().toISOString()
        }));

        logSystem('info', 'database', `Alertas cargadas exitosamente`, { 
          count: data?.length || 0, 
          loadTime: `${loadTime.toFixed(2)}ms` 
        });

      } catch (error) {
        logSystem('critical', 'system', 'Error crítico cargando alertas', error);
        setPerformanceMetrics(prev => ({
          ...prev,
          errorCount: prev.errorCount + 1
        }));
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchAlerts();
    }

    // Suscripción corregida para real-time
    const subscription = supabase
      .channel('alerts-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'alerts' },
        (payload: any) => {
          logSystem('info', 'realtime', 'Cambio detectado en alertas', { 
            event: payload.eventType,
            recordId: payload.new?.id || payload.old?.id 
          });
          fetchAlerts();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
      logSystem('info', 'system', 'Componente desmontado, suscripción cancelada');
    };
  }, [user]);

  const handleCreateAlert = async () => {
    logSystem('info', 'user_action', 'Intento de crear nueva alerta', { 
      title: newAlert.title,
      type: newAlert.type,
      priority: newAlert.priority 
    });

    if (!newAlert.title.trim()) {
      logSystem('warning', 'validation', 'Intento de crear alerta sin título');
      return;
    }

    if (!user) {
      logSystem('error', 'security', 'Intento de crear alerta sin autenticación');
      return;
    }

    if (newAlert.title.length > 255) {
      logSystem('warning', 'validation', 'Título de alerta excede límite de caracteres', { 
        length: newAlert.title.length 
      });
      return;
    }

    // Obtener sugerencias de Gemini antes de crear la alerta
    const suggestions = await getGeminiSuggestions(newAlert.title, newAlert.description);
    if (suggestions) {
      logSystem('info', 'ai', 'Sugerencias obtenidas de Gemini', { suggestions });
    }

    try {
      const { error } = await supabase
        .from('alerts')
        .insert({
          title: newAlert.title.trim(),
          description: newAlert.description.trim(),
          priority: newAlert.priority,
          type: newAlert.type,
          location_lat: newAlert.location_lat || null,
          location_lng: newAlert.location_lng || null,
          created_by: user.id,
          status: 'active',
          visible_to_voters: false
        });

      if (error) {
        logSystem('error', 'database', 'Error creando alerta', { 
          error: error.message,
          code: error.code,
          details: error.details 
        });
        return;
      }

      setNewAlert({
        title: "",
        description: "",
        priority: "medium",
        type: "information",
        location_lat: 0,
        location_lng: 0
      });
      setShowCreateForm(false);

      logSystem('info', 'user_action', 'Alerta creada exitosamente', { 
        userId: user.id,
        alertTitle: newAlert.title 
      });

    } catch (error) {
      logSystem('critical', 'system', 'Error crítico creando alerta', error);
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.description?.toLowerCase().includes(searchTerm.toLowerCase() || '');
    const matchesPriority = filterPriority === 'all' || alert.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || alert.status === filterStatus;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'resolved': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'dismissed': return <X className="w-4 h-4 text-gray-500" />;
      default: return <MapPin className="w-4 h-4 text-slate-500" />;
    }
  };

  const getSystemHealthStatus = () => {
    const recentErrors = systemLogs.filter(log => 
      log.level === 'error' || log.level === 'critical'
    ).length;
    
    if (recentErrors === 0) return { status: 'healthy', color: 'text-green-600' };
    if (recentErrors < 5) return { status: 'warning', color: 'text-yellow-600' };
    return { status: 'critical', color: 'text-red-600' };
  };

  if (!user) {
    logSystem('warning', 'security', 'Acceso denegado - usuario no autenticado');
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <Shield className="w-16 h-16 mx-auto text-slate-400 mb-4" />
            <p className="text-slate-600">Debes iniciar sesión para ver las alertas.</p>
            <Button 
              onClick={() => window.location.href = '/login'}
              className="mt-4 bg-slate-700 hover:bg-slate-800"
            >
              Iniciar Sesión
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const healthStatus = getSystemHealthStatus();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header con métricas de sistema */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 flex items-center">
                Mapa de Alertas
                <div className={`ml-3 flex items-center text-sm ${healthStatus.color}`}>
                  <div className={`w-2 h-2 rounded-full mr-1 ${
                    healthStatus.status === 'healthy' ? 'bg-green-500' :
                    healthStatus.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  Sistema {healthStatus.status}
                </div>
              </h1>
              <p className="text-slate-600 mt-2">
                Sistema de monitoreo y gestión de alertas en tiempo real
              </p>
              <div className="text-xs text-slate-500 mt-1">
                Última actualización: {new Date(performanceMetrics.lastUpdate).toLocaleTimeString()} | 
                Consultas: {performanceMetrics.queryCount} | 
                Errores: {performanceMetrics.errorCount} |
                Tiempo de carga: {performanceMetrics.loadTime.toFixed(2)}ms
              </div>
            </div>
            
            <div className="flex gap-2">
              {/* Panel de debug para desarrolladores */}
              {(user.role === 'desarrollador' || user.role === 'master') && (
                <Button 
                  variant="outline"
                  onClick={() => setShowDebugPanel(!showDebugPanel)}
                  className="border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Debug
                </Button>
              )}
              
              {(user.role === 'desarrollador' || user.role === 'master' || user.role === 'candidato') && (
                <Button 
                  onClick={() => setShowCreateForm(true)}
                  className="bg-slate-700 hover:bg-slate-800 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Alerta
                </Button>
              )}
            </div>
          </div>

          {/* Panel de debug */}
          {showDebugPanel && (
            <Card className="mb-6 border-yellow-200 bg-yellow-50">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-yellow-800 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Panel de Auditoría - Solo Desarrolladores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-slate-700 mb-2">Logs del Sistema (Últimos 10)</h4>
                    <div className="bg-slate-900 text-green-400 p-3 rounded text-xs max-h-40 overflow-y-auto font-mono">
                      {systemLogs.slice(-10).map((log, index) => (
                        <div key={index} className={`mb-1 ${
                          log.level === 'error' || log.level === 'critical' ? 'text-red-400' :
                          log.level === 'warning' ? 'text-yellow-400' : 'text-green-400'
                        }`}>
                          [{log.timestamp.split('T')[1].split('.')[0]}] {log.level.toUpperCase()}: {log.message}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-700 mb-2">Métricas de Performance</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Tiempo de carga promedio:</span>
                        <span className="font-mono">{performanceMetrics.loadTime.toFixed(2)}ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total consultas BD:</span>
                        <span className="font-mono">{performanceMetrics.queryCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Errores detectados:</span>
                        <span className="font-mono text-red-600">{performanceMetrics.errorCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Alertas en memoria:</span>
                        <span className="font-mono">{alerts.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Filtros mejorados */}
          <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg shadow-sm border border-slate-200">
            <div className="flex-1">
              <Input
                placeholder="Buscar alertas por título o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-slate-300 focus:border-slate-500"
              />
            </div>
            <div className="sm:w-48">
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
              >
                <option value="all">Todas las prioridades</option>
                <option value="urgent">Urgente</option>
                <option value="high">Alta</option>
                <option value="medium">Media</option>
                <option value="low">Baja</option>
              </select>
            </div>
            <div className="sm:w-48">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
              >
                <option value="all">Todos los estados</option>
                <option value="active">Activa</option>
                <option value="resolved">Resuelta</option>
                <option value="dismissed">Descartada</option>
              </select>
            </div>
          </div>
        </div>

        {/* Formulario crear alerta */}
        {showCreateForm && (
          <Card className="mb-6 border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50">
              <CardTitle className="text-slate-800">Nueva Alerta del Sistema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div>
                <Input
                  placeholder="Título de la alerta (máximo 255 caracteres)"
                  value={newAlert.title}
                  onChange={(e) => setNewAlert({...newAlert, title: e.target.value})}
                  className="border-slate-300 focus:border-slate-500"
                  maxLength={255}
                />
                <div className="text-xs text-slate-500 mt-1">
                  {newAlert.title.length}/255 caracteres
                </div>
              </div>
              <div>
                <textarea
                  placeholder="Descripción detallada de la alerta"
                  value={newAlert.description}
                  onChange={(e) => setNewAlert({...newAlert, description: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                  rows={3}
                  maxLength={1000}
                />
                <div className="text-xs text-slate-500 mt-1">
                  {newAlert.description.length}/1000 caracteres
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <select
                  value={newAlert.priority}
                  onChange={(e) => setNewAlert({...newAlert, priority: e.target.value as any})}
                  className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                >
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                  <option value="urgent">Urgente</option>
                </select>
                <select
                  value={newAlert.type}
                  onChange={(e) => setNewAlert({...newAlert, type: e.target.value as any})}
                  className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                >
                  <option value="information">Información</option>
                  <option value="security">Seguridad</option>
                  <option value="logistics">Logística</option>
                  <option value="political">Política</option>
                  <option value="emergency">Emergencia</option>
                </select>
                <Input
                  type="number"
                  placeholder="Latitud"
                  value={newAlert.location_lat}
                  onChange={(e) => setNewAlert({...newAlert, location_lat: parseFloat(e.target.value)})}
                  className="border-slate-300 focus:border-slate-500"
                  step="0.000001"
                />
                <Input
                  type="number"
                  placeholder="Longitud"
                  value={newAlert.location_lng}
                  onChange={(e) => setNewAlert({...newAlert, location_lng: parseFloat(e.target.value)})}
                  className="border-slate-300 focus:border-slate-500"
                  step="0.000001"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => setShowCreateForm(false)}
                  className="border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleCreateAlert}
                  className="bg-slate-700 hover:bg-slate-800 text-white"
                  disabled={!newAlert.title.trim()}
                >
                  Crear Alerta
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lista de Alertas */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-700 mx-auto mb-4"></div>
            <p className="text-slate-600">Cargando alertas del sistema...</p>
          </div>
        ) : filteredAlerts.length === 0 ? (
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="text-center py-8">
              <Bell className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">No se encontraron alertas</p>
              <p className="text-sm text-slate-500 mt-2">
                {searchTerm || filterPriority !== 'all' || filterStatus !== 'all'
                  ? 'Intenta ajustar los filtros de búsqueda' 
                  : 'El sistema está funcionando correctamente'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredAlerts.map((alert) => (
              <Card key={alert.id} className="border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(alert.status)}
                        <h3 className="font-semibold text-slate-800 text-lg">{alert.title}</h3>
                      </div>
                      {alert.description && (
                        <p className="text-slate-600 mb-3">{alert.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span>Creada: {new Date(alert.created_at).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</span>
                        {alert.location_lat && alert.location_lng && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {alert.location_lat.toFixed(4)}, {alert.location_lng.toFixed(4)}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          ID: {alert.id.slice(-8)}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <Badge className={getPriorityColor(alert.priority)}>
                        {alert.priority.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className="text-slate-600 border-slate-300">
                        {alert.status.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className="text-slate-600 border-slate-300">
                        {alert.type.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Resumen estadístico mejorado */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-slate-800">
                {alerts.filter(a => a.status === 'active').length}
              </div>
              <div className="text-sm text-slate-600">Activas</div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {alerts.filter(a => a.priority === 'urgent').length}
              </div>
              <div className="text-sm text-slate-600">Urgentes</div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {alerts.filter(a => a.status === 'resolved').length}
              </div>
              <div className="text-sm text-slate-600">Resueltas</div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">
                {alerts.filter(a => a.status === 'dismissed').length}
              </div>
              <div className="text-sm text-slate-600">Descartadas</div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-slate-800">
                {alerts.length}
              </div>
              <div className="text-sm text-slate-600">Total</div>
            </CardContent>
          </Card>
        </div>

        {/* Footer con información del sistema */}
        <div className="mt-8 text-center text-xs text-slate-500">
          <p>Sistema de Alertas v2.0 | Auditoría Completa Activada</p>
          <p>Última verificación: {new Date().toLocaleString('es-ES')}</p>
        </div>
      </div>
    </div>
  );
};

export default MapaAlertas;
