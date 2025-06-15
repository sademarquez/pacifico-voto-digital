
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type LogLevel = 'info' | 'warning' | 'error' | 'critical';
export type LogCategory = 'auth' | 'database' | 'ui' | 'business_logic' | 'security' | 'performance' | 'system';

interface LogEvent {
  level: LogLevel;
  category: LogCategory;
  message: string;
  details?: any;
  stackTrace?: string;
}

export const useSystemLogger = () => {
  const logEvent = useCallback(async ({ level, category, message, details, stackTrace }: LogEvent) => {
    try {
      // Log local para depuración inmediata
      const logPrefix = `[${level.toUpperCase()}][${category.toUpperCase()}]`;
      const logMessage = `${logPrefix} ${message}`;
      
      if (level === 'error' || level === 'critical') {
        console.error(logMessage, details, stackTrace);
      } else if (level === 'warning') {
        console.warn(logMessage, details);
      } else {
        console.log(logMessage, details);
      }

      // Log a base de datos para auditoría
      const { error } = await supabase.rpc('log_system_event', {
        p_level: level,
        p_category: category,
        p_message: message,
        p_details: details ? JSON.stringify(details) : null
      });

      if (error) {
        console.error('[SYSTEM-LOGGER] Error guardando log:', error);
      }
    } catch (error) {
      console.error('[SYSTEM-LOGGER] Error crítico en logger:', error);
    }
  }, []);

  // Función para errores automáticos con stack trace
  const logError = useCallback((category: LogCategory, message: string, error: Error, details?: any) => {
    logEvent({
      level: 'error',
      category,
      message,
      details: {
        ...details,
        errorName: error.name,
        errorMessage: error.message
      },
      stackTrace: error.stack
    });
  }, [logEvent]);

  // Función para warnings automáticos
  const logWarning = useCallback((category: LogCategory, message: string, details?: any) => {
    logEvent({
      level: 'warning',
      category,
      message,
      details
    });
  }, [logEvent]);

  // Función para info automático
  const logInfo = useCallback((category: LogCategory, message: string, details?: any) => {
    logEvent({
      level: 'info',
      category,
      message,
      details
    });
  }, [logEvent]);

  return {
    logEvent,
    logError,
    logWarning,
    logInfo
  };
};
