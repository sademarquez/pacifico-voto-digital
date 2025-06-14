
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Users, Crown, MapPin, Phone, Star, Award } from "lucide-react";

// Datos de ejemplo para líderes
const lideresEjemplo = [
  {
    id: "LID001",
    nombre: "María González",
    rol: "Líder Municipal",
    municipio: "Buenaventura",
    zona: "Zona Oriental",
    telefono: "+57 300 123 4567",
    miembrosRegistrados: 45,
    alertasReportadas: 12,
    puntosCompromiso: 890,
    nivel: "Oro",
    fechaIngreso: "2023-08-15"
  },
  {
    id: "LID002",
    nombre: "Carlos Ramírez",
    rol: "Líder Zonal",
    municipio: "Tumaco",
    zona: "Centro",
    telefono: "+57 301 234 5678",
    miembrosRegistrados: 32,
    alertasReportadas: 8,
    puntosCompromiso: 650,
    nivel: "Plata",
    fechaIngreso: "2023-09-22"
  },
  {
    id: "LID003",
    nombre: "Ana Mosquera",
    rol: "Líder de Barrio",
    municipio: "Quibdó",
    zona: "Barrio Kennedy",
    telefono: "+57 302 345 6789",
    miembrosRegistrados: 28,
    alertasReportadas: 15,
    puntosCompromiso: 720,
    nivel: "Plata",
    fechaIngreso: "2023-07-10"
  },
  {
    id: "LID004",
    nombre: "Luis Parra",
    rol: "Líder de Vereda",
    municipio: "Guapi",
    zona: "Vereda San José",
    telefono: "+57 303 456 7890",
    miembrosRegistrados: 18,
    alertasReportadas: 5,
    puntosCompromiso: 420,
    nivel: "Bronce",
    fechaIngreso: "2023-10-05"
  }
];

const Liderazgo = () => {
  const [lideres] = useState(lideresEjemplo);
  const [liderSeleccionado, setLiderSeleccionado] = useState<typeof lideresEjemplo[0] | null>(null);

  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case "Oro": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Plata": return "bg-gray-100 text-gray-800 border-gray-300";
      case "Bronce": return "bg-orange-100 text-orange-800 border-orange-300";
      default: return "bg-blue-100 text-blue-800 border-blue-300";
    }
  };

  const getRolIcon = (rol: string) => {
    switch (rol) {
      case "Líder Municipal": return <Crown className="w-5 h-5 text-purple-600" />;
      case "Líder Zonal": return <Star className="w-5 h-5 text-blue-600" />;
      case "Líder de Barrio": return <Users className="w-5 h-5 text-green-600" />;
      case "Líder de Vereda": return <MapPin className="w-5 h-5 text-orange-600" />;
      default: return <Users className="w-5 h-5 text-gray-600" />;
    }
  };

  const calcularProgresoPorcentaje = (puntos: number) => {
    const maxPuntos = 1000;
    return Math.min((puntos / maxPuntos) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center">
            <Crown className="w-8 h-8 mr-3 text-purple-600" />
            Red de Liderazgo Territorial
          </h1>
          <p className="text-lg text-gray-600">
            Conoce a los líderes que están transformando sus comunidades
          </p>
        </div>

        {/* Estadísticas Generales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">
                {lideres.length}
              </div>
              <div className="text-sm text-gray-600">Líderes Activos</div>
            </CardContent>
          </Card>
          <Card className="text-center border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">
                {lideres.reduce((sum, lider) => sum + lider.miembrosRegistrados, 0)}
              </div>
              <div className="text-sm text-gray-600">Miembros Registrados</div>
            </CardContent>
          </Card>
          <Card className="text-center border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {lideres.reduce((sum, lider) => sum + lider.alertasReportadas, 0)}
              </div>
              <div className="text-sm text-gray-600">Alertas Reportadas</div>
            </CardContent>
          </Card>
          <Card className="text-center border-l-4 border-l-yellow-500">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {lideres.filter(l => l.nivel === "Oro").length}
              </div>
              <div className="text-sm text-gray-600">Líderes Oro</div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Líderes */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {lideres.map((lider) => (
            <Card 
              key={lider.id} 
              className="hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => setLiderSeleccionado(lider)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getRolIcon(lider.rol)}
                    <div>
                      <CardTitle className="text-lg">{lider.nombre}</CardTitle>
                      <CardDescription className="flex items-center">
                        <span className="text-sm font-medium">{lider.id}</span>
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={`${getNivelColor(lider.nivel)} border`}>
                    {lider.nivel}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {lider.municipio} - {lider.zona}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    {lider.rol}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-blue-50 p-2 rounded">
                      <div className="font-semibold text-blue-800">{lider.miembrosRegistrados}</div>
                      <div className="text-blue-600">Miembros</div>
                    </div>
                    <div className="bg-green-50 p-2 rounded">
                      <div className="font-semibold text-green-800">{lider.alertasReportadas}</div>
                      <div className="text-green-600">Alertas</div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Compromiso</span>
                      <span className="font-semibold">{lider.puntosCompromiso} pts</span>
                    </div>
                    <Progress 
                      value={calcularProgresoPorcentaje(lider.puntosCompromiso)} 
                      className="h-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detalles del Líder Seleccionado */}
        {liderSeleccionado && (
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl flex items-center">
                  {getRolIcon(liderSeleccionado.rol)}
                  <span className="ml-2">{liderSeleccionado.nombre}</span>
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setLiderSeleccionado(null)}
                >
                  Cerrar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">Información General</h3>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">ID de Líder:</span>
                      <span className="font-medium">{liderSeleccionado.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rol:</span>
                      <span className="font-medium">{liderSeleccionado.rol}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ubicación:</span>
                      <span className="font-medium">{liderSeleccionado.municipio}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Zona:</span>
                      <span className="font-medium">{liderSeleccionado.zona}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fecha de Ingreso:</span>
                      <span className="font-medium">
                        {new Date(liderSeleccionado.fechaIngreso).toLocaleDateString('es-CO')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">Métricas de Impacto</h3>
                  
                  <div className="space-y-3">
                    <div className="bg-white p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600">Miembros Registrados</span>
                        <Badge variant="outline">{liderSeleccionado.miembrosRegistrados}</Badge>
                      </div>
                      <Progress value={(liderSeleccionado.miembrosRegistrados / 50) * 100} className="h-2" />
                    </div>

                    <div className="bg-white p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600">Alertas Reportadas</span>
                        <Badge variant="outline">{liderSeleccionado.alertasReportadas}</Badge>
                      </div>
                      <Progress value={(liderSeleccionado.alertasReportadas / 20) * 100} className="h-2" />
                    </div>

                    <div className="bg-white p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600">Puntos de Compromiso</span>
                        <Badge className={getNivelColor(liderSeleccionado.nivel)}>
                          {liderSeleccionado.puntosCompromiso} pts
                        </Badge>
                      </div>
                      <Progress value={calcularProgresoPorcentaje(liderSeleccionado.puntosCompromiso)} className="h-2" />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button size="sm" className="flex-1">
                      <Phone className="w-4 h-4 mr-2" />
                      Contactar
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Award className="w-4 h-4 mr-2" />
                      Ver Equipo
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white mt-8">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">
              ¿Quieres Ser Parte del Liderazgo?
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Únete a nuestra red de líderes territoriales y ayuda a transformar tu comunidad
            </p>
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
              Solicitar Ser Líder
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Liderazgo;
