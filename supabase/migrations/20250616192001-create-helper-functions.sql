
-- Función auxiliar para obtener bases de datos del usuario
CREATE OR REPLACE FUNCTION public.get_user_databases(p_user_id UUID)
RETURNS TABLE (
    id UUID,
    name TEXT,
    description TEXT,
    connection_config JSONB,
    status TEXT,
    total_records INTEGER,
    last_sync TIMESTAMPTZ,
    created_at TIMESTAMPTZ
)
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT 
        ud.id,
        ud.name,
        ud.description,
        ud.connection_config,
        ud.status,
        ud.total_records,
        ud.last_sync,
        ud.created_at
    FROM public.user_databases ud
    WHERE ud.user_id = p_user_id
    ORDER BY ud.created_at DESC;
$$;

-- Función auxiliar para obtener configuración de Gemini del usuario
CREATE OR REPLACE FUNCTION public.get_user_gemini_config(p_user_id UUID)
RETURNS TABLE (
    id UUID,
    api_key_encrypted TEXT,
    model_preference TEXT,
    custom_prompts JSONB,
    usage_limits JSONB,
    is_active BOOLEAN
)
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT 
        gc.id,
        gc.api_key_encrypted,
        gc.model_preference,
        gc.custom_prompts,
        gc.usage_limits,
        gc.is_active
    FROM public.gemini_configs gc
    WHERE gc.user_id = p_user_id;
$$;
