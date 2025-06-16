
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
    // Get Gemini API key from Supabase secrets
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY') || 'AIzaSyDaq-_E5FQtTF0mfJsohXvT2OHMgldjq14';

    return new Response(
      JSON.stringify({ 
        success: true,
        apiKey: geminiApiKey,
        model: 'gemini-2.0-flash-exp'
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('Error getting Gemini API key:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        // Fallback key
        apiKey: 'AIzaSyDaq-_E5FQtTF0mfJsohXvT2OHMgldjq14'
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
