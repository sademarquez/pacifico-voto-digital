
/*
 * Copyright © 2025 Daniel Lopez - Sademarquez. Todos los derechos reservados.
 */

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Key, 
  Settings, 
  CheckCircle, 
  AlertCircle,
  Eye,
  EyeOff,
  Save,
  Trash2,
  Plus,
  Copy,
  ExternalLink
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSecureAuth } from "@/contexts/SecureAuthContext";

interface APIKey {
  id: string;
  name: string;
  key: string;
  service: string;
  description: string;
  active: boolean;
  lastUsed?: string;
}

const APIKeyManager = () => {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [newKey, setNewKey] = useState({
    name: '',
    key: '',
    service: '',
    description: ''
  });
  const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({});
  const [isEditing, setIsEditing] = useState(false);
  
  const { user } = useSecureAuth();
  const { toast } = useToast();

  // Servicios disponibles con documentación
  const availableServices = [
    {
      name: 'OpenAI',
      id: 'openai',
      description: 'Chatbot y análisis de texto',
      docsUrl: 'https://platform.openai.com/api-keys',
      placeholder: 'sk-...',
      required: false
    },
    {
      name: 'Google Maps',
      id: 'googlemaps',
      description: 'Mapas y geolocalización',
      docsUrl: 'https://developers.google.com/maps/documentation/javascript/get-api-key',
      placeholder: 'AIza...',
      required: true
    },
    {
      name: 'Twilio',
      id: 'twilio',
      description: 'SMS y WhatsApp',
      docsUrl: 'https://console.twilio.com/',
      placeholder: 'AC...',
      required: false
    },
    {
      name: 'SendGrid',
      id: 'sendgrid',
      description: 'Envío de emails',
      docsUrl: 'https://app.sendgrid.com/settings/api_keys',
      placeholder: 'SG...',
      required: false
    },
    {
      name: 'N8N Webhook',
      id: 'n8n',
      description: 'Automatización y workflows',
      docsUrl: 'https://docs.n8n.io/webhooks/',
      placeholder: 'https://n8n.example.com/webhook/...',
      required: true
    }
  ];

  // Cargar API keys desde localStorage
  useEffect(() => {
    const savedKeys = localStorage.getItem('electoral_api_keys');
    if (savedKeys) {
      try {
        setApiKeys(JSON.parse(savedKeys));
      } catch (error) {
        console.error('Error loading API keys:', error);
      }
    }
  }, []);

  // Guardar API keys en localStorage
  const saveApiKeys = (keys: APIKey[]) => {
    localStorage.setItem('electoral_api_keys', JSON.stringify(keys));
    setApiKeys(keys);
  };

  const handleAddKey = () => {
    if (!newKey.name || !newKey.key || !newKey.service) {
      toast({
        title: "Campos requeridos",
        description: "Completa todos los campos obligatorios",
        variant: "destructive"
      });
      return;
    }

    const apiKey: APIKey = {
      id: Date.now().toString(),
      name: newKey.name,
      key: newKey.key,
      service: newKey.service,
      description: newKey.description,
      active: true,
      lastUsed: new Date().toISOString()
    };

    const updatedKeys = [...apiKeys, apiKey];
    saveApiKeys(updatedKeys);

    setNewKey({ name: '', key: '', service: '', description: '' });
    setIsEditing(false);

    toast({
      title: "✅ API Key agregada",
      description: `${newKey.name} configurada correctamente`,
    });
  };

  const handleDeleteKey = (id: string) => {
    const updatedKeys = apiKeys.filter(key => key.id !== id);
    saveApiKeys(updatedKeys);
    
    toast({
      title: "API Key eliminada",
      description: "La clave ha sido removida del sistema",
    });
  };

  const toggleKeyVisibility = (id: string) => {
    setShowKeys(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado",
      description: "API key copiada al portapapeles",
    });
  };

  const toggleKeyStatus = (id: string) => {
    const updatedKeys = apiKeys.map(key => 
      key.id === id ? { ...key, active: !key.active } : key
    );
    saveApiKeys(updatedKeys);
  };

  // Solo desarrolladores pueden acceder
  if (user?.role !== 'desarrollador') {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertCircle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          Solo los desarrolladores pueden gestionar las API keys del sistema.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-2 border-verde-sistema-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-negro-900">
            <Key className="w-6 h-6 text-verde-sistema-600" />
            Gestión de API Keys
          </CardTitle>
          <p className="text-negro-600">
            Configura las claves API para dar vida a las funcionalidades del sistema
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {/* Estado actual */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-verde-sistema-50 p-4 rounded-lg border border-verde-sistema-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-verde-sistema-600" />
                <span className="font-medium text-verde-sistema-800">Configuradas</span>
              </div>
              <div className="text-2xl font-bold text-verde-sistema-900">
                {apiKeys.filter(k => k.active).length}
              </div>
            </div>
            
            <div className="bg-negro-50 p-4 rounded-lg border border-negro-200">
              <div className="flex items-center gap-2 mb-2">
                <Key className="w-5 h-5 text-negro-600" />
                <span className="font-medium text-negro-800">Total</span>
              </div>
              <div className="text-2xl font-bold text-negro-900">
                {apiKeys.length}
              </div>
            </div>
            
            <div className="bg-rojo-acento-50 p-4 rounded-lg border border-rojo-acento-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-rojo-acento-600" />
                <span className="font-medium text-rojo-acento-800">Inactivas</span>
              </div>
              <div className="text-2xl font-bold text-rojo-acento-900">
                {apiKeys.filter(k => !k.active).length}
              </div>
            </div>
          </div>

          {/* Servicios disponibles */}
          <div className="space-y-3">
            <h3 className="font-bold text-negro-800">📋 Servicios Disponibles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availableServices.map((service) => {
                const hasKey = apiKeys.some(k => k.service === service.id && k.active);
                return (
                  <div key={service.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-medium text-negro-900">{service.name}</div>
                        <div className="text-sm text-negro-600">{service.description}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {hasKey ? (
                          <Badge className="bg-verde-sistema-600 text-white">✅ Activo</Badge>
                        ) : (
                          <Badge variant="outline" className="text-negro-600">❌ Pendiente</Badge>
                        )}
                        {service.required && (
                          <Badge className="bg-rojo-acento-600 text-white text-xs">Requerido</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(service.docsUrl, '_blank')}
                        className="text-xs"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Docs
                      </Button>
                      {!hasKey && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setNewKey(prev => ({ ...prev, service: service.id }));
                            setIsEditing(true);
                          }}
                          className="text-xs text-verde-sistema-700"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Configurar
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Formulario para nueva API key */}
          {isEditing && (
            <div className="border-2 border-verde-sistema-300 rounded-lg p-4 bg-verde-sistema-50">
              <h3 className="font-bold text-verde-sistema-800 mb-3">➕ Nueva API Key</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="keyName">Nombre</Label>
                  <Input
                    id="keyName"
                    value={newKey.name}
                    onChange={(e) => setNewKey(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Mi API de OpenAI"
                  />
                </div>
                <div>
                  <Label htmlFor="keyService">Servicio</Label>
                  <select
                    className="w-full p-2 border border-negro-300 rounded-md"
                    value={newKey.service}
                    onChange={(e) => setNewKey(prev => ({ ...prev, service: e.target.value }))}
                  >
                    <option value="">Seleccionar servicio</option>
                    {availableServices.map(service => (
                      <option key={service.id} value={service.id}>{service.name}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="keyValue">API Key</Label>
                  <Input
                    id="keyValue"
                    type="password"
                    value={newKey.key}
                    onChange={(e) => setNewKey(prev => ({ ...prev, key: e.target.value }))}
                    placeholder={availableServices.find(s => s.id === newKey.service)?.placeholder || "Pega aquí tu API key"}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="keyDescription">Descripción (opcional)</Label>
                  <Input
                    id="keyDescription"
                    value={newKey.description}
                    onChange={(e) => setNewKey(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Para qué se usará esta API key"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleAddKey} className="bg-verde-sistema-600 hover:bg-verde-sistema-700">
                  <Save className="w-4 h-4 mr-2" />
                  Guardar API Key
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          {/* Lista de API keys existentes */}
          {apiKeys.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-negro-800">🔑 API Keys Configuradas</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="text-verde-sistema-700"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Agregar Nueva
                </Button>
              </div>
              
              {apiKeys.map((apiKey) => (
                <div key={apiKey.id} className="p-4 border rounded-lg bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-medium text-negro-900">{apiKey.name}</div>
                      <div className="text-sm text-negro-600">
                        {availableServices.find(s => s.id === apiKey.service)?.name || apiKey.service}
                      </div>
                      {apiKey.description && (
                        <div className="text-xs text-negro-500">{apiKey.description}</div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={apiKey.active ? "bg-verde-sistema-600 text-white" : "bg-negro-400 text-white"}>
                        {apiKey.active ? "Activa" : "Inactiva"}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex-1 font-mono text-sm bg-negro-100 p-2 rounded">
                      {showKeys[apiKey.id] ? apiKey.key : '••••••••••••••••'}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => toggleKeyVisibility(apiKey.id)}
                    >
                      {showKeys[apiKey.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(apiKey.key)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleKeyStatus(apiKey.id)}
                      className={apiKey.active ? "text-negro-600" : "text-verde-sistema-600"}
                    >
                      {apiKey.active ? "Desactivar" : "Activar"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteKey(apiKey.id)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Guía de uso */}
          <Alert className="border-verde-sistema-200 bg-verde-sistema-50">
            <Settings className="h-4 w-4 text-verde-sistema-600" />
            <AlertDescription className="text-verde-sistema-800">
              <strong>💡 Guía de Uso:</strong>
              <br />• Las API keys se almacenan localmente en tu navegador
              <br />• Solo los desarrolladores pueden gestionar estas claves
              <br />• Las claves marcadas como "Requeridas" son necesarias para funcionalidades básicas
              <br />• Puedes activar/desactivar servicios según tus necesidades
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default APIKeyManager;
