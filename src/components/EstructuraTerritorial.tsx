
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  MapPin, 
  Crown, 
  Star, 
  Building2, 
  TreePine,
  Phone,
  MessageSquare,
  ChevronDown,
  ChevronRight
} from "lucide-react";

interface EstructuraTerritorialProps {
  busqueda: string;
  filtro: string;
}

interface Ayudante {
  id: string;
  nombre: string;
  tipo: 'coordinador' | 'lider' | 'ayudante';
  ubicacion: string;
  territorio: string;
  telefono: string;
  activo: boolean;
  equipo: number;
  cobertura: number;
}

const EstructuraTerritorial: React.FC<EstructuraTerritorialProps> = ({ busqueda, filtro }) => {
  const [expandidos, setExpandidos] = useState<string[]>(['cauca']);

  const estructura = {
    departamento: {
      nombre: "Cauca",
      coordinador: {
        id: "COORD-001",
        nombre: "Ana García Morales",
        tipo: 'coordinador' as const,
        ubicacion: "Popayán",
        territorio: "Departamento del Cauca",
        telefono: "+57 300 123 4567",
        activo: true,
        equipo: 342,
        cobertura: 89
      },
      municipios: [
        {
          nombre: "Popayán",
          coordinador: {
            id: "COORD-002",
            nombre: "Carlos Ramírez",
            tipo: 'coordinador' as const,
            ubicacion: "Popayán Centro",
            territorio: "Municipio Popayán",
            telefono: "+57 301 234 5678",
            activo: true,
            equipo: 85,
            cobertura: 92
          },
          barrios: [
            {
              nombre: "Centro",
              lider: {
                id: "LID-001",
                nombre: "María González",
                tipo: 'lider' as const,
                ubicacion: "Barrio Centro",
                territorio: "Centro - Popayán",
                telefono: "+57 302 345 6789",
                activo: true,
                equipo: 12,
                cobertura: 85
              },
              ayudantes: [
                {
                  id: "AYU-001",
                  nombre: "Pedro Muñoz",
                  tipo: 'ayudante' as const,
                  ubicacion: "Calle 5 #12-34",
                  territorio: "Sector Norte Centro",
                  telefono: "+57 303 456 7890",
                  activo: true,
                  equipo: 3,
                  cobertura: 78
                },
                {
                  id: "AYU-002",
                  nombre: "Laura Sánchez",
                  tipo: 'ayudante' as const,
                  ubicacion: "Carrera 8 #15-20",
                  territorio: "Sector Sur Centro",
                  telefono: "+57 304 567 8901",
                  activo: true,
                  equipo: 4,
                  cobertura: 82
                }
              ]
            },
            {
              nombre: "La Esmeralda",
              lider: {
                id: "LID-002",
                nombre: "Diego Martínez",
                tipo: 'lider' as const,
                ubicacion: "Barrio La Esmeralda",
                territorio: "La Esmeralda - Popayán",
                telefono: "+57 305 678 9012",
                activo: true,
                equipo: 15,
                cobertura: 90
              },
              ayudantes: [
                {
                  id: "AYU-003",
                  nombre: "Carmen López",
                  tipo: 'ayudante' as const,
                  ubicacion: "Manzana 5 Casa 12",
                  territorio: "Sector A La Esmeralda",
                  telefono: "+57 306 789 0123",
                  activo: true,
                  equipo: 5,
                  cobertura: 88
                }
              ]
            }
          ]
        },
        {
          nombre: "Timbío",
          coordinador: {
            id: "COORD-003",
            nombre: "Rosa Piñacué",
            tipo: 'coordinador' as const,
            ubicacion: "Timbío Centro",
            territorio: "Municipio Timbío",
            telefono: "+57 307 890 1234",
            activo: true,
            equipo: 42,
            cobertura: 87
          },
          veredas: [
            {
              nombre: "Vereda San José",
              lider: {
                id: "LID-003",
                nombre: "Luis Parra",
                tipo: 'lider' as const,
                ubicacion: "Vereda San José",
                territorio: "San José - Timbío",
                telefono: "+57 308 901 2345",
                activo: true,
                equipo: 8,
                cobertura: 75
              },
              ayudantes: [
                {
                  id: "AYU-004",
                  nombre: "Ana Morales",
                  tipo: 'ayudante' as const,
                  ubicacion: "Finca El Recuerdo",
                  territorio: "Zona Alta San José",
                  telefono: "+57 309 012 3456",
                  activo: true,
                  equipo: 2,
                  cobertura: 70
                }
              ]
            }
          ]
        }
      ]
    }
  };

  const toggleExpandido = (id: string) => {
    setExpandidos(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'coordinador': return <Crown className="w-4 h-4 text-purple-600" />;
      case 'lider': return <Star className="w-4 h-4 text-blue-600" />;
      case 'ayudante': return <Users className="w-4 h-4 text-green-600" />;
      default: return <Users className="w-4 h-4 text-gray-600" />;
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

  const PersonaCard = ({ persona }: { persona: Ayudante }) => (
    <Card className="hover:shadow-md transition-shadow border-l-4 border-l-slate-300">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            {getTipoIcon(persona.tipo)}
            <div>
              <h4 className="font-semibold text-slate-800">{persona.nombre}</h4>
              <p className="text-sm text-slate-600">{persona.ubicacion}</p>
            </div>
          </div>
          <Badge className={`${getTipoBadge(persona.tipo)} border text-xs`}>
            {persona.tipo.toUpperCase()}
          </Badge>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center text-slate-600">
            <MapPin className="w-3 h-3 mr-2" />
            {persona.territorio}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-2 rounded">
              <div className="font-semibold text-slate-800">{persona.equipo}</div>
              <div className="text-slate-600 text-xs">Equipo</div>
            </div>
            <div className="bg-slate-50 p-2 rounded">
              <div className="font-semibold text-slate-800">{persona.cobertura}%</div>
              <div className="text-slate-600 text-xs">Cobertura</div>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span>Cobertura territorial</span>
              <span>{persona.cobertura}%</span>
            </div>
            <Progress value={persona.cobertura} className="h-2" />
          </div>

          <div className="flex gap-2 mt-3">
            <Button size="sm" variant="outline" className="flex-1 text-xs">
              <Phone className="w-3 h-3 mr-1" />
              Llamar
            </Button>
            <Button size="sm" variant="outline" className="flex-1 text-xs">
              <MessageSquare className="w-3 h-3 mr-1" />
              Mensaje
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Departamento */}
      <Card className="border-2 border-slate-200">
        <CardHeader 
          className="cursor-pointer"
          onClick={() => toggleExpandido('cauca')}
        >
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Building2 className="w-6 h-6 text-slate-600" />
              Departamento del Cauca
            </CardTitle>
            {expandidos.includes('cauca') ? 
              <ChevronDown className="w-5 h-5" /> : 
              <ChevronRight className="w-5 h-5" />
            }
          </div>
        </CardHeader>
        
        {expandidos.includes('cauca') && (
          <CardContent className="space-y-6">
            <PersonaCard persona={estructura.departamento.coordinador} />
            
            {/* Municipios */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-700 border-b pb-2">
                Municipios ({estructura.departamento.municipios.length})
              </h3>
              
              {estructura.departamento.municipios.map((municipio, idx) => (
                <Card key={idx} className="border border-slate-200">
                  <CardHeader 
                    className="cursor-pointer bg-slate-50"
                    onClick={() => toggleExpandido(`municipio-${idx}`)}
                  >
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-slate-700">
                        <MapPin className="w-5 h-5 text-slate-500" />
                        {municipio.nombre}
                      </CardTitle>
                      {expandidos.includes(`municipio-${idx}`) ? 
                        <ChevronDown className="w-4 h-4" /> : 
                        <ChevronRight className="w-4 h-4" />
                      }
                    </div>
                  </CardHeader>
                  
                  {expandidos.includes(`municipio-${idx}`) && (
                    <CardContent className="space-y-4">
                      <PersonaCard persona={municipio.coordinador} />
                      
                      {/* Barrios */}
                      {municipio.barrios && (
                        <div className="space-y-3">
                          <h4 className="font-medium text-slate-600">Barrios</h4>
                          {municipio.barrios.map((barrio, barrioIdx) => (
                            <div key={barrioIdx} className="ml-4 space-y-2">
                              <h5 className="font-medium text-slate-600 flex items-center gap-2">
                                <Building2 className="w-4 h-4" />
                                {barrio.nombre}
                              </h5>
                              <div className="ml-6 space-y-2">
                                <PersonaCard persona={barrio.lider} />
                                {barrio.ayudantes.map((ayudante, ayuIdx) => (
                                  <div key={ayuIdx} className="ml-4">
                                    <PersonaCard persona={ayudante} />
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Veredas */}
                      {municipio.veredas && (
                        <div className="space-y-3">
                          <h4 className="font-medium text-slate-600">Veredas</h4>
                          {municipio.veredas.map((vereda, veredaIdx) => (
                            <div key={veredaIdx} className="ml-4 space-y-2">
                              <h5 className="font-medium text-slate-600 flex items-center gap-2">
                                <TreePine className="w-4 h-4" />
                                {vereda.nombre}
                              </h5>
                              <div className="ml-6 space-y-2">
                                <PersonaCard persona={vereda.lider} />
                                {vereda.ayudantes.map((ayudante, ayuIdx) => (
                                  <div key={ayuIdx} className="ml-4">
                                    <PersonaCard persona={ayudante} />
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default EstructuraTerritorial;
