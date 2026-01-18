import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

// Usar service_role key que ignora RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("id")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    console.log("🔐 API GET: Fetching user:", userId)

    // Usar select(*) sin single() para mejor manejo de errores
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)

    if (error) {
      console.error("❌ API GET: Error fetching user:", error.message, error.details)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Si no hay datos, retornar 404
    if (!data || data.length === 0) {
      console.log("⚠️ API GET: User not found, will need to create")
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    console.log("✅ API GET: User fetched successfully:", data[0].email)
    return NextResponse.json(data[0])
  } catch (error: any) {
    console.error("❌ API GET: Exception:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, email, name, plan, balance, is_active } = body

    console.log("🔐 API POST: Request body:", { id, email, name, plan, balance, is_active })

    if (!id || !email) {
      return NextResponse.json(
        { error: "ID and email required" },
        { status: 400 }
      )
    }

    console.log("🔐 API POST: Creating user:", email)

    const { data, error } = await supabase
      .from("users")
      .insert({
        id,
        email,
        name: name || email.split("@")[0],
        plan: plan || "gratuito",
        balance: parseFloat(String(balance)) || 0,
        is_active: is_active !== false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select("*")

    if (error) {
      console.error("❌ API POST: Error creating user:", error.code, error.message, error.details, error.hint)
      
      // Si es un conflicto (usuario ya existe), intentar obtenerlo
      if (error.code === "23505" || error.message.includes("duplicate") || error.message.includes("Duplicate key")) {
        console.log("ℹ️ API POST: User already exists, fetching existing user...")
        const { data: existingUser, error: fetchError } = await supabase
          .from("users")
          .select("*")
          .eq("id", id)

        if (fetchError) {
          console.error("❌ Could not fetch existing user:", fetchError)
          return NextResponse.json({ error: "Could not fetch user" }, { status: 500 })
        }

        if (existingUser && existingUser.length > 0) {
          console.log("✅ API POST: Returning existing user:", existingUser[0].email)
          return NextResponse.json(existingUser[0])
        }

        return NextResponse.json({ error: "User exists but could not fetch" }, { status: 500 })
      }

      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data || data.length === 0) {
      console.error("❌ API POST: No data returned after insert")
      return NextResponse.json({ error: "Could not create user" }, { status: 500 })
    }

    console.log("✅ API POST: User created successfully:", data[0].email)
    return NextResponse.json(data[0])
  } catch (error: any) {
    console.error("❌ API POST: Exception:", error.message, error.stack)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
