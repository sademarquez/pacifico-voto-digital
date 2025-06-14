
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Users, Crown, MapPin, Star, Phone, Award } from "lucide-react";
import { Lider } from "@/types/liderazgo";

interface DetallesLiderProps {
  lider: Lider;
  onClose: () => void;
}

const DetallesLider = ({ lider, onClose }: DetallesLiderProps) => {
  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case "Oro": return "bg-amber-50 text-amber-800 border-amber-200";
      case "Plata": return "bg-slate-50 text-slate-700 border-slate-200";
      case "Bronce": return "bg-stone-50 text-stone-700 border-stone-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getRolIcon = (rol: string) => {
    switch (rol) {
      case "Líder Municipal": return <Crown className="w-5 h-5 text-slate-600" />;
      case "Líder Zonal": return <Star className="w-5 h-5 text-slate-600" />;
      case "Líder de Barrio": return <Users className="w-5 h-5 text-slate-600" />;
      case "Líder de Vereda": return <MapPin className="w-5 h-5 text-slate-600" />;
      default: return <Users className="w-5 h-5 text-slate-600" />;
    }
  };

  const calcularProgresoPorcentaje = (puntos: number) => {
    const maxPuntos = 1000;
    return Math.min((puntos / maxPuntos) * 100, 100);
  };

  return (
    <Card className="bg-gradient-to-r from-slate-50 to-stone-50 border-slate-200 shadow-3d">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center text-slate-800 drop-shadow-sm">
            <div className="p-2 bg-white rounded-lg shadow-3d mr-3">
              {getRolIcon(lider.rol)}
            </div>
            <span>{lider.nombre}</span>
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onClose}
            className="border-slate-300 text-slate-700 hover:bg-slate-100 shadow-3d hover:shadow-3d-hover transition-shadow"
          >
            Cerrar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b border-slate-200 pb-2 text-slate-800 drop-shadow-sm">Información General</h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between p-2 bg-white rounded shadow-sm">
                <span className="text-slate-600">ID de Líder:</span>
                <span className="font-medium text-slate-800">{lider.id}</span>
              </div>
              <div className="flex justify-between p-2 bg-white rounded shadow-sm">
                <span className="text-slate-600">Rol:</span>
                <span className="font-medium text-slate-800">{lider.rol}</span>
              </div>
              <div className="flex justify-between p-2 bg-white rounded shadow-sm">
                <span className="text-slate-600">Ubicación:</span>
                <span className="font-medium text-slate-800">{lider.municipio}</span>
              </div>
              <div className="flex justify-between p-2 bg-white rounded shadow-sm">
                <span className="text-slate-600">Zona:</span>
                <span className="font-medium text-slate-800">{lider.zona}</span>
              </div>
              <div className="flex justify-between p-2 bg-white rounded shadow-sm">
                <span className="text-slate-600">Fecha de Ingreso:</span>
                <span className="font-medium text-slate-800">
                  {new Date(lider.fechaIngreso).toLocaleDateString('es-CO')}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b border-slate-200 pb-2 text-slate-800 drop-shadow-sm">Métricas de Impacto</h3>
            
            <div className="space-y-3">
              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-3d">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-600">Miembros Registrados</span>
                  <Badge variant="outline" className="border-slate-300 text-slate-700 shadow-sm">{lider.miembrosRegistrados}</Badge>
                </div>
                <Progress value={(lider.miembrosRegistrados / 50) * 100} className="h-3 shadow-inner" />
              </div>

              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-3d">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-600">Alertas Reportadas</span>
                  <Badge variant="outline" className="border-slate-300 text-slate-700 shadow-sm">{lider.alertasReportadas}</Badge>
                </div>
                <Progress value={(lider.alertasReportadas / 20) * 100} className="h-3 shadow-inner" />
              </div>

              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-3d">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-600">Puntos de Compromiso</span>
                  <Badge className={`${getNivelColor(lider.nivel)} shadow-sm`}>
                    {lider.puntosCompromiso} pts
                  </Badge>
                </div>
                <Progress value={calcularProgresoPorcentaje(lider.puntosCompromiso)} className="h-3 shadow-inner" />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button size="sm" className="flex-1 bg-slate-700 hover:bg-slate-800 text-white shadow-3d hover:shadow-3d-hover transition-shadow">
                <Phone className="w-4 h-4 mr-2" />
                Contactar
              </Button>
              <Button variant="outline" size="sm" className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-100 shadow-3d hover:shadow-3d-hover transition-shadow">
                <Award className="w-4 h-4 mr-2" />
                Ver Equipo
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DetallesLider;
