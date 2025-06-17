import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  AlertTriangle,
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

const EnhancedInteractiveMapFunnel = () => {
  const { user } = useSimpleAuth();
  const [territoryData, setTerritoryData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [insights, setInsights] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [projections, setProjections] = useState<any>(null);
  const [riskFactors, setRiskFactors] = useState<string[]>([]);
  const [welcomeMessage, setWelcomeMessage] = useState<string>("");

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      setError(null);

      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockTerritoryData = {
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

        setTerritoryData(mockTerritoryData);

        const initResult = await geminiMCPService.initialize();
        if (!initResult.success) {
          throw new Error(initResult.message);
        }

        const analysisResult = await geminiMCPService.analyzeElectoralData({
          territory: mockTerritoryData.name,
          demographics: mockTerritoryData.demographics,
          historicalData: mockTerritoryData.historicalData,
          currentTrends: mockTerritoryData.currentTrends,
        });

        setInsights(analysisResult.insights);
        setRecommendations(analysisResult.recommendations);
        setProjections(analysisResult.projections);
        setRiskFactors(analysisResult.riskFactors);

        const welcomeMsg = await geminiService.generateWelcomeMessage();
        setWelcomeMessage(welcomeMsg);
      } catch (err: any) {
        console.error("Error loading data:", err);
        setError(err.message || "Error al cargar datos");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [user]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Clock className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          Cargando datos del territorio...
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-4" />
          Error: {error}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con información del territorio */}
      <Card className="bg-gradient-to-br from-blue-50 via-white to-purple-50 border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            {territoryData?.name}
          </CardTitle>
          <p className="text-sm text-gray-600">{territoryData?.description}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">
            Responsable: {user?.name} ({user?.role})
          </p>
          <Badge className="bg-blue-100 text-blue-800 border-blue-300">
            ID: {territoryData?.id}
          </Badge>
        </CardContent>
      </Card>

      {/* Análisis electoral con IA */}
      <Card className="border-2 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-600" />
            Análisis Electoral con IA
          </CardTitle>
          <p className="text-sm text-gray-600">
            Insights y recomendaciones generadas por Gemini AI
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-800">Insights</h3>
            <ul className="list-disc list-inside space-y-1">
              {insights.map((insight, index) => (
                <li key={index} className="text-gray-700">
                  {insight}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-800">
              Recomendaciones
            </h3>
            <ul className="list-disc list-inside space-y-1">
              {recommendations.map((recommendation, index) => (
                <li key={index} className="text-gray-700">
                  {recommendation}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-800">Proyecciones</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Votos Esperados
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {projections?.expectedVotes}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Tasa de Conversión
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {projections?.conversionRate}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Potencial de Crecimiento
                </p>
                <p className="text-xl font-bold text-green-600">
                  {projections?.growthPotential}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">ROI</p>
                <p className="text-xl font-bold text-green-600">
                  {projections?.roi}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-800">
              Factores de Riesgo
            </h3>
            <ul className="list-disc list-inside space-y-1">
              {riskFactors.map((risk, index) => (
                <li key={index} className="text-red-700">
                  {risk}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Mensaje de bienvenida */}
      <Card className="border-2 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-green-600" />
            Mensaje de Bienvenida
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{welcomeMessage}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedInteractiveMapFunnel;
