import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

// Usar service_role key para admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, adminEmail } = body

    // Validación: solo admin
    if (adminEmail !== "exe.main.darwin@gmail.com") {
      return NextResponse.json(
        { error: "No autorizado - solo admin" },
        { status: 401 }
      )
    }

    if (action === "disable_rls") {
      console.log("🔓 Deshabilitando RLS en tabla 'users'...")

      // Ejecutar SQL directo para deshabilitar RLS
      const { error } = await supabase.rpc("exec_sql", {
        sql: "ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;",
      })

      if (error && error.message.includes("does not exist")) {
        console.log("⚠️ No se puede ejecutar SQL directamente, usando método alternativo...")
        // No podemos ejecutar SQL directo, pero el service_role ignora RLS de todas formas
        return NextResponse.json({
          success: true,
          message: "RLS debería estar deshabilitado para operaciones con service_role_key",
          info: "La inserción en /api/auth/register usa service_role_key que ignora RLS",
        })
      }

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: "RLS deshabilitado en tabla users",
      })
    }

    if (action === "check_rls") {
      console.log("📊 Verificando estado de RLS...")

      // Verificar si podemos leer usuarios
      const { data, error } = await supabase
        .from("users")
        .select("count", { count: "exact" })

      if (error) {
        return NextResponse.json({
          hasError: true,
          error: error.message,
          possibleRLS: true,
        })
      }

      return NextResponse.json({
        hasError: false,
        usersCount: data?.length || 0,
        possibleRLS: false,
      })
    }

    if (action === "insert_test_user") {
      console.log("🧪 Insertando usuario de prueba...")

      const testUser = {
        email: `test-${Date.now()}@ejemplo.com`,
        name: "Usuario Prueba",
        password_hash: "$2a$10$dummyhash",
        plan: "gratuito",
        balance: 0,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const { data, error } = await supabase
        .from("users")
        .insert([testUser])
        .select()

      if (error) {
        return NextResponse.json({
          success: false,
          error: error.message,
          code: error.code,
          details: error.details,
        })
      }

      return NextResponse.json({
        success: true,
        message: "Usuario de prueba insertado exitosamente",
        user: data?.[0],
      })
    }

    return NextResponse.json(
      { error: "Acción no válida" },
      { status: 400 }
    )
  } catch (error: any) {
    console.error("❌ Error en admin/rls:", error.message)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
