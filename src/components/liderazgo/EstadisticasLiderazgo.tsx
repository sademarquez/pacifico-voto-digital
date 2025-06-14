
import { Card, CardContent } from "@/components/ui/card";
import { Lider } from "@/types/liderazgo";

interface EstadisticasLiderazgoProps {
  lideres: Lider[];
}

const EstadisticasLiderazgo = ({ lideres }: EstadisticasLiderazgoProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <Card className="text-center border-l-4 border-l-slate-600 shadow-3d hover:shadow-3d-hover transition-all duration-300 transform hover:-translate-y-1">
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-slate-700 drop-shadow-sm">
            {lideres.length}
          </div>
          <div className="text-sm text-slate-600">Líderes Activos</div>
        </CardContent>
      </Card>
      
      <Card className="text-center border-l-4 border-l-stone-600 shadow-3d hover:shadow-3d-hover transition-all duration-300 transform hover:-translate-y-1">
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-stone-700 drop-shadow-sm">
            {lideres.reduce((sum, lider) => sum + lider.miembrosRegistrados, 0)}
          </div>
          <div className="text-sm text-slate-600">Miembros Registrados</div>
        </CardContent>
      </Card>
      
      <Card className="text-center border-l-4 border-l-gray-600 shadow-3d hover:shadow-3d-hover transition-all duration-300 transform hover:-translate-y-1">
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-gray-700 drop-shadow-sm">
            {lideres.reduce((sum, lider) => sum + lider.alertasReportadas, 0)}
          </div>
          <div className="text-sm text-slate-600">Alertas Reportadas</div>
        </CardContent>
      </Card>
      
      <Card className="text-center border-l-4 border-l-amber-600 shadow-3d hover:shadow-3d-hover transition-all duration-300 transform hover:-translate-y-1">
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-amber-700 drop-shadow-sm">
            {lideres.filter(l => l.nivel === "Oro").length}
          </div>
          <div className="text-sm text-slate-600">Líderes Oro</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EstadisticasLiderazgo;
