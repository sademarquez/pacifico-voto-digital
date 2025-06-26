
/*
 * Copyright © 2025 Daniel Lopez - Sademarquez. Todos los derechos reservados.
 */

import { useState, useEffect } from 'react';

export interface APIKeyConfig {
  id: string;
  name: string;
  key: string;
  service: string;
  description: string;
  active: boolean;
  lastUsed?: string;
}

export const useAPIKeys = () => {
  const [apiKeys, setApiKeys] = useState<APIKeyConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar API keys desde localStorage
  useEffect(() => {
    try {
      const savedKeys = localStorage.getItem('electoral_api_keys');
      if (savedKeys) {
        setApiKeys(JSON.parse(savedKeys));
      }
    } catch (error) {
      console.error('Error loading API keys:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtener una API key específica por servicio
  const getAPIKey = (service: string): string | null => {
    const key = apiKeys.find(k => k.service === service && k.active);
    return key ? key.key : null;
  };

  // Verificar si un servicio está configurado
  const isServiceConfigured = (service: string): boolean => {
    return apiKeys.some(k => k.service === service && k.active);
  };

  // Obtener todas las API keys activas
  const getActiveKeys = (): APIKeyConfig[] => {
    return apiKeys.filter(k => k.active);
  };

  // Obtener estadísticas
  const getStats = () => {
    return {
      total: apiKeys.length,
      active: apiKeys.filter(k => k.active).length,
      inactive: apiKeys.filter(k => !k.active).length,
      services: [...new Set(apiKeys.map(k => k.service))].length
    };
  };

  // Marcar una API key como usada
  const markAsUsed = (service: string) => {
    try {
      const updatedKeys = apiKeys.map(key => 
        key.service === service && key.active 
          ? { ...key, lastUsed: new Date().toISOString() }
          : key
      );
      
      if (JSON.stringify(updatedKeys) !== JSON.stringify(apiKeys)) {
        localStorage.setItem('electoral_api_keys', JSON.stringify(updatedKeys));
        setApiKeys(updatedKeys);
      }
    } catch (error) {
      console.error('Error updating last used:', error);
    }
  };

  // Validar si todas las claves requeridas están configuradas
  const requiredServices = ['googlemaps', 'n8n'];
  const validateRequiredKeys = (): { valid: boolean; missing: string[] } => {
    const missing = requiredServices.filter(service => !isServiceConfigured(service));
    return {
      valid: missing.length === 0,
      missing
    };
  };

  return {
    apiKeys,
    isLoading,
    getAPIKey,
    isServiceConfigured,
    getActiveKeys,
    getStats,
    markAsUsed,
    validateRequiredKeys
  };
};

// Hook específico para servicios individuales
export const useOpenAI = () => {
  const { getAPIKey, isServiceConfigured, markAsUsed } = useAPIKeys();
  
  const executeWithAPI = async (prompt: string) => {
    const apiKey = getAPIKey('openai');
    if (!apiKey) {
      throw new Error('OpenAI API key no configurada');
    }
    
    markAsUsed('openai');
    
    // Aquí iría la lógica para usar OpenAI
    console.log('🤖 OpenAI API llamada:', { prompt, hasKey: !!apiKey });
    
    return {
      response: `Respuesta simulada para: ${prompt}`,
      usage: { tokens: 100 }
    };
  };
  
  return {
    isConfigured: isServiceConfigured('openai'),
    executeWithAPI
  };
};

export const useGoogleMaps = () => {
  const { getAPIKey, isServiceConfigured, markAsUsed } = useAPIKeys();
  
  const getMapConfig = () => {
    const apiKey = getAPIKey('googlemaps');
    if (!apiKey) {
      console.warn('⚠️ Google Maps API key no configurada');
      return null;
    }
    
    markAsUsed('googlemaps');
    
    return {
      apiKey,
      libraries: ['places', 'geometry'],
      region: 'CO'
    };
  };
  
  return {
    isConfigured: isServiceConfigured('googlemaps'),
    getMapConfig
  };
};

export const useTwilio = () => {
  const { getAPIKey, isServiceConfigured, markAsUsed } = useAPIKeys();
  
  const sendMessage = async (to: string, message: string) => {
    const apiKey = getAPIKey('twilio');
    if (!apiKey) {
      throw new Error('Twilio API key no configurada');
    }
    
    markAsUsed('twilio');
    
    console.log('📱 Twilio SMS enviado:', { to, message, hasKey: !!apiKey });
    
    return {
      success: true,
      messageId: `msg_${Date.now()}`,
      cost: 0.01
    };
  };
  
  return {
    isConfigured: isServiceConfigured('twilio'),
    sendMessage
  };
};

export const useN8N = () => {
  const { getAPIKey, isServiceConfigured, markAsUsed } = useAPIKeys();
  
  const executeWorkflow = async (workflowId: string, data: any) => {
    const webhookUrl = getAPIKey('n8n');
    if (!webhookUrl) {
      throw new Error('N8N webhook URL no configurada');
    }
    
    markAsUsed('n8n');
    
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workflowId,
          data,
          timestamp: new Date().toISOString()
        })
      });
      
      if (!response.ok) {
        throw new Error(`N8N error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('❌ Error ejecutando N8N workflow:', error);
      throw error;
    }
  };
  
  return {
    isConfigured: isServiceConfigured('n8n'),
    executeWorkflow
  };
};
