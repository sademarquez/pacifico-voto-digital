
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MapPin, AlertTriangle, CheckCircle, Plus, Search, Filter } from "lucide-react";
import { useSecureAuth } from "@/contexts/SecureAuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";

interface AlertData {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'resolved' | 'investigating';
  location_lat?: number;
  location_lng?: number;
  created_at: string;
  created_by?: string;
}

const MapaAlertas = () => {
  const { user } = useSecureAuth();
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAlert, setNewAlert] = useState({
    title: "",
    description: "",
    priority: "medium" as const,
    location_lat: 0,
    location_lng: 0
  });

  // Cargar alertas desde Supabase
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('alerts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching alerts:', error);
          return;
        }

        setAlerts(data || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();

    // Suscripción a cambios en tiempo real
    const subscription = supabase
      .channel('alerts-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'alerts' },
        (payload) => {
          console.log('Alert change detected:', payload);
          fetchAlerts(); // Recargar datos
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Crear nueva alerta
  const handleCreateAlert = async () => {
    if (!newAlert.title.trim() || !user) return;

    try {
      const { error } = await supabase
        .from('alerts')
        .insert({
          title: newAlert.title,
          description: newAlert.description,
          priority: newAlert.priority,
          location_lat: newAlert.location_lat || null,
          location_lng: newAlert.location_lng || null,
          created_by: user.id,
          status: 'active',
          type: 'system'
        });

      if (error) {
        console.error('Error creating alert:', error);
        return;
      }

      // Resetear formulario
      setNewAlert({
        title: "",
        description: "",
        priority: "medium",
        location_lat: 0,
        location_lng: 0
      });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Filtrar alertas
  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.description?.toLowerCase().includes(searchTerm.toLowerCase() || '');
    const matchesPriority = filterPriority === 'all' || alert.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
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
      case 'investigating': return <Search className="w-4 h-4 text-yellow-500" />;
      default: return <MapPin className="w-4 h-4 text-slate-500" />;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-slate-600">Debes iniciar sesión para ver las alertas.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Mapa de Alertas</h1>
              <p className="text-slate-600 mt-2">Sistema de monitoreo y gestión de alertas en tiempo real</p>
            </div>
            
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

          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg shadow-sm border border-slate-200">
            <div className="flex-1">
              <Input
                placeholder="Buscar alertas..."
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
                <option value="critical">Crítica</option>
                <option value="high">Alta</option>
                <option value="medium">Media</option>
                <option value="low">Baja</option>
              </select>
            </div>
          </div>
        </div>

        {/* Formulario crear alerta */}
        {showCreateForm && (
          <Card className="mb-6 border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50">
              <CardTitle className="text-slate-800">Nueva Alerta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div>
                <Input
                  placeholder="Título de la alerta"
                  value={newAlert.title}
                  onChange={(e) => setNewAlert({...newAlert, title: e.target.value})}
                  className="border-slate-300 focus:border-slate-500"
                />
              </div>
              <div>
                <textarea
                  placeholder="Descripción detallada"
                  value={newAlert.description}
                  onChange={(e) => setNewAlert({...newAlert, description: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <select
                  value={newAlert.priority}
                  onChange={(e) => setNewAlert({...newAlert, priority: e.target.value as any})}
                  className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                >
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                  <option value="critical">Crítica</option>
                </select>
                <Input
                  type="number"
                  placeholder="Latitud"
                  value={newAlert.location_lat}
                  onChange={(e) => setNewAlert({...newAlert, location_lat: parseFloat(e.target.value)})}
                  className="border-slate-300 focus:border-slate-500"
                />
                <Input
                  type="number"
                  placeholder="Longitud"
                  value={newAlert.location_lng}
                  onChange={(e) => setNewAlert({...newAlert, location_lng: parseFloat(e.target.value)})}
                  className="border-slate-300 focus:border-slate-500"
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
            <p className="text-slate-600">Cargando alertas...</p>
          </div>
        ) : filteredAlerts.length === 0 ? (
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="text-center py-8">
              <MapPin className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">No se encontraron alertas</p>
              <p className="text-sm text-slate-500 mt-2">
                {searchTerm || filterPriority !== 'all' 
                  ? 'Intenta ajustar los filtros' 
                  : 'Crea la primera alerta para comenzar'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredAlerts.map((alert) => (
              <Card key={alert.id} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
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
                        <span>Creada: {new Date(alert.created_at).toLocaleDateString('es-ES')}</span>
                        {alert.location_lat && alert.location_lng && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {alert.location_lat.toFixed(4)}, {alert.location_lng.toFixed(4)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <Badge className={getPriorityColor(alert.priority)}>
                        {alert.priority.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className="text-slate-600 border-slate-300">
                        {alert.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Resumen estadístico */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
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
                {alerts.filter(a => a.priority === 'critical').length}
              </div>
              <div className="text-sm text-slate-600">Críticas</div>
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
              <div className="text-2xl font-bold text-slate-800">
                {alerts.length}
              </div>
              <div className="text-sm text-slate-600">Total</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MapaAlertas;
