import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

// Usar service_role key para admin operations (ignora RLS)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
)

export async function GET(request: NextRequest) {
  try {
    console.log("🔐 API GET: Fetching deposit statistics")

    // Obtener todos los depósitos
    const { data: deposits, error: depositsError } = await supabase
      .from("deposits")
      .select("*")

    if (depositsError) {
      console.error("❌ Error fetching deposits:", depositsError)
      return NextResponse.json(
        { error: depositsError.message },
        { status: 500 }
      )
    }

    // Calcular estadísticas
    const stats = {
      totalDeposits: deposits?.length || 0,
      totalAmount: deposits?.reduce((sum: number, d: any) => sum + (d.amount || 0), 0) || 0,
      pendingCount: deposits?.filter((d: any) => d.status === "pendiente").length || 0,
      pendingAmount: deposits
        ?.filter((d: any) => d.status === "pendiente")
        .reduce((sum: number, d: any) => sum + (d.amount || 0), 0) || 0,
      approvedCount: deposits?.filter((d: any) => d.status === "aprobado").length || 0,
      approvedAmount: deposits
        ?.filter((d: any) => d.status === "aprobado")
        .reduce((sum: number, d: any) => sum + (d.amount || 0), 0) || 0,
      rejectedCount: deposits?.filter((d: any) => d.status === "rechazado").length || 0,
    }

    console.log("✅ Deposit statistics fetched successfully:", stats)

    return NextResponse.json({
      success: true,
      stats: stats,
      deposits: deposits || [],
    })
  } catch (error: any) {
    console.error("❌ Exception:", error.message)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
