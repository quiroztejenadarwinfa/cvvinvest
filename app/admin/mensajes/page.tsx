'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Trash2, Eye, EyeOff, CheckCircle, Circle, Inbox, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AdminSidebar } from '@/components/admin/sidebar'
import { AdminHeader } from '@/components/admin/header'
import { useToast } from '@/hooks/use-toast'
import { getMessages, markAsRead, deleteMessage, clearAllMessages, type ContactMessage } from '@/lib/messages'
import { getSessionUser, clearSession, ADMIN_EMAIL, type User } from '@/lib/auth'

export default function MensajesPage() {
  const [admin, setAdmin] = useState<User | null>(null)
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const sessionUser = getSessionUser()
    if (!sessionUser) {
      router.push("/login")
      return
    }
    // Verificar que es admin
    if (sessionUser.email !== ADMIN_EMAIL || sessionUser.role !== "admin") {
      router.push("/dashboard")
      return
    }
    setAdmin(sessionUser)
    loadMessages()
  }, [router])

  const loadMessages = () => {
    const stored = getMessages()
    setMessages(stored.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
    setLoading(false)
  }

  const handleLogout = () => {
    clearSession()
    router.push("/")
  }

  const handleMarkAsRead = (id: string) => {
    markAsRead(id)
    loadMessages()
    if (selectedMessage?.id === id) {
      const updated = messages.find((m) => m.id === id)
      if (updated) setSelectedMessage(updated)
    }
  }

  const handleDelete = (id: string) => {
    deleteMessage(id)
    loadMessages()
    if (selectedMessage?.id === id) {
      setSelectedMessage(null)
    }
    toast({
      title: 'Mensaje eliminado',
      description: 'El mensaje ha sido eliminado correctamente.',
    })
  }

  const handleDeleteAll = () => {
    if (confirm('¿Estás seguro de que deseas eliminar todos los mensajes?')) {
      clearAllMessages()
      loadMessages()
      setSelectedMessage(null)
      toast({
        title: 'Todos los mensajes eliminados',
        description: 'Se han eliminado todos los mensajes del buzón.',
      })
    }
  }

  const filteredMessages = messages.filter((msg) => {
    if (searchTerm === '') return true
    const searchLower = searchTerm.toLowerCase()
    return (
      msg.name.toLowerCase().includes(searchLower) ||
      msg.email.toLowerCase().includes(searchLower) ||
      msg.subject.toLowerCase().includes(searchLower) ||
      msg.message.toLowerCase().includes(searchLower)
    )
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando buzón...</p>
        </div>
      </div>
    )
  }

  if (!admin) return null

  const unreadCount = messages.filter((m) => !m.read).length

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar admin={admin} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col">
        <AdminHeader admin={admin} />
        <main className="flex-1 p-8 md:p-12 overflow-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Inbox className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Buzón de Mensajes</h1>
                  <p className="text-muted-foreground">Mensajes de contacto de usuarios</p>
                </div>
              </div>
              {messages.length > 0 && (
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{messages.length}</p>
                  <p className="text-sm text-muted-foreground">Total de mensajes</p>
                </div>
              )}
            </div>
            
            {unreadCount > 0 && (
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-3 flex items-center gap-2">
                <Circle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-blue-900 dark:text-blue-100">Tienes {unreadCount} mensaje{unreadCount !== 1 ? 's' : ''} sin leer</span>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Messages List */}
            <div className="lg:col-span-1 space-y-3">
              {/* Search Bar */}
              <div className="relative mb-4">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, correo, asunto..."
                  className="pl-8 h-9 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="max-h-[550px] overflow-y-auto">
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Cargando mensajes...</p>
                </div>
              ) : filteredMessages.length === 0 ? (
                <div className="text-center py-8 bg-card border border-border rounded-lg">
                  <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">{searchTerm ? 'No hay resultados' : 'No hay mensajes'}</p>
                </div>
              ) : (
                filteredMessages.map((msg) => (
                  <div
                    key={msg.id}
                    onClick={() => {
                      setSelectedMessage(msg)
                      if (!msg.read) {
                        handleMarkAsRead(msg.id)
                      }
                    }}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedMessage?.id === msg.id
                        ? 'bg-primary/10 border-primary'
                        : 'bg-card border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 flex-1">
                        {msg.read ? (
                          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                        ) : (
                          <Circle className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                        )}
                        <h3 className="font-semibold text-foreground truncate text-sm">{msg.name}</h3>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{msg.email}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{msg.subject}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(msg.createdAt).toLocaleDateString('es-ES')} {new Date(msg.createdAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ))
              )}
              </div>
            </div>

            {/* Message Detail */}
            <div className="lg:col-span-2">
              {selectedMessage ? (
                <div className="bg-card border border-border rounded-lg p-8">
                  <div className="flex items-start justify-between mb-6 pb-6 border-b border-border">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-foreground mb-2">{selectedMessage.subject}</h2>
                      <div className="space-y-1 text-muted-foreground">
                        <p>
                          <strong>De:</strong> {selectedMessage.name} ({selectedMessage.email})
                        </p>
                        <p>
                          <strong>Fecha:</strong>{' '}
                          {new Date(selectedMessage.createdAt).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        <p>
                          <strong>Estado:</strong>{' '}
                          <span className={selectedMessage.read ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}>
                            {selectedMessage.read ? 'Leído' : 'Sin leer'}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMarkAsRead(selectedMessage.id)}
                        disabled={selectedMessage.read}
                      >
                        {selectedMessage.read ? (
                          <>
                            <EyeOff className="h-4 w-4 mr-1" />
                            Leído
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 mr-1" />
                            Marcar Leído
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(selectedMessage.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="font-semibold text-foreground mb-4">Mensaje:</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{selectedMessage.message}</p>
                  </div>

                  <div className="bg-secondary/50 border border-border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">
                      <strong>Email de respuesta:</strong> {selectedMessage.email}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-card border border-border rounded-lg p-12 text-center">
                  <Mail className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-lg text-muted-foreground mb-2">Selecciona un mensaje</p>
                  <p className="text-sm text-muted-foreground">
                    Haz clic en un mensaje de la lista para ver los detalles
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          {messages.length > 0 && (
            <div className="mt-8 pt-8 border-t border-border">
              <Button
                variant="destructive"
                onClick={handleDeleteAll}
                className="bg-red-600 hover:bg-red-700"
              >
                Eliminar todos los mensajes
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
