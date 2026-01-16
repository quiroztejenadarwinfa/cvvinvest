"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/logo"
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react"
import { isAdmin, setSessionUser, type User, initializeSampleUsers } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { OAuthButtons } from "@/components/oauth-buttons"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showTwoFactor, setShowTwoFactor] = useState(false)
  const [twoFactorPin, setTwoFactorPin] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  // Inicializar usuarios de prueba al cargar la página
  useEffect(() => {
    initializeSampleUsers()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    console.log("🔐 Iniciando login con email:", email)

    // Simular delay de autenticación
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Verificar si es admin
    if (isAdmin(email, password)) {
      console.log("✅ Admin detectado")
      // Verificar si 2FA está habilitado
      const is2FAEnabled = localStorage.getItem("admin_2fa_enabled") === "true"
      
      if (is2FAEnabled && !showTwoFactor) {
        // Mostrar pantalla de 2FA
        setShowTwoFactor(true)
        setLoading(false)
        return
      }

      // Si 2FA está habilitado, verificar PIN
      if (is2FAEnabled && showTwoFactor) {
        const storedPin = localStorage.getItem("admin_2fa_pin")
        if (twoFactorPin !== storedPin) {
          setError("PIN incorrecto")
          setLoading(false)
          return
        }
      }

      const adminUser: User = {
        id: "admin-001",
        email: email,
        name: "Administrador",
        role: "admin",
        plan: "elite",
        balance: 0,
        createdAt: new Date(),
      }
      setSessionUser(adminUser)
      toast({
        title: "¡Bienvenido Administrador!",
        description: "Has iniciado sesión correctamente.",
      })
      router.push("/admin")
      return
    }

    // Verificar modo mantenimiento para usuarios
    const adminConfigStr = localStorage.getItem("admin_config")
    const adminConfig = adminConfigStr ? JSON.parse(adminConfigStr) : {}
    const isMaintenanceMode = adminConfig.maintenanceMode === true
    const allowedUsersInMaintenance = adminConfig.maintenanceAllowedUsers || []

    // Verificar usuario normal (simulado)
    const storedUsers = localStorage.getItem("cvvinvest_users")
    console.log("📦 Usuarios almacenados:", storedUsers)
    const users: User[] = storedUsers ? JSON.parse(storedUsers) : []
    console.log("👥 Lista de usuarios:", users)
    const user = users.find((u) => u.email === email)
    console.log("🔍 Usuario encontrado:", user)

    if (user) {
      // Validar contraseña
      const storedPasswords = localStorage.getItem("cvvinvest_passwords")
      const passwords: Record<string, string> = storedPasswords ? JSON.parse(storedPasswords) : {}
      console.log("🔑 Contraseñas disponibles:", Object.keys(passwords))
      
      if (passwords[email] !== password) {
        console.log("❌ Contraseña incorrecta. Esperaba:", passwords[email], "Recibí:", password)
        setError("Credenciales incorrectas. Verifica tu email y contraseña.")
        setLoading(false)
        return
      }

      console.log("✅ Contraseña correcta")

      // Si hay mantenimiento y el usuario no está en la lista permitida
      if (isMaintenanceMode && !allowedUsersInMaintenance.includes(email)) {
        setError("La plataforma está en modo de mantenimiento. Por favor intenta más tarde.")
        setLoading(false)
        return
      }

      // Verificar si 2FA está habilitado para el usuario
      const userSecurityKey = `user_security_${user.id}`
      const userSecurityConfig = localStorage.getItem(userSecurityKey)
      let user2FAEnabled = false
      
      if (userSecurityConfig) {
        const config = JSON.parse(userSecurityConfig)
        user2FAEnabled = config.twoFactorEnabled === true
      }

      if (user2FAEnabled && !showTwoFactor) {
        // Mostrar pantalla de 2FA
        setShowTwoFactor(true)
        setLoading(false)
        return
      }

      // Si 2FA está habilitado para usuario, verificar PIN
      if (user2FAEnabled && showTwoFactor) {
        const userSecurityConfig = localStorage.getItem(userSecurityKey)
        if (!userSecurityConfig) {
          setError("Error al verificar 2FA")
          setLoading(false)
          return
        }
        const config = JSON.parse(userSecurityConfig)
        if (twoFactorPin !== config.twoFactorPin) {
          setError("PIN incorrecto")
          setLoading(false)
          return
        }
      }

      setSessionUser(user)
      toast({
        title: `¡Bienvenido, ${user.name}!`,
        description: `Iniciaste sesión con: ${user.email} | Plan: ${user.plan.toUpperCase()}`,
      })
      router.push("/dashboard")
    } else {
      setError("Credenciales incorrectas. Verifica tu email y contraseña.")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Logo size="lg" />
          </Link>
          <h1 className="text-2xl font-bold mt-6 mb-2">INICIAR SESIÓN</h1>
          <p className="text-muted-foreground">Accede a tu cuenta de inversión</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium uppercase">
                Correo Electrónico
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  className="pl-10 h-12 bg-secondary border-border"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium uppercase">
                Contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-12 bg-secondary border-border"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* 2FA PIN Input */}
            {showTwoFactor && (
              <div className="space-y-2 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <Label htmlFor="twoFactorPin" className="text-sm font-medium uppercase">
                  PIN de Autenticación de Dos Factores
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="twoFactorPin"
                    type="password"
                    placeholder="000000"
                    maxLength={6}
                    pattern="[0-9]{6}"
                    className="pl-10 h-12 bg-secondary border-border tracking-widest text-lg text-center font-bold"
                    value={twoFactorPin}
                    onChange={(e) => {
                      if (/^\d{0,6}$/.test(e.target.value)) {
                        setTwoFactorPin(e.target.value)
                      }
                    }}
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">Ingresa el código de 6 dígitos de tu autenticador</p>
              </div>
            )}

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-border" />
                <span className="text-muted-foreground">Recuérdame en este dispositivo</span>
              </label>
              <Link href="/recuperar-password" className="text-primary hover:underline">
                Olvidé mi contraseña
              </Link>
            </div>

            {showTwoFactor && (
              <Button
                type="button"
                variant="outline"
                className="w-full h-12"
                onClick={() => {
                  setShowTwoFactor(false)
                  setTwoFactorPin("")
                  setError("")
                }}
              >
                Atrás
              </Button>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? "Verificando..." : showTwoFactor ? "Verificar PIN" : "Iniciar Sesión"}
            </Button>

            {!showTwoFactor && (
              <>
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">O continúa con</span>
                  </div>
                </div>

                <OAuthButtons />
              </>
            )}
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">¿No tienes cuenta? </span>
            <Link href="/registro" className="text-primary hover:underline font-medium">
              Registrarse
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
