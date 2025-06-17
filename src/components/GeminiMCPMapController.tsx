
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSimpleAuth } from "../contexts/SimpleAuthContext";
import {
  MapPin,
  Zap,
  CheckCircle,
  AlertTriangle,
  Plus,
  BarChart3,
  Settings,
  Clock
} from "lucide-react";
import { geminiService } from "../services/geminiService";
import { geminiMCPService } from "../services/geminiMCPService";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [insights, setInsights] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [results, setResults] = useState<any>(null);
  const [geminiStatus, setGeminiStatus] = useState<{
    connected: boolean;
    model: string;
    latency?: number;
  }>({ connected: false, model: 'gemini-2.0-flash' });

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Probar conexión con Gemini Real
        const connectionTest = await geminiService.testConnection();
        const modelInfo = await geminiService.getModelInfo();
        
        setGeminiStatus({
          connected: connectionTest.success,
          model: modelInfo.model,
          latency: connectionTest.latency
        });

        if (connectionTest.success) {
          toast({
            title: "Gemini 2.0 Flash Conectado",
            description: `Conexión exitosa. Latencia: ${connectionTest.latency}ms`,
          });
        }

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

        // Inicializar Gemini MCP Service con conexión real
        const initResult = await geminiMCPService.initialize();
        if (!initResult.success) {
          throw new Error(initResult.message);
        }

        // Analizar datos electorales con IA REAL
        const analysisResult = await geminiMCPService.analyzeElectoralData({
          territory: mockTerritoryData.name,
          demographics: mockTerritoryData.demographics,
          historicalData: mockTerritoryData.historicalData,
          currentTrends: mockTerritoryData.currentTrends,
        });

        setInsights(analysisResult.insights);
        setRecommendations(analysisResult.recommendations);
        setResults(analysisResult);

        toast({
          title: "Análisis completado",
          description: "Datos procesados con Gemini 2.0 Flash Premium",
        });

      } catch (err: any) {
        console.error("Error loading data:", err);
        setError(err.message || "Error al cargar datos");
        
        toast({
          title: "Error en análisis",
          description: err.message || "Error al conectar con Gemini AI",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [user, toast]);

  const handleAnalyzeTerritory = async () => {
    setLoading(true);
    try {
      const welcomeMessage = await geminiService.generateWelcomeMessage({
        userName: user?.name,
        role: user?.role,
        territory: "Distrito Electoral #7"
      });
      
      toast({
        title: "Análisis iniciado",
        description: "Procesando con Gemini 2.0 Flash...",
      });
      
      // Simular análisis adicional
      setTimeout(() => {
        setLoading(false);
        toast({
          title: "Análisis completado",
          description: "Nuevos insights generados con IA",
        });
      }, 2000);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error",
        description: "No se pudo completar el análisis",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-blue-50 via-white to-purple-50 border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            Control de Mapa con Gemini 2.0 Flash Premium
          </CardTitle>
          <p className="text-sm text-gray-600">Análisis territorial avanzado con IA real de Google</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">
            Usuario: {user?.name} ({user?.role})
          </p>
          
          <div className="flex items-center gap-4">
            <Badge className={geminiStatus.connected ? "bg-green-100 text-green-800 border-green-300" : "bg-red-100 text-red-800 border-red-300"}>
              {geminiStatus.connected ? (
                <>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Gemini 2.0 Flash Activo
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Gemini Desconectado
                </>
              )}
            </Badge>
            
            {geminiStatus.latency && (
              <Badge variant="outline">
                Latencia: {geminiStatus.latency}ms
              </Badge>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={handleAnalyzeTerritory}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Analizando...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Analizar Territorio IA
                </>
              )}
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => console.log('Ver estadísticas')}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Estadísticas
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => window.open('/configuracion-avanzada', '_blank')}
            >
              <Settings className="w-4 h-4 mr-2" />
              Configurar IA
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resultado del análisis con IA Real */}
      {results && (
        <Card className="border-2 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Análisis IA Completado - Gemini 2.0 Flash Premium
            </CardTitle>
            <p className="text-sm text-green-600">
              Procesado con inteligencia artificial de última generación
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">🎯 Insights Estratégicos</h3>
                <ul className="list-disc list-inside space-y-1">
                  {insights.map((insight, index) => (
                    <li key={index} className="text-gray-700">{insight}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">🚀 Recomendaciones IA</h3>
                <ul className="list-disc list-inside space-y-1">
                  {recommendations.map((recommendation, index) => (
                    <li key={index} className="text-gray-700">{recommendation}</li>
                  ))}
                </ul>
              </div>

              {results.projections && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">📊 Proyecciones IA</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Votos Esperados:</span>
                      <div className="font-bold text-blue-700">{results.projections.expectedVotes}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Tasa Conversión:</span>
                      <div className="font-bold text-green-700">{results.projections.conversionRate}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Potencial Crecimiento:</span>
                      <div className="font-bold text-purple-700">{results.projections.growthPotential}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">ROI Proyectado:</span>
                      <div className="font-bold text-orange-700">{results.projections.roi}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estado de carga */}
      {loading && (
        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-lg font-semibold">Procesando con Gemini 2.0 Flash...</p>
            <p className="text-gray-600">Análisis territorial avanzado en progreso</p>
          </CardContent>
        </Card>
      )}

      {/* Error */}
      {error && (
        <Card>
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-4" />
            <p className="text-lg font-semibold text-red-800">Error en el Sistema</p>
            <p className="text-gray-600">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline" 
              className="mt-4"
            >
              Reintentar
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GeminiMCPMapController;
