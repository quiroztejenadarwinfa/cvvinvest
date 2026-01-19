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
    console.log("📝 Starting signup for:", email)
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    })

    if (error) {
      console.error("❌ Auth signup error:", error)
      throw error
    }

    console.log("✅ Auth user created:", data.user?.id)

    // Crear registro en tabla users via API route (con service_role, no sujeto a RLS)
    if (data.user) {
      console.log("📊 Creating user record via API...")
      try {
        const response = await fetch("/api/auth/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: data.user.id,
            email: data.user.email,
            name: name,
            plan: "gratuito",
            balance: 0,
            is_active: true,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to create user record")
        }

        const createdUser = await response.json()
        console.log("✅ User record created via API:", createdUser.email)
      } catch (apiError: any) {
        console.error("❌ Error creating user record via API:", apiError.message)
        throw apiError
      }
    }

    return { user: data.user, error: null }
  } catch (error: any) {
    console.error("❌ Signup error:", error.message)
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

    if (error || !user) {
      console.error("❌ getCurrentUser: No auth user found", error)
      return null
    }

    console.log("🔐 getCurrentUser: Fetching user data for:", user.id)

    // Usar API endpoint que ignora RLS (usa service_role key)
    try {
      const response = await fetch(`/api/auth/user?id=${user.id}`)
      
      if (response.ok) {
        const userData = await response.json()
        console.log("✅ getCurrentUser: User data fetched via API:", userData)
        return userData as User
      }

      // Si es 404, el usuario no existe, intentar crear
      if (response.status === 404) {
        console.warn("⚠️ getCurrentUser: User not found (404), creating...")
        
        const createResponse = await fetch("/api/auth/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: user.id,
            email: user.email,
            name: user.user_metadata?.full_name || user.email.split("@")[0],
            plan: "gratuito",
            balance: 0,
            is_active: true,
          }),
        })

        if (createResponse.ok) {
          const newUser = await createResponse.json()
          console.log("✅ getCurrentUser: User created via API:", newUser)
          return newUser as User
        } else {
          console.error("❌ getCurrentUser: Failed to create user via API:", await createResponse.text())
        }
      }
      
      if (response.status === 500) {
        console.error("❌ getCurrentUser: Server error from API")
      }
    } catch (apiError) {
      console.error("❌ getCurrentUser: API error:", apiError)
    }

    // Si todo falla, no hay usuario
    console.warn("⚠️ getCurrentUser: Could not fetch user from API after all attempts")
    return null
  } catch (error: any) {
    console.error("❌ getCurrentUser exception:", error.message, error)
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
    console.log("📍 Attempting to load users from Supabase...")
    
    // First check if user is authenticated
    const { data: { user: authUser } } = await supabase.auth.getUser()
    console.log("🔐 Current auth user:", authUser?.email || "No user logged in")
    
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false })

    console.log("📨 Supabase response:", { 
      dataLength: data?.length || 0, 
      error: error?.message || "No error"
    })

    if (error) {
      console.error("❌ Supabase error loading users:", error.message, error.details, error.hint)
      throw error
    }

    if (!data) {
      console.warn("⚠️ Supabase returned null data")
      return { users: [], error: "No data returned from Supabase" }
    }

    const users = (data || []) as User[]
    console.log(`✅ Loaded ${users.length} users from Supabase`)
    console.log("👥 Users loaded:", users.map(u => ({ email: u.email, name: u.name, plan: u.plan })))
    
    // Also save to localStorage for backup
    if (typeof window !== "undefined" && users.length > 0) {
      try {
        localStorage.setItem("cvvinvest_users", JSON.stringify(users))
        console.log("💾 Saved to localStorage backup")
      } catch (e) {
        console.warn("Could not save to localStorage:", e)
      }
    }
    
    return { users, error: null }
  } catch (error: any) {
    console.error("❌ Error in getAllUsersFromDB:", error.message, error)
    
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
    
    console.log("⚠️ Returning empty users array")
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
