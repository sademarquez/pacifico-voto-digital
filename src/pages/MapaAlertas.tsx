
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, MapPin, Clock, User, Filter } from "lucide-react";

// Datos de ejemplo para las alertas
const alertasEjemplo = [
  {
    id: 1,
    tipoAlerta: "Falla de Servicio Público",
    descripcion: "Corte de energía eléctrica en el sector desde las 6:00 AM",
    municipio: "Buenaventura",
    barrioVereda: "Barrio Bellavista",
    reportadoPor: "María González",
    fechaReporte: "2024-01-15 08:30",
    estado: "Abierta",
    prioridad: "Alta"
  },
  {
    id: 2,
    tipoAlerta: "Problema de Seguridad",
    descripcion: "Aumento de robos en la zona comercial durante las noches",
    municipio: "Tumaco",
    barrioVereda: "Centro",
    reportadoPor: "Carlos Ramírez",
    fechaReporte: "2024-01-14 20:15",
    estado: "En Proceso",
    prioridad: "Media"
  },
  {
    id: 3,
    tipoAlerta: "Necesidad Comunitaria",
    descripcion: "Familias damnificadas por inundación requieren ayuda humanitaria",
    municipio: "Quibdó",
    barrioVereda: "Vereda El Progreso",
    reportadoPor: "Ana Mosquera",
    fechaReporte: "2024-01-13 14:20",
    estado: "Resuelta",
    prioridad: "Crítica"
  },
  {
    id: 4,
    tipoAlerta: "Emergencia Médica",
    descripcion: "Necesidad urgente de medicamentos para diabetes en el puesto de salud",
    municipio: "Guapi",
    barrioVereda: "Centro",
    reportadoPor: "Dr. Luis Parra",
    fechaReporte: "2024-01-12 16:45",
    estado: "En Proceso",
    prioridad: "Crítica"
  }
];

const MapaAlertas = () => {
  const [alertas, setAlertas] = useState(alertasEjemplo);
  const [filtroTipo, setFiltroTipo] = useState("todas");
  const [filtroEstado, setFiltroEstado] = useState("todas");
  const [alertasFiltradas, setAlertasFiltradas] = useState(alertasEjemplo);

  useEffect(() => {
    let filtradas = alertas;

    if (filtroTipo !== "todas") {
      filtradas = filtradas.filter(alerta => alerta.tipoAlerta === filtroTipo);
    }

    if (filtroEstado !== "todas") {
      filtradas = filtradas.filter(alerta => alerta.estado === filtroEstado);
    }

    setAlertasFiltradas(filtradas);
  }, [alertas, filtroTipo, filtroEstado]);

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Abierta": return "bg-red-100 text-red-800";
      case "En Proceso": return "bg-yellow-100 text-yellow-800";
      case "Resuelta": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case "Crítica": return "bg-red-500";
      case "Alta": return "bg-orange-500";
      case "Media": return "bg-yellow-500";
      case "Baja": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 mr-3 text-red-600" />
            Mapa de Alertas en Tiempo Real
          </h1>
          <p className="text-lg text-gray-600">
            Monitoreo y seguimiento de emergencias comunitarias
          </p>
        </div>

        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center border-l-4 border-l-red-500">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">
                {alertas.filter(a => a.estado === "Abierta").length}
              </div>
              <div className="text-sm text-gray-600">Alertas Abiertas</div>
            </CardContent>
          </Card>
          <Card className="text-center border-l-4 border-l-yellow-500">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {alertas.filter(a => a.estado === "En Proceso").length}
              </div>
              <div className="text-sm text-gray-600">En Proceso</div>
            </CardContent>
          </Card>
          <Card className="text-center border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {alertas.filter(a => a.estado === "Resuelta").length}
              </div>
              <div className="text-sm text-gray-600">Resueltas</div>
            </CardContent>
          </Card>
          <Card className="text-center border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">
                {alertas.filter(a => a.prioridad === "Crítica").length}
              </div>
              <div className="text-sm text-gray-600">Críticas</div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tipo de Alerta</label>
                <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas las alertas</SelectItem>
                    <SelectItem value="Falla de Servicio Público">Falla de Servicio Público</SelectItem>
                    <SelectItem value="Problema de Seguridad">Problema de Seguridad</SelectItem>
                    <SelectItem value="Necesidad Comunitaria">Necesidad Comunitaria</SelectItem>
                    <SelectItem value="Emergencia Médica">Emergencia Médica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Estado</label>
                <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todos los estados</SelectItem>
                    <SelectItem value="Abierta">Abierta</SelectItem>
                    <SelectItem value="En Proceso">En Proceso</SelectItem>
                    <SelectItem value="Resuelta">Resuelta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Reportar Nueva Alerta
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Alertas */}
        <div className="space-y-4">
          {alertasFiltradas.map((alerta) => (
            <Card key={alerta.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-4 h-4 rounded-full ${getPrioridadColor(alerta.prioridad)}`}></div>
                      <Badge variant="outline" className="text-sm">
                        {alerta.tipoAlerta}
                      </Badge>
                      <Badge className={getEstadoColor(alerta.estado)}>
                        {alerta.estado}
                      </Badge>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {alerta.descripcion}
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        {alerta.municipio}, {alerta.barrioVereda}
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-gray-400" />
                        Reportado por: {alerta.reportadoPor}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                        {new Date(alerta.fechaReporte).toLocaleString('es-CO')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Ver Detalles
                    </Button>
                    {alerta.estado === "Abierta" && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        Atender
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {alertasFiltradas.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No se encontraron alertas
              </h3>
              <p className="text-gray-500">
                Intenta ajustar los filtros o reporta una nueva alerta
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MapaAlertas;
