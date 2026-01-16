"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Settings, Save, Mail, Bell, AlertTriangle, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SystemConfig {
  minDeposit: number
  maxDeposit: number
  minWithdrawal: number
  maxWithdrawal: number
  maintenanceMode: boolean
  maintenanceAllowedUsers: string[]
  emailNotifications: boolean
  pushNotifications: boolean
  twoFactorEnabled: boolean
  autoApproveDeposits: boolean
  maxFailedLogins: number
  sessionTimeout: number
  platformEmail: string
  platformPhone: string
  twoFactorPin: string
  twoFactorEnabled2: boolean
}

const defaultConfig: SystemConfig = {
  minDeposit: 100,
  maxDeposit: 50000,
  minWithdrawal: 50,
  maxWithdrawal: 10000,
  maintenanceMode: false,
  maintenanceAllowedUsers: [],
  emailNotifications: true,
  pushNotifications: true,
  twoFactorEnabled: false,
  autoApproveDeposits: false,
  maxFailedLogins: 5,
  sessionTimeout: 30,
  platformEmail: "noreply@cvvinvest.com",
  platformPhone: "No disponible temporalmente",
  twoFactorPin: "",
  twoFactorEnabled2: false,
}

export default function ConfiguracionPage() {
  const [config, setConfig] = useState<SystemConfig>(defaultConfig)
  const [hasChanges, setHasChanges] = useState(false)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const stored = localStorage.getItem("admin_config")
    if (stored) {
      const parsedConfig = JSON.parse(stored)
      // Asegurar que maintenanceAllowedUsers siempre sea un array
      if (!parsedConfig.maintenanceAllowedUsers) {
        parsedConfig.maintenanceAllowedUsers = []
      }
      setConfig(parsedConfig)
    }
    setLoading(false)
  }, [])

  const handleConfigChange = (key: keyof SystemConfig, value: any) => {
    const updatedConfig = { ...config, [key]: value }
    setConfig(updatedConfig)
    setHasChanges(true)
    
    // Auto-guardar si es modo mantenimiento para que funcione inmediatamente
    if (key === "maintenanceMode") {
      localStorage.setItem("admin_config", JSON.stringify(updatedConfig))
      toast({
        title: "Modo Mantenimiento Actualizado",
        description: value === true 
          ? "Plataforma en mantenimiento" 
          : "Plataforma en línea",
      })
    }
  }

  const handleSaveConfig = () => {
    if (config.minDeposit >= config.maxDeposit) {
      toast({
        title: "Error",
        description: "El depósito mínimo debe ser menor que el máximo",
        variant: "destructive",
      })
      return
    }

    if (config.minWithdrawal >= config.maxWithdrawal) {
      toast({
        title: "Error",
        description: "El retiro mínimo debe ser menor que el máximo",
        variant: "destructive",
      })
      return
    }

    localStorage.setItem("admin_config", JSON.stringify(config))
    setHasChanges(false)
    toast({
      title: "Configuración Guardada",
      description: "Los cambios han sido guardados correctamente",
    })
  }

  const handleResetConfig = () => {
    setConfig(defaultConfig)
    setHasChanges(true)
    toast({
      title: "Configuración Reiniciada",
      description: "Se han restaurado los valores por defecto",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando configuración...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="h-8 w-8" />
            Configuración del Sistema
          </h1>
          <p className="text-muted-foreground mt-1">Administra los parámetros generales de la plataforma</p>
        </div>
        {hasChanges && (
          <Button onClick={handleSaveConfig} className="gap-2">
            <Save className="h-4 w-4" />
            Guardar Cambios
          </Button>
        )}
      </div>

      {config.maintenanceMode && (
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-500/10">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
            <div>
              <div className="font-bold text-yellow-900">Modo de Mantenimiento Activo</div>
              <p className="text-sm text-yellow-700">La plataforma no está disponible para los usuarios</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="general" className="w-full">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="mantenimiento">Mantenimiento</TabsTrigger>
          <TabsTrigger value="notificaciones">Notificaciones</TabsTrigger>
          <TabsTrigger value="seguridad">Seguridad</TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración General</CardTitle>
              <CardDescription>Parámetros básicos de la plataforma</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="platformEmail">Email de la Plataforma</Label>
                <Input
                  id="platformEmail"
                  type="email"
                  value={config.platformEmail}
                  onChange={(e) => handleConfigChange("platformEmail", e.target.value)}
                  placeholder="noreply@cvvinvest.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="platformPhone">Número no disponible temporalmente</Label>
                <Input
                  id="platformPhone"
                  value={config.platformPhone}
                  onChange={(e) => handleConfigChange("platformPhone", e.target.value)}
                  placeholder="No disponible temporalmente"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Maintenance Tab */}
        <TabsContent value="mantenimiento" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Modo de Mantenimiento</CardTitle>
              <CardDescription>Controla el acceso a la plataforma durante mantenimiento</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-blue-50 dark:bg-blue-950">
                <div className="flex-1">
                  <Label htmlFor="maintenance-toggle" className="font-medium text-base">
                    Activar Modo de Mantenimiento
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {config.maintenanceMode 
                      ? "Plataforma en mantenimiento - Solo admin puede acceder" 
                      : "Plataforma operativa - Todos pueden acceder"}
                  </p>
                </div>
                <Switch
                  id="maintenance-toggle"
                  checked={config.maintenanceMode}
                  onCheckedChange={(v) => handleConfigChange("maintenanceMode", v)}
                />
              </div>

              {config.maintenanceMode && (
                <MaintenanceUsersList config={config} onConfigChange={handleConfigChange} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notificaciones Tab */}
        <TabsContent value="notificaciones" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Canales de Notificación
              </CardTitle>
              <CardDescription>Configura cómo se notifica a usuarios y admin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <Label htmlFor="emailNotif" className="font-medium">
                    Notificaciones por Email
                  </Label>
                  <p className="text-sm text-muted-foreground">Enviar emails para cambios importantes</p>
                </div>
                <Switch
                  id="emailNotif"
                  checked={config.emailNotifications}
                  onCheckedChange={(v) => handleConfigChange("emailNotifications", v)}
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <Label htmlFor="pushNotif" className="font-medium flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    Notificaciones Push
                  </Label>
                  <p className="text-sm text-muted-foreground">Notificaciones en la plataforma</p>
                </div>
                <Switch
                  id="pushNotif"
                  checked={config.pushNotifications}
                  onCheckedChange={(v) => handleConfigChange("pushNotifications", v)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Seguridad Tab */}
        <TabsContent value="seguridad" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Parámetros de Seguridad</CardTitle>
              <CardDescription>Configurar reglas de seguridad y autenticación</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="maxFailedLogins">Intentos de Login Fallidos Máximos</Label>
                <Input
                  id="maxFailedLogins"
                  type="number"
                  value={config.maxFailedLogins}
                  onChange={(e) => handleConfigChange("maxFailedLogins", Number(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">Después bloquear IP temporalmente</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Timeout de Sesión (minutos)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={config.sessionTimeout}
                  onChange={(e) => handleConfigChange("sessionTimeout", Number(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">Cerrar sesión inactiva después de X minutos</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {hasChanges && (
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={handleResetConfig}>
            Restaurar Valores Predeterminados
          </Button>
          <Button onClick={handleSaveConfig} className="gap-2">
            <Save className="h-4 w-4" />
            Guardar Configuración
          </Button>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Resumen de Configuración Actual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Modo Mantenimiento:</span>
              <span className="ml-2 font-medium">
                {config.maintenanceMode ? "Activo" : "Inactivo"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Timeout Sesión:</span>
              <span className="ml-2 font-medium">{config.sessionTimeout} minutos</span>
            </div>
            <div>
              <span className="text-muted-foreground">Max Intentos Fallidos:</span>
              <span className="ml-2 font-medium">{config.maxFailedLogins}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function MaintenanceUsersList({
  config,
  onConfigChange,
}: {
  config: SystemConfig
  onConfigChange: (key: keyof SystemConfig, value: any) => void
}) {
  const [allUsers, setAllUsers] = useState<any[]>([])
  const [newEmail, setNewEmail] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    const storedUsers = localStorage.getItem("cvvinvest_users")
    if (storedUsers) {
      setAllUsers(JSON.parse(storedUsers))
    }
  }, [])

  const toggleUserAccess = (email: string) => {
    const updated = config.maintenanceAllowedUsers.includes(email)
      ? config.maintenanceAllowedUsers.filter((e) => e !== email)
      : [...config.maintenanceAllowedUsers, email]
    const newConfig = { ...config, maintenanceAllowedUsers: updated }
    onConfigChange("maintenanceAllowedUsers", updated)
    // Guardar inmediatamente
    localStorage.setItem("admin_config", JSON.stringify(newConfig))
  }

  const handleAddEmail = () => {
    if (!newEmail || !newEmail.includes("@")) {
      toast({
        title: "Email inválido",
        description: "Por favor ingresa un email válido",
        variant: "destructive",
      })
      return
    }

    if (config.maintenanceAllowedUsers.includes(newEmail)) {
      toast({
        title: "Email duplicado",
        description: "Este email ya está en la lista",
        variant: "destructive",
      })
      return
    }

    const updated = [...config.maintenanceAllowedUsers, newEmail]
    const newConfig = { ...config, maintenanceAllowedUsers: updated }
    onConfigChange("maintenanceAllowedUsers", updated)
    localStorage.setItem("admin_config", JSON.stringify(newConfig))
    setNewEmail("")
    toast({
      title: "Usuario agregado",
      description: `${newEmail} puede acceder durante mantenimiento`,
    })
  }

  const handleRemoveEmail = (email: string) => {
    const updated = config.maintenanceAllowedUsers.filter((e) => e !== email)
    const newConfig = { ...config, maintenanceAllowedUsers: updated }
    onConfigChange("maintenanceAllowedUsers", updated)
    // Guardar inmediatamente
    localStorage.setItem("admin_config", JSON.stringify(newConfig))
  }

  return (
    <Card className="bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
      <CardHeader>
        <CardTitle className="text-base">Usuarios Permitidos Durante Mantenimiento</CardTitle>
        <CardDescription>Selecciona qué usuarios pueden acceder mientras está en mantenimiento</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="usuario@ejemplo.com"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            type="email"
          />
          <Button onClick={handleAddEmail}>Agregar</Button>
        </div>

        <div>
          <p className="text-sm font-medium mb-3">Usuarios Registrados:</p>
          <div className="space-y-2 max-h-64 overflow-y-auto border border-border rounded-lg p-3">
            {allUsers.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No hay usuarios registrados
              </p>
            ) : (
              allUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-3 p-2 hover:bg-muted rounded">
                  <input
                    type="checkbox"
                    id={`user-${user.id}`}
                    checked={config.maintenanceAllowedUsers.includes(user.email)}
                    onChange={() => toggleUserAccess(user.email)}
                    className="rounded"
                  />
                  <label htmlFor={`user-${user.id}`} className="flex-1 cursor-pointer text-sm">
                    <div className="font-medium">{user.name || user.email}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </label>
                </div>
              ))
            )}
          </div>
        </div>

        {config.maintenanceAllowedUsers && config.maintenanceAllowedUsers.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">Usuarios con Acceso:</p>
            <div className="space-y-2">
              {config.maintenanceAllowedUsers.map((email) => (
                <div
                  key={email}
                  className="flex items-center justify-between p-2 bg-green-100 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded text-sm"
                >
                  <span className="text-green-900 dark:text-green-100">{email}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveEmail(email)}
                    className="h-6 w-6 p-0 hover:bg-green-200 dark:hover:bg-green-900"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
