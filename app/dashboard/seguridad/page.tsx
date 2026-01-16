"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, Lock, Shield, Smartphone, Monitor } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getSessionUser } from "@/lib/auth"

interface UserSecurityConfig {
  twoFactorEnabled: boolean
  twoFactorPin: string
  lastLogin?: string
}

export default function UserSecurityPage() {
  const [user, setUser] = useState(getSessionUser())
  const [config, setConfig] = useState<UserSecurityConfig>({
    twoFactorEnabled: false,
    twoFactorPin: "",
  })
  const [newPin, setNewPin] = useState("")
  const [pinSaved, setPinSaved] = useState(false)
  const [showPin, setShowPin] = useState(false)
  const [deviceInfo, setDeviceInfo] = useState<any>(null)
  const [otherDevices, setOtherDevices] = useState<any[]>([])
  const { toast } = useToast()

  useEffect(() => {
    // Cargar configuración de seguridad del usuario
    const userKey = `user_security_${user?.id}`
    const savedConfig = localStorage.getItem(userKey)
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig))
    }

    // Obtener información del dispositivo actual
    const sessions = JSON.parse(localStorage.getItem("user_sessions") || "[]")
    const currentSession = {
      id: `session_${Date.now()}`,
      device: navigator.userAgent.includes("Windows") ? "Windows" : navigator.userAgent.includes("Mac") ? "Mac" : navigator.userAgent.includes("Linux") ? "Linux" : "Dispositivo desconocido",
      browser: navigator.userAgent.includes("Chrome") ? "Chrome" : navigator.userAgent.includes("Firefox") ? "Firefox" : navigator.userAgent.includes("Safari") ? "Safari" : "Navegador desconocido",
      ip: "192.168.100.68",
      timestamp: new Date().toISOString(),
      active: true
    }

    // Guardar sesión actual
    const updatedSessions = [currentSession, ...sessions.filter((s: any) => s.id !== currentSession.id).slice(0, 4)]
    localStorage.setItem("user_sessions", JSON.stringify(updatedSessions))

    // Obtener dispositivos únicos (sin duplicados)
    const uniqueOtherDevices = updatedSessions.slice(1).filter((device: any, index: number, self: any[]) =>
      index === self.findIndex((d: any) => d.device === device.device && d.browser === device.browser && d.ip === device.ip)
    )

    setDeviceInfo(currentSession)
    setOtherDevices(uniqueOtherDevices)
  }, [user])

  const handleToggle2FA = (enabled: boolean) => {
    if (!enabled && config.twoFactorPin) {
      // Si se desactiva 2FA, limpiar PIN
      const updatedConfig = {
        ...config,
        twoFactorEnabled: false,
        twoFactorPin: "",
      }
      setConfig(updatedConfig)
      const userKey = `user_security_${user?.id}`
      localStorage.setItem(userKey, JSON.stringify(updatedConfig))
      setPinSaved(false)
      setNewPin("")
      toast({
        title: "2FA desactivado",
        description: "La autenticación de dos factores ha sido desactivada.",
      })
    } else {
      setConfig({
        ...config,
        twoFactorEnabled: enabled,
      })
    }
  }

  const handleSavePin = () => {
    if (!newPin || newPin.length !== 6 || !/^\d+$/.test(newPin)) {
      toast({
        title: "PIN inválido",
        description: "El PIN debe contener exactamente 6 dígitos.",
        variant: "destructive",
      })
      return
    }

    const updatedConfig = {
      ...config,
      twoFactorPin: newPin,
      twoFactorEnabled: true,
    }
    setConfig(updatedConfig)
    const userKey = `user_security_${user?.id}`
    localStorage.setItem(userKey, JSON.stringify(updatedConfig))
    setPinSaved(true)
    toast({
      title: "PIN guardado",
      description: "Tu PIN de 2FA ha sido guardado correctamente.",
    })
  }

  const handleChangePin = () => {
    setPinSaved(false)
    setNewPin("")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Shield className="w-8 h-8" />
          Configuración de Seguridad
        </h1>
        <p className="text-muted-foreground mt-2">
          Gestiona tu autenticación de dos factores y opciones de seguridad
        </p>
      </div>

      <Tabs defaultValue="2fa" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="2fa">Verificación 2FA</TabsTrigger>
          <TabsTrigger value="sesiones">Sesiones Activas</TabsTrigger>
        </TabsList>

        {/* 2FA Configuration */}
        <TabsContent value="2fa" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Autenticación de Dos Factores</CardTitle>
              <CardDescription>
                Protege tu cuenta requiriendo un código PIN adicional al iniciar sesión
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 2FA Toggle */}
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5" />
                  <div>
                    <p className="font-medium">Habilitar 2FA con PIN</p>
                    <p className="text-sm text-muted-foreground">
                      {config.twoFactorEnabled
                        ? "Habilitado - Se requiere PIN en el inicio de sesión"
                        : "Deshabilitado - No se requiere PIN"}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={config.twoFactorEnabled}
                  onCheckedChange={handleToggle2FA}
                />
              </div>

              {/* PIN Configuration */}
              {config.twoFactorEnabled && (
                <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div>
                    <Label htmlFor="pin-input" className="text-base font-medium">
                      Código PIN (6 dígitos)
                    </Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Este PIN será requerido cada vez que inicies sesión
                    </p>
                  </div>

                  {!pinSaved ? (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Input
                          id="pin-input"
                          type={showPin ? "text" : "password"}
                          placeholder="000000"
                          maxLength={6}
                          value={newPin}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "").slice(0, 6)
                            setNewPin(value)
                          }}
                          className="font-mono text-lg tracking-widest"
                        />
                        <Button
                          variant="outline"
                          onClick={() => setShowPin(!showPin)}
                          className="px-3"
                        >
                          {showPin ? "Ocultar" : "Mostrar"}
                        </Button>
                      </div>
                      <Button
                        onClick={handleSavePin}
                        className="w-full"
                        disabled={newPin.length !== 6}
                      >
                        Guardar PIN
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 p-3 bg-green-100 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded text-green-800 dark:text-green-200">
                        <CheckCircle className="w-5 h-5" />
                        <span>PIN configurado correctamente</span>
                      </div>
                      <Button
                        variant="outline"
                        onClick={handleChangePin}
                        className="w-full"
                      >
                        Cambiar PIN
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Information Box */}
              <div className="p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800 dark:text-amber-200">
                  <p className="font-medium mb-1">Importante:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Memoriza bien tu PIN de 6 dígitos</li>
                    <li>No compartas tu PIN con nadie</li>
                    <li>Usa un PIN único que no uses en otras cuentas</li>
                    <li>Una vez habilitado, será obligatorio en cada inicio de sesión</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Active Sessions */}
        <TabsContent value="sesiones" className="space-y-4 mt-6">
          {deviceInfo && (
            <>
              {/* Dispositivo Actual */}
              <Card className="bg-gradient-to-br from-green-900 to-green-800 border-green-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Smartphone className="w-5 h-5" />
                    Dispositivo Actual
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-green-200">Sistema Operativo</p>
                      <p className="text-lg font-semibold text-white">{deviceInfo?.device}</p>
                    </div>
                    <div>
                      <p className="text-sm text-green-200">Navegador</p>
                      <p className="text-lg font-semibold text-white">{deviceInfo?.browser}</p>
                    </div>
                    <div>
                      <p className="text-sm text-green-200">Dirección IP</p>
                      <p className="text-lg font-semibold text-white">{deviceInfo?.ip}</p>
                    </div>
                    <div>
                      <p className="text-sm text-green-200">Última Conexión</p>
                      <p className="text-lg font-semibold text-white">
                        {deviceInfo?.timestamp ? new Date(deviceInfo.timestamp).toLocaleString("es-ES") : "Ahora"}
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-green-700/50">
                    <Badge className="bg-green-600 text-green-100">✓ Activo Ahora</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Resumen */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="w-5 h-5" />
                    Resumen de Dispositivos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 dark:text-slate-300">Dispositivos activos</span>
                      <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{1 + otherDevices.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 dark:text-slate-300">Últimas 24 horas</span>
                      <span className="text-lg font-semibold text-green-600 dark:text-green-400">{otherDevices.length}</span>
                    </div>
                    <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {otherDevices.length > 0 ? "Hay accesos de otros dispositivos" : "Solo tu dispositivo actual"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Otros Dispositivos */}
              {otherDevices.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold mb-4">Otros Dispositivos Conectados</h3>
                  <div className="space-y-3">
                    {otherDevices.map((device, index) => (
                      <Card key={device.id || index}>
                        <CardContent className="pt-6">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-sm text-slate-500 dark:text-slate-400">Dispositivo</p>
                              <p className="font-semibold">{device.device}</p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-500 dark:text-slate-400">Navegador</p>
                              <p className="font-semibold">{device.browser}</p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-500 dark:text-slate-400">IP</p>
                              <p className="font-semibold">{device.ip}</p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-500 dark:text-slate-400">Última Conexión</p>
                              <p className="font-semibold">
                                {device.timestamp ? new Date(device.timestamp).toLocaleString("es-ES") : "Sin datos"}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
