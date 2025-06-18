
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export interface AppUser extends User {
  role?: 'desarrollador' | 'master' | 'candidato' | 'lider' | 'votante' | 'visitante';
  name?: string;
}

export const authService = {
  // Crear usuarios demo finales optimizados
  async createDemoUsers() {
    const users = [
      { email: 'admin@campana.com', name: 'Desarrollador Principal', role: 'desarrollador' },
      { email: 'master@campana.com', name: 'Master Campaña', role: 'master' },
      { email: 'candidato@campana.com', name: 'Candidato Electoral', role: 'candidato' },
      { email: 'lider@campana.com', name: 'Líder Territorial', role: 'lider' },
      { email: 'votante@campana.com', name: 'Votante Demo', role: 'votante' },
      { email: 'daniel.llm@campana.com', name: 'Daniel LLM Verificador', role: 'desarrollador' }
    ];

    const results = [];
    
    for (const user of users) {
      try {
        console.log(`🔄 Creando usuario: ${user.email}`);
        
        // Crear usuario en auth con confirmación automática
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: user.email,
          password: '12345678',
          email_confirm: true,
          user_metadata: {
            name: user.name,
            role: user.role
          }
        });

        if (authError) {
          console.error(`❌ Error creando usuario ${user.email}:`, authError);
          results.push({ email: user.email, success: false, error: authError.message });
          continue;
        }

        // Crear perfil en la tabla profiles
        if (authData.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: authData.user.id,
              name: user.name,
              role: user.role as 'desarrollador' | 'master' | 'candidato' | 'lider' | 'votante',
              created_at: new Date().toISOString()
            }, {
              onConflict: 'id'
            });

          if (profileError) {
            console.error(`❌ Error creando perfil para ${user.email}:`, profileError);
            results.push({ email: user.email, success: false, error: profileError.message });
          } else {
            console.log(`✅ Usuario creado exitosamente: ${user.email}`);
            results.push({ email: user.email, success: true, userId: authData.user.id });
          }
        }
      } catch (error) {
        console.error(`❌ Error general creando ${user.email}:`, error);
        results.push({ email: user.email, success: false, error: (error as Error).message });
      }
    }

    return results;
  },

  // Verificar conexión
  async testConnection() {
    try {
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      return { success: !error, error: error?.message };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  },

  // Obtener usuario actual con perfil completo
  async getCurrentUser() {
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
        role: profile?.role || 'votante'
      } as AppUser;
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      return null;
    }
  },

  // Resetear contraseña de usuario
  async resetUserPassword(email: string, newPassword: string = '12345678') {
    try {
      const { error } = await supabase.auth.admin.updateUserById(
        email, 
        { password: newPassword }
      );
      
      return !error;
    } catch (error) {
      console.error('Error reseteando contraseña:', error);
      return false;
    }
  }
};
