
// Servicio SellerChat Premium con credenciales seguras
import { supabase } from '@/integrations/supabase/client';

export interface SellerChatConfig {
  apiKey: string;
  webhookUrl?: string;
  accountId?: string;
}

export interface SellerChatMessage {
  to: string;
  message: string;
  type: 'text' | 'image' | 'document';
  mediaUrl?: string;
}

export const sellerChatService = {
  // Obtener configuración desde Supabase
  async getConfig(): Promise<SellerChatConfig | null> {
    try {
      const { data, error } = await supabase.functions.invoke('get-sellerchat-config');
      
      if (!error && data) {
        return data as SellerChatConfig;
      }
      
      // Fallback: buscar en system_config
      const { data: configData } = await supabase
        .from('system_config')
        .select('value')
        .eq('key', 'sellerchat_config')
        .single();
      
      if (configData?.value) {
        return configData.value as SellerChatConfig;
      }
      
      return null;
    } catch (error) {
      console.error('Error obteniendo config SellerChat:', error);
      return null;
    }
  },

  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const config = await this.getConfig();
      
      if (!config?.apiKey) {
        return {
          success: false,
          message: '❌ API Key de SellerChat no configurada'
        };
      }

      // Test básico de conexión
      const response = await fetch('https://api.sellerchat.com/v1/account/info', {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        return {
          success: true,
          message: '✅ SellerChat conectado exitosamente'
        };
      }

      return {
        success: false,
        message: '❌ Error de autenticación con SellerChat'
      };
    } catch (error) {
      return {
        success: false,
        message: `❌ Error de conexión: ${error}`
      };
    }
  },

  async sendMessage(message: SellerChatMessage): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const config = await this.getConfig();
      
      if (!config?.apiKey) {
        throw new Error('SellerChat no configurado');
      }

      const response = await fetch('https://api.sellerchat.com/v1/messages/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          messageId: data.messageId
        };
      }

      const errorData = await response.text();
      return {
        success: false,
        error: `API Error: ${response.status} - ${errorData}`
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message
      };
    }
  },

  async sendBulkMessages(messages: SellerChatMessage[]): Promise<{
    success: boolean;
    sent: number;
    failed: number;
    results: Array<{ success: boolean; messageId?: string; error?: string }>;
  }> {
    const results = [];
    let sent = 0;
    let failed = 0;

    for (const message of messages) {
      const result = await this.sendMessage(message);
      results.push(result);
      
      if (result.success) {
        sent++;
      } else {
        failed++;
      }
      
      // Pequeña pausa entre mensajes para evitar rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return {
      success: sent > 0,
      sent,
      failed,
      results
    };
  }
};
