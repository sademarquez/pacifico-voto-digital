
export interface AppConfig {
  landingUrl: string;
  visitorFunnelUrl: string;
  companyName: string;
  systemName: string;
  supportEmail: string;
  version: string;
  demoMode: boolean;
  autoRedirectVisitors: boolean;
}

export interface ComponentConfig {
  userAuth: {
    enabled: boolean;
    provider: 'supabase' | 'n8n' | 'custom';
    redirectAfterLogin: string;
    demoMode: boolean;
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
  landingUrl: "https://tu-dominio.com/landing",
  visitorFunnelUrl: "/visitor-funnel",
  companyName: "MI CAMPAÑA",
  systemName: "Sistema Electoral Demo",
  supportEmail: "soporte@micampana.com",
  version: "2.0.0",
  demoMode: true,
  autoRedirectVisitors: true
};

// Configuración de componentes
export const componentConfig: ComponentConfig = {
  userAuth: {
    enabled: true,
    provider: 'supabase',
    redirectAfterLogin: '/dashboard',
    demoMode: true
  },
  voterRegistration: {
    enabled: true,
    requiresApproval: false,
    fields: ['name', 'email', 'phone', 'address', 'cedula']
  },
  messagingSystem: {
    enabled: true,
    providers: ['whatsapp', 'email']
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
    channels: ['push', 'email']
  }
};

// Hook para usar la configuración en componentes
export const useAppConfig = () => {
  return {
    app: appConfig,
    components: componentConfig
  };
};
