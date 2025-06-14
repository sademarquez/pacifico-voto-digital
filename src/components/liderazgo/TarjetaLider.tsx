
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, Crown, MapPin, Star } from "lucide-react";
import { Lider } from "@/types/liderazgo";

interface TarjetaLiderProps {
  lider: Lider;
  onClick: (lider: Lider) => void;
}

const TarjetaLider = ({ lider, onClick }: TarjetaLiderProps) => {
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
    <Card 
      className="hover:shadow-3d-hover transition-all duration-300 cursor-pointer border-slate-200 shadow-3d transform hover:-translate-y-2 hover:scale-105 card-3d"
      onClick={() => onClick(lider)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-slate-100 rounded-lg shadow-inner">
              {getRolIcon(lider.rol)}
            </div>
            <div>
              <CardTitle className="text-lg text-slate-800 drop-shadow-sm">{lider.nombre}</CardTitle>
              <CardDescription className="flex items-center">
                <span className="text-sm font-medium text-slate-600">{lider.id}</span>
              </CardDescription>
            </div>
          </div>
          <Badge className={`${getNivelColor(lider.nivel)} border shadow-sm`}>
            {lider.nivel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center text-sm text-slate-600">
            <MapPin className="w-4 h-4 mr-2" />
            {lider.municipio} - {lider.zona}
          </div>
          
          <div className="flex items-center text-sm text-slate-600">
            <Users className="w-4 h-4 mr-2" />
            {lider.rol}
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-slate-50 p-3 rounded-lg border shadow-inner">
              <div className="font-semibold text-slate-800">{lider.miembrosRegistrados}</div>
              <div className="text-slate-600">Miembros</div>
            </div>
            <div className="bg-stone-50 p-3 rounded-lg border shadow-inner">
              <div className="font-semibold text-stone-800">{lider.alertasReportadas}</div>
              <div className="text-stone-600">Alertas</div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-600">Compromiso</span>
              <span className="font-semibold text-slate-700">{lider.puntosCompromiso} pts</span>
            </div>
            <Progress 
              value={calcularProgresoPorcentaje(lider.puntosCompromiso)} 
              className="h-3 shadow-inner"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TarjetaLider;
