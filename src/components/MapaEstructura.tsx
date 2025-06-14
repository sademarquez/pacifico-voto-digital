
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MapPin, 
  Users, 
  Crown, 
  Star, 
  Building2, 
  TreePine,
  Phone,
  MessageSquare,
  Navigation,
  Layers
} from "lucide-react";

interface PersonaEnMapa {
  id: string;
  nombre: string;
  tipo: 'coordinador' | 'lider' | 'ayudante';
  lat: number;
  lng: number;
  ubicacion: string;
  telefono: string;
  equipo: number;
  activo: boolean;
}

const MapaEstructura = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [marcadores, setMarcadores] = useState<any[]>([]);
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [personaSeleccionada, setPersonaSeleccionada] = useState<PersonaEnMapa | null>(null);

  const personas: PersonaEnMapa[] = [
    {
      id: "COORD-001",
      nombre: "Ana García Morales",
      tipo: 'coordinador',
      lat: 2.4448,
      lng: -76.6147,
      ubicacion: "Popayán Centro",
      telefono: "+57 300 123 4567",
      equipo: 342,
      activo: true
    },
    {
      id: "COORD-002",
      nombre: "Carlos Ramírez",
      tipo: 'coordinador',
      lat: 2.4410,
      lng: -76.6100,
      ubicacion: "Popayán Norte",
      telefono: "+57 301 234 5678",
      equipo: 85,
      activo: true
    },
    {
      id: "LID-001",
      nombre: "María González",
      tipo: 'lider',
      lat: 2.4400,
      lng: -76.6120,
      ubicacion: "Barrio Centro",
      telefono: "+57 302 345 6789",
      equipo: 12,
      activo: true
    },
    {
      id: "LID-002",
      nombre: "Diego Martínez",
      tipo: 'lider',
      lat: 2.4380,
      lng: -76.6080,
      ubicacion: "La Esmeralda",
      telefono: "+57 305 678 9012",
      equipo: 15,
      activo: true
    },
    {
      id: "COORD-003",
      nombre: "Rosa Piñacué",
      tipo: 'coordinador',
      lat: 2.3547,
      lng: -76.6829,
      ubicacion: "Timbío Centro",
      telefono: "+57 307 890 1234",
      equipo: 42,
      activo: true
    },
    {
      id: "LID-003",
      nombre: "Luis Parra",
      tipo: 'lider',
      lat: 2.3500,
      lng: -76.6800,
      ubicacion: "Vereda San José",
      telefono: "+57 308 901 2345",
      equipo: 8,
      activo: true
    },
    {
      id: "AYU-001",
      nombre: "Pedro Muñoz",
      tipo: 'ayudante',
      lat: 2.4420,
      lng: -76.6130,
      ubicacion: "Centro Norte",
      telefono: "+57 303 456 7890",
      equipo: 3,
      activo: true
    },
    {
      id: "AYU-002",
      nombre: "Laura Sánchez",
      tipo: 'ayudante',
      lat: 2.4390,
      lng: -76.6110,
      ubicacion: "Centro Sur",
      telefono: "+57 304 567 8901",
      equipo: 4,
      activo: true
    },
    {
      id: "AYU-003",
      nombre: "Carmen López",
      tipo: 'ayudante',
      lat: 2.4370,
      lng: -76.6070,
      ubicacion: "La Esmeralda",
      telefono: "+57 306 789 0123",
      equipo: 5,
      activo: true
    },
    {
      id: "AYU-004",
      nombre: "Ana Morales",
      tipo: 'ayudante',
      lat: 2.3480,
      lng: -76.6790,
      ubicacion: "San José",
      telefono: "+57 309 012 3456",
      equipo: 2,
      activo: true
    }
  ];

  useEffect(() => {
    if (typeof window !== 'undefined' && mapRef.current && !map) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => {
        const L = (window as any).L;
        
        const nuevoMapa = L.map(mapRef.current, {
          center: [2.4448, -76.6147],
          zoom: 11,
          minZoom: 8,
          maxZoom: 18
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(nuevoMapa);

        setMap(nuevoMapa);
      };
      document.head.appendChild(script);

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
  }, []);

  useEffect(() => {
    if (map && personas.length > 0) {
      marcadores.forEach(marcador => map.removeLayer(marcador));
      
      const L = (window as any).L;
      const nuevosMarcadores: any[] = [];

      const personasFiltradas = personas.filter(persona => 
        filtroTipo === "todos" || persona.tipo === filtroTipo
      );

      personasFiltradas.forEach((persona) => {
        const { color, size } = getTipoEstilo(persona.tipo);
        
        const icon = L.divIcon({
          className: 'custom-marker',
          html: `<div style="background-color: ${color}; border: 3px solid white; border-radius: 50%; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 6px rgba(0,0,0,0.3); position: relative;">
                   ${getTipoIcon(persona.tipo)}
                   <div style="position: absolute; bottom: -8px; right: -8px; background: #10b981; color: white; border-radius: 50%; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold; border: 2px solid white;">
                     ${persona.equipo}
                   </div>
                 </div>`,
          iconSize: [size, size],
          iconAnchor: [size/2, size/2]
        });

        const marcador = L.marker([persona.lat, persona.lng], { icon })
          .addTo(map)
          .bindPopup(`
            <div class="p-3 min-w-64">
              <div class="flex items-center gap-2 mb-2">
                ${getTipoIconHtml(persona.tipo)}
                <h3 class="font-bold text-slate-800">${persona.nombre}</h3>
              </div>
              <p class="text-sm text-slate-600 mb-2">${persona.ubicacion}</p>
              <div class="grid grid-cols-2 gap-2 mb-3">
                <div class="bg-slate-50 p-2 rounded text-center">
                  <div class="font-bold text-slate-800">${persona.equipo}</div>
                  <div class="text-xs text-slate-600">Equipo</div>
                </div>
                <div class="bg-green-50 p-2 rounded text-center">
                  <div class="font-bold text-green-800">${persona.activo ? 'Activo' : 'Inactivo'}</div>
                  <div class="text-xs text-green-600">Estado</div>
                </div>
              </div>
              <div class="flex gap-2">
                <button class="flex-1 bg-slate-600 hover:bg-slate-700 text-white px-3 py-1 rounded text-sm">
                  📞 Llamar
                </button>
                <button class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">
                  💬 Mensaje
                </button>
              </div>
            </div>
          `);

        marcador.on('click', () => {
          setPersonaSeleccionada(persona);
          map.setView([persona.lat, persona.lng], 13, { animate: true });
        });

        nuevosMarcadores.push(marcador);
      });

      setMarcadores(nuevosMarcadores);
    }
  }, [map, personas, filtroTipo]);

  const getTipoEstilo = (tipo: string) => {
    switch (tipo) {
      case 'coordinador': return { color: '#7c3aed', size: 32 };
      case 'lider': return { color: '#2563eb', size: 28 };
      case 'ayudante': return { color: '#059669', size: 24 };
      default: return { color: '#64748b', size: 20 };
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'coordinador': return '👑';
      case 'lider': return '⭐';
      case 'ayudante': return '👥';
      default: return '📍';
    }
  };

  const getTipoIconHtml = (tipo: string) => {
    switch (tipo) {
      case 'coordinador': return '<span class="text-purple-600">👑</span>';
      case 'lider': return '<span class="text-blue-600">⭐</span>';
      case 'ayudante': return '<span class="text-green-600">👥</span>';
      default: return '<span class="text-gray-600">📍</span>';
    }
  };

  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case 'coordinador': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'lider': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'ayudante': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const centrarEnCauca = () => {
    if (map) {
      map.setView([2.4448, -76.6147], 10, { animate: true });
      setPersonaSeleccionada(null);
    }
  };

  const conteoTipos = {
    coordinadores: personas.filter(p => p.tipo === 'coordinador').length,
    lideres: personas.filter(p => p.tipo === 'lider').length,
    ayudantes: personas.filter(p => p.tipo === 'ayudante').length
  };

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="text-center border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{conteoTipos.coordinadores}</div>
            <div className="text-sm text-purple-700">Coordinadores</div>
          </CardContent>
        </Card>
        <Card className="text-center border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{conteoTipos.lideres}</div>
            <div className="text-sm text-blue-700">Líderes</div>
          </CardContent>
        </Card>
        <Card className="text-center border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{conteoTipos.ayudantes}</div>
            <div className="text-sm text-green-700">Ayudantes</div>
          </CardContent>
        </Card>
      </div>

      {/* Controles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <Layers className="w-5 h-5" />
            Controles del Mapa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Filtrar por Tipo:</label>
              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="coordinador">Coordinadores</SelectItem>
                  <SelectItem value="lider">Líderes</SelectItem>
                  <SelectItem value="ayudante">Ayudantes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Navegación:</label>
              <Button 
                onClick={centrarEnCauca} 
                variant="outline" 
                className="w-full border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                <Navigation className="w-4 h-4 mr-2" />
                Centrar Vista
              </Button>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Leyenda:</label>
              <div className="flex gap-1 text-xs">
                <span>👑 Coordinador</span>
                <span>⭐ Líder</span>
                <span>👥 Ayudante</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mapa */}
      <Card>
        <CardContent className="p-0">
          <div 
            ref={mapRef} 
            className="h-96 md:h-[600px] w-full rounded-lg"
            style={{ minHeight: '500px' }}
          />
        </CardContent>
      </Card>

      {/* Información de Persona Seleccionada */}
      {personaSeleccionada && (
        <Card className="border-slate-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              {personaSeleccionada.tipo === 'coordinador' && <Crown className="w-5 h-5 text-purple-600" />}
              {personaSeleccionada.tipo === 'lider' && <Star className="w-5 h-5 text-blue-600" />}
              {personaSeleccionada.tipo === 'ayudante' && <Users className="w-5 h-5 text-green-600" />}
              {personaSeleccionada.nombre}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge className={`${getTipoBadge(personaSeleccionada.tipo)} border`}>
                    {personaSeleccionada.tipo.toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className="text-green-700 border-green-300">
                    {personaSeleccionada.activo ? 'ACTIVO' : 'INACTIVO'}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    <span>{personaSeleccionada.ubicacion}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-500" />
                    <span>{personaSeleccionada.telefono}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-500" />
                    <span>Equipo de {personaSeleccionada.equipo} personas</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-slate-700">Acciones Rápidas</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" className="bg-slate-600 hover:bg-slate-700">
                    <Phone className="w-4 h-4 mr-2" />
                    Llamar
                  </Button>
                  <Button size="sm" variant="outline">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Mensaje
                  </Button>
                  <Button size="sm" variant="outline">
                    <Building2 className="w-4 h-4 mr-2" />
                    Ver Equipo
                  </Button>
                  <Button size="sm" variant="outline">
                    <MapPin className="w-4 h-4 mr-2" />
                    Ver Zona
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MapaEstructura;
