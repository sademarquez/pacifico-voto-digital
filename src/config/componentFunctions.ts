
import { useN8N } from './n8nConfig';
import { useAppConfig } from './appConfig';

export interface ComponentFunction {
  id: string;
  name: string;
  description: string;
  category: 'auth' | 'voter' | 'messaging' | 'territory' | 'analytics' | 'events' | 'alerts';
  enabled: boolean;
  n8nWebhook?: string;
  customFunction?: () => Promise<any>;
  requiresAuth: boolean;
  permissions: string[];
}

// CONFIGURACIÓN DE FUNCIONES DISPONIBLES
// PERSONALIZAR SEGÚN TUS NECESIDADES
export const componentFunctions: ComponentFunction[] = [
  // AUTENTICACIÓN
  {
    id: 'auth-login',
    name: 'Autenticar Usuario',
    description: 'Proceso de login y validación de credenciales',
    category: 'auth',
    enabled: true,
    n8nWebhook: '/webhook/user-auth',
    requiresAuth: false,
    permissions: ['public']
  },
  {
    id: 'auth-register',
    name: 'Registrar Usuario',
    description: 'Crear nueva cuenta de usuario',
    category: 'auth',
    enabled: true,
    n8nWebhook: '/webhook/user-register',
    requiresAuth: false,
    permissions: ['public']
  },

  // REGISTRO DE VOTANTES
  {
    id: 'voter-create',
    name: 'Registrar Votante',
    description: 'Crear nuevo registro de votante en el sistema',
    category: 'voter',
    enabled: true,
    n8nWebhook: '/webhook/voter-registration',
    requiresAuth: true,
    permissions: ['lider', 'candidato', 'master', 'desarrollador']
  },
  {
    id: 'voter-update',
    name: 'Actualizar Votante',
    description: 'Modificar información de votante existente',
    category: 'voter',
    enabled: true,
    n8nWebhook: '/webhook/voter-update',
    requiresAuth: true,
    permissions: ['lider', 'candidato', 'master', 'desarrollador']
  },
  {
    id: 'voter-search',
    name: 'Buscar Votantes',
    description: 'Búsqueda avanzada en base de datos de votantes',
    category: 'voter',
    enabled: true,
    n8nWebhook: '/webhook/voter-search',
    requiresAuth: true,
    permissions: ['lider', 'candidato', 'master', 'desarrollador']
  },

  // SISTEMA DE MENSAJERÍA
  {
    id: 'message-whatsapp',
    name: 'Enviar WhatsApp',
    description: 'Envío de mensajes masivos por WhatsApp',
    category: 'messaging',
    enabled: true,
    n8nWebhook: '/webhook/whatsapp-integration',
    requiresAuth: true,
    permissions: ['candidato', 'master', 'desarrollador']
  },
  {
    id: 'message-email',
    name: 'Campaña Email',
    description: 'Envío de campañas por correo electrónico',
    category: 'messaging',
    enabled: true,
    n8nWebhook: '/webhook/email-campaigns',
    requiresAuth: true,
    permissions: ['candidato', 'master', 'desarrollador']
  },
  {
    id: 'message-sms',
    name: 'Mensajes SMS',
    description: 'Envío de mensajes SMS masivos',
    category: 'messaging',
    enabled: false, // CAMBIAR A true PARA ACTIVAR
    n8nWebhook: '/webhook/sms-campaigns',
    requiresAuth: true,
    permissions: ['master', 'desarrollador']
  },

  // GESTIÓN TERRITORIAL
  {
    id: 'territory-create',
    name: 'Crear Territorio',
    description: 'Definir nuevas zonas territoriales',
    category: 'territory',
    enabled: true,
    n8nWebhook: '/webhook/territory-management',
    requiresAuth: true,
    permissions: ['candidato', 'master', 'desarrollador']
  },
  {
    id: 'territory-assign',
    name: 'Asignar Líderes',
    description: 'Asignar líderes a territorios específicos',
    category: 'territory',
    enabled: true,
    n8nWebhook: '/webhook/territory-assign',
    requiresAuth: true,
    permissions: ['candidato', 'master', 'desarrollador']
  },

  // ANALYTICS Y REPORTES
  {
    id: 'analytics-dashboard',
    name: 'Dashboard Analítico',
    description: 'Generar reportes y estadísticas en tiempo real',
    category: 'analytics',
    enabled: true,
    n8nWebhook: '/webhook/analytics-engine',
    requiresAuth: true,
    permissions: ['lider', 'candidato', 'master', 'desarrollador']
  },
  {
    id: 'analytics-export',
    name: 'Exportar Datos',
    description: 'Exportar datos en formatos Excel/PDF',
    category: 'analytics',
    enabled: true,
    n8nWebhook: '/webhook/analytics-export',
    requiresAuth: true,
    permissions: ['candidato', 'master', 'desarrollador']
  },

  // COORDINACIÓN DE EVENTOS
  {
    id: 'event-create',
    name: 'Crear Evento',
    description: 'Organizar eventos de campaña',
    category: 'events',
    enabled: true,
    n8nWebhook: '/webhook/event-coordinator',
    requiresAuth: true,
    permissions: ['lider', 'candidato', 'master', 'desarrollador']
  },
  {
    id: 'event-invite',
    name: 'Invitar Participantes',
    description: 'Enviar invitaciones masivas a eventos',
    category: 'events',
    enabled: true,
    n8nWebhook: '/webhook/event-invitations',
    requiresAuth: true,
    permissions: ['lider', 'candidato', 'master', 'desarrollador']
  },

  // SISTEMA DE ALERTAS
  {
    id: 'alert-create',
    name: 'Crear Alerta',
    description: 'Generar alertas y notificaciones',
    category: 'alerts',
    enabled: true,
    n8nWebhook: '/webhook/alert-system',
    requiresAuth: true,
    permissions: ['lider', 'candidato', 'master', 'desarrollador']
  },
  {
    id: 'alert-broadcast',
    name: 'Difundir Alerta',
    description: 'Enviar alertas masivas por todos los canales',
    category: 'alerts',
    enabled: true,
    n8nWebhook: '/webhook/alert-broadcast',
    requiresAuth: true,
    permissions: ['candidato', 'master', 'desarrollador']
  }
];

// Hook para usar las funciones de componentes
export const useComponentFunctions = () => {
  const { client } = useN8N();
  const { components } = useAppConfig();

  const executeFunction = async (functionId: string, data: any = {}, userRole?: string) => {
    const func = componentFunctions.find(f => f.id === functionId);
    
    if (!func) {
      throw new Error(`Función ${functionId} no encontrada`);
    }

    if (!func.enabled) {
      throw new Error(`Función ${functionId} está deshabilitada`);
    }

    if (func.requiresAuth && userRole && !func.permissions.includes(userRole)) {
      throw new Error(`Sin permisos para ejecutar ${functionId}`);
    }

    console.log(`🎯 EJECUTANDO FUNCIÓN: ${func.name}`, { functionId, data });

    // Si tiene webhook de N8N, usar N8N
    if (func.n8nWebhook) {
      const [, component] = func.category === 'auth' ? ['user-auth', 'login'] :
                           func.category === 'voter' ? ['voter-registration', func.id.split('-')[1]] :
                           func.category === 'messaging' ? ['messaging-system', func.id.split('-')[1]] :
                           func.category === 'territory' ? ['territory-management', func.id.split('-')[1]] :
                           func.category === 'analytics' ? ['analytics-engine', func.id.split('-')[1]] :
                           func.category === 'events' ? ['event-coordinator', func.id.split('-')[1]] :
                           ['alert-system', func.id.split('-')[1]];

      return await client.executeWebhook(component, func.id.split('-')[1], data, {
        userRole,
        functionId,
        timestamp: new Date().toISOString()
      });
    }

    // Si tiene función personalizada, ejecutarla
    if (func.customFunction) {
      return await func.customFunction();
    }

    throw new Error(`Función ${functionId} no tiene implementación`);
  };

  const getFunctionsByCategory = (category: ComponentFunction['category']) => {
    return componentFunctions.filter(f => f.category === category && f.enabled);
  };

  const getFunctionsByPermission = (userRole: string) => {
    return componentFunctions.filter(f => 
      f.enabled && (!f.requiresAuth || f.permissions.includes(userRole))
    );
  };

  return {
    functions: componentFunctions,
    executeFunction,
    getFunctionsByCategory,
    getFunctionsByPermission
  };
};

// Categorías de funciones para la UI
export const functionCategories = {
  auth: { name: 'Autenticación', icon: 'Shield', color: 'verde-sistema' },
  voter: { name: 'Registro Votantes', icon: 'Users', color: 'negro' },
  messaging: { name: 'Mensajería', icon: 'MessageSquare', color: 'rojo-acento' },
  territory: { name: 'Territorios', icon: 'MapPin', color: 'verde-sistema' },
  analytics: { name: 'Analytics', icon: 'BarChart3', color: 'negro' },
  events: { name: 'Eventos', icon: 'Calendar', color: 'rojo-acento' },
  alerts: { name: 'Alertas', icon: 'Bell', color: 'verde-sistema' }
};
