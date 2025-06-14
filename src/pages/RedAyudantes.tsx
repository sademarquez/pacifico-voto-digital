
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  MapPin, 
  MessageSquare, 
  Phone, 
  Mail, 
  Search,
  Building2,
  Crown,
  Star,
  Navigation,
  Network,
  TreePine
} from "lucide-react";
import EstructuraTerritorial from "@/components/EstructuraTerritorial";
import SistemaMensajeria from "@/components/SistemaMensajeria";
import MapaEstructura from "@/components/MapaEstructura";

const RedAyudantes = () => {
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("todos");

  const estadisticasGenerales = {
    totalAyudantes: 342,
    municipios: 42,
    veredas: 156,
    barrios: 89,
    lideresActivos: 67,
    mensajesHoy: 124
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 py-6">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="gradient-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Network className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
            Red de Ayudantes
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Sistema integral de comunicación y organización territorial para la campaña
          </p>
        </div>

        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <Card className="text-center border-l-4 border-l-slate-600">
            <CardContent className="p-3">
              <div className="text-2xl font-bold text-slate-700">{estadisticasGenerales.totalAyudantes}</div>
              <div className="text-xs text-slate-600">Ayudantes</div>
            </CardContent>
          </Card>
          <Card className="text-center border-l-4 border-l-blue-600">
            <CardContent className="p-3">
              <div className="text-2xl font-bold text-blue-700">{estadisticasGenerales.municipios}</div>
              <div className="text-xs text-blue-600">Municipios</div>
            </CardContent>
          </Card>
          <Card className="text-center border-l-4 border-l-green-600">
            <CardContent className="p-3">
              <div className="text-2xl font-bold text-green-700">{estadisticasGenerales.veredas}</div>
              <div className="text-xs text-green-600">Veredas</div>
            </CardContent>
          </Card>
          <Card className="text-center border-l-4 border-l-orange-600">
            <CardContent className="p-3">
              <div className="text-2xl font-bold text-orange-700">{estadisticasGenerales.barrios}</div>
              <div className="text-xs text-orange-600">Barrios</div>
            </CardContent>
          </Card>
          <Card className="text-center border-l-4 border-l-purple-600">
            <CardContent className="p-3">
              <div className="text-2xl font-bold text-purple-700">{estadisticasGenerales.lideresActivos}</div>
              <div className="text-xs text-purple-600">Líderes</div>
            </CardContent>
          </Card>
          <Card className="text-center border-l-4 border-l-red-600">
            <CardContent className="p-3">
              <div className="text-2xl font-bold text-red-700">{estadisticasGenerales.mensajesHoy}</div>
              <div className="text-xs text-red-600">Mensajes Hoy</div>
            </CardContent>
          </Card>
        </div>

        {/* Barra de Búsqueda y Filtros */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar ayudante, líder o ubicación..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filtroTipo === "todos" ? "default" : "outline"}
                  onClick={() => setFiltroTipo("todos")}
                  className="bg-slate-600 hover:bg-slate-700"
                >
                  Todos
                </Button>
                <Button
                  variant={filtroTipo === "lideres" ? "default" : "outline"}
                  onClick={() => setFiltroTipo("lideres")}
                  className="bg-slate-600 hover:bg-slate-700"
                >
                  Líderes
                </Button>
                <Button
                  variant={filtroTipo === "ayudantes" ? "default" : "outline"}
                  onClick={() => setFiltroTipo("ayudantes")}
                  className="bg-slate-600 hover:bg-slate-700"
                >
                  Ayudantes
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Principal */}
        <Tabs defaultValue="estructura" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="estructura" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              <span className="hidden md:inline">Estructura</span>
            </TabsTrigger>
            <TabsTrigger value="mensajeria" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden md:inline">Mensajería</span>
            </TabsTrigger>
            <TabsTrigger value="mapa" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="hidden md:inline">Mapa</span>
            </TabsTrigger>
            <TabsTrigger value="herramientas" className="flex items-center gap-2">
              <Network className="w-4 h-4" />
              <span className="hidden md:inline">Tools</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="estructura" className="space-y-6">
            <EstructuraTerritorial busqueda={busqueda} filtro={filtroTipo} />
          </TabsContent>

          <TabsContent value="mensajeria" className="space-y-6">
            <SistemaMensajeria />
          </TabsContent>

          <TabsContent value="mapa" className="space-y-6">
            <MapaEstructura />
          </TabsContent>

          <TabsContent value="herramientas" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-700">
                    <Phone className="w-5 h-5" />
                    Comunicación Directa
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 mb-4">
                    Herramientas para comunicación instantánea con líderes y ayudantes
                  </p>
                  <Button className="w-full bg-slate-600 hover:bg-slate-700">
                    Iniciar Llamada Grupal
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-700">
                    <Mail className="w-5 h-5" />
                    Boletines
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 mb-4">
                    Envía actualizaciones masivas por territorio
                  </p>
                  <Button className="w-full bg-slate-600 hover:bg-slate-700">
                    Crear Boletín
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-700">
                    <Navigation className="w-5 h-5" />
                    Coordinación
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 mb-4">
                    Coordina actividades y eventos por zona
                  </p>
                  <Button className="w-full bg-slate-600 hover:bg-slate-700">
                    Programar Evento
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RedAyudantes;
