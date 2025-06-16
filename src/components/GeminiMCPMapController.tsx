import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useSimpleAuth } from "../contexts/SimpleAuthContext";
import {
  MapPin,
  Users,
  Target,
  Zap,
  TrendingUp,
  MessageCircle,
  Clock,
  CheckCircle,
  Settings,
  AlertTriangle,
  Plus,
  BarChart3
} from "lucide-react";
import { geminiService } from "../services/geminiService";
import { geminiMCPService } from "../services/geminiMCPService";

interface TerritoryData {
  id: string;
  name: string;
  description: string;
  responsible_user_id: string;
  demographics: any;
  historicalData: any;
  currentTrends: any;
}

const GeminiMCPMapController = () => {
  const { user } = useSimpleAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [insights, setInsights] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Simular carga de datos del territorio
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockTerritoryData: TerritoryData = {
          id: "territory-001",
          name: "Distrito Electoral #7",
          description: "Zona urbana con alta densidad de votantes jóvenes",
          responsible_user_id: user?.id || "demo-user",
          demographics: {
            age_distribution: { "18-25": "35%", "26-35": "40%", "36+": "25%" },
            socioeconomic_status: "Clase media",
            political_affiliation: "Independiente",
          },
          historicalData: {
            last_election_turnout: "68%",
            previous_candidate_performance: "45%",
          },
          currentTrends: {
            social_media_engagement: "Alto",
            volunteer_participation: "Medio",
          },
        };

        // Inicializar Gemini MCP Service
        const initResult = await geminiMCPService.initialize();
        if (!initResult.success) {
          throw new Error(initResult.message);
        }

        // Analizar datos electorales con IA
        const analysisResult = await geminiMCPService.analyzeElectoralData({
          territory: mockTerritoryData.name,
          demographics: mockTerritoryData.demographics,
          historicalData: mockTerritoryData.historicalData,
          currentTrends: mockTerritoryData.currentTrends,
        });

        setInsights(analysisResult.insights);
        setRecommendations(analysisResult.recommendations);
        setResults(analysisResult); // Almacena los resultados completos

      } catch (err: any) {
        console.error("Error loading data:", err);
        setError(err.message || "Error al cargar datos");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [user]);

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-blue-50 via-white to-purple-50 border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            Control de Mapa con Gemini MCP
          </CardTitle>
          <p className="text-sm text-gray-600">Análisis territorial avanzado con IA</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">
            Usuario: {user?.name} ({user?.role})
          </p>
          <Badge className="bg-blue-100 text-blue-800 border-blue-300">
            Gemini MCP Activo
          </Badge>
          
          <div className="flex gap-2">
            <Button 
              onClick={() => console.log('Analizar territorio')}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              <Plus className="w-4 h-4 mr-2" />
              Analizar Territorio
            </Button>
            <Button 
              variant="outline"
              onClick={() => console.log('Ver estadísticas')}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Estadísticas
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resultado del análisis */}
      {results && (
        <Card className="border-2 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Análisis Completado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Insights</h3>
                <ul className="list-disc list-inside space-y-1">
                  {insights.map((insight, index) => (
                    <li key={index} className="text-gray-700">{insight}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Recomendaciones</h3>
                <ul className="list-disc list-inside space-y-1">
                  {recommendations.map((recommendation, index) => (
                    <li key={index} className="text-gray-700">{recommendation}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estado de carga o error */}
      {loading && (
        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            Procesando análisis territorial...
          </CardContent>
        </Card>
      )}

      {error && (
        <Card>
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-4" />
            Error: {error}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GeminiMCPMapController;
