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

    console.log(`[API Sync] Sincronizando depósito: ${deposit.id}`)
    console.log('[API Sync] Datos del depósito:', deposit)

    // Verificar si el depósito ya existe en Supabase
    const { data: existingDeposit, error: checkError } = await supabase
      .from("deposits")
      .select("id")
      .eq("id", deposit.id)
      .single()

    if (existingDeposit) {
      console.log(`[API Sync] Depósito ya existe en Supabase`)
      return NextResponse.json({
        success: true,
        message: "Depósito ya existe",
        data: existingDeposit,
      })
    }

    // Crear nuevo depósito en Supabase con los campos correctos de la tabla
    console.log('[API Sync] Insertando nuevo depósito con datos:', {
      id: deposit.id,
      user_id: deposit.userId,
      email: deposit.userEmail,
      name: deposit.userName,
      amount: deposit.amount,
      status: deposit.status || "pendiente",
      // Agregar method y created_at si existen en la tabla
      method: deposit.method,
      created_at: deposit.createdAt,
    })

    const { data: newDeposit, error } = await supabase
      .from("deposits")
      .insert({
        id: deposit.id,
        user_id: deposit.userId,
        email: deposit.userEmail,
        name: deposit.userName,
        amount: deposit.amount,
        status: deposit.status || "pendiente",
        method: deposit.method,
        created_at: deposit.createdAt,
      })
      .select()
      .single()

    if (error) {
      console.error(`[API Sync] Error creando depósito en Supabase:`, error)
      console.error('[API Sync] Error message:', error.message)
      console.error('[API Sync] Error details:', error.details)
      return NextResponse.json(
        { error: error.message, details: error.details },
        { status: 500 }
      )
    }

    console.log(`[API Sync] ✅ Depósito sincronizado exitosamente: ${deposit.id}`)

    return NextResponse.json({
      success: true,
      message: "Depósito sincronizado",
      data: newDeposit,
    })
  } catch (error: any) {
    console.error(`[API Sync] Exception:`, error.message)
    console.error('[API Sync] Error stack:', error.stack)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
