-- ✅ SCRIPT DE RLS PARA PRODUCCIÓN
-- ⚠️ EJECUTA ESTO SOLO DESPUÉS QUE LA BD ESTÉ FUNCIONANDO EN DESARROLLO
-- Este script habilita seguridad de nivel de fila

-- ============================================
-- HABILITAR RLS EN TODAS LAS TABLAS
-- ============================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS PARA TABLA USERS
-- ============================================

-- Policy 1: Admin puede ver y actualizar todos los usuarios
CREATE POLICY "admin_can_manage_users" ON public.users
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users u2
      WHERE u2.email = 'exe.main.darwin@gmail.com'
      AND auth.uid() = u2.id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users u2
      WHERE u2.email = 'exe.main.darwin@gmail.com'
      AND auth.uid() = u2.id
    )
  );

-- Policy 2: Usuarios autenticados pueden ver su propio perfil
CREATE POLICY "users_can_view_own_profile" ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Policy 3: Usuarios autenticados pueden actualizar su propio perfil
CREATE POLICY "users_can_update_own_profile" ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================
-- POLÍTICAS PARA TABLA INVESTMENTS
-- ============================================

-- Policy 1: Usuarios pueden ver sus propias inversiones
CREATE POLICY "users_can_view_own_investments" ON public.investments
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy 2: Usuarios pueden crear inversiones
CREATE POLICY "users_can_create_investments" ON public.investments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy 3: Admin puede ver y actualizar todas las inversiones
CREATE POLICY "admin_can_manage_investments" ON public.investments
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.email = 'exe.main.darwin@gmail.com'
      AND auth.uid() = u.id
    )
  );

-- ============================================
-- POLÍTICAS PARA TABLA DEPOSITS
-- ============================================

-- Policy 1: Usuarios pueden ver sus propios depósitos
CREATE POLICY "users_can_view_own_deposits" ON public.deposits
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy 2: Usuarios pueden crear depósitos
CREATE POLICY "users_can_create_deposits" ON public.deposits
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy 3: Admin puede ver y actualizar todos los depósitos
CREATE POLICY "admin_can_manage_deposits" ON public.deposits
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.email = 'exe.main.darwin@gmail.com'
      AND auth.uid() = u.id
    )
  );

-- ============================================
-- POLÍTICAS PARA TABLA CHAT_SESSIONS
-- ============================================

-- Policy 1: Usuarios pueden ver sus sesiones de chat
CREATE POLICY "users_can_view_own_chat_sessions" ON public.chat_sessions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy 2: Usuarios pueden crear sesiones de chat
CREATE POLICY "users_can_create_chat_sessions" ON public.chat_sessions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy 3: Admin puede ver todas las sesiones
CREATE POLICY "admin_can_view_chat_sessions" ON public.chat_sessions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.email = 'exe.main.darwin@gmail.com'
      AND auth.uid() = u.id
    )
  );

-- ============================================
-- POLÍTICAS PARA TABLA CHAT_MESSAGES
-- ============================================

-- Policy 1: Usuarios y admin pueden ver mensajes de sesiones autorizadas
CREATE POLICY "users_can_view_chat_messages" ON public.chat_messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.chat_sessions cs
      WHERE cs.id = session_id
      AND (
        auth.uid() = cs.user_id
        OR EXISTS (
          SELECT 1 FROM public.users u
          WHERE u.email = 'exe.main.darwin@gmail.com'
          AND auth.uid() = u.id
        )
      )
    )
  );

-- Policy 2: Usuarios pueden crear mensajes en sus sesiones
CREATE POLICY "users_can_create_chat_messages" ON public.chat_messages
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.chat_sessions cs
      WHERE cs.id = session_id
      AND auth.uid() = cs.user_id
    )
  );

-- ============================================
-- POLÍTICAS PARA TABLA NOTIFICATIONS
-- ============================================

-- Policy 1: Usuarios pueden ver sus notificaciones
CREATE POLICY "users_can_view_own_notifications" ON public.notifications
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy 2: Sistema puede crear notificaciones para usuarios
CREATE POLICY "system_can_create_notifications" ON public.notifications
  FOR INSERT
  WITH CHECK (true);

-- Policy 3: Usuarios pueden actualizar (marcar como leída)
CREATE POLICY "users_can_update_notifications" ON public.notifications
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- ✅ RLS HABILITADO PARA PRODUCCIÓN
-- ============================================
-- Todas las tablas ahora tienen protección de nivel de fila
-- Solo usuarios autenticados pueden acceder a sus datos
-- Admin (exe.main.darwin@gmail.com) puede gestionar todo
