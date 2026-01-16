'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/sidebar'
import { AdminHeader } from '@/components/admin/header'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Send, MessageCircle, AlertCircle, Search, Archive, ArchiveX } from 'lucide-react'
import { getSessionUser, ADMIN_EMAIL, clearSession, type User } from '@/lib/auth'
import {
  getAllChatSessions,
  addMessageToSession,
  markSessionAsRead,
  updateSessionStatus,
  getUnreadSessions,
  archiveSession,
  type ChatSession,
} from '@/lib/chat'

// Marcar como página dinámica para evitar prerendering estático
export const dynamic = 'force-dynamic'

export default function AdminChatPage() {
  const router = useRouter()
  const [admin, setAdmin] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null)
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [filter, setFilter] = useState<'all' | 'open' | 'pending' | 'resolved'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showArchived, setShowArchived] = useState(false)

  useEffect(() => {
    const currentUser = getSessionUser()
    if (!currentUser || currentUser.email !== ADMIN_EMAIL) {
      router.push('/login')
      return
    }
    setAdmin(currentUser)

    // Cargar sesiones
    const allSessions = getAllChatSessions()
    setSessions(allSessions)
    if (allSessions.length > 0) {
      setSelectedSession(allSessions[0])
      markSessionAsRead(allSessions[0].id)
    }
    setLoading(false)

    // Actualizar sesiones cada 2 segundos para sincronización en tiempo real
    const interval = setInterval(() => {
      const updatedSessions = getAllChatSessions()
      setSessions(updatedSessions)
      
      // Si hay sesión seleccionada, actualizarla también
      if (selectedSession) {
        const updatedSession = updatedSessions.find(s => s.id === selectedSession.id)
        if (updatedSession) {
          setSelectedSession(updatedSession)
        }
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [router])

  const filteredSessions = sessions.filter((s) => {
    // Filtro por archivo
    const archivedMatch = showArchived ? s.archived : !s.archived
    
    // Filtro por estado
    const statusMatch = filter === 'all' || s.status === filter
    
    // Filtro por búsqueda (nombre o email)
    const searchMatch = 
      searchTerm === '' ||
      s.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
    
    return archivedMatch && statusMatch && searchMatch
  })

  const unreadCount = getUnreadSessions().length

  const handleSendMessage = () => {
    if (!message.trim() || !selectedSession) return

    setIsLoading(true)
    addMessageToSession(selectedSession.id, selectedSession.userId, message, 'admin')
    setMessage('')

    // Recargar sesiones
    const allSessions = getAllChatSessions()
    setSessions(allSessions)
    const updated = allSessions.find((s) => s.id === selectedSession.id)
    if (updated) {
      setSelectedSession(updated)
    }
    setIsLoading(false)
  }

  const handleSelectSession = (session: ChatSession) => {
    setSelectedSession(session)
    markSessionAsRead(session.id)

    // Actualizar lista
    const allSessions = getAllChatSessions()
    setSessions(allSessions)
  }

  const handleStatusChange = (status: 'open' | 'pending' | 'resolved') => {
    if (!selectedSession) return
    updateSessionStatus(selectedSession.id, status)

    // Recargar
    const allSessions = getAllChatSessions()
    setSessions(allSessions)
    const updated = allSessions.find((s) => s.id === selectedSession.id)
    if (updated) {
      setSelectedSession(updated)
    }
  }

  const handleArchiveSession = (sessionId: string) => {
    archiveSession(sessionId)
    // Recargar
    const allSessions = getAllChatSessions()
    setSessions(allSessions)
    if (selectedSession?.id === sessionId) {
      setSelectedSession(null)
    }
  }

  const handleLogout = () => {
    clearSession()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <AdminSidebar admin={admin!} onLogout={handleLogout} />
        <div className="flex-1 flex flex-col">
          <AdminHeader admin={admin!} />
          <main className="flex-1 overflow-hidden p-8">
            <div className="text-center">Cargando...</div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar admin={admin!} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col">
        <AdminHeader admin={admin!} />
        <main className="flex-1 overflow-hidden">
          <div className="h-full flex gap-6 p-6">
            {/* Chat List */}
            <div className="w-96 flex flex-col gap-4">
              <Card className="p-5 border-0 shadow-md">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="font-bold text-lg">Chats</h2>
                    <p className="text-xs text-muted-foreground mt-1">{filteredSessions.length} disponibles</p>
                  </div>
                  {unreadCount > 0 && (
                    <Badge variant="destructive" className="text-xs px-3 py-1">{unreadCount} nuevos</Badge>
                  )}
                </div>

                {/* Search Bar */}
                <div className="mb-4 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nombre o correo..."
                    className="pl-10 h-9 text-sm rounded-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Filters */}
                <div className="flex gap-2 mb-5 text-xs flex-wrap">
                  <Button
                    size="sm"
                    variant={!showArchived ? 'default' : 'outline'}
                    onClick={() => setShowArchived(false)}
                    className="text-xs h-8"
                  >
                    Activos
                  </Button>
                  <Button
                    size="sm"
                    variant={showArchived ? 'default' : 'outline'}
                    onClick={() => setShowArchived(true)}
                    className="text-xs h-8"
                  >
                    Archivados
                  </Button>
                  
                  {!showArchived && (
                    <>
                      {['all', 'open', 'pending', 'resolved'].map((f) => (
                        <Button
                          key={f}
                          size="sm"
                          variant={filter === f ? 'default' : 'outline'}
                          onClick={() => setFilter(f as any)}
                          className="text-xs h-8"
                        >
                          {f === 'all' ? 'Todos' : f === 'open' ? 'Abiertos' : f === 'pending' ? 'Pendientes' : 'Resueltos'}
                        </Button>
                      ))}
                    </>
                  )}
                </div>

                {/* Sessions List */}
                <div className="space-y-2 max-h-[calc(100vh-400px)] overflow-y-auto pr-2">
                  {filteredSessions.length > 0 ? (
                    filteredSessions.map((session) => {
                      const unread = session.messages.some((m) => m.sender === 'user' && !m.read)
                      return (
                        <div
                          key={session.id}
                          onClick={() => handleSelectSession(session)}
                          className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                            selectedSession?.id === session.id
                              ? 'bg-primary/10 border-primary shadow-sm'
                              : 'bg-card border-border hover:border-primary/50 hover:shadow-sm'
                          } ${unread ? 'font-semibold' : 'font-medium'}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm truncate">{session.userName}</p>
                            {unread && (
                              <div className="h-2 w-2 bg-red-500 rounded-full flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate mb-2">{session.userEmail}</p>
                          <div className="flex items-center justify-between gap-2">
                            <Badge
                              variant={
                                session.status === 'open'
                                  ? 'default'
                                  : session.status === 'pending'
                                    ? 'secondary'
                                    : 'outline'
                              }
                              className="text-xs"
                            >
                              {session.status === 'open' ? '🔵 Abierto' : session.status === 'pending' ? '🟡 Pendiente' : '✓ Resuelto'}
                            </Badge>
                            <p className="text-xs text-muted-foreground text-right flex-shrink-0">
                              {new Date(session.updatedAt).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                            </p>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No hay chats
                    </p>
                  )}
                </div>
              </Card>
            </div>

            {/* Chat Window */}
            {selectedSession ? (
              <div className="flex-1 flex flex-col">
                <Card className="flex-1 flex flex-col border-0 shadow-md overflow-hidden">
                  {/* Chat Header */}
                  <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b p-5 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg">{selectedSession.userName}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{selectedSession.userEmail}</p>
                    </div>
                    <div className="flex gap-2 flex-wrap justify-end">
                      <Button
                        size="sm"
                        variant={selectedSession.status === 'open' ? 'default' : 'outline'}
                        onClick={() => handleStatusChange('open')}
                        className="text-xs h-8"
                      >
                        🔵 Abierto
                      </Button>
                      <Button
                        size="sm"
                        variant={selectedSession.status === 'pending' ? 'default' : 'outline'}
                        onClick={() => handleStatusChange('pending')}
                        className="text-xs h-8"
                      >
                        🟡 Pendiente
                      </Button>
                      <Button
                        size="sm"
                        variant={selectedSession.status === 'resolved' ? 'default' : 'outline'}
                        onClick={() => handleStatusChange('resolved')}
                        className="text-xs h-8"
                      >
                        ✓ Resuelto
                      </Button>
                      <Button
                        size="sm"
                        variant={selectedSession.archived ? 'destructive' : 'outline'}
                        onClick={() => handleArchiveSession(selectedSession.id)}
                        className="text-xs h-8"
                      >
                        {selectedSession.archived ? (
                          <>
                            <ArchiveX className="h-3 w-3 mr-1" />
                            Restaurar
                          </>
                        ) : (
                          <>
                            <Archive className="h-3 w-3 mr-1" />
                            Archivar
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-gradient-to-b from-background to-muted/20">
                    {selectedSession.messages.length > 0 ? (
                      selectedSession.messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}
                        >
                          <div
                            className={`px-4 py-3 rounded-lg max-w-sm text-sm shadow-sm ${
                              msg.sender === 'user'
                                ? 'bg-secondary text-secondary-foreground rounded-bl-none'
                                : 'bg-primary text-primary-foreground rounded-br-none'
                            }`}
                          >
                            <p className="break-words">{msg.message}</p>
                            <p className="text-xs opacity-75 mt-1.5 font-medium">
                              {new Date(msg.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        <div className="text-center">
                          <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-30" />
                          <p className="font-medium">Sin mensajes aún</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input */}
                  <div className="border-t bg-card p-4 flex gap-3">
                    <input
                      type="text"
                      placeholder="Escribe tu respuesta..."
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
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <Card className="p-12 text-center border-0 shadow-md">
                  <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-30" />
                  <p className="text-muted-foreground font-medium">Selecciona un chat para comenzar</p>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
