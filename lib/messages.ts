export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  createdAt: string
  read: boolean
}

const STORAGE_KEY = "contact_messages"

export function getMessages(): ContactMessage[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

export function addMessage(data: Omit<ContactMessage, "id" | "createdAt" | "read">): ContactMessage {
  const messages = getMessages()
  const newMessage: ContactMessage = {
    id: Date.now().toString(),
    ...data,
    createdAt: new Date().toISOString(),
    read: false,
  }
  messages.push(newMessage)
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  }
  return newMessage
}

export function markAsRead(id: string): void {
  if (typeof window === "undefined") return
  const messages = getMessages()
  const message = messages.find((m) => m.id === id)
  if (message) {
    message.read = true
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  }
}

export function deleteMessage(id: string): void {
  if (typeof window === "undefined") return
  const messages = getMessages().filter((m) => m.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
}

export function clearAllMessages(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(STORAGE_KEY)
}
