import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Target, Zap, TrendingUp, MessageCircle, Clock, CheckCircle } from "lucide-react";
import { geminiService } from "../services/geminiService";

interface TerritoryData {
  id: string;
  name: string;
  description: string;
  population: number;
  voter_count: number;
  location: string;
  responsible_user_id: string;
  created_at: string;
}

const InteractiveMapFunnel = () => {
  const [territories, setTerritories] = useState<TerritoryData[]>([]);
  const [selectedTerritory, setSelectedTerritory] = useState<TerritoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTerritories = async () => {
      setLoading(true);
      setError(null);
      try {
        // Simulación de datos
        await new Promise(resolve => setTimeout(resolve, 700));
        const mockTerritories: TerritoryData[] = [
          {
            id: '1',
            name: 'Zona Centro',
            description: 'Área céntrica con alta densidad de votantes jóvenes',
            population: 50000,
            voter_count: 35000,
            location: 'Centro de la ciudad',
            responsible_user_id: 'user123',
            created_at: new Date().toISOString()
          },
          {
            id: '2',
            name: 'Barrio Norte',
            description: 'Zona residencial con votantes de mediana edad',
            population: 40000,
            voter_count: 30000,
            location: 'Norte de la ciudad',
            responsible_user_id: 'user456',
            created_at: new Date().toISOString()
          },
          {
            id: '3',
            name: 'Sector Industrial',
            description: 'Área con alta concentración de trabajadores',
            population: 30000,
            voter_count: 20000,
            location: 'Oeste de la ciudad',
            responsible_user_id: 'user789',
            created_at: new Date().toISOString()
          }
        ];
        setTerritories(mockTerritories);
      } catch (err: any) {
        setError(err.message || 'Error al cargar territorios');
      } finally {
        setLoading(false);
      }
    };

    fetchTerritories();
  }, []);

  useEffect(() => {
    if (mapRef.current && territories.length > 0) {
      // Simulación de inicialización del mapa
      console.log('Mapa inicializado con territorios:', territories.map(t => t.name));
    }
  }, [territories]);

  const handleTerritoryClick = (territory: TerritoryData) => {
    setSelectedTerritory(territory);
    console.log('Territorio seleccionado:', territory.name);
  };

  const generateWelcomeMessage = async () => {
    try {
      const welcomeMsg = await geminiService.generateWelcomeMessage();
      // Handle welcome message
    } catch (error) {
      console.error('Error generating welcome message:', error);
    }
  };

  return (
    <Card className="campaign-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          Funnel Interactivo - Elige tu Zona
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading && <div className="text-center">Cargando territorios...</div>}
        {error && <div className="text-red-500 text-center">{error}</div>}

        <div ref={mapRef} className="h-64 bg-gray-100 rounded-md border border-gray-200 flex items-center justify-center">
          {/* Simulación de mapa */}
          {territories.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
              {territories.map(territory => (
                <Button
                  key={territory.id}
                  variant="outline"
                  className="hover:bg-blue-50 hover:border-blue-300"
                  onClick={() => handleTerritoryClick(territory)}
                >
                  {territory.name}
                </Button>
              ))}
            </div>
          ) : (
            <div>Mapa de territorios</div>
          )}
        </div>

        {selectedTerritory && (
          <div className="p-4 border rounded-md bg-blue-50 border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800">{selectedTerritory.name}</h3>
            <p className="text-sm text-blue-600">{selectedTerritory.description}</p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div>
                <Users className="w-4 h-4 inline mr-1 text-blue-400" />
                Población: {selectedTerritory.population}
              </div>
              <div>
                <Target className="w-4 h-4 inline mr-1 text-blue-400" />
                Votantes: {selectedTerritory.voter_count}
              </div>
            </div>
            <Button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white">
              <Zap className="w-4 h-4 mr-2" />
              Unirme a {selectedTerritory.name}
            </Button>
          </div>
        )}

        <div className="flex justify-between items-center">
          <Badge variant="secondary">
            <Clock className="w-3 h-3 mr-1" />
            Actualizado hace 5 minutos
          </Badge>
          <Button variant="ghost">
            <MessageCircle className="w-4 h-4 mr-2" />
            Soporte
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InteractiveMapFunnel;
