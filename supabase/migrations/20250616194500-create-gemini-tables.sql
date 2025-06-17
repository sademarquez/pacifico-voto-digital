
-- Crear tabla para configuraciones de Gemini de usuarios
CREATE TABLE IF NOT EXISTS public.gemini_configs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    api_key_encrypted TEXT NOT NULL,
    model_preference TEXT NOT NULL DEFAULT 'gemini-2.0-flash',
    custom_prompts JSONB DEFAULT '{}',
    usage_limits JSONB DEFAULT '{
        "daily_requests": 1000,
        "monthly_requests": 25000,
        "max_tokens_per_request": 2048
    }',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Crear tabla para bases de datos de usuarios
CREATE TABLE IF NOT EXISTS public.user_databases (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    connection_config JSONB NOT NULL DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'configured',
    total_records INTEGER DEFAULT 0,
    last_sync TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.gemini_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_databases ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para gemini_configs
CREATE POLICY "Users can view their own gemini configs" 
    ON public.gemini_configs FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own gemini configs" 
    ON public.gemini_configs FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own gemini configs" 
    ON public.gemini_configs FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own gemini configs" 
    ON public.gemini_configs FOR DELETE 
    USING (auth.uid() = user_id);

-- Políticas RLS para user_databases
CREATE POLICY "Users can view their own databases" 
    ON public.user_databases FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own databases" 
    ON public.user_databases FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own databases" 
    ON public.user_databases FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own databases" 
    ON public.user_databases FOR DELETE 
    USING (auth.uid() = user_id);
