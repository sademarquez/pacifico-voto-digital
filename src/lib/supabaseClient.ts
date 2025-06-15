
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zecltlsdkbndhqimpjjo.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplY2x0bHNka2JuZGhxaW1wampvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5NzI2MTIsImV4cCI6MjA2NTU0ODYxMn0.bOBZZ8RoPf9AU6FWg5WBIki11oA2xFkZcRS3QBzNZd0'

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  }
});

export { supabase }
