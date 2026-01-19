import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

// Usar service_role key para admin operations (ignora RLS)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
)

export async function GET(request: NextRequest) {
  try {
    console.log("🔐 API GET: Fetching all users with service_role")

    const { data, error } = await supabase
      .from("users")
      .select("id, email, name, plan, balance, is_active, created_at")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("❌ API GET: Error fetching users:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("✅ API GET: Users fetched successfully:", data?.length)
    return NextResponse.json({
      success: true,
      count: data?.length || 0,
      data: data || [],
    })
  } catch (error: any) {
    console.error("❌ API GET: Exception:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, name, password, plan } = await request.json()

    console.log("🔐 API POST: Creating user:", email)

    // Validar que no exista
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single()

    if (existing) {
      console.log("⚠️ API POST: Email ya registrado:", email)
      return NextResponse.json(
        { success: false, error: "Email ya registrado" },
        { status: 409 }
      )
    }

    // Insertar usuario
    const { data, error } = await supabase
      .from("users")
      .insert({
        email,
        name,
        password_hash: password,
        plan: plan || "gratuito",
        balance: 0,
        is_active: true,
      })
      .select()

    if (error) {
      console.error("❌ API POST: Error creating user:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("✅ API POST: User created:", email)
    return NextResponse.json(
      {
        success: true,
        message: "Usuario creado",
        data: data?.[0],
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("❌ API POST: Exception:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
