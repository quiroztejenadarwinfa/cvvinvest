// Sistema de Chat para usuarios y administrador

export type MessageType = "user" | "admin"
export type ChatStatus = "open" | "pending" | "resolved"
export type QuickMessageType = "deposit-issue" | "withdrawal-issue" | "general-question" | "account-help"

export interface ChatMessage {
  id: string
  userId: string
  userName: string
  userEmail: string
  message: string
  sender: MessageType
  timestamp: string
  read: boolean
}

export interface ChatSession {
  id: string
  userId: string
  userName: string
  userEmail: string
  status: ChatStatus
  archived: boolean
  createdAt: string
  updatedAt: string
  messages: ChatMessage[]
  quickMessageType?: QuickMessageType
}

const CHAT_SESSIONS_KEY = "cvvinvest_chat_sessions"
const USER_CURRENT_SESSION_KEY = "cvvinvest_user_current_session"

/**
 * Obtener todas las sesiones de chat del administrador
 */
export function getAllChatSessions(): ChatSession[] {
  try {
    const stored = localStorage.getItem(CHAT_SESSIONS_KEY)
    if (!stored) return []
    return JSON.parse(stored)
  } catch {
    return []
  }
}

/**
 * Obtener sesión de chat actual del usuario
 */
export function getUserCurrentSession(userId: string): ChatSession | null {
  try {
    const stored = localStorage.getItem(`${USER_CURRENT_SESSION_KEY}_${userId}`)
    if (!stored) return null
    return JSON.parse(stored)
  } catch {
    return null
  }
}

/**
 * Crear una NUEVA sesión de chat (siempre crea uno nuevo, sin verificar existentes)
 */
export function createNewChatSession(
  userId: string,
  userName: string,
  userEmail: string,
  quickMessageType?: QuickMessageType
): ChatSession {
  // Crear nueva sesión sin verificar existentes
  const newSession: ChatSession = {
    id: `chat_${userId}_${Date.now()}`,
    userId,
    userName,
    userEmail,
    status: "open",
    archived: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [],
    quickMessageType,
  }

  // Guardar en localStorage
  const sessions = getAllChatSessions()
  sessions.push(newSession)
  localStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(sessions))

  // Guardar como sesión actual del usuario
  localStorage.setItem(`${USER_CURRENT_SESSION_KEY}_${userId}`, JSON.stringify(newSession))

  return newSession
}

/**
 * Obtener o crear una sesión de chat (mantiene la anterior si existe y está abierta)
 */
export function createOrGetChatSession(
  userId: string,
  userName: string,
  userEmail: string,
  quickMessageType?: QuickMessageType
): ChatSession {
  // Verificar si ya existe una sesión activa (no archivada)
  const allSessions = getAllChatSessions()
  const existingSession = allSessions.find(s => s.userId === userId && !s.archived && s.status === "open")

  if (existingSession) {
    return existingSession
  }

  // Si no existe, crear una nueva
  return createNewChatSession(userId, userName, userEmail, quickMessageType)
}

/**
 * Agregar mensaje a una sesión de chat
 */
export function addMessageToSession(
  sessionId: string,
  userId: string,
  message: string,
  sender: MessageType
): ChatMessage | null {
  const sessions = getAllChatSessions()
  const session = sessions.find(s => s.id === sessionId)

  if (!session) return null

  const newMessage: ChatMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    userName: session.userName,
    userEmail: session.userEmail,
    message,
    sender,
    timestamp: new Date().toISOString(),
    read: sender === "admin" ? false : true,
  }

  session.messages.push(newMessage)
  session.updatedAt = new Date().toISOString()

  // Actualizar en localStorage
  localStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(sessions))

  // Actualizar sesión del usuario si es necesario
  if (sender === "user") {
    const userSession = getUserCurrentSession(userId)
    if (userSession) {
      userSession.messages.push(newMessage)
      localStorage.setItem(`${USER_CURRENT_SESSION_KEY}_${userId}`, JSON.stringify(userSession))
    }
  }

  return newMessage
}

/**
 * Marcar sesión como leída por admin
 */
export function markSessionAsRead(sessionId: string): void {
  const sessions = getAllChatSessions()
  const session = sessions.find(s => s.id === sessionId)

  if (session) {
    session.messages = session.messages.map(m => ({
      ...m,
      read: true,
    }))
    localStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(sessions))
  }
}

/**
 * Actualizar estado de sesión
 */
export function updateSessionStatus(sessionId: string, status: ChatStatus): void {
  const sessions = getAllChatSessions()
  const session = sessions.find(s => s.id === sessionId)

  if (session) {
    session.status = status
    session.updatedAt = new Date().toISOString()
    localStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(sessions))
  }
}

/**
 * Obtener sesiones sin leer
 */
export function getUnreadSessions(): ChatSession[] {
  const sessions = getAllChatSessions()
  return sessions.filter(s =>
    s.messages.some(m => m.sender === "user" && !m.read)
  )
}

/**
 * Mensajes rápidos sugeridos para usuarios
 */
export const QUICK_MESSAGES = [
  {
    id: "deposit-issue",
    label: "Problema con Depósito",
    emoji: "📥",
    message: "Tengo un problema con mi depósito",
  },
  {
    id: "withdrawal-issue",
    label: "Problema con Retiro",
    emoji: "📤",
    message: "Tengo un problema con mi retiro",
  },
  {
    id: "general-question",
    label: "Pregunta General",
    emoji: "❓",
    message: "Tengo una pregunta sobre la plataforma",
  },
  {
    id: "account-help",
    label: "Ayuda con Cuenta",
    emoji: "👤",
    message: "Necesito ayuda con mi cuenta",
  },
]

/**
 * Archivar una sesión de chat
 */
export function archiveSession(sessionId: string): void {
  try {
    const sessions = getAllChatSessions()
    const session = sessions.find((s) => s.id === sessionId)
    if (session) {
      session.archived = !session.archived
      session.updatedAt = new Date().toISOString()
      localStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(sessions))
    }
  } catch (error) {
    console.error("Error archiving session:", error)
  }
}

/**
 * Obtener solo chats no archivados
 */
export function getActiveChatSessions(): ChatSession[] {
  return getAllChatSessions().filter((s) => !s.archived)
}

/**
 * Obtener solo chats archivados
 */
export function getArchivedChatSessions(): ChatSession[] {
  return getAllChatSessions().filter((s) => s.archived)
}
/**
 * Validar y limpiar sesión de chat si el usuario cambió
 * Previene que datos de otra cuenta aparezcan en el chatbot
 */
export function validateAndCleanChatSession(currentUserId: string): void {
  try {
    const stored = localStorage.getItem(USER_CURRENT_SESSION_KEY)
    if (stored) {
      const lastSessionUserId = JSON.parse(stored)
      
      // Si el ID del usuario cambió, limpiar todas las sesiones de chat
      if (lastSessionUserId !== currentUserId) {
        localStorage.removeItem(CHAT_SESSIONS_KEY)
      }
    }
    
    // Guardar el ID actual del usuario
    localStorage.setItem(USER_CURRENT_SESSION_KEY, JSON.stringify(currentUserId))
  } catch (error) {
    console.error("Error validating chat session:", error)
    // Si hay error, limpiar por seguridad
    localStorage.removeItem(CHAT_SESSIONS_KEY)
    localStorage.removeItem(USER_CURRENT_SESSION_KEY)
  }
}

/**
 * Limpiar sesión de chat completamente
 */
/**
 * Limpiar sesión de chat completamente
 */
export function clearChatSession(): void {
  try {
    localStorage.removeItem(CHAT_SESSIONS_KEY)
    localStorage.removeItem(USER_CURRENT_SESSION_KEY)
  } catch (error) {
    console.error("Error clearing chat session:", error)
  }
}

/**
 * Finalizar un chat (resolver o cancelar) - lo archiva y crea espacio para nuevo chat
 */
export function finalizeChatSession(sessionId: string, finalStatus: "resolved" | "cancelled"): void {
  try {
    const sessions = getAllChatSessions()
    const sessionIndex = sessions.findIndex(s => s.id === sessionId)
    
    if (sessionIndex !== -1) {
      sessions[sessionIndex].status = finalStatus === "resolved" ? "resolved" : "cancelled"
      sessions[sessionIndex].archived = true
      sessions[sessionIndex].updatedAt = new Date().toISOString()
      localStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(sessions))
    }
  } catch (error) {
    console.error("Error finalizing chat session:", error)
  }
}

/**
 * Obtener todos los chats finalizados de un usuario
 */
export function getUserFinalizedChats(userId: string): ChatSession[] {
  try {
    return getAllChatSessions().filter(s => 
      s.userId === userId && s.archived && (s.status === "resolved" || s.status === "cancelled")
    )
  } catch (error) {
    console.error("Error getting finalized chats:", error)
    return []
  }
}

/**
 * Obtener todos los chats activos de un usuario
 */
export function getUserActiveChats(userId: string): ChatSession[] {
  try {
    return getAllChatSessions().filter(s => 
      s.userId === userId && !s.archived && s.status === "open"
    )
  } catch (error) {
    console.error("Error getting active chats:", error)
    return []
  }
}

/**
 * Cambiar el estado de un chat a "pending" (en espera de respuesta del admin)
 */
export function setPendingChat(sessionId: string): void {
  try {
    const sessions = getAllChatSessions()
    const sessionIndex = sessions.findIndex(s => s.id === sessionId)
    
    if (sessionIndex !== -1) {
      sessions[sessionIndex].status = "pending"
      sessions[sessionIndex].updatedAt = new Date().toISOString()
      localStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(sessions))
    }
  } catch (error) {
    console.error("Error setting chat to pending:", error)
  }
}
