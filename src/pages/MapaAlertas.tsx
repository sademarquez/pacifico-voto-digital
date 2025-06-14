
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Plus, Filter, Users, MapPin } from "lucide-react";
import MapaInteractivo from "@/components/MapaInteractivo";

interface Alerta {
  id: string;
  municipio: string;
  tipo: string;
  severidad: 'baja' | 'media' | 'alta' | 'crítica';
  descripcion: string;
  lat: number;
  lng: number;
  fecha: string;
  lider?: string;
}

const MapaAlertas = () => {
  const { toast } = useToast();
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [filtroSeveridad, setFiltroSeveridad] = useState<string>("todas");
  const [alertaSeleccionada, setAlertaSeleccionada] = useState<Alerta | null>(null);

  // Datos simulados de alertas en el Cauca
  useEffect(() => {
    const alertasSimuladas: Alerta[] = [
      {
        id: "1",
        municipio: "Popayán",
        tipo: "Inundación",
        severidad: "alta",
        descripcion: "Desbordamiento del río Molino en el sector urbano",
        lat: 2.4448,
        lng: -76.6147,
        fecha: "2024-06-14",
        lider: "María González"
      },
      {
        id: "2",
        municipio: "Timbío",
        tipo: "Deslizamiento",
        severidad: "crítica",
        descripcion: "Deslizamiento de tierra en la vía principal",
        lat: 2.3547,
        lng: -76.6829,
        fecha: "2024-06-13",
        lider: "Carlos Rodríguez"
      },
      {
        id: "3",
        municipio: "Silvia",
        tipo: "Incendio Forestal",
        severidad: "media",
        descripcion: "Incendio controlado en zona rural",
        lat: 2.6156,
        lng: -76.3831,
        fecha: "2024-06-12",
        lider: "Ana Muñoz"
      },
      {
        id: "4",
        municipio: "Santander de Quilichao",
        tipo: "Sequía",
        severidad: "baja",
        descripcion: "Escasez de agua en algunas veredas",
        lat: 3.0097,
        lng: -76.4847,
        fecha: "2024-06-11"
      },
      {
        id: "5",
        municipio: "Cajibío",
        tipo: "Granizada",
        severidad: "media",
        descripcion: "Granizada afectó cultivos de café",
        lat: 2.5506,
        lng: -76.8733,
        fecha: "2024-06-10",
        lider: "Pedro López"
      },
      {
        id: "6",
        municipio: "Toribío",
        tipo: "Conflicto Armado",
        severidad: "crítica",
        descripcion: "Enfrentamientos reportados en zona rural",
        lat: 3.0167,
        lng: -76.0833,
        fecha: "2024-06-09",
        lider: "Rosa Piñacué"
      }
    ];
    setAlertas(alertasSimuladas);
  }, []);

  const alertasFiltradas = alertas.filter(alerta => 
    filtroSeveridad === "todas" || alerta.severidad === filtroSeveridad
  );

  const handleAlertaClick = (alerta: Alerta) => {
    setAlertaSeleccionada(alerta);
    toast({
      title: "Alerta Seleccionada",
      description: `${alerta.tipo} en ${alerta.municipio}`,
    });
  };

  const getSeverityColor = (severidad: string) => {
    switch (severidad) {
      case 'baja': return 'bg-green-100 text-green-800 border-green-200';
      case 'media': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'alta': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'crítica': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const conteoSeveridad = {
    crítica: alertas.filter(a => a.severidad === 'crítica').length,
    alta: alertas.filter(a => a.severidad === 'alta').length,
    media: alertas.filter(a => a.severidad === 'media').length,
    baja: alertas.filter(a => a.severidad === 'baja').length,
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="gradient-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <MapPin className="text-white w-8 h-8" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Mapa de Alertas del Cauca
        </h1>
        <p className="text-purple-600 max-w-2xl mx-auto">
          Monitoreo en tiempo real de emergencias y situaciones críticas en el departamento del Cauca
        </p>
      </div>

      {/* Estadísticas Rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center border-red-200">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{conteoSeveridad.crítica}</div>
            <div className="text-sm text-red-700">Críticas</div>
          </CardContent>
        </Card>
        <Card className="text-center border-orange-200">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{conteoSeveridad.alta}</div>
            <div className="text-sm text-orange-700">Altas</div>
          </CardContent>
        </Card>
        <Card className="text-center border-yellow-200">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{conteoSeveridad.media}</div>
            <div className="text-sm text-yellow-700">Medias</div>
          </CardContent>
        </Card>
        <Card className="text-center border-green-200">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{conteoSeveridad.baja}</div>
            <div className="text-sm text-green-700">Bajas</div>
          </CardContent>
        </Card>
      </div>

      {/* Controles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <Filter className="w-5 h-5" />
            Filtros y Acciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex gap-2">
              <Button
                variant={filtroSeveridad === "todas" ? "default" : "outline"}
                onClick={() => setFiltroSeveridad("todas")}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Todas
              </Button>
              <Button
                variant={filtroSeveridad === "crítica" ? "destructive" : "outline"}
                onClick={() => setFiltroSeveridad("crítica")}
              >
                Críticas
              </Button>
              <Button
                variant={filtroSeveridad === "alta" ? "default" : "outline"}
                onClick={() => setFiltroSeveridad("alta")}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Altas
              </Button>
              <Button
                variant={filtroSeveridad === "media" ? "default" : "outline"}
                onClick={() => setFiltroSeveridad("media")}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                Medias
              </Button>
              <Button
                variant={filtroSeveridad === "baja" ? "default" : "outline"}
                onClick={() => setFiltroSeveridad("baja")}
                className="bg-green-600 hover:bg-green-700"
              >
                Bajas
              </Button>
            </div>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Alerta
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mapa Interactivo */}
      <MapaInteractivo 
        alertas={alertasFiltradas} 
        onAlertaClick={handleAlertaClick}
      />

      {/* Lista de Alertas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <AlertTriangle className="w-5 h-5" />
            Alertas Activas ({alertasFiltradas.length})
          </CardTitle>
          <CardDescription>
            Haz clic en cualquier alerta para verla en el mapa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {alertasFiltradas.map((alerta) => (
              <Card 
                key={alerta.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  alertaSeleccionada?.id === alerta.id ? 'ring-2 ring-purple-500' : ''
                }`}
                onClick={() => handleAlertaClick(alerta)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-purple-800">{alerta.municipio}</h3>
                        <Badge className={getSeverityColor(alerta.severidad)}>
                          {alerta.severidad.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium text-gray-700">{alerta.tipo}</p>
                      <p className="text-sm text-gray-600">{alerta.descripcion}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>📅 {alerta.fecha}</span>
                        {alerta.lider && (
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {alerta.lider}
                          </span>
                        )}
                      </div>
                    </div>
                    <MapPin className="w-5 h-5 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MapaAlertas;
