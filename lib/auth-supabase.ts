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

// Get all users (for admin)
export async function getAllUsersFromDB() {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase error loading users:", error)
      throw error
    }

    const users = (data || []) as User[]
    console.log(`✓ Loaded ${users.length} users from Supabase`)
    
    return { users, error: null }
  } catch (error: any) {
    console.error("Error in getAllUsersFromDB:", error.message)
    
    // Fallback to localStorage for testing
    try {
      if (typeof window !== "undefined") {
        const localUsers = localStorage.getItem("cvvinvest_users")
        if (localUsers) {
          const users = JSON.parse(localUsers) as User[]
          console.log(`⚠️ Using ${users.length} users from localStorage (Supabase unavailable)`)
          return { users, error: null }
        }
      }
    } catch (fallbackError) {
      console.error("Fallback to localStorage also failed:", fallbackError)
    }
    
    return { users: [], error: error.message }
  }
}

// Approve/Activate user
export async function approveUser(userId: string) {
  try {
    const { data, error } = await supabase
      .from("users")
      .update({ is_active: true })
      .eq("id", userId)
      .select()
      .single()

    if (error) throw error

    return { user: data as User, error: null }
  } catch (error: any) {
    return { user: null, error: error.message }
  }
}

// Deactivate user
export async function deactivateUser(userId: string) {
  try {
    const { data, error } = await supabase
      .from("users")
      .update({ is_active: false })
      .eq("id", userId)
      .select()
      .single()

    if (error) throw error

    return { user: data as User, error: null }
  } catch (error: any) {
    return { user: null, error: error.message }
  }
}

// Reset all user data (except admin) - Supabase
export async function resetAllUserDataSupabase(adminEmail: string) {
  try {
    // 1. Eliminar todos los usuarios EXCEPTO admin
    const { data: allUsers } = await supabase
      .from("users")
      .select("id, email")

    if (allUsers) {
      for (const user of allUsers) {
        if (user.email !== adminEmail) {
          // Eliminar usuario de tabla users
          await supabase
            .from("users")
            .delete()
            .eq("id", user.id)
        }
      }
    }

    // 2. Limpiar depósitos
    await supabase.from("deposits").delete().neq("id", "")

    // 3. Limpiar inversiones
    await supabase.from("investments").delete().neq("id", "")

    // 4. Limpiar sesiones de chat
    await supabase.from("chat_sessions").delete().neq("id", "")

    // 5. Limpiar mensajes de chat
    await supabase.from("chat_messages").delete().neq("id", "")

    // 6. Limpiar notificaciones
    await supabase.from("notifications").delete().neq("id", "")

    return { success: true, error: null }
  } catch (error: any) {
    return { success: false, error: error.message }
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
