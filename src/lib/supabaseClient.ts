
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

if (!supabase) {
  console.error("Supabase URL o Anon Key no encontradas. Asegúrate de haber conectado Supabase en la configuración de tu proyecto Lovable. Si el problema persiste, intenta refrescar la página o reconectar Supabase.")
}

export { supabase }
