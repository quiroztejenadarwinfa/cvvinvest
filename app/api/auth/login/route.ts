import { signInWithEmail } from "@/lib/auth-supabase"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing email or password" },
        { status: 400 }
      )
    }

    const { user, session, error } = await signInWithEmail(email, password)

    if (error) {
      return NextResponse.json({ error }, { status: 401 })
    }

    return NextResponse.json({ user, session, success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
