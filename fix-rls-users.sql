-- ✅ SOLUCIÓN RÁPIDA: Deshabilitar RLS en tabla users
-- Ejecuta esto en Supabase SQL Editor para que el panel admin funcione

-- Opción 1: RÁPIDA (Development)
-- Deshabilita completamente RLS en tabla users
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- ============================================

-- Opción 2: SEGURA (Production) 
-- Descomenta para usar en production

-- -- Habilitar RLS
-- ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- -- Policy 1: Usuarios autenticados pueden leer todos
-- CREATE POLICY "allow_authenticated_read_users" ON public.users
--   FOR SELECT
--   USING (auth.role() = 'authenticated');

-- -- Policy 2: Admin puede actualizar
-- CREATE POLICY "allow_admin_update_users" ON public.users
--   FOR UPDATE
--   USING (
--     EXISTS (
--       SELECT 1 FROM public.users u2
--       WHERE u2.email = 'exe.main.darwin@gmail.com'
--       AND auth.uid() = u2.id
--     )
--   )
--   WITH CHECK (true);

-- -- Policy 3: Insert para signup
-- CREATE POLICY "allow_signup_insert_users" ON public.users
--   FOR INSERT
--   WITH CHECK (auth.uid() = id);
