
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL o Anon Key no encontradas. Asegúrate de haber conectado Supabase en la configuración de tu proyecto Lovable.")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

