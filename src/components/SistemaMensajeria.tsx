
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MessageSquare, 
  Send, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Plus,
  Search,
  Filter
} from "lucide-react";

interface Mensaje {
  id: string;
  remitente: string;
  destinatario: string;
  asunto: string;
  contenido: string;
  fecha: string;
  estado: 'enviado' | 'leido' | 'respondido';
  prioridad: 'baja' | 'media' | 'alta' | 'urgente';
  categoria: 'general' | 'coordinacion' | 'emergencia' | 'evento';
}

const SistemaMensajeria = () => {
  const [mensajes] = useState<Mensaje[]>([
    {
      id: "MSG-001",
      remitente: "Ana García",
      destinatario: "Todos los Coordinadores",
      asunto: "Reunión Semanal de Coordinación",
      contenido: "Se convoca a reunión este viernes a las 7:00 PM en la sede principal para revisar avances y planificar actividades de la próxima semana.",
      fecha: "2024-06-14 09:30",
      estado: 'leido',
      prioridad: 'alta',
      categoria: 'coordinacion'
    },
    {
      id: "MSG-002",
      remitente: "Carlos Ramírez",
      destinatario: "Líderes Popayán",
      asunto: "Evento Barrio Centro",
      contenido: "Confirmamos evento para el sábado en el parque central. Necesitamos apoyo con sonido y logística.",
      fecha: "2024-06-14 11:15",
      estado: 'enviado',
      prioridad: 'media',
      categoria: 'evento'
    },
    {
      id: "MSG-003", 
      remitente: "María González",
      destinatario: "Ana García",
      asunto: "Reporte Semanal - Centro",
      contenido: "Adjunto reporte de actividades del barrio Centro. Hemos registrado 15 nuevos simpatizantes esta semana.",
      fecha: "2024-06-13 16:45",
      estado: 'respondido',
      prioridad: 'baja',
      categoria: 'general'
    },
    {
      id: "MSG-004",
      remitente: "Sistema Alertas",
      destinatario: "Todos",
      asunto: "Alerta: Problemas en Timbío",
      contenido: "Se reportan dificultades en la vereda San José. Requiere atención inmediata del coordinador zonal.",
      fecha: "2024-06-14 14:20",
      estado: 'enviado',
      prioridad: 'urgente',
      categoria: 'emergencia'
    }
  ]);

  const [nuevoMensaje, setNuevoMensaje] = useState({
    destinatario: '',
    asunto: '',
    contenido: '',
    prioridad: 'media' as const,
    categoria: 'general' as const
  });

  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [busquedaMensaje, setBusquedaMensaje] = useState('');

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'enviado': return <Send className="w-4 h-4 text-blue-500" />;
      case 'leido': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'respondido': return <MessageSquare className="w-4 h-4 text-purple-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case 'urgente': return 'bg-red-100 text-red-800 border-red-300';
      case 'alta': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'media': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'baja': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case 'emergencia': return 'bg-red-50 border-l-red-500';
      case 'coordinacion': return 'bg-blue-50 border-l-blue-500';
      case 'evento': return 'bg-purple-50 border-l-purple-500';
      case 'general': return 'bg-gray-50 border-l-gray-500';
      default: return 'bg-white border-l-gray-300';
    }
  };

  const mensajesFiltrados = mensajes.filter(mensaje => {
    const coincideBusqueda = mensaje.asunto.toLowerCase().includes(busquedaMensaje.toLowerCase()) ||
                             mensaje.remitente.toLowerCase().includes(busquedaMensaje.toLowerCase()) ||
                             mensaje.contenido.toLowerCase().includes(busquedaMensaje.toLowerCase());
    const coincideCategoria = filtroCategoria === 'todas' || mensaje.categoria === filtroCategoria;
    return coincideBusqueda && coincideCategoria;
  });

  const handleEnviarMensaje = () => {
    console.log('Enviando mensaje:', nuevoMensaje);
    // Aquí iría la lógica para enviar el mensaje
    setNuevoMensaje({
      destinatario: '',
      asunto: '',
      contenido: '',
      prioridad: 'media',
      categoria: 'general'
    });
  };

  return (
    <div className="space-y-6">
      {/* Estadísticas de Mensajería */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {mensajes.filter(m => m.estado === 'enviado').length}
            </div>
            <div className="text-sm text-blue-700">Enviados</div>
          </CardContent>
        </Card>
        <Card className="text-center border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {mensajes.filter(m => m.estado === 'leido').length}
            </div>
            <div className="text-sm text-green-700">Leídos</div>
          </CardContent>
        </Card>
        <Card className="text-center border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {mensajes.filter(m => m.estado === 'respondido').length}
            </div>
            <div className="text-sm text-purple-700">Respondidos</div>
          </CardContent>
        </Card>
        <Card className="text-center border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {mensajes.filter(m => m.prioridad === 'urgente').length}
            </div>
            <div className="text-sm text-red-700">Urgentes</div>
          </CardContent>
        </Card>
      </div>

      {/* Nuevo Mensaje */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <Plus className="w-5 h-5" />
            Nuevo Mensaje
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Destinatario</label>
              <Select value={nuevoMensaje.destinatario} onValueChange={(value) => 
                setNuevoMensaje(prev => ({...prev, destinatario: value}))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar destinatario" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="coordinadores">Coordinadores</SelectItem>
                  <SelectItem value="lideres">Líderes</SelectItem>
                  <SelectItem value="ayudantes">Ayudantes</SelectItem>
                  <SelectItem value="popayan">Popayán</SelectItem>
                  <SelectItem value="timbio">Timbío</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Prioridad</label>
              <Select value={nuevoMensaje.prioridad} onValueChange={(value: any) => 
                setNuevoMensaje(prev => ({...prev, prioridad: value}))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baja">Baja</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="urgente">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Asunto</label>
            <Input
              value={nuevoMensaje.asunto}
              onChange={(e) => setNuevoMensaje(prev => ({...prev, asunto: e.target.value}))}
              placeholder="Escribe el asunto del mensaje"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Mensaje</label>
            <Textarea
              value={nuevoMensaje.contenido}
              onChange={(e) => setNuevoMensaje(prev => ({...prev, contenido: e.target.value}))}
              placeholder="Escribe tu mensaje aquí..."
              rows={4}
            />
          </div>

          <div className="flex gap-4">
            <Select value={nuevoMensaje.categoria} onValueChange={(value: any) => 
              setNuevoMensaje(prev => ({...prev, categoria: value}))
            }>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="coordinacion">Coordinación</SelectItem>
                <SelectItem value="evento">Evento</SelectItem>
                <SelectItem value="emergencia">Emergencia</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleEnviarMensaje} className="bg-slate-600 hover:bg-slate-700">
              <Send className="w-4 h-4 mr-2" />
              Enviar Mensaje
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filtros y Búsqueda */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Buscar mensajes..."
                  value={busquedaMensaje}
                  onChange={(e) => setBusquedaMensaje(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filtroCategoria === 'todas' ? 'default' : 'outline'}
                onClick={() => setFiltroCategoria('todas')}
                size="sm"
              >
                Todas
              </Button>
              <Button
                variant={filtroCategoria === 'emergencia' ? 'default' : 'outline'}
                onClick={() => setFiltroCategoria('emergencia')}
                size="sm"
                className="bg-red-600 hover:bg-red-700"
              >
                Emergencias
              </Button>
              <Button
                variant={filtroCategoria === 'coordinacion' ? 'default' : 'outline'}
                onClick={() => setFiltroCategoria('coordinacion')} 
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                Coordinación
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Mensajes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800">
          Mensajes ({mensajesFiltrados.length})
        </h3>
        
        {mensajesFiltrados.map((mensaje) => (
          <Card key={mensaje.id} className={`hover:shadow-md transition-shadow border-l-4 ${getCategoriaColor(mensaje.categoria)}`}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-slate-800">{mensaje.asunto}</h4>
                    <Badge className={`${getPrioridadColor(mensaje.prioridad)} border text-xs`}>
                      {mensaje.prioridad.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600">
                    De: <span className="font-medium">{mensaje.remitente}</span> → 
                    Para: <span className="font-medium">{mensaje.destinatario}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getEstadoIcon(mensaje.estado)}
                  <span className="text-xs text-slate-500">{mensaje.fecha}</span>
                </div>
              </div>
              
              <p className="text-sm text-slate-700 mb-3">{mensaje.contenido}</p>
              
              <div className="flex justify-between items-center">
                <Badge variant="outline" className="text-xs">
                  {mensaje.categoria}
                </Badge>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    Responder
                  </Button>
                  <Button size="sm" variant="outline">
                    Reenviar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SistemaMensajeria;
