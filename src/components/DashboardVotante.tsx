
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { 
  CheckCircle, 
  Calendar, 
  MessageSquare, 
  MapPin, 
  Star,
  Trophy,
  Users,
  Target,
  TrendingUp,
  Award,
  Heart,
  Zap
} from "lucide-react";

const DashboardVotante = () => {
  const { user } = useAuth();

  // Datos simulados para el compromiso del votante
  const miProgreso = {
    tareasCompletadas: 8,
    totalTareas: 12,
    eventosAsistidos: 3,
    puntosAcumulados: 245,
    nivel: "Activista Comprometido",
    proximoNivel: "Líder Comunitario"
  };

  const tareasPendientes = [
    { id: 1, titulo: "Compartir en redes sociales", puntos: 15, urgente: true },
    { id: 2, titulo: "Invitar 2 amigos al evento", puntos: 25, urgente: false },
    { id: 3, titulo: "Completar encuesta de barrio", puntos: 20, urgente: false },
    { id: 4, titulo: "Asistir a reunión virtual", puntos: 30, urgente: true }
  ];

  const proximosEventos = [
    { id: 1, titulo: "Asamblea Comunitaria", fecha: "Mañana 7:00 PM", lugar: "Centro Comunal" },
    { id: 2, titulo: "Jornada de Limpieza", fecha: "Sábado 9:00 AM", lugar: "Parque Central" },
    { id: 3, titulo: "Taller de Liderazgo", fecha: "Domingo 3:00 PM", lugar: "Biblioteca Municipal" }
  ];

  const progresoNivel = (miProgreso.puntosAcumulados % 100);

  return (
    <div className="space-y-6">
      {/* Header Personalizado */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">¡Hola {user?.name}!</h1>
            <p className="text-indigo-100 text-lg">
              Tu compromiso hace la diferencia. ¡Sigamos construyendo juntos!
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-2">
              <Star className="w-8 h-8 text-yellow-300" />
            </div>
            <Badge className="bg-yellow-500 text-yellow-900">
              {miProgreso.nivel}
            </Badge>
          </div>
        </div>
      </div>

      {/* Estadísticas de Progreso */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tareas Completadas</p>
                <p className="text-2xl font-bold text-green-600">{miProgreso.tareasCompletadas}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Eventos Asistidos</p>
                <p className="text-2xl font-bold text-blue-600">{miProgreso.eventosAsistidos}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Puntos Ganados</p>
                <p className="text-2xl font-bold text-purple-600">{miProgreso.puntosAcumulados}</p>
              </div>
              <Trophy className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Progreso Nivel</p>
                <p className="text-2xl font-bold text-orange-600">{progresoNivel}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tareas Pendientes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Mis Tareas Pendientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tareasPendientes.map((tarea) => (
                <div key={tarea.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{tarea.titulo}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="bg-green-100 text-green-800">+{tarea.puntos} puntos</Badge>
                      {tarea.urgente && (
                        <Badge className="bg-red-100 text-red-800">Urgente</Badge>
                      )}
                    </div>
                  </div>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Completar
                  </Button>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Link to="/tareas">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Ver Todas las Tareas
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Próximos Eventos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              Próximos Eventos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {proximosEventos.map((evento) => (
                <div key={evento.id} className="p-3 border rounded-lg hover:bg-gray-50">
                  <h4 className="font-medium text-gray-900">{evento.titulo}</h4>
                  <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                    <Calendar className="w-4 h-4" />
                    {evento.fecha}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {evento.lugar}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Link to="/eventos">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Ver Todos los Eventos
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progreso hacia el Siguiente Nivel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-600" />
            Progreso hacia "{miProgreso.proximoNivel}"
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progreso actual</span>
                <span>{progresoNivel}/100 puntos</span>
              </div>
              <Progress value={progresoNivel} className="h-3" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-blue-50 rounded-lg">
                <Heart className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-medium text-blue-900">Compromiso</h4>
                <p className="text-sm text-blue-700">Tu participación constante</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-medium text-green-900">Comunidad</h4>
                <p className="text-sm text-green-700">Conecta con otros</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <Zap className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-medium text-purple-900">Impacto</h4>
                <p className="text-sm text-purple-700">Genera cambio real</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Acciones Rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link to="/mensajes">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 text-center">
              <MessageSquare className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-medium">Mensajes</h4>
              <p className="text-sm text-gray-600">Chat del equipo</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/lugar-votacion">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 text-center">
              <MapPin className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-medium">Mi Mesa</h4>
              <p className="text-sm text-gray-600">Lugar de votación</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/eventos">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 text-center">
              <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-medium">Eventos</h4>
              <p className="text-sm text-gray-600">Actividades</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/mi-territorio">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <h4 className="font-medium">Mi Barrio</h4>
              <p className="text-sm text-gray-600">Comunidad local</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default DashboardVotante;
