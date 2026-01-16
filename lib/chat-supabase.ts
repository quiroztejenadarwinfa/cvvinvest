import { supabase } from "@/lib/supabase"

export interface ChatSession {
  id: string
  user_id: string
  status: "active" | "resolved" | "cancelled"
  created_at: Date
  finalized_at?: Date
  finalized_status?: string
}

export interface ChatMessage {
  id: string
  session_id: string
  user_id: string
  message: string
  sender_type: "user" | "bot"
  created_at: Date
}

// Crear nueva sesión de chat
export async function createNewChatSession(userId: string) {
  try {
    const { data, error } = await supabase
      .from("chat_sessions")
      .insert({
        user_id: userId,
        status: "active",
      })
      .select()
      .single()

    if (error) throw error
    return { session: data as ChatSession, error: null }
  } catch (error: any) {
    return { session: null, error: error.message }
  }
}

// Obtener sesiones activas del usuario
export async function getUserActiveChats(userId: string) {
  try {
    const { data, error } = await supabase
      .from("chat_sessions")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .order("created_at", { ascending: false })

    if (error) throw error
    return { chats: (data as ChatSession[]) || [], error: null }
  } catch (error: any) {
    return { chats: [], error: error.message }
  }
}

// Obtener sesiones finalizadas del usuario
export async function getUserFinalizedChats(userId: string) {
  try {
    const { data, error } = await supabase
      .from("chat_sessions")
      .select("*")
      .eq("user_id", userId)
      .in("status", ["resolved", "cancelled"])
      .order("finalized_at", { ascending: false })

    if (error) throw error
    return { chats: (data as ChatSession[]) || [], error: null }
  } catch (error: any) {
    return { chats: [], error: error.message }
  }
}

// Finalizar sesión de chat
export async function finalizeChatSession(
  sessionId: string,
  status: "resolved" | "cancelled"
) {
  try {
    const { data, error } = await supabase
      .from("chat_sessions")
      .update({
        status: status,
        finalized_at: new Date(),
        finalized_status: status,
      })
      .eq("id", sessionId)
      .select()
      .single()

    if (error) throw error
    return { session: data as ChatSession, error: null }
  } catch (error: any) {
    return { session: null, error: error.message }
  }
}

// Obtener mensajes de una sesión
export async function getChatMessages(sessionId: string) {
  try {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true })

    if (error) throw error
    return { messages: (data as ChatMessage[]) || [], error: null }
  } catch (error: any) {
    return { messages: [], error: error.message }
  }
}

// Agregar mensaje a sesión
export async function addChatMessage(
  sessionId: string,
  userId: string,
  message: string,
  senderType: "user" | "bot" = "user"
) {
  try {
    const { data, error } = await supabase
      .from("chat_messages")
      .insert({
        session_id: sessionId,
        user_id: userId,
        message: message,
        sender_type: senderType,
      })
      .select()
      .single()

    if (error) throw error
    return { message: data as ChatMessage, error: null }
  } catch (error: any) {
    return { message: null, error: error.message }
  }
}

// Eliminar sesión de chat
export async function deleteChatSession(sessionId: string) {
  try {
    const { error } = await supabase
      .from("chat_sessions")
      .delete()
      .eq("id", sessionId)

    if (error) throw error
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}

// Obtener todas las sesiones de un usuario
export async function getAllUserChats(userId: string) {
  try {
    const { data, error } = await supabase
      .from("chat_sessions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return { chats: (data as ChatSession[]) || [], error: null }
  } catch (error: any) {
    return { chats: [], error: error.message }
  }
}
