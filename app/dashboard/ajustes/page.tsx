'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSessionUser, type User, getTwoFactorStatus } from "@/lib/auth"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Settings, Moon, Sun, CheckCircle, Palette, Lock, Trash2 } from "lucide-react"
import { useTheme } from "next-themes"
import { TwoFactorModal } from "@/components/two-factor-modal"
import { ChangePasswordModal } from "@/components/change-password-modal"
import { ActiveSessionsModal } from "@/components/active-sessions-modal"

const IDIOMAS = [
  { code: 'es', nombre: 'Español', bandera: '🇪🇸', region: 'España' },
  { code: 'en', nombre: 'English', bandera: '🇺🇸', region: 'Estados Unidos' },
  { code: 'pt', nombre: 'Português', bandera: '🇧🇷', region: 'Brasil' },
  { code: 'fr', nombre: 'Français', bandera: '🇫🇷', region: 'Francia' },
  { code: 'de', nombre: 'Deutsch', bandera: '🇩🇪', region: 'Alemania' },
  { code: 'it', nombre: 'Italiano', bandera: '🇮🇹', region: 'Italia' },
  { code: 'ja', nombre: '日本語', bandera: '🇯🇵', region: 'Japón' },
  { code: 'zh', nombre: '中文', bandera: '🇨🇳', region: 'China' },
  { code: 'ru', nombre: 'Русский', bandera: '🇷🇺', region: 'Rusia' },
  { code: 'ar', nombre: 'العربية', bandera: '🇸🇦', region: 'Arabia Saudita' },
  { code: 'ko', nombre: '한국어', bandera: '🇰🇷', region: 'Corea del Sur' },
  { code: 'nl', nombre: 'Nederlands', bandera: '🇳🇱', region: 'Países Bajos' },
  { code: 'pl', nombre: 'Polski', bandera: '🇵🇱', region: 'Polonia' },
  { code: 'tr', nombre: 'Türkçe', bandera: '🇹🇷', region: 'Turquía' },
  { code: 'vi', nombre: 'Tiếng Việt', bandera: '🇻🇳', region: 'Vietnam' },
]

export default function AjustesPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [notificacionesActivas, setNotificacionesActivas] = useState(true)
  const [mensaje, setMensaje] = useState('')
  const [tipoMensaje, setTipoMensaje] = useState<'success' | 'error'>('success')
  const [modal2FAOpen, setModal2FAOpen] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false)
  const [activeSessionsModalOpen, setActiveSessionsModalOpen] = useState(false)
  const router = useRouter()
  const { theme, setTheme, resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
    const sessionUser = getSessionUser()
    if (!sessionUser) {
      router.push("/login")
      return
    }
    if (sessionUser.role === "admin") {
      router.push("/admin")
      return
    }
    setUser(sessionUser)

    // Cargar preferencias del usuario
    const notificacionesGuardadas = localStorage.getItem('cvvinvest_notificaciones') !== 'false'
    setNotificacionesActivas(notificacionesGuardadas)
    
    // Verificar si 2FA está habilitado
    const twoFactorStatus = getTwoFactorStatus(sessionUser.id)
    setTwoFactorEnabled(twoFactorStatus?.enabled || false)
    
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("cvvinvest_user")
    router.push("/")
  }

  const mostrarMensaje = (texto: string, tipo: 'success' | 'error' = 'success') => {
    setMensaje(texto)
    setTipoMensaje(tipo)
    setTimeout(() => setMensaje(''), 3000)
  }

  const cambiarTema = (nuevoTema: string) => {
    setTheme(nuevoTema)
    mostrarMensaje(
      `Tema cambiado a ${nuevoTema === 'dark' ? 'Oscuro' : nuevoTema === 'light' ? 'Claro' : 'Sistema'}`,
      'success'
    )
  }

  const toggleNotificaciones = (checked: boolean) => {
    localStorage.setItem('cvvinvest_notificaciones', checked.toString())
    setNotificacionesActivas(checked)
    mostrarMensaje(checked ? 'Notificaciones activadas' : 'Notificaciones desactivadas', 'success')
  }

  const handleCambiarContrasena = () => {
    setChangePasswordModalOpen(true)
  }

  const handleVerSesiones = () => {
    setActiveSessionsModalOpen(true)
  }

  const handle2FA = () => {
    setModal2FAOpen(true)
  }

  const handleEliminarCuenta = () => {
    const confirmar = window.confirm(
      '¿Estás seguro de que deseas eliminar tu cuenta? Esta acción es irreversible y perderás acceso a todas tus inversiones.'
    )
    if (confirmar) {
      mostrarMensaje('Funcionalidad de eliminación de cuenta próximamente', 'success')
    }
  }

  if (loading || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  const temaActualMostrado = theme || resolvedTheme || 'system'

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar user={user} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col">
        <DashboardHeader user={user} />
        <main className="flex-1 p-6 overflow-auto">
          <div className="space-y-6 max-w-4xl">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Settings className="h-8 w-8" />
                Ajustes
              </h1>
              <p className="text-muted-foreground mt-1">Personaliza tu experiencia en la plataforma</p>
            </div>

            {/* Mensaje de confirmación */}
            {mensaje && (
              <Alert className={tipoMensaje === 'success' ? "border-success/50 bg-success/5" : "border-destructive/50 bg-destructive/5"}>
                <CheckCircle className={tipoMensaje === 'success' ? "h-4 w-4 text-success" : "h-4 w-4 text-destructive"} />
                <AlertDescription>
                  <p className={tipoMensaje === 'success' ? "text-success" : "text-destructive"}>{mensaje}</p>
                </AlertDescription>
              </Alert>
            )}

            {/* Tema */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Tema de Interfaz
                </CardTitle>
                <CardDescription>Elige tu modo de visualización preferido</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Tema Claro */}
                  <button
                    onClick={() => cambiarTema('light')}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      temaActualMostrado === 'light'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/20">
                        <Sun className="h-6 w-6 text-yellow-500" />
                      </div>
                      <div className="text-center">
                        <p className="font-medium">Claro</p>
                        <p className="text-xs text-muted-foreground">Interfaz brillante</p>
                      </div>
                      {temaActualMostrado === 'light' && (
                        <CheckCircle className="h-5 w-5 text-success mt-2" />
                      )}
                    </div>
                  </button>

                  {/* Tema Oscuro */}
                  <button
                    onClick={() => cambiarTema('dark')}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      temaActualMostrado === 'dark'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/20">
                        <Moon className="h-6 w-6 text-blue-400" />
                      </div>
                      <div className="text-center">
                        <p className="font-medium">Oscuro</p>
                        <p className="text-xs text-muted-foreground">Interfaz oscura</p>
                      </div>
                      {temaActualMostrado === 'dark' && (
                        <CheckCircle className="h-5 w-5 text-success mt-2" />
                      )}
                    </div>
                  </button>

                  {/* Tema Sistema */}
                  <button
                    onClick={() => cambiarTema('system')}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      temaActualMostrado === 'system'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/20">
                        <Palette className="h-6 w-6 text-purple-500" />
                      </div>
                      <div className="text-center">
                        <p className="font-medium">Sistema</p>
                        <p className="text-xs text-muted-foreground">Auto según SO</p>
                      </div>
                      {temaActualMostrado === 'system' && (
                        <CheckCircle className="h-5 w-5 text-success mt-2" />
                      )}
                    </div>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Notificaciones */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Notificaciones</CardTitle>
                <CardDescription>Gestiona tus preferencias de notificaciones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <p className="font-medium">Notificaciones Push</p>
                      <p className="text-sm text-muted-foreground">Recibe alertas sobre transacciones e inversiones</p>
                    </div>
                    <Switch
                      checked={notificacionesActivas}
                      onCheckedChange={toggleNotificaciones}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Seguridad */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Seguridad
                </CardTitle>
                <CardDescription>Opciones de seguridad de tu cuenta</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleCambiarContrasena}
                  >
                    Cambiar Contraseña
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleVerSesiones}
                  >
                    Ver Sesiones Activas
                  </Button>
                  <Button 
                    variant={twoFactorEnabled ? "default" : "outline"} 
                    className="w-full justify-start"
                    onClick={handle2FA}
                  >
                    {twoFactorEnabled ? '✓ Autenticación de Dos Factores Activa' : 'Configurar Autenticación de Dos Factores'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Información de Cuenta */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Información de Cuenta</CardTitle>
                <CardDescription>Detalles de tu perfil</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nombre:</span>
                    <span className="font-medium">{user?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">{user?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Plan:</span>
                    <span className="font-medium capitalize">{user?.plan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Saldo:</span>
                    <span className="font-medium">${user?.balance.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Zona de Peligro */}
            <Card className="bg-card border-destructive/20">
              <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2">
                  <Trash2 className="h-5 w-5" />
                  Zona de Peligro
                </CardTitle>
                <CardDescription>Acciones irreversibles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={handleEliminarCuenta}
                  >
                    Eliminar Cuenta
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Modal 2FA */}
      {user && (
        <TwoFactorModal
          open={modal2FAOpen}
          onOpenChange={setModal2FAOpen}
          user={user}
        />
      )}

      {/* Modal Cambiar Contraseña */}
      {user && (
        <ChangePasswordModal
          open={changePasswordModalOpen}
          onOpenChange={setChangePasswordModalOpen}
          userEmail={user.email}
          onSuccess={(message) => mostrarMensaje(message, 'success')}
          onError={(message) => mostrarMensaje(message, 'error')}
        />
      )}

      {/* Modal Sesiones Activas */}
      {user && (
        <ActiveSessionsModal
          open={activeSessionsModalOpen}
          onOpenChange={setActiveSessionsModalOpen}
          userEmail={user.email}
        />
      )}
    </div>
  )
}
