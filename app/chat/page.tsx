'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Send, AlertCircle, Search, MessageCircle } from 'lucide-react'
import { getSessionUser } from '@/lib/auth'
import { getUserCurrentSession, createOrGetChatSession, addMessageToSession, QUICK_MESSAGES } from '@/lib/chat'

// Marcar como página dinámica para evitar prerendering estático
export const dynamic = 'force-dynamic'

export default function ChatPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<any>(null)
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const currentUser = getSessionUser()
    if (!currentUser) {
      router.push('/login')
      return
    }
    setUser(currentUser)

    // Cargar sesión
    const existingSession = getUserCurrentSession(currentUser.id)
    if (existingSession) {
      setSession(existingSession)
    } else {
      const newSession = createOrGetChatSession(
        currentUser.id,
        currentUser.name,
        currentUser.email
      )
      setSession(newSession)
    }
    setLoading(false)

    // Verificar si viene desde depósitos y debe enviar mensaje automático
    const source = searchParams.get('source')
    const autoMessage = searchParams.get('autoMessage')
    
    if (source === 'depositos' && autoMessage === 'true') {
      // Se enviará el mensaje después de que se cargue la sesión
      setTimeout(() => {
        const sessionToUse = existingSession || (currentUser && createOrGetChatSession(
          currentUser.id,
          currentUser.name,
          currentUser.email
        ))
        
        if (sessionToUse && currentUser) {
          const autoMsg = 'Deseo acreditar fondos a mi cuenta CVVinvest. ¿Cuál es el proceso de depósito más seguro y rápido?'
          addMessageToSession(sessionToUse.id, currentUser.id, autoMsg, 'user')
          const updatedSession = getUserCurrentSession(currentUser.id)
          setSession(updatedSession)
        }
      }, 500)
    }

    // Actualizar sesión cada 1.5 segundos para sincronización en tiempo real
    const interval = setInterval(() => {
      const updatedSession = getUserCurrentSession(currentUser.id)
      if (updatedSession) {
        setSession(updatedSession)
      }
    }, 1500)

    return () => clearInterval(interval)
  }, [router, searchParams])

  const handleQuickMessage = (quickMessage: string) => {
    if (!session || !user) return
    addMessageToSession(session.id, user.id, quickMessage, 'user')
    const updatedSession = getUserCurrentSession(user.id)
    setSession(updatedSession)
  }

  const handleSendMessage = () => {
    if (!message.trim() || !session || !user) return

    setIsLoading(true)
    addMessageToSession(session.id, user.id, message, 'user')
    setMessage('')

    const updatedSession = getUserCurrentSession(user.id)
    setSession(updatedSession)
    setIsLoading(false)
  }

  const filteredMessages = session?.messages?.filter((msg: any) => {
    if (searchTerm === '') return true
    const searchLower = searchTerm.toLowerCase()
    return msg.content.toLowerCase().includes(searchLower)
  }) || []

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="text-center">Cargando...</div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Chat con Soporte</h1>
              <p className="text-muted-foreground">Nuestro equipo te responderá en breve</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Chat Area */}
            <div className="lg:col-span-2">
              <Card className="h-[600px] flex flex-col border-0 shadow-md overflow-hidden">
                {/* Search Bar */}
                <div className="p-5 border-b bg-gradient-to-r from-primary/10 to-primary/5 relative">
                  <Search className="absolute left-7 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar en la conversación..."
                    className="pl-11 h-9 text-sm rounded-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Messages */}
                <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-gradient-to-b from-background to-muted/20">
                  {filteredMessages && filteredMessages.length > 0 ? (
                    filteredMessages.map((msg: any) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`px-4 py-3 rounded-lg max-w-sm text-sm shadow-sm ${
                            msg.sender === 'user'
                              ? 'bg-primary text-primary-foreground rounded-br-none'
                              : 'bg-secondary text-secondary-foreground rounded-bl-none'
                          }`}
                        >
                          <p className="break-words">{msg.message}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <div className="text-center">
                        <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p className="font-semibold mb-1">{searchTerm ? 'Sin resultados' : 'Inicia una conversación'}</p>
                        <p className="text-sm text-muted-foreground">{searchTerm ? 'Intenta con otras palabras' : 'Selecciona un tema o escribe tu pregunta'}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="border-t bg-card p-4 flex gap-3">
                  <input
                    type="text"
                    placeholder="Escribe tu mensaje..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    className="flex-1 px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || !message.trim()}
                    className="h-10 px-4"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </div>

            {/* Sidebar with Quick Messages */}
            <div className="space-y-4">
              <Card className="p-5 border-0 shadow-md">
                <h3 className="font-semibold mb-4 text-lg">Temas Frecuentes</h3>
                <div className="space-y-2">
                  {QUICK_MESSAGES.map((qm) => (
                    <Button
                      key={qm.id}
                      variant="outline"
                      className="w-full justify-start text-sm h-9 hover:bg-primary/5 hover:border-primary"
                      onClick={() => handleQuickMessage(qm.message)}
                    >
                      <span className="mr-2 text-lg">{qm.emoji}</span>
                      <span className="truncate">{qm.label}</span>
                    </Button>
                  ))}
                </div>
              </Card>

              <Card className="p-5 border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-50/50">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-blue-900 mb-2">Horario de Atención</p>
                    <div className="text-blue-800 text-xs space-y-1">
                      <p>📅 <strong>Lunes a Viernes:</strong> 8:00 AM - 6:00 PM</p>
                      <p>📅 <strong>Sábado y Domingo:</strong> 9:00 AM - 3:00 PM</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
