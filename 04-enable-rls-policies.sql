-- ========== HABILITAR RLS EN TABLAS PÚBLICAS ==========
-- Este script habilita Row Level Security sin romper funcionamiento existente
-- Permite: usuarios vean sus datos, admin vea todos

-- ========== 1. TABLA USERS ==========
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Usuarios ven sus propios datos
CREATE POLICY "Users can see own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id::uuid);

-- Admin ve todos los usuarios (email = admin)
CREATE POLICY "Admin sees all users"
  ON public.users FOR SELECT
  USING (
    auth.jwt() ->> 'email' = 'exe.main.darwin@gmail.com'
  );

-- Usuarios actualizan solo sus datos
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id::uuid);

-- Admin actualiza todos
CREATE POLICY "Admin updates any user"
  ON public.users FOR UPDATE
  USING (
    auth.jwt() ->> 'email' = 'exe.main.darwin@gmail.com'
  );

-- Admin inserta usuarios
CREATE POLICY "Admin inserts users"
  ON public.users FOR INSERT
  WITH CHECK (
    auth.jwt() ->> 'email' = 'exe.main.darwin@gmail.com'
  );

-- Admin elimina usuarios
CREATE POLICY "Admin deletes users"
  ON public.users FOR DELETE
  USING (
    auth.jwt() ->> 'email' = 'exe.main.darwin@gmail.com'
  );

-- ========== 2. TABLA DEPOSITS ==========
ALTER TABLE public.deposits ENABLE ROW LEVEL SECURITY;

-- Usuarios ven sus propios depósitos
CREATE POLICY "Users see own deposits"
  ON public.deposits FOR SELECT
  USING (auth.uid() = user_id::uuid);

-- Admin ve todos los depósitos
CREATE POLICY "Admin sees all deposits"
  ON public.deposits FOR SELECT
  USING (
    auth.jwt() ->> 'email' = 'exe.main.darwin@gmail.com'
  );

-- Usuarios crean sus depósitos
CREATE POLICY "Users create own deposits"
  ON public.deposits FOR INSERT
  WITH CHECK (auth.uid() = user_id::uuid);

-- Admin actualiza depósitos
CREATE POLICY "Admin updates deposits"
  ON public.deposits FOR UPDATE
  USING (
    auth.jwt() ->> 'email' = 'exe.main.darwin@gmail.com'
  );

-- ========== 3. TABLA INVESTMENTS ==========
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;

-- Usuarios ven sus inversiones
CREATE POLICY "Users see own investments"
  ON public.investments FOR SELECT
  USING (auth.uid() = user_id::uuid);

-- Admin ve todas las inversiones
CREATE POLICY "Admin sees all investments"
  ON public.investments FOR SELECT
  USING (
    auth.jwt() ->> 'email' = 'exe.main.darwin@gmail.com'
  );

-- Usuarios crean sus inversiones
CREATE POLICY "Users create own investments"
  ON public.investments FOR INSERT
  WITH CHECK (auth.uid() = user_id::uuid);

-- Admin actualiza inversiones
CREATE POLICY "Admin updates investments"
  ON public.investments FOR UPDATE
  USING (
    auth.jwt() ->> 'email' = 'exe.main.darwin@gmail.com'
  );

-- ========== 4. TABLA WITHDRAWALS ==========
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;

-- Usuarios ven sus retiros
CREATE POLICY "Users see own withdrawals"
  ON public.withdrawals FOR SELECT
  USING (auth.uid() = user_id::uuid);

-- Admin ve todos los retiros
CREATE POLICY "Admin sees all withdrawals"
  ON public.withdrawals FOR SELECT
  USING (
    auth.jwt() ->> 'email' = 'exe.main.darwin@gmail.com'
  );

-- Usuarios crean sus retiros
CREATE POLICY "Users create own withdrawals"
  ON public.withdrawals FOR INSERT
  WITH CHECK (auth.uid() = user_id::uuid);

-- Admin actualiza retiros
CREATE POLICY "Admin updates withdrawals"
  ON public.withdrawals FOR UPDATE
  USING (
    auth.jwt() ->> 'email' = 'exe.main.darwin@gmail.com'
  );

-- ========== 5. TABLA NOTIFICATIONS ==========
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Usuarios ven sus notificaciones
CREATE POLICY "Users see own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id::uuid);

-- Admin ve todas las notificaciones
CREATE POLICY "Admin sees all notifications"
  ON public.notifications FOR SELECT
  USING (
    auth.jwt() ->> 'email' = 'exe.main.darwin@gmail.com'
  );

-- Usuarios crean sus notificaciones
CREATE POLICY "Users create own notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (auth.uid() = user_id::uuid);

-- Admin crea notificaciones
CREATE POLICY "Admin creates notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (
    auth.jwt() ->> 'email' = 'exe.main.darwin@gmail.com'
  );

-- Usuarios actualizan sus notificaciones
CREATE POLICY "Users update own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id::uuid);

-- Admin actualiza notificaciones
CREATE POLICY "Admin updates notifications"
  ON public.notifications FOR UPDATE
  USING (
    auth.jwt() ->> 'email' = 'exe.main.darwin@gmail.com'
  );

-- ========== RESUMEN ==========
-- ✅ RLS habilitado en 5 tablas
-- ✅ Usuarios ven/editan solo sus datos
-- ✅ Admin (exe.main.darwin@gmail.com) ve/edita todo
-- ✅ Sin afectar código existente (usa auth.uid() y jwt)
-- ✅ Compatible con aplicación actual
