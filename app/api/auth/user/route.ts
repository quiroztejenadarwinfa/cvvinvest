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

    console.log("🔐 API: Fetching user:", userId)

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single()

    if (error) {
      console.error("❌ API: Error fetching user:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("✅ API: User fetched successfully")
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("❌ API: Exception:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, email, name, plan, balance, is_active } = body

    if (!id || !email) {
      return NextResponse.json(
        { error: "ID and email required" },
        { status: 400 }
      )
    }

    console.log("🔐 API: Creating user:", email)

    const { data, error } = await supabase
      .from("users")
      .insert({
        id,
        email,
        name: name || email.split("@")[0],
        plan: plan || "gratuito",
        balance: balance || 0,
        is_active: is_active !== false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("❌ API: Error creating user:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("✅ API: User created successfully")
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("❌ API: Exception:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
