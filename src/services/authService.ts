
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export interface AppUser extends User {
  role?: 'desarrollador' | 'master' | 'candidato' | 'lider' | 'votante';
  name?: string;
}

export const authService = {
  // Crear usuarios demo
  async createDemoUsers() {
    const users = [
      { email: 'daniel@demo.com', name: 'Daniel', role: 'desarrollador' },
      { email: 'luis@demo.com', name: 'Luis', role: 'desarrollador' },
      { email: 'sebastian@demo.com', name: 'Sebastian', role: 'desarrollador' },
      { email: 'llm@demo.com', name: 'LLM Assistant', role: 'desarrollador' }
    ];

    const results = [];
    
    for (const user of users) {
      try {
        // Crear usuario en auth
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
          console.error(`Error creando usuario ${user.email}:`, authError);
          results.push({ email: user.email, success: false, error: authError.message });
          continue;
        }

        // Crear perfil
        if (authData.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: authData.user.id,
              name: user.name,
              role: user.role,
              created_at: new Date().toISOString()
            });

          if (profileError) {
            console.error(`Error creando perfil para ${user.email}:`, profileError);
            results.push({ email: user.email, success: false, error: profileError.message });
          } else {
            results.push({ email: user.email, success: true, userId: authData.user.id });
          }
        }
      } catch (error) {
        console.error(`Error general creando ${user.email}:`, error);
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

  // Obtener usuario actual
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
  }
};
