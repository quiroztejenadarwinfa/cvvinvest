"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { 
  Shield, AlertCircle, Check, Eye, EyeOff, Trash2, Lock, Globe, 
  Smartphone, Monitor, Clock, MapPin, LogIn, LogOut, AlertTriangle,
  X, Copy, CheckCircle
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AuditLog {
  id: string
  timestamp: string
  action: string
  user: string
  email: string
  details: string
  status: "success" | "warning" | "error"
}

interface SecurityEvent {
  id: string
  type: "login" | "logout" | "failed_login" | "password_change" | "email_change" | "suspicious_activity"
  timestamp: string
  user: string
  ip: string
  device: string
  browser: string
  os: string
  location: string
  details: string
  duration?: string
}

interface BlockedIP {
  ip: string
  reason: string
  blockedAt: string
  blockCount: number
}

export default function SeguridadPage() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([])
  const [blockedIPs, setBlockedIPs] = useState<BlockedIP[]>([])
  const [newBlockedIP, setNewBlockedIP] = useState("")
  const [blockReason, setBlockReason] = useState("")
  const [showDetails, setShowDetails] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<string>("all")
  const [copied, setCopied] = useState<string | null>(null)
  const [showPin, setShowPin] = useState(false)
  const [twoFAPin, setTwoFAPin] = useState("")
  const [twoFAEnabled, setTwoFAEnabled] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Cargar estado 2FA
    if (typeof window !== 'undefined') {
      setTwoFAEnabled(localStorage.getItem("admin_2fa_enabled") === "true")
      setTwoFAPin(localStorage.getItem("admin_2fa_pin") || "")
    }
    
    // Cargar logs de auditoría
    const storedLogs = localStorage.getItem("admin_audit_logs")
    if (storedLogs) {
      setAuditLogs(JSON.parse(storedLogs))
    } else {
      const defaultLogs: AuditLog[] = [
        {
          id: "log-1",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          action: "Aprobación de Depósito",
          user: "Admin",
          email: "exe.main.darwin@gmail.com",
          details: "Usuario test@test.com depositó $500",
          status: "success",
        },
        {
          id: "log-2",
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          action: "Cambio de Contraseña de Usuario",
          user: "test@test.com",
          email: "test@test.com",
          details: "Contraseña restablecida exitosamente",
          status: "success",
        },
        {
          id: "log-3",
          timestamp: new Date(Date.now() - 10800000).toISOString(),
          action: "Intento de Login Fallido",
          user: "unknown",
          email: "attacker@malicious.com",
          details: "Contraseña incorrecta - 5 intentos",
          status: "warning",
        },
      ]
      setAuditLogs(defaultLogs)
      localStorage.setItem("admin_audit_logs", JSON.stringify(defaultLogs))
    }

    // Cargar eventos de seguridad mejorados
    const storedEvents = localStorage.getItem("admin_security_events")
    if (storedEvents) {
      setSecurityEvents(JSON.parse(storedEvents))
    } else {
      const defaultEvents: SecurityEvent[] = [
        {
          id: "event-1",
          type: "login",
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          user: "Admin",
          ip: "192.168.1.100",
          device: "Desktop",
          browser: "Chrome 121.0",
          os: "Windows 11",
          location: "Bogotá, Colombia",
          details: "Login exitoso",
          duration: "2h 30m",
        },
        {
          id: "event-2",
          type: "login",
          timestamp: new Date(Date.now() - 5400000).toISOString(),
          user: "test@example.com",
          ip: "203.0.113.45",
          device: "Mobile",
          browser: "Safari",
          os: "iOS 17.2",
          location: "Medellín, Colombia",
          details: "Login desde dispositivo móvil",
          duration: "1h 15m",
        },
        {
          id: "event-3",
          type: "failed_login",
          timestamp: new Date(Date.now() - 9000000).toISOString(),
          user: "unknown",
          ip: "198.51.100.50",
          device: "Unknown",
          browser: "Firefox",
          os: "Unknown",
          location: "Desconocida",
          details: "Múltiples intentos fallidos - 7 intentos",
          duration: "15m",
        },
        {
          id: "event-4",
          type: "password_change",
          timestamp: new Date(Date.now() - 15000000).toISOString(),
          user: "test@example.com",
          ip: "192.168.1.100",
          device: "Desktop",
          browser: "Chrome 121.0",
          os: "Windows 11",
          location: "Bogotá, Colombia",
          details: "Contraseña actualizada exitosamente",
          duration: "-",
        },
        {
          id: "event-5",
          type: "logout",
          timestamp: new Date(Date.now() - 25000000).toISOString(),
          user: "Admin",
          ip: "192.168.1.100",
          device: "Desktop",
          browser: "Chrome 121.0",
          os: "Windows 11",
          location: "Bogotá, Colombia",
          details: "Sesión cerrada",
          duration: "3h 45m",
        },
      ]
      setSecurityEvents(defaultEvents)
      localStorage.setItem("admin_security_events", JSON.stringify(defaultEvents))
    }

    // Cargar IPs bloqueadas mejoradas
    const storedBlockedIPs = localStorage.getItem("admin_blocked_ips")
    if (storedBlockedIPs) {
      setBlockedIPs(JSON.parse(storedBlockedIPs))
    } else {
      const defaultBlocked: BlockedIP[] = [
        {
          ip: "192.168.1.50",
          reason: "Múltiples intentos fallidos",
          blockedAt: new Date(Date.now() - 86400000).toISOString(),
          blockCount: 15,
        },
      ]
      setBlockedIPs(defaultBlocked)
      localStorage.setItem("admin_blocked_ips", JSON.stringify(defaultBlocked))
    }
  }, [])

  const handleBlockIP = () => {
    if (!newBlockedIP) {
      toast({
        title: "Error",
        description: "Por favor ingresa una dirección IP",
        variant: "destructive",
      })
      return
    }

    if (blockedIPs.some((b) => b.ip === newBlockedIP)) {
      toast({
        title: "Error",
        description: "Esta IP ya está bloqueada",
        variant: "destructive",
      })
      return
    }

    const newBlocked: BlockedIP = {
      ip: newBlockedIP,
      reason: blockReason || "Bloqueada manualmente",
      blockedAt: new Date().toISOString(),
      blockCount: 1,
    }

    const updated = [...blockedIPs, newBlocked]
    setBlockedIPs(updated)
    localStorage.setItem("admin_blocked_ips", JSON.stringify(updated))
    setNewBlockedIP("")
    setBlockReason("")
    toast({
      title: "IP Bloqueada",
      description: `${newBlockedIP} ha sido bloqueada correctamente`,
    })
  }

  const handleUnblockIP = (ip: string) => {
    const updated = blockedIPs.filter((b) => b.ip !== ip)
    setBlockedIPs(updated)
    localStorage.setItem("admin_blocked_ips", JSON.stringify(updated))
    toast({
      title: "IP Desbloqueada",
      description: `${ip} ha sido desbloqueada correctamente`,
    })
  }

  const handleClearLogs = () => {
    setAuditLogs([])
    localStorage.removeItem("admin_audit_logs")
    toast({
      title: "Logs Eliminados",
      description: "Todos los logs de auditoría han sido eliminados",
    })
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
    toast({
      title: "Copiado",
      description: "IP copiada al portapapeles",
    })
  }

  const getEventTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      login: "Inicio de Sesión",
      logout: "Cierre de Sesión",
      failed_login: "Intento Fallido",
      password_change: "Cambio de Contraseña",
      email_change: "Cambio de Email",
      suspicious_activity: "Actividad Sospechosa",
    }
    return labels[type] || type
  }

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "login":
        return <LogIn className="h-4 w-4" />
      case "logout":
        return <LogOut className="h-4 w-4" />
      case "failed_login":
        return <AlertTriangle className="h-4 w-4" />
      case "password_change":
        return <Lock className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "login":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "logout":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "failed_login":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "password_change":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "suspicious_activity":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const filteredEvents = filterType === "all" 
    ? securityEvents 
    : securityEvents.filter((e) => e.type === filterType)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Shield className="h-8 w-8 text-blue-600" />
          Seguridad y Auditoría
        </h1>
        <p className="text-muted-foreground mt-2">Gestión completa de seguridad, sesiones y monitoreo</p>
      </div>

      {/* Security Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Estado General
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Seguro</div>
            <p className="text-xs text-muted-foreground mt-1">Sin alertas críticas</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              Intentos Fallidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {securityEvents.filter((e) => e.type === "failed_login").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Últimas 24 horas</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Globe className="h-4 w-4 text-blue-600" />
              Sesiones Activas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {securityEvents.filter((e) => e.type === "login").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Usuarios conectados</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Lock className="h-4 w-4 text-red-600" />
              IPs Bloqueadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{blockedIPs.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Direcciones bloqueadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="2fa" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="2fa">Verificación 2FA</TabsTrigger>
          <TabsTrigger value="events">Sesiones</TabsTrigger>
          <TabsTrigger value="audit">Auditoría</TabsTrigger>
          <TabsTrigger value="blocked">IPs Bloqueadas</TabsTrigger>
        </TabsList>

        {/* 2FA Tab */}
        <TabsContent value="2fa" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Autenticación de Dos Factores (2FA)
              </CardTitle>
              <CardDescription>
                Configura un código PIN de 6 dígitos para mayor seguridad al iniciar sesión
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 2FA Enable Toggle */}
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <Label className="font-medium">Habilitar Verificación de Dos Factores</Label>
                  <p className="text-sm text-muted-foreground">Se requerirá un PIN de 6 dígitos al iniciar sesión</p>
                </div>
                <Switch
                  checked={twoFAEnabled}
                  onCheckedChange={(checked) => {
                    setTwoFAEnabled(checked)
                    localStorage.setItem("admin_2fa_enabled", checked ? "true" : "false")
                    if (checked) {
                      toast({
                        title: "2FA Activado",
                        description: "Por favor ingresa tu código PIN de 6 dígitos",
                      })
                    } else {
                      setTwoFAPin("")
                      localStorage.removeItem("admin_2fa_pin")
                      toast({
                        title: "2FA Desactivado",
                        description: "La verificación de dos factores ha sido desactivada",
                      })
                    }
                  }}
                />
              </div>

              {/* PIN Setup */}
              {twoFAEnabled && (
                <div className="space-y-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor="twoFactorPin" className="font-medium">Configura tu PIN de 6 Dígitos</Label>
                    <div className="flex gap-2">
                      <Input
                        id="twoFactorPin"
                        type={showPin ? "text" : "password"}
                        placeholder="000000"
                        maxLength={6}
                        value={twoFAPin}
                        className="tracking-widest text-lg text-center font-bold"
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 6)
                          setTwoFAPin(value)
                          localStorage.setItem("admin_2fa_pin", value)
                        }}
                      />
                      <Button
                        variant="outline"
                        onClick={() => setShowPin(!showPin)}
                        className="px-3"
                      >
                        {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (twoFAPin.length === 6) {
                            toast({
                              title: "PIN Guardado",
                              description: "Tu PIN de 6 dígitos ha sido guardado correctamente. Se requerirá en el próximo login.",
                            })
                          } else {
                            toast({
                              title: "Error",
                              description: "El PIN debe tener exactamente 6 dígitos",
                              variant: "destructive",
                            })
                          }
                        }}
                      >
                        Guardar PIN
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      ⚠️ Guarda este PIN en un lugar seguro. Se te pedirá al iniciar sesión.
                    </p>
                  </div>

                  {/* PIN Status */}
                  {twoFAPin.length === 6 && (
                    <div className="p-3 bg-green-500/10 border border-green-500/30 rounded text-sm flex items-center gap-2 text-green-700">
                      <CheckCircle className="h-4 w-4" />
                      PIN configurado correctamente - 2FA activo
                    </div>
                  )}

                  {/* How it Works Info */}
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded">
                    <div className="flex gap-2">
                      <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <div className="text-blue-900">
                        <p className="font-medium">Como funciona</p>
                        <ul className="mt-2 space-y-1 text-xs">
                          <li>Activa esta opcion para habilitar 2FA</li>
                          <li>Ingresa un PIN de 6 digitos unico</li>
                          <li>Al iniciar sesion, se te pedira contrasena + PIN</li>
                          <li>Mayor seguridad para tu cuenta admin</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Events - Sessions Tab */}
        <TabsContent value="events" className="space-y-4 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold">Registro de Sesiones</h2>
              <p className="text-sm text-muted-foreground">Inicios de sesión y dispositivos conectados</p>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filterType === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("all")}
            >
              Todos
            </Button>
            <Button
              variant={filterType === "login" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("login")}
            >
              Inicios
            </Button>
            <Button
              variant={filterType === "logout" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("logout")}
            >
              Cierres
            </Button>
            <Button
              variant={filterType === "failed_login" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("failed_login")}
            >
              Intentos Fallidos
            </Button>
          </div>

          {/* Sessions List */}
          <div className="space-y-3">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        {/* Header with Type and Time */}
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`p-2 rounded-lg ${getEventTypeColor(event.type)}`}>
                            {getEventTypeIcon(event.type)}
                          </div>
                          <div>
                            <Badge className={getEventTypeColor(event.type)}>
                              {getEventTypeLabel(event.type)}
                            </Badge>
                            <span className="text-xs text-muted-foreground ml-2">
                              {new Date(event.timestamp).toLocaleString("es-ES")}
                            </span>
                          </div>
                        </div>

                        {/* User Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3 pb-3 border-b">
                          <div className="space-y-2">
                            <div className="text-xs text-muted-foreground font-semibold">USUARIO</div>
                            <div className="font-medium text-sm">{event.user}</div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-xs text-muted-foreground font-semibold">DURACIÓN</div>
                            <div className="font-medium text-sm">{event.duration || "-"}</div>
                          </div>
                        </div>

                        {/* Detailed Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                          {/* IP */}
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
                              <Globe className="h-3 w-3" /> IP
                            </div>
                            <div className="font-mono text-sm font-medium bg-secondary/50 p-2 rounded flex items-center justify-between">
                              <span>{event.ip}</span>
                              <button
                                onClick={() => copyToClipboard(event.ip, event.id)}
                                className="opacity-0 hover:opacity-100 transition-opacity"
                              >
                                {copied === event.id ? (
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Device */}
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
                              <Smartphone className="h-3 w-3" /> DISPOSITIVO
                            </div>
                            <div className="text-sm font-medium bg-secondary/50 p-2 rounded">
                              {event.device}
                            </div>
                          </div>

                          {/* Browser */}
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
                              <Monitor className="h-3 w-3" /> NAVEGADOR
                            </div>
                            <div className="text-sm font-medium bg-secondary/50 p-2 rounded">
                              {event.browser}
                            </div>
                          </div>

                          {/* OS */}
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground font-semibold">S.O.</div>
                            <div className="text-sm font-medium bg-secondary/50 p-2 rounded">
                              {event.os}
                            </div>
                          </div>

                          {/* Location */}
                          <div className="space-y-1 col-span-1 md:col-span-2 lg:col-span-2">
                            <div className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> UBICACIÓN
                            </div>
                            <div className="text-sm font-medium bg-secondary/50 p-2 rounded">
                              {event.location}
                            </div>
                          </div>

                          {/* Details */}
                          <div className="space-y-1 col-span-1 md:col-span-2 lg:col-span-2">
                            <div className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
                              <Clock className="h-3 w-3" /> DETALLES
                            </div>
                            <div className="text-sm bg-secondary/50 p-2 rounded">
                              {event.details}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  No hay eventos de seguridad registrados
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Audit Logs Tab */}
        <TabsContent value="audit" className="space-y-4 mt-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Registro de Auditoría</h2>
              <p className="text-sm text-muted-foreground">Historial de acciones administrativas</p>
            </div>
            <Button variant="destructive" onClick={handleClearLogs} size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Limpiar Logs
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-secondary">
                      <th className="text-left p-4 font-medium">Acción</th>
                      <th className="text-left p-4 font-medium">Usuario</th>
                      <th className="text-left p-4 font-medium">Email</th>
                      <th className="text-left p-4 font-medium">Hora</th>
                      <th className="text-left p-4 font-medium">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.length > 0 ? (
                      auditLogs.map((log) => (
                        <tr key={log.id} className="border-b hover:bg-secondary/50">
                          <td className="p-4 font-medium">{log.action}</td>
                          <td className="p-4">{log.user}</td>
                          <td className="p-4 text-muted-foreground text-xs">{log.email}</td>
                          <td className="p-4 text-xs whitespace-nowrap">
                            {new Date(log.timestamp).toLocaleString("es-ES")}
                          </td>
                          <td className="p-4">
                            <Badge
                              className={
                                log.status === "success"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : log.status === "warning"
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              }
                            >
                              {log.status === "success"
                                ? "Exitosa"
                                : log.status === "warning"
                                  ? "Advertencia"
                                  : "Error"}
                            </Badge>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-muted-foreground">
                          No hay logs de auditoría
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Blocked IPs Tab */}
        <TabsContent value="blocked" className="space-y-4 mt-6">
          <div>
            <h2 className="text-xl font-bold">Gestión de IPs Bloqueadas</h2>
            <p className="text-sm text-muted-foreground">Bloquea direcciones IP maliciosas o sospechosas</p>
          </div>

          {/* Add IP Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Bloquear Nueva IP</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="ip">Dirección IP</Label>
                <Input
                  id="ip"
                  placeholder="Ej: 192.168.1.1 o 203.0.113.45"
                  value={newBlockedIP}
                  onChange={(e) => setNewBlockedIP(e.target.value)}
                  className="font-mono"
                />
              </div>

              <div>
                <Label htmlFor="reason">Razón del Bloqueo (Opcional)</Label>
                <Input
                  id="reason"
                  placeholder="Ej: Múltiples intentos fallidos"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                />
              </div>

              <Button onClick={handleBlockIP} className="w-full">
                <Lock className="h-4 w-4 mr-2" />
                Bloquear IP
              </Button>
            </CardContent>
          </Card>

          {/* Blocked IPs List */}
          <div className="space-y-3">
            {blockedIPs.length > 0 ? (
              blockedIPs.map((blocked) => (
                <Card key={blocked.ip} className="overflow-hidden border-l-4 border-l-red-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Lock className="h-5 w-5 text-red-600" />
                          <div className="font-mono font-bold text-lg">{blocked.ip}</div>
                          <Badge variant="destructive">BLOQUEADA</Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                          <div>
                            <div className="text-xs text-muted-foreground font-semibold">RAZÓN</div>
                            <div className="text-sm mt-1">{blocked.reason}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground font-semibold">BLOQUEADA DESDE</div>
                            <div className="text-sm mt-1">
                              {new Date(blocked.blockedAt).toLocaleString("es-ES")}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground font-semibold">INTENTOS FALLIDOS</div>
                            <div className="text-sm font-bold text-red-600 mt-1">{blocked.blockCount}</div>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleUnblockIP(blocked.ip)}
                        className="ml-4"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Desbloquear
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-2 opacity-50" />
                  No hay IPs bloqueadas
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
