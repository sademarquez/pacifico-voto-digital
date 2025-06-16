
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Users, 
  TrendingUp, 
  MessageSquare, 
  Target,
  Calendar,
  DollarSign,
  Zap,
  Bot
} from 'lucide-react';
import { useSecureAuth } from '@/contexts/SecureAuthContext';
import { geminiService } from '@/services/geminiService';

const ElectoralDashboard = () => {
  const { user } = useSecureAuth();
  const [optimizationSuggestions, setOptimizationSuggestions] = useState<any>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Query para métricas en tiempo real
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['electoral-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('electoral_metrics')
        .select('*')
        .gte('fecha', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('fecha', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 30000 // Actualizar cada 30 segundos
  });

  // Query para votantes
  const { data: voters } = useQuery({
    queryKey: ['electoral-voters'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('electoral_voters')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data;
    }
  });

  // Query para interacciones recientes
  const { data: interactions } = useQuery({
    queryKey: ['recent-interactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('electoral_interactions')
        .select(`
          *,
          electoral_voters(nombre, apellido, barrio)
        `)
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Optimización automática con Gemini
  const optimizeCampaign = async () => {
    if (!metrics || metrics.length === 0) return;

    setIsOptimizing(true);
    try {
      const aggregatedMetrics = {
        totalContactos: metrics.reduce((sum, m) => sum + (m.total_contactos || 0), 0),
        contactosExitosos: metrics.reduce((sum, m) => sum + (m.contactos_exitosos || 0), 0),
        conversiones: metrics.reduce((sum, m) => sum + (m.conversiones || 0), 0),
        costoTotal: metrics.reduce((sum, m) => sum + (m.costo_total || 0), 0),
        sentimentPromedio: metrics.reduce((sum, m) => sum + (m.sentiment_promedio || 0), 0) / metrics.length,
        roi: metrics.reduce((sum, m) => sum + (m.roi || 0), 0) / metrics.filter(m => m.roi).length
      };

      const suggestions = await geminiService.optimizeCampaignStrategy(aggregatedMetrics);
      setOptimizationSuggestions(suggestions);
    } catch (error) {
      console.error('Error optimizing campaign:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  // Datos para gráficos
  const chartData = metrics?.slice(0, 7).reverse().map(m => ({
    fecha: new Date(m.fecha).toLocaleDateString(),
    contactos: m.total_contactos,
    exitosos: m.contactos_exitosos,
    conversiones: m.conversiones,
    sentiment: (m.sentiment_promedio * 100).toFixed(1)
  })) || [];

  const sentimentData = [
    { name: 'Muy Positivo', value: interactions?.filter(i => i.sentiment_level === 'muy_positivo').length || 0, color: '#22c55e' },
    { name: 'Positivo', value: interactions?.filter(i => i.sentiment_level === 'positivo').length || 0, color: '#84cc16' },
    { name: 'Neutral', value: interactions?.filter(i => i.sentiment_level === 'neutral').length || 0, color: '#f59e0b' },
    { name: 'Negativo', value: interactions?.filter(i => i.sentiment_level === 'negativo').length || 0, color: '#f97316' },
    { name: 'Muy Negativo', value: interactions?.filter(i => i.sentiment_level === 'muy_negativo').length || 0, color: '#ef4444' }
  ];

  // Métricas principales
  const totalVoters = voters?.length || 0;
  const totalInteractions = interactions?.length || 0;
  const averageSentiment = interactions?.reduce((sum, i) => sum + (i.sentiment_score || 0), 0) / (interactions?.length || 1) || 0;
  const conversionRate = totalInteractions > 0 ? ((interactions?.filter(i => i.exitosa).length || 0) / totalInteractions * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header con métricas principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Votantes</p>
                <p className="text-2xl font-bold text-blue-600">{totalVoters}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Interacciones Hoy</p>
                <p className="text-2xl font-bold text-green-600">{totalInteractions}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tasa Conversión</p>
                <p className="text-2xl font-bold text-purple-600">{conversionRate.toFixed(1)}%</p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sentiment Promedio</p>
                <p className={`text-2xl font-bold ${averageSentiment >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {(averageSentiment * 100).toFixed(0)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Optimización con IA */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <Bot className="w-6 h-6" />
            Optimización Automática con IA
            <Badge className="bg-purple-100 text-purple-800">
              <Zap className="w-3 h-3 mr-1" />
              Gemini AI
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={optimizeCampaign}
            disabled={isOptimizing}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isOptimizing ? 'Analizando...' : 'Optimizar Campaña con IA'}
          </Button>

          {optimizationSuggestions && (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-purple-800">Recomendaciones:</h4>
                <ul className="space-y-1 text-sm">
                  {optimizationSuggestions.recommendations?.map((rec: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-purple-600">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-purple-800">Audiencia Objetivo:</h4>
                <div className="flex flex-wrap gap-2">
                  {optimizationSuggestions.targetAudience?.map((audience: string, index: number) => (
                    <Badge key={index} className="bg-purple-100 text-purple-800">
                      {audience}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gráficos */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tendencia de Contactos (7 días)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="contactos" stroke="#3b82f6" name="Total Contactos" />
                <Line type="monotone" dataKey="exitosos" stroke="#10b981" name="Exitosos" />
                <Line type="monotone" dataKey="conversiones" stroke="#8b5cf6" name="Conversiones" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Análisis de Sentiment</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Interacciones recientes */}
      <Card>
        <CardHeader>
          <CardTitle>Interacciones Recientes (Últimas 24h)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {interactions?.slice(0, 10).map((interaction) => (
              <div key={interaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {interaction.electoral_voters?.nombre} {interaction.electoral_voters?.apellido}
                    </span>
                    <Badge className={`text-xs ${
                      interaction.sentiment_level === 'muy_positivo' || interaction.sentiment_level === 'positivo' 
                        ? 'bg-green-100 text-green-800'
                        : interaction.sentiment_level === 'neutral'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {interaction.sentiment_level}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{interaction.mensaje}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                    <span>{interaction.canal}</span>
                    <span>{interaction.electoral_voters?.barrio}</span>
                    <span>{new Date(interaction.created_at).toLocaleString()}</span>
                  </div>
                </div>
                {interaction.exitosa && (
                  <Badge className="bg-green-100 text-green-800">Exitosa</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ElectoralDashboard;
