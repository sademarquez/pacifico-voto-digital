
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSecureAuth } from '../contexts/SecureAuthContext';
import OpenStreetMapComponent from './OpenStreetMapComponent';
import GeminiMCPMapController from './GeminiMCPMapController';
import SellerChatIntegration from './SellerChatIntegration';
import { 
  MapIcon,
  Brain,
  Zap,
  Globe,
  MessageCircle,
  Crown,
  Target,
  TrendingUp,
  Layers
} from 'lucide-react';

const EnhancedInteractiveMapFunnel = () => {
  const { user } = useSecureAuth();
  const [activeTab, setActiveTab] = useState<'map' | 'mcp' | 'chat'>('map');
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [currentBounds, setCurrentBounds] = useState<any>(null);
  const [territorialActions, setTerritorialActions] = useState<any[]>([]);

  // Alerts de ejemplo con datos más ricos
  const enhancedAlerts = [
    {
      id: 'mcp-1',
      title: 'Oportunidad Electoral Crítica',
      lat: 4.7500,
      lng: -74.0500,
      priority: 'high' as const,
      gemini_insight: 'IA detecta 89% probabilidad de conversión masiva',
      automation_potential: 95,
      predicted_votes: 1247
    },
    {
      id: 'mcp-2', 
      title: 'Zona de Alto Rendimiento',
      lat: 4.7600,
      lng: -74.0450,
      priority: 'medium' as const,
      gemini_insight: 'Demografía optimizada para propuestas educativas',
      automation_potential: 78,
      predicted_votes: 892
    },
    {
      id: 'mcp-3',
      title: 'Activación Territorial Requerida',
      lat: 4.7300,
      lng: -74.0600,
      priority: 'high' as const,
      gemini_insight: 'Competencia debilitada, momento estratégico ideal',
      automation_potential: 85,
      predicted_votes: 1556
    }
  ];

  const handleMapBoundsChange = (newBounds: any) => {
    setCurrentBounds(newBounds);
  };

  const handleTerritorialAction = (action: any) => {
    setTerritorialActions(prev => [...prev, {
      ...action,
      id: Date.now(),
      timestamp: new Date().toISOString()
    }]);
    console.log('🎯 Acción Territorial Ejecutada:', action);
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'map': return <Globe className="w-4 h-4" />;
      case 'mcp': return <Brain className="w-4 h-4" />;
      case 'chat': return <MessageCircle className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  const getUserLevelBadge = () => {
    switch (user?.role) {
      case 'desarrollador':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
          <Crown className="w-3 h-3 mr-1" />
          NIVEL MÁXIMO
        </Badge>;
      case 'master':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-300">
          <Target className="w-3 h-3 mr-1" />
          ESTRATÉGICO
        </Badge>;
      case 'candidato':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">
          <TrendingUp className="w-3 h-3 mr-1" />
          EJECUTIVO
        </Badge>;
      case 'lider':
        return <Badge className="bg-green-100 text-green-800 border-green-300">
          <Layers className="w-3 h-3 mr-1" />
          TERRITORIAL
        </Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">
          VISITANTE
        </Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 px-2 sm:px-4 py-4 sm:py-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header Mejorado */}
        <div className="relative bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 rounded-xl sm:rounded-2xl p-3 sm:p-6 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"4\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
          }}></div>
          
          <div className="relative z-10">
            <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                  <Brain className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg sm:text-2xl font-bold truncate">
                    Gemini MCP Electoral Intelligence
                  </h1>
                  <p className="opacity-90 text-xs sm:text-base truncate">
                    Sistema de Automatización Territorial Avanzada
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-1 sm:gap-2 justify-center sm:justify-end">
                {getUserLevelBadge()}
                <Badge className="bg-white/20 text-white text-xs">
                  <Zap className="w-3 h-3 mr-1" />
                  Powered by Gemini AI
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Navegación de Pestañas Mejorada */}
        <div className="flex justify-center">
          <div className="bg-white rounded-xl p-1 shadow-lg border-2 border-purple-200">
            <div className="flex gap-1">
              {[
                { id: 'map', label: 'Mapa Interactivo', desc: 'Vista territorial' },
                { id: 'mcp', label: 'Control MCP', desc: 'Automatización IA' },
                { id: 'chat', label: 'Chat Gemini', desc: 'Asistente avanzado' }
              ].map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`text-xs sm:text-sm flex flex-col items-center p-3 ${
                    activeTab === tab.id 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' 
                      : 'hover:bg-purple-50'
                  }`}
                >
                  {getTabIcon(tab.id)}
                  <span className="mt-1">{tab.label}</span>
                  <span className="text-xs opacity-70">{tab.desc}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Estadísticas Territoriales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {enhancedAlerts.reduce((sum, alert) => sum + alert.predicted_votes, 0).toLocaleString()}
              </div>
              <p className="text-sm text-green-700">Votos Predichos</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(enhancedAlerts.reduce((sum, alert) => sum + alert.automation_potential, 0) / enhancedAlerts.length)}%
              </div>
              <p className="text-sm text-blue-700">Automatización</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {enhancedAlerts.length}
              </div>
              <p className="text-sm text-purple-700">Zonas Activas</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {territorialActions.length}
              </div>
              <p className="text-sm text-yellow-700">Acciones Ejecutadas</p>
            </CardContent>
          </Card>
        </div>

        {/* Contenido Principal por Pestaña */}
        <div className="space-y-6">
          {activeTab === 'map' && (
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6">
              <div className="xl:col-span-3 order-2 xl:order-1">
                <div className="h-[400px] sm:h-[600px]">
                  <OpenStreetMapComponent 
                    onLocationSelect={(location) => console.log('Location selected:', location)}
                    alerts={enhancedAlerts.map(alert => ({
                      id: alert.id,
                      title: alert.title,
                      lat: alert.lat,
                      lng: alert.lng,
                      priority: alert.priority
                    }))}
                  />
                </div>
              </div>

              <div className="space-y-4 order-1 xl:order-2">
                <Card className="border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50">
                  <CardHeader className="p-3 sm:p-4">
                    <CardTitle className="flex items-center gap-2 text-purple-800 text-sm sm:text-base">
                      <Brain className="w-4 h-4 sm:w-5 sm:h-5" />
                      Insights Gemini
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-4 pt-0 space-y-3">
                    {enhancedAlerts.slice(0, 2).map((alert) => (
                      <div key={alert.id} className="bg-white/60 p-2 sm:p-3 rounded-lg border border-purple-200">
                        <h4 className="font-semibold text-sm text-purple-900 mb-1">
                          {alert.title}
                        </h4>
                        <p className="text-xs text-purple-700 mb-2">
                          {alert.gemini_insight}
                        </p>
                        <div className="flex justify-between text-xs">
                          <span>Votos: {alert.predicted_votes}</span>
                          <span>Auto: {alert.automation_potential}%</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'mcp' && (
            <GeminiMCPMapController
              mapInstance={mapInstance}
              currentBounds={currentBounds}
              onTerritorialAction={handleTerritorialAction}
            />
          )}

          {activeTab === 'chat' && (
            <div className="max-w-6xl mx-auto">
              <SellerChatIntegration />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedInteractiveMapFunnel;
