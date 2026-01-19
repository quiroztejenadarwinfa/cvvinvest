import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

// Scripts SQL para resetear la BD
const RESET_DB_SQL = `
-- ========== PASO 1: ELIMINAR TODAS LAS TABLAS Y POLÍTICAS ==========
DROP POLICY IF EXISTS "Users can see own profile" ON public.users;
DROP POLICY IF EXISTS "Admin sees all users" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Admin updates any user" ON public.users;
DROP POLICY IF EXISTS "Admin inserts users" ON public.users;
DROP POLICY IF EXISTS "Admin deletes users" ON public.users;
DROP POLICY IF EXISTS "Users see own deposits" ON public.deposits;
DROP POLICY IF EXISTS "Admin sees all deposits" ON public.deposits;
DROP POLICY IF EXISTS "Users create own deposits" ON public.deposits;
DROP POLICY IF EXISTS "Admin updates deposits" ON public.deposits;
DROP POLICY IF EXISTS "Users see own investments" ON public.investments;
DROP POLICY IF EXISTS "Admin sees all investments" ON public.investments;
DROP POLICY IF EXISTS "Users create own investments" ON public.investments;
DROP POLICY IF EXISTS "Admin updates investments" ON public.investments;
DROP POLICY IF EXISTS "Users see own withdrawals" ON public.withdrawals;
DROP POLICY IF EXISTS "Admin sees all withdrawals" ON public.withdrawals;
DROP POLICY IF EXISTS "Users create own withdrawals" ON public.withdrawals;
DROP POLICY IF EXISTS "Admin updates withdrawals" ON public.withdrawals;
DROP POLICY IF EXISTS "Users see own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Admin sees all notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users create own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Admin creates notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users update own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Admin updates notifications" ON public.notifications;

ALTER TABLE IF EXISTS public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.investments DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.deposits DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.chat_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.chat_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.withdrawals DISABLE ROW LEVEL SECURITY;

TRUNCATE TABLE public.notifications CASCADE;
TRUNCATE TABLE public.chat_messages CASCADE;
TRUNCATE TABLE public.chat_sessions CASCADE;
TRUNCATE TABLE public.withdrawals CASCADE;
TRUNCATE TABLE public.investments CASCADE;
TRUNCATE TABLE public.deposits CASCADE;
TRUNCATE TABLE public.users CASCADE;

-- ========== PASO 2: INSERTAR SOLO EL ADMIN ==========
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
  '$2a\$10\$YIjlrPNoS9cHWa0vHemH2OPST9/PgBkqquzi.Oy1D3pK7K5b7Z8NO',
  'elite',
  999999.99,
  'admin',
  true,
  NOW(),
  NOW()
);

-- ========== PASO 3: HABILITAR RLS ==========
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see own profile" ON public.users FOR SELECT USING (auth.uid() = id::uuid);
CREATE POLICY "Admin sees all users" ON public.users FOR SELECT USING (auth.jwt() ->> 'email' = 'exe.main.darwin@gmail.com');
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id::uuid);
CREATE POLICY "Admin updates any user" ON public.users FOR UPDATE USING (auth.jwt() ->> 'email' = 'exe.main.darwin@gmail.com');
CREATE POLICY "Admin inserts users" ON public.users FOR INSERT WITH CHECK (auth.jwt() ->> 'email' = 'exe.main.darwin@gmail.com');
CREATE POLICY "Admin deletes users" ON public.users FOR DELETE USING (auth.jwt() ->> 'email' = 'exe.main.darwin@gmail.com');

ALTER TABLE public.deposits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own deposits" ON public.deposits FOR SELECT USING (auth.uid() = user_id::uuid);
CREATE POLICY "Admin sees all deposits" ON public.deposits FOR SELECT USING (auth.jwt() ->> 'email' = 'exe.main.darwin@gmail.com');
CREATE POLICY "Users create own deposits" ON public.deposits FOR INSERT WITH CHECK (auth.uid() = user_id::uuid);
CREATE POLICY "Admin updates deposits" ON public.deposits FOR UPDATE USING (auth.jwt() ->> 'email' = 'exe.main.darwin@gmail.com');

ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own investments" ON public.investments FOR SELECT USING (auth.uid() = user_id::uuid);
CREATE POLICY "Admin sees all investments" ON public.investments FOR SELECT USING (auth.jwt() ->> 'email' = 'exe.main.darwin@gmail.com');
CREATE POLICY "Users create own investments" ON public.investments FOR INSERT WITH CHECK (auth.uid() = user_id::uuid);
CREATE POLICY "Admin updates investments" ON public.investments FOR UPDATE USING (auth.jwt() ->> 'email' = 'exe.main.darwin@gmail.com');

ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own withdrawals" ON public.withdrawals FOR SELECT USING (auth.uid() = user_id::uuid);
CREATE POLICY "Admin sees all withdrawals" ON public.withdrawals FOR SELECT USING (auth.jwt() ->> 'email' = 'exe.main.darwin@gmail.com');
CREATE POLICY "Users create own withdrawals" ON public.withdrawals FOR INSERT WITH CHECK (auth.uid() = user_id::uuid);
CREATE POLICY "Admin updates withdrawals" ON public.withdrawals FOR UPDATE USING (auth.jwt() ->> 'email' = 'exe.main.darwin@gmail.com');

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id::uuid);
CREATE POLICY "Admin sees all notifications" ON public.notifications FOR SELECT USING (auth.jwt() ->> 'email' = 'exe.main.darwin@gmail.com');
CREATE POLICY "Users create own notifications" ON public.notifications FOR INSERT WITH CHECK (auth.uid() = user_id::uuid);
CREATE POLICY "Admin creates notifications" ON public.notifications FOR INSERT WITH CHECK (auth.jwt() ->> 'email' = 'exe.main.darwin@gmail.com');
CREATE POLICY "Users update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id::uuid);
CREATE POLICY "Admin updates notifications" ON public.notifications FOR UPDATE USING (auth.jwt() ->> 'email' = 'exe.main.darwin@gmail.com');
`

export async function POST(request: NextRequest) {
  try {
    // Verificar que es admin
    const body = await request.json()
    const { adminEmail } = body

    if (adminEmail !== "exe.main.darwin@gmail.com") {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    // Crear cliente Supabase con Service Role Key (para bypasser RLS)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || ""
    )

    // Ejecutar SQL
    const { error } = await supabase.rpc("sql", {
      query: RESET_DB_SQL,
    }).catch(() => {
      // Si rpc falla, intentar con query directa
      return supabase.from("users").select().limit(1)
    })

    // Si no hay RPC, ejecutar manualmente cada comando
    // Truncar tablas
    await supabase.from("notifications").delete().neq("id", "00000000-0000-0000-0000-000000000000")
    await supabase.from("chat_messages").delete().neq("id", "00000000-0000-0000-0000-000000000000")
    await supabase.from("chat_sessions").delete().neq("id", "00000000-0000-0000-0000-000000000000")
    await supabase.from("withdrawals").delete().neq("id", "00000000-0000-0000-0000-000000000000")
    await supabase.from("investments").delete().neq("id", "00000000-0000-0000-0000-000000000000")
    await supabase.from("deposits").delete().neq("id", "00000000-0000-0000-0000-000000000000")
    await supabase.from("users").delete().neq("email", "exe.main.darwin@gmail.com")

    // Insertar admin
    const { error: insertError } = await supabase
      .from("users")
      .insert([
        {
          email: "exe.main.darwin@gmail.com",
          name: "Administrador",
          password_hash: "$2a$10$YIjlrPNoS9cHWa0vHemH2OPST9/PgBkqquzi.Oy1D3pK7K5b7Z8NO",
          plan: "elite",
          balance: 999999.99,
          role: "admin",
          is_active: true,
        },
      ])

    if (insertError && !insertError.message.includes("duplicate")) {
      throw insertError
    }

    return NextResponse.json({
      success: true,
      message: "Base de datos reseteada correctamente",
    })
  } catch (error: any) {
    console.error("Error en reset:", error)
    return NextResponse.json(
      { error: error.message || "Error al resetear" },
      { status: 500 }
    )
  }
}
