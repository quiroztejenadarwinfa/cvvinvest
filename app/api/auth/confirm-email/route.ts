import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

// Usar service_role key para confirmar emails (requiere permisos de admin)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    console.log("🔐 API: Confirming email for user:", userId)

    // Usar updateUserById para confirmar el email (marcar como email_confirmed_at)
    const { data, error } = await supabase.auth.admin.updateUserById(userId, {
      email_confirm: true,
    })

    if (error) {
      console.error("❌ API: Error confirming email:", error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("✅ API: Email confirmed for user:", userId)
    return NextResponse.json({ success: true, user: data.user })
  } catch (error: any) {
    console.error("❌ API: Exception confirming email:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
