
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Layers, Navigation, AlertTriangle, Users } from "lucide-react";

interface Alerta {
  id: string;
  municipio: string;
  tipo: string;
  severidad: 'baja' | 'media' | 'alta' | 'crítica';
  descripcion: string;
  lat: number;
  lng: number;
  fecha: string;
  lider?: string;
}

interface MapaInteractivoProps {
  alertas: Alerta[];
  onAlertaClick?: (alerta: Alerta) => void;
}

const municipiosCauca = [
  { nombre: "Popayán", lat: 2.4448, lng: -76.6147 },
  { nombre: "Timbío", lat: 2.3547, lng: -76.6829 },
  { nombre: "Cajibío", lat: 2.5506, lng: -76.8733 },
  { nombre: "Silvia", lat: 2.6156, lng: -76.3831 },
  { nombre: "Piendamó", lat: 2.6394, lng: -76.9906 },
  { nombre: "Morales", lat: 2.7761, lng: -76.6208 },
  { nombre: "Santander de Quilichao", lat: 3.0097, lng: -76.4847 },
  { nombre: "Caldono", lat: 2.8167, lng: -76.5167 },
  { nombre: "Toribío", lat: 3.0167, lng: -76.0833 },
  { nombre: "Corinto", lat: 3.1731, lng: -76.2667 },
  { nombre: "Miranda", lat: 3.2539, lng: -76.2292 },
  { nombre: "Padilla", lat: 3.2014, lng: -76.3653 },
  { nombre: "Puracé", lat: 2.3167, lng: -76.4000 },
  { nombre: "Sotará", lat: 2.1167, lng: -76.6333 },
  { nombre: "La Vega", lat: 1.9833, lng: -76.9667 },
  { nombre: "Florencia", lat: 1.8833, lng: -76.6167 },
  { nombre: "Mercaderes", lat: 2.2000, lng: -77.1833 },
  { nombre: "Patía", lat: 2.0667, lng: -77.0333 },
  { nombre: "Bolívar", lat: 1.8667, lng: -77.1167 }
];

const tiposCapas = [
  { id: 'politico', nombre: 'Mapa Político', url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' },
  { id: 'hidrico', nombre: 'Mapa Hídrico', url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}' },
  { id: 'relieve', nombre: 'Mapa de Relieve', url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png' },
  { id: 'satelite', nombre: 'Vista Satelital', url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}' }
];

const MapaInteractivo: React.FC<MapaInteractivoProps> = ({ alertas, onAlertaClick }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [marcadores, setMarcadores] = useState<any[]>([]);
  const [municipioSeleccionado, setMunicipioSeleccionado] = useState<string>("");
  const [capaActiva, setCapaActiva] = useState<string>("politico");
  const [alertaSeleccionada, setAlertaSeleccionada] = useState<Alerta | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && mapRef.current && !map) {
      // Cargar Leaflet dinámicamente
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => {
        const L = (window as any).L;
        
        // Crear mapa centrado en el Cauca
        const nuevoMapa = L.map(mapRef.current, {
          center: [2.4448, -76.6147], // Centro del Cauca (Popayán)
          zoom: 9,
          minZoom: 8,
          maxZoom: 18
        });

        // Establecer límites del mapa al departamento del Cauca
        const boundsCauca = L.latLngBounds(
          [1.0, -78.0], // suroeste
          [3.5, -75.0]  // noreste
        );
        nuevoMapa.setMaxBounds(boundsCauca);

        // Agregar capa base inicial
        const capaBase = L.tileLayer(tiposCapas[0].url, {
          attribution: '© OpenStreetMap contributors'
        }).addTo(nuevoMapa);

        setMap(nuevoMapa);
      };
      document.head.appendChild(script);

      // Cargar CSS de Leaflet
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
  }, []);

  useEffect(() => {
    if (map && alertas.length > 0) {
      // Limpiar marcadores anteriores
      marcadores.forEach(marcador => map.removeLayer(marcador));
      
      const L = (window as any).L;
      const nuevosMarcadores: any[] = [];

      alertas.forEach((alerta) => {
        const color = getSeverityColor(alerta.severidad);
        const icon = L.divIcon({
          className: 'custom-marker',
          html: `<div style="background-color: ${color}; border: 2px solid white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                   <div style="color: white; font-size: 10px; font-weight: bold;">!</div>
                 </div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });

        const marcador = L.marker([alerta.lat, alerta.lng], { icon })
          .addTo(map)
          .bindPopup(`
            <div class="p-3 min-w-48">
              <h3 class="font-bold text-purple-800">${alerta.municipio}</h3>
              <p class="text-sm text-gray-600 mb-2">${alerta.tipo}</p>
              <p class="text-xs mb-2">${alerta.descripcion}</p>
              <div class="flex justify-between items-center">
                <span class="text-xs px-2 py-1 rounded-full bg-${color}-100 text-${color}-800">
                  ${alerta.severidad.toUpperCase()}
                </span>
                ${alerta.lider ? `<span class="text-xs text-purple-600">👤 ${alerta.lider}</span>` : ''}
              </div>
            </div>
          `);

        marcador.on('click', () => {
          setAlertaSeleccionada(alerta);
          if (onAlertaClick) onAlertaClick(alerta);
          // Zoom a la alerta seleccionada
          map.setView([alerta.lat, alerta.lng], 12, { animate: true });
        });

        nuevosMarcadores.push(marcador);
      });

      setMarcadores(nuevosMarcadores);
    }
  }, [map, alertas]);

  const getSeverityColor = (severidad: string) => {
    switch (severidad) {
      case 'baja': return '#10b981';
      case 'media': return '#f59e0b';
      case 'alta': return '#ef4444';
      case 'crítica': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const handleMunicipioChange = (municipio: string) => {
    setMunicipioSeleccionado(municipio);
    const coordenadas = municipiosCauca.find(m => m.nombre === municipio);
    if (coordenadas && map) {
      map.setView([coordenadas.lat, coordenadas.lng], 11, { animate: true });
    }
  };

  const handleCapaChange = (nuevaCapa: string) => {
    if (map) {
      const L = (window as any).L;
      // Remover capas existentes
      map.eachLayer((layer: any) => {
        if (layer._url) {
          map.removeLayer(layer);
        }
      });

      // Agregar nueva capa
      const capaSeleccionada = tiposCapas.find(c => c.id === nuevaCapa);
      if (capaSeleccionada) {
        L.tileLayer(capaSeleccionada.url, {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);
      }
      setCapaActiva(nuevaCapa);
    }
  };

  const centrarEnCauca = () => {
    if (map) {
      map.setView([2.4448, -76.6147], 9, { animate: true });
      setMunicipioSeleccionado("");
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Controles del Mapa */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <MapPin className="w-5 h-5" />
            Controles de Navegación
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Selector de Municipio */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-purple-700">Ir a Municipio:</label>
              <Select value={municipioSeleccionado} onValueChange={handleMunicipioChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar municipio" />
                </SelectTrigger>
                <SelectContent>
                  {municipiosCauca.map((municipio) => (
                    <SelectItem key={municipio.nombre} value={municipio.nombre}>
                      {municipio.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Selector de Capa */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-purple-700">Tipo de Mapa:</label>
              <Select value={capaActiva} onValueChange={handleCapaChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tiposCapas.map((capa) => (
                    <SelectItem key={capa.id} value={capa.id}>
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4" />
                        {capa.nombre}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Botón Centrar */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-purple-700">Navegación:</label>
              <Button 
                onClick={centrarEnCauca} 
                variant="outline" 
                className="w-full border-purple-200 text-purple-700 hover:bg-purple-50"
              >
                <Navigation className="w-4 h-4 mr-2" />
                Centrar en Cauca
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mapa */}
      <Card>
        <CardContent className="p-0">
          <div 
            ref={mapRef} 
            className="h-96 md:h-[500px] w-full rounded-lg"
            style={{ minHeight: '400px' }}
          />
        </CardContent>
      </Card>

      {/* Información de Alerta Seleccionada */}
      {alertaSeleccionada && (
        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <AlertTriangle className="w-5 h-5" />
              Alerta Seleccionada: {alertaSeleccionada.municipio}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><strong>Tipo:</strong> {alertaSeleccionada.tipo}</p>
                <p><strong>Fecha:</strong> {alertaSeleccionada.fecha}</p>
                <p><strong>Descripción:</strong> {alertaSeleccionada.descripcion}</p>
              </div>
              <div className="flex flex-col gap-2">
                <Badge 
                  variant="outline" 
                  className={`w-fit ${
                    alertaSeleccionada.severidad === 'crítica' ? 'border-red-500 text-red-700' :
                    alertaSeleccionada.severidad === 'alta' ? 'border-orange-500 text-orange-700' :
                    alertaSeleccionada.severidad === 'media' ? 'border-yellow-500 text-yellow-700' :
                    'border-green-500 text-green-700'
                  }`}
                >
                  Severidad: {alertaSeleccionada.severidad.toUpperCase()}
                </Badge>
                {alertaSeleccionada.lider && (
                  <div className="flex items-center gap-2 text-purple-700">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">Líder asignado: {alertaSeleccionada.lider}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MapaInteractivo;
