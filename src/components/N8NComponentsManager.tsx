
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Settings, 
  Webhook, 
  Play, 
  Pause, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  Copy,
  RefreshCw,
  Shield,
  Users,
  MessageSquare,
  MapPin,
  BarChart3,
  Calendar,
  Bell
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSecureAuth } from '@/contexts/SecureAuthContext';
import { useComponentFunctions, functionCategories, ComponentFunction } from '@/config/componentFunctions';
import { useAppConfig } from '@/config/appConfig';

const N8NComponentsManager = () => {
  const [selectedFunction, setSelectedFunction] = useState<ComponentFunction | null>(null);
  const [testData, setTestData] = useState('{}');
  const [isExecuting, setIsExecuting] = useState(false);
  const [results, setResults] = useState<any>(null);
  
  const { user } = useSecureAuth();
  const { toast } = useToast();
  const { functions, executeFunction, getFunctionsByCategory, getFunctionsByPermission } = useComponentFunctions();
  const { app, components } = useAppConfig();

  const handleExecuteFunction = async () => {
    if (!selectedFunction) return;

    try {
      setIsExecuting(true);
      const data = JSON.parse(testData);
      
      const result = await executeFunction(selectedFunction.id, data, user?.role);
      
      setResults(result);
      toast({
        title: "Función ejecutada",
        description: `${selectedFunction.name} ejecutada correctamente`,
      });
    } catch (error) {
      console.error('Error ejecutando función:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Error desconocido',
        variant: "destructive"
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado",
      description: "Texto copiado al portapapeles",
    });
  };

  const getIconComponent = (iconName: string) => {
    const icons = {
      Shield, Users, MessageSquare, MapPin, BarChart3, Calendar, Bell
    };
    return icons[iconName as keyof typeof icons] || Settings;
  };

  const userFunctions = user?.role ? getFunctionsByPermission(user.role) : [];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-negro-900">Gestor de Componentes N8N</h1>
          <p className="text-negro-600">Configuración y testing de funciones del sistema</p>
        </div>
        <Badge className="bg-verde-sistema-600 text-white">
          {userFunctions.length} funciones disponibles
        </Badge>
      </div>

      {/* Configuración General */}
      <Card className="border-2 border-verde-sistema-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configuración General
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>URL de Landing (Visitantes)</Label>
              <div className="flex gap-2">
                <Input 
                  value={app.landingUrl} 
                  readOnly 
                  className="font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(app.landingUrl)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-negro-600 mt-1">
                Configurable en <code>src/config/appConfig.ts</code>
              </p>
            </div>
            
            <div>
              <Label>Versión del Sistema</Label>
              <Input 
                value={`${app.companyName} ${app.version}`} 
                readOnly 
                className="font-mono text-sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Funciones por Categoría */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(functionCategories).map(([category, config]) => {
          const categoryFunctions = getFunctionsByCategory(category as ComponentFunction['category']);
          const availableFunctions = categoryFunctions.filter(f => 
            !f.requiresAuth || (user?.role && f.permissions.includes(user.role))
          );
          
          if (availableFunctions.length === 0) return null;
          
          const IconComponent = getIconComponent(config.icon);
          
          return (
            <Card key={category} className="border-2 border-negro-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconComponent className="w-5 h-5" />
                  {config.name}
                  <Badge variant="outline">
                    {availableFunctions.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {availableFunctions.map((func) => (
                    <div 
                      key={func.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedFunction?.id === func.id 
                          ? 'border-verde-sistema-500 bg-verde-sistema-50' 
                          : 'border-negro-200 hover:border-negro-300'
                      }`}
                      onClick={() => setSelectedFunction(func)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">{func.name}</div>
                          <div className="text-xs text-negro-600">{func.description}</div>
                          {func.n8nWebhook && (
                            <div className="text-xs text-verde-sistema-600 font-mono mt-1">
                              {func.n8nWebhook}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {func.enabled ? (
                            <CheckCircle className="w-4 h-4 text-verde-sistema-600" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-negro-400" />
                          )}
                          {func.requiresAuth && (
                            <Shield className="w-3 h-3 text-rojo-acento-600" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Panel de Testing */}
      {selectedFunction && (
        <Card className="border-2 border-rojo-acento-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5" />
              Testing: {selectedFunction.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <Label>Datos de Prueba (JSON)</Label>
                <Textarea
                  value={testData}
                  onChange={(e) => setTestData(e.target.value)}
                  placeholder='{"campo": "valor"}'
                  className="font-mono text-sm h-32"
                />
              </div>
              
              <div>
                <Label>Información de la Función</Label>
                <div className="bg-negro-50 p-3 rounded border text-sm space-y-2">
                  <div><strong>ID:</strong> {selectedFunction.id}</div>
                  <div><strong>Categoría:</strong> {selectedFunction.category}</div>
                  <div><strong>Webhook:</strong> {selectedFunction.n8nWebhook || 'N/A'}</div>
                  <div><strong>Requiere Auth:</strong> {selectedFunction.requiresAuth ? 'Sí' : 'No'}</div>
                  <div><strong>Permisos:</strong> {selectedFunction.permissions.join(', ')}</div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleExecuteFunction}
                disabled={isExecuting || !selectedFunction.enabled}
                className="bg-verde-sistema-600 hover:bg-verde-sistema-700"
              >
                {isExecuting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Ejecutando...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Ejecutar Función
                  </>
                )}
              </Button>
              
              {selectedFunction.n8nWebhook && (
                <Button 
                  variant="outline"
                  onClick={() => copyToClipboard(selectedFunction.n8nWebhook!)}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar Webhook
                </Button>
              )}
            </div>
            
            {results && (
              <div>
                <Label>Resultado</Label>
                <pre className="bg-negro-900 text-verde-sistema-400 p-3 rounded text-xs overflow-auto max-h-48">
                  {JSON.stringify(results, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Información de Configuración */}
      <Card className="border-2 border-negro-200">
        <CardHeader>
          <CardTitle>📋 Guía de Configuración</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="bg-verde-sistema-50 p-3 rounded border border-verde-sistema-200">
            <strong className="text-verde-sistema-800">1. Configurar URLs:</strong>
            <p className="text-negro-700">Edita <code>src/config/appConfig.ts</code> para cambiar la URL de landing de visitantes</p>
          </div>
          
          <div className="bg-rojo-acento-50 p-3 rounded border border-rojo-acento-200">
            <strong className="text-rojo-acento-800">2. Activar/Desactivar Funciones:</strong>
            <p className="text-negro-700">Modifica <code>src/config/componentFunctions.ts</code> para habilitar o deshabilitar funciones específicas</p>
          </div>
          
          <div className="bg-negro-50 p-3 rounded border border-negro-200">
            <strong className="text-negro-800">3. Configurar N8N:</strong>
            <p className="text-negro-700">Actualiza las URLs de webhook en <code>src/config/n8nConfig.ts</code> con tu instancia de N8N</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default N8NComponentsManager;
