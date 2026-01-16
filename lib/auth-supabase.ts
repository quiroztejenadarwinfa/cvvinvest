import { supabase } from "@/lib/supabase"

export interface User {
  id: string
  email: string
  name: string
  password_hash?: string
  plan: string
  balance: number
  profile_image_url?: string
  provider?: string
  provider_id?: string
  planChangedAt?: Date
  previousPlan?: string
  created_at: Date
  updated_at: Date
  is_active: boolean
}

// Sign Up
export async function signUpWithEmail(
  email: string,
  password: string,
  name: string
) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    })

    if (error) throw error

    // Crear registro en tabla users
    if (data.user) {
      const { error: insertError } = await supabase.from("users").insert({
        id: data.user.id,
        email: data.user.email,
        name: name,
        plan: "gratuito",
        balance: 0,
        is_active: true,
      })

      if (insertError) throw insertError
    }

    return { user: data.user, error: null }
  } catch (error: any) {
    return { user: null, error: error.message }
  }
}

// Sign In
export async function signInWithEmail(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    return { user: data.user, session: data.session, error: null }
  } catch (error: any) {
    return { user: null, session: null, error: error.message }
  }
}

// Get Current User
export async function getCurrentUser() {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) return null

    // Obtener datos adicionales de la tabla users
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single()

    if (userError) return null

    return userData as User
  } catch (error) {
    return null
  }
}

// Sign Out
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}

// Update User Profile
export async function updateUserProfile(
  userId: string,
  updates: Partial<User>
) {
  try {
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", userId)
      .select()
      .single()

    if (error) throw error

    return { user: data as User, error: null }
  } catch (error: any) {
    return { user: null, error: error.message }
  }
}

// Update Plan
export async function updateUserPlan(userId: string, newPlan: string) {
  try {
    const { data: currentUser } = await supabase
      .from("users")
      .select("plan")
      .eq("id", userId)
      .single()

    const { data, error } = await supabase
      .from("users")
      .update({
        plan: newPlan,
        previousPlan: currentUser?.plan,
        planChangedAt: new Date(),
      })
      .eq("id", userId)
      .select()
      .single()

    if (error) throw error

    return { user: data as User, error: null }
  } catch (error: any) {
    return { user: null, error: error.message }
  }
}

// Check if user exists
export async function getUserByEmail(email: string) {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single()

    if (error) return null
    return data as User
  } catch (error) {
    return null
  }
}

// Get session
export async function getSession() {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return session
  } catch (error) {
    return null
  }
}

// Listen to auth changes
export function onAuthStateChanged(
  callback: (user: User | null) => void
) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      const user = await getCurrentUser()
      callback(user)
    } else {
      callback(null)
    }
  })

  return subscription
}
