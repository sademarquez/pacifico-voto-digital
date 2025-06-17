
-- Confirmar emails de todos los usuarios demo para permitir login
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email IN ('dev@demo.com', 'master@demo.com', 'candidato@demo.com', 'lider@demo.com', 'votante@demo.com')
AND email_confirmed_at IS NULL;

-- Asegurar que todos los usuarios demo tengan perfiles correspondientes
INSERT INTO public.profiles (id, name, role, created_at)
SELECT 
    u.id,
    CASE 
        WHEN u.email = 'dev@demo.com' THEN 'Desarrollador'
        WHEN u.email = 'master@demo.com' THEN 'Master'
        WHEN u.email = 'candidato@demo.com' THEN 'Candidato'
        WHEN u.email = 'lider@demo.com' THEN 'Lider'
        WHEN u.email = 'votante@demo.com' THEN 'Votante'
    END,
    CASE 
        WHEN u.email = 'dev@demo.com' THEN 'desarrollador'::user_role
        WHEN u.email = 'master@demo.com' THEN 'master'::user_role
        WHEN u.email = 'candidato@demo.com' THEN 'candidato'::user_role
        WHEN u.email = 'lider@demo.com' THEN 'lider'::user_role
        WHEN u.email = 'votante@demo.com' THEN 'votante'::user_role
    END,
    NOW()
FROM auth.users u
WHERE u.email IN ('dev@demo.com', 'master@demo.com', 'candidato@demo.com', 'lider@demo.com', 'votante@demo.com')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    updated_at = NOW();
