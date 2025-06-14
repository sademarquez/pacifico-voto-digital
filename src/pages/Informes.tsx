
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BarChart3, TrendingUp, Download } from "lucide-react";

const Informes = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-4 flex items-center justify-center">
            <FileText className="w-8 h-8 mr-3 text-slate-600" />
            Informes y Reportes
          </h1>
          <p className="text-lg text-slate-600">
            Análisis detallados y reportes de campaña
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-lg bg-slate-600 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg text-slate-800">Análisis Estadístico</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Métricas y estadísticas detalladas de la campaña
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-lg bg-gray-600 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg text-slate-800">Tendencias</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Análisis de tendencias y evolución temporal
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-lg bg-stone-600 flex items-center justify-center">
                  <Download className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg text-slate-800">Exportar Datos</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Descarga reportes en diferentes formatos
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Informes;
