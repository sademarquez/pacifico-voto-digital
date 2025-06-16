
// Servicio de autenticación mejorado con todas las funcionalidades
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export interface AppUser extends User {
  role?: 'desarrollador' | 'master' | 'candidato' | 'lider' | 'votante';
  name?: string;
}

export const enhancedAuthService = {
  // Crear usuarios desarrolladores específicos
  async createDeveloperUsers() {
    const developers = [
      { email: 'daniel@demo.com', name: 'Daniel', role: 'desarrollador' as const },
      { email: 'luis@demo.com', name: 'Luis', role: 'desarrollador' as const },
      { email: 'sebastian@demo.com', name: 'Sebastian', role: 'desarrollador' as const },
      { email: 'llm@demo.com', name: 'LLM Assistant', role: 'desarrollador' as const }
    ];

    const results = [];
    
    for (const dev of developers) {
      try {
        console.log(`🔧 Creando desarrollador: ${dev.name}`);
        
        // Verificar si ya existe
        const { data: existingUser } = await supabase
          .from('profiles')
          .select('id, name')
          .eq('name', dev.name)
          .single();

        if (existingUser) {
          results.push({
            email: dev.email,
            name: dev.name,
            success: true,
            status: 'ya_existe',
            userId: existingUser.id
          });
          continue;
        }

        // Usar función de base de datos para crear usuarios
        const { data, error } = await supabase.rpc('create_demo_users');
        
        if (error) {
          console.error(`Error creando ${dev.name}:`, error);
          results.push({
            email: dev.email,
            name: dev.name,
            success: false,
            error: error.message
          });
        } else {
          console.log(`✅ ${dev.name} creado exitosamente`);
          results.push({
            email: dev.email,
            name: dev.name,
            success: true,
            status: 'creado'
          });
        }
      } catch (error) {
        console.error(`Error general creando ${dev.name}:`, error);
        results.push({
          email: dev.email,
          name: dev.name,
          success: false,
          error: (error as Error).message
        });
      }
    }

    return {
      total: developers.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results
    };
  },

  // Verificar acceso completo del sistema
  async verifySystemAccess() {
    try {
      const checks = [];

      // 1. Test conexión base de datos
      const { data: dbTest, error: dbError } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);
      
      checks.push({
        component: 'Base de Datos',
        status: !dbError ? 'success' : 'error',
        message: !dbError ? 'Conexión exitosa' : 'Error de conexión',
        details: dbError?.message
      });

      // 2. Test usuarios desarrolladores
      const { data: devUsers } = await supabase
        .from('profiles')
        .select('name, role')
        .eq('role', 'desarrollador');

      checks.push({
        component: 'Usuarios Desarrolladores',
        status: devUsers && devUsers.length >= 4 ? 'success' : 'warning',
        message: `${devUsers?.length || 0} desarrolladores encontrados`,
        details: devUsers?.map(u => u.name).join(', ')
      });

      // 3. Test Gemini API
      try {
        const { secureGeminiService } = await import('./secureGeminiService');
        const geminiTest = await secureGeminiService.testSecureConnection();
        checks.push({
          component: 'Gemini Premium API',
          status: geminiTest.success ? 'success' : 'error',
          message: geminiTest.message,
          details: geminiTest.model
        });
      } catch (error) {
        checks.push({
          component: 'Gemini Premium API',
          status: 'error',
          message: 'Error cargando servicio',
          details: (error as Error).message
        });
      }

      // 4. Test SellerChat
      try {
        const { sellerChatService } = await import('./sellerChatService');
        const sellerTest = await sellerChatService.testConnection();
        checks.push({
          component: 'SellerChat API',
          status: sellerTest.success ? 'success' : 'warning',
          message: sellerTest.message
        });
      } catch (error) {
        checks.push({
          component: 'SellerChat API',
          status: 'warning',
          message: 'Servicio no configurado',
          details: 'Configure las credenciales de SellerChat'
        });
      }

      const successCount = checks.filter(c => c.status === 'success').length;
      const totalChecks = checks.length;

      return {
        overall: successCount === totalChecks ? 'success' : 'partial',
        score: `${successCount}/${totalChecks}`,
        checks,
        recommendations: this.generateRecommendations(checks)
      };
    } catch (error) {
      return {
        overall: 'error',
        score: '0/0',
        checks: [],
        error: (error as Error).message,
        recommendations: ['Revisar conexión con Supabase', 'Verificar configuración del proyecto']
      };
    }
  },

  generateRecommendations(checks: any[]) {
    const recommendations = [];
    
    const failedChecks = checks.filter(c => c.status === 'error');
    const warningChecks = checks.filter(c => c.status === 'warning');
    
    if (failedChecks.length > 0) {
      recommendations.push('🔴 CRÍTICO: Resolver errores de conexión inmediatamente');
      failedChecks.forEach(check => {
        recommendations.push(`   - ${check.component}: ${check.message}`);
      });
    }
    
    if (warningChecks.length > 0) {
      recommendations.push('🟡 IMPORTANTE: Configurar servicios pendientes');
      warningChecks.forEach(check => {
        recommendations.push(`   - ${check.component}: ${check.message}`);
      });
    }
    
    if (failedChecks.length === 0 && warningChecks.length === 0) {
      recommendations.push('✅ Sistema completamente funcional');
      recommendations.push('✅ Todos los servicios operativos');
      recommendations.push('✅ Acceso completo habilitado');
    }
    
    return recommendations;
  },

  // Obtener usuario actual con información completa
  async getCurrentUserComplete() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) return null;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      return {
        ...user,
        name: profile?.name || user.email?.split('@')[0] || 'Usuario',
        role: profile?.role || 'votante',
        profile: profile
      } as AppUser & { profile: any };
    } catch (error) {
      console.error('Error obteniendo usuario completo:', error);
      return null;
    }
  }
};
