
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  MessageSquare, 
  Users, 
  BarChart3, 
  MapPin, 
  Calendar,
  Settings,
  Database,
  Phone,
  Mail,
  Share2,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

interface N8NComponent {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: 'auth' | 'data' | 'communication' | 'analytics' | 'automation';
  status: 'active' | 'inactive' | 'error';
  n8nWebhook?: string;
  requiredData?: string[];
  actions: string[];
}

const N8NComponentsManager = () => {
  const [components] = useState<N8NComponent[]>([
    {
      id: 'user-auth',
      name: 'Autenticación de Usuario',
      description: 'Gestión de login, registro y perfiles de usuario',
      icon: Users,
      category: 'auth',
      status: 'active',
      n8nWebhook: '/webhook/user-auth',
      requiredData: ['email', 'password', 'role'],
      actions: ['login', 'register', 'logout', 'updateProfile']
    },
    {
      id: 'voter-registration',
      name: 'Registro de Votantes',
      description: 'Captura y gestión de información de votantes',
      icon: Database,
      category: 'data',
      status: 'active',
      n8nWebhook: '/webhook/voter-registration',
      requiredData: ['name', 'cedula', 'address', 'phone', 'territory'],
      actions: ['createVoter', 'updateVoter', 'deleteVoter', 'searchVoter']
    },
    {
      id: 'messaging-system',
      name: 'Sistema de Mensajería',
      description: 'Envío masivo y personalizado de mensajes',
      icon: MessageSquare,
      category: 'communication',
      status: 'active',
      n8nWebhook: '/webhook/messaging',
      requiredData: ['recipients', 'message', 'priority', 'channel'],
      actions: ['sendMessage', 'scheduleMessage', 'trackDelivery', 'generateReport']
    },
    {
      id: 'territory-management',
      name: 'Gestión Territorial',
      description: 'Administración de territorios y estructuras',
      icon: MapPin,
      category: 'data',
      status: 'active',
      n8nWebhook: '/webhook/territory',
      requiredData: ['name', 'coordinates', 'responsible', 'population'],
      actions: ['createTerritory', 'assignLeader', 'updateBoundaries', 'generateStats']
    },
    {
      id: 'analytics-engine',
      name: 'Motor de Análisis',
      description: 'Generación de reportes y métricas electorales',
      icon: BarChart3,
      category: 'analytics',
      status: 'active',
      n8nWebhook: '/webhook/analytics',
      requiredData: ['metrics', 'period', 'territory', 'filters'],
      actions: ['generateReport', 'exportData', 'scheduleReport', 'sendAlert']
    },
    {
      id: 'event-coordinator',
      name: 'Coordinador de Eventos',
      description: 'Planificación y gestión de eventos de campaña',
      icon: Calendar,
      category: 'automation',
      status: 'active',
      n8nWebhook: '/webhook/events',
      requiredData: ['title', 'date', 'location', 'attendees', 'budget'],
      actions: ['createEvent', 'sendInvitations', 'trackAttendance', 'generateSummary']
    },
    {
      id: 'whatsapp-integration',
      name: 'Integración WhatsApp',
      description: 'Comunicación directa vía WhatsApp Business',
      icon: Phone,
      category: 'communication',
      status: 'inactive',
      n8nWebhook: '/webhook/whatsapp',
      requiredData: ['phone', 'message', 'template', 'variables'],
      actions: ['sendWhatsApp', 'receiveMessage', 'updateStatus', 'manageTemplates']
    },
    {
      id: 'email-campaigns',
      name: 'Campañas de Email',
      description: 'Envío masivo y seguimiento de emails',
      icon: Mail,
      category: 'communication',
      status: 'inactive',
      n8nWebhook: '/webhook/email',
      requiredData: ['recipients', 'subject', 'template', 'attachments'],
      actions: ['sendEmail', 'trackOpens', 'manageUnsubscribes', 'A/B testing']
    },
    {
      id: 'social-media',
      name: 'Redes Sociales',
      description: 'Publicación automática en redes sociales',
      icon: Share2,
      category: 'communication',
      status: 'inactive',
      n8nWebhook: '/webhook/social',
      requiredData: ['platform', 'content', 'media', 'schedule'],
      actions: ['publishPost', 'scheduleContent', 'trackEngagement', 'manageAccounts']
    },
    {
      id: 'alert-system',
      name: 'Sistema de Alertas',
      description: 'Monitoreo y alertas automáticas del sistema',
      icon: AlertTriangle,
      category: 'automation',
      status: 'active',
      n8nWebhook: '/webhook/alerts',
      requiredData: ['type', 'severity', 'message', 'recipients'],
      actions: ['createAlert', 'escalateIssue', 'resolveAlert', 'generateReport']
    }
  ]);

  const executeN8NAction = async (componentId: string, action: string, data?: any) => {
    const component = components.find(c => c.id === componentId);
    if (!component || !component.n8nWebhook) {
      console.error('Componente o webhook no encontrado');
      return;
    }

    const payload = {
      component: componentId,
      action: action,
      data: data || {},
      timestamp: new Date().toISOString(),
      user: 'system' // Se reemplazará con datos reales del usuario
    };

    try {
      console.log(`Ejecutando acción N8N: ${action} en componente ${componentId}`, payload);
      
      // Aquí se haría la llamada real a N8N
      // const response = await fetch(`${N8N_BASE_URL}${component.n8nWebhook}`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload)
      // });
      
      console.log('✅ Acción ejecutada exitosamente');
      return { success: true, data: payload };
    } catch (error) {
      console.error('❌ Error ejecutando acción N8N:', error);
      return { success: false, error };
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'auth': return 'bg-negro-800 text-white';
      case 'data': return 'bg-verde-sistema-600 text-white';
      case 'communication': return 'bg-rojo-acento-600 text-white';
      case 'analytics': return 'bg-negro-600 text-white';
      case 'automation': return 'bg-verde-sistema-700 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-verde-sistema-600" />;
      case 'inactive': return <AlertTriangle className="w-4 h-4 text-rojo-acento-500" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-rojo-acento-600" />;
      default: return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-negro-950 mb-2">
          Manager de Componentes N8N
        </h1>
        <p className="text-negro-600">
          Sistema de integración para automatización de procesos electorales
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {components.map((component) => {
          const Icon = component.icon;
          
          return (
            <Card key={component.id} className="sistema-card">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-verde-sistema-100 rounded-lg">
                      <Icon className="w-6 h-6 text-verde-sistema-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-negro-900">
                        {component.name}
                      </CardTitle>
                      <Badge className={getCategoryColor(component.category)}>
                        {component.category}
                      </Badge>
                    </div>
                  </div>
                  {getStatusIcon(component.status)}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-negro-600">
                  {component.description}
                </p>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-negro-800">
                    Acciones Disponibles:
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {component.actions.map((action) => (
                      <Button
                        key={action}
                        size="sm"
                        variant="outline"
                        onClick={() => executeN8NAction(component.id, action)}
                        className="text-xs btn-verde border-verde-sistema-300 hover:bg-verde-sistema-50"
                      >
                        {action}
                      </Button>
                    ))}
                  </div>
                </div>
                
                {component.requiredData && (
                  <div>
                    <h4 className="text-sm font-semibold text-negro-800 mb-1">
                      Datos Requeridos:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {component.requiredData.map((field) => (
                        <Badge 
                          key={field} 
                          variant="secondary" 
                          className="text-xs bg-negro-100 text-negro-700"
                        >
                          {field}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="pt-2 border-t border-negro-200">
                  <p className="text-xs text-negro-500">
                    Webhook: {component.n8nWebhook || 'No configurado'}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default N8NComponentsManager;
