
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useSystemLogger } from './useSystemLogger';

interface ErrorHandlerConfig {
  showToast?: boolean;
  logToSystem?: boolean;
  category?: string;
}

export const useErrorHandler = () => {
  const { toast } = useToast();
  const { logError } = useSystemLogger();

  const handleError = useCallback((
    error: Error | string,
    context: string,
    config: ErrorHandlerConfig = {}
  ) => {
    const {
      showToast = true,
      logToSystem = true,
      category = 'system'
    } = config;

    const errorMessage = typeof error === 'string' ? error : error.message;
    const errorObject = typeof error === 'string' ? new Error(error) : error;

    // Log del error
    if (logToSystem) {
      logError(category as any, `Error en ${context}: ${errorMessage}`, errorObject);
    }

    // Mostrar toast al usuario
    if (showToast) {
      toast({
        title: "Error del Sistema",
        description: `${context}: ${errorMessage}`,
        variant: "destructive"
      });
    }

    // Diagnóstico automático
    console.group(`🔥 ERROR DETECTADO - ${context}`);
    console.error('Mensaje:', errorMessage);
    console.error('Contexto:', context);
    console.error('Stack:', errorObject.stack);
    console.error('Configuración:', config);
    console.groupEnd();

    return errorObject;
  }, [toast, logError]);

  const handleAsyncError = useCallback(async (
    asyncFn: () => Promise<any>,
    context: string,
    config: ErrorHandlerConfig = {}
  ) => {
    try {
      return await asyncFn();
    } catch (error) {
      handleError(error as Error, context, config);
      throw error;
    }
  }, [handleError]);

  return {
    handleError,
    handleAsyncError
  };
};
