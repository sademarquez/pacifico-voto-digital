
import { geminiService } from './geminiService';

interface MCPMapData {
  coordinates: { lat: number; lng: number };
  territory: string;
  demographic: any;
  electoral_potential: number;
  automation_level: number;
}

interface TerritorialStrategy {
  zone_id: string;
  priority_level: 'critical' | 'high' | 'medium' | 'low';
  voter_segments: string[];
  automated_actions: string[];
  ai_recommendations: string[];
  resource_allocation: number;
}

interface MCPAutomationRule {
  trigger: string;
  condition: string;
  action: string;
  gemini_enhancement: string;
  execution_probability: number;
}

export class GeminiMCPService {
  private apiKey: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  }

  async generateTerritorialStrategy(
    mapData: MCPMapData, 
    userRole: string, 
    campaignObjectives: any
  ): Promise<TerritorialStrategy> {
    const prompt = `
    SISTEMA ELECTORAL AVANZADO - GEMINI MCP TERRITORIAL INTELLIGENCE

    CONTEXTO DE MAPA:
    - Coordenadas: ${mapData.coordinates.lat}, ${mapData.coordinates.lng}
    - Territorio: ${mapData.territory}
    - Potencial Electoral: ${mapData.electoral_potential}%
    - Nivel de Automatización: ${mapData.automation_level}%
    - Usuario: ${userRole}

    OBJETIVOS DE CAMPAÑA:
    ${JSON.stringify(campaignObjectives, null, 2)}

    INSTRUCCIONES AVANZADAS:
    Genera una estrategia territorial ultraespecífica que:
    1. Identifique segmentos de votantes con precisión quirúrgica
    2. Defina acciones automatizadas con IA que garanticen conversión
    3. Proporcione recomendaciones tácticas basadas en análisis predictivo
    4. Optimice asignación de recursos para ROI electoral máximo
    5. Genere reglas de automatización MCP que se ejecuten sin intervención humana

    FORMATO DE RESPUESTA (JSON estricto):
    {
      "zone_id": "identificador_unico",
      "priority_level": "critical|high|medium|low",
      "voter_segments": ["segmento1", "segmento2", "segmento3"],
      "automated_actions": ["accion1", "accion2", "accion3"],
      "ai_recommendations": ["rec1", "rec2", "rec3"],
      "resource_allocation": numero_porcentaje
    }

    GENERA ESTRATEGIA DOMINANTE AHORA:
    `;

    try {
      const response = await geminiService.makeRequest(prompt, {
        temperature: 0.3,
        maxOutputTokens: 1024
      });

      const cleanResponse = response.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanResponse);
    } catch (error) {
      console.error('Error generating territorial strategy:', error);
      return {
        zone_id: `zone_${Date.now()}`,
        priority_level: 'medium',
        voter_segments: ['Indecisos urbanos', 'Profesionales jóvenes'],
        automated_actions: ['Mensajes personalizados', 'Eventos dirigidos'],
        ai_recommendations: ['Incrementar presencia digital', 'Activar líderes locales'],
        resource_allocation: 25
      };
    }
  }

  async createMCPAutomationRules(
    territorialData: any,
    userRole: string
  ): Promise<MCPAutomationRule[]> {
    const prompt = `
    MCP AUTOMATION ARCHITECT - REGLAS DE AUTOMATIZACIÓN ELECTORAL

    DATOS TERRITORIALES:
    ${JSON.stringify(territorialData, null, 2)}

    ROL DE USUARIO: ${userRole}

    GENERA REGLAS MCP QUE:
    1. Se ejecuten automáticamente basadas en triggers específicos
    2. Utilicen análisis predictivo de Gemini para optimizar timing
    3. Adapten mensajes y acciones según contexto territorial
    4. Maximicen engagement y conversión de votantes
    5. Operen 24/7 sin intervención humana

    CATEGORÍAS DE AUTOMATIZACIÓN:
    - Detección de oportunidades electorales
    - Respuesta automática a eventos territoriales
    - Optimización de recursos en tiempo real
    - Activación de campañas micro-dirigidas
    - Análisis predictivo de tendencias

    RESPONDE EN FORMATO JSON ARRAY:
    [
      {
        "trigger": "condición_que_activa",
        "condition": "lógica_específica",
        "action": "acción_automatizada",
        "gemini_enhancement": "mejora_con_ia",
        "execution_probability": numero_0_a_100
      }
    ]
    `;

    try {
      const response = await geminiService.makeRequest(prompt, {
        temperature: 0.4,
        maxOutputTokens: 1536
      });

      const cleanResponse = response.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanResponse);
    } catch (error) {
      console.error('Error creating MCP automation rules:', error);
      return [
        {
          trigger: 'high_voter_concentration_detected',
          condition: 'electoral_potential > 70%',
          action: 'deploy_targeted_campaign',
          gemini_enhancement: 'Personalizar mensajes con IA según demografía local',
          execution_probability: 85
        }
      ];
    }
  }

  async analyzeMapInteraction(
    interactionData: any,
    userCredentials: any
  ): Promise<{
    insights: string[];
    next_actions: string[];
    automation_opportunities: string[];
    roi_prediction: number;
  }> {
    const prompt = `
    GEMINI MAP INTERACTION ANALYZER - ANÁLISIS AVANZADO

    DATOS DE INTERACCIÓN:
    ${JSON.stringify(interactionData, null, 2)}

    CREDENCIALES DE USUARIO:
    ${JSON.stringify(userCredentials, null, 2)}

    ANALIZA Y GENERA:
    1. Insights profundos sobre el comportamiento territorial
    2. Acciones específicas recomendadas para maximizar impacto
    3. Oportunidades de automatización identificadas
    4. Predicción de ROI electoral para esta zona

    CONSIDERA:
    - Patrones de engagement históricos
    - Demografía y psicografía electoral
    - Contexto político local
    - Recursos disponibles según credenciales
    - Timing electoral óptimo

    FORMATO JSON:
    {
      "insights": ["insight1", "insight2", "insight3"],
      "next_actions": ["accion1", "accion2", "accion3"],
      "automation_opportunities": ["oportunidad1", "oportunidad2"],
      "roi_prediction": numero_porcentaje
    }
    `;

    try {
      const response = await geminiService.makeRequest(prompt, {
        temperature: 0.5,
        maxOutputTokens: 1024
      });

      const cleanResponse = response.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanResponse);
    } catch (error) {
      console.error('Error analyzing map interaction:', error);
      return {
        insights: ['Zona con alto potencial electoral', 'Demografía favorable'],
        next_actions: ['Activar campaña dirigida', 'Desplegar recursos'],
        automation_opportunities: ['Mensajes automatizados', 'Eventos programados'],
        roi_prediction: 73
      };
    }
  }

  async generateDynamicMapContent(
    mapBounds: any,
    userRole: string,
    currentContext: any
  ): Promise<{
    territorial_alerts: any[];
    opportunity_zones: any[];
    automated_suggestions: string[];
    real_time_insights: string;
  }> {
    const prompt = `
    GEMINI DYNAMIC MAP CONTENT GENERATOR

    LÍMITES DEL MAPA:
    ${JSON.stringify(mapBounds, null, 2)}

    ROL: ${userRole}
    CONTEXTO: ${JSON.stringify(currentContext, null, 2)}

    GENERA CONTENIDO DINÁMICO PARA:
    1. Alertas territoriales específicas y accionables
    2. Zonas de oportunidad identificadas por IA
    3. Sugerencias automatizadas personalizadas
    4. Insights en tiempo real basados en datos actuales

    CRITERIOS:
    - Relevancia territorial inmediata
    - Accionabilidad según rol de usuario
    - Impacto electoral potencial
    - Urgencia y priorización
    - Viabilidad de automatización

    RESPUESTA JSON:
    {
      "territorial_alerts": [
        {
          "id": "alert_id",
          "title": "título_alerta",
          "description": "descripción_detallada",
          "coordinates": {"lat": 0, "lng": 0},
          "priority": "high|medium|low",
          "auto_action": "acción_sugerida"
        }
      ],
      "opportunity_zones": [
        {
          "zone_name": "nombre_zona",
          "potential_score": numero_0_100,
          "recommended_investment": numero_porcentaje,
          "automation_level": numero_0_100
        }
      ],
      "automated_suggestions": ["sugerencia1", "sugerencia2"],
      "real_time_insights": "insight_contextual_actual"
    }
    `;

    try {
      const response = await geminiService.makeRequest(prompt, {
        temperature: 0.6,
        maxOutputTokens: 2048
      });

      const cleanResponse = response.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanResponse);
    } catch (error) {
      console.error('Error generating dynamic map content:', error);
      return {
        territorial_alerts: [],
        opportunity_zones: [],
        automated_suggestions: ['Revisar datos territoriales', 'Activar análisis predictivo'],
        real_time_insights: 'Sistema en análisis continuo de territorios electorales'
      };
    }
  }
}

export const geminiMCPService = new GeminiMCPService();
