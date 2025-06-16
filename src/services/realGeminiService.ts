
// Servicio Gemini con API key premium integrada
const GEMINI_API_KEY = 'AIzaSyDaq-_E5FQtTF0mfJsohXvT2OHMgldjq14';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export const realGeminiService = {
  async testConnection() {
    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: 'Test connection - respond with "OK"'
            }]
          }]
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Gemini API Error:', errorData);
        return { 
          success: false, 
          message: `API Error: ${response.status} - ${errorData}` 
        };
      }

      const data: GeminiResponse = await response.json();
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      return {
        success: true,
        message: `Conexión exitosa con Gemini 2.0 Flash Premium. Respuesta: ${responseText}`,
        model: 'gemini-2.0-flash-exp'
      };
    } catch (error) {
      console.error('Error testing Gemini connection:', error);
      return {
        success: false,
        message: `Error de conexión: ${(error as Error).message}`
      };
    }
  },

  async makeRequest(prompt: string) {
    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
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
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sin respuesta';
    } catch (error) {
      console.error('Error making Gemini request:', error);
      throw error;
    }
  },

  async analyzeElectoralSentiment(text: string) {
    try {
      const prompt = `Analiza el sentimiento electoral del siguiente texto: "${text}"
      
      Responde SOLO con un JSON en este formato:
      {
        "sentiment": "positivo|neutral|negativo",
        "confidence": 0.85,
        "electoral_impact": "alto|medio|bajo"
      }`;

      const response = await this.makeRequest(prompt);
      
      // Intentar parsear JSON de la respuesta
      try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (parseError) {
        console.error('Error parsing sentiment JSON:', parseError);
      }

      // Fallback
      return {
        sentiment: 'neutral',
        confidence: 0.5,
        electoral_impact: 'medio'
      };
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      return {
        sentiment: 'neutral',
        confidence: 0.5,
        electoral_impact: 'medio'
      };
    }
  }
};
