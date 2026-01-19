import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

// Usar service_role key que ignora RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, email, name, plan, balance } = body

    console.log("📝 [register] Request body:", { userId, email, name, plan })

    if (!userId || !email) {
      console.error("❌ [register] Missing userId or email")
      return NextResponse.json(
        { error: "userId and email are required" },
        { status: 400 }
      )
    }

    // Validar que userId es un UUID válido
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(userId)) {
      console.error("❌ [register] Invalid UUID format:", userId)
      return NextResponse.json(
        { error: "Invalid userId format (must be UUID)" },
        { status: 400 }
      )
    }

    console.log("✅ [register] UUID is valid, creating user profile...")

    const dummyHash = '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DvJ32e'

    // Intentar insertar
    const { data, error } = await supabase
      .from("users")
      .insert({
        id: userId,
        email,
        name: name || email.split("@")[0],
        password_hash: dummyHash,
        plan: plan || "gratuito",
        balance: parseFloat(String(balance)) || 0,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select("*")

    if (error) {
      console.error("❌ [register] Supabase insert error:")
      console.error("   Code:", error.code)
      console.error("   Message:", error.message)
      console.error("   Details:", error.details)
      console.error("   Hint:", error.hint)

      // Si es duplicado, obtener el usuario existente
      if (error.code === "23505" || error.message.includes("duplicate") || error.message.includes("unique")) {
        console.log("ℹ️ [register] Duplicate detected, searching for existing user...")
        
        // Primero intentar por email
        const { data: existingByEmail } = await supabase
          .from("users")
          .select("*")
          .eq("email", email)
          .single()

        if (existingByEmail) {
          console.log("✅ [register] Found user by email, returning...")
          return NextResponse.json(existingByEmail)
        }

        // Si no por email, intentar por ID
        const { data: existingById } = await supabase
          .from("users")
          .select("*")
          .eq("id", userId)
          .single()

        if (existingById) {
          console.log("✅ [register] Found user by ID, returning...")
          return NextResponse.json(existingById)
        }

        console.error("❌ Duplicate detected but could not find user")
      }

      return NextResponse.json(
        { error: `Failed to create user: ${error.message}` },
        { status: 500 }
      )
    }

    if (!data || data.length === 0) {
      console.error("❌ [register] No data returned")
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      )
    }

    console.log("✅ [register] User created:", data[0].email)
    return NextResponse.json(data[0])

  } catch (error: any) {
    console.error("❌ [register] Exception:")
    console.error("   Message:", error.message)
    console.error("   Stack:", error.stack)
    
    return NextResponse.json(
      { error: `Server error: ${error.message}` },
      { status: 500 }
    )
  }
}
