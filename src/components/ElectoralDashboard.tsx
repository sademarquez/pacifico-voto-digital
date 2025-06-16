import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSimpleAuth } from "../contexts/SimpleAuthContext";
import { 
  Users, 
  MapPin, 
  AlertTriangle, 
  Calendar, 
  BarChart3, 
  MessageSquare, 
  Zap, 
  Target, 
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Globe,
  Award
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { geminiService } from "@/services/geminiService";
import { geminiMCPService } from "@/services/geminiMCPService";
import { useNavigate } from "react-router-dom";

const ElectoralDashboard = () => {
  const { user } = useSimpleAuth();
  const navigate = useNavigate();
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);
  const [territoryStats, setTerritoryStats] = useState({
    total: 0,
    active: 0,
    coverage: 0
  });

  // Estadísticas electorales
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['electoral-stats', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      try {
        // En producción, esto vendría de la API real
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return {
          voters: {
            total: 12450,
            registered: 8734,
            potential: 3716,
            growth: 23.4
          },
          territories: {
            total: 48,
            active: 42,
            coverage: 87.5
          },
          engagement: {
            messages: 15280,
            responses: 12104,
            rate: 79.2
          },
          events: {
            total: 156,
            upcoming: 23,
            attendance: 84.7
          },
          performance: {
            conversion: 73.8,
            retention: 91.2,
            satisfaction: 94.5
          }
        };
      } catch (error) {
        console.error('Error fetching electoral stats:', error);
        return null;
      }
    },
    enabled: !!user
  });

  // Generar insight con IA
  const generateAiInsight = async () => {
    if (!user) return;
    
    setIsLoadingInsight(true);
    
    try {
      const prompt = `Genera un insight electoral estratégico basado en estos datos:
      
- Votantes registrados: ${stats?.voters.registered || 'N/A'}
- Votantes potenciales: ${stats?.voters.potential || 'N/A'}
- Territorios activos: ${stats?.territories.active || 'N/A'} de ${stats?.territories.total || 'N/A'}
- Tasa de engagement: ${stats?.engagement.rate || 'N/A'}%
- Tasa de conversión: ${stats?.performance.conversion || 'N/A'}%

Proporciona recomendaciones específicas para optimizar la campaña electoral.`;

      const insight = await geminiService.makeRequest(prompt);
      setAiInsight(insight);
    } catch (error) {
      console.error('Error generating AI insight:', error);
      setAiInsight('Error generando insight. Intenta nuevamente.');
    } finally {
      setIsLoadingInsight(false);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    if (stats) {
      setTerritoryStats(stats.territories);
      
      // Generar insight automáticamente al cargar
      if (!aiInsight && !isLoadingInsight) {
        generateAiInsight();
      }
    }
  }, [stats]);

  // Verificar estado del servicio IA
  useEffect(() => {
    const checkAiService = async () => {
      try {
        const status = await geminiMCPService.getServiceStatus();
        console.log('AI Service Status:', status);
      } catch (error) {
        console.error('Error checking AI service:', error);
      }
    };
    
    checkAiService();
  }, []);

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p>Inicia sesión para ver el dashboard electoral</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="campaign-card border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold gradient-text-primary">Dashboard Electoral</h2>
                <p className="text-gray-600">Análisis y métricas de campaña</p>
              </div>
              <div className="w-12 h-12 gradient-bg-primary rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{stats?.voters.registered.toLocaleString() || '0'}</p>
                <p className="text-sm text-gray-600">Votantes Registrados</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">{stats?.territories.active || '0'}</p>
                <p className="text-sm text-gray-600">Territorios Activos</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">{stats?.performance.conversion || '0'}%</p>
                <p className="text-sm text-gray-600">Tasa Conversión</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <Badge className="bg-green-100 text-green-800 border-green-300">
                <TrendingUp className="w-3 h-3 mr-1" />
                +{stats?.voters.growth || '0'}% crecimiento
              </Badge>
              <Button 
                size="sm" 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => navigate('/informes')}
              >
                Ver Informes Completos
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tarjeta de IA Electoral */}
        <Card className="campaign-card border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-purple-700">IA Electoral</h2>
                <p className="text-gray-600">Insights y recomendaciones</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-purple-200 mb-4 min-h-[120px]">
              {isLoadingInsight ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
                </div>
              ) : (
                <div className="text-sm text-gray-700">
                  {aiInsight || 'Cargando insights de IA...'}
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <Badge className="bg-purple-100 text-purple-800 border-purple-300">
                <Zap className="w-3 h-3 mr-1" />
                Gemini AI
              </Badge>
              <Button 
                size="sm" 
                className="bg-purple-600 hover:bg-purple-700"
                onClick={generateAiInsight}
                disabled={isLoadingInsight}
              >
                {isLoadingInsight ? 'Generando...' : 'Nuevo Insight'}
                <Zap className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Métricas detalladas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Votantes */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Votantes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Registrados</span>
                  <span className="text-sm font-medium">{stats?.voters.registered.toLocaleString() || '0'}</span>
                </div>
                <Progress value={stats?.voters.registered / stats?.voters.total * 100 || 0} className="h-2" />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Potenciales</span>
                  <span className="text-sm font-medium">{stats?.voters.potential.toLocaleString() || '0'}</span>
                </div>
                <Progress value={stats?.voters.potential / stats?.voters.total * 100 || 0} className="h-2" />
              </div>
              
              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-gray-500">Total: {stats?.voters.total.toLocaleString() || '0'}</span>
                <Badge variant="outline" className="text-xs">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +{stats?.voters.growth || '0'}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Territorios */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5 text-purple-600" />
              Territorios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Activos</span>
                  <span className="text-sm font-medium">{stats?.territories.active || '0'}</span>
                </div>
                <Progress value={stats?.territories.active / stats?.territories.total * 100 || 0} className="h-2" />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Cobertura</span>
                  <span className="text-sm font-medium">{stats?.territories.coverage || '0'}%</span>
                </div>
                <Progress value={stats?.territories.coverage || 0} className="h-2" />
              </div>
              
              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-gray-500">Total: {stats?.territories.total || '0'}</span>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-7 text-xs"
                  onClick={() => navigate('/mapa-alertas')}
                >
                  Ver Mapa
                  <Globe className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Engagement */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-green-600" />
              Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Mensajes</span>
                  <span className="text-sm font-medium">{stats?.engagement.messages.toLocaleString() || '0'}</span>
                </div>
                <Progress value={80} className="h-2" />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Tasa Respuesta</span>
                  <span className="text-sm font-medium">{stats?.engagement.rate || '0'}%</span>
                </div>
                <Progress value={stats?.engagement.rate || 0} className="h-2" />
              </div>
              
              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-gray-500">Respuestas: {stats?.engagement.responses.toLocaleString() || '0'}</span>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-7 text-xs"
                  onClick={() => navigate('/mensajes')}
                >
                  Ver Mensajes
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Eventos y Rendimiento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Eventos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-600" />
              Eventos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats?.events.upcoming || '0'}</p>
                  <p className="text-sm text-gray-600">Próximos eventos</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats?.events.total || '0'}</p>
                  <p className="text-sm text-gray-600">Total eventos</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats?.events.attendance || '0'}%</p>
                  <p className="text-sm text-gray-600">Asistencia</p>
                </div>
              </div>
              
              <Button 
                className="w-full bg-orange-600 hover:bg-orange-700"
                onClick={() => navigate('/events')}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Ver Calendario de Eventos
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Rendimiento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              Rendimiento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-lg font-bold text-gray-900">{stats?.performance.conversion || '0'}%</p>
                  <p className="text-xs text-gray-600">Conversión</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-lg font-bold text-gray-900">{stats?.performance.retention || '0'}%</p>
                  <p className="text-xs text-gray-600">Retención</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <p className="text-lg font-bold text-gray-900">{stats?.performance.satisfaction || '0'}%</p>
                  <p className="text-xs text-gray-600">Satisfacción</p>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full border-blue-200 hover:bg-blue-50 hover:border-blue-300"
                onClick={() => navigate('/informes')}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Ver Métricas Detalladas
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ElectoralDashboard;
