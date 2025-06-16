
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  MapPin, 
  Clock,
  Users,
  Bell,
  CheckCircle
} from "lucide-react";

interface Evento {
  id: number;
  titulo: string;
  fecha: string;
  hora: string;
  lugar: string;
  descripcion: string;
  asistire: boolean;
  tipoEvento: 'asamblea' | 'jornada' | 'taller' | 'reunion';
  espaciosDisponibles?: number;
}

const EventsManager = () => {
  const [eventos, setEventos] = useState<Evento[]>([
    { 
      id: 1, 
      titulo: "Asamblea Comunitaria", 
      fecha: "Mañana", 
      hora: "7:00 PM",
      lugar: "Centro Comunal Sector Norte", 
      descripcion: "Reunión informativa sobre las propuestas para mejorar la infraestructura del sector. Discutiremos proyectos de pavimentación, alumbrado público y espacios recreativos.",
      asistire: false,
      tipoEvento: 'asamblea',
      espaciosDisponibles: 45
    },
    { 
      id: 2, 
      titulo: "Jornada de Limpieza Comunitaria", 
      fecha: "Sábado 18 Enero", 
      hora: "9:00 AM",
      lugar: "Parque Central", 
      descripcion: "Actividad de integración comunitaria para el mantenimiento de nuestros espacios públicos. Incluye jornada de reforestación y embellecimiento del parque.",
      asistire: false,
      tipoEvento: 'jornada',
      espaciosDisponibles: 30
    },
    { 
      id: 3, 
      titulo: "Taller de Liderazgo Juvenil", 
      fecha: "Domingo 19 Enero", 
      hora: "3:00 PM",
      lugar: "Biblioteca Municipal", 
      descripcion: "Capacitación especializada para jóvenes interesados en participar activamente en procesos de transformación social y política comunitaria.",
      asistire: false,
      tipoEvento: 'taller',
      espaciosDisponibles: 25
    }
  ]);

  const confirmarAsistencia = async (id: number) => {
    // Simular integración con Gemini para generar confirmación personalizada
    const mensajeConfirmacion = "Tu asistencia ha sido confirmada. Te enviaremos recordatorios y toda la información necesaria para maximizar tu participación en este importante evento comunitario.";
    
    setEventos(prev => prev.map(evento => 
      evento.id === id ? { ...evento, asistire: !evento.asistire } : evento
    ));
    
    console.log(mensajeConfirmacion);
  };

  const getEventIcon = (tipo: string) => {
    switch (tipo) {
      case 'asamblea': return Users;
      case 'jornada': return CheckCircle;
      case 'taller': return Bell;
      default: return Calendar;
    }
  };

  const getEventColor = (tipo: string) => {
    switch (tipo) {
      case 'asamblea': return 'from-blue-50 to-blue-100 border-blue-200';
      case 'jornada': return 'from-green-50 to-green-100 border-green-200';
      case 'taller': return 'from-purple-50 to-purple-100 border-purple-200';
      default: return 'from-gray-50 to-gray-100 border-gray-200';
    }
  };

  const eventosConfirmados = eventos.filter(e => e.asistire).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-indigo-800">
            <Calendar className="w-6 h-6 text-indigo-600" />
            Eventos de Campaña
            <Badge className="bg-indigo-600 text-white ml-auto">
              {eventosConfirmados} confirmados
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-indigo-700 leading-relaxed">
            Participa en nuestros eventos comunitarios y ayuda a construir el futuro que queremos para nuestro territorio. 
            Cada evento es una oportunidad para fortalecer nuestra unión y avanzar hacia nuestros objetivos comunes.
          </p>
        </CardContent>
      </Card>

      {/* Lista de eventos */}
      <div className="space-y-4">
        {eventos.map((evento) => {
          const IconComponent = getEventIcon(evento.tipoEvento);
          return (
            <Card 
              key={evento.id} 
              className={`bg-gradient-to-r ${getEventColor(evento.tipoEvento)} hover:shadow-lg transition-all duration-300 ${
                evento.asistire ? 'ring-2 ring-green-400' : ''
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-gray-700" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {evento.titulo}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {evento.fecha}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {evento.hora}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {evento.asistire && (
                    <Badge className="bg-green-600 text-white">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Confirmado
                    </Badge>
                  )}
                </div>

                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-gray-800">{evento.lugar}</span>
                    {evento.espaciosDisponibles && (
                      <Badge className="bg-blue-100 text-blue-800 ml-auto">
                        {evento.espaciosDisponibles} espacios disponibles
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed">
                    {evento.descripcion}
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button 
                    onClick={() => confirmarAsistencia(evento.id)}
                    className={`flex-1 transition-all duration-200 ${
                      evento.asistire 
                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    } shadow-md hover:shadow-lg`}
                  >
                    {evento.asistire ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Asistencia Confirmada
                      </>
                    ) : (
                      <>
                        <Calendar className="w-4 h-4 mr-2" />
                        Confirmar Asistencia
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    Recordatorio
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {eventosConfirmados > 0 && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-green-800 mb-2">
              ¡Excelente Compromiso!
            </h3>
            <p className="text-green-700">
              Has confirmado tu asistencia a {eventosConfirmados} evento{eventosConfirmados > 1 ? 's' : ''}. 
              Tu participación activa fortalece nuestra comunidad y acelera el cambio que necesitamos.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EventsManager;
