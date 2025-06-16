
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 
  (typeof window !== 'undefined' && (window as any).GEMINI_API_KEY);

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent';

interface GeminiRequest {
  contents: {
    parts: {
      text: string;
    }[];
  }[];
  generationConfig?: {
    temperature?: number;
    topK?: number;
    topP?: number;
    maxOutputTokens?: number;
  };
}

interface VoterProfile {
  nombre: string;
  edad?: number;
  profesion?: string;
  barrio?: string;
  intereses?: string;
  genero?: string;
  estrato?: number;
}

interface CandidateInfo {
  nombre: string;
  cargo: string;
  propuestas: any;
  partido?: string;
}

export class GeminiElectoralService {
  private apiKey: string;

  constructor() {
    this.apiKey = GEMINI_API_KEY || '';
    if (!this.apiKey) {
      console.warn('Gemini API key not found. Some features may not work.');
    }
  }

  private async makeRequest(prompt: string, config?: any): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Gemini API key not configured');
    }

    const request: GeminiRequest = {
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.8,
        maxOutputTokens: 1024,
        ...config
      }
    };

    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw error;
    }
  }

  async generatePersonalizedCampaignMessage(voterProfile: VoterProfile, candidateInfo: CandidateInfo): Promise<string> {
    const prompt = `
    Genera un mensaje de campaña electoral personalizado y persuasivo para:
    
    VOTANTE:
    - Nombre: ${voterProfile.nombre}
    - Edad: ${voterProfile.edad || 'No especificada'}
    - Profesión: ${voterProfile.profesion || 'No especificada'}
    - Barrio: ${voterProfile.barrio || 'No especificado'}
    - Estrato socioeconómico: ${voterProfile.estrato || 'No especificado'}
    - Género: ${voterProfile.genero || 'No especificado'}
    
    CANDIDATO:
    - Nombre: ${candidateInfo.nombre}
    - Cargo al que aspira: ${candidateInfo.cargo}
    - Partido: ${candidateInfo.partido || 'Independiente'}
    - Propuestas principales: ${JSON.stringify(candidateInfo.propuestas)}
    
    INSTRUCCIONES:
    - Máximo 160 caracteres (optimizado para SMS/WhatsApp)
    - Tono conversacional, cercano y respetuoso
    - Incluir el nombre del votante
    - Mencionar una propuesta específica relevante para su perfil
    - Call-to-action claro pero no agresivo
    - Usar lenguaje colombiano neutro
    - Evitar promesas irreales
    
    FORMATO: Solo el mensaje, sin explicaciones adicionales.
    `;

    return await this.makeRequest(prompt);
  }

  async analyzeSentiment(message: string): Promise<{
    score: number;
    level: string;
    emotions: string[];
    voterIntent: string;
    concerns: string[];
    engagementLevel: number;
  }> {
    const prompt = `
    Analiza el sentiment y contenido del siguiente mensaje electoral de un votante:
    "${message}"
    
    Proporciona un análisis completo que incluya:
    1. Score de sentiment (-1 a 1, donde -1 es muy negativo y 1 muy positivo)
    2. Nivel de sentiment (muy_negativo, negativo, neutral, positivo, muy_positivo)
    3. Emociones detectadas (máximo 3)
    4. Intención de voto (positiva, negativa, neutral, indecisa)
    5. Temas de preocupación mencionados
    6. Nivel de engagement (1-10)
    
    Responde SOLO en formato JSON válido:
    {
      "score": 0.0,
      "level": "neutral",
      "emotions": ["emocion1", "emocion2"],
      "voterIntent": "neutral",
      "concerns": ["preocupacion1"],
      "engagementLevel": 5
    }
    `;

    try {
      const response = await this.makeRequest(prompt);
      const cleanResponse = response.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanResponse);
    } catch (error) {
      console.error('Error parsing sentiment analysis:', error);
      // Devolver valores por defecto en caso de error
      return {
        score: 0,
        level: 'neutral',
        emotions: [],
        voterIntent: 'neutral',
        concerns: [],
        engagementLevel: 5
      };
    }
  }

  async generateAutomatedResponse(voterMessage: string, candidateInfo: CandidateInfo): Promise<string> {
    const prompt = `
    Genera una respuesta automática profesional para este mensaje de un votante:
    "${voterMessage}"
    
    Información del candidato:
    - Nombre: ${candidateInfo.nombre}
    - Cargo: ${candidateInfo.cargo}
    - Propuestas: ${JSON.stringify(candidateInfo.propuestas)}
    
    INSTRUCCIONES:
    - Responde de manera empática y profesional
    - Aborda las preocupaciones específicas mencionadas
    - Proporciona información relevante sin ser abrumador
    - Invita al diálogo constructivo
    - Máximo 200 caracteres
    - Tono respetuoso y político apropiado
    
    FORMATO: Solo la respuesta, sin explicaciones.
    `;

    return await this.makeRequest(prompt);
  }

  async optimizeCampaignStrategy(metricsData: any): Promise<{
    recommendations: string[];
    targetAudience: string[];
    messageOptimization: string;
    budgetSuggestions: string;
  }> {
    const prompt = `
    Analiza estas métricas de campaña electoral y proporciona recomendaciones de optimización:
    
    MÉTRICAS ACTUALES:
    ${JSON.stringify(metricsData, null, 2)}
    
    Proporciona recomendaciones estratégicas para:
    1. Acciones específicas para mejorar el ROI
    2. Audiencias objetivo más efectivas
    3. Optimización de mensajes
    4. Distribución eficiente del presupuesto
    
    Responde en formato JSON:
    {
      "recommendations": ["recomendacion1", "recomendacion2"],
      "targetAudience": ["audiencia1", "audiencia2"],
      "messageOptimization": "sugerencia de mensaje",
      "budgetSuggestions": "sugerencia de presupuesto"
    }
    `;

    try {
      const response = await this.makeRequest(prompt);
      const cleanResponse = response.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanResponse);
    } catch (error) {
      console.error('Error parsing campaign optimization:', error);
      return {
        recommendations: ['Revisar estrategia actual'],
        targetAudience: ['Votantes indecisos'],
        messageOptimization: 'Personalizar mensajes por demografía',
        budgetSuggestions: 'Redistribuir según canales más efectivos'
      };
    }
  }

  async generateWelcomeMessage(voterData?: Partial<VoterProfile>): Promise<string> {
    const prompt = `
    Genera un mensaje de bienvenida automático para un visitante que acaba de entrar a la plataforma electoral.
    
    ${voterData ? `Información disponible del visitante:
    - Nombre: ${voterData.nombre || 'No proporcionado'}
    - Ubicación: ${voterData.barrio || 'No especificada'}` : 'Es la primera visita del usuario.'}
    
    INSTRUCCIONES:
    - Tono amigable y acogedor
    - Breve explicación del propósito de la plataforma
    - Invitación a participar sin presión
    - Máximo 120 caracteres
    - Lenguaje inclusivo
    
    FORMATO: Solo el mensaje de bienvenida.
    `;

    return await this.makeRequest(prompt);
  }
}

export const geminiService = new GeminiElectoralService();
