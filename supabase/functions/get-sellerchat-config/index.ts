
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // Try to get SellerChat config from system_config table
    const { data, error } = await supabaseClient
      .from('system_config')
      .select('value')
      .eq('key', 'sellerchat_config')
      .single()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    const config = data?.value || {
      apiKey: Deno.env.get('SELLERCHAT_API_KEY') || '',
      webhookUrl: '',
      accountId: ''
    }

    return new Response(
      JSON.stringify({
        success: true,
        ...config
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('Error getting SellerChat config:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        apiKey: '',
        webhookUrl: '',
        accountId: ''
      }),
      {
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      }
    )
  }
})
