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
    const { deposit } = body

    if (!deposit) {
      return NextResponse.json(
        { error: "Depósito es requerido" },
        { status: 400 }
      )
    }

    console.log(`[API] Sincronizando depósito: ${deposit.id}`)

    // Verificar si el depósito ya existe en Supabase
    const { data: existingDeposit } = await supabase
      .from("deposits")
      .select("id")
      .eq("id", deposit.id)
      .single()

    if (existingDeposit) {
      console.log(`[API] Depósito ya existe en Supabase`)
      return NextResponse.json({
        success: true,
        message: "Depósito ya existe",
        data: existingDeposit,
      })
    }

    // Crear nuevo depósito en Supabase con mapeo correcto de campos
    const { data: newDeposit, error } = await supabase
      .from("deposits")
      .insert({
        id: deposit.id,
        user_id: deposit.userId,
        user_email: deposit.userEmail,
        user_name: deposit.userName,
        amount: deposit.amount,
        status: deposit.status || "pendiente",
        method: deposit.method,
        created_at: deposit.createdAt,
      })
      .select()
      .single()

    if (error) {
      console.error(`[API] Error creando depósito en Supabase:`, error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    console.log(`[API] ✅ Depósito sincronizado exitosamente: ${deposit.id}`)

    return NextResponse.json({
      success: true,
      message: "Depósito sincronizado",
      data: newDeposit,
    })
  } catch (error: any) {
    console.error(`[API] Exception:`, error.message)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
