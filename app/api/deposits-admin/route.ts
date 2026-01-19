import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

// Usar service_role key para admin operations (ignora RLS)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
)

export async function GET(request: NextRequest) {
  try {
    console.log("🔐 API GET: Fetching all deposits with service_role")

    const { data, error } = await supabase
      .from("deposits")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("❌ API GET: Error fetching deposits:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("✅ API GET: Deposits fetched successfully:", data?.length)
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
