'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { MessageCircle, X, Send } from 'lucide-react'
import {
  getUserCurrentSession,
  createOrGetChatSession,
  addMessageToSession,
  validateAndCleanChatSession,
  type ChatSession,
} from '@/lib/chat'

interface ChatWidgetProps {
  userId?: string
  userName?: string
  userEmail?: string
  isAdmin?: boolean
}

export function ChatWidget({ userId, userName, userEmail, isAdmin = false }: ChatWidgetProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [session, setSession] = useState<ChatSession | null>(null)
  const [message, setMessage] = useState('')
  const [mounted, setMounted] = useState(false)

  const isAuthenticated = !!userId && !!userName && !!userEmail

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isAuthenticated || !mounted) return

    // Validar y limpiar sesión de chat si el usuario cambió
    validateAndCleanChatSession(userId!)

    const existing = getUserCurrentSession(userId!)
    if (existing) {
      setSession(existing)
    }

    const interval = setInterval(() => {
      const updated = getUserCurrentSession(userId!)
      if (updated) {
        setSession(updated)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [isAuthenticated, userId, mounted])

  const handleSendMessage = () => {
    if (!message.trim() || !session || !isAuthenticated) return

    addMessageToSession(session.id, userId!, message, 'user')
    setMessage('')

    const updated = getUserCurrentSession(userId!)
    setSession(updated)
  }

  const handleOpenChat = () => {
    setIsOpen(false)
    router.push('/chat')
  }

  const handleOpenAdminChat = () => {
    setIsOpen(false)
    router.push('/admin/chat')
  }

  if (!mounted || (!isAuthenticated && !isAdmin)) return null

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl"
        size="icon"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 max-w-[90vw] bg-card border-2 border-border rounded-xl shadow-2xl flex flex-col h-96 overflow-hidden">
          <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
            <h3 className="font-bold">Chat Soporte</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/30">
            {session?.messages.length ? (
              session.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`px-3 py-2 rounded-lg max-w-xs text-sm ${
                      msg.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground text-sm py-8">
                Sin mensajes
              </div>
            )}
          </div>

          <div className="border-t p-3 flex gap-2">
            <input
              type="text"
              placeholder="Mensaje..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button size="sm" onClick={handleSendMessage} disabled={!message.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>

          <div className="border-t p-2">
            {isAdmin ? (
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={handleOpenAdminChat}
              >
                Ver Todos
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={handleOpenChat}
              >
                Abrir Chat
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
