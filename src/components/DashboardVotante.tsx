
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useSecureAuth } from "../contexts/SecureAuthContext";
import { Link } from "react-router-dom";
import { 
  CheckCircle, 
  Calendar, 
  MapPin, 
  Star,
  Trophy,
  Users,
  Target,
  TrendingUp,
  Award,
  Heart,
  Zap,
  MessageSquare,
  Phone,
  Share2,
  FileText,
  ArrowRight
} from "lucide-react";

const DashboardVotante = () => {
  const { user } = useSecureAuth();

  // Datos de progreso mejorados con integración Gemini
  const miProgreso = {
    tareasCompletadas: 8,
    totalTareas: 12,
    eventosAsistidos: 3,
    puntosAcumulados: 245,
    nivel: "Activista Comprometido",
    proximoNivel: "Líder Comunitario",
    porcentajeNivel: 85,
    metaMensual: 300,
    diasActivos: 15,
    reconocimientos: 2
  };

  const accionesRapidas = [
    {
      titulo: "Mis Tareas Pendientes",
      descripcion: "4 tareas esperando tu atención",
      icono: Target,
      color: "text-blue-600",
      fondo: "bg-blue-50 hover:bg-blue-100",
      borde: "border-blue-200",
      link: "/tareas",
      urgente: true
    },
    {
      titulo: "Próximos Eventos",
      descripcion: "2 eventos esta semana",
      icono: Calendar,
      color: "text-purple-600",
      fondo: "bg-purple-50 hover:bg-purple-100",
      borde: "border-purple-200",
      link: "/eventos"
    },
    {
      titulo: "Centro de Mensajes",
      descripcion: "3 mensajes nuevos",
      icono: MessageSquare,
      color: "text-green-600",
      fondo: "bg-green-50 hover:bg-green-100",
      borde: "border-green-200",
      link: "/mensajes",
      notificaciones: 3
    },
    {
      titulo: "Mi Mesa de Votación",
      descripcion: "Información actualizada",
      icono: MapPin,
      color: "text-orange-600",
      fondo: "bg-orange-50 hover:bg-orange-100",
      borde: "border-orange-200",
      link: "/lugar-votacion"
    }
  ];

  const progresoNivel = (miProgreso.puntosAcumulados % 100);
  const progresoMeta = (miProgreso.puntosAcumulados / miProgreso.metaMensual) * 100;

  return (
    <div className="space-y-6">
      {/* Header Personalizado Mejorado */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              ¡Hola {user?.name}! 🌟
            </h1>
            <p className="text-indigo-100 text-lg mb-2">
              Tu compromiso transforma comunidades y construye el futuro que soñamos.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Trophy className="w-4 h-4" />
                <span>{miProgreso.puntosAcumulados} puntos acumulados</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{miProgreso.diasActivos} días activo</span>
              </div>
            </div>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-3 backdrop-blur-sm">
              <Star className="w-10 h-10 text-yellow-300" />
            </div>
            <Badge className="bg-yellow-500 text-yellow-900 font-semibold px-3 py-1">
              {miProgreso.nivel}
            </Badge>
          </div>
        </div>
      </div>

      {/* Estadísticas Mejoradas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-500 bg-green-50 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Tareas Completadas</p>
                <p className="text-2xl font-bold text-green-800">{miProgreso.tareasCompletadas}/{miProgreso.totalTareas}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 bg-blue-50 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Eventos Asistidos</p>
                <p className="text-2xl font-bold text-blue-800">{miProgreso.eventosAsistidos}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 bg-purple-50 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Puntos Ganados</p>
                <p className="text-2xl font-bold text-purple-800">{miProgreso.puntosAcumulados}</p>
              </div>
              <Trophy className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 bg-orange-50 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">Reconocimientos</p>
                <p className="text-2xl font-bold text-orange-800">{miProgreso.reconocimientos}</p>
              </div>
              <Award className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progreso hacia Meta Mensual */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Target className="w-5 h-5" />
            Progreso Meta Mensual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-blue-700 mb-2">
                <span>Meta: {miProgreso.metaMensual} puntos</span>
                <span className="font-bold">{Math.round(progresoMeta)}% completado</span>
              </div>
              <Progress value={progresoMeta} className="h-3" />
              <p className="text-xs text-blue-600 mt-1">
                Te faltan {miProgreso.metaMensual - miProgreso.puntosAcumulados} puntos para alcanzar tu meta
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Acciones Rápidas Mejoradas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {accionesRapidas.map((accion, index) => {
          const Icono = accion.icono;
          return (
            <Link key={index} to={accion.link}>
              <Card className={`${accion.fondo} ${accion.borde} border-2 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer relative`}>
                <CardContent className="p-4">
                  {accion.notificaciones && (
                    <Badge className="absolute -top-2 -right-2 bg-red-500 text-white">
                      {accion.notificaciones}
                    </Badge>
                  )}
                  {accion.urgente && (
                    <Badge className="absolute -top-2 -left-2 bg-orange-500 text-white text-xs">
                      Urgente
                    </Badge>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center">
                        <Icono className={`w-6 h-6 ${accion.color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{accion.titulo}</h3>
                        <p className="text-sm text-gray-600">{accion.descripcion}</p>
                      </div>
                    </div>
                    <ArrowRight className={`w-5 h-5 ${accion.color}`} />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Progreso hacia Siguiente Nivel */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-800">
            <Award className="w-5 h-5" />
            Progreso hacia "{miProgreso.proximoNivel}"
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-yellow-700 mb-2">
                <span>Progreso actual</span>
                <span>{progresoNivel}/100 puntos para siguiente nivel</span>
              </div>
              <Progress value={progresoNivel} className="h-3" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-white rounded-lg shadow-sm border border-yellow-200">
                <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-900">Compromiso</h4>
                <p className="text-sm text-gray-600">Tu participación constante nos inspira</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-sm border border-yellow-200">
                <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-900">Comunidad</h4>
                <p className="text-sm text-gray-600">Conecta y fortalece lazos</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-sm border border-yellow-200">
                <Zap className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-900">Impacto</h4>
                <p className="text-sm text-gray-600">Genera cambio real y duradero</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Motivación Personalizada */}
      <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
        <CardContent className="p-6 text-center">
          <Trophy className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-emerald-800 mb-2">
            ¡Tu Liderazgo Marca la Diferencia!
          </h3>
          <p className="text-emerald-700 leading-relaxed max-w-2xl mx-auto">
            Cada acción que realizas contribuye directamente al fortalecimiento de nuestra comunidad. 
            Tu compromiso y dedicación son el motor que impulsa el cambio positivo que todos esperamos. 
            ¡Sigamos construyendo juntos el futuro que merecemos!
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <Link to="/compartir">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Share2 className="w-4 h-4 mr-2" />
                Compartir Logros
              </Button>
            </Link>
            <Link to="/contacto">
              <Button variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                <Phone className="w-4 h-4 mr-2" />
                Contactar Equipo
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardVotante;
