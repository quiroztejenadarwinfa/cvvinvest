"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Laptop, Smartphone, Clock, MapPin, LogOut } from "lucide-react"

interface Session {
  id: string
  deviceType: "desktop" | "mobile" | "tablet"
  deviceName: string
  browser: string
  lastActivity: string
  ipAddress: string
  location: string
  isCurrent: boolean
}

interface ActiveSessionsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userEmail: string
}

export function ActiveSessionsModal({
  open,
  onOpenChange,
  userEmail,
}: ActiveSessionsModalProps) {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      loadSessions()
    }
  }, [open, userEmail])

  const loadSessions = () => {
    setLoading(true)
    try {
      // Simular sesiones desde localStorage
      const sessionsData = localStorage.getItem(`cvvinvest_sessions_${userEmail}`)
      const currentSession = localStorage.getItem("cvvinvest_session_id")
      
      if (sessionsData) {
        const parsed = JSON.parse(sessionsData) as Session[]
        setSessions(parsed.map(s => ({
          ...s,
          isCurrent: s.id === currentSession
        })))
      } else {
        // Si no hay sesiones guardadas, crear sesión actual simulada
        const now = new Date()
        const currentSessionData: Session[] = [
          {
            id: currentSession || "session-" + Date.now(),
            deviceType: "desktop",
            deviceName: "Mi Computadora",
            browser: "Chrome",
            lastActivity: now.toLocaleString(),
            ipAddress: "192.168.1.100",
            location: "Quito, Ecuador",
            isCurrent: true,
          }
        ]
        setSessions(currentSessionData)
        localStorage.setItem(`cvvinvest_sessions_${userEmail}`, JSON.stringify(currentSessionData))
      }
    } catch (error) {
      console.error("Error al cargar sesiones:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCloseSession = (sessionId: string) => {
    if (sessions.find(s => s.id === sessionId && s.isCurrent)) {
      alert("No puedes cerrar tu sesión actual desde aquí. Usa 'Cerrar Sesión' en la barra lateral.")
      return
    }

    // Remover sesión
    const updated = sessions.filter(s => s.id !== sessionId)
    setSessions(updated)
    localStorage.setItem(`cvvinvest_sessions_${userEmail}`, JSON.stringify(updated))
  }

  const handleCloseAllOtherSessions = () => {
    const currentSession = sessions.find(s => s.isCurrent)
    if (currentSession) {
      setSessions([currentSession])
      localStorage.setItem(`cvvinvest_sessions_${userEmail}`, JSON.stringify([currentSession]))
    }
  }

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case "mobile":
        return <Smartphone className="h-5 w-5 text-blue-600" />
      case "tablet":
        return <Laptop className="h-5 w-5 text-purple-600" />
      default:
        return <Laptop className="h-5 w-5 text-gray-600" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sesiones Activas</DialogTitle>
          <DialogDescription>
            Gestiona tus dispositivos conectados
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {sessions.length} {sessions.length === 1 ? "sesión activa" : "sesiones activas"}
          </p>

          <ScrollArea className="h-64 border rounded-lg p-4 space-y-3">
            {loading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Cargando sesiones...</p>
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">No hay sesiones activas</p>
              </div>
            ) : (
              sessions.map((session) => (
                <div
                  key={session.id}
                  className={`p-3 border rounded-lg transition-colors ${
                    session.isCurrent
                      ? "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800"
                      : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      {getDeviceIcon(session.deviceType)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{session.deviceName}</p>
                          {session.isCurrent && (
                            <Badge variant="default" className="text-xs">
                              Actual
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{session.browser}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <Clock className="h-3 w-3" />
                          {session.lastActivity}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {session.location}
                        </div>
                        <p className="text-xs text-muted-foreground">{session.ipAddress}</p>
                      </div>
                    </div>
                    {!session.isCurrent && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCloseSession(session.id)}
                        className="h-8 px-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900"
                      >
                        <LogOut className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </ScrollArea>

          {sessions.length > 1 && (
            <Button
              variant="outline"
              className="w-full text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
              onClick={handleCloseAllOtherSessions}
            >
              Cerrar todas las otras sesiones
            </Button>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
