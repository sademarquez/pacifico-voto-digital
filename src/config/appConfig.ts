export interface AppConfig {
  landingUrl: string;
  visitorFunnelUrl: string;
  companyName: string;
  systemName: string;
  supportEmail: string;
  version: string;
  productionMode: boolean;
  autoRedirectVisitors: boolean;
  demoMode: boolean;
}

export interface ComponentConfig {
  userAuth: {
    enabled: boolean;
    provider: 'supabase' | 'n8n' | 'custom';
    redirectAfterLogin: string;
    productionMode: boolean;
  };
  voterRegistration: {
    enabled: boolean;
    requiresApproval: boolean;
    fields: string[];
  };
  messagingSystem: {
    enabled: boolean;
    providers: ('whatsapp' | 'email' | 'sms')[];
  };
  territoryManagement: {
    enabled: boolean;
    mapProvider: 'google' | 'openstreet' | 'custom';
  };
  analyticsEngine: {
    enabled: boolean;
    provider: 'internal' | 'n8n' | 'external';
  };
  eventCoordinator: {
    enabled: boolean;
    calendarIntegration: boolean;
  };
  alertSystem: {
    enabled: boolean;
    channels: ('push' | 'email' | 'sms')[];
  };
}

// Configuración principal de la aplicación
export const appConfig: AppConfig = {
  landingUrl: "https://sistema-electoral.com/landing",
  visitorFunnelUrl: "/visitor-funnel",
  companyName: "SISTEMA ELECTORAL",
  systemName: "Plataforma de Gestión Electoral v3.0",
  supportEmail: "soporte@sistema-electoral.com",
  version: "3.0.0",
  productionMode: true,
  autoRedirectVisitors: true,
  demoMode: false
};

// Configuración de componentes
export const componentConfig: ComponentConfig = {
  userAuth: {
    enabled: true,
    provider: 'supabase',
    redirectAfterLogin: '/dashboard',
    productionMode: true
  },
  voterRegistration: {
    enabled: true,
    requiresApproval: false,
    fields: ['name', 'email', 'phone', 'address', 'cedula']
  },
  messagingSystem: {
    enabled: true,
    providers: ['whatsapp', 'email', 'sms']
  },
  territoryManagement: {
    enabled: true,
    mapProvider: 'openstreet'
  },
  analyticsEngine: {
    enabled: true,
    provider: 'n8n'
  },
  eventCoordinator: {
    enabled: true,
    calendarIntegration: true
  },
  alertSystem: {
    enabled: true,
    channels: ['push', 'email', 'sms']
  }
};

// Hook para usar la configuración en componentes
export const useAppConfig = () => {
  return {
    app: appConfig,
    components: componentConfig
  };
};
