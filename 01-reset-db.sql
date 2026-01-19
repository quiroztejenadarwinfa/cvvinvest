-- ✅ SCRIPT COMPLETO DE RECREACIÓN DE BASE DE DATOS
-- Ejecuta TODO esto en Supabase > SQL Editor
-- Este script elimina TODAS las tablas y las recrea desde cero

-- ============================================
-- PASO 1: ELIMINAR TODAS LAS TABLAS Y POLÍTICAS
-- ============================================

-- Desactivar todas las RLS policies primero
DROP POLICY IF EXISTS "allow_authenticated_read_users" ON public.users;
DROP POLICY IF EXISTS "allow_admin_update_users" ON public.users;
DROP POLICY IF EXISTS "allow_authenticated_read_investments" ON public.investments;
DROP POLICY IF EXISTS "allow_authenticated_read_deposits" ON public.deposits;
DROP POLICY IF EXISTS "allow_authenticated_read_notifications" ON public.notifications;
DROP POLICY IF EXISTS "allow_authenticated_read_chat_sessions" ON public.chat_sessions;

-- Deshabilitar RLS en todas las tablas
ALTER TABLE IF EXISTS public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.investments DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.deposits DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.chat_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.chat_messages DISABLE ROW LEVEL SECURITY;

-- Eliminar todas las tablas
DROP TABLE IF EXISTS public.chat_messages CASCADE;
DROP TABLE IF EXISTS public.chat_sessions CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.deposits CASCADE;
DROP TABLE IF EXISTS public.investments CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- ============================================
-- PASO 2: CREAR TABLA USERS
-- ============================================

CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  plan TEXT DEFAULT 'gratuito' CHECK (plan IN ('gratuito', 'estandar', 'pro', 'vip', 'elite')),
  balance DECIMAL(15, 2) DEFAULT 0 CHECK (balance >= 0),
  profile_image_url TEXT,
  provider TEXT,
  provider_id TEXT,
  plan_changed_at TIMESTAMPTZ,
  previous_plan TEXT,
  is_active BOOLEAN DEFAULT true,
  two_factor_enabled BOOLEAN DEFAULT false,
  two_factor_pin TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear índices
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_plan ON public.users(plan);
CREATE INDEX idx_users_created_at ON public.users(created_at);

-- ============================================
-- PASO 3: CREAR TABLA INVESTMENTS
-- ============================================

CREATE TABLE public.investments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
  plan_at_time TEXT NOT NULL CHECK (plan_at_time IN ('gratuito', 'estandar', 'pro', 'vip', 'elite')),
  return_percentage DECIMAL(5, 2) DEFAULT 0,
  roi_amount DECIMAL(15, 2) DEFAULT 0,
  status TEXT DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'aprobado', 'rechazado', 'completado')),
  description TEXT,
  approved_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear índices
CREATE INDEX idx_investments_user_id ON public.investments(user_id);
CREATE INDEX idx_investments_status ON public.investments(status);
CREATE INDEX idx_investments_created_at ON public.investments(created_at);

-- ============================================
-- PASO 4: CREAR TABLA DEPOSITS
-- ============================================

CREATE TABLE public.deposits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
  status TEXT DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'aprobado', 'rechazado')),
  method TEXT DEFAULT 'paypal',
  reference_number TEXT,
  notes TEXT,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear índices
CREATE INDEX idx_deposits_user_id ON public.deposits(user_id);
CREATE INDEX idx_deposits_status ON public.deposits(status);
CREATE INDEX idx_deposits_created_at ON public.deposits(created_at);

-- ============================================
-- PASO 5: CREAR TABLA CHAT_SESSIONS
-- ============================================

CREATE TABLE public.chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'pending', 'resolved')),
  archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear índices
CREATE INDEX idx_chat_sessions_user_id ON public.chat_sessions(user_id);
CREATE INDEX idx_chat_sessions_status ON public.chat_sessions(status);
CREATE INDEX idx_chat_sessions_created_at ON public.chat_sessions(created_at);

-- ============================================
-- PASO 6: CREAR TABLA CHAT_MESSAGES
-- ============================================

CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'admin')),
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear índices
CREATE INDEX idx_chat_messages_session_id ON public.chat_messages(session_id);
CREATE INDEX idx_chat_messages_sender ON public.chat_messages(sender);
CREATE INDEX idx_chat_messages_created_at ON public.chat_messages(created_at);

-- ============================================
-- PASO 7: CREAR TABLA NOTIFICATIONS
-- ============================================

CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK (type IN ('info', 'success', 'warning', 'error')),
  read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear índices
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at);

-- ============================================
-- PASO 8: DESHABILITAR RLS PARA DESARROLLO
-- ============================================
-- ⚠️ IMPORTANTE: En producción, reemplaza esto con políticas seguras

ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.investments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.deposits DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;

-- ============================================
-- PASO 9: CREAR TRIGGER PARA ACTUALIZAR updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar triggers a todas las tablas
CREATE TRIGGER users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER investments_updated_at BEFORE UPDATE ON public.investments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER deposits_updated_at BEFORE UPDATE ON public.deposits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER chat_sessions_updated_at BEFORE UPDATE ON public.chat_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- PASO 10: INSERTAR SOLO EL ADMIN (INICIO LIMPIO)
-- ============================================

INSERT INTO public.users (
  id,
  email,
  name,
  password_hash,
  plan,
  balance,
  role,
  is_active,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'exe.main.darwin@gmail.com',
  'Administrador',
  '$2a$10$YIjlrPNoS9cHWa0vHemH2OPST9/PgBkqquzi.Oy1D3pK7K5b7Z8NO', -- admin12345 (bcrypt hash)
  'elite',
  999999.99,
  'admin',
  true,
  NOW(),
  NOW()
);

-- ============================================
-- ✅ SCRIPT COMPLETADO
-- ============================================
-- ✅ Base de datos recreada desde cero
-- ✅ Solo existe el admin: exe.main.darwin@gmail.com / admin12345
-- ✅ Admin tiene plan ELITE y balance de $999,999.99
-- ✅ Listo para comenzar
