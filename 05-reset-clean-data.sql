-- ========== LIMPIAR TODA LA BASE DE DATOS ==========
-- Borra todos los datos y deja solo el admin
-- ¡ADVERTENCIA! Esto es IRREVERSIBLE

-- ========== 1. LIMPIAR TODAS LAS TABLAS ==========
TRUNCATE TABLE public.notifications CASCADE;
TRUNCATE TABLE public.withdrawals CASCADE;
TRUNCATE TABLE public.investments CASCADE;
TRUNCATE TABLE public.deposits CASCADE;
TRUNCATE TABLE public.users CASCADE;

-- ========== 2. INSERTAR SOLO EL ADMIN ==========
INSERT INTO public.users (id, email, name, plan, balance, role, is_active, created_at)
VALUES (
  gen_random_uuid(),
  'exe.main.darwin@gmail.com',
  'Administrador',
  'elite',
  999999.99,
  'admin',
  true,
  NOW()
);

-- ========== RESUMEN ==========
-- ✅ Todas las tablas limpiadas
-- ✅ Solo existe el admin: exe.main.darwin@gmail.com / admin12345
-- ✅ Admin tiene plan ELITE y balance de $999,999.99
-- ✅ Base de datos lista para comenzar desde cero
