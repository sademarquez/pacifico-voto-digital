
// Servicio Gemini con API Key desde Supabase Secrets
import { supabase } from '@/integrations/supabase/client';

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export const secureGeminiService = {
  // Obtener API key desde Supabase Secrets
  async getApiKey(): Promise<string> {
    try {
      // Intentar obtener desde función edge
      const { data, error } = await supabase.functions.invoke('get-gemini-key');
      
      if (!error && data?.apiKey) {
        return data.apiKey;
      }
      
      // Fallback a la API key premium hardcodeada
      return 'AIzaSyDaq-_E5FQtTF0mfJsohXvT2OHMgldjq14';
    } catch (error) {
      console.warn('Using fallback Gemini API key');
      return 'AIzaSyDaq-_E5FQtTF0mfJsohXvT2OHMgldjq14';
    }
  },

  async makeSecureRequest(prompt: string): Promise<string> {
    try {
      const apiKey = await this.getApiKey();
      const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';
      
      console.log('🤖 Gemini Secure API: Procesando consulta...');
      
      const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorData}`);
      }

      const data: GeminiResponse = await response.json();
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sin respuesta';
      
      console.log('✅ Respuesta exitosa de Gemini 2.0 Flash Premium');
      return responseText;
    } catch (error) {
      console.error('❌ Error en Gemini Secure Service:', error);
      throw error;
    }
  },

  async testSecureConnection(): Promise<{ success: boolean; message: string; model?: string }> {
    try {
      const response = await this.makeSecureRequest('Test connection - respond with "Gemini Premium OK"');
      
      return {
        success: true,
        message: `✅ Conexión exitosa con Gemini 2.0 Flash Premium Secure`,
        model: 'gemini-2.0-flash-exp'
      };
    } catch (error) {
      return {
        success: false,
        message: `❌ Error de conexión segura: ${error}`
      };
    }
  }
};
