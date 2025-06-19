
export interface N8NConfig {
  baseUrl: string;
  webhookPrefix: string;
  apiKey?: string;
  timeout: number;
  retryAttempts: number;
}

export interface N8NWebhookPayload {
  component: string;
  action: string;
  data: any;
  timestamp: string;
  userId?: string;
  userRole?: string;
  sessionId?: string;
}

export interface N8NResponse {
  success: boolean;
  data?: any;
  error?: string;
  executionId?: string;
}

// Configuración por defecto para N8N
export const defaultN8NConfig: N8NConfig = {
  baseUrl: process.env.N8N_BASE_URL || 'http://localhost:5678',
  webhookPrefix: '/webhook',
  timeout: 30000, // 30 segundos
  retryAttempts: 3
};

// Mapeo de componentes a webhooks
export const componentWebhooks = {
  'user-auth': '/webhook/user-auth',
  'voter-registration': '/webhook/voter-registration',
  'messaging-system': '/webhook/messaging',
  'territory-management': '/webhook/territory',
  'analytics-engine': '/webhook/analytics',
  'event-coordinator': '/webhook/events',
  'whatsapp-integration': '/webhook/whatsapp',
  'email-campaigns': '/webhook/email',
  'social-media': '/webhook/social',
  'alert-system': '/webhook/alerts'
};

// Clase para manejar las comunicaciones con N8N
export class N8NClient {
  private config: N8NConfig;

  constructor(config: Partial<N8NConfig> = {}) {
    this.config = { ...defaultN8NConfig, ...config };
  }

  async executeWebhook(
    component: string, 
    action: string, 
    data: any = {},
    metadata: any = {}
  ): Promise<N8NResponse> {
    const webhook = componentWebhooks[component as keyof typeof componentWebhooks];
    
    if (!webhook) {
      return {
        success: false,
        error: `Webhook no encontrado para el componente: ${component}`
      };
    }

    const payload: N8NWebhookPayload = {
      component,
      action,
      data,
      timestamp: new Date().toISOString(),
      ...metadata
    };

    const url = `${this.config.baseUrl}${webhook}`;

    for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
      try {
        console.log(`🔄 Ejecutando N8N webhook (intento ${attempt}):`, {
          url,
          component,
          action,
          payload
        });

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` })
          },
          body: JSON.stringify(payload),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        
        console.log('✅ N8N webhook ejecutado exitosamente:', result);
        
        return {
          success: true,
          data: result,
          executionId: result.executionId
        };

      } catch (error) {
        console.error(`❌ Error en intento ${attempt}:`, error);
        
        if (attempt === this.config.retryAttempts) {
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Error desconocido'
          };
        }
        
        // Esperar antes del siguiente intento
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }

    return {
      success: false,
      error: 'Máximo número de intentos alcanzado'
    };
  }

  // Métodos específicos para cada componente
  async authenticateUser(email: string, password: string) {
    return this.executeWebhook('user-auth', 'login', { email, password });
  }

  async registerVoter(voterData: any) {
    return this.executeWebhook('voter-registration', 'createVoter', voterData);
  }

  async sendMessage(messageData: any) {
    return this.executeWebhook('messaging-system', 'sendMessage', messageData);
  }

  async createTerritory(territoryData: any) {
    return this.executeWebhook('territory-management', 'createTerritory', territoryData);
  }

  async generateReport(reportData: any) {
    return this.executeWebhook('analytics-engine', 'generateReport', reportData);
  }

  async createEvent(eventData: any) {
    return this.executeWebhook('event-coordinator', 'createEvent', eventData);
  }

  async sendWhatsApp(messageData: any) {
    return this.executeWebhook('whatsapp-integration', 'sendWhatsApp', messageData);
  }

  async sendEmail(emailData: any) {
    return this.executeWebhook('email-campaigns', 'sendEmail', emailData);
  }

  async publishSocialMedia(postData: any) {
    return this.executeWebhook('social-media', 'publishPost', postData);
  }

  async createAlert(alertData: any) {
    return this.executeWebhook('alert-system', 'createAlert', alertData);
  }
}

// Instancia global del cliente N8N
export const n8nClient = new N8NClient();

// Hook para usar N8N en componentes React
export const useN8N = () => {
  return {
    client: n8nClient,
    executeWebhook: n8nClient.executeWebhook.bind(n8nClient),
    authenticateUser: n8nClient.authenticateUser.bind(n8nClient),
    registerVoter: n8nClient.registerVoter.bind(n8nClient),
    sendMessage: n8nClient.sendMessage.bind(n8nClient),
    createTerritory: n8nClient.createTerritory.bind(n8nClient),
    generateReport: n8nClient.generateReport.bind(n8nClient),
    createEvent: n8nClient.createEvent.bind(n8nClient),
    sendWhatsApp: n8nClient.sendWhatsApp.bind(n8nClient),
    sendEmail: n8nClient.sendEmail.bind(n8nClient),
    publishSocialMedia: n8nClient.publishSocialMedia.bind(n8nClient),
    createAlert: n8nClient.createAlert.bind(n8nClient)
  };
};
