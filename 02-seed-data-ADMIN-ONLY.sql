-- ✅ SCRIPT DE SEED DATA - Solo Admin
-- Ejecuta esto DESPUÉS del script 01-reset-db-NEW.sql

-- ============================================
-- INSERTAR SOLO USUARIO ADMIN
-- ============================================

INSERT INTO public.users (
  email,
  name,
  password_hash,
  plan,
  balance,
  is_active,
  created_at
) VALUES (
  'exe.main.darwin@gmail.com',
  'Admin User',
  '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DvJ32e',
  'elite',
  50000.00,
  true,
  NOW()
);

-- ============================================
-- VERIFICACIÓN
-- ============================================

SELECT COUNT(*) as total_usuarios FROM public.users;

-- ============================================
-- ✅ COMPLETADO
-- ============================================
-- Admin creado correctamente
-- Email: exe.main.darwin@gmail.com
-- Password: admin12345
