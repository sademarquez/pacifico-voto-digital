
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { 
  MapPin, 
  AlertTriangle, 
  Users, 
  Vote,
  Heart,
  Phone,
  MessageCircle,
  Share2,
  Calendar,
  Trophy,
  Target,
  Star,
  Navigation,
  Zap
} from 'lucide-react';

interface Territory {
  id: string;
  name: string;
  type: string;
  coordinates: any;
  population: number;
}

interface Alert {
  id: string;
  title: string;
  description: string;
  type: string;
  priority: string;
  coordinates: any;
  created_at: string;
}

interface Candidate {
  id: string;
  user_name: string;
  position: string;
  photo_url: string;
  slogan: string;
  proposals: string[];
  vote_count: number;
}

const VisitorFunnel = () => {
  const [selectedTerritory, setSelectedTerritory] = useState<string>('');
  const [sessionId] = useState(() => `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [showCandidateInfo, setShowCandidateInfo] = useState(false);
  const [voteIntention, setVoteIntention] = useState<string>('');

  // Query para territorios demo
  const { data: territories = [] } = useQuery({
    queryKey: ['demo-territories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('demo.territories')
        .select('*')
        .order('type', { ascending: true });
      
      if (error) {
        console.error('Error fetching territories:', error);
        return [];
      }
      return data as Territory[];
    }
  });

  // Query para alertas según territorio seleccionado
  const { data: alerts = [], isLoading: alertsLoading } = useQuery({
    queryKey: ['demo-alerts', selectedTerritory],
    queryFn: async () => {
      if (!selectedTerritory) return [];
      
      const { data, error } = await supabase
        .from('demo.alerts')
        .select('*')
        .eq('territory_id', selectedTerritory)
        .eq('status', 'active')
        .order('priority', { ascending: false });

      if (error) {
        console.error('Error fetching alerts:', error);
        return [];
      }
      return data as Alert[];
    },
    enabled: !!selectedTerritory
  });

  // Query para candidatos del territorio
  const { data: candidates = [] } = useQuery({
    queryKey: ['demo-candidates', selectedTerritory],
    queryFn: async () => {
      if (!selectedTerritory) return [];
      
      const { data, error } = await supabase
        .from('demo.candidates')
        .select(`
          id,
          position,
          photo_url,
          slogan,
          proposals,
          vote_count,
          user:demo.users!demo_candidates_user_id_fkey(name)
        `)
        .eq('territory_id', selectedTerritory)
        .order('vote_count', { ascending: false });

      if (error) {
        console.error('Error fetching candidates:', error);
        return [];
      }
      
      return data.map(c => ({
        ...c,
        user_name: c.user?.name || 'Candidato',
        proposals: Array.isArray(c.proposals) ? c.proposals : []
      })) as Candidate[];
    },
    enabled: !!selectedTerritory
  });

  // Función para registrar interacciones con Gemini
  const logInteraction = async (type: string, data: any = {}) => {
    try {
      // Análisis básico con Gemini (simulado por simplicidad)
      const geminiAnalysis = {
        interaction_type: type,
        timestamp: new Date().toISOString(),
        user_behavior_score: Math.random() * 100,
        vote_probability: type === 'candidate_view' ? Math.random() * 100 : null,
        interests: type === 'alert_click' ? [data.alert_type] : [],
        demographic_prediction: {
          age_range: '25-45',
          interests: ['politics', 'community'],
          engagement_level: 'high'
        }
      };

      await supabase
        .from('demo.visitor_interactions')
        .insert({
          session_id: sessionId,
          territory_id: selectedTerritory,
          interaction_type: type,
          data: data,
          gemini_analysis: geminiAnalysis,
          n8n_workflow_id: `workflow_${type}_${Date.now()}`
        });

      console.log(`📊 Interaction logged: ${type}`, { data, geminiAnalysis });
    } catch (error) {
      console.error('Error logging interaction:', error);
    }
  };

  // Efecto para mostrar candidatos después de interacciones
  useEffect(() => {
    if (selectedTerritory && alerts.length > 0 && !showCandidateInfo) {
      const timer = setTimeout(() => {
        setShowCandidateInfo(true);
        logInteraction('candidate_view', { auto_triggered: true });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [selectedTerritory, alerts, showCandidateInfo]);

  // Manejar selección de territorio
  const handleTerritorySelect = (territoryId: string) => {
    setSelectedTerritory(territoryId);
    logInteraction('map_view', { territory_id: territoryId });
  };

  // Manejar click en alerta
  const handleAlertClick = (alert: Alert) => {
    logInteraction('alert_click', { 
      alert_id: alert.id, 
      alert_type: alert.type, 
      priority: alert.priority 
    });
  };

  // Manejar intención de voto
  const handleVoteIntention = async (candidateId: string, intention: string) => {
    setVoteIntention(intention);
    await logInteraction('vote_intention', { 
      candidate_id: candidateId, 
      intention: intention 
    });
  };

  const getAlertColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'security': return <AlertTriangle className="w-4 h-4" />;
      case 'event': return <Calendar className="w-4 h-4" />;
      case 'campaign': return <Vote className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4">
      {/* Header de Bienvenida con IA */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
        <div className="relative z-10">
          <div className="text-center">
            <div className="flex justify-center items-center gap-2 mb-3">
              <Zap className="w-8 h-8 text-yellow-300 animate-pulse" />
              <h1 className="text-3xl font-bold">¡Descubre Tu Zona!</h1>
              <Zap className="w-8 h-8 text-yellow-300 animate-pulse" />
            </div>
            <p className="text-lg opacity-90 mb-4">
              Conoce las alertas, propuestas y candidatos de tu comunidad
            </p>
            <div className="flex justify-center items-center gap-2">
              <Navigation className="w-5 h-5 text-green-300" />
              <span className="text-green-300 font-semibold">Navegación inteligente con IA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selector de Territorio con Geolocalización */}
      <Card className="border-2 border-blue-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <MapPin className="w-6 h-6" />
            Selecciona tu Ubicación
            <Badge className="bg-blue-100 text-blue-800 ml-2">
              <Zap className="w-3 h-3 mr-1" />
              IA Activada
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Select value={selectedTerritory} onValueChange={handleTerritorySelect}>
              <SelectTrigger className="w-full h-14 text-lg border-2 border-blue-200 focus:border-blue-500">
                <SelectValue placeholder="🗺️ ¿Dónde vives? Selecciona tu zona..." />
              </SelectTrigger>
              <SelectContent>
                {territories.map((territory) => (
                  <SelectItem key={territory.id} value={territory.id}>
                    <div className="flex items-center gap-3 py-2">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      <div>
                        <span className="font-semibold">{territory.name}</span>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {territory.type}
                        </Badge>
                        <div className="text-xs text-gray-500">
                          {territory.population?.toLocaleString()} habitantes
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedTerritory && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-800">
                  <Target className="w-5 h-5" />
                  <span className="font-semibold">
                    Ubicación activa: {territories.find(t => t.id === selectedTerritory)?.name}
                  </span>
                </div>
                <p className="text-green-700 text-sm mt-1">
                  🤖 IA analizando tu zona... Cargando información personalizada
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Mapa de Alertas Inteligente */}
      {selectedTerritory && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50">
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  Alertas en tu Zona
                  <Badge className="bg-orange-100 text-orange-800 ml-2">
                    {alerts.length} activas
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {alertsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600">🤖 IA procesando alertas de tu zona...</p>
                  </div>
                ) : alerts.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Trophy className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-green-800 mb-2">¡Zona Tranquila!</h3>
                    <p className="text-green-600">No hay alertas activas. ¡Sigamos trabajando juntos!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {alerts.map((alert) => (
                      <div 
                        key={alert.id} 
                        className="border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer hover:border-blue-300"
                        onClick={() => handleAlertClick(alert)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="p-2 bg-gray-100 rounded-lg">
                              {getAlertIcon(alert.type)}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {alert.type}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  {new Date(alert.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Badge className={`${getAlertColor(alert.priority)} text-xs`}>
                            {alert.priority}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Panel de Candidatos con IA */}
          <div className="space-y-4">
            {showCandidateInfo && candidates.length > 0 && (
              <Card className="border-2 border-purple-200 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-lg">
                  <CardTitle className="text-center flex items-center justify-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-300" />
                    Candidatos en tu Zona
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {candidates.slice(0, 2).map((candidate) => (
                      <div key={candidate.id} className="text-center space-y-4 border-b pb-4 last:border-b-0">
                        <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-4 border-purple-200">
                          <img 
                            src={candidate.photo_url} 
                            alt={candidate.user_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-bold text-purple-800">{candidate.user_name}</h3>
                          <p className="text-purple-600 font-semibold capitalize">{candidate.position}</p>
                          <p className="text-sm text-purple-700 mt-1 italic">"{candidate.slogan}"</p>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-semibold text-gray-800 text-sm">Propuestas Principales:</h4>
                          <div className="space-y-1">
                            {candidate.proposals.slice(0, 3).map((proposal, index) => (
                              <p key={index} className="text-xs text-gray-700 text-left bg-gray-50 p-2 rounded">
                                {proposal}
                              </p>
                            ))}
                          </div>
                        </div>

                        {/* Intención de Voto con IA */}
                        <div className="space-y-2">
                          <h4 className="font-semibold text-gray-800 text-sm">🤖 ¿Qué opinas?</h4>
                          <div className="grid grid-cols-2 gap-2">
                            <Button 
                              size="sm"
                              variant={voteIntention === `positive_${candidate.id}` ? "default" : "outline"}
                              onClick={() => handleVoteIntention(candidate.id, 'positive')}
                              className="text-xs"
                            >
                              👍 Me gusta
                            </Button>
                            <Button 
                              size="sm"
                              variant={voteIntention === `interested_${candidate.id}` ? "default" : "outline"}
                              onClick={() => handleVoteIntention(candidate.id, 'interested')}
                              className="text-xs"
                            >
                              🤔 Me interesa
                            </Button>
                          </div>
                        </div>

                        {/* Llamadas a Acción */}
                        <div className="space-y-2 pt-2 border-t">
                          <Button 
                            size="sm"
                            className="w-full bg-green-600 hover:bg-green-700 text-xs"
                            onClick={() => window.open(`https://wa.me/+573002000001`, '_blank')}
                          >
                            <Phone className="w-3 h-3 mr-1" />
                            Contactar
                          </Button>
                          
                          <div className="grid grid-cols-2 gap-1">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-xs border-blue-600 text-blue-600 hover:bg-blue-50"
                            >
                              <MessageCircle className="w-3 h-3 mr-1" />
                              Mensaje
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-xs border-purple-600 text-purple-600 hover:bg-purple-50"
                            >
                              <Share2 className="w-3 h-3 mr-1" />
                              Compartir
                            </Button>
                          </div>
                        </div>

                        <div className="bg-blue-50 p-2 rounded text-xs text-blue-700">
                          <Star className="w-3 h-3 inline mr-1" />
                          {candidate.vote_count.toLocaleString()} personas ya apoyan esta candidatura
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Información Comunitaria con IA */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <Users className="w-5 h-5" />
                  Tu Comunidad IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">🤖 Análisis en tiempo real:</span>
                    <Badge className="bg-green-100 text-green-800">Activo</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Participación prevista:</span>
                    <Badge className="bg-blue-100 text-blue-800">{Math.floor(Math.random() * 20 + 65)}%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Engagement score:</span>
                    <Badge className="bg-purple-100 text-purple-800">{Math.floor(Math.random() * 15 + 80)}/100</Badge>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                    <Heart className="w-4 h-4 mr-2" />
                    Únete a la Comunidad
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Footer con Registro y IA */}
      {selectedTerritory && (
        <Card className="bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 border-blue-200 shadow-lg">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="flex justify-center items-center gap-2 mb-3">
                <Zap className="w-6 h-6 text-blue-600 animate-pulse" />
                <h3 className="text-xl font-semibold text-blue-800">
                  ¡La IA ha analizado tu perfil!
                </h3>
                <Zap className="w-6 h-6 text-blue-600 animate-pulse" />
              </div>
              <p className="text-blue-700 mb-4">
                Basado en tus interacciones, tenemos recomendaciones personalizadas para ti.
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={() => logInteraction('registration_start')}
                >
                  <Vote className="w-4 h-4 mr-2" />
                  Registrarme para Votar
                </Button>
                <Button 
                  variant="outline" 
                  className="border-purple-600 text-purple-600 hover:bg-purple-50"
                  onClick={() => logInteraction('registration_start', { type: 'events' })}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Ver Próximos Eventos
                </Button>
              </div>
              
              <div className="mt-4 bg-white/60 rounded-lg p-3">
                <p className="text-sm text-gray-600">
                  🤖 <strong>IA Insight:</strong> Tu perfil muestra alto interés en {alerts[0]?.type || 'política local'}. 
                  Te mantendremos informado sobre temas relevantes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VisitorFunnel;
