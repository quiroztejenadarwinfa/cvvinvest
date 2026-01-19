-- ✅ SCRIPT DE SEED DATA - Datos de ejemplo
-- Ejecuta esto DESPUÉS del script 01-reset-db.sql

-- ============================================
-- INSERTAR USUARIOS DE PRUEBA
-- ============================================

-- Usuario Admin
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
  '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DvJ32e', -- password: admin12345 (hashed)
  'elite',
  50000.00,
  true,
  NOW()
);

-- Usuario Gratuito 1
INSERT INTO public.users (
  email,
  name,
  password_hash,
  plan,
  balance,
  is_active,
  created_at
) VALUES (
  'usuario.gratuito@ejemplo.com',
  'Usuario Gratuito',
  '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DvJ32e',
  'gratuito',
  100.00,
  true,
  NOW()
);

-- Usuario Estándar
INSERT INTO public.users (
  email,
  name,
  password_hash,
  plan,
  balance,
  is_active,
  created_at
) VALUES (
  'usuario.estandar@ejemplo.com',
  'Usuario Estándar',
  '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DvJ32e',
  'estandar',
  5000.00,
  true,
  NOW()
);

-- Usuario Pro
INSERT INTO public.users (
  email,
  name,
  password_hash,
  plan,
  balance,
  is_active,
  created_at
) VALUES (
  'usuario.pro@ejemplo.com',
  'Usuario Pro',
  '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DvJ32e',
  'pro',
  15000.00,
  true,
  NOW()
);

-- Usuario VIP
INSERT INTO public.users (
  email,
  name,
  password_hash,
  plan,
  balance,
  is_active,
  created_at
) VALUES (
  'usuario.vip@ejemplo.com',
  'Usuario VIP',
  '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DvJ32e',
  'vip',
  30000.00,
  true,
  NOW()
);

-- ============================================
-- INSERTAR DEPÓSITOS DE EJEMPLO
-- ============================================

-- Depósito Pendiente (usuario estandar)
INSERT INTO public.deposits (
  user_email,
  user_name,
  amount,
  status,
  method,
  notes,
  created_at
) VALUES (
  'usuario.estandar@ejemplo.com',
  'Usuario Estándar',
  1000.00,
  'pendiente',
  'paypal',
  'Primer depósito para actualizar plan',
  NOW() - INTERVAL '2 days'
);

-- Depósito Aprobado (usuario pro)
INSERT INTO public.deposits (
  user_email,
  user_name,
  amount,
  status,
  method,
  notes,
  approved_at,
  created_at
) VALUES (
  'usuario.pro@ejemplo.com',
  'Usuario Pro',
  5000.00,
  'aprobado',
  'paypal',
  'Depósito aprobado',
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '3 days'
);

-- Depósito Rechazado (usuario gratuito)
INSERT INTO public.deposits (
  user_email,
  user_name,
  amount,
  status,
  method,
  notes,
  created_at
) VALUES (
  'usuario.gratuito@ejemplo.com',
  'Usuario Gratuito',
  500.00,
  'rechazado',
  'paypal',
  'Documentación insuficiente',
  NOW() - INTERVAL '5 days'
);

-- ============================================
-- INSERTAR INVERSIONES DE EJEMPLO
-- ============================================

-- Inversión Pendiente
INSERT INTO public.investments (
  user_email,
  user_name,
  amount,
  plan_at_time,
  return_percentage,
  status,
  description,
  created_at
) VALUES (
  'usuario.pro@ejemplo.com',
  'Usuario Pro',
  2000.00,
  'pro',
  5.5,
  'pendiente',
  'Inversión en fondo de bonos',
  NOW() - INTERVAL '1 day'
);

-- Inversión Aprobada
INSERT INTO public.investments (
  user_email,
  user_name,
  amount,
  plan_at_time,
  return_percentage,
  roi_amount,
  status,
  description,
  approved_at,
  created_at
) VALUES (
  'usuario.vip@ejemplo.com',
  'Usuario VIP',
  10000.00,
  'vip',
  8.0,
  800.00,
  'aprobado',
  'Inversión en cartera diversificada',
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '4 days'
);

-- Inversión Completada
INSERT INTO public.investments (
  user_email,
  user_name,
  amount,
  plan_at_time,
  return_percentage,
  roi_amount,
  status,
  description,
  approved_at,
  completed_at,
  created_at
) VALUES (
  'usuario.estandar@ejemplo.com',
  'Usuario Estándar',
  1000.00,
  'estandar',
  4.0,
  40.00,
  'completado',
  'Inversión completada con ganancias',
  NOW() - INTERVAL '10 days',
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '15 days'
);

-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Verificar usuarios
SELECT COUNT(*) as total_usuarios FROM public.users;
SELECT email, plan, balance, created_at FROM public.users ORDER BY created_at DESC;

-- Verificar depósitos
SELECT COUNT(*) as total_depositos FROM public.deposits;
SELECT user_email, amount, status, created_at FROM public.deposits ORDER BY created_at DESC;

-- Verificar inversiones
SELECT COUNT(*) as total_inversiones FROM public.investments;
SELECT user_email, amount, status, created_at FROM public.investments ORDER BY created_at DESC;

-- ============================================
-- ✅ DATOS DE PRUEBA INSERTADOS
-- ============================================
-- Contraseña de todos los usuarios de prueba: password123
-- Admin: exe.main.darwin@gmail.com
