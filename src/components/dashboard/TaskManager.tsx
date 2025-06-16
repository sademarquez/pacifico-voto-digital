
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  Target, 
  Clock,
  Star,
  Trophy,
  Zap
} from "lucide-react";

interface Task {
  id: number;
  titulo: string;
  puntos: number;
  urgente: boolean;
  completada?: boolean;
  descripcion?: string;
}

const TaskManager = () => {
  const [tareas, setTareas] = useState<Task[]>([
    { 
      id: 1, 
      titulo: "Compartir en redes sociales", 
      puntos: 15, 
      urgente: true,
      descripcion: "Comparte nuestras propuestas en tus redes sociales para amplificar nuestro mensaje de cambio y progreso"
    },
    { 
      id: 2, 
      titulo: "Invitar 2 amigos al evento", 
      puntos: 25, 
      urgente: false,
      descripcion: "Invita a familiares y amigos a participar en nuestros eventos comunitarios. Tu red de contactos es fundamental"
    },
    { 
      id: 3, 
      titulo: "Completar encuesta de barrio", 
      puntos: 20, 
      urgente: false,
      descripcion: "Ayúdanos a conocer mejor las necesidades de tu comunidad completando nuestra encuesta territorial"
    },
    { 
      id: 4, 
      titulo: "Asistir a reunión virtual", 
      puntos: 30, 
      urgente: true,
      descripcion: "Participa en nuestra reunión virtual semanal para mantenerte informado de todas las novedades"
    }
  ]);

  const completarTarea = async (id: number) => {
    // Simular llamada a Gemini para generar mensaje de felicitación
    const mensajeFelicitacion = "¡Excelente trabajo! Has contribuido significativamente al éxito de nuestra campaña. Tu dedicación y compromiso marcan la diferencia en nuestra comunidad.";
    
    setTareas(prev => prev.map(tarea => 
      tarea.id === id ? { ...tarea, completada: true } : tarea
    ));
    
    // Mostrar mensaje de éxito (aquí podrías usar toast)
    console.log(mensajeFelicitacion);
  };

  const tareasCompletadas = tareas.filter(t => t.completada).length;
  const progresoTotal = (tareasCompletadas / tareas.length) * 100;

  return (
    <div className="space-y-6">
      {/* Header con progreso */}
      <Card className="bg-gradient-to-r from-blue-50 to-white border-blue-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-blue-800">
            <Target className="w-6 h-6 text-blue-600" />
            Mis Tareas de Campaña
            <Badge className="bg-blue-600 text-white ml-auto">
              {tareasCompletadas}/{tareas.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-700 mb-2">
                <span className="font-medium">Progreso General</span>
                <span className="font-bold text-blue-700">{Math.round(progresoTotal)}%</span>
              </div>
              <Progress value={progresoTotal} className="h-3 bg-gray-200" />
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-1" />
                <p className="text-sm font-medium text-gray-800">{tareasCompletadas} Completadas</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <Clock className="w-6 h-6 text-orange-600 mx-auto mb-1" />
                <p className="text-sm font-medium text-gray-800">{tareas.filter(t => t.urgente && !t.completada).length} Urgentes</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <Star className="w-6 h-6 text-yellow-600 mx-auto mb-1" />
                <p className="text-sm font-medium text-gray-800">{tareas.reduce((acc, t) => t.completada ? acc + t.puntos : acc, 0)} Puntos</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de tareas */}
      <div className="space-y-4">
        {tareas.map((tarea) => (
          <Card 
            key={tarea.id} 
            className={`transition-all duration-300 hover:shadow-lg ${
              tarea.completada 
                ? 'bg-green-50 border-green-200 opacity-75' 
                : 'bg-white border-gray-200 hover:border-blue-300'
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className={`font-semibold ${tarea.completada ? 'text-green-800 line-through' : 'text-gray-900'}`}>
                      {tarea.titulo}
                    </h4>
                    {tarea.completada && <CheckCircle className="w-5 h-5 text-green-600" />}
                  </div>
                  
                  {tarea.descripcion && (
                    <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                      {tarea.descripcion}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                      <Trophy className="w-3 h-3 mr-1" />
                      +{tarea.puntos} puntos
                    </Badge>
                    {tarea.urgente && !tarea.completada && (
                      <Badge className="bg-red-100 text-red-800 border-red-200">
                        <Zap className="w-3 h-3 mr-1" />
                        Urgente
                      </Badge>
                    )}
                    {tarea.completada && (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        ✓ Completada
                      </Badge>
                    )}
                  </div>
                </div>
                
                {!tarea.completada && (
                  <Button 
                    onClick={() => completarTarea(tarea.id)}
                    className="ml-4 bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                    size="sm"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Completar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {progresoTotal === 100 && (
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardContent className="p-6 text-center">
            <Trophy className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-yellow-800 mb-2">
              ¡Felicitaciones!
            </h3>
            <p className="text-yellow-700">
              Has completado todas tus tareas. Tu compromiso con la campaña es extraordinario. 
              ¡Eres un verdadero líder comunitario!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TaskManager;
